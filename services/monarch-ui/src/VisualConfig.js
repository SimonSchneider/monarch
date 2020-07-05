import React from "react";
import { useSelector } from "react-redux";

const VisualConfig = () => {
  const config = useSelector((state) => state.existingResources);
  if (!config.loaded) {
    return <div style={{ overflow: "justified" }}>Loading...</div>;
  }
  return (
    <div style={{ overflow: "justified" }}>
      {JSON.stringify(config, undefined, 2)}
    </div>
  );
};

VisualConfig.displayName = "Visual Config";

export default VisualConfig;
