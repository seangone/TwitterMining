package com.seangone.twittermining;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
@CacheConfig(cacheNames = "topic")
public class TopicService {
  private final TopicRepository r;
  private static final Logger logger = LoggerFactory.getLogger(SentimentService.class);

  @Autowired
  public TopicService(TopicRepository r) {
    this.r = r;
  }

  @Cacheable(value = "topic", key = "#_id", condition = "#allowCache")
  public Mono<Topic> findById(String _id, boolean allowCache) {
    logger.info("Use Repository in topic when findById({})", _id);
    return r.findById(_id)
        .switchIfEmpty(
            Mono.error(new Exception("No Topic found with Id: " + _id))
        );
  }

  @CacheEvict(value = "topic", key = "#_id")
  public Mono<Boolean> deleteOne(String _id) {
    logger.info("Use Repository in topic when deleteOne({})", _id);
    return r.findById(_id).flatMap(t -> r.delete(t).then(Mono.just(true)))
        .switchIfEmpty(
            Mono.error(new Exception("No Topic found with Id: " + _id))
        );
  }

  @CachePut(value = "topic", key = "#_id")
  public Mono<Topic> update(Topic newt, String _id) {
    logger.info("Use Repository in topic when saveOne({})", newt);
    return findById(_id, false).flatMap(t -> {
      t.set_id(newt.get_id());
      t.setKeywords(newt.getKeywords());
      t.setIds(newt.getIds());
      return r.save(t);
    }).switchIfEmpty(
        Mono.error(new Exception("No Topic found with Id: " + _id))
    );
  }

  @CachePut(value = "topic", key = "#t._id")
  public Mono<Topic> saveOne(Topic t) {
    logger.info("Use Repository in topic when saveOne({})", t);
    return r.save(t);
  }

  @Cacheable(value = "topic", condition = "#allowCache")
  public Flux<Topic> findAll(boolean allowCache) {
    logger.info("Use Repository in topic when findAll()");
    return r.findAll();
  }

  @CacheEvict(value = "topic", allEntries = true)
  public Mono<Boolean> clearCaches(){
    return Mono.just(true);
  }

}
