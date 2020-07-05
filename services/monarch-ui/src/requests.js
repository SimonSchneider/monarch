import { refreshState, loadConfig, loadingConfig } from "./redux/actions";

const updateState = (dispatch) => {
  return async () => {
    const currentState = await fetch(`/api/v1/curr`).then((r) => r.json());
    dispatch(refreshState(currentState));
  };
};

const updateConfig = (dispatch) => {
  return async () => {
    dispatch(loadingConfig());
    const fromBe = await fetch(`/api/v1/configurations`).then((r) => r.json());
    dispatch(loadConfig(fromBe));
  };
};

export default (dispatch) => ({
  refreshState: updateState(dispatch),
  updateConfig: updateConfig(dispatch),
  newConfig: async (config) => {
    if (!config) {
      return;
    }
    await fetch(`/api/v1/configurations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    await updateState(dispatch)();
    await updateConfig(dispatch)();
  },
});
