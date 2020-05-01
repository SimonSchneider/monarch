import React, { Component } from "react";
import Service from "./Service";
import "./App.css";

import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultLinkModel,
  DefaultPortModel,
  NodeModel,
  DagreEngine,
  DiagramEngine,
  PathFindingLinkFactory,
} from "@projectstorm/react-diagrams";

import { CanvasWidget } from "@projectstorm/react-canvas-core";

const conf = require("./conf.json");
const pos = require("./pos.json");

const App = () => {
  // create an instance of the engine with all the defaults
  const engine = createEngine();

  // const pathfinding = engine
  //   .getLinkFactories()
  //   .getFactory(PathFindingLinkFactory.NAME);

  const topics = Object.keys(conf.topics).reduce((acc, k) => {
    const node = new DefaultNodeModel({
      id: `topic.${k}`,
      name: `${k} (${conf.topics[k]})`,
      color: "blue",
    });
    node.setPosition(1000, 1000);
    return {
      ...acc,
      [k]: {
        node,
      },
    };
  }, {});

  const services = conf.services.map((s) => {
    const serv = new DefaultNodeModel({
      id: `service.${s.name}`,
      name: s.name,
      color: "green",
    });
    serv.setPosition(500, 500);
    const producerLinks = s.producesTo.map((t) => {
      return serv
        .addOutPort(`p ${t}`)
        .link(topics[t].node.addInPort(`p ${s.name}`));
    });
    const consumerLinks = s.cgs.flatMap((c) => {
      return Object.keys(c.lag).flatMap((t) => {
        return topics[t].node
          .addOutPort(`cg ${s.name}`)
          .link(serv.addInPort(`c ${t}`));
      });
    });
    return { serv, producerLinks, consumerLinks };
  });

  const model = new DiagramModel();
  const topicNodes = Object.values(topics).map((t) => t.node);
  const serviceNodes = services.map((s) => s.serv);
  const producerLinks = services.flatMap((s) => s.producerLinks);
  const consumerLinks = services.flatMap((s) => s.consumerLinks);
  const serviceNodeMap = serviceNodes.reduce(
    (agg, s) => ({ ...agg, [s.options.id]: s }),
    {}
  );
  const topicNodeMap = topicNodes.reduce(
    (agg, t) => ({ ...agg, [t.options.id]: t }),
    {}
  );
  model.addAll(
    ...topicNodes,
    ...serviceNodes,
    ...producerLinks,
    ...consumerLinks
  );

  engine.setModel(model);

  const save = () => {
    const mapToPos = (val) => {
      const ser = val.serialize();
      return { id: ser.id, x: ser.x, y: ser.y };
    };
    const servicePositions = serviceNodes.map(mapToPos);
    const topicPositions = topicNodes.map(mapToPos);
    const positions = { services: servicePositions, topics: topicPositions };
    fetch(`http://localhost:9081/pos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(positions),
    });
  };

  const load = () => {
    fetch("http://localhost:9081/pos")
      .then((p) => p.json())
      .then((b) => {
        b.services.forEach((e) => serviceNodeMap[e.id].setPosition(e.x, e.y));
        b.topics.forEach((e) => topicNodeMap[e.id].setPosition(e.x, e.y));
      })
      .then((e) => engine.repaintCanvas());
  };
  const prometheus = () => {
    fetch("http://localhost:9081/")
      .then((p) => p.json())
      .then((b) => {
        Object.keys(b.topics).map((t) => {
          const node = topicNodeMap[`topic.${t}`];
          const ser = node.serialize();
          ser.name = `${t} (${b.topics[t]})`;
          node.deserialize(ser);
          console.log(ser);
        });
      });
  };

  load();

  return (
    <div className="app-wrapper">
      <div
        style={{ height: "100%", width: "90%", backgroundColor: "aliceblue" }}
      >
        <CanvasWidget className="canvas" engine={engine} />
      </div>
      <div>
        <button onClick={save}>save</button>
        <button onClick={load}>load</button>
        <button onClick={prometheus}>prometheus</button>
      </div>
    </div>
  );
};

export default App;
