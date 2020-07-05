import React, { useState } from "react";
import gridStyles from "./grid.module.css";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import actions from "./requests";
import styles from "./grid.module.css";

const Configuration = () => {
  const config = useSelector((state) => state.config.config);
  const dispatch = useDispatch();
  const { refreshState, updateConfig, newConfig } = actions(dispatch);
  const [localConfig, setLocalConfig] = useState(config);
  return (
    <div className={gridStyles.content} style={{ overflow: "justified" }}>
      <div className={styles.sidebar}>
        <ClearIcon
          onClick={() => {
            refreshState();
            updateConfig();
          }}
          className={styles.sidebarIcon}
        />
        <CheckIcon
          onClick={() => newConfig(localConfig)}
          className={styles.sidebarIcon}
        />
      </div>
      <JSONInput
        placeholder={localConfig}
        locale={locale}
        onKeyPressUpdate={false}
        height="calc(100vh - 40px)"
        width="100%"
        onChange={(c) => setLocalConfig(c.jsObject)}
      />
    </div>
  );
};

Configuration.displayName = "Configuration";

export default Configuration;
