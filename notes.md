```typescript
interface QuoteSuccessResponse {
    "Arnie Quote": string;
}

interface QuoteFailureResponse {
    "FAILURE": string;
}

type QuoteResponse = QuoteSuccessResponse | QuoteFailureResponse;

function getArnieQuotes(urls: string[]): Promise<QuoteResponse[]>;
```

Concerns: 
- Respect the order of the HTTP requests
- 1-1 mapping to resulting Promise from url
- Which standard of ECMAScript to base upon? Eg. async await syntax, Promise.allSettled, etc
- Is the overall promise dependent on the individual requests?
    - Not a good candidate for Promise.all as it doesn't seem like a dependent query
    - Could use Promise.allSettled (if supported) or handle catches in each promise request
- Unexpected HTTP status codes
- Handling failure to parse HTTP body as JSON

Impediments:
- jest environment had some configuration issues
    - Tests weren't found
    - Switched to different jest plugin in VS Code
    - Works like a charm :)
