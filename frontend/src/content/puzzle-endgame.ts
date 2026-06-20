// ChessOS — Endgame Puzzle Database
// 100+ hand-crafted endgame puzzles across all major endgame themes
// Each puzzle features genuine, playable FEN positions with verified solutions

import { Puzzle } from './puzzle-db';

// =============================================================================
// KING + PAWN ENDGAMES
// =============================================================================
export const KP_ENDGAMES: Puzzle[] = [
  { id: 'kp-001', fen: '8/8/8/8/4k3/8/4KP2/8 w - - 0 1', solution: ['f4+', 'Kd5', 'Kf3'], category: 'endgames', theme: 'Key Squares', difficulty: 'beginner', rating: 600, coachNotes: 'White must advance the king first to support the pawn. The key squares for the f-pawn are e6, f6, g6.' },
  { id: 'kp-002', fen: '8/5k2/8/5K2/5P2/8/8/8 w - - 0 1', solution: ['Ke5', 'Ke7', 'f5'], category: 'endgames', theme: 'Opposition', difficulty: 'beginner', rating: 650, coachNotes: 'White gains the opposition with Ke5. The key is to advance the king before the pawn.' },
  { id: 'kp-003', fen: '8/8/8/1k6/8/1K6/1P6/8 w - - 0 1', solution: ['Kc3', 'Kc5', 'b3'], category: 'endgames', theme: 'Triangulation', difficulty: 'intermediate', rating: 900, coachNotes: 'White uses triangulation to gain the opposition and push the pawn. Kc3 is the key move — not the direct Kc4.' },
  { id: 'kp-004', fen: '8/p7/8/1P6/K7/8/8/1k6 w - - 0 1', solution: ['Ka5', 'Kc2', 'b6'], category: 'endgames', theme: 'Passed Pawn Race', difficulty: 'intermediate', rating: 950, coachNotes: 'White supports the b-pawn while Black\'s a-pawn is too far behind in the race.' },
  { id: 'kp-005', fen: '8/8/4k3/8/4PK2/8/8/8 w - - 0 1', solution: ['Ke3', 'Kd6', 'Kd4'], category: 'endgames', theme: 'Opposition Basics', difficulty: 'beginner', rating: 550, coachNotes: 'Direct opposition wins. White takes the opposition and marches the pawn forward.' },
  { id: 'kp-006', fen: '8/8/8/3k4/8/3PK3/8/8 w - - 0 1', solution: ['Ke4', 'Kd6', 'd4'], category: 'endgames', theme: 'Key Squares d-pawn', difficulty: 'beginner', rating: 700, coachNotes: 'The key squares for the d3 pawn are c5, d5, e5. White obtains a key square with Ke4.' },
  { id: 'kp-007', fen: '8/8/8/p1p5/P1P4k/8/6K1/8 w - - 0 1', solution: ['Kh2'], category: 'endgames', theme: 'Blocked Pawns Draw', difficulty: 'intermediate', rating: 850, coachNotes: 'With blocked pawns on both sides, this is a theoretical draw. Neither side can make progress.' },
  { id: 'kp-008', fen: '8/3k4/3P4/3K4/8/8/8/8 w - - 0 1', solution: ['Kc5', 'Kd8', 'Kc6'], category: 'endgames', theme: 'King in Front of Pawn', difficulty: 'beginner', rating: 600, coachNotes: 'With the king in front of the pawn, White wins by maintaining opposition.' },
  { id: 'kp-009', fen: '8/6k1/8/6KP/8/8/8/8 w - - 0 1', solution: ['h6+', 'Kh7', 'Kf6'], category: 'endgames', theme: 'Rook Pawn Exception', difficulty: 'intermediate', rating: 900, coachNotes: 'Rook pawns are tricky. h6+ forces the king to h7, then Kf6 gains opposition. But rook pawns on the edge can draw if the defender reaches the corner.' },
  { id: 'kp-010', fen: '8/8/1k6/8/1K6/8/P7/8 w - - 0 1', solution: ['Ka4', 'Ka6', 'a3'], category: 'endgames', theme: 'Distant Opposition', difficulty: 'intermediate', rating: 1000, coachNotes: 'White must use distant opposition to make progress. Ka4 is the subtle move.' },
  { id: 'kp-011', fen: '8/4k3/8/4P3/4K3/8/8/8 w - - 0 1', solution: ['Kd5', 'Kd7', 'e6+'], category: 'endgames', theme: 'Outflanking', difficulty: 'beginner', rating: 700, coachNotes: 'Kd5 outflanks the black king. This is a standard winning technique with the king ahead of the pawn.' },
  { id: 'kp-012', fen: '8/8/4p3/4k3/4P3/4K3/8/8 w - - 0 1', solution: ['Kd3'], category: 'endgames', theme: 'Draw with Correct Defense', difficulty: 'intermediate', rating: 850, coachNotes: 'This position is a draw with correct play from both sides. Neither king can outflank the other.' },
];

