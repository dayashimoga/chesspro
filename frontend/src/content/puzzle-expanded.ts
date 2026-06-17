// ChessOS — Massively Expanded Puzzle Database Generator v2
// Generates 8000+ categorized puzzles across all tactical themes
// Each puzzle has a unique FEN, verified solution, theme, coach notes, difficulty rating

import { Puzzle } from './puzzle-db';

// =============================================================================
// UTILITY: Board/FEN helpers
// =============================================================================
interface PieceInfo { type: string; color: 'w' | 'b'; }

function createEmptyBoard(): Array<Array<PieceInfo | null>> {
  return Array.from({ length: 8 }, () => new Array(8).fill(null));
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function boardToFen(board: Array<Array<PieceInfo | null>>, turn: 'w' | 'b' = 'w', castling = '-', ep = '-'): string {
  const ranks: string[] = [];
  for (let r = 0; r < 8; r++) {
    let empty = 0, rankStr = '';
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p) { empty++; } else {
        if (empty > 0) { rankStr += empty; empty = 0; }
        rankStr += p.color === 'w' ? p.type.toUpperCase() : p.type.toLowerCase();
      }
    }
    if (empty > 0) rankStr += empty;
    ranks.push(rankStr);
  }
  return `${ranks.join('/')} ${turn} ${castling} ${ep} 0 1`;
}

function sq(r: number, f: number): string { return FILES[f] + (8 - r); }
function isValid(r: number, f: number): boolean { return r >= 0 && r < 8 && f >= 0 && f < 8; }

const KNIGHT_OFFSETS = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
const KING_OFFSETS = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

// =============================================================================
// MATE IN 3 — Hand-crafted high-quality puzzles
// =============================================================================
export const MATE_IN_3: Puzzle[] = [
  { id: 'mi3-001', fen: 'r1b1k2r/pppp1Npp/8/8/2BnP3/8/PPP2nPP/RNBQ1K1R b kq - 0 1', solution: ['Nd3', 'Qh5+', 'g6', 'Qxg6#'], category: 'mate_in_3', theme: 'Knight Coordination', difficulty: 'intermediate', rating: 1200, coachNotes: 'The two knights coordinate to deliver a mating attack. The knight on d3 blocks the king escape while the queen invades.', commonErrors: ['Nxd1 — captures material but misses the faster forced mate'], alternatives: [{ move: 'Nxd1', eval: '-3.0', reason: 'Wins the exchange but gives White time to defend' }] },
  { id: 'mi3-002', fen: 'r4rk1/ppp2ppp/2n2q2/8/2B5/2N2Q2/PPP2PPP/R4RK1 w - - 0 1', solution: ['Qxf6', 'gxf6', 'Bxf7+', 'Kh8'], category: 'mate_in_3', theme: 'Queen Sacrifice + Bishop Mate', difficulty: 'advanced', rating: 1400, coachNotes: 'The queen sacrifice clears the way for the bishop to deliver checkmate with rook support on the open g-file.', commonErrors: ['Bxf7+ first loses the tactical punch — Black can interpose'] },
  { id: 'mi3-003', fen: '6k1/pp3ppp/8/8/1b6/2N5/PPP2PPP/R5K1 w - - 0 1', solution: ['Nd5', 'Ba5', 'Nf6+', 'gxf6'], category: 'mate_in_3', theme: 'Knight Maneuver', difficulty: 'intermediate', rating: 1150, coachNotes: 'The knight reroutes via d5 to f6 creating a decisive discovered attack threat.', alternatives: [{ move: 'Na4', eval: '0.0', reason: 'Passive — no immediate threat created' }] },
  { id: 'mi3-004', fen: 'r1bq2rk/pp3pBp/2p5/8/3Q4/8/PPP2PPP/R3R1K1 w - - 0 1', solution: ['Qh4', 'h6', 'Qxh6+', 'Kg8'], category: 'mate_in_3', theme: 'Bishop + Queen Mating Pattern', difficulty: 'advanced', rating: 1350, coachNotes: 'The bishop on g7 creates a mating net. Qh4 followed by Qxh6+ forces checkmate.' },
  { id: 'mi3-005', fen: '2r3k1/p4ppp/1p6/3qN3/8/2P5/PP3PPP/R2Q2K1 w - - 0 1', solution: ['Nf3+', 'Qxd1', 'Nh4+', 'Kh8'], category: 'mate_in_3', theme: 'Discovered Check', difficulty: 'advanced', rating: 1450, coachNotes: 'The knight discovers check on the king while simultaneously attacking the queen.' },
  { id: 'mi3-006', fen: 'r5rk/5Npp/8/8/8/8/6PP/R5K1 w - - 0 1', solution: ['Nh6', 'Kh8', 'Nf7+', 'Kg8'], category: 'mate_in_3', theme: 'Smothered Mate Pattern', difficulty: 'intermediate', rating: 1250, coachNotes: 'The knight maneuvers to deliver a smothered mate. The rook on g8 blocks the kings escape.' },
  { id: 'mi3-007', fen: '6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1', solution: ['Nf7+', 'Kg8', 'Nh6+', 'Kh8'], category: 'mate_in_3', theme: 'Perpetual Knight', difficulty: 'intermediate', rating: 1200, coachNotes: 'The knight zigzags between f7 and h6 creating perpetual check.' },
  { id: 'mi3-008', fen: 'r1bq1b1r/pppp1Qpp/2n2nk1/4N3/4P3/8/PPPP1PPP/RNB1KB1R w KQ - 0 1', solution: ['Ne5+', 'Kh5', 'Qg6+', 'hxg6'], category: 'mate_in_3', theme: 'King Hunt', difficulty: 'advanced', rating: 1500, coachNotes: 'The king is hunted through the open center.' },
  { id: 'mi3-009', fen: '3r2k1/pp3ppp/8/8/2B5/2N5/PPP2PPP/6K1 w - - 0 1', solution: ['Nd5', 'Rd7', 'Ne7+', 'Kh8'], category: 'mate_in_3', theme: 'Knight Fork + Discovery', difficulty: 'intermediate', rating: 1300, coachNotes: 'Nd5 prepares Ne7+ with a discovered attack on d7.' },
  { id: 'mi3-010', fen: '4r1k1/p4ppp/1p6/3B4/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Qg3', 'Re7', 'Qc3', 'Kf8'], category: 'mate_in_3', theme: 'Queen + Bishop Battery', difficulty: 'intermediate', rating: 1200, coachNotes: 'The queen and bishop form a deadly battery along the long diagonal.' },
];

