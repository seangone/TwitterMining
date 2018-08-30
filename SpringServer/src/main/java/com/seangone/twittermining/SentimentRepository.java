package com.seangone.twittermining;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Repository
public interface SentimentRepository extends ReactiveMongoRepository<Sentiment, String> {
  Mono<Sentiment> findTopByTopicOrderByTimestampDesc(String topic);
  Mono<Sentiment> findTopByOrderByTimestampDesc(); // latest timestamp of all
  Flux<Sentiment> findAllByTimestamp(Double timestamp);
  Flux<Sentiment> findAllByTimestampAndTopic(Double timestamp, String topic);
}
