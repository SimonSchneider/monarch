import { LOAD_CONFIG, LOAD_BACKEND_CONFIG } from "./actionTypes";

export const loadConfig = (config) => ({
  type: LOAD_CONFIG,
  payload: config,
});

export const loadBackendConfig = (backendConfig) => ({
  type: LOAD_BACKEND_CONFIG,
  payload: backendConfig
})