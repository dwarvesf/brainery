---
title: Trace IDs and request IDs that work
description: Understanding when to use trace_id versus request_id, and how to implement correlation that actually helps during incidents. We explore practical patterns for different system scales.
authors:
  - tieubao
date: 2025-05-14
tags:
  - monitoring
  - correlation
  - tracing
  - debugging
redirect:
  - /XmVtNQ
---

"I can see the error in the logs, but I can't figure out which user request caused it." Sound familiar? This is exactly why we need correlation IDs, unique identifiers that connect related events across your system. But should you use `trace_id`, `request_id`, or both? The answer depends on your system's complexity and your team's debugging needs.

## The correlation problem

When something goes wrong in your system, you need to piece together what happened. Without correlation IDs, debugging looks like this:

```
2025-05-14 10:23:45 [INFO] User logged in
2025-05-14 10:23:47 [ERROR] Database connection failed
2025-05-14 10:23:48 [INFO] Blog post loaded
2025-05-14 10:23:49 [ERROR] Arweave fetch timeout
```

Which error belongs to which user action? You're left guessing. With correlation IDs, the same logs become:

```
2025-05-14 10:23:45 [INFO] User logged in request_id=req_abc123
2025-05-14 10:23:47 [ERROR] Database connection failed request_id=req_def456
2025-05-14 10:23:48 [INFO] Blog post loaded request_id=req_abc123
2025-05-14 10:23:49 [ERROR] Arweave fetch timeout request_id=req_abc123
```

Now you can see that the user login and blog post loading are related, and the database error is a separate issue.

## Understanding trace_id vs request_id

These two types of IDs serve different purposes, and understanding the difference helps you choose the right approach:

### Request ID: Simple correlation within a single operation

A `request_id` tracks a single user-initiated operation from start to finish. Think of it as a unique label for "this thing the user asked me to do."

**When to use request_id:**

- Single-service applications
- Simple request/response patterns
- When you need basic log correlation
- Lean monitoring setups

**Example:** User loads a blog post

```
request_id=req_abc123
├── Load post from database
├── Fetch author info
├── Get related posts
└── Render page
```

### Trace ID: Distributed request tracking

A `trace_id` tracks a request as it flows through multiple services, creating a tree of operations (spans). It's designed for distributed tracing systems.

**When to use trace_id:**

- Microservices architectures
- Complex distributed systems
- When you need detailed performance analysis
- Systems using OpenTelemetry or similar

**Example:** User loads a blog post with on-chain data

```
trace_id=trace_xyz789
├── Frontend request (span_1)
├── API Gateway (span_2)
├── Blog Service (span_3)
│   ├── Database query (span_4)
│   └── Cache check (span_5)
└── Arweave Service (span_6)
    ├── Arweave API call (span_7)
    └── Data processing (span_8)
```

## Practical implementation patterns

Let's look at how to implement correlation IDs for different system types:

### Pattern 1: Single request_id (simple systems)

**Best for:** Simple systems, single services, teams new to observability

**Implementation:**

```javascript
// Generate request_id at entry point
app.use((req, res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  next();
});

app.get('/posts/:id', async (req, res) => {
  try {
    // Use request_id in all logs and operations
    logger.info('Loading blog post', { 
      request_id: req.requestId, 
      post_id: req.params.id 
    });
    
    const blogPost = await loadPost(req.params.id);
    
    // Track request_id in external calls
    const arweaveData = await fetchFromArweave(req.params.id, req.requestId);
    
    res.json({ post: blogPost, arweave: arweaveData });
  } catch (error) {
    logger.error('Request failed', { 
      request_id: req.requestId, 
      error: error.message 
    });
  }
});

// External service call
async function fetchFromArweave(postId, requestId) {
try {
  logger.info('Fetching from Arweave', { request_id: requestId });
  
  const response = await fetch(`https://arweave.net/api/posts/${postId}`, {
    headers: { 'X-Request-ID': requestId }
  });
  
  return await response.json();
} catch (error) {
  logger.error('Arweave fetch failed', { 
    request_id: req.requestId, 
    error: error.message 
  });
}
```

This approach is simple to implement and understand, requiring no additional infrastructure beyond your existing logging system. It works well for single services but becomes limited when you need correlation across multiple services or detailed performance breakdown.

### Pattern 2: Single trace_id (distributed systems)

**Best for:** Microservices, complex systems, teams using distributed tracing

**Implementation with OpenTelemetry:**

```javascript
const { trace } = require('@opentelemetry/api');

