# Use a standard base image with Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    zip \
    xz-utils \
    libglu1-mesa \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV FLUTTER_HOME=/opt/flutter
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$FLUTTER_HOME/bin

# Download and install Android Command Line Tools
WORKDIR /opt
RUN mkdir -p android-sdk/cmdline-tools && \
    curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip cmdline-tools.zip -d android-sdk/cmdline-tools && \
    mv android-sdk/cmdline-tools/cmdline-tools android-sdk/cmdline-tools/latest && \
    rm cmdline-tools.zip

# Accept Android SDK licenses and install SDK platform/build tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0"

# Download and install Flutter SDK
RUN curl -o flutter.tar.xz https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.0-stable.tar.xz && \
    tar -xf flutter.tar.xz && \
    rm flutter.tar.xz && \
    git config --global --add safe.directory $FLUTTER_HOME

# Run Flutter doctor to pre-cache artifacts and accept licenses
RUN flutter doctor --android-licenses && \
    flutter doctor

# Set up the working directory for the application
WORKDIR /app

# The default command will install dependencies, build the APK, and build the App Bundle (AAB)
CMD ["bash", "-c", "flutter pub get && flutter build apk --release && flutter build appbundle --release"]
