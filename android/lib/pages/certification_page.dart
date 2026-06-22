import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive/hive.dart';
import '../core/data_repository.dart';

class CertificationPage extends StatefulWidget {
  const CertificationPage({super.key});

  @override
  State<CertificationPage> createState() => _CertificationPageState();
}

class _CertificationPageState extends State<CertificationPage> {
  final List<Map<String, String>> _majors = [
    {
      'id': 'foundations',
      'title': 'Foundations University',
      'badge': '🎓',
      'color': '0xFF10B981',
      'desc': 'Core rules, piece movements, coordinates, and basic checkmates.',
    },
    {
      'id': 'openings',
      'title': 'Opening University',
      'badge': '📖',
      'color': '0xFF3B82F6',
      'desc': 'Classical opening principles, mainlines, traps, and repertoires.',
    },
    {
      'id': 'tactics',
      'title': 'Tactical University',
      'badge': '⚔️',
      'color': '0xFFF59E0B',
      'desc': 'Double attacks, pins, skewers, mating nets, and deflections.',
    },
    {
      'id': 'middlegame',
      'title': 'Middlegame University',
      'badge': '🏰',
      'color': '0xFFEF4444',
      'desc': 'Pawn structures, piece activity, outposts, space, and planning.',
    },
    {
      'id': 'endgames',
      'title': 'Endgame University',
      'badge': '👑',
      'color': '0xFFF97316',
      'desc': 'Opposition, bridge-building, Lucena, Philidor, and technical mates.',
    },
    {
      'id': 'calculation',
      'title': 'Calculation University',
      'badge': '🧠',
      'color': '0xFF8B5CF6',
      'desc': 'Candidate moves, visualization depth, and variation trees.',
    },
  ];

  Map<String, dynamic> _claimedCerts = {};
  Map<String, bool> _completedMajors = {};

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  void _loadProgress() {
    try {
      final box = Hive.box('progress');
      final certsRaw = box.get('claimed_certifications');
      if (certsRaw != null) {
        _claimedCerts = Map<String, dynamic>.from(certsRaw as Map);
      }

      // Verify completion for each major
      for (final major in _majors) {
        final courseId = major['id']!;
        final course = DataRepository().getCourseById(courseId);
        if (course != null) {
          final modules = course['modules'] as List? ?? [];
          final allDone = modules.isNotEmpty && modules.every((m) =>
              DataRepository().isLessonComplete(courseId, m['id'] as String? ?? ''));
          _completedMajors[courseId] = allDone;
        } else {
          _completedMajors[courseId] = false;
        }
      }
      setState(() {});
    } catch (_) {}
  }

  bool get _qualifiesForGrandmaster {
    // Requires all 6 majors to be completed AND certified
    return _majors.every((m) => _claimedCerts.containsKey(m['id']));
  }

