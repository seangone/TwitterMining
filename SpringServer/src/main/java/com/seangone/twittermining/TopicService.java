package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;


@Service
public class TopicService {
  private final TopicRepository r;

  @Autowired
  public TopicService(TopicRepository r) {
    this.r = r;
  }

  public Mono<Topic> getSampleTopic(String _id){
    Topic t = new Topic(_id, new ArrayList<String>() {{
      add("hadidididioba");
    }}, new ArrayList<String>());
    return Mono.create(sink -> sink.success(t));
  }

  public Mono<Topic> updateTopic(Topic newt, String _id) {
    return findById(_id).flatMap(t -> r.save(newt))
        .switchIfEmpty(
            Mono.error(new Exception("No Topic found with Id: " + _id))
        );
  }

  public Mono<Topic> findById(String _id) {
    return r.findById(_id)
        .switchIfEmpty(
            Mono.error(new Exception("No Topic found with Id: " + _id))
        );
  }
  public Mono<Boolean> deleteById(String _id) {
    return r.findById(_id).flatMap(t -> r.delete(t).then(Mono.just(true)))
        .switchIfEmpty(
            Mono.error(new Exception("No Topic found with Id: " + _id))
        );
  }

  public Mono<Topic> saveOne(Topic t) {
    return r.save(t);
  }

  public Flux<Topic> findAll() {
    return r.findAll();
  }
}
