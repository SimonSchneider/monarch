import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

const Service = ({ name }) => {
  const { consumerGroups } = useSelector((state) =>
    state.config.config.services.find((s) => s.name === name)
  );
  const highLagCgs = consumerGroups
    .flatMap((cg) => cg.topics)
    .filter((t) => t.lag > 20000);
  const style = highLagCgs.length === 0 ? styles.ok : styles.warning;
  return (
    <div key={name} className={`${styles.service} ${style}`}>
      <strong>{name}</strong>
      {highLagCgs.map((t) => {
        return (
          <div key={name + t.name}>
            {t.name} - {helpers.formatNumber(t.lag)}
          </div>
        );
      })}
    </div>
  );
};

export default Service;
