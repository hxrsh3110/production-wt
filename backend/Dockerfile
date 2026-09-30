# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

# Set node production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
