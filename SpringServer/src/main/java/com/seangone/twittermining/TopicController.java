package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "/topics")
public class TopicController {
  @Autowired
  private TopicService s;

  @GetMapping
  public Flux<Topic> findAllTopics() {
    return s.findAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Mono<Topic> saveOneTopic(@RequestBody Topic t) {
    return s.saveOne(t);
  }

  @GetMapping(value = "/{id}")
  public Mono<Topic> findTopicById(@PathVariable("id") String _id) {
    return s.findById(_id);
  }

  @PutMapping(value = "/{id}")
  public Mono<Topic> updateTopic(@RequestBody Topic t, @PathVariable("id") String _id) {
    return s.updateTopic(t, _id);
  }

  @DeleteMapping(value = "/{id}")
  public Mono<Boolean> deleteTopic(@PathVariable("id") String _id) {
    return s.deleteById(_id);
  }

}
