import React from "react";
import TopologyGraph from "./TopologyGraph";
import Configuration from "./Configuration";
import VisualConfig from "./VisualConfig";
import { Route, NavLink, HashRouter } from "react-router-dom";
import styles from "./grid.module.css";
import TimelineIcon from "@material-ui/icons/Timeline";
import SettingsIcon from "@material-ui/icons/Settings";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch, useSelector } from "react-redux";
import actions from "./requests";
import schedule from "./scheduler";

const Content = (loaded) => {
  if (!loaded) {
    return <div className={styles.contentWrapper}>LOADING STUFF</div>;
  }
  return (
    <div className={styles.contentWrapper}>
      <Route exact path="/" component={TopologyGraph} />
      <Route exact path="/graph" component={TopologyGraph} />
      <Route path="/config" component={Configuration} />
      <Route path="/visual-config" component={VisualConfig} />
    </div>
  );
};

const App = () => {
  const stateLoaded = useSelector((state) => state.currentState.loaded);
  const configLoaded = useSelector((state) => state.config.loaded);
  const dispatch = useDispatch();
  const { refreshState, updateConfig } = actions(dispatch);

  if (!stateLoaded) {
    schedule("update", 15000, refreshState);
  }
  if (!configLoaded) {
    updateConfig();
  }

  return (
    <HashRouter>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <div>
            <NavLink to="/graph">
              <TimelineIcon className={styles.sidebarIcon} />
            </NavLink>
            <NavLink to="/config">
              <SettingsIcon className={styles.sidebarIcon} />
            </NavLink>
            <NavLink to="/visual-config">
              <SettingsIcon
                className={styles.sidebarIcon}
                style={{ color: "red" }}
              />
            </NavLink>
          </div>
          <div className={styles.bottomIcons}>
            <RefreshIcon
              onClick={() => refreshState()}
              className={styles.sidebarIcon}
            />
          </div>
        </div>
        {Content(stateLoaded && configLoaded)}
      </div>
    </HashRouter>
  );
};

App.displayName = "App";

export default App;