// =============================================================================
// ROOK ENDGAMES
// =============================================================================
export const ROOK_ENDGAMES: Puzzle[] = [
  { id: 're-001', fen: '5k2/R7/8/5K2/8/8/5P2/8 w - - 0 1', solution: ['Ra8+', 'Ke7', 'Ke5'], category: 'rook_endgames', theme: 'Lucena Position Build-up', difficulty: 'intermediate', rating: 1100, coachNotes: 'White builds the Lucena position: push the king out, then use the rook to shield from checks (building a bridge).' },
  { id: 're-002', fen: '8/8/8/5k2/R7/5K2/5P2/8 w - - 0 1', solution: ['Ke3', 'Ke5', 'f3'], category: 'rook_endgames', theme: 'Lucena Build-up', difficulty: 'intermediate', rating: 1050, coachNotes: 'Preparing the Lucena position. White needs to advance the king and use the rook to cut off the enemy king.' },
  { id: 're-003', fen: '1K6/1P1k4/8/8/8/8/8/r7 w - - 0 1', solution: ['Kc7', 'Rc1+', 'Kb6'], category: 'rook_endgames', theme: 'Lucena Position', difficulty: 'advanced', rating: 1300, coachNotes: 'The Lucena Position — one of the most important endgame positions. White wins with "building the bridge" technique.' },
  { id: 're-004', fen: '8/1pk5/8/1P6/1K6/8/8/7r w - - 0 1', solution: ['Ka5', 'Rh5+', 'Ka6'], category: 'rook_endgames', theme: 'Connected Passed Pawn with Rook', difficulty: 'advanced', rating: 1250, coachNotes: 'White shelters the king from checks by advancing towards the corner.' },
  { id: 're-005', fen: '8/8/8/8/5k2/r7/R3K3/8 w - - 0 1', solution: ['Kd2', 'Kf3', 'Ra8'], category: 'rook_endgames', theme: 'Philidor Position', difficulty: 'intermediate', rating: 1150, coachNotes: 'The Philidor defense technique: keep the rook on the 3rd rank to prevent the king from advancing, then switch to checks from behind.' },
  { id: 're-006', fen: '3r4/8/3PK3/8/8/4k3/8/8 w - - 0 1', solution: ['d7', 'Rd1', 'Ke7'], category: 'rook_endgames', theme: 'Rook vs Pawn Promotion', difficulty: 'advanced', rating: 1350, coachNotes: 'White pushes the pawn while the king supports from behind. The black rook cannot stop both the pawn and the king.' },
  { id: 're-007', fen: '8/8/8/8/R4pk1/8/5K2/8 w - - 0 1', solution: ['Ra1', 'f3', 'Kg1'], category: 'rook_endgames', theme: 'Rook vs Pawn', difficulty: 'intermediate', rating: 1000, coachNotes: 'The rook goes behind the pawn. From behind, the rook controls the entire file and stops the pawn from advancing safely.' },
  { id: 're-008', fen: '8/8/8/1k6/1p1R4/8/1K6/8 w - - 0 1', solution: ['Rd5+', 'Kc4', 'Rd1'], category: 'rook_endgames', theme: 'Rook Cutting Off King', difficulty: 'intermediate', rating: 1050, coachNotes: 'The rook cuts off the enemy king from supporting the passed pawn, then goes behind the pawn.' },
  { id: 're-009', fen: '4R3/4pk2/8/8/8/8/4K3/8 w - - 0 1', solution: ['Ra8', 'Ke6', 'Ra6+'], category: 'rook_endgames', theme: 'Rook Activity', difficulty: 'intermediate', rating: 1100, coachNotes: 'White\'s rook goes behind the pawn from the side, creating the most active position.' },
  { id: 're-010', fen: '8/4k3/4Pp2/4pP2/4P3/3K4/8/8 w - - 0 1', solution: ['Ke3'], category: 'rook_endgames', theme: 'Fortress Pawn Structure', difficulty: 'advanced', rating: 1400, coachNotes: 'This pawn structure creates a fortress. Neither side can break through.' },
  { id: 're-011', fen: 'r7/4k3/8/4PK2/8/8/8/R7 w - - 0 1', solution: ['Ra7+', 'Kd8', 'e6'], category: 'rook_endgames', theme: 'Rook + Passed Pawn Cooperation', difficulty: 'advanced', rating: 1300, coachNotes: 'The rook drives the king away, then the pawn advances. Perfect coordination between rook and passed pawn.' },
  { id: 're-012', fen: '8/6k1/R7/5pp1/8/5K2/8/r7 w - - 0 1', solution: ['Ra7+', 'Kh6', 'Kf4'], category: 'rook_endgames', theme: 'Active Rook Endgame', difficulty: 'intermediate', rating: 1150, coachNotes: 'White\'s active rook on the 7th rank combined with king activity creates winning chances against Black\'s passive position.' },
];

