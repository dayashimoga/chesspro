import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { SpacedRepetition, SRSCard } from '../core/storage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const QUALITY_LABELS: Record<number, { label: string; color: string; desc: string }> = {
  0: { label: 'Blackout', color: '#ef4444', desc: 'Total failure' },
  1: { label: 'Wrong', color: '#f97316', desc: 'Wrong, but recognized' },
  2: { label: 'Difficult', color: '#eab308', desc: 'Correct after hesitation' },
  3: { label: 'Hard', color: '#fbbf24', desc: 'Correct with effort' },
  4: { label: 'Good', color: '#10b981', desc: 'Correct with some thought' },
  5: { label: 'Perfect', color: '#22d3ee', desc: 'Instant recall' },
};

export const SpacedReview: React.FC = () => {
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ total: 0, due: 0, mastered: 0 });
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    refresh();
    seedDefaultCards();
  }, []);

  const refresh = () => {
    setDueCards(SpacedRepetition.getDueCards());
    setStats(SpacedRepetition.getStats());
  };

  // Seed default opening repertoire cards if none exist
  const seedDefaultCards = () => {
    const existing = SpacedRepetition.getCards();
    if (existing.length > 0) return;
    const openingCards = [
      { id: 'srs-italian', front: 'Italian Game setup after 1.e4 e5 2.Nf3 Nc6 — What is White\'s key developing move?', back: '3.Bc4 — The bishop targets the weak f7 square and prepares for quick kingside castling.', category: 'openings', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3' },
      { id: 'srs-ruylopez', front: 'Ruy Lopez after 1.e4 e5 2.Nf3 Nc6 — What is White\'s signature bishop move?', back: '3.Bb5 — Pins the knight to the king, questioning Black\'s control of e5.', category: 'openings', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3' },
      { id: 'srs-sicilian', front: 'How does Black respond to 1.e4 in the Sicilian Defense?', back: '1...c5 — Controls d4 and creates an asymmetric position.', category: 'openings', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1' },
      { id: 'srs-queens', front: 'Queen\'s Gambit: After 1.d4 d5, what pawn sacrifice does White offer?', back: '2.c4 — Offers the c-pawn to gain central control. Not a true gambit as 2...dxc4 is often recaptured.', category: 'openings', fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2' },
      { id: 'srs-opposition', front: 'King & Pawn endgame: What is the opposition?', back: 'When kings face each other with one square between, the player NOT to move has the opposition advantage.', category: 'endgames', fen: '8/8/4k3/8/4K3/4P3/8/8 w - - 0 1' },
      { id: 'srs-backrank', front: 'What is the back-rank mate pattern?', back: 'A rook or queen delivers checkmate on the 1st/8th rank when the king is trapped by its own pawns (no luft).', category: 'tactics', fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1' },
      { id: 'srs-luft', front: 'What is a "luft" and why is it important?', back: 'Luft (German for "air") is creating an escape square for your king (e.g., h3/h6) to prevent back-rank mates.', category: 'strategy' },
      { id: 'srs-lucena', front: 'Lucena Position: How does the stronger side win in a K+R+P vs K+R endgame?', back: 'Build a "bridge": advance the pawn, use the rook to shield the king from checks by cutting off the enemy rook.', category: 'endgames', fen: '1K1k4/1P6/8/8/8/8/8/1r5R w - - 0 1' },
    ];
    openingCards.forEach(c => SpacedRepetition.addCard(c));
    refresh();
  };

  const currentCard = dueCards[currentIdx];

  const handleRating = (quality: number) => {
    if (!currentCard) return;
    SpacedRepetition.reviewCard(currentCard.id, quality);
    setReviewedCount(r => r + 1);
    setShowAnswer(false);
    if (currentIdx < dueCards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      refresh();
      setCurrentIdx(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Spaced Repetition</span>
        <h2 className="text-2xl font-black text-white">Daily <span className="text-emerald-400">Review</span></h2>
        <p className="text-sm text-slate-400 mt-1">SM-2 algorithm ensures you never forget your preparation.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cards', val: stats.total, icon: '🗂️' },
          { label: 'Due Today', val: stats.due, icon: '📥' },
          { label: 'Mastered', val: stats.mastered, icon: '🏆' },
          { label: 'Reviewed Now', val: reviewedCount, icon: '✅' },
        ].map(s => (
          <Card key={s.label} className="text-center p-4" hoverEffect={false}>
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="text-xl font-bold text-white font-mono">{s.val}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Card Review */}
      {!currentCard ? (
        <Card className="p-12 text-center" hoverEffect={false}>
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-sm text-slate-400 font-semibold">No cards due for review right now. Come back tomorrow for your next session.</p>
          <div className="mt-6 text-xs text-slate-500 font-mono">Total mastered: {stats.mastered} / {stats.total} cards</div>
        </Card>
      ) : (
        <div className="flashcard" onClick={() => !showAnswer && setShowAnswer(true)}>
          <div className={`flashcard-inner ${showAnswer ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-3 font-mono">
                {currentCard.category} • Card {currentIdx + 1} of {dueCards.length}
              </div>
              <p className="text-lg font-bold text-white text-center leading-relaxed">{currentCard.front}</p>
              {currentCard.fen && (
                <div className="mt-4">
                  <Board fen={currentCard.fen} interactive={false} size={220} />
                </div>
              )}
              <div className="mt-6 text-xs text-slate-500 font-bold">Click to reveal answer</div>
            </div>
            <div className="flashcard-back">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-3 font-mono">Answer</div>
              <p className="text-base font-bold text-white text-center leading-relaxed mb-4">{currentCard.back}</p>
              {currentCard.fen && (
                <div className="mb-4">
                  <Board fen={currentCard.fen} interactive={false} size={180} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Buttons */}
      {showAnswer && currentCard && (
        <div className="animate-fadeIn">
          <div className="text-xs text-slate-500 font-bold text-center mb-3">Rate your recall quality:</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map(q => (
              <button
                key={q}
                onClick={() => handleRating(q)}
                className="py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all text-center"
                style={{ backgroundColor: `${QUALITY_LABELS[q].color}10` }}
              >
                <div className="text-sm font-black" style={{ color: QUALITY_LABELS[q].color }}>{q}</div>
                <div className="text-[9px] font-bold text-slate-400">{QUALITY_LABELS[q].label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacedReview;
