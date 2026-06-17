import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/chess_board.dart';

// ============================================================================
// ContentRenderer — Converts HTML theory strings to Flutter widgets
// ============================================================================
class ContentRenderer extends StatelessWidget {
  final String htmlContent;
  final bool compact;

  const ContentRenderer({super.key, required this.htmlContent, this.compact = false});

  @override
  Widget build(BuildContext context) {
    final widgets = _parseHtml(htmlContent);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: widgets,
    );
  }

  List<Widget> _parseHtml(String html) {
    final widgets = <Widget>[];
    // Clean up escape sequences
    var cleaned = html
        .replaceAll('\\n', '\n')
        .replaceAll('\\/', '/')
        .replaceAll('\\"', '"')
        .trim();

    // Split into segments by top-level tags
    final segments = _tokenize(cleaned);

    for (final seg in segments) {
      final w = _renderSegment(seg);
      if (w != null) widgets.add(w);
    }

    if (widgets.isEmpty) {
      // Fallback: render as plain text if no HTML detected
      widgets.add(Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Text(
          _stripAllTags(cleaned),
          style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.85), height: 1.6),
        ),
      ));
    }

    return widgets;
  }

  // Tokenizer splits HTML into parseable segments
  List<_HtmlSegment> _tokenize(String html) {
    final segments = <_HtmlSegment>[];
    final tagPattern = RegExp(
      r'<(h[23]|p|ul|ol|li|pre|div|strong|em|code|br\s*/?)([^>]*)>(.*?)</\1>|<br\s*/?>',
      dotAll: true,
    );

    int lastEnd = 0;
    for (final match in tagPattern.allMatches(html)) {
      // Capture text between tags
      if (match.start > lastEnd) {
        final between = html.substring(lastEnd, match.start).trim();
        if (between.isNotEmpty) {
          segments.add(_HtmlSegment('text', _stripAllTags(between)));
        }
      }

      final tag = match.group(1) ?? 'br';
      final attrs = match.group(2) ?? '';
      final content = match.group(3) ?? '';

      if (tag == 'div' && attrs.contains('key-concept')) {
        segments.add(_HtmlSegment('key-concept', content));
      } else if (tag == 'div' && attrs.contains('warning-box')) {
        segments.add(_HtmlSegment('warning-box', content));
      } else if (tag == 'div') {
        segments.add(_HtmlSegment('div', content));
      } else {
        segments.add(_HtmlSegment(tag, content));
      }

      lastEnd = match.end;
    }

    // Trailing text
    if (lastEnd < html.length) {
      final trailing = html.substring(lastEnd).trim();
      if (trailing.isNotEmpty && _stripAllTags(trailing).trim().isNotEmpty) {
        segments.add(_HtmlSegment('text', _stripAllTags(trailing)));
      }
    }

    return segments;
  }

  Widget? _renderSegment(_HtmlSegment seg) {
    switch (seg.tag) {
      case 'h2':
        return Padding(
          padding: EdgeInsets.only(top: compact ? 12 : 20, bottom: 8),
          child: Text(
            _stripAllTags(seg.content),
            style: GoogleFonts.inter(
              fontSize: compact ? 18 : 22,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              height: 1.3,
            ),
          ),
        );

      case 'h3':
        return Padding(
          padding: EdgeInsets.only(top: compact ? 10 : 16, bottom: 6),
          child: Row(
            children: [
              Container(
                width: 3,
                height: 18,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Expanded(
                child: Text(
                  _stripAllTags(seg.content),
                  style: GoogleFonts.inter(
                    fontSize: compact ? 15 : 17,
                    fontWeight: FontWeight.w700,
                    color: Colors.white.withOpacity(0.95),
                    height: 1.3,
                  ),
                ),
              ),
            ],
          ),
        );

      case 'p':
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: _buildRichText(seg.content),
        );

      case 'ul':
        return _buildUnorderedList(seg.content);

      case 'ol':
        return _buildOrderedList(seg.content);

      case 'pre':
        return Container(
          width: double.infinity,
          margin: const EdgeInsets.symmetric(vertical: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A12),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Text(
            _stripAllTags(seg.content),
            style: GoogleFonts.firaCode(
              fontSize: 12,
              color: const Color(0xFF10B981),
              height: 1.5,
            ),
          ),
        );

      case 'key-concept':
        return _buildCalloutCard(
          seg.content,
          const Color(0xFF10B981),
          '💡',
        );

      case 'warning-box':
        return _buildCalloutCard(
          seg.content,
          const Color(0xFFF59E0B),
          '⚠️',
        );

      case 'text':
        if (seg.content.trim().isEmpty) return null;
        return Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Text(
            seg.content,
            style: GoogleFonts.inter(
              fontSize: 14,
              color: Colors.white.withOpacity(0.85),
              height: 1.6,
            ),
          ),
        );

      default:
        if (seg.content.trim().isEmpty) return null;
        return Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: _buildRichText(seg.content),
        );
    }
  }

  Widget _buildRichText(String html) {
    final spans = <InlineSpan>[];
    _parseInlineHtml(html, spans);

    return RichText(
      text: TextSpan(
        style: GoogleFonts.inter(
          fontSize: 14,
          color: Colors.white.withOpacity(0.85),
          height: 1.6,
        ),
        children: spans.map((s) => s.toTextSpan()).toList(),
      ),
    );
  }

  void _parseInlineHtml(String html, List<InlineSpan> spans) {
    final pattern = RegExp(
      r'<(strong|em|code|b|i)>(.*?)</\1>|<br\s*/?>|([^<]+)',
      dotAll: true,
    );

    for (final match in pattern.allMatches(html)) {
      final tag = match.group(1);
      final content = match.group(2);
      final plainText = match.group(3);

      if (tag == 'strong' || tag == 'b') {
        spans.add(InlineSpan(_stripAllTags(content ?? ''), bold: true));
      } else if (tag == 'em' || tag == 'i') {
        spans.add(InlineSpan(_stripAllTags(content ?? ''), italic: true));
      } else if (tag == 'code') {
        spans.add(InlineSpan(content ?? '', code: true));
      } else if (plainText != null && plainText.trim().isNotEmpty) {
        spans.add(InlineSpan(plainText));
      } else if (match.group(0)?.startsWith('<br') == true) {
        spans.add(InlineSpan('\n'));
      }
    }

    if (spans.isEmpty && html.isNotEmpty) {
      spans.add(InlineSpan(_stripAllTags(html)));
    }
  }

  Widget _buildUnorderedList(String html) {
    final items = _extractListItems(html);
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.map((item) => Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 7, right: 10),
                child: Container(
                  width: 5, height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981),
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
              Expanded(child: _buildRichText(item)),
            ],
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildOrderedList(String html) {
    final items = _extractListItems(html);
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.asMap().entries.map((entry) => Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 24,
                child: Text(
                  '${entry.key + 1}.',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF10B981),
                  ),
                ),
              ),
              Expanded(child: _buildRichText(entry.value)),
            ],
          ),
        )).toList(),
      ),
    );
  }

  List<String> _extractListItems(String html) {
    final liPattern = RegExp(r'<li>(.*?)</li>', dotAll: true);
    return liPattern.allMatches(html).map((m) => m.group(1) ?? '').toList();
  }

  Widget _buildCalloutCard(String html, Color color, String icon) {
    // Extract title from nested div
    final titlePattern = RegExp(r'<div class="[^"]*-title">(.*?)</div>', dotAll: true);
    final titleMatch = titlePattern.firstMatch(html);
    final title = titleMatch != null ? _stripAllTags(titleMatch.group(1) ?? '') : '';
    final body = titleMatch != null
        ? html.substring(titleMatch.end).trim()
        : html;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Text(icon, style: const TextStyle(fontSize: 16)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      title.replaceAll(RegExp(r'^[💡⚠️🔑]\s*'), ''),
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: color,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          _buildRichText(_stripAllTags(body)),
        ],
      ),
    );
  }

  String _stripAllTags(String html) {
    return html
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&nbsp;', ' ')
        .replaceAll(RegExp(r'\n\s*\n'), '\n')
        .trim();
  }
}