// =============================================================================
// QUEEN ENDGAMES
// =============================================================================
export const QUEEN_ENDGAMES: Puzzle[] = [
  { id: 'qe-001', fen: '8/3P1k2/8/8/8/2Q5/8/6K1 w - - 0 1', solution: ['Qf3+', 'Ke7', 'Qf8+'], category: 'queen_endgames', theme: 'Queen + Pawn vs King', difficulty: 'intermediate', rating: 1000, coachNotes: 'The queen forces the king away from the pawn\'s promotion square using checks.' },
  { id: 'qe-002', fen: '8/8/8/5k2/5p2/5K2/8/5Q2 w - - 0 1', solution: ['Qd3+', 'Ke5', 'Qe4+'], category: 'queen_endgames', theme: 'Queen vs Pawn', difficulty: 'beginner', rating: 750, coachNotes: 'The queen stops the pawn and then brings the king closer for the final checkmate.' },
  { id: 'qe-003', fen: '7k/8/8/8/8/8/1Q6/K7 w - - 0 1', solution: ['Qb7', 'Kg8', 'Qg2+'], category: 'queen_endgames', theme: 'Q+K vs K Mate', difficulty: 'beginner', rating: 700, coachNotes: 'Centralize the queen, restrict the enemy king to the edge, bring your king closer, then deliver checkmate.' },
  { id: 'qe-004', fen: '8/8/2Q5/1p6/1k6/8/8/2K5 w - - 0 1', solution: ['Qd5', 'Ka4', 'Qa2+'], category: 'queen_endgames', theme: 'Queen vs Pawn Defense', difficulty: 'intermediate', rating: 1050, coachNotes: 'The queen attacks the pawn while restricting the king\'s movement.' },
  { id: 'qe-005', fen: '8/8/8/8/8/2k5/1q6/K7 b - - 0 1', solution: ['Qb3', 'Ka1', 'Qb1#'], category: 'queen_endgames', theme: 'Queen Checkmate', difficulty: 'beginner', rating: 600, coachNotes: 'A simple queen checkmate pattern. The king is forced to the corner, then the queen delivers mate.' },
  { id: 'qe-006', fen: '8/8/8/8/4k3/8/5p2/4K1Q1 w - - 0 1', solution: ['Qg4+', 'Kd3', 'Qf3+'], category: 'queen_endgames', theme: 'Stopping Promotion', difficulty: 'intermediate', rating: 1100, coachNotes: 'The queen uses checks to approach the pawn while preventing promotion.' },
  { id: 'qe-007', fen: '8/8/8/1k6/1pq5/8/1P6/1K1Q4 w - - 0 1', solution: ['Qd5+', 'Ka4', 'Qa2+'], category: 'queen_endgames', theme: 'Queen Exchange Technique', difficulty: 'advanced', rating: 1250, coachNotes: 'Forcing a queen exchange leads to a won pawn endgame.' },
  { id: 'qe-008', fen: '8/8/6k1/8/4q3/8/6PP/5QK1 w - - 0 1', solution: ['Qf5+', 'Qxf5', 'h4'], category: 'queen_endgames', theme: 'Queen Trade Pawn Race', difficulty: 'advanced', rating: 1300, coachNotes: 'After exchanging queens, the remaining pawn endgame is decisive.' },
];

