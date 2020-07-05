import { REFRESH_STATE, REFRESHING_STATE } from "../actionTypes";

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

const sortConsumerGroups = (cgs, existingTopics) => {
  return cgs.sort(cmp((c) => c.name)).map((c) => ({
    ...c,
    topics: c.topics
      .filter((t) => existingTopics.has(t.name))
      .sort(cmp((t) => t.name)),
  }));
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
    case REFRESH_STATE: {
      const existingTopics = new Set(action.payload.topics.map((t) => t.name));
      const existingServices = new Set(
        action.payload.services.map((s) => s.name)
      );
      const newConf = {
        topics: action.payload.topics.sort(cmp((t) => t.name)),
        consumerGroups: sortConsumerGroups(
          action.payload.consumerGroups,
          existingTopics
        ),
        services: action.payload.services.sort(cmp((s) => s.name)).map((s) => ({
          ...s,
          requestsFrom: s.requestsFrom.filter((st) => existingServices.has(st)),
          consumerGroups: sortConsumerGroups(s.consumerGroups, existingTopics),
        })),
      };
      const topicRates = mapToTopicRates(newConf.topics);
      const consumerGroupInfo = [
        ...newConf.services.flatMap((s) =>
          cgInfo(s.consumerGroups, topicRates, s.name)
        ),
      ];
      return {
        config: newConf,
        weights: weights(newConf.topics.map((t) => t.eventRate)),
        topicRates,
        consumerGroupInfo,
        loaded: true,
      };
    }
    case REFRESHING_STATE: {
      return {
        ...state,
        loaded: false,
      };
    }
    default:
      return state;
  }
}
