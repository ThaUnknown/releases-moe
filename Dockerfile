FROM golang:1.21.5-alpine AS backend-builder

WORKDIR /app/pb
COPY ./pb .

RUN go mod tidy && go build

FROM node:alpine AS frontend-builder

WORKDIR /app/sk

RUN apk add --no-cache git

COPY ./sk .

RUN npm install -g pnpm
RUN pnpm install
RUN npm run build

FROM node:alpine

RUN apk add --no-cache git

# Copy PocketBase files
COPY --from=backend-builder /app/pb/pocketbase /app/pb/pocketbase
COPY --from=backend-builder /app/pb/pb_hooks/ /app/pb/pb_hooks/
COPY --from=backend-builder /app/pb/pb_migrations/ /app/pb/pb_migrations/

# Copy Sveltekit files
COPY --from=frontend-builder /app/sk/build/ /app/sk/build/
COPY --from=frontend-builder /app/sk/package.json /app/sk/package.json
COPY --from=frontend-builder /app/sk/pnpm-lock.yaml /app/sk/pnpm-lock.yaml
COPY --from=frontend-builder /app/sk/server.js /app/sk/server.js

RUN npm install -g pnpm

WORKDIR /app/sk
# Install Sveltekit dependencies
RUN pnpm install

    # Frontend port
ENV PORT=59991 \
    # Backend proxy
    PROXY_TARGET=http://0.0.0.0:59992

# Start both services
CMD ["/bin/sh", "-c", "/app/pb/pocketbase serve --http 0.0.0.0:59992 --dir /data & node server.js"]
