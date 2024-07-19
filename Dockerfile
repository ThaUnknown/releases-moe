FROM golang:1.21.5-alpine AS builder
WORKDIR /build
COPY pb/go.mod pb/go.sum pb/main.go ./
COPY pb/hooks ./hooks
RUN apk --no-cache add upx make git gcc libtool musl-dev ca-certificates dumb-init \
  && go mod tidy \
  && CGO_ENABLED=0 go build \
  && upx pocketbase

FROM node:alpine
WORKDIR /app/pb
COPY --from=builder /build/pocketbase /app/pb/pocketbase
COPY pb/pb_migrations ./pb_migrations
CMD /app/pb/pocketbase serve --http 0.0.0.0:59992; PORT=59991 node /app/sk/server.js