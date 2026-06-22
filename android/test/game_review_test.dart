import 'package:flutter_test/flutter_test.dart';
import 'package:chessos_mobile/core/chess_engine.dart';

void main() {
  group('Game Review & Move Evaluation Tests', () {
    test('Initial Position Evaluation', () {
      final engine = ChessEngine();
      final eval = engine.getEvaluation();
      // The initial board evaluation should be very close to 0.0 (balanced)
      expect(eval, closeTo(0.0, 0.5));
    });

    test('Evaluation Change on Move Play', () {
      final engine = ChessEngine();
      final before = engine.getEvaluation();

      // Play 1. e4
      final success = engine.makeMove('e4');
      expect(success, isTrue);

      final after = engine.getEvaluation();
      // White e4 is active but should keep the board relatively balanced
      expect(after, closeTo(before, 1.0));
    });

    test('Blunder Detection (Fried Liver / Traps)', () {
      final engine = ChessEngine();

      // Play moves into the Italian Game, Knight Attack
      // 1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3 Ne7
      final moves = [
        'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5'
      ];

      for (final move in moves) {
        engine.makeMove(move);
      }

      // In this position, Black's Nxd5 is a blunder (evaluation drops significantly for Black).
      // Let's verify that the engine evaluation favors White.
      final eval = engine.getEvaluation();
      expect(eval, greaterThan(1.5)); // White is significantly better (+1.5 pawns or more)
    });

    test('Book Move Classification Rules', () {
      // Standard book moves in first 6 half-moves (indices 0 to 5)
      // Standard moves: e4, e5, Nf3, Nc6, Bc4, Nf6
      final moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'];
      
      for (int i = 0; i < moves.length; i++) {
        final move = moves[i];
        final isBook = i <= 5 && (
          move == 'e4' || move == 'e5' ||
          move == 'd4' || move == 'd5' ||
          move == 'Nf3' || move == 'Nc6' ||
          move == 'Nf6' || move == 'c4'
        );
        expect(isBook, isTrue);
      }
    });
  });
}
