import React, { useState } from "react";
import gridStyles from "./grid.module.css";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { useDispatch, useSelector } from "react-redux";
import actions from "./requests";

export default () => {
  const config = useSelector((state) => state.backendConfig.config);
  const dispatch = useDispatch();
  const { newConfig } = actions(dispatch);
  const [localConfig, setLocalConfig] = useState(config);
  return (
    <div className={gridStyles.content} style={{ overflow: "justified" }}>
      <button onClick={() => newConfig(localConfig)}>Gurka</button>
      <JSONInput
        placeholder={localConfig}
        locale={locale}
        waitAfterKeyPress={1000}
        height="100%"
        width="100%"
        onChange={(c) => setLocalConfig(c.jsObject)}
      />
    </div>
  );
};
