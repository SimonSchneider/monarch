import React from "react";
import { LayoutManager, DirectedGraph } from "@jaegertracing/plexus";
import Service from "./Service";
import "./App.css";

const conf = require("./conf.json");
// const pos = require("./pos.json");

function formatNumber(x) {
  const num = Number(x);
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) + "k"
    : Math.sign(num) * Math.abs(num).toFixed(2);
}

const App = () => {
  // create an instance of the engine with all the defaults

  const topics = Object.keys(conf.topics).map((t) => ({
    key: `topic.${t}`,
    type: "topic",
    name: `${t}`,
    component: (
      <div style={{ width: "200px", backgroundColor: "aliceblue" }}>
        <strong>{t}</strong>
        {[`rate ${formatNumber(conf.topics[t])}`].map((v) => (
          <div>{v}</div>
        ))}
      </div>
    ),
  }));
  const services = conf.services.map((s) => ({
    key: `service.${s.name}`,
    type: "service",
    name: s.name,
    component: (
      <Service
        name={s.name}
        topicLag={s.cgs.flatMap((cg) =>
          Object.keys(cg.lag).flatMap((t) => ({ topic: t, lag: cg.lag[t] }))
        )}
      />
      // <div style={{ width: "200px", backgroundColor: "lightgreen" }}>
      //   <strong>{s.name}</strong>
      //   {[
      //     ...s.cgs.flatMap((c) => {
      //       return Object.keys(c.lag).flatMap((t) => {
      //         return `${t} - ${formatNumber(c.lag[t])}`;
      //       });
      //     }),
      //   ].map((v) => (
      //     <div>{v}</div>
      //   ))}
      // </div>
    ),
  }));
  const vertices = [...topics, ...services];

  const producers = conf.services.flatMap((s) =>
    s.producesTo.map((t) => ({ from: `service.${s.name}`, to: `topic.${t}` }))
  );

  const consumers = conf.services.flatMap((s) =>
    s.cgs.flatMap((cg) =>
      Object.keys(cg.lag).map((t) => ({
        from: `topic.${t}`,
        to: `service.${s.name}`,
      }))
    )
  );

  const edges = [...producers, ...consumers];

  const lm = new LayoutManager({
    useDotEdges: true,
    rankdir: "TB",
    ranksep: 1.1,
  });
  // style={{ height: "100%" }}>
  return (
    <div className="app-wrapper">
      <>
        <div className="demo-row">
          <DirectedGraph
            zoom
            edges={edges}
            vertices={vertices}
            getNodeLabel={(vertex) => vertex.component}
            setOnGraph={{
              style: {
                fontFamily: "sans-serif",
                height: "100%",
                position: "fixed",
                width: "100%",
              },
            }}
            layoutManager={lm}
            measurableNodesKey="nodes"
            layers={[
              {
                key: "edges",
                edges: true,
                layerType: "svg",
                defs: [{ localId: "edge-arrow" }],
                markerEndId: "edge-arrow",
              },
              {
                key: "nodes",
                layerType: "html",
                measurable: true,
                setOnNode: {
                  style: {
                    padding: "1rem",
                    whiteSpace: "nowrap",
                    background: "#e8e8e8",
                  },
                },
              },
            ]}
          />
        </div>
      </>
    </div>
  );

  // const services = conf.services.map((s) => {
  //   const serv = new DefaultNodeModel({});
  //   serv.setPosition(500, 500);
  //   const producerLinks = s.producesTo.map((t) => {
  //     return serv
  //       .addOutPort(`p ${t}`)
  //       .link(topics[t].node.addInPort(`p ${s.name}`));
  //   });
  //   const consumerLinks = s.cgs.flatMap((c) => {
  //     return Object.keys(c.lag).flatMap((t) => {
  //       return topics[t].node
  //         .addOutPort(`cg ${s.name}`)
  //         .link(serv.addInPort(`c ${t}`));
  //     });
  //   });
  //   return { serv, producerLinks, consumerLinks };
  // });

  // const model = new DiagramModel();
  // const topicNodes = Object.values(topics).map((t) => t.node);
  // const serviceNodes = services.map((s) => s.serv);
  // const producerLinks = services.flatMap((s) => s.producerLinks);
  // const consumerLinks = services.flatMap((s) => s.consumerLinks);
  // const serviceNodeMap = serviceNodes.reduce(
  //   (agg, s) => ({ ...agg, [s.options.id]: s }),
  //   {}
  // );
  // const topicNodeMap = topicNodes.reduce(
  //   (agg, t) => ({ ...agg, [t.options.id]: t }),
  //   {}
  // );
  // model.addAll(
  //   ...topicNodes,
  //   ...serviceNodes,
  //   ...producerLinks,
  //   ...consumerLinks
  // );

  // engine.setModel(model);

  // const save = () => {
  //   const mapToPos = (val) => {
  //     const ser = val.serialize();
  //     return { id: ser.id, x: ser.x, y: ser.y };
  //   };
  //   const servicePositions = serviceNodes.map(mapToPos);
  //   const topicPositions = topicNodes.map(mapToPos);
  //   const positions = { services: servicePositions, topics: topicPositions };
  //   fetch(`http://localhost:9081/pos`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(positions),
  //   });
  // };

  // const load = () => {
  //   fetch("http://localhost:9081/pos")
  //     .then((p) => p.json())
  //     .then((b) => {
  //       b.services.forEach((e) => serviceNodeMap[e.id].setPosition(e.x, e.y));
  //       b.topics.forEach((e) => topicNodeMap[e.id].setPosition(e.x, e.y));
  //     })
  //     .then((e) => engine.repaintCanvas());
  // };
  // const prometheus = () => {
  //   fetch("http://localhost:9081/")
  //     .then((p) => p.json())
  //     .then((b) => {
  //       Object.keys(b.topics).map((t) => {
  //         const node = topicNodeMap[`topic.${t}`];
  //         const ser = node.serialize();
  //         ser.name = `${t} (${b.topics[t]})`;
  //         node.deserialize(ser);
  //         console.log(ser);
  //       });
  //     });
  // };

  // load();

  // return (
  //   <div className="app-wrapper">
  //     <div
  //       style={{ height: "100%", width: "90%", backgroundColor: "aliceblue" }}
  //     >
  //       <CanvasWidget className="canvas" engine={engine} />
  //     </div>
  //     <div>
  //       <button onClick={save}>save</button>
  //       <button onClick={load}>load</button>
  //       <button onClick={prometheus}>prometheus</button>
  //     </div>
  //   </div>
  // );
};

export default App;
