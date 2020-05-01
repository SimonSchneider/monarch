import React, { Component } from "react";
import helpers from "./utils";

const Service = ({ name, topicLag = [] } = {}) => {
  console.log(topicLag);
  return (
    <div style={{ width: "200px", backgroundColor: "lightgreen" }}>
      <strong>{name}</strong>
      {topicLag
        .map((t) => {
          return `${t.topic} - ${helpers.formatNumber(t.lag)}`;
        })
        .map((v) => (
          <div>{v}</div>
        ))}
    </div>
  );
};

export default Service;
