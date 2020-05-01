# MonArch
Micro service monitoring and architecture visualization 

## Why MonArch
Many already use monitoring visualization tools
Like Grafana to get insights into their service
health.
MonArch aims to provide a complementary way of 
visualizing monitoring data (metrics and traces).

At the core of MonArch is the service topology 
graph (architecture). MonArch aims to auto 
generate this topology as far as possible with
the monitoring tools that are available. Anything
else can be manually configured.

## Visualization goals
- eventsStores and queues
  - currently supports
    - prometheus as the source
    - Kafka as the event store
  - future
    - automatic topology via tracing

- HTTP traffic
  - currently supports 
    - manual dependency configuration
    - Prometheus as the source for metrics
  - future
    - automatic topology via tracing

