import { LOAD_CONFIG } from "./actionTypes";

export const loadConfig = (config) => ({
  type: LOAD_CONFIG,
  payload: config,
});
