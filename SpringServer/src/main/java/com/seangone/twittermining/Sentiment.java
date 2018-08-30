package com.seangone.twittermining;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "sentiments")
public class Sentiment {
  @Id
  private String _Id;
  private Double timestamp;
  private String topic;
  private String last_status_id;
  private Double score;

}
