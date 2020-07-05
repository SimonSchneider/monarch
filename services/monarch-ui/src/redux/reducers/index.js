import { combineReducers } from "redux";
import currentState from "./currentState";
import config from "./config";
import existingResources from "./existingResources";

export default combineReducers({
  currentState: currentState,
  config: config,
  existingResources: existingResources,
});