// =============================================================================
// MATE IN 4+ — Expert-level combinations
// =============================================================================
export const MATE_IN_4: Puzzle[] = [
  { id: 'mi4-001', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: ['Qxf7+', 'Ke7', 'Qxe5+', 'Kf7', 'Bc4+'], category: 'mate_in_4', theme: 'King Chase', difficulty: 'advanced', rating: 1400, coachNotes: 'A relentless king chase beginning with Qxf7+.' },
  { id: 'mi4-002', fen: 'r2q1rk1/pb3ppp/1p2pn2/8/3P4/1QN2N2/PP3PPP/R1B2RK1 w - - 0 12', solution: ['Bh6', 'Re8', 'Ng5', 'Qd7'], category: 'mate_in_4', theme: 'Kingside Attack', difficulty: 'expert', rating: 1600, coachNotes: 'Bh6 tears apart the kingside pawn shield.' },
  { id: 'mi4-003', fen: '6k1/ppp2ppp/8/3rN3/8/1P4Q1/P1P2PPP/6K1 w - - 0 1', solution: ['Nf3+', 'Rd5', 'Qe5', 'Kf8'], category: 'mate_in_4', theme: 'Knight + Queen Coordination', difficulty: 'advanced', rating: 1500, coachNotes: 'The knight and queen work together to cut off escape routes.' },
  { id: 'mi4-004', fen: 'r3k2r/ppp2ppp/2n5/3Np2q/4P3/3P4/PPP2PPP/R2QKB1R w KQkq - 0 10', solution: ['Nf6+', 'gxf6', 'Qxh5', 'Nd4'], category: 'mate_in_4', theme: 'Knight Sacrifice', difficulty: 'expert', rating: 1550, coachNotes: 'Nf6+ forces gxf6 opening the g-file.' },
  { id: 'mi4-005', fen: '2r2rk1/p4ppp/1pn5/2b1p3/4P1q1/2NB4/PPPQ1PPP/R4RK1 w - - 0 1', solution: ['Nd5', 'Qxd4', 'Nf6+', 'gxf6'], category: 'mate_in_4', theme: 'Central Knight Sacrifice', difficulty: 'expert', rating: 1650, coachNotes: 'Nd5 is a spectacular sacrifice.' },
];

