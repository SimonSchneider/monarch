import React from "react";
import { useSelector } from "react-redux";

const VisualConfig = () => {
  const config = useSelector((state) => state.existingResources);
  if (!config.loaded) {
    return <div style={{ overflow: "justified" }}>Loading...</div>;
  }
  console.log(config);
  return (
    <div style={{ overflow: "justified" }}>
      <div>
        Services:
        {config.config.services.map((s) => (
          <div key={`visual-config-service-${s.name}`}>{JSON.stringify(s)}</div>
        ))}
      </div>
      <div>
        Topics:
        {config.config.topics.map((t) => (
          <div key={`visual-config-topic-${t.name}`}>{JSON.stringify(t)}</div>
        ))}
      </div>
      <div>
        ConsumerGroups:
        {config.config.consumerGroups.map((c) => (
          <div key={`visual-config-consumergroup-${c.name}`}>
            {JSON.stringify(c)}
          </div>
        ))}
      </div>
    </div>
  );
};

VisualConfig.displayName = "Visual Config";

export default VisualConfig;
