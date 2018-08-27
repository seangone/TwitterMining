package com.seangone.twittermining;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "sentiments")
public class Sentiment {
  @Id
  private String _Id;
  private String last_status_id;
  private double score;
  private String topic;
  private double timestamp;
}
