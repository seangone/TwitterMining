package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;


@Service
public class TopicService {
  private final TopicRepository s;

  @Autowired
  public TopicService(TopicRepository s) {
    this.s = s;
  }

  public Mono<Topic> createTopic(Topic t) {
    return s.insert(t);
  }

  public Mono<Topic> getSampleTopic(String _id){
    Topic t = new Topic(_id, new ArrayList<String>() {{
      add("hadidididioba");
    }}, new ArrayList<String>());
    return Mono.create(sink -> sink.success(t));
  }

  public Mono<Topic> findById(String _id) {
    return s.findById(_id);
  }

  public Mono<String> deleteById(String _id) {
    s.deleteById(_id);
    return Mono.create(cityMonoSink -> cityMonoSink.success(_id));
  }

  public Flux<Topic> findAll() {
    return s.findAll();
  }
}
