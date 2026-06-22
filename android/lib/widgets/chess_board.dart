import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'visual_annotation_layer.dart';


class ChessBoardPiece {
  final String id;
  String type; // 'k', 'q', 'r', 'b', 'n', 'p'
  final String color; // 'w', 'b'
  int row;
  int col;

  ChessBoardPiece({
    required this.id,
    required this.type,
    required this.color,
    required this.row,
    required this.col,
  });
}

/// ChessOS — Interactive Chess Board Widget
/// Premium board rendering with high-quality SVG pieces, border coordinates,
/// move highlights, and smooth transition animations.
class ChessBoardWidget extends StatefulWidget {
  final String fen;
  final bool interactive;
  final bool flipped;
  final Function(String from, String to)? onMove;
  final List<String>? highlightSquares;
  final List<MapEntry<String, String>>? arrows;
  final List<ChessBoardAnnotation>? annotations;
  final List<String> Function(String square)? legalTargetsForSquare;

  const ChessBoardWidget({
    super.key,
    required this.fen,
    this.interactive = true,
    this.flipped = false,
    this.onMove,
    this.highlightSquares,
    this.arrows,
    this.annotations,
    this.legalTargetsForSquare,
  });

  @override
  State<ChessBoardWidget> createState() => _ChessBoardWidgetState();
}

class _ChessBoardWidgetState extends State<ChessBoardWidget> {
  String? selectedSquare;
  List<String> legalMoveTargets = [];
  List<ChessBoardPiece> _pieces = [];
  List<String> lastMoveSquares = [];
  String? _lastFen;

  // Colors matching the web app's theme
  static const Color lightSquare = Color(0xFFE8DCC8);
  static const Color darkSquare = Color(0xFF7B945D);
  static const Color selectedColor = Color(0x8010B981);
  static const Color lastMoveColor = Color(0x40FFFF50);
  static const Color legalMoveColor = Color(0x4010B981);
  static const Color coordinateColor = Color(0xFF94A3B8);

  // SVG piece definitions (CBurnett style)
  static const Map<String, String> _pieceSvg = {
    'K': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/></g></svg>',
    'Q': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>',
    'R': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M15 17v7h15v-7" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" stroke-linejoin="miter"/></g></svg>',
    'B': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>',
    'N': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>',
    'P': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>',
    'k': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>',
    'q': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" fill="#000" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0" fill="none" stroke="#fff"/></g></svg>',
    'r': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt" fill="#000"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter" fill="#000"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" fill="#000"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>',
    'b': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" fill="#000"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#000"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#000"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" fill="none" stroke="#fff" stroke-linejoin="miter"/></g></svg>',
    'n': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/></g></svg>',
    'p': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };

  @override
  void initState() {
    super.initState();
    _lastFen = widget.fen;
    _updatePieces(widget.fen);
  }

