import React from "react";
import { useSelector } from "react-redux";
import gridStyles from "./grid.module.css";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const Configuration = () => {
  const config = useSelector((state) => state.backendConfig.config);
  return (
    <div className={gridStyles.content} style={{ overflow: "justified" }} >
      <JSONInput
        placeholder={config}
        locale={locale}
        waitAfterKeyPress={2000}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default Configuration;
