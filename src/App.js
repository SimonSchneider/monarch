import React from "react";
import { LayoutManager, Digraph } from "@jaegertracing/plexus";
import { scaleProperty } from "@jaegertracing/plexus/lib/Digraph/props-factories";
import Service from "./Service";
import Topic from "./Topic";
import ConsumerGroup from "./ConsumerGroup";
import { useDispatch } from "react-redux";
import { LOAD_CONFIG } from "./redux/actionTypes";

const conf = require("./conf2.json");

function toScaleFn(rates) {
  const arr = rates.slice().sort((a, b) => a - b);
  const minRate = arr[0];
  const maxRate = arr[arr.length - 1];
  return (min, max) => {
    return (max - min) / (maxRate - minRate);
  };
}

function toWeightFn(rates) {
  const scaleFn = toScaleFn(rates);
  const [minS, maxS] = [1, 3];
  const [minO, maxO] = [0.5, 1];
  const scaleS = scaleFn(minS, maxS);
  const scaleO = scaleFn(minO, maxO);
  return (x) => {
    const size = x * scaleS + minS;
    const opacity = x * scaleO + minO;
    return {
      strokeWidth: `${parseInt(size, 10)}px`,
      opacity: `${opacity}`,
    };
  };
}

const App = () => {
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
      weight: conf.topics.find((k) => k.name === t).eventRate,
    }))
  );
  const consumers = conf.services.flatMap((s) =>
    s.consumerGroups.flatMap((cg) =>
      cg.topics.map((t) => ({
        from: `topic.${t.name}`,
        to: `service.${s.name}`,
        weight: conf.topics.find((k) => k.name === t.name).eventRate,
      }))
    )
  );
  const unmatchedConsumers = conf.consumerGroups.flatMap((cg) =>
    cg.topics.map((t) => ({
      from: `topic.${t.name}`,
      to: `cg.${cg.name}`,
      weight: conf.topics.find((k) => k.name === t.name).eventRate,
    }))
  );

  const edges = [...producers, ...consumers, ...unmatchedConsumers];

  const lm = new LayoutManager({
    useDotEdges: true,
    rankdir: "TB",
    ranksep: 2,
  });

  const dispatch = useDispatch();

  const toWeight = toWeightFn(conf.topics.map((t) => t.eventRate));

  const update = async () => {
    const fromBe = await fetch("/api/v1/curr").then((r) => r.json());
    dispatch({ type: LOAD_CONFIG, payload: fromBe });
  };

  return (
    <div
      style={{
        height: "99vh",
        width: "99vw",
        overflow: "hidden",
        position: "fixed",
      }}
    >
      <button onClick={update} style={{ zIndex: 10, position: "absolute" }}>
        refresh
      </button>
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
              return toWeight(l.edge.weight);
            },
            markerEndId: "edge-arrow",
          },
          {
            key: "nodes",
            layerType: "html",
            measurable: true,
            renderNode: (vertex) => vertex.component,
            setOnNode: {
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
