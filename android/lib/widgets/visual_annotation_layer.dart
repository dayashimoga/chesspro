import 'dart:math';
import 'package:flutter/material.dart';

enum AnnotationType { arrow, target }

class ChessBoardAnnotation {
  final AnnotationType type;
  final String from; // Start square for arrow, or target square for circle
  final String? to;   // End square for arrow
  final Color color;

  const ChessBoardAnnotation({
    required this.type,
    required this.from,
    this.to,
    this.color = const Color(0xCCF59E0B), // Default Amber with opacity
  });
}

class VisualAnnotationPainter extends CustomPainter {
  final List<ChessBoardAnnotation> annotations;
  final double sqSize;
  final double borderWidth;
  final bool flipped;

  VisualAnnotationPainter({
    required this.annotations,
    required this.sqSize,
    required this.borderWidth,
    required this.flipped,
  });

  Offset getSquareCenter(String sq, double sqSize, double borderWidth, bool flipped) {
    if (sq.length < 2) return Offset.zero;
    final files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    final ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    int fileIdx = files.indexOf(sq[0]);
    int rankIdx = ranks.indexOf(sq[1]);

    if (fileIdx == -1 || rankIdx == -1) return Offset.zero;

    final f = flipped ? 7 - fileIdx : fileIdx;
    final r = flipped ? 7 - rankIdx : rankIdx;

    final x = borderWidth + f * sqSize + sqSize / 2;
    final y = borderWidth + r * sqSize + sqSize / 2;

    return Offset(x, y);
  }

  @override
  void paint(Canvas canvas, Size size) {
    for (final ann in annotations) {
      if (ann.type == AnnotationType.target) {
        final center = getSquareCenter(ann.from, sqSize, borderWidth, flipped);
        if (center == Offset.zero) continue;

        // Draw outer ring
        final ringPaint = Paint()
          ..color = ann.color
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3.5
          ..strokeCap = StrokeCap.round;
        canvas.drawCircle(center, sqSize * 0.38, ringPaint);

        // Draw translucent glow fill
        final glowPaint = Paint()
          ..color = ann.color.withOpacity(0.12)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(center, sqSize * 0.38, glowPaint);
      } else if (ann.type == AnnotationType.arrow) {
        if (ann.to == null) continue;
        final fromOffset = getSquareCenter(ann.from, sqSize, borderWidth, flipped);
        final toOffset = getSquareCenter(ann.to!, sqSize, borderWidth, flipped);

        if (fromOffset == Offset.zero || toOffset == Offset.zero) continue;

        final vector = toOffset - fromOffset;
        final distance = vector.distance;
        if (distance < 10) continue;

        final direction = vector / distance;

        // Draw arrow shaft with a small gap before the target center
        final linePaint = Paint()
          ..color = ann.color
          ..strokeWidth = 4.5
          ..strokeCap = StrokeCap.round
          ..style = PaintingStyle.stroke;

        final lineEnd = fromOffset + direction * (distance - 14);
        canvas.drawLine(fromOffset, lineEnd, linePaint);

        // Draw arrowhead
        final arrowHeadPaint = Paint()
          ..color = ann.color
          ..style = PaintingStyle.fill;

        final path = Path();
        const headWidth = 14.0;
        const headLength = 14.0;

        final rightAngle = Offset(-direction.dy, direction.dx);

        final tip = toOffset - direction * 4;
        final base = toOffset - direction * headLength;
        final p1 = base + rightAngle * (headWidth / 2);
        final p2 = base - rightAngle * (headWidth / 2);

        path.moveTo(tip.dx, tip.dy);
        path.lineTo(p1.dx, p1.dy);
        path.lineTo(p2.dx, p2.dy);
        path.close();

        canvas.drawPath(path, arrowHeadPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant VisualAnnotationPainter oldDelegate) {
    return oldDelegate.annotations != annotations ||
        oldDelegate.sqSize != sqSize ||
        oldDelegate.flipped != flipped;
  }
}
