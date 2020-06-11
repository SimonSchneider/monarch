import {
  LOAD_CONFIG,
  LOADING_CONFIG,
  LOAD_BACKEND_CONFIG,
  LOADING_BACKEND_CONFIG,
} from "./actionTypes";

export const loadConfig = (config) => ({
  type: LOAD_CONFIG,
  payload: config,
});

export const loadingConfig = () => ({
  type: LOADING_CONFIG,
});

export const loadBackendConfig = (backendConfig) => ({
  type: LOAD_BACKEND_CONFIG,
  payload: backendConfig,
});

export const loadingBackendConfig = () => ({
  type: LOADING_BACKEND_CONFIG,
});
