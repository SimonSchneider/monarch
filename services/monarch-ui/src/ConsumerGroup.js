import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";

const ConsumerGroup = ({ name }) => {
  const { topics } = useSelector((state) =>
    state.config.config.consumerGroups.find((s) => s.name === name)
  );
  return (
    <div
      key={name}
      style={{
        backgroundColor: "mediumpurple",
        padding: "0.5rem",
        whiteSpace: "nowrap",
      }}
    >
      <strong>{name}</strong>
      {topics.map((t) => {
        return (
          <div key={name + t.name}>
            {t.name} - {helpers.formatNumber(t.lag)}
          </div>
        );
      })}
    </div>
  );
};

export default ConsumerGroup;
