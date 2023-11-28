#######################################
# STAGE 1 – Dependencies stage (AS deps)
#######################################
FROM node:16-alpine AS deps

# Required by some Node.js dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy all files from frontend folder
COPY ./frontend .
COPY ./.env .env

# install dependencies
RUN npm install --arch=x64 --platform=linux sharp
RUN npm ci

# next build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

#######################################
# STAGE 2 – Runner stage (AS runner)
#######################################
FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# create system group and non-root user to enhance security
RUN addgroup --system --gid 1001 rondasgroup
RUN adduser --system --uid 1001 rondasuser

# Copy the files needed to run the application
COPY --from=deps --chown=rondasuser:rondasgroup /app/public ./public
COPY --from=deps --chown=rondasuser:rondasgroup /app/.next/standalone ./
COPY --from=deps --chown=rondasuser:rondasgroup /app/.next/static ./.next/static

USER rondasuser
CMD ["node", "server.js"]