---
title: Preventing DoS Attacks
---

### Preventing DoS Attacks

Denial of service is a type of attack in which the attacker overloads our servers’ capacity to process requests, resulting in legitimate users being unable to use our app. While some attacks are below the application layer (like a [SYN flood](https://en.wikipedia.org/wiki/SYN_flood)), those are usually taken care of by our CDN (like [Cloudflare](https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/)) and/or hosting provider. In this section, we’ll look at application layer attacks of GraphQL servers, which can be separated into two buckets: expensive requests and a large number of requests. We want to guard against both. 

First, guarding against expensive requests—requests that take up significant resources while the server processes them:

- [Safelisting](https://www.apollographql.com/docs/graph-manager/operation-registry/): If our API is private—only for use by our own client code—then we can safelist our queries. We’ll send Apollo Studio our client queries during a build step in the client repo(s), and then our server will check all incoming requests against the registered queries in Apollo Studio and reject any unrecognized queries. If our API is public, however, we can’t safelist, because we want third-party devs to be able to construct whatever queries they need.
- Validate arguments: Attackers can alter arguments to take up resources. For instance, if we have a `username` argument in our `signup` mutation, and then we save it to the database without checking the length, an attacker could provide a long string that takes up a gigabyte of hard drive space. Soon, our database would become full, which would prevent us from storing any further data.
- Add a timeout: If a request isn’t done after N milliseconds, terminate it.
- Hide schema: A common practice for private GraphQL APIs is disabling introspection in production. This is the default behavior of Apollo Server. While it doesn’t guard against expensive operations, it makes it harder for an attacker to construct them, since they can’t just open Playground and read through the schema.
- Limit depth: One way to make a query expensive is to make it really deep—continuing to select connection fields (like `query { posts { comments { users { posts { comments { ...etc. }}}}}}`). We can use the [`graphql-depth-limit`](https://github.com/stems/graphql-depth-limit) library for this.
- Limit complexity: This is a more advanced technique than just limiting depth and involves assigning a complexity cost value to each field and limiting the total cost of a query. We can implement this using [`graphql-validation-complexity`](https://github.com/4Catalyzer/graphql-validation-complexity), or, if we want more flexibility, [`graphql-cost-analysis`](https://github.com/pa-bru/graphql-cost-analysis), which allows us to multiply costs by arguments or parent multipliers.

We can guard against a large number of requests by rate limiting. GitHub uses a combination of [rate limiting and cost analysis](https://developer.github.com/v4/guides/resource-limitations/#rate-limit) for its public API—we can’t make queries with a total cost of more than 5,000 points per hour. There’s not yet an open-source library that does this. (If you write one, let us know so that we can link to it! And you may want to use a [leaky bucket algorithm](https://en.wikipedia.org/wiki/Leaky_bucket) instead of a fixed window.) The [`graphql-rate-limit-directive`](https://github.com/ravangen/graphql-rate-limit) library provides a directive that allows us to limit the number of times a particular field or object is selected within a certain time window.

In addition to blocking requests that are too complex or too frequent, we can reduce the amount of resources each request takes. For instance, instead of doing all the work needed during the request, in some cases we can send a response and then queue a job to be executed by a different server, clearing more room for our API server to handle more requests. Another example is caching—we can reduce the load on our database by using a cache, which we talk about in [Chapter 11: Server > Performance > Caching](../server/extended-topics/performance.md#caching).

Many of these techniques are implemented for us automatically when we use a backend-as-a-service like [Hasura](../server/extended-topics/hasura.md).

