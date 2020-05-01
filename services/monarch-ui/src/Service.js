import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

const Service = ({ name }) => {
  const consumerGroupInfo = useSelector((state) => state.config.consumerGroupInfo.filter((cg) => name === cg.serviceName));
  const badCgs = consumerGroupInfo
    .filter((cg) => cg.performance === "CRITICAL" || cg.performance === "WARNING");
  const style = badCgs.length === 0 ? styles.ok : badCgs.find((cg) => cg.performance === "CRITICAL") ? styles.critical : styles.warning;
  return (
    <div key={name} className={`${styles.service} ${style}`}>
      <strong>{name}</strong>
      {badCgs.map((cg) => {
        return (
          <div key={name + cg.name}>
            {cg.topic} - lag {helpers.formatNumber(cg.lag)} - consumption rate {helpers.formatNumber(cg.consumptionRate)}
          </div>
        );
      })}
    </div>
  );
};

export default Service;