class _HtmlSegment {
  final String tag;
  final String content;
  _HtmlSegment(this.tag, this.content);
}

class InlineSpan {
  final String text;
  final bool bold;
  final bool italic;
  final bool code;

  InlineSpan(this.text, {this.bold = false, this.italic = false, this.code = false});

  TextSpan toTextSpan() {
    if (code) {
      return TextSpan(
        text: text,
        style: GoogleFonts.firaCode(
          fontSize: 12.5,
          color: const Color(0xFF10B981),
          backgroundColor: const Color(0xFF10B981).withOpacity(0.08),
        ),
      );
    }
    return TextSpan(
      text: text,
      style: TextStyle(
        fontWeight: bold ? FontWeight.w700 : null,
        fontStyle: italic ? FontStyle.italic : null,
        color: bold ? Colors.white : null,
      ),
    );
  }
}

// ============================================================================
// QuizWidget — Interactive quiz exercise with animated feedback
// ============================================================================
class QuizWidget extends StatefulWidget {
  final Map<String, dynamic> exercise;
  final VoidCallback? onComplete;

  const QuizWidget({super.key, required this.exercise, this.onComplete});

  @override
  State<QuizWidget> createState() => _QuizWidgetState();
}

class _QuizWidgetState extends State<QuizWidget> with SingleTickerProviderStateMixin {
  int? _selectedIndex;
  bool _answered = false;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _selectAnswer(int index) {
    if (_answered) return;
    setState(() {
      _selectedIndex = index;
      _answered = true;
    });
    _animController.forward();
    final correct = index == (widget.exercise['answer'] as int);
    if (correct) {
      Future.delayed(const Duration(milliseconds: 1200), () {
        widget.onComplete?.call();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final question = widget.exercise['question'] as String;
    final options = (widget.exercise['options'] as List).cast<String>();
    final correctIndex = widget.exercise['answer'] as int;
    final explanation = widget.exercise['explanation'] as String? ?? '';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF8B5CF6).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'QUIZ',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF8B5CF6),
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            question,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Colors.white,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 14),
          ...options.asMap().entries.map((entry) {
            final i = entry.key;
            final option = entry.value;
            final isSelected = _selectedIndex == i;
            final isCorrect = i == correctIndex;
            final showResult = _answered;

            Color borderColor = Colors.white.withOpacity(0.08);
            Color bgColor = Colors.transparent;
            Color textColor = Colors.white.withOpacity(0.8);

            if (showResult && isCorrect) {
              borderColor = const Color(0xFF10B981);
              bgColor = const Color(0xFF10B981).withOpacity(0.08);
              textColor = const Color(0xFF10B981);
            } else if (showResult && isSelected && !isCorrect) {
              borderColor = const Color(0xFFEF4444);
              bgColor = const Color(0xFFEF4444).withOpacity(0.08);
              textColor = const Color(0xFFEF4444);
            } else if (isSelected) {
              borderColor = const Color(0xFF10B981);
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: InkWell(
                onTap: () => _selectAnswer(i),
                borderRadius: BorderRadius.circular(12),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isSelected
                              ? (showResult
                                  ? (isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444))
                                  : const Color(0xFF10B981))
                              : Colors.white.withOpacity(0.05),
                          border: Border.all(
                            color: isSelected
                                ? Colors.transparent
                                : Colors.white.withOpacity(0.1),
                          ),
                        ),
                        child: Center(
                          child: showResult && isSelected
                              ? Icon(
                                  isCorrect ? Icons.check_rounded : Icons.close_rounded,
                                  size: 16,
                                  color: Colors.white,
                                )
                              : Text(
                                  String.fromCharCode(65 + i), // A, B, C, D
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: isSelected ? Colors.white : Colors.white.withOpacity(0.4),
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          option,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                            color: textColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
          // Feedback
          if (_answered)
            FadeTransition(
              opacity: _fadeAnim,
              child: Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (_selectedIndex == correctIndex
                      ? const Color(0xFF10B981)
                      : const Color(0xFFF59E0B))
                      .withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: (_selectedIndex == correctIndex
                        ? const Color(0xFF10B981)
                        : const Color(0xFFF59E0B))
                        .withOpacity(0.15),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _selectedIndex == correctIndex ? '✅' : '💡',
                      style: const TextStyle(fontSize: 14),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _selectedIndex == correctIndex
                            ? 'Correct! $explanation'
                            : 'Not quite. $explanation',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: Colors.white.withOpacity(0.8),
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ============================================================================
// ExampleBoardWidget — Shows FEN position with title and description
// ============================================================================
class ExampleBoardWidget extends StatelessWidget {
  final Map<String, dynamic> example;

  const ExampleBoardWidget({super.key, required this.example});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            example['title'] ?? 'Position',
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 280,
            child: ChessBoardWidget(
              fen: example['fen'] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
              interactive: false,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            example['description'] ?? '',
            style: GoogleFonts.inter(
              fontSize: 13,
              color: Colors.white.withOpacity(0.7),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// PuzzleSolveWidget — Interactive puzzle with board, hints, feedback
// ============================================================================
class PuzzleSolveWidget extends StatefulWidget {
  final Map<String, dynamic> puzzle;
  final VoidCallback? onSolved;
  final VoidCallback? onNext;

  const PuzzleSolveWidget({super.key, required this.puzzle, this.onSolved, this.onNext});

  @override
  State<PuzzleSolveWidget> createState() => _PuzzleSolveWidgetState();
}

class _PuzzleSolveWidgetState extends State<PuzzleSolveWidget> {
  bool _solved = false;
  bool _showHint = false;
  int _hintLevel = 0;
  int _attempts = 0;
  String? _feedback;

  String get _solutionText {
    final sol = widget.puzzle['solution'];
    if (sol is List) return (sol as List).join(', ');
    return sol?.toString() ?? '';
  }

  void _onMove(String from, String to) {
    if (_solved) return;
    _attempts++;

    // Simple move matching — compare the "to" square against solution
    final solution = _solutionText.toLowerCase();
    final move = '$from$to'.toLowerCase();

    // Check if move matches (simplified — real engine would validate fully)
    if (solution.contains(to.toLowerCase()) || solution.contains(move)) {
      setState(() {
        _solved = true;
        _feedback = '🎉 Correct! $_solutionText';
      });
      widget.onSolved?.call();
    } else {
      setState(() {
        _feedback = '❌ Try again! Think about the theme: ${widget.puzzle['theme'] ?? 'tactics'}';
      });
    }
  }

  void _showNextHint() {
    setState(() {
      _hintLevel++;
      _showHint = true;
      if (_hintLevel == 1) {
        _feedback = '💡 Theme: ${widget.puzzle['theme'] ?? 'Tactics'}';
      } else if (_hintLevel == 2) {
        _feedback = '💡 Look at the solution area...';
      } else {
        _feedback = '💡 Solution: $_solutionText';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Board
        SizedBox(
          height: 320,
          child: ChessBoardWidget(
            fen: widget.puzzle['fen'] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            interactive: !_solved,
            onMove: _onMove,
          ),
        ),
        const SizedBox(height: 12),

        // Puzzle info
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                widget.puzzle['theme'] ?? 'Puzzle',
                style: GoogleFonts.inter(
                  fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFF10B981),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFF59E0B).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Rating: ${widget.puzzle['rating'] ?? '?'}',
                style: GoogleFonts.inter(
                  fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFFF59E0B),
                ),
              ),
            ),
            const Spacer(),
            if (!_solved)
              TextButton.icon(
                onPressed: _showNextHint,
                icon: const Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFFF59E0B)),
                label: Text('Hint', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFFF59E0B))),
              ),
          ],
        ),

        // Feedback
        if (_feedback != null) ...[
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (_solved ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: (_solved ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.15),
              ),
            ),
            child: Text(
              _feedback!,
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.85), height: 1.4),
            ),
          ),
        ],

