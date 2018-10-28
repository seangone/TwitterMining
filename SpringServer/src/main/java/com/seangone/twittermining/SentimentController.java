package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/sentiments")
public class SentimentController {
  @Autowired
  private SentimentService s;

  @GetMapping(value = "/randomNumbers")
  public Flux<ServerSentEvent<Integer>> randomNumbers() {
    return Flux.interval(Duration.ofSeconds(1))
        .map(seq -> Tuples.of(seq, ThreadLocalRandom.current().nextInt()))
        .map(data -> ServerSentEvent.<Integer>builder()
            .event("random")
            .id(Long.toString(data.getT1()))
            .data(data.getT2())
            .build());
  }

  @GetMapping
  public Flux<Sentiment> getLatestSentiments(
      @RequestParam(name = "allowCache", defaultValue = "true") Boolean allowCache) {
    return s.getLatestSentiments(allowCache);
  }

  @GetMapping(value = "/{topic_id}")
  public Mono<Sentiment> getLatestSentimentByTopic(
      @PathVariable("topic_id") String topic_id,
      @RequestParam(name = "allowCache", defaultValue = "true") Boolean allowCache) {
    return s.getLatestSentimentByTopic(topic_id, allowCache);
  }

  @GetMapping(value = "/stream")
  public Flux<ServerSentEvent<Sentiment>> getStreamSentiments() {
    return s.getStreamSentiments((long)1000)
        .map( data -> ServerSentEvent.<Sentiment>builder()
            .event("sentiments_all")
            .data(data)
            .build() );
  }

  @GetMapping(value = "/{topic_id}/stream")
  public Flux<ServerSentEvent<Sentiment>> getStreamSentimentByTopic(
      @PathVariable("topic_id") String topic_id) {
    return s.getStreamSentimentByTopic(topic_id, (long)1000)
        .map( data -> ServerSentEvent.<Sentiment>builder()
            .event("sentiments_" + topic_id)
            .data(data)
            .build() );
  }

  @GetMapping(value = "/clearCache")
  public Mono<Boolean> clearCache() {
    return s.clearCaches();
  }

}
