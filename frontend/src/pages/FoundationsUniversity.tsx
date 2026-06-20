import React, { useState, useEffect, useCallback } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { Chess, Square } from 'chess.js';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

interface Topic {
  id: string;
  title: string;
  icon: string;
  theory: string;
  defaultFen: string;
  interactiveGoal: string;
  guidedSteps: string[];
  quizzes: Array<{ question: string; options: string[]; answer: number; explanation: string }>;
  highlights?: Array<{ square: string; color?: string }>;
  arrows?: Array<{ from: string; to: string; color?: string }>;
}

const FOUNDATIONS_TOPICS: Topic[] = [
  {
    id: 'coordinates',
    title: 'Board Coordinates',
    icon: '📊',
    theory: `
      <h3>The Chess Grid</h3>
      <p>The chessboard is an 8x8 grid. Ranks are horizontal lines (1 to 8), and Files are vertical columns (a to h).</p>
      <p>Every square has a name combining its File and Rank, like <strong>e4</strong> or <strong>d5</strong>.</p>
    `,
    defaultFen: '8/8/8/8/8/8/8/8 w - - 0 1',
    interactiveGoal: 'coordinate-game',
    guidedSteps: [
      'Click on the square highlighted by the prompt.',
      'Achieve a score of 5 hits within 30 seconds to master coordinates!'
    ],
    quizzes: [
      {
        question: 'Which file is the leftmost column from White\'s perspective?',
        options: ['h-file', 'a-file', 'd-file', 'e-file'],
        answer: 1,
        explanation: 'Files go from a to h, left to right, from White\'s perspective.'
      }
    ]
  },
  {
    id: 'piece-movement',
    title: 'Piece Movement',
    icon: '♟️',
    theory: `
      <h3>Piece Capabilities</h3>
      <p>Select a piece on the board to see all its legal moves highlighted as targets.</p>
      <ul>
        <li><strong>Rook:</strong> Horizontal and vertical movements.</li>
        <li><strong>Bishop:</strong> Diagonal movements.</li>
        <li><strong>Queen:</strong> Combines Rook and Bishop capabilities.</li>
        <li><strong>Knight:</strong> L-shaped moves (jumps over pieces).</li>
        <li><strong>King:</strong> 1 square in any direction.</li>
        <li><strong>Pawn:</strong> 1 square forward (or 2 on first move). Captures diagonally.</li>
      </ul>
    `,
    defaultFen: '4k3/8/8/4P1N1/3Q4/8/1R3B2/4K3 w - - 0 1',
    interactiveGoal: 'explore-moves',
    guidedSteps: [
      'Click any White piece on the board.',
      'Observe the highlighted circles showing where it can move.',
      'Execute a move to see it in action!'
    ],
    quizzes: [
      {
        question: 'Which piece is the only one that can jump over other pieces?',
        options: ['Rook', 'Bishop', 'Knight', 'Queen'],
        answer: 2,
        explanation: 'Knights move in an L-shape and can leap over any intervening pieces.'
      }
    ]
  },
  {
    id: 'castling',
    title: 'Castling Rules',
    icon: '🏰',
    theory: `
      <h3>King Safety & Activation</h3>
      <p>Castling is a dual move where the King moves 2 squares towards a Rook, and the Rook hops over it.</p>
      <p>Requirements: neither piece has moved, no blocking pieces, the King is not in check, and does not pass through check.</p>
    `,
    defaultFen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
    interactiveGoal: 'castle-king',
    guidedSteps: [
      'Move your King from e1 to g1 (Kingside castling) or to c1 (Queenside castling).',
      'Watch how the Rook automatically crosses over to complete the castle.'
    ],
    quizzes: [
      {
        question: 'Can you castle if your King is currently in check?',
        options: ['Yes', 'No'],
        answer: 1,
        explanation: 'You cannot castle out of check, through check, or into check.'
      }
    ],
    highlights: [{ square: 'e1', color: 'rgba(16, 185, 129, 0.4)' }],
    arrows: [
      { from: 'e1', to: 'g1', color: '#10b981' },
      { from: 'e1', to: 'c1', color: '#3b82f6' }
    ]
  },
  {
    id: 'en-passant',
    title: 'En Passant',
    icon: '🏃',
    theory: `
      <h3>In-Passing Capture</h3>
      <p>If an opponent pawn advances 2 squares and lands adjacent to yours, you can capture it diagonally "in passing" as if it had only moved 1 square.</p>
      <p>Must be done immediately on the very next move.</p>
    `,
    defaultFen: '8/8/8/pP6/8/8/8/4K3 w - a6 0 1',
    interactiveGoal: 'capture-ep',
    guidedSteps: [
      'Move White\'s pawn from b5 to a6 to capture Black\'s pawn on a5 en passant.',
      'Notice the Black pawn on a5 disappears from the board.'
    ],
    quizzes: [
      {
        question: 'When must you execute the en passant capture?',
        options: ['Anytime during the game', 'Immediately on the very next move', 'Within 3 moves', 'Only in the endgame'],
        answer: 1,
        explanation: 'The right to capture en passant is lost if not done on the immediate next turn.'
      }
    ],
    highlights: [{ square: 'b5', color: 'rgba(245, 158, 11, 0.4)' }],
    arrows: [{ from: 'b5', to: 'a6', color: '#f59e0b' }]
  },
  {
    id: 'promotion',
    title: 'Pawn Promotion',
    icon: '👑',
    theory: `
      <h3>Reaching the Summit</h3>
      <p>When a pawn reaches the furthest rank (8th rank for White, 1st for Black), it must promote to a Queen, Rook, Bishop, or Knight.</p>
    `,
    defaultFen: '8/4P3/8/8/8/8/8/4K3 w - - 0 1',
    interactiveGoal: 'promote-pawn',
    guidedSteps: [
      'Move the pawn from e7 to e8.',
      'Confirm the promotion to Queen (default) or other piece.'
    ],
    quizzes: [
      {
        question: 'Which piece can a pawn NOT promote to?',
        options: ['Queen', 'King', 'Knight', 'Rook'],
        answer: 1,
        explanation: 'Pawns can promote to Queen, Rook, Bishop, or Knight, but never a King.'
      }
    ],
    highlights: [{ square: 'e7', color: 'rgba(16, 185, 129, 0.4)' }]
  }
];

