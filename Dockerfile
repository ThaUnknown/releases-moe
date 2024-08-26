# Base image for the "pb" service
FROM golang:1.21.5-alpine AS pb

WORKDIR /app/pb

COPY ./pb .

RUN go mod tidy && go build

RUN go install github.com/cortesi/modd/cmd/modd@latest

# Base image for the "sk" service
FROM node:alpine AS sk

WORKDIR /app/sk

COPY ./sk .

RUN npm install -g pnpm
RUN pnpm install
RUN npm run build

# Final image
FROM node:alpine AS prod

WORKDIR /app

# Copy PocketBase files
COPY --from=pb /app/pb/pocketbase /app/pb/
COPY --from=pb /go/bin/modd /usr/local/bin/

# Copy Sveltekit files
COPY --from=sk /app/sk/build /app/sk/build
COPY --from=sk /app/sk/package.json /app/sk/
COPY --from=sk /app/sk/server.js /app/sk/

RUN npm install -g pnpm

# Install Sveltekit dependencies
WORKDIR /app/sk
RUN pnpm install

# Set up volume for PocketBase only
VOLUME ["/app/pb"]

# Expose ports
EXPOSE 59991 59992

# Start both services
CMD sh -c "/app/pb/pocketbase serve --http 0.0.0.0:59992 & cd /app/sk && PORT=59991 PROXY_TARGET=http://localhost:59992 node server.js"