// Automatic trace_id generation
app.get('/posts/:id', async (req, res) => {
  const span = trace.getActiveSpan();
  const traceId = span.spanContext().traceId;
  
  // Use trace_id in logs
  logger.info('Loading blog post', { 
    trace_id: traceId, 
    post_id: req.params.id 
  });
  
  // Use trace_id in metrics
  metrics.increment('blog_post_requests', { 
    trace_id: traceId 
  });
  
  // Automatic span creation for external calls
  const arweaveData = await fetchFromArweave(req.params.id);
  
  res.json({ post: blogPost, arweave: arweaveData });
});
```

The distributed tracing approach provides rich performance insights and automatic propagation across services, following industry standards. However, it requires tracing infrastructure and has a steeper learning curve for teams new to observability.

### Pattern 3: Both trace_id and request_id (hybrid approach)

**Best for:** Systems transitioning to distributed tracing, mixed architectures

**When you might need both:**

- Legacy services that don't support tracing
- External systems that need simple correlation
- Gradual migration to distributed tracing
- Different correlation needs at different layers

**Implementation:**

```javascript
// Generate both IDs
app.use((req, res, next) => {
  // Simple request ID for basic correlation
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  
  // Trace ID from tracing system
  const span = trace.getActiveSpan();
  req.traceId = span ? span.spanContext().traceId : null;
  
  next();
});

// Use both in logs for maximum flexibility
logger.info('Processing request', {
  request_id: req.requestId,
  trace_id: req.traceId,
  operation: 'load_blog_post'
});

// Use request_id for simple metrics
metrics.increment('requests_total', { 
  request_id: req.requestId 
});

// Use trace_id for distributed tracing
// (automatically handled by tracing system)
```

## Choosing the right approach for your system

### Start with request_id if

- You have a single service or simple architecture
- Your team is new to observability
- You want to get correlation working quickly
- You're building a lean monitoring setup

### Use trace_id if

- You have multiple services that need coordination
- Performance optimization is important
- Your team has distributed tracing expertise
- You're building a complex system from the start

### Consider both if

- You're migrating from simple to complex architecture
- You have mixed service types (some support tracing, some don't)
- You need different correlation granularity for different use cases

## Implementation best practices

### Generate IDs at the right place

**For request_id:** Generate at the entry point of your system

```javascript
// Good: Generate once at the beginning
app.use(generateRequestId);

// Bad: Generate multiple times
function processOrder() {
  const id = generateId(); // Creates inconsistency
}
```

**For trace_id:** Let your tracing system handle generation

```javascript
// Good: Use tracing system's ID
const traceId = span.spanContext().traceId;

// Bad: Generate your own trace ID
const traceId = `trace_${Math.random()}`;
```

### Propagate IDs consistently

**In HTTP headers:**

```javascript
// Outgoing requests
const response = await axios.get('/api/posts', {
  headers: {
    'X-Request-ID': requestId,
    'X-Trace-ID': traceId
  }
});

// Incoming requests
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || generateRequestId();
  next();
});
```

**In message queues:**

```javascript
// Publishing
await queue.publish('process-post', {
  postId: 123,
  request_id: requestId,
  trace_id: traceId
});

// Consuming
queue.subscribe('process-post', (message) => {
  const { request_id, trace_id } = message;
  logger.info('Processing queued post', { request_id, trace_id });
});
```

### Structure your logs for searchability

**Good log structure:**

```javascript
logger.info('Blog post loaded successfully', {
  request_id: 'req_abc123',
  trace_id: 'trace_xyz789',
  post_id: 456,
  load_time_ms: 234,
  arweave_data_included: true
});
```

**Searchable patterns:**

- `request_id:req_abc123` - Find all events for this request
- `trace_id:trace_xyz789` - Find all distributed events
- `post_id:456 AND request_id:req_abc123` - Specific post in specific request

### Handle ID propagation failures gracefully

```javascript
function getCorrelationIds(req) {
  return {
    request_id: req.requestId || 'unknown',
    trace_id: req.traceId || null,
    user_id: req.user?.id || 'anonymous'
  };
}

// Always include what you have
logger.info('Operation completed', {
  ...getCorrelationIds(req),
  operation: 'load_post',
  success: true
});
```

## Common mistakes and how to avoid them

### Mistake 1: Inconsistent ID formats

Different services using different ID formats is like having multiple people speak different languages, everything breaks down when they try to communicate.

```javascript
// This chaos hurts debugging
service1: request_id = "req_123"
service2: request_id = "REQUEST-456"  
service3: request_id = "789"
```

The fix is simple but requires discipline: establish ID format standards and stick to them. A good pattern includes a prefix, timestamp, and random component:

```javascript
// Standard format: prefix_timestamp_random
const requestId = `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
```

### Mistake 2: Not propagating IDs to external services

You've set up perfect correlation within your application, but then you call an external API without including your correlation context. When that API call fails, you're back to guessing which user request caused the problem.

```javascript
// This loses all context
const arweaveData = await fetch('https://arweave.net/api/data');
```

Always include correlation headers in external calls. Even if the external service doesn't use them, you'll see them in your request logs:

