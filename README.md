# TwitterMining


[http://18.144.22.172/](http://18.144.22.172/) 

I got problems with spark deployment on EC2 (not enough budget for Hadoop) so I am now working on the showcase using Python.

## Frontend

- using **Vue.js** to do visualization
- use **AJAX** to communicate with back-end

## Backend

- use tweets from **Twitter Streaming** API
    - use NLTK to calculate sentimental score
    - Topic-related PageRank
        - I planned to use **Spark** to develop but now I am changing it to **Python**
- use **Restful API** to manage topics to be tracked
    - `/topics`
        - `GET`
    - `/topics/:topic_id`
        - `GET`
        - `POST` - create
        - `PUT` - substitude
        - `DELETE`
    - `/topics/:topic_id/score`
        - `GET`
- use **Reactive Programming** with **Spring Boot 2.0** to construct the backend
    - Spring Boot 2 : for Bootstrapping Project
    - Spring Webflux : for Reactive Web Application
    - Spring Reactive Data MongoDB : for Reactive Persistence in MongoDB.
    - Lombok : for autogenerate Getter and Setter and other Method
    - DevTools : make the application development experience a little more pleasant
- Service is composed of three layers
    - `@Repository` is the layer for data access
    - `@Service` defines the business logic, that is, how we can use the data access layer
    - `@Controller` defines how we wrap the data and present them to HTTP requests sent via Restful API

### Data Flow

![dataflow](./dataflow.png?raw=true){:width="50%"}

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