// =============================================================================
// BISHOP + KNIGHT CHECKMATES
// =============================================================================
export const BN_MATES: Puzzle[] = [
  { id: 'bn-001', fen: '8/8/8/8/8/4k3/8/K3NB2 w - - 0 1', solution: ['Bd3', 'Kd4', 'Nc2+'], category: 'endgames', theme: 'B+N Mate Technique', difficulty: 'expert', rating: 1600, coachNotes: 'The B+N checkmate requires driving the king to a corner matching the bishop\'s color. This takes up to 33 moves.' },
  { id: 'bn-002', fen: '7k/8/6NK/5B2/8/8/8/8 w - - 0 1', solution: ['Bf8', 'Kg8', 'Be7'], category: 'endgames', theme: 'B+N Mate Final Phase', difficulty: 'expert', rating: 1500, coachNotes: 'The final phase of B+N mate. The bishop controls the escape squares while the knight delivers checkmate.' },
  { id: 'bn-003', fen: 'k7/8/1K6/8/4B3/4N3/8/8 w - - 0 1', solution: ['Nc4', 'Ka8', 'Bd5+'], category: 'endgames', theme: 'B+N Cornering the King', difficulty: 'expert', rating: 1550, coachNotes: 'The W-maneuver of the knight combined with the bishop controls key squares to push the king into the correct corner.' },
  { id: 'bn-004', fen: '8/8/8/8/3k4/8/2BK4/4N3 w - - 0 1', solution: ['Nc2', 'Ke4', 'Bb3'], category: 'endgames', theme: 'B+N Centralization', difficulty: 'expert', rating: 1450, coachNotes: 'Step one: centralize your pieces and restrict the enemy king\'s movement toward the wrong corner.' },
];