        // Explanation
        if (_solved && widget.puzzle['explanation'] != null) ...[
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF3B82F6).withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('📖 ', style: TextStyle(fontSize: 14)),
                Expanded(
                  child: Text(
                    widget.puzzle['explanation'],
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.8), height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],

        // Next button
        if (_solved) ...[
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: widget.onNext,
              icon: const Icon(Icons.arrow_forward_rounded, size: 18),
              label: Text('Next Puzzle', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF10B981),
                foregroundColor: const Color(0xFF06060B),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// ============================================================================
// FindMoveWidget — Interactive find-the-move exercise
// ============================================================================
class FindMoveWidget extends StatefulWidget {
  final Map<String, dynamic> exercise;
  final VoidCallback? onComplete;

  const FindMoveWidget({super.key, required this.exercise, this.onComplete});

  @override
  State<FindMoveWidget> createState() => _FindMoveWidgetState();
}

class _FindMoveWidgetState extends State<FindMoveWidget> {
  bool _solved = false;
  String? _feedback;
  final Set<String> _foundMoves = {};

  @override
  Widget build(BuildContext context) {
    final fen = widget.exercise['fen'] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    final question = widget.exercise['question'] ?? 'Find the best move';
    final solution = (widget.exercise['solution'] as List?)?.cast<String>() ?? [];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF3B82F6).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'FIND THE MOVE',
                  style: GoogleFonts.inter(
                    fontSize: 10, fontWeight: FontWeight.w800,
                    color: const Color(0xFF3B82F6), letterSpacing: 1.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            question,
            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 260,
            child: ChessBoardWidget(
              fen: fen,
              interactive: !_solved,
              highlightSquares: _foundMoves.toList(),
              onMove: (from, to) {
                if (solution.contains(to.toLowerCase())) {
                  setState(() {
                    _foundMoves.add(to);
                    if (_foundMoves.length >= solution.length) {
                      _solved = true;
                      _feedback = '🎉 All moves found!';
                      widget.onComplete?.call();
                    } else {
                      _feedback = '✅ Found ${_foundMoves.length}/${solution.length}';
                    }
                  });
                } else {
                  setState(() => _feedback = '❌ That square is not correct. Try again!');
                }
              },
            ),
          ),
          if (_feedback != null) ...[
            const SizedBox(height: 8),
            Text(
              _feedback!,
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.8)),
            ),
          ],
          if (_solved && widget.exercise['explanation'] != null) ...[
            const SizedBox(height: 8),
            Text(
              '📖 ${widget.exercise['explanation']}',
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withOpacity(0.6), height: 1.4),
            ),
          ],
        ],
      ),
    );
  }
}

