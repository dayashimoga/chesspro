import 'package:flutter/material.dart';

/// ChessOS — Interactive Chess Board Widget
/// Material Design 3 chess board with piece rendering, move highlighting,
/// and touch interaction support for phones and tablets.
class ChessBoardWidget extends StatefulWidget {
  final String fen;
  final bool interactive;
  final bool flipped;
  final Function(String from, String to)? onMove;
  final List<String>? highlightSquares;
  final List<MapEntry<String, String>>? arrows;

  const ChessBoardWidget({
    super.key,
    required this.fen,
    this.interactive = true,
    this.flipped = false,
    this.onMove,
    this.highlightSquares,
    this.arrows,
  });

  @override
  State<ChessBoardWidget> createState() => _ChessBoardWidgetState();
}

class _ChessBoardWidgetState extends State<ChessBoardWidget> {
  String? selectedSquare;
  List<String> legalMoveTargets = [];

  // Colors matching the web app's theme
  static const Color lightSquare = Color(0xFF769656);
  static const Color darkSquare = Color(0xFF4E7837);
  static const Color selectedColor = Color(0x80FFFF00);
  static const Color lastMoveColor = Color(0x40FFFF00);
  static const Color legalMoveColor = Color(0x40000000);

  // Unicode chess pieces
  static const Map<String, String> _pieceUnicode = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };

  List<List<String?>> _parseFen(String fen) {
    final board = List.generate(8, (_) => List<String?>.filled(8, null));
    final ranks = fen.split(' ')[0].split('/');

    for (int r = 0; r < 8; r++) {
      int col = 0;
      for (int i = 0; i < ranks[r].length; i++) {
        final char = ranks[r][i];
        final digit = int.tryParse(char);
        if (digit != null) {
          col += digit;
        } else {
          board[r][col] = char;
          col++;
        }
      }
    }
    return board;
  }

  String _squareName(int row, int col) {
    final r = widget.flipped ? row : 7 - row;
    final c = widget.flipped ? 7 - col : col;
    return '${String.fromCharCode(97 + c)}${r + 1}';
  }

  void _onSquareTap(int row, int col) {
    if (!widget.interactive) return;

    final square = _squareName(row, col);

    if (selectedSquare == null) {
      // Select piece
      final board = _parseFen(widget.fen);
      final displayRow = widget.flipped ? 7 - row : row;
      final displayCol = widget.flipped ? 7 - col : col;
      if (board[displayRow][displayCol] != null) {
        setState(() {
          selectedSquare = square;
          legalMoveTargets = []; // Would compute legal moves here
        });
      }
    } else if (selectedSquare == square) {
      // Deselect
      setState(() {
        selectedSquare = null;
        legalMoveTargets = [];
      });
    } else {
      // Attempt move
      widget.onMove?.call(selectedSquare!, square);
      setState(() {
        selectedSquare = null;
        legalMoveTargets = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final board = _parseFen(widget.fen);

    return AspectRatio(
      aspectRatio: 1,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.1), width: 2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Column(
            children: List.generate(8, (row) {
              return Expanded(
                child: Row(
                  children: List.generate(8, (col) {
                    final isLight = (row + col) % 2 == 0;
                    final displayRow = widget.flipped ? 7 - row : row;
                    final displayCol = widget.flipped ? 7 - col : col;
                    final piece = board[displayRow][displayCol];
                    final squareName = _squareName(row, col);
                    final isSelected = selectedSquare == squareName;
                    final isHighlighted = widget.highlightSquares?.contains(squareName) ?? false;
                    final isLegalTarget = legalMoveTargets.contains(squareName);

                    return Expanded(
                      child: GestureDetector(
                        onTap: () => _onSquareTap(row, col),
                        child: Container(
                          decoration: BoxDecoration(
                            color: isSelected
                                ? selectedColor
                                : isHighlighted
                                    ? lastMoveColor
                                    : isLight
                                        ? lightSquare
                                        : darkSquare,
                          ),
                          child: Stack(
                            children: [
                              // Coordinate labels
                              if (col == 0)
                                Positioned(
                                  top: 2,
                                  left: 2,
                                  child: Text(
                                    '${widget.flipped ? row + 1 : 8 - row}',
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w700,
                                      color: isLight ? darkSquare : lightSquare,
                                    ),
                                  ),
                                ),
                              if (row == 7)
                                Positioned(
                                  bottom: 1,
                                  right: 3,
                                  child: Text(
                                    String.fromCharCode(97 + (widget.flipped ? 7 - col : col)),
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w700,
                                      color: isLight ? darkSquare : lightSquare,
                                    ),
                                  ),
                                ),
                              // Legal move indicator
                              if (isLegalTarget)
                                Center(
                                  child: Container(
                                    width: 12,
                                    height: 12,
                                    decoration: BoxDecoration(
                                      color: legalMoveColor,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ),
                              // Chess piece
                              if (piece != null)
                                Center(
                                  child: Text(
                                    _pieceUnicode[piece] ?? '',
                                    style: TextStyle(
                                      fontSize: 30,
                                      height: 1,
                                      shadows: [
                                        Shadow(
                                          color: Colors.black.withOpacity(0.3),
                                          offset: const Offset(1, 1),
                                          blurRadius: 2,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

/// Move history display widget
class MoveHistoryWidget extends StatelessWidget {
  final List<String> moves;
  final int currentMoveIndex;
  final Function(int)? onMoveSelect;

  const MoveHistoryWidget({
    super.key,
    required this.moves,
    this.currentMoveIndex = 0,
    this.onMoveSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C14),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Wrap(
        spacing: 4,
        runSpacing: 4,
        children: List.generate(moves.length, (i) {
          final isWhiteMove = i % 2 == 0;
          final moveNumber = (i ~/ 2) + 1;
          return GestureDetector(
            onTap: () => onMoveSelect?.call(i),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
              decoration: BoxDecoration(
                color: i == currentMoveIndex
                    ? const Color(0xFF10B981).withOpacity(0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                '${isWhiteMove ? "$moveNumber." : ""}${moves[i]}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: i == currentMoveIndex ? FontWeight.w700 : FontWeight.w400,
                  fontFamily: 'monospace',
                  color: i == currentMoveIndex
                      ? const Color(0xFF10B981)
                      : Colors.white.withOpacity(0.7),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}

/// Evaluation bar widget showing engine evaluation
class EvalBarWidget extends StatelessWidget {
  final double evaluation; // positive = white advantage, negative = black
  final bool isMate;
  final int? mateIn;

  const EvalBarWidget({
    super.key,
    this.evaluation = 0.0,
    this.isMate = false,
    this.mateIn,
  });

  @override
  Widget build(BuildContext context) {
    // Convert eval to percentage (sigmoid-like mapping)
    final percentage = 0.5 + (evaluation / 10).clamp(-0.5, 0.5);

    return Container(
      width: 24,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(3),
        child: Column(
          children: [
            // Black's portion (top)
            Flexible(
              flex: ((1 - percentage) * 100).round().clamp(1, 99),
              child: Container(color: const Color(0xFF1E1E2E)),
            ),
            // White's portion (bottom)
            Flexible(
              flex: (percentage * 100).round().clamp(1, 99),
              child: Container(
                color: Colors.white,
                alignment: Alignment.center,
                child: RotatedBox(
                  quarterTurns: 3,
                  child: Text(
                    isMate ? 'M${mateIn ?? ""}' : evaluation.toStringAsFixed(1),
                    style: const TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1E1E2E),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
