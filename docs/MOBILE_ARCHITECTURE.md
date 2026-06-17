# ChessOS Mobile — Architecture Document

## Overview

The ChessOS mobile application is built with **Flutter 3.24+** using **Material Design 3** with a dark theme matching the web application. The app targets Android (primary) with iOS support ready.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Flutter 3.24+ | Cross-platform UI |
| Design System | Material Design 3 | Consistent, modern UI |
| State Management | flutter_bloc (BLoC) | Predictable state |
| Navigation | GoRouter | Declarative routing |
| Networking | Dio | HTTP client with interceptors |
| Local Storage | Hive + SQLite | Offline-first data |
| Push Notifications | Firebase Messaging | Engagement |
| Chess Engine | chess.dart | Move validation, FEN parsing |

## Architecture Pattern — Clean Architecture

```
┌──────────────────────────────────────────────┐
│                 Presentation                  │
│  Pages → Widgets → BLoC (State Management)   │
├──────────────────────────────────────────────┤
│                   Domain                      │
│   Entities → Use Cases → Repository Interfaces│
├──────────────────────────────────────────────┤
│                    Data                       │
│  API Client → Local DB → Repository Impls    │
└──────────────────────────────────────────────┘
```

## Directory Structure

```
android/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── app/
│   │   ├── router.dart              # GoRouter configuration
│   │   └── theme.dart               # Material 3 theme
│   ├── core/
│   │   ├── chess_engine.dart         # Chess logic wrapper
│   │   ├── api_client.dart           # Dio HTTP client
│   │   ├── local_storage.dart        # Hive/SQLite wrapper
│   │   └── constants.dart            # App constants
│   ├── domain/
│   │   ├── entities/                 # Pure domain objects
│   │   ├── repositories/            # Repository interfaces
│   │   └── usecases/                # Business logic
│   ├── data/
│   │   ├── datasources/             # API + Local data sources
│   │   ├── models/                   # Data transfer objects
│   │   └── repositories/            # Repository implementations
│   ├── presentation/
│   │   ├── pages/                    # Screen-level widgets
│   │   ├── widgets/                  # Reusable UI components
│   │   └── blocs/                    # BLoC state management
│   └── widgets/
│       ├── chess_board.dart          # Interactive board widget
│       └── common/                   # Shared UI components
├── test/                             # Unit + widget tests
├── integration_test/                 # Integration tests
├── pubspec.yaml                      # Dependencies
└── README.md
```

## Offline-First Strategy

1. **Puzzle Database**: Pre-loaded SQLite database with 10,000+ puzzles
2. **Progress Sync**: Hive stores progress locally, syncs to Cloudflare D1 when online
3. **Content Caching**: Opening trees and endgame content cached in Hive
4. **Conflict Resolution**: Last-write-wins with server timestamp comparison

## Data Flow

```
User Action → BLoC Event → Use Case → Repository
                                         ↓
                                    ┌─────────────┐
                                    │ Online?      │
                                    │ Yes → API    │
                                    │ No → Local DB│
                                    └─────────────┘
                                         ↓
                                    BLoC State → UI Update
```

## API Integration

All API calls go through a Dio client with:
- **Base URL**: `https://chessos-api.workers.dev` (production) / `http://localhost:8787` (dev)
- **Auth**: Bearer token in Authorization header
- **Retry**: 3 retries with exponential backoff
- **Timeout**: 10s connect, 30s receive
- **Interceptors**: Auth, logging, error handling, offline queue

## Security

- Secure token storage via `flutter_secure_storage`
- Certificate pinning for API requests
- No sensitive data in SharedPreferences
- Biometric authentication option for app lock

## Performance Targets

| Metric | Target |
|--------|--------|
| Cold start | < 2s |
| Board render | < 16ms (60fps) |
| Puzzle load | < 100ms |
| Offline puzzle solve | < 50ms |
| APK size | < 30MB |

## Supported Devices

- Android 8.0+ (API 26+)
- Phone: 5"–7" screens
- Tablet: 7"–13" screens
- Foldable: Adaptive layouts
- Landscape mode: Side-by-side board + controls
