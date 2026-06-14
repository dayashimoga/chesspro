# Database Schema Specification — ChessOS Pro

## 1. Relational Entity ER Diagrams

```mermaid
erDiagram
  USER_PROFILE {
    uuid id PK
    string email
    int xp
    int level
    int puzzle_rating
    int streak
    datetime last_study_date
  }
  
  LESSON_PROGRESS {
    uuid id PK
    uuid user_id FK
    string lesson_id
    datetime completed_at
  }

  SRS_CARD {
    uuid id PK
    uuid user_id FK
    string front
    string back
    string fen
    int interval
    int repetition
    float ease_factor
    datetime next_review
  }

  USER_PROFILE ||--o{ LESSON_PROGRESS : "completes"
  USER_PROFILE ||--o{ SRS_CARD : "reviews"
```

---

## 2. DDL Database Schema Mapping

### User Profile Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    puzzle_rating INTEGER DEFAULT 800,
    streak INTEGER DEFAULT 0,
    last_study_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);
```

### Spaced Repetition Cards Table (SM-2 Scheduling)
```sql
CREATE TABLE srs_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    fen VARCHAR(100),
    interval INTEGER DEFAULT 1,
    repetition INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    next_review TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