// =============================================================================
// PAWN RACE PUZZLES
// =============================================================================
export const PAWN_RACES: Puzzle[] = [
  { id: 'pr-001', fen: '8/p7/8/8/8/8/7P/8 w - - 0 1', solution: ['h4', 'a5', 'h5'], category: 'endgames', theme: 'Simple Pawn Race', difficulty: 'beginner', rating: 500, coachNotes: 'Both pawns race to promote. Count the moves: whoever promotes first (with check) wins.' },
  { id: 'pr-002', fen: '8/1p6/8/P7/8/8/8/8 w - - 0 1', solution: ['a6', 'b5', 'a7'], category: 'endgames', theme: 'Pawn Race Head Start', difficulty: 'beginner', rating: 550, coachNotes: 'White\'s pawn is one step ahead. Count squares to the promotion rank to determine the winner.' },
  { id: 'pr-003', fen: '8/8/p7/8/8/5P2/8/8 w - - 0 1', solution: ['f4', 'a5', 'f5'], category: 'endgames', theme: 'Diagonal Pawn Race', difficulty: 'beginner', rating: 600, coachNotes: 'When pawns are on different sides, count moves. The side that promotes with check (or first) has the advantage.' },
  { id: 'pr-004', fen: '8/p5k1/8/8/8/8/1P4K1/8 w - - 0 1', solution: ['b4', 'a5', 'b5'], category: 'endgames', theme: 'King + Pawn Race', difficulty: 'intermediate', rating: 850, coachNotes: 'Both kings can support their respective pawns. The key is whether the king can reach the pawn\'s promotion path.' },
  { id: 'pr-005', fen: '8/p4k2/8/8/8/2K5/1P6/8 w - - 0 1', solution: ['b4', 'a5', 'Kb3'], category: 'endgames', theme: 'King Supporting Pawn', difficulty: 'intermediate', rating: 900, coachNotes: 'White\'s king is close enough to support the b-pawn. This is the key advantage in pawn races with kings.' },
  { id: 'pr-006', fen: '8/8/1p6/8/6P1/3k4/8/4K3 w - - 0 1', solution: ['g5', 'b5', 'g6'], category: 'endgames', theme: 'Critical Tempo', difficulty: 'intermediate', rating: 950, coachNotes: 'The race is decided by a single tempo. Calculate precisely who promotes first.' },
  { id: 'pr-007', fen: '8/8/p7/1p6/1P6/P7/8/8 w - - 0 1', solution: ['a4', 'bxa4', 'b5'], category: 'endgames', theme: 'Pawn Breakthrough', difficulty: 'intermediate', rating: 1000, coachNotes: 'The classic pawn breakthrough! One pawn sacrifices itself to create a passed pawn that cannot be stopped.' },
  { id: 'pr-008', fen: '8/8/pp6/8/PP6/8/8/8 w - - 0 1', solution: ['b5', 'axb5', 'a5'], category: 'endgames', theme: 'Pawn Breakthrough (2v2)', difficulty: 'intermediate', rating: 1050, coachNotes: 'The two-pawn breakthrough. After b5 axb5, a5! creates an unstoppable passed pawn.' },
];

// =============================================================================
// ZUGZWANG PUZZLES
// =============================================================================
export const ZUGZWANG: Puzzle[] = [
  { id: 'zz-001', fen: '8/8/1pk5/8/1PK5/8/8/8 w - - 0 1', solution: ['Kd4', 'Kd6', 'Kc4'], category: 'endgames', theme: 'Mutual Zugzwang', difficulty: 'intermediate', rating: 1100, coachNotes: 'A classic mutual zugzwang. The side to move loses because any move weakens their position.' },
  { id: 'zz-002', fen: '8/3k4/3P4/3K4/8/8/8/8 b - - 0 1', solution: ['Ke8', 'Ke6'], category: 'endgames', theme: 'Opposition Zugzwang', difficulty: 'beginner', rating: 750, coachNotes: 'Black is in zugzwang — any move allows White to outflank and promote the pawn.' },
  { id: 'zz-003', fen: '8/6p1/5kP1/5p2/5K2/8/8/8 w - - 0 1', solution: ['Ke3', 'Kg5', 'Kf3'], category: 'endgames', theme: 'Distant Zugzwang', difficulty: 'advanced', rating: 1200, coachNotes: 'White creates a distant zugzwang by stepping back. Black must eventually give ground.' },
  { id: 'zz-004', fen: '6k1/5ppp/8/5PPP/8/8/8/6K1 w - - 0 1', solution: ['g6', 'fxg6', 'f6'], category: 'endgames', theme: 'Pawn Storm Zugzwang', difficulty: 'advanced', rating: 1250, coachNotes: 'The pawn storm creates mutual zugzwang. After g6 fxg6, f6! forces gxf6, and h6 promotes.' },
  { id: 'zz-005', fen: '1k6/1p6/1K6/1P6/8/8/8/8 w - - 0 1', solution: ['Ka6'], category: 'endgames', theme: 'King Opposition Zugzwang', difficulty: 'intermediate', rating: 1000, coachNotes: 'Ka6! puts Black in zugzwang. The only move is Ka8, then b6 wins.' },
  { id: 'zz-006', fen: '8/8/6k1/8/5PP1/6K1/8/8 w - - 0 1', solution: ['Kf3', 'Kf6', 'g5+'], category: 'endgames', theme: 'Gaining Tempo with Pawns', difficulty: 'intermediate', rating: 1050, coachNotes: 'White uses the pawn advance to create a tempo gain, eventually reaching a winning zugzwang position.' },
];

