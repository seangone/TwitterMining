package com.twittermining.app

import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.twitter.TwitterUtils
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import com.mongodb.spark._
import com.mongodb.spark.config.WriteConfig
import org.bson.Document
import twitter4j.Status
import org.apache.spark.graphx._


object TwitterMining extends App {

  // You can find all functions used to process the stream in the
  // Utils.scala source file, whose contents we import here
  import Utils._

  // First, let's configure Spark
  val sparkConfiguration = new SparkConf().
    setAppName("spark-twitter-stream-example").
    setMaster(sys.env.get("spark.master").getOrElse("local[*]"))
  val sparkContext = new SparkContext(sparkConfiguration)
  val streamingContext = new StreamingContext(sparkContext, Seconds(10))

  // initialize the inital graph
  var RelationsG = Graph.fromEdges(sparkContext.parallelize(Array(Edge(0L, 0L, 0L))), 0L)

  // Creating a stream from Twitter
  val topicName = "Trump"
  val filters = Array("Trump")
  val tweets: DStream[Status] = TwitterUtils.createStream(streamingContext, None, filters)

  // construct edges
  val retweetRelations = tweets.filter(_.isRetweet)
    .map( t =>
      (t.getUser.getId, t.getRetweetedStatus.getUser.getId, t.getId, t.getText, t.getCreatedAt)
    )
  val retweetRelationDocs = retweetRelations.map{ t =>
    new Document()
      .append("srcId", t._1)
      .append("dstId", t._2)
      .append("tweetId", t._3)
      .append("text", t._4)
      .append("createdAt", t._5)
  }.foreachRDD(rdd => {
    rdd.saveToMongoDB(WriteConfig(Map("uri" -> "mongodb://127.0.0.1:27017/tm.retweets")))
  })

  // To compute the sentiment of a tweet we'll use different set of words used to
  // filter and score each word of a sentence. Since these lists are pretty small
  // it can be worthwhile to broadcast those across the cluster so that every
  // executor can access them locally
  val uselessWords = sparkContext.broadcast(load("/stop-words.dat"))
  val positiveWords = sparkContext.broadcast(load("/pos-words.dat"))
  val negativeWords = sparkContext.broadcast(load("/neg-words.dat"))

  // Let's extract the words of each tweet
  // We'll carry the tweet along in order to print it in the end
  val textAndSentences: DStream[(TweetText, Sentence)] =
  tweets.
    map(_.getText).
    map(tweetText => (tweetText, wordsOf(tweetText)))

  // Apply several transformations that allow us to keep just meaningful sentences
  val textAndMeaningfulSentences: DStream[(TweetText, Sentence)] =
    textAndSentences.
      mapValues(toLowercase).
      mapValues(keepActualWords).
      mapValues(words => keepMeaningfulWords(words, uselessWords.value)).
      filter { case (_, sentence) => sentence.length > 0 }

  // Compute the score of each sentence and keep only the non-neutral ones
  val textAndNonNeutralScore: DStream[(TweetText, Int)] =
    textAndMeaningfulSentences.
      mapValues(sentence => computeScore(sentence, positiveWords.value, negativeWords.value)).
      filter { case (_, score) => score != 0 }
  val Scores = textAndNonNeutralScore.map(_._2)
  Scores.cache()

  // Transform the (tweet, score) pair into a readable string and print it
  Scores.foreachRDD( (rdd, time) => {
    val positive = rdd.filter(_>0).reduce{case (s1, s2) => s1 + s2}
    val negative = rdd.filter(_<0).reduce{case (s1, s2) => s1 + s2}
    val pratio = positive.toDouble / (positive - negative).toDouble
    val nratio = 1.0 - pratio
    val oneDoc = new Document()
    oneDoc.append("time", time.milliseconds.toLong)
      .append("topicName", topicName)
      .append("positive", positive)
      .append("negative", negative)
      .append("pratio", pratio)
      .append("nratio", nratio)
    val sparkDoc = sparkContext.parallelize(Seq(oneDoc))
    sparkDoc.saveToMongoDB(WriteConfig(Map("uri" -> "mongodb://127.0.0.1:27017/tm.sentiments")))
  })

  textAndNonNeutralScore.map(makeReadable).print(5)

  // Now that the streaming is defined, start it
  streamingContext.start()

  // Let's await the stream to end - forever
  streamingContext.awaitTermination()

}
