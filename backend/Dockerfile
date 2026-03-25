# Stage 1: Build & Generate Prisma
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies needed for prisma and bcrypt natively
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Install dependencies needed for prisma at runtime
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV=production

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose backend port
EXPOSE 3000

# Start command
# We run Prisma migrations before starting the NestJS application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
