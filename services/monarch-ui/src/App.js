import React from "react";
import TopologyGraph from "./TopologyGraph";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import styles from "./grid.module.css";
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';

const App = () => {
  return (
    <HashRouter>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <NavLink to="/graph"><TimelineIcon className={styles.sidebarIcon} /></NavLink>
          <NavLink to="/config"><SettingsIcon className={styles.sidebarIcon} /></NavLink>
        </div>
        <div className={styles.contentWrapper}>
          <Route exact path="/" component={TopologyGraph} />
          <Route exact path="/graph" component={TopologyGraph} />
          <Route path="/config" component={() => (<div>Yello!!</div>)} />
        </div>
      </div>
    </HashRouter >
  );
};

export default App;
