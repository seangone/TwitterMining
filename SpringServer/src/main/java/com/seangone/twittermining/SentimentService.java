package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SentimentService {
  private final SentimentRepository r;

  @Autowired
  public SentimentService(SentimentRepository r) {
    this.r = r;
  }

  public Mono<Sentiment> getLatestSentimentById(String _id) {
//    r.findAllById()
    return null;
  }

  public Mono<Sentiment> getLatestSentiments() {
    return null;
  }

}
