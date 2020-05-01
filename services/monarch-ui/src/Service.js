import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

function toTopicInfo(cgs) {
  return cgs.map((cg) => (<div key={cg.consumerGroup + cg.topic}>
    lagging by { helpers.formatNumber(cg.lag)} events on '{cg.topic}' consuming { helpers.formatNumber(cg.consumptionRate)} events/s
  </div>));
}

const Service = ({ name }) => {
  const consumerGroupInfo = useSelector((state) => state.config.consumerGroupInfo.filter((cg) => name === cg.serviceName));
  const critical = consumerGroupInfo
    .filter((cg) => cg.performance === "CRITICAL");
  const warning = consumerGroupInfo
    .filter((cg) => cg.performance === "WARNING");
  const style = critical.length > 0 ? styles.critical : warning.length > 0 ? styles.warning : styles.ok;
  return (
    <div key={name} className={`${styles.service} ${style} ${styles.infoDriver}`}>
      <strong>{name}</strong>
      <span>
        {critical.length > 0 && "Critical"}
        {toTopicInfo(critical)}
        {warning.length > 0 && "Warning"}
        {toTopicInfo(warning)}
      </span>
    </div >
  );
};

export default Service;