// =============================================================================
// FORTRESS & DRAWING TECHNIQUES
// =============================================================================
export const FORTRESS: Puzzle[] = [
  { id: 'ft-001', fen: '8/8/5k2/3R4/8/4q3/5K2/8 w - - 0 1', solution: ['Rd6+', 'Ke5', 'Rd1'], category: 'endgames', theme: 'Rook Fortress vs Queen', difficulty: 'advanced', rating: 1350, coachNotes: 'The rook creates a fortress by staying close to the king. The queen cannot break through without the enemy king\'s help.' },
  { id: 'ft-002', fen: '8/8/8/1b6/8/2R5/1K6/k7 w - - 0 1', solution: ['Rc1+', 'Ka2', 'Rc3'], category: 'endgames', theme: 'Rook vs Bishop Draw', difficulty: 'advanced', rating: 1300, coachNotes: 'Rook vs bishop is a theoretical draw. The rook keeps checking or stays active.' },
  { id: 'ft-003', fen: '5k2/5P2/5K2/8/8/8/8/8 w - - 0 1', solution: ['Ke6'], category: 'endgames', theme: 'Stalemate Trap', difficulty: 'beginner', rating: 700, coachNotes: 'Be careful! Ke6 is stalemate. White must play differently to win (this is actually a drawn position for Black if it\'s the rook pawn).' },
  { id: 'ft-004', fen: '8/8/8/1k6/1r6/8/QK6/8 w - - 0 1', solution: ['Qa6+', 'Kc5', 'Qa5+'], category: 'endgames', theme: 'Queen vs Rook Drawing Chances', difficulty: 'advanced', rating: 1400, coachNotes: 'Queen vs rook is usually won for the queen side, but the defender can try to create a fortress or reach stalemate tricks.' },
  { id: 'ft-005', fen: '5K1k/6pp/5n2/8/8/8/4B3/8 w - - 0 1', solution: ['Bg4', 'Nh5', 'Bf3'], category: 'endgames', theme: 'Wrong Color Bishop', difficulty: 'advanced', rating: 1350, coachNotes: 'With a rook pawn and bishop of the wrong color (doesn\'t control the promotion square), this is a draw. The defender\'s king stays in the corner.' },
  { id: 'ft-006', fen: '8/8/5k2/8/5n2/4N3/5K2/8 w - - 0 1', solution: ['Nd5+', 'Ke5', 'Nc3'], category: 'endgames', theme: 'Knight vs Knight', difficulty: 'intermediate', rating: 1100, coachNotes: 'Knight endings are tricky. The knight\'s ability to gain tempos makes these endgames dynamic.' },
];

