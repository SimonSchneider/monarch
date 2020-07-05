import { REFRESHING_STATE, REFRESH_STATE } from "../actionTypes";

const initialState = {
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REFRESH_STATE: {
      return {
        config: {
          services: action.payload.services.map((s) => ({ name: s.name })),
          topics: action.payload.topics.map((s) => ({ name: s.name })),
          consumerGroups: action.payload.consumerGroups.map((s) => ({
            name: s.name,
          })),
        },
        loaded: true,
      };
    }
    case REFRESHING_STATE: {
      return {
        loaded: false,
      };
    }
    default:
      return state;
  }
}
