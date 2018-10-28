package com.seangone.twittermining;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class ApiController {
//  private final AtomicLong counter = new AtomicLong();

  @GetMapping("/")
  @ResponseBody
  public String index() {
    return "<html>"
        + "This is Twitter Mining API Running... Please visit "
        + "<a href='https://github.com/seangone/TwitterMining'>this repo</a>"
        + " to see the api details"
        + "</html>";
  }

  @GetMapping("/api")
  @ResponseBody
  public String api() {
    return "<html>"
        + "This is Twitter Mining API Running... Please visit "
        + "<a href='https://github.com/seangone/TwitterMining'>this repo</a>"
        + " to see the api details"
        + "</html>";
  }

}