```javascript
const arweaveData = await fetch('https://arweave.net/api/data', {
  headers: {
    'X-Request-ID': requestId,
    'User-Agent': `BlogApp/1.0 (request:${requestId})`
  }
});
```

### Mistake 3: Logging IDs inconsistently

Field name inconsistency might seem minor, but it makes searching impossible. When you're troubleshooting at 2 AM, you don't want to remember whether this service uses `reqId`, `request_id`, or `requestID`.

```javascript
// Which field name was it again?
logger.info('User login', { reqId: requestId });
logger.info('Post loaded', { request_id: requestId });
logger.info('Error occurred', { requestID: requestId });
```

Create a shared context object and use it everywhere:

```javascript
// Always use the same field name
const logContext = { request_id: requestId };
logger.info('User login', logContext);
logger.info('Post loaded', logContext);
logger.error('Error occurred', logContext);
```

### Mistake 4: Over-complicating simple systems

The most expensive mistake is implementing full distributed tracing for a simple blog. You end up maintaining complex infrastructure for a system that could be debugged with basic logging.

Start simple and evolve based on actual need:

```javascript
// Start with this for a simple system
logger.info('Post loaded', { request_id: requestId });

// Evolve to this when complexity demands it
logger.info('Post loaded', { 
  request_id: requestId, 
  trace_id: traceId,
  span_id: spanId 
});
```

## Real-world examples

### Example 1: Blog platform with on-chain data

**System:** Next.js frontend + Node.js API + Arweave integration

**Approach:** Single request_id for simplicity

```javascript
// Frontend request
fetch('/api/posts/123', {
  headers: { 'X-Request-ID': generateRequestId() }
});

// API handler
app.get('/api/posts/:id', async (req, res) => {
  const requestId = req.headers['x-request-id'];
  
  try {
    // Load post from database
    logger.info('Loading post from database', { 
      request_id: requestId, 
      post_id: req.params.id 
    });
    const post = await db.posts.findById(req.params.id);
    
    // Fetch from Arweave
    logger.info('Fetching Arweave data', { 
      request_id: requestId, 
      arweave_id: post.arweave_id 
    });
    const arweaveData = await fetchFromArweave(post.arweave_id);
    
    res.json({ post, arweaveData });
  } catch (error) {
    logger.error('Request failed', { 
      request_id: requestId, 
      error: error.message 
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Example 2: E-commerce microservices

**System:** API Gateway + Order Service + Payment Service + Inventory Service

**Approach:** trace_id with OpenTelemetry

```javascript
// Order processing with automatic tracing
app.post('/orders', async (req, res) => {
  const tracer = trace.getTracer('order-service');
  
  await tracer.startActiveSpan('process-order', async (span) => {
    const traceId = span.spanContext().traceId;
    
    try {
      // Check inventory (creates child span automatically)
      const inventory = await inventoryService.check(req.body.items);
      
      // Process payment (creates child span automatically)
      const payment = await paymentService.charge(req.body.payment);
      
      // Create order
      const order = await createOrder(req.body, payment.id);
      
      logger.info('Order created successfully', {
        trace_id: traceId,
        order_id: order.id,
        customer_id: req.body.customer_id
      });
      
      res.json({ order });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      
      logger.error('Order processing failed', {
        trace_id: traceId,
        error: error.message
      });
      
      res.status(500).json({ error: 'Order processing failed' });
    } finally {
      span.end();
    }
  });
});
```

## Tools and integration

### Log aggregation systems

**Loki/Grafana:**

```javascript
// Query logs by correlation ID
{service="blog-api"} |= "request_id=req_abc123"
```

**ELK Stack:**

```javascript
// Elasticsearch query
{
  "query": {
    "term": { "request_id": "req_abc123" }
  }
}
```

### Metrics systems

**Prometheus:**

```javascript
// Include correlation ID as label
http_requests_total{request_id="req_abc123", endpoint="/api/posts"} 1
```

### Tracing systems

**Jaeger:**

- Automatically correlates spans by trace_id
- Provides visual timeline of request flow
- Shows service dependencies and performance

**Zipkin:**

- Similar to Jaeger with different UI
- Good for smaller deployments

## Making correlation IDs work for your team

The best correlation strategy is the one your team actually uses during incidents. Here's how to make it stick:

### Start simple and evolve

Begin with basic request_id correlation. Add complexity only when you need it.

### Document your approach

Make sure everyone knows:

- How to generate and propagate IDs
- What field names to use in logs
- How to search for correlated events

### Practice during incidents

Use correlation IDs during post-mortems to reinforce their value.

### Automate where possible

Use middleware, frameworks, and tooling to reduce manual correlation work.

Remember: correlation IDs are only valuable if they help you debug problems faster. Choose the approach that fits your system's complexity and your team's debugging workflow.

---

> Next: [Best practices that actually work](best-practices.md)
