import {
  loadConfig,
  loadBackendConfig,
  loadingBackendConfig,
} from "./redux/actions";

const update = (dispatch) => {
  return async () => {
    const fromBe = await fetch(`/api/v1/curr`).then((r) => r.json());
    dispatch(loadConfig(fromBe));
  };
};

const updateBe = (dispatch) => {
  return async () => {
    dispatch(loadingBackendConfig());
    const fromBe = await fetch(`/api/v1/configurations`).then((r) => r.json());
    dispatch(loadBackendConfig(fromBe));
  };
};

export default (dispatch) => ({
  update: update(dispatch),
  updateBe: updateBe(dispatch),
  newConfig: async (config) => {
    if (!config) {
      return;
    }
    await fetch(`/api/v1/configurations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    update(dispatch)();
    updateBe(dispatch)();
  },
});
