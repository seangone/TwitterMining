package com.seangone.twittermining;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends ReactiveMongoRepository<Topic, String> {
}
