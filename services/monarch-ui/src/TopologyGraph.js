import React from "react";
import { LayoutManager, Digraph } from "@jaegertracing/plexus";
import { scaleProperty } from "@jaegertracing/plexus/lib/Digraph/props-factories";
import Service from "./Service";
import Topic from "./Topic";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";
import gridStyles from "./grid.module.css";

function getColor(cgInfo) {
  if (!cgInfo) {
    return "black";
  }
  switch (cgInfo.performance) {
    case "CRITICAL":
      return "#ff312e";
    case "WARNING":
      return "#ffbc0a";
    default:
      return "black";
  }
}

function toWeight(weights, x, cgInfo) {
  const size = x * weights.size.scale + weights.size.min;
  const opacity = x * weights.opacity.scale + weights.opacity.min;
  const color = getColor(cgInfo);
  return {
    strokeWidth: `${parseInt(size, 10)}px`,
    opacity: `${opacity}`,
    stroke: color,
    strokeLinecap: "round",
  };
}

const lm = new LayoutManager({
  useDotEdges: true,
  rankdir: "TB",
  ranksep: 2,
});

export default () => {
  const conf = useSelector((state) => state.config.config);
  const weights = useSelector((state) => state.config.weights);
  const topicRates = useSelector((state) => state.config.topicRates);
  const consumerGroupInfo = useSelector(
    (state) => state.config.consumerGroupInfo
  );

  const topics = conf.topics.map((t) => ({
    key: `topic.${t.name}`,
    component: <Topic name={t.name} />,
  }));
  const services = conf.services.map((s) => ({
    key: `service.${s.name}`,
    component: <Service name={s.name} />,
  }));
  const vertices = [...topics, ...services];

  const producers = conf.services.flatMap((s) =>
    s.producesTo.map((t) => ({
      from: `service.${s.name}`,
      to: `topic.${t}`,
      topic: t,
    }))
  );
  const consumers = conf.services.flatMap((s) =>
    s.consumerGroups.flatMap((cg) =>
      cg.topics.map((t) => ({
        from: `topic.${t.name}`,
        to: `service.${s.name}`,
        topic: t.name,
        cg: cg.name,
      }))
    )
  );
  const requests = conf.services.flatMap((ss) =>
    ss.requestsFrom.flatMap((st) => ({
      from: `service.${ss.name}`,
      to: `service.${st}`,
    }))
  );

  const edges = [...producers, ...consumers, ...requests];

  return (
    <div className={gridStyles.content}>
      <Digraph
        zoom
        minimap
        minimapClassName="Demo--miniMap"
        edges={edges}
        vertices={vertices}
        setOnGraph={{
          style: {},
        }}
        layoutManager={lm}
        measurableNodesKey="nodes"
        layers={[
          {
            key: "edges",
            edges: true,
            layerType: "svg",
            defs: [
              {
                localId: "edge-arrow",
              },
            ],
            setOnContainer: scaleProperty.opacity,
            setOnEdge: (l) => {
              if (!l.edge.topic) {
                return { strokeDasharray: "5,5" };
              }
              const weight = topicRates[l.edge.topic];
              const cgInfo = consumerGroupInfo.find(
                (cg) =>
                  l.edge.cg &&
                  l.edge.topic &&
                  cg.consumerGroup === l.edge.cg &&
                  cg.topic === l.edge.topic
              );
              return toWeight(weights, weight, cgInfo);
            },
            markerEndId: "edge-arrow",
          },
          {
            key: "nodes",
            layerType: "html",
            measurable: true,
            renderNode: (vertex) => vertex.component,
            setOnNode: {
              className: styles.hoverable,
              style: {
                padding: "0.5rem",
              },
            },
          },
        ]}
      />
    </div>
  );
};
