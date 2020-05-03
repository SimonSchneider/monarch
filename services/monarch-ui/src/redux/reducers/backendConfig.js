import { LOAD_BACKEND_CONFIG } from "../actionTypes";

const initialState = {
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_BACKEND_CONFIG: {
      return {
        config: action.payload,
        loaded: true
      };
    }
    default:
      return state;
  }
}
