FROM golang:1.21.5-alpine AS backend-builder

WORKDIR /app/pb
COPY ./pb .

RUN go mod tidy && go build

FROM node:22-alpine AS frontend-builder

WORKDIR /app/sk
COPY ./sk .

RUN npm install -g pnpm
RUN pnpm install
RUN npm run build

FROM node:22-alpine

# Copy PocketBase files
COPY --from=backend-builder /app/pb/pocketbase /app/pb/pocketbase
COPY --from=backend-builder /app/pb/pb_hooks/ /app/pb/pb_hooks/
COPY --from=backend-builder /app/pb/pb_migrations/ /app/pb/pb_migrations/

# Copy Sveltekit files
COPY --from=frontend-builder /app/sk/build/ /app/sk/build/
COPY --from=frontend-builder /app/sk/node_modules/ /app/sk/node_modules/
COPY --from=frontend-builder /app/sk/server.js /app/sk/server.js

WORKDIR /app/sk

ENV NODE_ENV=production \
    # Frontend port
    PORT=59991 \
    # Backend proxy
    PROXY_TARGET=http://0.0.0.0:59992

# Start both services
# DO NOT CHANGE `/app/pb/pb_data`. Setting `--dir` to anything else breaks the frontend.
CMD ["/bin/sh", "-c", "/app/pb/pocketbase serve --http 0.0.0.0:59992 --dir /app/pb/pb_data & node server.js"]
