package com.seangone.twittermining;


import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {
  @Override
  @Bean // default cacheManager
  public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager("sentiment", "topic");
    cacheManager.setCaffeine(Caffeine.newBuilder()
        .maximumSize(100)
        // there is no writing for sentiment, so it automatically expire.
        .expireAfterWrite(500, TimeUnit.MILLISECONDS)
        .recordStats()// provides hitRate, evictionCount, averageLoadPenalty
    );
    return cacheManager;
  }

}