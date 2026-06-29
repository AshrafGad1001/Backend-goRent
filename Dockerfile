# ── Stage 1: Install dependencies ──────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only the manifests so Docker can cache this layer
COPY package.json package-lock.json ./

# ci = clean install (respects lock-file, faster in CI/Docker)
RUN npm ci --omit=dev

# ── Stage 2: Production image ─────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY package.json ./
COPY index.js ./
COPY src ./src

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 5000

# Health check – uses the /api/health endpoint already in the app
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "index.js"]