  @override
  void didUpdateWidget(ChessBoardWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.fen != widget.fen) {
      final detected = _detectLastMoveFromFens(oldWidget.fen, widget.fen);
      setState(() {
        lastMoveSquares = detected;
        _lastFen = widget.fen;
        _updatePieces(widget.fen);
      });
    }
  }

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

  String _squareNameFromCoords(int row, int col) {
    // FEN coordinates are raw index-based (row 0 = rank 8, col 0 = file a)
    final r = 7 - row;
    final c = col;
    return '${String.fromCharCode(97 + c)}${r + 1}';
  }

  List<String> _detectLastMoveFromFens(String prevFen, String currentFen) {
    try {
      final prevBoard = _parseFen(prevFen);
      final currBoard = _parseFen(currentFen);

      String? fromSquare;
      String? toSquare;

      for (int r = 0; r < 8; r++) {
        for (int c = 0; c < 8; c++) {
          final prevPiece = prevBoard[r][c];
          final currPiece = currBoard[r][c];

          final sqName = _squareNameFromCoords(r, c);

          if (prevPiece != null && currPiece == null) {
            fromSquare = sqName;
          } else if (prevPiece == null && currPiece != null) {
            toSquare = sqName;
          } else if (prevPiece != null && currPiece != null && prevPiece != currPiece) {
            toSquare = sqName;
          }
        }
      }

      if (fromSquare != null && toSquare != null) {
        return [fromSquare, toSquare];
      }
    } catch (e) {
      // ignore
    }
    return [];
  }

  void _updatePieces(String newFen) {
    final newBoard = _parseFen(newFen);

    if (_pieces.isEmpty) {
      _initializePieces(newBoard);
      return;
    }

    // Capture old state to check difference count
    final oldBoard = List.generate(8, (r) => List<String?>.filled(8, null));
    for (final p in _pieces) {
      oldBoard[p.row][p.col] = p.color == 'w' ? p.type.toUpperCase() : p.type.toLowerCase();
    }

    int diffCount = 0;
    List<Map<String, dynamic>> diffs = [];
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        if (oldBoard[r][c] != newBoard[r][c]) {
          diffCount++;
          diffs.add({
            'row': r,
            'col': c,
            'old': oldBoard[r][c],
            'new': newBoard[r][c],
          });
        }
      }
    }

    if (diffCount >= 1 && diffCount <= 4) {
      final departures = diffs.where((d) => d['old'] != null && d['new'] == null).toList();
      final arrivals = diffs.where((d) => d['old'] == null && d['new'] != null).toList();
      final replacements = diffs.where((d) => d['old'] != null && d['new'] != null).toList();

      final handledDepartures = <Map<String, dynamic>>[];

      // 1. Process moves/castling: departures to arrivals
      for (final arr in arrivals) {
        final match = departures.firstWhere(
          (dep) => !handledDepartures.contains(dep) &&
                   (dep['old']!.toLowerCase() == arr['new']!.toLowerCase() || 
                    (dep['old'] == dep['old']!.toUpperCase()) == (arr['new'] == arr['new']!.toUpperCase())),
          orElse: () => <String, dynamic>{},
        );

        if (match.isNotEmpty) {
          final piece = _pieces.firstWhere((p) => p.row == match['row'] && p.col == match['col']);
          piece.row = arr['row'];
          piece.col = arr['col'];
          if (match['old']!.toLowerCase() != arr['new']!.toLowerCase()) {
            piece.type = arr['new']!.toLowerCase(); // promotion
          }
          handledDepartures.add(match);
        }
      }

      // 2. Process captures: departures to replacements
      for (final rep in replacements) {
        _pieces.removeWhere((p) => p.row == rep['row'] && p.col == rep['col']);

        final match = departures.firstWhere(
          (dep) => !handledDepartures.contains(dep) &&
                   (dep['old']!.toLowerCase() == rep['new']!.toLowerCase() ||
                    (dep['old'] == dep['old']!.toUpperCase()) == (rep['new'] == rep['new']!.toUpperCase())),
          orElse: () => <String, dynamic>{},
        );

        if (match.isNotEmpty) {
          final piece = _pieces.firstWhere((p) => p.row == match['row'] && p.col == match['col']);
          piece.row = rep['row'];
          piece.col = rep['col'];
          if (match['old']!.toLowerCase() != rep['new']!.toLowerCase()) {
            piece.type = rep['new']!.toLowerCase(); // promotion capture
          }
          handledDepartures.add(match);
        }
      }

      // 3. Clean up unmatched departures (en passant)
      for (final dep in departures) {
        if (!handledDepartures.contains(dep)) {
          _pieces.removeWhere((p) => p.row == dep['row'] && p.col == dep['col']);
        }
      }
    } else {
      _initializePieces(newBoard);
    }
  }

  void _initializePieces(List<List<String?>> newBoard) {
    _pieces = [];
    int idCounter = 0;
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        final p = newBoard[r][c];
        if (p != null) {
          final color = p == p.toUpperCase() ? 'w' : 'b';
          final type = p.toLowerCase();
          _pieces.add(ChessBoardPiece(
            id: '${color}${type}_${idCounter++}',
            type: type,
            color: color,
            row: r,
            col: c,
          ));
        }
      }
    }
  }

  void _onSquareTap(int row, int col) {
    if (!widget.interactive) return;

    final square = _squareName(row, col);

    if (selectedSquare == null) {
      final board = _parseFen(widget.fen);
      final displayRow = widget.flipped ? 7 - row : row;
      final displayCol = widget.flipped ? 7 - col : col;
      final piece = board[displayRow][displayCol];
      if (piece != null) {
        final fenParts = widget.fen.split(' ');
        final currentTurn = fenParts.length > 1 ? fenParts[1] : 'w';
        final isWhitePiece = piece == piece.toUpperCase();
        final isWhiteTurn = currentTurn == 'w';

        if (isWhitePiece != isWhiteTurn) return;

        setState(() {
          selectedSquare = square;
          legalMoveTargets = widget.legalTargetsForSquare?.call(square) ?? [];
        });
      }
    } else if (selectedSquare == square) {
      setState(() {
        selectedSquare = null;
        legalMoveTargets = [];
      });
    } else {
      // Tap on another piece of own color
      final board = _parseFen(widget.fen);
      final displayRow = widget.flipped ? 7 - row : row;
      final displayCol = widget.flipped ? 7 - col : col;
      final piece = board[displayRow][displayCol];
      if (piece != null) {
        final fenParts = widget.fen.split(' ');
        final currentTurn = fenParts.length > 1 ? fenParts[1] : 'w';
        final isWhitePiece = piece == piece.toUpperCase();
        final isWhiteTurn = currentTurn == 'w';

        if (isWhitePiece == isWhiteTurn) {
          setState(() {
            selectedSquare = square;
            legalMoveTargets = widget.legalTargetsForSquare?.call(square) ?? [];
          });
          return;
        }
      }

      widget.onMove?.call(selectedSquare!, square);
      setState(() {
        selectedSquare = null;
        legalMoveTargets = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final size = min(constraints.maxWidth, constraints.maxHeight);
        final borderWidth = size > 300 ? 20.0 : 14.0;
        final gridSize = size - 2 * borderWidth;
        final sqSize = gridSize / 8;

        return Center(
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.4),
                  blurRadius: 24,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Stack(
              children: [
                // 1. Static Chessboard Grid
                Positioned(
                  left: borderWidth,
                  top: borderWidth,
                  width: gridSize,
                  height: gridSize,
                  child: GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 8,
                    ),
                    itemCount: 64,
                    itemBuilder: (context, idx) {
                      final r = idx ~/ 8;
                      final c = idx % 8;
                      final isLight = (r + c) % 2 == 0;
                      final squareName = _squareName(r, c);

                      final isSelected = selectedSquare == squareName;
                      final isLastMove = lastMoveSquares.contains(squareName) ||
                                       (widget.highlightSquares?.contains(squareName) ?? false);

                      Color sqColor = isLight ? lightSquare : darkSquare;
                      if (isSelected) {
                        sqColor = Color.alphaBlend(selectedColor, sqColor);
                      } else if (isLastMove) {
                        sqColor = Color.alphaBlend(lastMoveColor, sqColor);
                      }

                      return GestureDetector(
                        onTap: () => _onSquareTap(r, c),
                        child: Container(
                          color: sqColor,
                        ),
                      );
                    },
                  ),
                ),

                // 2. Legal Move Indicators
                ...legalMoveTargets.map((sq) {
                  // Find screen offset
                  final files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                  final ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

                  int fileIdx = files.indexOf(sq[0]);
                  int rankIdx = ranks.indexOf(sq[1]);

                  final f = widget.flipped ? 7 - fileIdx : fileIdx;
                  final r = widget.flipped ? 7 - rankIdx : rankIdx;

                  final left = borderWidth + f * sqSize;
                  final top = borderWidth + r * sqSize;

                  // Check if target has a piece (draw circle border vs filled dot)
                  final hasPiece = _pieces.any((p) => p.row == rankIdx && p.col == fileIdx);

                  return Positioned(
                    left: left,
                    top: top,
                    width: sqSize,
                    height: sqSize,
                    child: IgnorePointer(
                      child: Center(
                        child: hasPiece
                            ? Container(
                                width: sqSize - 8,
                                height: sqSize - 8,
                                decoration: BoxDecoration(
                                  border: Border.all(color: legalMoveColor, width: 3.5),
                                  shape: BoxShape.circle,
                                ),
                              )
                            : Container(
                                width: sqSize / 3.2,
                                height: sqSize / 3.2,
                                decoration: const BoxDecoration(
                                  color: legalMoveColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                      ),
                    ),
                  );
                }),

                // 2.5 Visual Annotation Layer (Arrows & Targets)
                (() {
                  final combined = <ChessBoardAnnotation>[];
                  if (widget.arrows != null) {
                    for (final entry in widget.arrows!) {
                      combined.add(ChessBoardAnnotation(
                        type: AnnotationType.arrow,
                        from: entry.key,
                        to: entry.value,
                      ));
                    }
                  }
                  if (widget.annotations != null) {
                    combined.addAll(widget.annotations!);
                  }

                  if (combined.isEmpty) return const SizedBox.shrink();

                  return Positioned.fill(
                    child: IgnorePointer(
                      child: CustomPaint(
                        painter: VisualAnnotationPainter(
                          annotations: combined,
                          sqSize: sqSize,
                          borderWidth: borderWidth,
                          flipped: widget.flipped,
                        ),
                      ),
                    ),
                  );
                })(),

                // 3. Center SVG pieces (with smooth sliding transition)
                ..._pieces.map((piece) {
                  final f = widget.flipped ? 7 - piece.col : piece.col;
                  final r = widget.flipped ? 7 - piece.row : piece.row;

                  final left = borderWidth + f * sqSize;
                  final top = borderWidth + r * sqSize;

                  final svgKey = piece.color == 'w' ? piece.type.toUpperCase() : piece.type;
                  final svgContent = _pieceSvg[svgKey] ?? '';

                  return AnimatedPositioned(
                    key: ValueKey(piece.id),
                    duration: const Duration(milliseconds: 220),
                    curve: Curves.easeInOutCubic,
                    left: left,
                    top: top,
                    width: sqSize,
                    height: sqSize,
                    child: GestureDetector(
                      onTap: () => _onSquareTap(piece.row, piece.col),
                      child: Container(
                        padding: const EdgeInsets.all(3),
                        color: Colors.transparent,
                        child: SvgPicture.string(
                          svgContent,
                          width: sqSize,
                          height: sqSize,
                        ),
                      ),
                    ),
                  );
                }),

                // 4. File Labels (bottom border)
                ...List.generate(8, (i) {
                  final fileChar = String.fromCharCode(97 + (widget.flipped ? 7 - i : i));
                  final left = borderWidth + i * sqSize;
                  return Positioned(
                    left: left,
                    bottom: 0,
                    width: sqSize,
                    height: borderWidth,
                    child: Center(
                      child: Text(
                        fileChar,
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: coordinateColor,
                        ),
                      ),
                    ),
                  );
                }),

                // 5. Rank Labels (left border)
                ...List.generate(8, (i) {
                  final rankVal = widget.flipped ? i + 1 : 8 - i;
                  final top = borderWidth + i * sqSize;
                  return Positioned(
                    left: 0,
                    top: top,
                    width: borderWidth,
                    height: sqSize,
                    child: Center(
                      child: Text(
                        '$rankVal',
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: coordinateColor,
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
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
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(moves.length, (i) {
            final isWhiteMove = i % 2 == 0;
            final moveNumber = (i ~/ 2) + 1;
            return GestureDetector(
              onTap: () => onMoveSelect?.call(i),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                margin: const EdgeInsets.only(right: 4),
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
            Flexible(
              flex: ((1 - percentage) * 100).round().clamp(1, 99),
              child: Container(color: const Color(0xFF1E1E2E)),
            ),
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

// VisualAnnotationPainter handles the actual canvas drawing of arrows and target rings.
