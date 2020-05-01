import { LOAD_CONFIG } from "../actionTypes";
const initialConfig = require("./conf.json");

const initialState = {
  config: initialConfig,
  weights: weights(initialConfig.topics.map((t) => t.eventRate)),
  topicRates: topicRates(initialConfig.topics),
};

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

function toScaleFn(rates) {
  const arr = rates.slice().sort((a, b) => a - b);
  const minRate = arr[0];
  const maxRate = arr[arr.length - 1];
  return (min, max) => {
    return (max - min) / (maxRate - minRate);
  };
}

function weights(rates) {
  const scaleFn = toScaleFn(rates);
  const [minS, maxS] = [1, 3];
  const [minO, maxO] = [0.5, 1];
  const scaleS = scaleFn(minS, maxS);
  const scaleO = scaleFn(minO, maxO);
  console.log("scaling is", scaleS, scaleO);
  return {
    size: { scale: scaleS, min: minS },
    opacity: { scale: scaleO, min: minO },
  };
}

function topicRates(topics) {
  return topics.reduce((acc, t) => ({ ...acc, [t.name]: t.eventRate }), {});
}

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
        weights: weights(newConf.topics.map((t) => t.eventRate)),
        topicRates: topicRates(newConf.topics),
      };
      return newState;
    }
    default:
      return state;
  }
}