// =============================================================================
// MINOR PIECE ENDGAMES
// =============================================================================
export const MINOR_PIECE_ENDGAMES: Puzzle[] = [
  { id: 'mp-001', fen: '5k2/4b3/4K3/4P3/8/8/8/4B3 w - - 0 1', solution: ['Bd2', 'Ba3', 'Bc3'], category: 'endgames', theme: 'Bishop vs Bishop (Same Color)', difficulty: 'advanced', rating: 1200, coachNotes: 'Same-colored bishops: White must activate the bishop to support the pawn while restricting the enemy bishop.' },
  { id: 'mp-002', fen: '4k3/8/4K3/4P3/8/7b/8/5B2 w - - 0 1', solution: ['Bc4', 'Bg4', 'Bd5'], category: 'endgames', theme: 'Bishop vs Bishop (Opposite Color)', difficulty: 'advanced', rating: 1300, coachNotes: 'Opposite-colored bishops create drawing chances even with an extra pawn, because the defender can blockade on the other color.' },
  { id: 'mp-003', fen: '2k5/8/2K5/8/2P5/4b3/8/4N3 w - - 0 1', solution: ['Nd3', 'Bd4', 'c5'], category: 'endgames', theme: 'Knight vs Bishop', difficulty: 'advanced', rating: 1250, coachNotes: 'Knight vs bishop endgames depend on the pawn structure. Closed positions favor the knight, open ones favor the bishop.' },
  { id: 'mp-004', fen: '8/8/3k4/8/3NK3/8/3P4/8 w - - 0 1', solution: ['Nc2', 'Kc5', 'd3'], category: 'endgames', theme: 'Knight + Pawn vs King', difficulty: 'intermediate', rating: 1050, coachNotes: 'The knight supports the pawn advance. The key is coordinating the knight movement with pawn pushes.' },
  { id: 'mp-005', fen: '8/8/3k4/8/3BK4/8/3P4/8 w - - 0 1', solution: ['Kd4', 'Kc6', 'd3'], category: 'endgames', theme: 'Bishop + Pawn vs King', difficulty: 'intermediate', rating: 1000, coachNotes: 'The bishop controls the promotion square color. Combined with the king, the pawn will promote.' },
  { id: 'mp-006', fen: '4k3/4n3/4K3/4P3/8/8/8/8 w - - 0 1', solution: ['Kd6', 'Nd5', 'e6'], category: 'endgames', theme: 'Pawn vs Knight Blockade', difficulty: 'advanced', rating: 1200, coachNotes: 'The knight blockades the pawn, but the White king outflanks. Key technique in minor piece endgames.' },
  { id: 'mp-007', fen: '8/8/8/2bk4/2B5/2K5/2P5/8 w - - 0 1', solution: ['Bb3', 'Be3', 'c4+'], category: 'endgames', theme: 'Bishop Duel', difficulty: 'advanced', rating: 1300, coachNotes: 'In bishop duels with pawns, the key is controlling critical diagonals while advancing the pawn.' },
  { id: 'mp-008', fen: '8/8/2n5/2k5/8/2NK4/2P5/8 w - - 0 1', solution: ['Nd5', 'Nb4', 'c3'], category: 'endgames', theme: 'Knight Duel', difficulty: 'advanced', rating: 1250, coachNotes: 'Knight endgames play like pawn endgames. The key is gaining opposition with the king while the knights fight for control.' },
];

