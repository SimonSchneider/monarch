import { REFRESHING_STATE, REFRESH_STATE } from "../actionTypes";

const initialState = {
  loaded: false,
};

const toTopic = (t, extra = {}) => ({ name: t.name, ...extra });

const toConsumerGroup = (extra = {}) => (c) => ({ name: c.name, ...extra });

export default function (state = initialState, action) {
  switch (action.type) {
    case REFRESH_STATE: {
      const topicProducers = new Map();
      action.payload.services.forEach((s) =>
        s.producesTo.forEach((t) => topicProducers.set(t, s.name))
      );
      return {
        config: {
          services: action.payload.services.map((s) => ({ name: s.name })),
          topics: action.payload.topics.map((t) =>
            toTopic(t, { producedToBy: topicProducers.get(t.name) })
          ),
          consumerGroups: [
            ...action.payload.services.flatMap((s) =>
              s.consumerGroups.map(toConsumerGroup({ ownedBy: s.name }))
            ),
            ...action.payload.consumerGroups.map(toConsumerGroup()),
          ],
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
