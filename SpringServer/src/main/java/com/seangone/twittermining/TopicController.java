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

  @GetMapping(value = "/{id}")
  public Mono<Topic> findTopicById(@PathVariable("id") String _id) {
    return s.findById(_id);
  }

  @GetMapping(value = "")
  public Flux<Topic> findAllTopics(@PathVariable("id") String _id) {
    return s.findAll();
  }

  @PostMapping(value = "/{id}")
  @ResponseStatus(HttpStatus.CREATED)
  public Mono<Topic> saveOneTopic(@RequestBody Topic t) {
    return s.saveOne(t);
  }
//
//  @PutMapping()
//  public Mono<City> modifyCity(@RequestBody City city) {
//    return cityHandler.modifyCity(city);
//  }

  @DeleteMapping(value = "/{id}")
  public Mono<String> deleteTopic(@PathVariable("id") String _id) {
    return s.deleteById(_id);
  }
}