export const FoundationsUniversity: React.FC = () => {
  const [topicIdx, setTopicIdx] = useState<number>(0);
  const currentTopic = FOUNDATIONS_TOPICS[topicIdx] || FOUNDATIONS_TOPICS[0];
  const [boardFen, setBoardFen] = useState<string>(currentTopic.defaultFen);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Coordinate Game state
  const [coordinateTarget, setCoordinateTarget] = useState<string>('');
  const [coordinateScore, setCoordinateScore] = useState<number>(0);
  const [coordinateTime, setCoordinateTime] = useState<number>(30);
  const [gameRunning, setGameRunning] = useState<boolean>(false);

  // Interactive step feedback
  const [simMessage, setSimMessage] = useState<string>('Follow the guided steps below to practice.');
  const [completedTopic, setCompletedTopic] = useState<boolean>(false);

  // Quiz State
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const addXP = useAppStore(state => state.addXP);

  // Reset states on topic change
  useEffect(() => {
    setBoardFen(currentTopic.defaultFen);
    setLastMove(null);
    setCompletedTopic(false);
    setSimMessage('Follow the guided steps below to practice.');
    setQuizIdx(0);
    setSelectedOpt(null);
    setQuizAnswered(false);
    setGameRunning(false);
  }, [topicIdx]);

  // Coordinate game timer
  useEffect(() => {
    if (!gameRunning) return;
    if (coordinateTime <= 0) {
      setGameRunning(false);
      if (coordinateScore >= 5) {
        setSimMessage(`🎉 Level Mastered! You scored ${coordinateScore} hits. (+15 XP)`);
        addXP(15);
        setCompletedTopic(true);
      } else {
        setSimMessage(`Time up! You scored ${coordinateScore} hits. Need 5 to pass. Try again!`);
      }
      return;
    }
    const timer = setTimeout(() => setCoordinateTime(coordinateTime - 1), 1000);
    return () => clearTimeout(timer);
  }, [coordinateTime, gameRunning]);

  const startCoordinateGame = () => {
    setCoordinateScore(0);
    setCoordinateTime(30);
    setGameRunning(true);
    generateNextCoordinate();
  };

  const generateNextCoordinate = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const randomSq = files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
    setCoordinateTarget(randomSq);
  };

  const handleSquareClick = (square: string) => {
    if (currentTopic.id === 'coordinates' && gameRunning) {
      if (square === coordinateTarget) {
        setCoordinateScore(s => s + 1);
        generateNextCoordinate();
      } else {
        setSimMessage(`Oops! That was ${square}. Keep looking for ${coordinateTarget}!`);
      }
    }
  };

  const handleBoardMove = (from: string, to: string, san: string) => {
    setLastMove({ from, to });
    const chessGame = new Chess(boardFen);

    try {
      const move = chessGame.move({ from, to, promotion: 'q' });
      if (move) {
        const nextFen = chessGame.fen();
        setBoardFen(nextFen);

        // Verify goals
        if (currentTopic.id === 'castling') {
          if (san === 'O-O' || san === 'O-O-O') {
            setSimMessage('🎉 Castling completed! Both safety and activation achieved. (+15 XP)');
            addXP(15);
            setCompletedTopic(true);
          }
        } else if (currentTopic.id === 'en-passant') {
          if (to === 'a6') {
            // Force capture visual
            setBoardFen('8/8/p7/8/8/8/8/4K3 w - - 0 2');
            setSimMessage('🎉 En Passant capture completed! The enemy pawn is removed. (+15 XP)');
            addXP(15);
            setCompletedTopic(true);
          }
        } else if (currentTopic.id === 'promotion') {
          if (to[1] === '8') {
            setSimMessage('🎉 Pawn promoted to Queen successfully! (+15 XP)');
            addXP(15);
            setCompletedTopic(true);
          }
        } else if (currentTopic.id === 'piece-movement') {
          setSimMessage(`Moved piece to ${to}. Continue exploring move patterns!`);
          setCompletedTopic(true);
        }
      }
    } catch {
      setSimMessage('Illegal move. Follow the rules for this specific lab position!');
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOpt === null) return;
    setQuizAnswered(true);
    if (selectedOpt === currentTopic.quizzes[quizIdx].answer) {
      addXP(10);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOpt(null);
    setQuizAnswered(false);
    if (quizIdx < currentTopic.quizzes.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizIdx(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Foundations University</span>
          <h2 className="text-2xl font-black text-white font-serif">Interactive Learning Labs</h2>
        </div>

        {/* Labs Quick Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin max-w-full">
          {FOUNDATIONS_TOPICS.map((topic, idx) => (
            <Button
              key={topic.id}
              onClick={() => setTopicIdx(idx)}
              variant={idx === topicIdx ? 'primary' : 'secondary'}
              size="sm"
              className="whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              <span>{topic.icon}</span>
              <span>{topic.title}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Theory & Quiz */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4" hoverEffect={false}>
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
              <span className="text-2xl">{currentTopic.icon}</span>
              <h3 className="font-bold text-white text-base">{currentTopic.title}</h3>
            </div>

            <div 
              className="text-xs text-slate-300 leading-relaxed space-y-3 font-medium"
              dangerouslySetInnerHTML={{ __html: currentTopic.theory }}
            />
          </Card>

          {/* Assessment Quiz widget */}
          {currentTopic.quizzes && currentTopic.quizzes.length > 0 && (
            <Card className="flex flex-col gap-3" hoverEffect={false}>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Concept Check</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {currentTopic.quizzes[quizIdx].question}
              </p>

              <div className="flex flex-col gap-2 mt-1">
                {currentTopic.quizzes[quizIdx].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => !quizAnswered && setSelectedOpt(oIdx)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      quizAnswered
                        ? oIdx === currentTopic.quizzes[quizIdx].answer
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                          : oIdx === selectedOpt
                          ? 'bg-red-500/10 border-red-500/40 text-red-400'
                          : 'bg-white/[0.02] border-white/5 opacity-50'
                        : selectedOpt === oIdx
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizAnswered && (
                <p className="text-[11px] text-slate-400 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                  <strong className="text-white block mb-0.5">
                    {selectedOpt === currentTopic.quizzes[quizIdx].answer ? '🎉 Correct!' : '❌ Incorrect'}
                  </strong>
                  {currentTopic.quizzes[quizIdx].explanation}
                </p>
              )}

              {!quizAnswered ? (
                <Button
                  onClick={handleQuizSubmit}
                  disabled={selectedOpt === null}
                  fullWidth
                  size="sm"
                  className="mt-1"
                >
                  Verify Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuiz}
                  variant="secondary"
                  fullWidth
                  size="sm"
                  className="mt-1"
                >
                  Next Challenge
                </Button>
              )}
            </Card>
          )}
        </div>

        {/* Right 2 Columns: Interactive Board Simulator */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="flex flex-col md:flex-row gap-6 items-center" hoverEffect={false}>
            
            {/* Interactive Chessboard */}
            <div className="flex flex-col gap-2 items-center">
              <Board
                fen={boardFen}
                interactive={currentTopic.id !== 'coordinates' || gameRunning}
                onMove={handleBoardMove}
                onSquareClick={handleSquareClick}
                size={340}
                highlights={currentTopic.highlights}
                arrows={currentTopic.arrows}
              />
            </div>

            {/* Simulation controls & logs */}
            <div className="flex flex-col gap-4 flex-1 w-full justify-between self-stretch">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive Practice Lab</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{currentTopic.title} Training</h3>
              </div>

              {/* Game display logic for Coordinates game */}
              {currentTopic.id === 'coordinates' ? (
                <div className="bg-bg-primary/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 w-full">
                  <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                    <span>Target Target:</span>
                    <span className="text-emerald-400 font-extrabold text-lg uppercase tracking-wider">{coordinateTarget || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                    <span>Score (Hits):</span>
                    <span>{coordinateScore} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span>Remaining Time:</span>
                    <span className={coordinateTime < 10 ? 'text-red-500 animate-pulse' : 'text-slate-300'}>{coordinateTime}s</span>
                  </div>

                  {!gameRunning ? (
                    <Button
                      onClick={startCoordinateGame}
                      fullWidth
                      size="sm"
                      className="mt-2"
                    >
                      Start Training Game
                    </Button>
                  ) : (
                    <p className="text-[11px] text-slate-400 text-center italic mt-2">Click target coordinates on the board grid.</p>
                  )}
                </div>
              ) : (
                <div className="bg-bg-primary/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs w-full">
                  <span className="text-slate-400">Simulation Output:</span>
                  <p className="text-emerald-400 font-bold leading-relaxed">{simMessage}</p>
                </div>
              )}

              {/* Practice guidance instructions */}
              <div className="border border-white/5 bg-white/[0.02] p-4 rounded-2xl w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Guided Practice Instructions</span>
                <ul className="list-disc pl-4 flex flex-col gap-1">
                  {currentTopic.guidedSteps.map((step, sIdx) => (
                    <li key={sIdx} className="text-[11px] text-slate-300 leading-normal font-semibold">{step}</li>
                  ))}
                </ul>
              </div>

              {completedTopic && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold p-3 rounded-xl text-center">
                  🏆 Topic Mastered! Section completed. Feel free to progress to other labs.
                </div>
              )}
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
};

export default FoundationsUniversity;
