package com.seangone.twittermining;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/topics")
public class TopicController {
  @Autowired
  private TopicService s;

  @GetMapping
  public Flux<Topic> findAllTopics(
      @RequestParam(name = "allowCache", defaultValue = "true") Boolean allowCache) {
    return s.findAll(allowCache);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Mono<Topic> saveOneTopic(@Valid @RequestBody Topic t) {
    return s.saveOne(t);
  }

  @GetMapping(value = "/{id}")
  public Mono<Topic> findTopicById(
      @PathVariable("id") String _id,
      @RequestParam(name = "allowCache", defaultValue = "true") Boolean allowCache) {
    return s.findById(_id, allowCache);
  }

  @PutMapping(value = "/{id}")
  public Mono<Topic> updateTopic(
      @Valid @RequestBody Topic t,
      @PathVariable("id") String _id) {
    return s.update(t, _id);
  }

  @DeleteMapping(value = "/{id}")
  public Mono<Boolean> deleteTopic(
      @PathVariable("id") String _id) {
    return s.deleteOne(_id);
  }

  @GetMapping(value = "/clearCache")
  public Mono<Boolean> clearCache() {
    return s.clearCaches();
  }

}