// ============================================================================
// SkillRadarChart — Simple radar chart for coach dashboard
// ============================================================================
class SkillRadarChart extends StatelessWidget {
  final Map<String, double> skills; // name -> 0.0-1.0

  const SkillRadarChart({super.key, required this.skills});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(200, 200),
      painter: _RadarPainter(skills),
    );
  }
}

class _RadarPainter extends CustomPainter {
  final Map<String, double> skills;
  _RadarPainter(this.skills);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.38;
    final entries = skills.entries.toList();
    final n = entries.length;
    if (n < 3) return;

    final angleStep = 2 * 3.14159 / n;

    // Draw grid circles
    final gridPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = Colors.white.withOpacity(0.06);

    for (int i = 1; i <= 4; i++) {
      canvas.drawCircle(center, radius * i / 4, gridPaint);
    }

    // Draw axes
    for (int i = 0; i < n; i++) {
      final angle = -3.14159 / 2 + i * angleStep;
      final end = Offset(
        center.dx + radius * 1.05 * _cos(angle),
        center.dy + radius * 1.05 * _sin(angle),
      );
      canvas.drawLine(center, end, gridPaint);

      // Label
      final textPainter = TextPainter(
        text: TextSpan(
          text: entries[i].key,
          style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8), fontWeight: FontWeight.w600),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      final labelOffset = Offset(
        center.dx + radius * 1.2 * _cos(angle) - textPainter.width / 2,
        center.dy + radius * 1.2 * _sin(angle) - textPainter.height / 2,
      );
      textPainter.paint(canvas, labelOffset);
    }

