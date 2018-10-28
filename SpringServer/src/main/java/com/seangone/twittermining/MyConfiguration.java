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
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class MyConfiguration extends CachingConfigurerSupport implements WebMvcConfigurer {
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

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST","PUT", "DELETE");
      }
    };
  }

}

//
//@Configuration
//@EnableCaching
//public class CacheConfig extends CachingConfigurerSupport {
//  @Override
//  @Bean // default cacheManager
//  public CacheManager cacheManager() {
//    CaffeineCacheManager cacheManager = new CaffeineCacheManager("sentiment", "topic");
//    cacheManager.setCaffeine(Caffeine.newBuilder()
//        .maximumSize(100)
//        // there is no writing for sentiment, so it automatically expire.
//        .expireAfterWrite(500, TimeUnit.MILLISECONDS)
//        .recordStats()// provides hitRate, evictionCount, averageLoadPenalty
//    );
//    return cacheManager;
//  }
//
//}