package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "/api/sentiments")
public class SentimentController {
  @Autowired
  private SentimentService s;

  @GetMapping(value = "/{id}")
  public Mono<Sentiment> findScoreById(@PathVariable("id") String _id) {
    return null;
  }

  @GetMapping
  public Flux<Sentiment> findScoresByTimestamp() {
    return null;
  }
}
