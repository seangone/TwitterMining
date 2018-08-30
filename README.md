# TwitterMining

- Showcase
    - [http://18.144.22.172/](http://18.144.22.172/)

I got problems with spark deployment on EC2 (not enough budget for Hadoop) so I am now working on the showcase using Python.

## Frontend

- using **Vue.js** to bind model with view
- use **AJAX** to communicate with back-end


## Restful API

- use **Restful API** to manage topics to be tracked
    - `/api/topics/`
        - `GET`
    - `/api/topics/:topic_id`
        - `GET`
        - `POST` - create
        - `PUT` - substitude
        - `DELETE`
    - `/api/sentiments/`
        - `GET`
    - `/api/sentiments/:topic_id`
        - `GET`

## Backend
    
### Spring Server

- construct a Reactive web service using **Spring Boot 2.0** with **WebFlux** and **Reactive MongoDB** to handle HTTP requests and **Server-sent events (SSE)**
- use **In-memory Cache** to reduce pressure on DB
- used Spring techniques
    - Spring Boot 2 : for Bootstrapping Project
    - Spring Webflux : for Reactive Web Application
    - Spring Reactive Data MongoDB : for Reactive Persistence in MongoDB.
    - Lombok : for autogenerate Getter and Setter and other Method
    - DevTools : make the application development experience a little more pleasant
- Service is composed of three layers
    - `@Repository` is the layer for data access
    - `@Service` defines the business logic, that is, how we can use the data access layer
    - `@Controller` defines how we wrap the data and present them to HTTP requests sent via Restful API


## Deployment

- Deployed with **Docker** on **Amazon EC2**
    - [MongoDB](https://github.com/docker-library/mongo)
    - [Mongo-express](https://github.com/mongo-express/mongo-express-docker)
    - [Docker Registry](https://docs.docker.com/registry/)

## Data Collecting and Mining

- collect tweets from **Twitter Streaming** API and store them on **MongoDB**
    - use **NLTK** to calculate sentimental score
    - **Topic-related PageRank**
        - I planned to use **Spark** to develop but now I am changing it to **Python**

### Data Flow

<div align=center><img width="450"  src="./dataflow.png?raw=true"/></div>

[This is a flowchart of data flow, please click on it](https://mermaidjs.github.io/mermaid-live-editor/#/view/eyJjb2RlIjoiZ3JhcGggVERcbkEoU3RhcnQ6IFR3aXR0ZXIgU3RyZWFtaW5nIEFQSSkgLS0-fHVudGFnZ2VkIHR3ZWV0c3wgQyhzKVxuQihFbmQ6IE1vbmdvREIpIC0tPiB8dG9waWMga2V5d29yZHMgYW5kIGlkc3wgQ1xuQ3tUd2l0dGVyQ3Jhd2xlcn1cbkMgLS0-IHxrZXl3b3JkcyBhbmQgaWRzfCBBXG5DIC0tPnx1bnRhZ2dlZCB0d2VldHN8IERbVG9waWMgVGFnZ2luZ11cbkMgLS0-fHVudGFnZ2VkIHR3ZWV0c3wgRVtTZW50aW1lbnQgRXN0aW1hdGluZ11cbkQgLS0-IHx0YWdnZWQgdHdlZXRzfCBGW1JvdXRlcl1cbkUgLS0-IHxzY29yZWQgdHdlZXRzfCBGW1JvdXRlcl1cbkYgLS0-IHx0b3BpYyBzZW50aW1lbnRhbCBzY29yZXN8IEIyKEVuZDogTW9uZ29EQikiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9fQ)

​```
graph TD
A(Start: Twitter Streaming API) -->|untagged tweets| C(s)
B(End: MongoDB) --> |topic keywords and ids| C
C{TwitterCrawler}
C --> |keywords and ids| A
C -->|untagged tweets| D[Topic Tagging]
C -->|untagged tweets| E[Sentiment Estimating]
D --> |tagged tweets| F[Router]
E --> |scored tweets| F[Router]
F --> |topic sentimental scores| B2(End: MongoDB)
​```


## Reference

### Reactive Programming

- [What is Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming)
- [Reference](https://medium.com/exploring-code/what-is-reactive-programming-da37c1611382)

> **Reactive programming** is a programming paradigm oriented around data flows and the propagation of change. This means that it should be possible to **express static or dynamic data flows with ease** in the programming languages used, and that the underlying execution model will **automatically propagate changes through the data flow**.

- `Flux` and `Mono` are event publishers. If events are subscribled, the `Flux` and `Mono` will callback the corresponding methods defined by the publishers.

### Spring

- [Spring Boot 2 MongoDB Reactive Programming](https://medium.com/@beladiyahardik7/spring-boot-2-mongodb-reactive-programming-b20a9a5bd6c)
- [springboot2学习 - webflux和mongodb](https://blog.csdn.net/j903829182/article/details/80288892)
- [Building a RESTful Web Service with Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)
- [Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Web Reactive](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#spring-webflux)
- [Spring Data Repositories](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#mongo.reactive)

### MongoDB

- [Create Indexes to Support Your Queries](https://docs.mongodb.com/manual/tutorial/create-indexes-to-support-queries/)
- [Use Indexes to Sort Query Results](https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/index.html)