package monarch

type Configuration struct {
	topics         TopicQuery
	consumerGroups ConsumerGroupQuery
	metrics        Metrics
	services       []Service
}

type TopicQuery struct {
	query string
	key   string
}

type ConsumerGroupQuery struct {
	lagQuery  string
	rateQuery string
	topicKey  string
	groupKey  string
}

type Metrics struct {
	requests struct {
		rateQuery     string
		errorQuery    string
		durationQuery string
		serviceKey    string
	}
}

type Service struct {
	requestsFrom   []string
	producerRegex  string
	consumerGroups []string
}
