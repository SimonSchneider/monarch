import React from "react";
import TopologyGraph from "./TopologyGraph";
import Configuration from "./Configuration";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import styles from "./grid.module.css";
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useDispatch, useSelector } from "react-redux";
import { LOAD_CONFIG, LOAD_BACKEND_CONFIG } from "./redux/actionTypes";

const Content = (loaded) => {
  if (!loaded) {
    return (<div className={styles.contentWrapper}>LOADING STUFF</div>)
  }
  return (<div className={styles.contentWrapper}>
    <Route exact path="/" component={TopologyGraph} />
    <Route exact path="/graph" component={TopologyGraph} />
    <Route path="/config" component={Configuration} />
  </div>);
}

const App = () => {

  const loaded = useSelector((state) => state.config.loaded);
  const loadedBe = useSelector((state) => state.backendConfig.loaded);
  const dispatch = useDispatch();

  const update = async ({ state = "good" } = {}) => {
    const fromBe = await fetch(`/api/v1/curr?state=${state}`, { headers: { Authorization: state } }).then((r) => r.json());
    dispatch({ type: LOAD_CONFIG, payload: fromBe });
  };
  const updateBe = async () => {
    const fromBe = await fetch(`/api/v1/configurations`).then((r) => r.json());
    dispatch({ type: LOAD_BACKEND_CONFIG, payload: fromBe });
  }

  if (!loaded) {
    update();
  }
  if (!loadedBe) {
    updateBe();
  }

  return (
    <HashRouter>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <div>
            <NavLink to="/graph"><TimelineIcon className={styles.sidebarIcon} /></NavLink>
            <NavLink to="/config"><SettingsIcon className={styles.sidebarIcon} /></NavLink>
          </div>
          <div className={styles.bottomIcons}>
            <RefreshIcon onClick={() => update({ state: "good" })} className={styles.sidebarIcon} style={{ color: "green" }} />
            <RefreshIcon onClick={() => update({ state: "warn" })} className={styles.sidebarIcon} style={{ color: "yellow" }} />
            <RefreshIcon onClick={() => update({ state: "crit" })} className={styles.sidebarIcon} style={{ color: "red" }} />
          </div>
        </div>
        {Content(loaded && loadedBe)}
      </div>
    </HashRouter >
  );
};

export default App;
