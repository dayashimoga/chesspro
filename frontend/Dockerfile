# ChessOS Pro — Frontend Lint & Build
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN echo "=== Running ESLint ===" && npm run lint
RUN echo "=== Running TypeScript Check ===" && npx tsc --noEmit
RUN echo "=== Building Production Bundle ===" && npm run build
RUN echo "=== Build Success ===" && ls -la dist/
