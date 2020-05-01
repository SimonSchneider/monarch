import React from "react";
import { LayoutManager, Digraph } from "@jaegertracing/plexus";
import { scaleProperty } from "@jaegertracing/plexus/lib/Digraph/props-factories";
import Service from "./Service";
import Topic from "./Topic";
import ConsumerGroup from "./ConsumerGroup";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_CONFIG } from "./redux/actionTypes";
import styles from "./arch.module.css";

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
      return "black"
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
  };
}

const lm = new LayoutManager({
  useDotEdges: true,
  rankdir: "TB",
  ranksep: 2,
});

const App = () => {
  const conf = useSelector((state) => state.config.config);
  const weights = useSelector((state) => state.config.weights);
  const topicRates = useSelector((state) => state.config.topicRates);
  const consumerGroupInfo = useSelector((state) => state.config.consumerGroupInfo);
  const loaded = useSelector((state) => state.config.loaded);

  const dispatch = useDispatch();

  const update = async ({ state = "good" } = {}) => {
    const fromBe = await fetch(`/api/v1/curr?state=${state}`).then((r) => r.json());
    dispatch({ type: LOAD_CONFIG, payload: fromBe });
  };

  if (!loaded) {
    update();
    return <div>LOADING STUFF</div>;
  }

  const topics = conf.topics.map((t) => ({
    key: `topic.${t.name}`,
    component: <Topic name={t.name} />,
  }));
  const services = conf.services.map((s) => ({
    key: `service.${s.name}`,
    component: <Service name={s.name} />,
  }));
  const consumerGroups = conf.consumerGroups.map((cg) => ({
    key: `cg.${cg.name}`,
    component: <ConsumerGroup name={cg.name} />,
  }));
  const vertices = [...topics, ...services, ...consumerGroups];

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
  const unmatchedConsumers = conf.consumerGroups.flatMap((cg) =>
    cg.topics.map((t) => ({
      from: `topic.${t.name}`,
      to: `cg.${cg.name}`,
      topic: t.name,
      cg: cg.name,
    }))
  );

  const edges = [...producers, ...consumers, ...unmatchedConsumers];

  return (
    <div
      style={{
        height: "99vh",
        width: "99vw",
        overflow: "hidden",
        position: "fixed",
      }}
    >
      <button onClick={() => update({ state: "good" })} style={{ zIndex: 10, position: "absolute" }}>refresh</button>
      <button onClick={() => update({ state: "warn" })} style={{ zIndex: 10, position: "absolute", left: 80 }}>warn</button>
      <button onClick={() => update({ state: "crit" })} style={{ zIndex: 10, position: "absolute", left: 160 }}>crit</button>
      <button onClick={() => update({ state: "real" })} style={{ zIndex: 10, position: "absolute", left: 240 }}>real</button>
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
              const weight = topicRates[l.edge.topic];
              const cgInfo = consumerGroupInfo.find((cg) => l.edge.cg && l.edge.topic && cg.consumerGroup === l.edge.cg && cg.topic === l.edge.topic);
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

export default App;
