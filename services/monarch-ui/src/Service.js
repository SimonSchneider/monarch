import React from "react";
import helpers from "./utils";
import { useSelector } from "react-redux";
import styles from "./arch.module.css";

function toTopicInfo(cgs) {
  return cgs.map((cg) => (<div key={cg.consumerGroup + cg.topic}>
    lagging by { helpers.formatNumber(cg.lag)} events on '{cg.topic}' consuming { helpers.formatNumber(cg.consumptionRate)} events/s
  </div>));
}

function hasMetrics(metrics) {
  return metrics && metrics.requests && (metrics.requests.rate || metrics.requests.errors || metrics.requests.duration);
}

function formatMetrics(metrics) {
  return (
    <div>
      <div>rate: {helpers.formatNumber(metrics.requests.rate)} r/s</div>
      <div>errors: {helpers.formatNumber(metrics.requests.errors)} /minute</div>
      <div>duration: {helpers.formatNumber(metrics.requests.duration)} s (p99)</div> 
    </div>
  );
}

const Service = ({ name }) => {
  const service = useSelector((state) => state.config.config.services.find((s) => s.name === name));
  const consumerGroupInfo = useSelector((state) => state.config.consumerGroupInfo.filter((cg) => name === cg.serviceName));
  const critical = consumerGroupInfo
    .filter((cg) => cg.performance === "CRITICAL");
  const warning = consumerGroupInfo
    .filter((cg) => cg.performance === "WARNING");
  const style = critical.length > 0 ? styles.critical : warning.length > 0 ? styles.warning : styles.ok;
  return (
    <div key={name} className={`${styles.service} ${style} ${styles.infoDriver}`}>
      <h1>{name}</h1>
      <span>
        {critical.length > 0 && (<h2>Critical</h2>)}
        {toTopicInfo(critical)}
        {warning.length > 0 && (<h2>Warning</h2>)}
        {toTopicInfo(warning)}
        {hasMetrics(service.metrics) && (<h2>Info</h2>)}
        {hasMetrics(service.metrics) && formatMetrics(service.metrics)}
      </span>
    </div >
  );
};

export default Service;
