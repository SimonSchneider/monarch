import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";
import PropTypes from "prop-types";

const Topic = ({ name }) => {
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

Topic.displayName = "Topic";
Topic.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Topic;
