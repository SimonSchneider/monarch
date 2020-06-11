import { LOAD_CONFIG, LOADING_CONFIG } from "../actionTypes";

const initialState = {
  loaded: false,
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
  return {
    size: { scale: scaleS, min: minS },
    opacity: { scale: scaleO, min: minO },
  };
}

function mapToTopicRates(topics) {
  return topics.reduce((acc, t) => ({ ...acc, [t.name]: t.eventRate }), {});
}

function consumerGroupPerformance(topicRate, cgRate, cgLag) {
  if (topicRate >= 1 && cgRate <= 0.1 * topicRate) {
    return "CRITICAL";
  }
  if (cgLag >= 20000) {
    return "WARNING";
  }
  return "OK";
}

function cgInfo(cgs, topicRates, serviceName) {
  return cgs.flatMap((cg) =>
    cg.topics.map((t) => ({
      consumerGroup: cg.name,
      serviceName,
      topic: t.name,
      lag: t.lag,
      consumptionRate: t.rate,
      productionRate: topicRates[t.name],
      performance: consumerGroupPerformance(topicRates[t.name], t.rate, t.lag),
    }))
  );
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
      const topicRates = mapToTopicRates(newConf.topics);
      const consumerGroupInfo = [
        ...newConf.consumerGroups.map((cg) => cgInfo(cg, topicRates)),
        ...newConf.services.flatMap((s) =>
          cgInfo(s.consumerGroups, topicRates, s.name)
        ),
      ];
      const newState = {
        config: newConf,
        weights: weights(newConf.topics.map((t) => t.eventRate)),
        topicRates,
        consumerGroupInfo,
        loaded: true,
      };
      console.log(newState);
      return newState;
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
