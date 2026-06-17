# ============================================================================
# ChessOS Pro — Multi-stage Docker build for Frontend Lint/Build + Android APK
# ============================================================================

# ---- Stage 1: Frontend Lint & Build ----
FROM node:22-slim AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run lint && npm run build

# ---- Stage 2: Flutter Android APK Build ----
FROM ghcr.io/cirruslabs/flutter:3.24.0 AS android-build

# Accept Android SDK licenses
RUN yes | flutter doctor --android-licenses 2>/dev/null || true

WORKDIR /app
COPY android/ ./

# Generate a fresh debug keystore with standard Android debug credentials
RUN keytool -genkey -v \
    -keystore android/app/debug.keystore \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US" \
    -noprompt 2>/dev/null || true

RUN flutter pub get
RUN flutter build apk --debug --no-tree-shake-icons
RUN flutter build apk --release --no-tree-shake-icons

# ---- Stage 3: Collect outputs ----
FROM alpine:latest AS output

COPY --from=frontend-build /app/frontend/dist /output/frontend-dist
COPY --from=android-build /app/build/app/outputs/flutter-apk/app-debug.apk /output/chessos-debug.apk
COPY --from=android-build /app/build/app/outputs/flutter-apk/app-release.apk /output/chessos-release.apk

CMD ["ls", "-la", "/output/"]
