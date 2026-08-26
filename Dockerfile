# ----- Build stage -----
FROM node:20-alpine AS build
WORKDIR /app

# Install production dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY app.js ./

# ----- Production stage -----
FROM node:20-alpine
WORKDIR /app

# Copy only production artifacts from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/app.js ./

# Non-root user for security
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