    // Draw data polygon
    final path = Path();
    final fillPaint = Paint()
      ..style = PaintingStyle.fill
      ..color = const Color(0xFF10B981).withOpacity(0.15);
    final strokePaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = const Color(0xFF10B981)
      ..strokeWidth = 2;

    for (int i = 0; i < n; i++) {
      final angle = -3.14159 / 2 + i * angleStep;
      final value = entries[i].value.clamp(0.0, 1.0);
      final point = Offset(
        center.dx + radius * value * _cos(angle),
        center.dy + radius * value * _sin(angle),
      );
      if (i == 0) {
        path.moveTo(point.dx, point.dy);
      } else {
        path.lineTo(point.dx, point.dy);
      }

      // Draw dot
      canvas.drawCircle(point, 3, Paint()..color = const Color(0xFF10B981));
    }
    path.close();
    canvas.drawPath(path, fillPaint);
    canvas.drawPath(path, strokePaint);
  }

  double _cos(double angle) => angle == 0 ? 1 : _cosVal(angle);
  double _sin(double angle) => angle == 0 ? 0 : _sinVal(angle);
  double _cosVal(double a) {
    // Simple cos approximation
    final x = a % (2 * 3.14159);
    double result = 1.0;
    double term = 1.0;
    for (int i = 1; i <= 10; i++) {
      term *= -x * x / ((2 * i - 1) * (2 * i));
      result += term;
    }
    return result;
  }
  double _sinVal(double a) {
    final x = a % (2 * 3.14159);
    double result = x;
    double term = x;
    for (int i = 1; i <= 10; i++) {
      term *= -x * x / ((2 * i) * (2 * i + 1));
      result += term;
    }
    return result;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
