import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

export default ({ name } = {}) => {
  const { eventRate } = useSelector((state) =>
    state.currentState.config.topics.find((t) => t.name === name)
  );
  return (
    <div className={styles.topic}>
      <h1>{name}</h1>
      {helpers.formatNumber(eventRate)} event/s
    </div>
  );
};
