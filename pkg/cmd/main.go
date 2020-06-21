package main

import (
	"context"

	"github.com/SimonSchneider/monarch/pgk/monarch"
)

func main() {
	panic((&monarch.Monarch{Addr: ":8080"}).Run(context.Background()))
}
