package com.seangone.twittermining;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@CacheConfig(cacheNames = "sentiment")
public class SentimentService {
  private final SentimentRepository r;

  @Autowired
  private TopicService st;

  private static final Logger logger = LoggerFactory.getLogger(SentimentService.class);

  @Autowired
  public SentimentService(SentimentRepository r) {
    this.r = r;
  }

  @Cacheable(value = "sentiment", key = "#topic", condition = "#allowCache")
  public Mono<Sentiment> getLatestSentimentByTopic(String topic, boolean allowCache) {
    logger.info("Use Repository in sentiment when getLatestSentimentByTopic({})", topic);
    return r.findTopByTopicOrderByTimestampDesc(topic);
  }

  @Cacheable(value = "sentiment", condition = "#allowCache")
  public Flux<Sentiment> getLatestSentiments(boolean allowCache) {
    logger.info("Use Repository in sentiment when getLatestSentiments()");
    Flux<Topic> alltopics = st.findAll(true);
    Flux<Sentiment> latestsentimentsofalltopics = alltopics
        .flatMap(topic -> r.findTopByTopicOrderByTimestampDesc( topic.get_id() ));
    return latestsentimentsofalltopics;
  }

  @CacheEvict(value = "sentiment", allEntries = true)
  public Mono<Boolean> clearCaches(){
    return Mono.just(true);
  }


  public Flux<Sentiment> getStreamSentiments(Long intervalMS) {
    return Flux
        .interval(Duration.ofMillis(intervalMS))
        .flatMap( seq -> getLatestSentiments(true));
  }

  public Flux<Sentiment> getStreamSentimentByTopic(
      String topic_id, Long intervalMS) {
     return Flux
         .interval(Duration.ofMillis(intervalMS))
         .flatMap( seq -> getLatestSentimentByTopic(topic_id, true));
  }

}
