# Twitter Crawler

## Data Flow

[!data flow](https://mermaidjs.github.io/mermaid-live-editor/#/view/eyJjb2RlIjoiZ3JhcGggVERcbkFbVHdpdHRlciBTdHJlYW1pbmcgQVBJXSAtLT58dW50YWdnZWQgdHdlZXRzfCBDKHMpXG5CW01vbmdvREJdIC0tPiB8dG9waWMga2V5d29yZHMgYW5kIGlkc3wgQ1xuQ3tUd2l0dGVyQ3Jhd2xlcn1cbkMgLS0-IHxrZXl3b3JkcyBhbmQgaWRzfCBBXG5DIC0tPnx1bnRhZ2dlZCB0d2VldHN8IERbVG9waWMgVGFnZ2luZ11cbkMgLS0-fHVudGFnZ2VkIHR3ZWV0c3wgRVtTZW50aW1lbnQgRXN0aW1hdGluZ11cbkQgLS0-IHx0YWdnZWQgdHdlZXRzfCBGW1JvdXRlcl1cbkUgLS0-IHxzY29yZWQgdHdlZXRzfCBGW1JvdXRlcl1cbkYgLS0-IHx0b3BpYyBzZW50aW1lbnRhbCBzY29yZXN8IEIyW01vbmdvREJdIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifX0)

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
