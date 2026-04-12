# ─── Stage 1: Build the Expo Web Bundle ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better caching
COPY package*.json ./

RUN npm install

# Copy full project
COPY . .

# Inject the Finnhub key at build time via Docker build arg
ARG EXPO_PUBLIC_FINNHUB_API_KEY
ENV EXPO_PUBLIC_FINNHUB_API_KEY=$EXPO_PUBLIC_FINNHUB_API_KEY

# Build the Expo web bundle to /app/dist
RUN npx expo export --platform web

# ─── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:stable-alpine

# Copy built web bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config to handle React/Expo SPA routing
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
