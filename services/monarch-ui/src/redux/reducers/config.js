import { LOAD_CONFIG, LOADING_CONFIG } from "../actionTypes";

const initialState = {
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG: {
      return {
        config: action.payload,
        loaded: true,
      };
    }
    case LOADING_CONFIG: {
      const { loaded, ...oldState } = state;
      return {
        ...oldState,
        loaded: false,
      };
    }
    default:
      return state;
  }
}
