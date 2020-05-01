import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

const Service = ({ name }) => {
  const { consumerGroups } = useSelector((state) =>
    state.config.config.services.find((s) => s.name === name)
  );
  return (
    <div key={name} className={styles.service}>
      <strong>{name}</strong>
      {consumerGroups
        .flatMap((cg) => cg.topics)
        .filter((t) => t.lag > 20000)
        .map((t) => {
          return (
            <div>
              {t.name} - {helpers.formatNumber(t.lag)}
            </div>
          );
        })}
    </div>
  );
};

export default Service;
