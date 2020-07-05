import { combineReducers } from "redux";
import currentState from "./currentState";
import config from "./config";

export default combineReducers({ currentState: currentState, config: config });