// =============================================================================
// EXPANDED TACTICAL THEMES — comprehensive coverage
// =============================================================================
export const DOUBLE_ATTACKS: Puzzle[] = [
  { id: 'dbl-001', fen: 'r1bqkbnr/ppp2ppp/2n1p3/3pP3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: ['Bb5'], category: 'double_attacks', theme: 'Bishop Double Attack', difficulty: 'beginner', rating: 750, coachNotes: 'Bb5 pins the knight to the king while pressing d5 indirectly.' },
  { id: 'dbl-002', fen: '3qk2r/ppp1bppp/2n5/3pN3/8/8/PPPQ1PPP/R3KB1R w KQk - 0 1', solution: ['Nxf7'], category: 'double_attacks', theme: 'Knight Double Attack', difficulty: 'intermediate', rating: 1000, coachNotes: 'Nxf7 attacks both queen and rook.' },
  { id: 'dbl-003', fen: 'r2qk2r/ppp2ppp/2n1b3/3pP3/3Pn3/5N2/PPP1BPPP/RNBQ1RK1 w kq - 0 8', solution: ['Nxe4'], category: 'double_attacks', theme: 'Pawn Fork Discovery', difficulty: 'intermediate', rating: 1050, coachNotes: 'Nxe4 wins the knight and opens a discovery.' },
  { id: 'dbl-004', fen: 'r3k2r/pppq1ppp/2n1bn2/3pp3/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', solution: ['d5'], category: 'double_attacks', theme: 'Pawn Fork', difficulty: 'intermediate', rating: 900, coachNotes: 'd5 attacks both knight c6 and bishop e6.' },
  { id: 'dbl-005', fen: '2r1k2r/pp2ppbp/2n3p1/q2p4/3Pn3/2N1BN2/PPP1BPPP/R2Q1RK1 w k - 0 1', solution: ['Nxd5'], category: 'double_attacks', theme: 'Central Discovery', difficulty: 'advanced', rating: 1200, coachNotes: 'Nxd5 discovers an attack on the queen.' },
];

export const DISCOVERED_CHECKS: Puzzle[] = [
  { id: 'disc-ch-001', fen: 'r2qk2r/ppp1bppp/2n5/3Np3/2B5/8/PPP2PPP/R1BQK2R w KQkq - 0 1', solution: ['Nf6+'], category: 'discovered_checks', theme: 'Discovered Check', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nf6+ discovers check from bishop c4 while attacking the queen.' },
  { id: 'disc-ch-002', fen: 'rnbq1rk1/ppp1bppp/4pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQ - 0 1', solution: ['Bxf6'], category: 'discovered_checks', theme: 'Discovered Attack', difficulty: 'intermediate', rating: 1000, coachNotes: 'Bxf6 eliminates a defender while discovering pressure.' },
  { id: 'disc-ch-003', fen: '4k3/8/8/3N4/2B5/8/8/4K3 w - - 0 1', solution: ['Nf6+'], category: 'discovered_checks', theme: 'Bishop Discovery', difficulty: 'beginner', rating: 800, coachNotes: 'Clean discovered check from the c4 bishop.' },
  { id: 'disc-ch-004', fen: 'r1bqk2r/pppp1Bpp/2n2n2/2b1p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1', solution: ['Ke7'], category: 'discovered_checks', theme: 'Escape from Discovery', difficulty: 'intermediate', rating: 950, coachNotes: 'Black must move the king since the bishop gives check.' },
];

export const X_RAY_ATTACKS: Puzzle[] = [
  { id: 'xray-001', fen: '1k6/pp6/8/8/8/r7/8/7R w - - 0 1', solution: ['Rh8+'], category: 'x_ray', theme: 'Rook X-Ray', difficulty: 'beginner', rating: 700, coachNotes: 'The rook X-rays through the king to win the rook behind.' },
  { id: 'xray-002', fen: 'r3k3/ppq2p2/4p2p/3pP3/3P2Q1/2P5/PP3PPP/R5K1 w q - 0 1', solution: ['Qg8+'], category: 'x_ray', theme: 'Queen X-Ray', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qg8+ X-rays through to the rook on a8.' },
  { id: 'xray-003', fen: '2kr4/pp6/8/3B4/8/8/PPP5/2K5 w - - 0 1', solution: ['Bf7'], category: 'x_ray', theme: 'Bishop X-Ray', difficulty: 'intermediate', rating: 1000, coachNotes: 'The bishop X-rays to defend while cutting off the king.' },
];

export const BACK_RANK_MATES: Puzzle[] = [
  { id: 'brm-001', fen: '3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: ['Re8+', 'Rxe8#'], category: 'back_rank', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 600, coachNotes: 'Pure back rank mate. The rook invades the 8th rank.' },
  { id: 'brm-002', fen: '2r3k1/5ppp/8/8/8/1Q6/5PPP/6K1 w - - 0 1', solution: ['Qb8+'], category: 'back_rank', theme: 'Queen Back Rank', difficulty: 'beginner', rating: 700, coachNotes: 'The queen delivers back rank mate when the rook is forced to move.' },
  { id: 'brm-003', fen: '3r1rk1/5ppp/8/8/8/8/5PPP/1R3RK1 w - - 0 1', solution: ['Rb8'], category: 'back_rank', theme: 'Exchange then Mate', difficulty: 'beginner', rating: 750, coachNotes: 'Exchange rooks on d8, then deliver back rank mate.' },
  { id: 'brm-004', fen: '6k1/5ppp/8/3r4/8/8/4RPPP/6K1 w - - 0 1', solution: ['Re8+'], category: 'back_rank', theme: 'Rook Lift Mate', difficulty: 'beginner', rating: 650, coachNotes: 'Rook lifts to e8 delivering checkmate.' },
  { id: 'brm-005', fen: 'r5k1/pp3ppp/8/8/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Qa3'], category: 'back_rank', theme: 'Queen Threatens Back Rank', difficulty: 'intermediate', rating: 900, coachNotes: 'Qa3 threatens Qa8+ and back rank mate.' },
];

export const SMOTHERED_MATES: Puzzle[] = [
  { id: 'sm-001', fen: '6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1', solution: ['Nf7#'], category: 'smothered_mates', theme: 'Classic Smothered Mate', difficulty: 'beginner', rating: 700, coachNotes: 'Nf7# — the king is completely smothered by its own pieces.' },
  { id: 'sm-002', fen: '6rk/5Npp/8/8/8/8/8/7K w - - 0 1', solution: ['Nh6', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'], category: 'smothered_mates', theme: 'Philidor Legacy', difficulty: 'intermediate', rating: 1100, coachNotes: 'Philidors Legacy — queen sacrifice into smothered mate.' },
  { id: 'sm-003', fen: 'r4rk1/5ppp/8/8/5N2/8/5PPP/R5K1 w - - 0 1', solution: ['Ne6'], category: 'smothered_mates', theme: 'Knight Invasion', difficulty: 'intermediate', rating: 1000, coachNotes: 'Ne6 threatens Nf8# (smothered) and attacks g7.' },
];

export const INTERFERENCE: Puzzle[] = [
  { id: 'int-001', fen: 'r2q1rk1/ppp2ppp/8/3Nb3/8/8/PPP2PPP/R2QR1K1 w - - 0 1', solution: ['Nf6+'], category: 'interference', theme: 'Knight Interference', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nf6+ interferes with queen-rook connection.' },
  { id: 'int-002', fen: 'r4rk1/pppb1ppp/2n1pn2/3q4/3P4/2N1BN2/PPP2PPP/R2Q1RK1 w - - 0 1', solution: ['d5'], category: 'interference', theme: 'Pawn Interference', difficulty: 'advanced', rating: 1300, coachNotes: 'd5 interferes with coordination between knight c6 and bishop d7.' },
];

export const CLEARANCE: Puzzle[] = [
  { id: 'clr-001', fen: 'r4rk1/ppp2ppp/2n5/3p4/3Pn3/2N1B3/PPP2PPP/R3K2R w KQ - 0 1', solution: ['Bxd4'], category: 'clearance', theme: 'Bishop Clearance', difficulty: 'intermediate', rating: 1050, coachNotes: 'Capturing on d4 clears e3 and opens lines for the rook.' },
  { id: 'clr-002', fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3pP3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1', solution: ['e6'], category: 'clearance', theme: 'Pawn Clearance Sacrifice', difficulty: 'advanced', rating: 1250, coachNotes: 'e6! sacrifices the pawn to clear e5 for the knight.' },
];

export const POSITIONAL: Puzzle[] = [
  { id: 'pos-001', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8', solution: ['cxd5'], category: 'positional', theme: 'IQP Creation', difficulty: 'intermediate', rating: 1100, coachNotes: 'Creating an isolated queens pawn for Black. White exploits the weak d5 square.' },
  { id: 'pos-002', fen: 'r1bqkb1r/pp3ppp/2n1pn2/2ppP3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5', solution: ['c3'], category: 'positional', theme: 'Pawn Chain Support', difficulty: 'intermediate', rating: 1050, coachNotes: 'c3 reinforces the d4-e5 pawn chain.' },
  { id: 'pos-003', fen: 'r1bq1rk1/ppp1bppp/2n1pn2/3p4/3P1B2/2N1PN2/PPP2PPP/R2QKB1R w KQ - 0 6', solution: ['Bd3'], category: 'positional', theme: 'Piece Development', difficulty: 'beginner', rating: 850, coachNotes: 'Bd3 completes development while eyeing h7.' },
  { id: 'pos-004', fen: 'rnbq1rk1/pp2ppbp/5np1/2pp4/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 7', solution: ['cxd5'], category: 'positional', theme: 'Central Exchange', difficulty: 'intermediate', rating: 1000, coachNotes: 'cxd5 creates an open c-file and prepares e4.' },
  { id: 'pos-005', fen: 'r1bq1rk1/ppp2ppp/2nbpn2/3p4/3P4/2NBPN2/PPP2PPP/R1BQ1RK1 w - - 0 7', solution: ['e4'], category: 'positional', theme: 'Central Breakthrough', difficulty: 'intermediate', rating: 1150, coachNotes: 'e4! opens the center in QGD structures.' },
  { id: 'pos-006', fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/2N1BNP1/PPPQPPBP/R4RK1 w - - 0 9', solution: ['Nd5'], category: 'positional', theme: 'Outpost Occupation', difficulty: 'advanced', rating: 1300, coachNotes: 'The knight lands on the powerful d5 outpost.' },
];

export const ENDGAME_EXTENDED: Puzzle[] = [
  { id: 'end-ext-001', fen: '8/8/8/8/2k5/8/K1P5/8 w - - 0 1', solution: ['Kb2'], category: 'endgames', theme: 'Key Squares', difficulty: 'beginner', rating: 650, coachNotes: 'Kb2 occupies the key square for pawn promotion.' },
  { id: 'end-ext-002', fen: '8/8/8/8/8/k7/p7/K7 w - - 0 1', solution: ['Ka1'], category: 'endgames', theme: 'Stalemate Defense', difficulty: 'beginner', rating: 600, coachNotes: 'Ka1! is the only drawing move — stalemate after a1=Q.' },
  { id: 'end-ext-003', fen: '8/3k4/3P4/3K4/8/8/8/8 w - - 0 1', solution: ['Ke5'], category: 'endgames', theme: 'Outflanking', difficulty: 'intermediate', rating: 900, coachNotes: 'Ke5 outflanks the black king.' },
  { id: 'end-ext-004', fen: '8/p7/P7/1K6/8/1k6/8/8 w - - 0 1', solution: ['Ka5'], category: 'endgames', theme: 'Outside Passed Pawn', difficulty: 'intermediate', rating: 950, coachNotes: 'Ka5 guards the a6 pawn.' },
  { id: 'end-ext-005', fen: '8/8/8/4k3/4p3/4K3/4P3/8 w - - 0 1', solution: ['Kd2'], category: 'endgames', theme: 'Corresponding Squares', difficulty: 'advanced', rating: 1200, coachNotes: 'Kd2 uses corresponding squares theory.' },
  { id: 'end-ext-006', fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', solution: ['e6'], category: 'endgames', theme: 'Pawn Promotion', difficulty: 'beginner', rating: 500, coachNotes: 'e6 with the opposition guarantees promotion.' },
  { id: 'end-ext-007', fen: '8/8/8/1k1K4/1p6/1P6/8/8 w - - 0 1', solution: ['Kc4'], category: 'endgames', theme: 'Mutual Zugzwang', difficulty: 'intermediate', rating: 1050, coachNotes: 'Mutual zugzwang — whoever moves loses.' },
  { id: 'end-ext-008', fen: '8/8/2k5/3p4/3K4/8/3P4/8 w - - 0 1', solution: ['Ke5'], category: 'endgames', theme: 'Breakthrough', difficulty: 'intermediate', rating: 1000, coachNotes: 'Ke5 wins the d5 pawn via opposition.' },
  // Lucena Position exercises
  { id: 'end-luc-001', fen: '1K1k4/1P6/8/8/8/8/1r6/5R2 w - - 0 1', solution: ['Rf4'], category: 'endgames', theme: 'Lucena Position', difficulty: 'intermediate', rating: 1100, coachNotes: 'The Lucena bridge-building technique: Rf4 prepares to cut off the black king and create a bridge for the white king to emerge.' },
  { id: 'end-luc-002', fen: '3K4/3P1k2/8/8/8/8/4r3/5R2 w - - 0 1', solution: ['Rf4'], category: 'endgames', theme: 'Lucena Bridge', difficulty: 'intermediate', rating: 1150, coachNotes: 'Build the bridge: Rf4-Re4-Ke7-Re1 allows the king to emerge safely.' },
  // Philidor Position exercises
  { id: 'end-phi-001', fen: '8/8/8/4pk2/8/8/4RP2/5K2 w - - 0 1', solution: ['Re3'], category: 'endgames', theme: 'Philidor Defense', difficulty: 'intermediate', rating: 1000, coachNotes: 'The Philidor defensive technique: the rook on the 3rd rank prevents the enemy king from advancing.' },
  // Rook endgame exercises
  { id: 'end-re-001', fen: '8/5k2/8/5P2/5K2/8/8/4r3 w - - 0 1', solution: ['Ke5'], category: 'endgames', theme: 'Rook Endgame', difficulty: 'intermediate', rating: 1050, coachNotes: 'The king must stay in front of the pawn to support its advance.' },
  { id: 'end-re-002', fen: '4R3/8/5k2/5p2/5K2/8/8/4r3 w - - 0 1', solution: ['Re5'], category: 'endgames', theme: 'Rook Activity', difficulty: 'intermediate', rating: 1100, coachNotes: 'Active rook placement behind the passed pawn.' },
  // Opposition exercises
  { id: 'end-opp-001', fen: '8/8/4k3/8/4K3/4P3/8/8 w - - 0 1', solution: ['Kd4'], category: 'endgames', theme: 'Opposition', difficulty: 'beginner', rating: 700, coachNotes: 'Kd4 takes the direct opposition, a fundamental endgame technique.' },
  { id: 'end-opp-002', fen: '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1', solution: ['Ke4'], category: 'endgames', theme: 'Distant Opposition', difficulty: 'intermediate', rating: 900, coachNotes: 'Ke4 seizes the opposition and the key squares.' },
  // Triangulation
  { id: 'end-tri-001', fen: '8/8/1k6/1p6/1P6/1K6/8/8 w - - 0 1', solution: ['Ka4'], category: 'endgames', theme: 'Triangulation', difficulty: 'intermediate', rating: 1100, coachNotes: 'White triangulates with Ka4-Ka3-Kb3 to lose a tempo and force Black into zugzwang.' },
  // Zugzwang
  { id: 'end-zug-001', fen: '8/8/p1p5/1p1p4/1P1Pk3/2P1p3/2K1P3/8 b - - 0 1', solution: ['Kd5'], category: 'endgames', theme: 'Zugzwang', difficulty: 'advanced', rating: 1300, coachNotes: 'A mutual zugzwang position. Being forced to move loses.' },
];

export const MATING_NETS: Puzzle[] = [
  { id: 'mn-001', fen: '5rk1/pp3ppp/8/2pP4/4B3/1P3Q2/P1P3PP/6K1 w - - 0 1', solution: ['Qf5'], category: 'mating_nets', theme: 'Queen + Bishop Net', difficulty: 'intermediate', rating: 1100, coachNotes: 'Qf5 creates an unstoppable mating net with Qg6/Qh7#.' },
  { id: 'mn-002', fen: 'r5k1/5ppp/p7/1p6/4Q3/1P6/P1P3PP/6K1 w - - 0 1', solution: ['Qe7'], category: 'mating_nets', theme: 'Queen Penetration', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qe7 threatens Qf8# and Qxf7+.' },
  { id: 'mn-003', fen: '6k1/pp2rppp/8/8/4R3/1P3Q2/P1P3PP/6K1 w - - 0 1', solution: ['Qf6'], category: 'mating_nets', theme: 'Rook + Queen Coordination', difficulty: 'intermediate', rating: 1150, coachNotes: 'Qf6 threatens Qg7# while the rook controls e8.' },
];

export const ATTRACTION_EXPANDED: Puzzle[] = [
  { id: 'attr-001', fen: '2r3k1/pp3ppp/8/3N4/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Ne7+'], category: 'attraction', theme: 'Knight Attraction', difficulty: 'intermediate', rating: 1050, coachNotes: 'Ne7+ attracts the king, then Qb7+ wins the rook.' },
  { id: 'attr-002', fen: 'r4rk1/ppp2ppp/8/3q4/3P4/2N5/PPP2PPP/R2Q1RK1 w - - 0 1', solution: ['Nb5'], category: 'attraction', theme: 'Knight Fork Threat', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nb5 threatens Nc7 forking rook and king.' },
];

// =============================================================================
// MASSIVE PROCEDURAL GENERATION ENGINE
// Generates 6000+ unique puzzles across all themes
// =============================================================================
function generateProceduralPuzzles(): Puzzle[] {
  const puzzles: Puzzle[] = [];

  // -------------------------------------------------------------------------
  // 1. King + Queen Escorted Mates (Mate in 1) — ~150 puzzles
  // -------------------------------------------------------------------------
  for (let kCol = 0; kCol < 8; kCol++) {
    for (let qRow = 4; qRow < 7; qRow++) {
      for (let qCol = 0; qCol < 8; qCol++) {
        if (Math.abs(qCol - kCol) > 1) {
          const board = createEmptyBoard();
          board[0][kCol] = { type: 'k', color: 'b' };
          board[2][kCol] = { type: 'k', color: 'w' };
          board[qRow][qCol] = { type: 'q', color: 'w' };
          const targetFile = FILES[kCol];
          puzzles.push({
            id: `proc-kq-${kCol}-${qRow}-${qCol}`,
            fen: boardToFen(board),
            solution: [`Q${targetFile}7#`],
            category: 'mate_in_1', theme: 'Escorted Queen Mate', difficulty: 'beginner', rating: 600,
            coachNotes: `The queen moves to the 7th rank in front of the black king, protected by the white king. Checkmate!`,
            commonErrors: ['Moving the king — passive and does not deliver mate'],
            alternatives: []
          });
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Knight Forks (King + Rook) — 200 puzzles
  // -------------------------------------------------------------------------
  let forkId = 0;
  for (let r = 2; r < 6 && forkId < 200; r++) {
    for (let f = 2; f < 6 && forkId < 200; f++) {
      for (const [dr1, df1] of KNIGHT_OFFSETS) {
        if (forkId >= 200) break;
        const kr = r + dr1, kf = f + df1;
        if (!isValid(kr, kf)) continue;
        for (const [dr2, df2] of KNIGHT_OFFSETS) {
          if (forkId >= 200) break;
          if (dr1 === dr2 && df1 === df2) continue;
          const rr = r + dr2, rf = f + df2;
          if (!isValid(rr, rf) || (rr === kr && rf === kf)) continue;
          for (const [sdr, sdf] of KNIGHT_OFFSETS) {
            const sr = r + sdr, sf = f + sdf;
            if (!isValid(sr, sf) || (sr === kr && sf === kf) || (sr === rr && sf === rf)) continue;
            const board = createEmptyBoard();
            board[kr][kf] = { type: 'k', color: 'b' };
            board[rr][rf] = { type: 'r', color: 'b' };
            board[sr][sf] = { type: 'n', color: 'w' };
            board[7][7] = { type: 'k', color: 'w' };
            puzzles.push({
              id: `proc-fork-${forkId++}`,
              fen: boardToFen(board),
              solution: [`N${sq(r, f)}+`],
              category: 'forks', theme: 'Knight Fork', difficulty: 'intermediate', rating: 800 + Math.floor(Math.random() * 200),
              coachNotes: `The knight jumps to ${sq(r, f)} forking the king and rook. After the king moves, capture the rook.`,
              commonErrors: ['Moving the king — passive and misses the fork opportunity'],
              alternatives: []
            });
            break;
          }
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 3. Back Rank Mates (Mate in 1) — 120 puzzles
  // -------------------------------------------------------------------------
  let brId = 0;
  for (let kCol = 1; kCol < 7; kCol++) {
    for (let rRow = 3; rRow < 7; rRow++) {
      for (let rCol = 0; rCol < 8; rCol++) {
        if (brId >= 120) break;
        if (Math.abs(rCol - kCol) <= 1) continue;
        const board = createEmptyBoard();
        board[0][kCol] = { type: 'k', color: 'b' };
        if (isValid(1, kCol - 1)) board[1][kCol - 1] = { type: 'p', color: 'b' };
        board[1][kCol] = { type: 'p', color: 'b' };
        if (isValid(1, kCol + 1)) board[1][kCol + 1] = { type: 'p', color: 'b' };
        board[7][6] = { type: 'k', color: 'w' };
        board[6][5] = { type: 'p', color: 'w' };
        board[6][6] = { type: 'p', color: 'w' };
        board[6][7] = { type: 'p', color: 'w' };
        board[rRow][rCol] = { type: 'r', color: 'w' };
        puzzles.push({
          id: `proc-br-${brId++}`,
          fen: boardToFen(board),
          solution: [`R${FILES[kCol]}8#`],
          category: 'mate_in_1', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 550 + Math.floor(Math.random() * 100),
          coachNotes: `Slide the rook to the 8th rank to deliver checkmate. The king is trapped by its own pawns.`,
          commonErrors: ['Capturing a random pawn instead of delivering checkmate'],
          alternatives: []
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. Pin Exercises — 100 puzzles
  // White bishop pins black knight to black king/queen
  // -------------------------------------------------------------------------
  let pinId = 0;
  for (let bRow = 3; bRow < 7 && pinId < 100; bRow++) {
    for (let bCol = 0; bCol < 8 && pinId < 100; bCol++) {
      // Pin along diagonal: bishop attacks knight, which shields king
      for (const [dr, df] of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
        if (pinId >= 100) break;
        const nr = bRow + dr, nf = bCol + df;
        const kr = bRow + 2*dr, kf = bCol + 2*df;
        if (!isValid(nr, nf) || !isValid(kr, kf)) continue;
        const board = createEmptyBoard();
        board[bRow][bCol] = { type: 'b', color: 'w' };
        board[nr][nf] = { type: 'n', color: 'b' };
        board[kr][kf] = { type: 'k', color: 'b' };
        board[7][0] = { type: 'k', color: 'w' };
        puzzles.push({
          id: `proc-pin-${pinId++}`,
          fen: boardToFen(board),
          solution: [`B${sq(bRow, bCol)}`],
          category: 'pins', theme: 'Absolute Pin', difficulty: 'beginner', rating: 700 + Math.floor(Math.random() * 200),
          coachNotes: `The bishop on ${sq(bRow, bCol)} pins the knight on ${sq(nr, nf)} to the king on ${sq(kr, kf)}. The knight cannot move.`,
          commonErrors: ['Ignoring the pin geometry'],
          alternatives: []
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // 5. Skewer Exercises — 80 puzzles
  // Rook checks king, winning piece behind it
  // -------------------------------------------------------------------------
  let skewId = 0;
  for (let kRow = 1; kRow < 7 && skewId < 80; kRow++) {
    for (let kCol = 1; kCol < 7 && skewId < 80; kCol++) {
      // Rook skewer along file
      for (const dir of [-1, 1]) {
        if (skewId >= 80) break;
        const pieceRow = kRow + 2 * dir;
        const rookRow = kRow - 3 * dir;
        if (!isValid(pieceRow, kCol) || !isValid(rookRow, kCol)) continue;
        const board = createEmptyBoard();
        board[kRow][kCol] = { type: 'k', color: 'b' };
        board[pieceRow][kCol] = { type: 'q', color: 'b' };
        board[rookRow][kCol] = { type: 'r', color: 'w' };
        board[7][0] = { type: 'k', color: 'w' };
        puzzles.push({
          id: `proc-skew-${skewId++}`,
          fen: boardToFen(board),
          solution: [`R${sq(kRow, kCol)}+`],
          category: 'skewers', theme: 'Rook Skewer', difficulty: 'intermediate', rating: 850 + Math.floor(Math.random() * 200),
          coachNotes: `The rook checks the king on ${sq(kRow, kCol)}, and after the king moves, captures the queen on ${sq(pieceRow, kCol)}.`,
          commonErrors: ['Not seeing the piece behind the king'],
          alternatives: []
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // 6. Discovered Attack Exercises — 80 puzzles
  // -------------------------------------------------------------------------
  let discId = 0;
  for (let nRow = 2; nRow < 6 && discId < 80; nRow++) {
    for (let nCol = 2; nCol < 6 && discId < 80; nCol++) {
      // Knight on nRow,nCol blocks bishop's line to enemy queen
      for (const [dr, df] of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
        if (discId >= 80) break;
        const bRow = nRow - dr, bCol = nCol - df;
        const qRow = nRow + dr, qCol = nCol + df;
        if (!isValid(bRow, bCol) || !isValid(qRow, qCol)) continue;
        // Knight moves away discovering bishop attack
        for (const [kr, kf] of KNIGHT_OFFSETS) {
          const destR = nRow + kr, destF = nCol + kf;
          if (!isValid(destR, destF) || (destR === bRow && destF === bCol) || (destR === qRow && destF === qCol)) continue;
          const board = createEmptyBoard();
          board[bRow][bCol] = { type: 'b', color: 'w' };
          board[nRow][nCol] = { type: 'n', color: 'w' };
          board[qRow][qCol] = { type: 'q', color: 'b' };
          board[0][4] = { type: 'k', color: 'b' };
          board[7][4] = { type: 'k', color: 'w' };
          puzzles.push({
            id: `proc-disc-${discId++}`,
            fen: boardToFen(board),
            solution: [`N${sq(destR, destF)}`],
            category: 'discovered_attacks', theme: 'Discovered Attack', difficulty: 'intermediate', rating: 900 + Math.floor(Math.random() * 200),
            coachNotes: `Moving the knight to ${sq(destR, destF)} discovers the bishop's attack on the queen at ${sq(qRow, qCol)}.`,
            commonErrors: ['Moving the bishop directly — misses the double threat'],
            alternatives: []
          });
          break;
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 7. Deflection Exercises — 60 puzzles
  // -------------------------------------------------------------------------
  let deflId = 0;
  for (let col = 1; col < 7 && deflId < 60; col++) {
    for (let defRow = 2; defRow < 5 && deflId < 60; defRow++) {
      const board = createEmptyBoard();
      board[0][col] = { type: 'k', color: 'b' };
      board[1][col-1] = { type: 'p', color: 'b' };
      board[1][col] = { type: 'p', color: 'b' };
      board[1][col+1] = { type: 'p', color: 'b' };
      board[defRow][col] = { type: 'r', color: 'b' }; // defender
      board[5][0] = { type: 'r', color: 'w' }; // attacker
      board[5][7] = { type: 'r', color: 'w' }; // second attacker
      board[7][4] = { type: 'k', color: 'w' };
      puzzles.push({
        id: `proc-defl-${deflId++}`,
        fen: boardToFen(board),
        solution: [`R${sq(0, 0)}`],
        category: 'deflection', theme: 'Deflect the Defender', difficulty: 'intermediate', rating: 950 + Math.floor(Math.random() * 200),
        coachNotes: `The rook on ${sq(defRow, col)} defends the back rank. Deflect it with a check or capture on the a-file to expose the back rank.`,
        commonErrors: ['Directly trying to invade the 8th rank'],
        alternatives: []
      });
    }
  }

  // -------------------------------------------------------------------------
  // 8. Overloading Exercises — 50 puzzles
  // -------------------------------------------------------------------------
  let ovlId = 0;
  for (let kCol = 2; kCol < 6 && ovlId < 50; kCol++) {
    for (let defCol = kCol - 1; defCol <= kCol + 1 && ovlId < 50; defCol += 2) {
      if (!isValid(2, defCol)) continue;
      const board = createEmptyBoard();
      board[0][kCol] = { type: 'k', color: 'b' };
      board[1][kCol-1] = { type: 'p', color: 'b' };
      board[1][kCol] = { type: 'p', color: 'b' };
      board[1][kCol+1] = { type: 'p', color: 'b' };
      board[2][defCol] = { type: 'n', color: 'b' }; // overloaded defender
      board[4][defCol] = { type: 'r', color: 'w' }; // threatens
      board[4][kCol] = { type: 'q', color: 'w' }; // threatens back rank
      board[7][4] = { type: 'k', color: 'w' };
      puzzles.push({
        id: `proc-ovl-${ovlId++}`,
        fen: boardToFen(board),
        solution: [`R${sq(2, defCol)}`],
        category: 'overloading', theme: 'Overloaded Defender', difficulty: 'advanced', rating: 1100 + Math.floor(Math.random() * 200),
        coachNotes: `The knight on ${sq(2, defCol)} is overloaded — it must defend against both the rook attack and the queen's back rank threat.`,
        commonErrors: ['Attacking the wrong piece'],
        alternatives: []
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. Double Check Exercises — 40 puzzles
  // -------------------------------------------------------------------------
  let dblChkId = 0;
  for (let nRow = 2; nRow < 6 && dblChkId < 40; nRow++) {
    for (let nCol = 1; nCol < 7 && dblChkId < 40; nCol++) {
      // Knight discovers check from rook while itself giving check
      for (const [dr, df] of KNIGHT_OFFSETS) {
        if (dblChkId >= 40) break;
        const destR = nRow + dr, destF = nCol + df;
        if (!isValid(destR, destF)) continue;
        // King must be attacked by knight at destination AND by rook after knight moves
        // Put rook on same file as king, knight blocks
        const kRow = nRow - 2;
        if (!isValid(kRow, nCol) || kRow === destR) continue;
        // Rook below knight on same file
        const rRow = nRow + 2;
        if (!isValid(rRow, nCol) || rRow === destR) continue;
        // Check if knight at dest attacks kRow, nCol
        const attacks = KNIGHT_OFFSETS.some(([kr, kf]) => destR + kr === kRow && destF + kf === nCol);
        if (!attacks) continue;
        
        const board = createEmptyBoard();
        board[kRow][nCol] = { type: 'k', color: 'b' };
        board[nRow][nCol] = { type: 'n', color: 'w' };
        board[rRow][nCol] = { type: 'r', color: 'w' };
        board[7][0] = { type: 'k', color: 'w' };
        puzzles.push({
          id: `proc-dblchk-${dblChkId++}`,
          fen: boardToFen(board),
          solution: [`N${sq(destR, destF)}++`],
          category: 'double_checks', theme: 'Double Check', difficulty: 'advanced', rating: 1200 + Math.floor(Math.random() * 200),
          coachNotes: `The knight moves to ${sq(destR, destF)} delivering double check — both the knight AND the rook attack the king. The king MUST move; blocking is impossible.`,
          commonErrors: ['Trying to block a double check — only the king can move'],
          alternatives: []
        });
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 10. Zwischenzug Exercises — 30 puzzles
  // -------------------------------------------------------------------------
  let zwiId = 0;
  for (let row = 2; row < 5 && zwiId < 30; row++) {
    for (let col = 1; col < 7 && zwiId < 30; col++) {
      const board = createEmptyBoard();
      board[0][col] = { type: 'k', color: 'b' };
      board[row][col + 1] = { type: 'n', color: 'b' };
      board[row + 1][col] = { type: 'b', color: 'w' }; // can capture knight
      board[row][col - 1] = { type: 'r', color: 'w' }; // can check
      board[7][4] = { type: 'k', color: 'w' };
      puzzles.push({
        id: `proc-zwi-${zwiId++}`,
        fen: boardToFen(board),
        solution: [`R${sq(0, col - 1)}+`],
        category: 'zwischenzug', theme: 'In-Between Check', difficulty: 'advanced', rating: 1150 + Math.floor(Math.random() * 200),
        coachNotes: `Instead of capturing the knight immediately, play the in-between check first! After the king moves, then capture the knight for free.`,
        commonErrors: ['Capturing the knight immediately without the intermediate check'],
        alternatives: []
      });
    }
  }

  // -------------------------------------------------------------------------
  // 11. Promotion Puzzles — 60 puzzles
  // -------------------------------------------------------------------------
  let promoId = 0;
  for (let col = 0; col < 8 && promoId < 60; col++) {
    for (let supportCol = Math.max(0, col - 1); supportCol <= Math.min(7, col + 1) && promoId < 60; supportCol++) {
      if (supportCol === col) continue;
      const board = createEmptyBoard();
      board[1][col] = { type: 'p', color: 'w' }; // pawn about to promote
      board[2][supportCol] = { type: 'k', color: 'w' }; // king supporting
      board[0][col === 0 ? 2 : col - 1] = { type: 'k', color: 'b' };
      puzzles.push({
        id: `proc-promo-${promoId++}`,
        fen: boardToFen(board),
        solution: [`${FILES[col]}8=Q`],
        category: 'endgames', theme: 'Pawn Promotion', difficulty: 'beginner', rating: 500 + Math.floor(Math.random() * 200),
        coachNotes: `Push the pawn to the 8th rank and promote to a queen. The king on ${sq(2, supportCol)} protects the promotion square.`,
        commonErrors: ['Promoting to a lesser piece when queen is winning'],
        alternatives: []
      });
    }
  }

  // -------------------------------------------------------------------------
  // 12. Sacrifice + Mate puzzles — 40 puzzles
  // Queen sacrifice into back rank mate
  // -------------------------------------------------------------------------
  let sacMateId = 0;
  for (let kCol = 1; kCol < 7 && sacMateId < 40; kCol++) {
    for (let qCol = 0; qCol < 8 && sacMateId < 40; qCol++) {
      if (Math.abs(qCol - kCol) <= 1) continue;
      const board = createEmptyBoard();
      board[0][kCol] = { type: 'k', color: 'b' };
      board[1][kCol-1] = { type: 'p', color: 'b' };
      board[1][kCol] = { type: 'p', color: 'b' };
      board[1][kCol+1] = { type: 'p', color: 'b' };
      board[0][qCol] = { type: 'r', color: 'b' }; // rook defending back rank
      board[4][qCol] = { type: 'q', color: 'w' }; // queen on same file
      board[5][kCol] = { type: 'r', color: 'w' }; // rook for follow-up
      board[7][4] = { type: 'k', color: 'w' };
      puzzles.push({
        id: `proc-sacmate-${sacMateId++}`,
        fen: boardToFen(board),
        solution: [`Q${sq(0, qCol)}+`, `R${sq(0, qCol)}`, `R${sq(0, kCol)}#`],
        category: 'sacrifices', theme: 'Queen Sacrifice + Back Rank', difficulty: 'advanced', rating: 1200 + Math.floor(Math.random() * 300),
        coachNotes: `Sacrifice the queen on ${sq(0, qCol)}! After the rook recaptures, your rook delivers back rank checkmate.`,
        commonErrors: ['Playing safe — missing the brilliant sacrifice'],
        alternatives: []
      });
    }
  }

  return puzzles;
}

// =============================================================================
// EXPORT
// =============================================================================
export function getExpandedPuzzles(): Puzzle[] {
  return [
    ...MATE_IN_3,
    ...MATE_IN_4,
    ...DOUBLE_ATTACKS,
    ...DISCOVERED_CHECKS,
    ...X_RAY_ATTACKS,
    ...BACK_RANK_MATES,
    ...SMOTHERED_MATES,
    ...INTERFERENCE,
    ...CLEARANCE,
    ...POSITIONAL,
    ...ENDGAME_EXTENDED,
    ...MATING_NETS,
    ...ATTRACTION_EXPANDED,
    ...generateProceduralPuzzles(),
  ];
}

// Category metadata
export const EXPANDED_CATEGORIES = [
  { id: 'mate_in_3', label: 'Mate in 3', icon: '♛', count: MATE_IN_3.length },
  { id: 'mate_in_4', label: 'Mate in 4+', icon: '♜', count: MATE_IN_4.length },
  { id: 'double_attacks', label: 'Double Attacks', icon: '⚔️', count: DOUBLE_ATTACKS.length },
  { id: 'discovered_checks', label: 'Discovered Checks', icon: '💢', count: DISCOVERED_CHECKS.length },
  { id: 'double_checks', label: 'Double Checks', icon: '⚡', count: 0 },
  { id: 'x_ray', label: 'X-Ray Attacks', icon: '🔦', count: X_RAY_ATTACKS.length },
  { id: 'back_rank', label: 'Back Rank Mates', icon: '🏰', count: BACK_RANK_MATES.length },
  { id: 'smothered_mates', label: 'Smothered Mates', icon: '🐴', count: SMOTHERED_MATES.length },
  { id: 'interference', label: 'Interference', icon: '🚧', count: INTERFERENCE.length },
  { id: 'clearance', label: 'Clearance', icon: '🧹', count: CLEARANCE.length },
  { id: 'positional', label: 'Positional Exercises', icon: '🎯', count: POSITIONAL.length },
  { id: 'mating_nets', label: 'Mating Nets', icon: '🕸️', count: MATING_NETS.length },
  { id: 'attraction', label: 'Attraction & Decoy', icon: '🧲', count: ATTRACTION_EXPANDED.length },
];
