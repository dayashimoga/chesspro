import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// ============================================================================
// User State
// ============================================================================
class UserState extends Equatable {
  final String id;
  final String email;
  final int xp;
  final int level;
  final int puzzleRating;
  final int streak;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  const UserState({
    this.id = '',
    this.email = '',
    this.xp = 0,
    this.level = 1,
    this.puzzleRating = 800,
    this.streak = 0,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  UserState copyWith({
    String? id, String? email, int? xp, int? level,
    int? puzzleRating, int? streak, bool? isAuthenticated,
    bool? isLoading, String? error,
  }) {
    return UserState(
      id: id ?? this.id,
      email: email ?? this.email,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      puzzleRating: puzzleRating ?? this.puzzleRating,
      streak: streak ?? this.streak,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  @override
  List<Object?> get props => [id, email, xp, level, puzzleRating, streak, isAuthenticated, isLoading, error];
}

// ============================================================================
// User Events
// ============================================================================
abstract class UserEvent extends Equatable {
  const UserEvent();
  @override
  List<Object?> get props => [];
}

class LoginRequested extends UserEvent {
  final String email;
  final String password;
  const LoginRequested(this.email, this.password);
  @override
  List<Object?> get props => [email, password];
}

class RegisterRequested extends UserEvent {
  final String email;
  final String password;
  const RegisterRequested(this.email, this.password);
  @override
  List<Object?> get props => [email, password];
}

class LogoutRequested extends UserEvent {
  const LogoutRequested();
}

class XPAdded extends UserEvent {
  final int amount;
  const XPAdded(this.amount);
  @override
  List<Object?> get props => [amount];
}

class RatingUpdated extends UserEvent {
  final int change;
  const RatingUpdated(this.change);
  @override
  List<Object?> get props => [change];
}

class ProgressSynced extends UserEvent {
  const ProgressSynced();
}

class UserLoadedFromStorage extends UserEvent {
  const UserLoadedFromStorage();
}

// ============================================================================
// User BLoC
// ============================================================================
class UserBloc extends Bloc<UserEvent, UserState> {
  UserBloc() : super(const UserState()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<XPAdded>(_onXPAdded);
    on<RatingUpdated>(_onRatingUpdated);
    on<ProgressSynced>(_onProgressSynced);
    on<UserLoadedFromStorage>(_onUserLoadedFromStorage);
  }

  Future<void> _onLoginRequested(LoginRequested event, Emitter<UserState> emit) async {
    emit(state.copyWith(isLoading: true, error: null));
    try {
      // TODO: Call API client for login
      // For now, simulate successful login
      await Future.delayed(const Duration(milliseconds: 500));
      emit(state.copyWith(
        id: 'usr_local',
        email: event.email,
        isAuthenticated: true,
        isLoading: false,
      ));
    } catch (e) {
      emit(state.copyWith(isLoading: false, error: e.toString()));
    }
  }

  Future<void> _onRegisterRequested(RegisterRequested event, Emitter<UserState> emit) async {
    emit(state.copyWith(isLoading: true, error: null));
    try {
      await Future.delayed(const Duration(milliseconds: 500));
      emit(state.copyWith(
        id: 'usr_new',
        email: event.email,
        isAuthenticated: true,
        isLoading: false,
        xp: 0,
        level: 1,
        puzzleRating: 800,
        streak: 0,
      ));
    } catch (e) {
      emit(state.copyWith(isLoading: false, error: e.toString()));
    }
  }

  void _onLogoutRequested(LogoutRequested event, Emitter<UserState> emit) {
    emit(const UserState());
  }

  void _onXPAdded(XPAdded event, Emitter<UserState> emit) {
    final newXP = state.xp + event.amount;
    final newLevel = (newXP ~/ 250) + 1;
    emit(state.copyWith(xp: newXP, level: newLevel));
  }

  void _onRatingUpdated(RatingUpdated event, Emitter<UserState> emit) {
    final newRating = (state.puzzleRating + event.change).clamp(100, 3000);
    emit(state.copyWith(puzzleRating: newRating));
  }

  Future<void> _onProgressSynced(ProgressSynced event, Emitter<UserState> emit) async {
    // TODO: Sync to Cloudflare D1 via API
  }

  Future<void> _onUserLoadedFromStorage(UserLoadedFromStorage event, Emitter<UserState> emit) async {
    // TODO: Load from Hive local storage
  }
}

// ============================================================================
// Puzzle State & BLoC
// ============================================================================
class PuzzleState extends Equatable {
  final String currentFen;
  final List<String> solution;
  final int currentMoveIndex;
  final bool isSolved;
  final bool isLoading;
  final String? feedback;
  final String theme;
  final String difficulty;

  const PuzzleState({
    this.currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    this.solution = const [],
    this.currentMoveIndex = 0,
    this.isSolved = false,
    this.isLoading = false,
    this.feedback,
    this.theme = '',
    this.difficulty = 'beginner',
  });

  PuzzleState copyWith({
    String? currentFen, List<String>? solution, int? currentMoveIndex,
    bool? isSolved, bool? isLoading, String? feedback,
    String? theme, String? difficulty,
  }) {
    return PuzzleState(
      currentFen: currentFen ?? this.currentFen,
      solution: solution ?? this.solution,
      currentMoveIndex: currentMoveIndex ?? this.currentMoveIndex,
      isSolved: isSolved ?? this.isSolved,
      isLoading: isLoading ?? this.isLoading,
      feedback: feedback,
      theme: theme ?? this.theme,
      difficulty: difficulty ?? this.difficulty,
    );
  }

  @override
  List<Object?> get props => [currentFen, solution, currentMoveIndex, isSolved, isLoading, feedback, theme, difficulty];
}

abstract class PuzzleEvent extends Equatable {
  const PuzzleEvent();
  @override
  List<Object?> get props => [];
}

class PuzzleLoaded extends PuzzleEvent {
  final String fen;
  final List<String> solution;
  final String theme;
  final String difficulty;
  const PuzzleLoaded(this.fen, this.solution, this.theme, this.difficulty);
  @override
  List<Object?> get props => [fen, solution, theme, difficulty];
}

class MovePlayed extends PuzzleEvent {
  final String from;
  final String to;
  final String san;
  const MovePlayed(this.from, this.to, this.san);
  @override
  List<Object?> get props => [from, to, san];
}

class PuzzleReset extends PuzzleEvent {
  const PuzzleReset();
}

class NextPuzzleRequested extends PuzzleEvent {
  const NextPuzzleRequested();
}

class PuzzleBloc extends Bloc<PuzzleEvent, PuzzleState> {
  PuzzleBloc() : super(const PuzzleState()) {
    on<PuzzleLoaded>(_onPuzzleLoaded);
    on<MovePlayed>(_onMovePlayed);
    on<PuzzleReset>(_onPuzzleReset);
    on<NextPuzzleRequested>(_onNextPuzzle);
  }

  void _onPuzzleLoaded(PuzzleLoaded event, Emitter<PuzzleState> emit) {
    emit(PuzzleState(
      currentFen: event.fen,
      solution: event.solution,
      theme: event.theme,
      difficulty: event.difficulty,
    ));
  }

  void _onMovePlayed(MovePlayed event, Emitter<PuzzleState> emit) {
    if (state.currentMoveIndex >= state.solution.length) return;

    final expected = state.solution[state.currentMoveIndex];
    final normalize = (String s) => s.replaceAll(RegExp(r'[+#x=]'), '').toLowerCase();

    if (normalize(event.san) == normalize(expected)) {
      final nextIndex = state.currentMoveIndex + 1;
      if (nextIndex >= state.solution.length) {
        emit(state.copyWith(
          isSolved: true,
          currentMoveIndex: nextIndex,
          feedback: '🟢 Puzzle solved!',
        ));
      } else {
        emit(state.copyWith(
          currentMoveIndex: nextIndex,
          feedback: '🟢 Correct! Keep going...',
        ));
      }
    } else {
      emit(state.copyWith(feedback: '🔴 Incorrect. Try again!'));
    }
  }

  void _onPuzzleReset(PuzzleReset event, Emitter<PuzzleState> emit) {
    emit(state.copyWith(
      currentMoveIndex: 0,
      isSolved: false,
      feedback: null,
    ));
  }

  void _onNextPuzzle(NextPuzzleRequested event, Emitter<PuzzleState> emit) {
    emit(const PuzzleState(isLoading: true));
    // TODO: Load next puzzle from database
  }
}

// ============================================================================
// Navigation State
// ============================================================================
class NavigationState extends Equatable {
  final String currentPage;
  final String? activeModuleId;

  const NavigationState({this.currentPage = 'dashboard', this.activeModuleId});

  NavigationState copyWith({String? currentPage, String? activeModuleId}) {
    return NavigationState(
      currentPage: currentPage ?? this.currentPage,
      activeModuleId: activeModuleId,
    );
  }

  @override
  List<Object?> get props => [currentPage, activeModuleId];
}

abstract class NavigationEvent extends Equatable {
  const NavigationEvent();
  @override
  List<Object?> get props => [];
}

class PageChanged extends NavigationEvent {
  final String page;
  const PageChanged(this.page);
  @override
  List<Object?> get props => [page];
}

class ModuleSelected extends NavigationEvent {
  final String moduleId;
  const ModuleSelected(this.moduleId);
  @override
  List<Object?> get props => [moduleId];
}

class NavigationBloc extends Bloc<NavigationEvent, NavigationState> {
  NavigationBloc() : super(const NavigationState()) {
    on<PageChanged>((event, emit) => emit(state.copyWith(currentPage: event.page)));
    on<ModuleSelected>((event, emit) => emit(state.copyWith(activeModuleId: event.moduleId)));
  }
}
