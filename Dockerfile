# Base image for the "pb" service
FROM golang:1.21.5-alpine AS pb

# Set the working directory
WORKDIR /app/pb

# Copy the entrypoint script
COPY ./pb/entrypoint.sh .

# Copy the PocketBase application
COPY ./pb .

# Run go mod tidy and build the application
RUN go mod tidy && go build

# Install modd
RUN go install github.com/cortesi/modd/cmd/modd@latest

# Set the command
CMD ["/app/pb/pocketbase", "serve", "--http", "0.0.0.0:59992"]

# Expose the port
EXPOSE 59992

# Bind-mount the volumes
VOLUME ["/app/pb", "/app/sk", "/go/pkg"]

# Base image for the "sk" service
FROM node:alpine AS sk

# Set the working directory
WORKDIR /app/sk

# Copy the Sveltekit application
COPY ./sk .

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the Sveltekit application
RUN npm run build

# Set the command
CMD ["sh", "-c", "PORT=59991 PROXY_TARGET=http://pb:59992 node server.js"]

# Expose the port
EXPOSE 59991

# Bind-mount the volume
VOLUME ["/app/sk"]