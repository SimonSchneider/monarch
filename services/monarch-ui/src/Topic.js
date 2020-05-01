import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

const Topic = ({ name } = {}) => {
  const { eventRate } = useSelector((state) =>
    state.config.config.topics.find((t) => t.name === name)
  );
  return (
    <div className={styles.topic}>
      <div>
        <div>
          <strong>{name}</strong>
        </div>
        {helpers.formatNumber(eventRate)} event/s
      </div>
    </div>
  );
};

export default Topic;
