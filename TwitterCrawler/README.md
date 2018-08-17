# Twitter Crawler

## Data Flow

​```mermaid
graph TD
A[Twitter Streaming API] -->|untagged tweets| C(s)
B[MongoDB] --> |topic keywords and ids| C
C{TwitterCrawler}
C --> |keywords and ids| A
C -->|untagged tweets| D[Topic Tagging]
C -->|untagged tweets| E[Sentiment Estimating]
D --> |tagged tweets| F[Router]
E --> |scored tweets| F[Router]
F --> |topic sentimental scores| B2[MongoDB]
​```
