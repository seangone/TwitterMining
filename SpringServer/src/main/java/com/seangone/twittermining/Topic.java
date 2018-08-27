package com.seangone.twittermining;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Data
@Document(collection = "topics")
public class Topic {
  @Id
  private String _id;
  private List<String> keywords;
  private List<String> ids;


  public Topic(String _id, List<String> keywords, List<String> ids) {
    this._id = _id;
    this.keywords = keywords;
    this.ids = ids;
  }

}
