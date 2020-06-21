package monarch

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"net/http"
)

type Monarch struct {
	Addr string
}

func (s *Monarch) Run(ctx context.Context) error {
	l, err := net.Listen("tcp", s.Addr)
	if err != nil {
		return err
	}
	fs := http.FileServer(http.Dir("./dist"))
	done := make(chan error)
	go func() {
		defer close(done)
		mux := http.NewServeMux()
		mux.HandleFunc("/api/v1/configurations/", s.getConfig)
		mux.Handle("/", fs)
		srv := &http.Server{}
		srv.Handler = mux
		done <- srv.Serve(l)
	}()
	select {
	case err := <-done:
		return err
	case <-ctx.Done():
		err := l.Close()
		if err != nil {
			return err
		}
	}
	return nil
}

func (s *Monarch) getConfig(rw http.ResponseWriter, r *http.Request) {
	config := Configuration{
		topics:         TopicQuery{},
		consumerGroups: ConsumerGroupQuery{},
		metrics:        Metrics{},
		services:       nil,
	}
	err := json.NewEncoder(rw).Encode(config)
	if err != nil {
		log.Println("unable to write config to response")
		rw.WriteHeader(500)
	}
}
