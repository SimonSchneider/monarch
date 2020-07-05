import {
  REFRESH_STATE,
  REFRESHING_STATE,
  LOAD_CONFIG,
  LOADING_CONFIG,
} from "./actionTypes";

export const refreshState = (currentState) => ({
  type: REFRESH_STATE,
  payload: currentState,
});

export const refreshingState = () => ({
  type: REFRESHING_STATE,
});

export const loadConfig = (config) => ({
  type: LOAD_CONFIG,
  payload: config,
});

export const loadingConfig = () => ({
  type: LOADING_CONFIG,
});
