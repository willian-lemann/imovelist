FROM node:20.12.0-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Go inside the build directory and install dependencies
WORKDIR /app/build
RUN npm ci --omit=dev

# Expose the application port
EXPOSE 3333
