import { LOAD_CONFIG } from "../actionTypes";
const initialConfig = require("../../conf2.json");

console.log("initial config", initialConfig);

const initialState = {
  config: initialConfig,
};

console.log("initial state", initialState);

function cmp(extractor) {
  return (a, b) => {
    const bandA = extractor(a);
    const bandB = extractor(b);
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };
}

const sortConsumerGroups = (cgs) => {
  return cgs
    .sort(cmp((c) => c.name))
    .map((c) => ({ ...c, topics: c.topics.sort(cmp((t) => t.name)) }));
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG: {
      const newConf = {
        topics: action.payload.topics.sort(cmp((t) => t.name)),
        consumerGroups: sortConsumerGroups(action.payload.consumerGroups),
        services: action.payload.services.sort(cmp((s) => s.name)).map((s) => ({
          ...s,
          consumerGroups: sortConsumerGroups(s.consumerGroups),
        })),
      };
      console.log(newConf);
      const newState = {
        ...state,
        config: newConf,
      };
      return newState;
    }
    default:
      return state;
  }
}