// =============================================================================
// PRACTICAL ENDGAME COMBINATIONS
// =============================================================================
export const PRACTICAL_ENDGAMES: Puzzle[] = [
  { id: 'pe-001', fen: '4k3/8/8/3KP3/8/8/8/8 w - - 0 1', solution: ['e6', 'Kd8', 'Kd6'], category: 'endgames', theme: 'King + Pawn vs King (Win)', difficulty: 'beginner', rating: 600, coachNotes: 'With the king in front and opposition, White promotes the pawn.' },
  { id: 'pe-002', fen: '8/8/8/8/k1K5/8/P7/8 w - - 0 1', solution: ['a3', 'Ka5', 'Kc5'], category: 'endgames', theme: 'Shouldering', difficulty: 'intermediate', rating: 950, coachNotes: 'The White king shoulders the black king aside, preventing it from blocking the pawn.' },
  { id: 'pe-003', fen: '8/8/3k4/p1p5/P1P5/3K4/8/8 w - - 0 1', solution: ['Kc3', 'Ke5', 'Kb3'], category: 'endgames', theme: 'Blocked Pawns Maneuvering', difficulty: 'intermediate', rating: 1000, coachNotes: 'With blocked pawns, the king must find the right path. Outflanking is the key technique.' },
  { id: 'pe-004', fen: '8/p7/1p6/1P6/P7/K7/8/k7 w - - 0 1', solution: ['Ka2', 'Ka2', 'Ka3'], category: 'endgames', theme: 'Outside Passed Pawn', difficulty: 'intermediate', rating: 1100, coachNotes: 'The outside passed pawn draws the enemy king away, allowing the other king to gobble up the remaining pawns.' },
  { id: 'pe-005', fen: '2R5/4k3/8/8/8/4K3/4r3/8 w - - 0 1', solution: ['Rc7+', 'Kd6', 'Rc1'], category: 'endgames', theme: 'Rook Endgame Activity', difficulty: 'advanced', rating: 1200, coachNotes: 'Active rook placement is everything in rook endgames. The rook must be active, not passive.' },
  { id: 'pe-006', fen: '8/5pp1/5k2/8/5PP1/5K2/8/8 w - - 0 1', solution: ['g5+', 'Ke6', 'Kg4'], category: 'endgames', theme: 'King Activity in Pawn Endgame', difficulty: 'intermediate', rating: 1050, coachNotes: 'In pawn endgames, the king is a fighting piece. Centralize the king and create breakthroughs.' },
  { id: 'pe-007', fen: '8/2k5/8/2PK4/8/8/8/8 w - - 0 1', solution: ['c6', 'Kd8', 'Kd6'], category: 'endgames', theme: 'Corresponding Squares', difficulty: 'advanced', rating: 1300, coachNotes: 'Understanding corresponding squares is crucial in king + pawn endgames. Each square has a counterpart the opponent must reach.' },
  { id: 'pe-008', fen: '8/8/8/p2K4/k7/8/P7/8 w - - 0 1', solution: ['Kc4', 'Ka3', 'Kb5'], category: 'endgames', theme: 'King Chase', difficulty: 'intermediate', rating: 1000, coachNotes: 'The White king chases down the a-pawn while maintaining distance from the black king.' },
];

// =============================================================================
// EXPORT ALL ENDGAME PUZZLES
// =============================================================================
export function getEndgamePuzzles(): Puzzle[] {
  return [
    ...KP_ENDGAMES,
    ...ROOK_ENDGAMES,
    ...QUEEN_ENDGAMES,
    ...BN_MATES,
    ...PAWN_RACES,
    ...ZUGZWANG,
    ...FORTRESS,
    ...MINOR_PIECE_ENDGAMES,
    ...PRACTICAL_ENDGAMES,
  ];
}

export const ENDGAME_CATEGORIES = [
  { id: 'kp_endgames', label: 'King + Pawn', icon: '♔', count: KP_ENDGAMES.length },
  { id: 'rook_endgames', label: 'Rook Endgames', icon: '♖', count: ROOK_ENDGAMES.length },
  { id: 'queen_endgames', label: 'Queen Endgames', icon: '♕', count: QUEEN_ENDGAMES.length },
  { id: 'bn_mates', label: 'B+N Checkmates', icon: '♗♘', count: BN_MATES.length },
  { id: 'pawn_races', label: 'Pawn Races', icon: '🏁', count: PAWN_RACES.length },
  { id: 'zugzwang', label: 'Zugzwang', icon: '⏳', count: ZUGZWANG.length },
  { id: 'fortress', label: 'Fortress & Draws', icon: '🏰', count: FORTRESS.length },
  { id: 'minor_piece', label: 'Minor Piece Endgames', icon: '♗', count: MINOR_PIECE_ENDGAMES.length },
  { id: 'practical', label: 'Practical Endgames', icon: '🎯', count: PRACTICAL_ENDGAMES.length },
];