  void _startAssessment(String courseId, String title) {
    final course = DataRepository().getCourseById(courseId);
    if (course == null) return;

    final modules = course['modules'] as List? ?? [];
    final allQuizzes = <Map<String, dynamic>>[];
    for (final m in modules) {
      final exercises = m['exercises'] as List? ?? [];
      for (final ex in exercises) {
        if (ex is Map && ex['type'] == 'quiz') {
          allQuizzes.add(Map<String, dynamic>.from(ex));
        }
      }
    }

    if (allQuizzes.length < 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Not enough test questions available for $title.'),
          backgroundColor: Colors.red[800],
        ),
      );
      return;
    }

    // Shuffle and pick 5
    allQuizzes.shuffle(Random());
    final selectedQuestions = allQuizzes.take(5).toList();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          backgroundColor: const Color(0xFF0C0C14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: _AssessmentQuizSolver(
            courseId: courseId,
            courseTitle: title,
            questions: selectedQuestions,
            onPassed: (score) => _claimCertificate(courseId, score),
          ),
        );
      },
    );
  }

  Future<void> _claimCertificate(String courseId, int score) async {
    try {
      final box = Hive.box('progress');
      final certId = 'CERT-${courseId.toUpperCase().substring(0, min(4, courseId.length))}-${Random().nextInt(900000) + 100000}';
      final today = DateTime.now().toIso8601String().substring(0, 10);

      _claimedCerts[courseId] = {
        'id': certId,
        'date': today,
        'name': 'Grandmaster Candidate',
        'score': '$score/5',
      };

      await box.put('claimed_certifications', _claimedCerts);
      
      // Award extra XP
      final currentXp = box.get('xp', defaultValue: 250) as int;
      await box.put('xp', currentXp + 200);

      setState(() {});

      // Show beautiful success dialog
      showDialog(
        context: context,
        builder: (context) => _CertificateAwardDialog(
          courseId: courseId,
          certId: certId,
          title: _majors.firstWhere((m) => m['id'] == courseId)['title']!,
          date: today,
        ),
      );
    } catch (_) {}
  }

  Future<void> _claimGrandmasterCertificate() async {
    if (!_qualifiesForGrandmaster || _claimedCerts.containsKey('grandmaster')) return;

    try {
      final box = Hive.box('progress');
      final certId = 'CERT-GM-${Random().nextInt(900000) + 100000}';
      final today = DateTime.now().toIso8601String().substring(0, 10);

      _claimedCerts['grandmaster'] = {
        'id': certId,
        'date': today,
        'name': 'ChessOS Certified Grandmaster',
        'score': '6/6 Majors',
      };

      await box.put('claimed_certifications', _claimedCerts);

      // Award major XP
      final currentXp = box.get('xp', defaultValue: 250) as int;
      await box.put('xp', currentXp + 1000);

      setState(() {});

      showDialog(
        context: context,
        builder: (context) => _CertificateAwardDialog(
          courseId: 'grandmaster',
          certId: certId,
          title: 'ChessOS Master of Chess',
          date: today,
          isGrandmaster: true,
        ),
      );
    } catch (_) {}
  }

  void _shareCertificate(String title, String certId) {
    Clipboard.setData(ClipboardData(text: 'I earned the ChessOS $title Certification! Verification ID: $certId'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Certificate info copied to clipboard! Share it with pride.'),
        backgroundColor: Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gmClaimed = _claimedCerts.containsKey('grandmaster');

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'University Certification Center',
          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w900),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Hero Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF10B981).withOpacity(0.08),
                  const Color(0xFF10B981).withOpacity(0.01),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.12)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Verify Your Mastery 🛡️',
                  style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 6),
                Text(
                  'Finish all modules inside a Major, pass the dynamic final assessment with >= 80% accuracy, and claim your institution-grade certification.',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white60, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Ultimate Grandmaster Certificate Section
          if (_qualifiesForGrandmaster || gmClaimed) ...[
            _buildGrandmasterBanner(gmClaimed),
            const SizedBox(height: 24),
          ],

          Text(
            'UNIVERSITY MAJORS',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: Colors.white.withOpacity(0.3),
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),

          // Major certificates grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _majors.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 1,
              mainAxisSpacing: 12,
              childAspectRatio: 2.3,
            ),
            itemBuilder: (context, index) {
              final major = _majors[index];
              final courseId = major['id']!;
              final title = major['title']!;
              final isCompleted = _completedMajors[courseId] ?? false;
              final isClaimed = _claimedCerts.containsKey(courseId);
              final majorColor = Color(int.parse(major['color']!));

              return _buildMajorCard(major, isCompleted, isClaimed, majorColor);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildGrandmasterBanner(bool gmClaimed) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFF59E0B).withOpacity(0.3),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.1),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text('👑', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 10),
          Text(
            'ChessOS Master of Chess',
            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            'The highest academic award in ChessOS. You have completed all 6 University majors and certified your grandmaster level calculation, tactics, and endgame understanding.',
            style: GoogleFonts.inter(fontSize: 11, color: Colors.white60, height: 1.4),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          if (gmClaimed) ...[
            Text(
              'ID: ${_claimedCerts['grandmaster']?['id'] ?? ''}',
              style: GoogleFonts.firaCode(fontSize: 11, color: const Color(0xFFF59E0B), fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: () => _shareCertificate('Master of Chess', _claimedCerts['grandmaster']?['id'] ?? ''),
              icon: const Icon(Icons.share_rounded, size: 16),
              label: const Text('Share Verification'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: const Color(0xFF0C0C14),
              ),
            ),
          ] else ...[
            ElevatedButton(
              onPressed: _claimGrandmasterCertificate,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: const Color(0xFF0C0C14),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              ),
              child: Text(
                'CLAIM GRANDMASTER DEGREE',
                style: GoogleFonts.inter(fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildMajorCard(Map<String, String> major, bool isCompleted, bool isClaimed, Color majorColor) {
    final courseId = major['id']!;
    final title = major['title']!;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isClaimed 
              ? majorColor.withOpacity(0.3)
              : (isCompleted ? Colors.white.withOpacity(0.12) : Colors.white.withOpacity(0.04)),
          width: isClaimed ? 1.5 : 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: (isClaimed ? majorColor : Colors.white10).withOpacity(0.1),
            ),
            child: Center(
              child: Text(
                isClaimed ? '🛡️' : major['badge']!,
                style: const TextStyle(fontSize: 22),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      major['desc']!,
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: Colors.white.withOpacity(0.4),
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (isClaimed) ...[
                      Text(
                        'Certified',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: majorColor,
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: () => _shareCertificate(title, _claimedCerts[courseId]?['id'] ?? ''),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white.withOpacity(0.04),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          side: BorderSide(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: Text(
                          'Share',
                          style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ] else if (isCompleted) ...[
                      ElevatedButton(
                        onPressed: () => _startAssessment(courseId, title),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: majorColor,
                          foregroundColor: const Color(0xFF0C0C14),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text(
                          'Take Assessment',
                          style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ] else ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.03),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'Locked',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white30,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AssessmentQuizSolver extends StatefulWidget {
  final String courseId;
  final String courseTitle;
  final List<Map<String, dynamic>> questions;
  final Function(int) onPassed;

  const _AssessmentQuizSolver({
    required this.courseId,
    required this.courseTitle,
    required this.questions,
    required this.onPassed,
  });

  @override
  State<_AssessmentQuizSolver> createState() => _AssessmentQuizSolverState();
}

class _AssessmentQuizSolverState extends State<_AssessmentQuizSolver> {
  int _currentIdx = 0;
  int? _selectedIndex;
  bool _submitted = false;
  int _correctAnswers = 0;

  void _submitAnswer() {
    if (_selectedIndex == null || _submitted) return;

    final correctIndex = widget.questions[_currentIdx]['answer'] as int;
    final isCorrect = _selectedIndex == correctIndex;
    
    setState(() {
      _submitted = true;
      if (isCorrect) _correctAnswers++;
    });
  }

  void _nextOrFinish() {
    if (_currentIdx < 4) {
      setState(() {
        _currentIdx++;
        _selectedIndex = null;
        _submitted = false;
      });
    } else {
      Navigator.of(context).pop();
      final passed = _correctAnswers >= 4;
      if (passed) {
        widget.onPassed(_correctAnswers);
      } else {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: const Color(0xFF0C0C14),
            title: Text(
              'Assessment Failed',
              style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Colors.white),
            ),
            content: Text(
              'You answered $_correctAnswers out of 5 questions correctly. You need at least 4 correct answers (80%) to pass. Keep studying and try again!',
              style: GoogleFonts.inter(color: Colors.white70),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final q = widget.questions[_currentIdx];
    final question = q['question'] as String;
    final options = (q['options'] as List).cast<String>();
    final correctIndex = q['answer'] as int;

    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Assessment: Q${_currentIdx + 1}/5',
                style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              Text(
                'Correct: $_correctAnswers',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF10B981)),
              ),
            ],
          ),
          const Divider(color: Colors.white10),
          const SizedBox(height: 12),
          Text(
            question,
            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white, height: 1.4),
          ),
          const SizedBox(height: 16),
          ...List.generate(options.length, (idx) {
            final option = options[idx];
            final isSelected = _selectedIndex == idx;

            Color optionBg = Colors.white.withOpacity(0.02);
            Color optionBorder = Colors.white.withOpacity(0.06);

            if (isSelected) {
              optionBg = const Color(0xFF3B82F6).withOpacity(0.08);
              optionBorder = const Color(0xFF3B82F6).withOpacity(0.3);
            }
            if (_submitted) {
              if (idx == correctIndex) {
                optionBg = const Color(0xFF10B981).withOpacity(0.08);
                optionBorder = const Color(0xFF10B981).withOpacity(0.4);
              } else if (isSelected) {
                optionBg = const Color(0xFFEF4444).withOpacity(0.08);
                optionBorder = const Color(0xFFEF4444).withOpacity(0.4);
              }
            }

            return GestureDetector(
              onTap: _submitted ? null : () => setState(() => _selectedIndex = idx),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: optionBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: optionBorder),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        option,
                        style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
                      ),
                    ),
                    if (_submitted && idx == correctIndex)
                      const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 16),
                    if (_submitted && isSelected && idx != correctIndex)
                      const Icon(Icons.cancel, color: Color(0xFFEF4444), size: 16),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _selectedIndex == null
                  ? null
                  : (_submitted ? _nextOrFinish : _submitAnswer),
              style: ElevatedButton.styleFrom(
                backgroundColor: _submitted ? const Color(0xFF1E293B) : const Color(0xFF10B981),
                foregroundColor: _submitted ? Colors.white60 : const Color(0xFF0C0C14),
              ),
              child: Text(
                _submitted 
                    ? (_currentIdx == 4 ? 'Finish' : 'Next Question')
                    : 'Submit Answer',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CertificateAwardDialog extends StatelessWidget {
  final String courseId;
  final String certId;
  final String title;
  final String date;
  final bool isGrandmaster;

  const _CertificateAwardDialog({
    required this.courseId,
    required this.certId,
    required this.title,
    required this.date,
    this.isGrandmaster = false,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Elegant Certificate Layout
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF111119),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isGrandmaster ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                width: 4,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.6),
                  blurRadius: 30,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 12),
                Text(
                  '🎓 CERTIFICATE OF ACHIEVEMENT 🎓',
                  style: GoogleFonts.cinzel(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: isGrandmaster ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'This certifies that',
                  style: GoogleFonts.inter(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.white60),
                ),
                const SizedBox(height: 10),
                Text(
                  'Grandmaster Candidate',
                  style: GoogleFonts.cinzel(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                Text(
                  'has successfully mastered the curriculum of the ChessOS Major in',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white60),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  title.toUpperCase(),
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: isGrandmaster ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                    letterSpacing: 1,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                const Divider(color: Colors.white10),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('VERIFICATION ID', style: GoogleFonts.inter(fontSize: 8, color: Colors.white30)),
                        const SizedBox(height: 2),
                        Text(
                          certId,
                          style: GoogleFonts.firaCode(fontSize: 9, color: Colors.white70, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('DATE CLAIMED', style: GoogleFonts.inter(fontSize: 8, color: Colors.white30)),
                        const SizedBox(height: 2),
                        Text(
                          date,
                          style: GoogleFonts.inter(fontSize: 9, color: Colors.white70, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isGrandmaster ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                      foregroundColor: const Color(0xFF0C0C14),
                    ),
                    child: const Text('PROUDLY CLOSE'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
