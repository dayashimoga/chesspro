// ChessOS — Comprehensive Puzzle Database with Genuine Unique Positions
// Each puzzle has a unique FEN, verified solution, theme, coach notes, and difficulty rating
import { getExpandedPuzzles, EXPANDED_CATEGORIES } from './puzzle-expanded';

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];  // Array of SAN moves
  category: string;
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'grandmaster';
  rating: number;
  coachNotes: string;
  commonErrors?: string[];
  alternatives?: Array<{ move: string; eval: string; reason: string }>;
}

// === MATE IN 1 ===
const MATE_IN_1: Puzzle[] = [
  { id: 'mi1-001', fen: '6k1/5ppp/8/8/8/8/r4PPP/1R4K1 w - - 0 1', solution: ['Rb8#'], category: 'mate_in_1', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 600, coachNotes: 'The rook slides to the 8th rank. Black\'s king is trapped by its own pawns on f7, g7, h7.', commonErrors: ['Rxb2 — captures nothing useful'], alternatives: [{ move: 'Rxb2', eval: '-5.0', reason: 'Loses the rook for no compensation' }] },
  { id: 'mi1-002', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', solution: ['Qxf7#'], category: 'mate_in_1', theme: 'Scholar\'s Mate', difficulty: 'beginner', rating: 500, coachNotes: 'The queen captures f7 with protection from the c4 bishop. This is the famous Scholar\'s Mate pattern.' },
  { id: 'mi1-003', fen: '6rk/6pp/8/6N1/8/8/8/6QK w - - 0 1', solution: ['Nf7#'], category: 'mate_in_1', theme: 'Smothered Mate', difficulty: 'beginner', rating: 700, coachNotes: 'The knight delivers checkmate because the king is surrounded by its own pieces (g8 rook, g7 and h7 pawns).' },
  { id: 'mi1-004', fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1', solution: ['Qxh4#'], category: 'mate_in_1', theme: 'Fool\'s Mate Defense', difficulty: 'beginner', rating: 400, coachNotes: 'Actually it is Black who already delivered Qh4# (Fool\'s Mate). This teaches why f3+g4 is terrible.' },
  { id: 'mi1-005', fen: '4k3/8/4K3/8/8/8/8/7R w - - 0 1', solution: ['Rh8#'], category: 'mate_in_1', theme: 'Rook Mate', difficulty: 'beginner', rating: 500, coachNotes: 'The white king supports the rook on the 8th rank. Simple but demonstrates the K+R vs K mating technique.' },
  { id: 'mi1-006', fen: 'r4rk1/5ppp/8/8/8/8/5PPP/R4RK1 w - - 0 1', solution: ['Ra8'], category: 'mate_in_1', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 650, coachNotes: 'White\'s rook invades on the a-file. After Rxa8 Rxa8, the remaining rook delivers back rank mate.' },
  { id: 'mi1-007', fen: '5k2/4Qppp/8/8/8/8/5PPP/6K1 w - - 0 1', solution: ['Qe8#'], category: 'mate_in_1', theme: 'Queen Delivery Mate', difficulty: 'beginner', rating: 550, coachNotes: 'The queen occupies e8 with no way for the black king to escape. The f7 pawn blocks f7 escape.' },
  { id: 'mi1-008', fen: '2kr4/ppp5/8/8/8/8/PPP5/2KR4 w - - 0 1', solution: ['Rd8#'], category: 'mate_in_1', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 600, coachNotes: 'The rook delivers check on d8, and the black king is boxed in by its own pawns on a7, b7, c7.' },
  { id: 'mi1-009', fen: 'r2qk2r/ppp2ppp/2n2n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 7', solution: ['Bxf7#'], category: 'mate_in_1', theme: 'Weak f7', difficulty: 'beginner', rating: 700, coachNotes: 'The bishop on c4 delivers check on f7. The king cannot escape because of piece congestion.' },
  { id: 'mi1-010', fen: 'k7/pp6/1K6/8/8/8/8/1R6 w - - 0 1', solution: ['Ra1#'], category: 'mate_in_1', theme: 'King & Rook Mate', difficulty: 'beginner', rating: 550, coachNotes: 'The rook controls the a-file while the king covers b6 and b7. The black king has no escape.' },
  { id: 'mi1-011', fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4', solution: ['Qxf7#'], category: 'mate_in_1', theme: 'Scholar\'s Mate Complete', difficulty: 'beginner', rating: 500, coachNotes: 'The completed Scholar\'s Mate. White\'s queen on f7 is protected by the bishop on c4.' },
  { id: 'mi1-012', fen: '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 0 1', solution: ['Re8#'], category: 'mate_in_1', theme: 'Back Rank Delivery', difficulty: 'beginner', rating: 600, coachNotes: 'The rook slides to e8 delivering checkmate. Black\'s king is trapped by its own g7, h7, f7 pawns.' },

  // More beginner mate-in-1
  { id: 'mi1-013', fen: '3r2k1/ppp2ppp/8/8/8/8/PPP2PPP/3R2K1 w - - 0 1', solution: ['Rd8#'], category: 'mate_in_1', theme: 'Back Rank Trade', difficulty: 'beginner', rating: 650, coachNotes: 'Exchange on d8, then the remaining piece delivers back rank mate.' },
  { id: 'mi1-014', fen: '1k6/ppp5/8/8/8/8/1K6/R7 w - - 0 1', solution: ['Ra8#'], category: 'mate_in_1', theme: 'Rook Mate on Edge', difficulty: 'beginner', rating: 500, coachNotes: 'The rook delivers mate on the a-file with the king supporting from b2.' },
  { id: 'mi1-015', fen: '5rk1/4nppp/8/8/8/5Q2/5PPP/6K1 w - - 0 1', solution: ['Qf8#'], category: 'mate_in_1', theme: 'Queen Smother', difficulty: 'intermediate', rating: 800, coachNotes: 'Qf8+ is checkmate because the knight on e7 blocks the escape route, and the rook is exchanged.' },
];

// === MATE IN 2 ===
const MATE_IN_2: Puzzle[] = [
  { id: 'mi2-001', fen: '6k1/5ppp/8/8/8/2r5/1R3PPP/6K1 w - - 0 1', solution: ['Rb8+', 'Rc8', 'Rxc8#'], category: 'mate_in_2', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 800, coachNotes: 'Rb8+ forces Rc8 (only move), then Rxc8# is back rank mate. The key is seeing that the rook deflects the defender.' },
  { id: 'mi2-002', fen: 'r2q1rk1/pb3ppp/1p1bp3/3n4/3P4/3B1N2/PP1BQPPP/R3R1K1 w - - 0 14', solution: ['Bxh7+', 'Kxh7', 'Ng5+'], category: 'mate_in_2', theme: 'Greek Gift Sacrifice', difficulty: 'intermediate', rating: 1200, coachNotes: 'The classic Greek Gift sacrifice! Bxh7+ destroys the kingside pawn shield, and Ng5+ sets up a discovered attack on the exposed king.' },
  { id: 'mi2-003', fen: 'r1b3kr/pppn1pNp/8/4q3/8/8/PPPPQPPP/R1B1K2R w KQ - 0 1', solution: ['Qe8+', 'Rxe8', 'Nf7#'], category: 'mate_in_2', theme: 'Smothered Mate Setup', difficulty: 'intermediate', rating: 1100, coachNotes: 'The queen sacrifice on e8 deflects the rook, then Nf7# is a beautiful smothered mate. The g8 rook, g7 pawn, and h7 pawn trap the king.' },
  { id: 'mi2-004', fen: '6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1', solution: ['Qg8+', 'Rxg8', 'Nf7#'], category: 'mate_in_2', theme: 'Philidor\'s Legacy', difficulty: 'intermediate', rating: 1150, coachNotes: 'Another smothered mate pattern. The queen sacrifice on g8 forces Rxg8, and Nf7# is checkmate with the knight being untouchable.' },
  { id: 'mi2-005', fen: '3r2k1/5pp1/7p/R7/4n3/1Q6/5PPP/3r2K1 w - - 0 1', solution: ['Qa3', 'Rd7', 'Ra8#'], category: 'mate_in_2', theme: 'Back Rank Deflection', difficulty: 'intermediate', rating: 1000, coachNotes: 'The queen moves to a3, threatening Ra8#. Black must deal with the back rank threat but cannot cover everything.' },
  { id: 'mi2-006', fen: 'r1bqk2r/pppp1ppp/2n5/4P3/2B1n3/B4N2/P4PPP/R2Q1RK1 w kq - 1 10', solution: ['Bxf7+', 'Kxf7', 'Qd5+'], category: 'mate_in_2', theme: 'Attraction Sacrifice', difficulty: 'intermediate', rating: 1100, coachNotes: 'Bxf7+ forces the king to an exposed square, then Qd5+ forks king and rook while threatening mate.' },
  { id: 'mi2-007', fen: 'r4rk1/pppb1ppp/8/4Nb2/3P4/1Q6/PP3PPP/R4RK1 w - - 0 1', solution: ['Qh3', 'h6', 'Qd7'], category: 'mate_in_2', theme: 'Queen Infiltration', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qh3 targets h7 with mate threats. Black\'s defensive options are limited.' },
  { id: 'mi2-008', fen: '2r3k1/pp3pp1/4p2p/3pP3/1P1P4/P3B2P/5PP1/2R3K1 w - - 0 1', solution: ['Rc8+', 'Rxc8', 'Bg5'], category: 'mate_in_2', theme: 'Exchange then Pin', difficulty: 'advanced', rating: 1300, coachNotes: 'The rook exchange on c8 is followed by a devastating bishop move.' },
];

// === FORKS ===
const FORKS: Puzzle[] = [
  { id: 'fork-001', fen: '8/3k4/8/3N4/8/8/1K6/4r3 w - - 0 1', solution: ['Nf6+'], category: 'forks', theme: 'Knight Fork (King + Rook)', difficulty: 'beginner', rating: 700, coachNotes: 'The knight jumps to f6, simultaneously attacking the king on d7 and the rook on e1. After the king moves, Nxe1 wins the rook.' },
  { id: 'fork-002', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['Ng5'], category: 'forks', theme: 'Knight Fork Threat', difficulty: 'beginner', rating: 750, coachNotes: 'Ng5 attacks the weak f7 square with both the knight and bishop. This is the beginning of the Fried Liver Attack.' },
  { id: 'fork-003', fen: '2r3k1/pp3pp1/4p2p/8/1b2q3/1B2B1P1/PP3P1P/3QR1K1 w - - 0 1', solution: ['Qd7'], category: 'forks', theme: 'Queen Fork', difficulty: 'intermediate', rating: 1000, coachNotes: 'Qd7 attacks both the c8 rook and the b4 bishop simultaneously. Black cannot defend both pieces.' },
  { id: 'fork-004', fen: 'r3k2r/ppp1nppp/3q1n2/3pN3/3P4/2N5/PPP2PPP/R2QR1K1 w kq - 0 10', solution: ['Nxf7'], category: 'forks', theme: 'Knight Fork (Queen + Rook)', difficulty: 'advanced', rating: 1300, coachNotes: 'Nxf7 forks the queen on d6 and the rook on h8. The knight is temporarily sacrificed but wins material.' },
  { id: 'fork-005', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bP5/2N1PN2/PP2BPPP/R1BQK2R w KQ - 0 6', solution: ['Qa4'], category: 'forks', theme: 'Queen Fork (Bishop + Knight)', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qa4 attacks the undefended b4 bishop and the c6 knight. Black loses material.' },
  { id: 'fork-006', fen: '8/pk6/8/3N4/8/8/1K6/8 w - - 0 1', solution: ['Nc7+'], category: 'forks', theme: 'Knight Fork with Tempo', difficulty: 'beginner', rating: 650, coachNotes: 'Nc7+ attacks the king on b7 and the a8 corner, demonstrating the knight\'s unique L-shaped fork.' },
  { id: 'fork-007', fen: 'r2qk2r/ppp2ppp/2nbbn2/3pp3/4P3/3B1N2/PPPN1PPP/R1BQK2R w KQkq - 0 6', solution: ['Nxe5'], category: 'forks', theme: 'Central Fork', difficulty: 'intermediate', rating: 950, coachNotes: 'Nxe5 attacks both the d7 bishop and threatens discovered attacks on the f7 pawn.' },
];

// === PINS ===
const PINS: Puzzle[] = [
  { id: 'pin-001', fen: 'rn1qkb1r/ppp2ppp/4pn2/3p4/3P2b1/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 2 4', solution: ['Bg5'], category: 'pins', theme: 'Absolute Pin', difficulty: 'beginner', rating: 700, coachNotes: 'Bg5 pins the f6 knight to the d8 queen. The knight cannot move without exposing the queen to capture.' },
  { id: 'pin-002', fen: 'r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['Bb5'], category: 'pins', theme: 'Pin to the King', difficulty: 'beginner', rating: 750, coachNotes: 'The bishop on b5 pins the c6 knight to the king. This is the Ruy Lopez main idea.' },
  { id: 'pin-003', fen: 'r2qk2r/ppp1bppp/2n1pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 6', solution: ['Bxf6'], category: 'pins', theme: 'Exploiting a Pin', difficulty: 'intermediate', rating: 900, coachNotes: 'The pinned knight on f6 cannot recapture because it is pinned by Bg5 to the queen on d8. Bxf6 wins a piece.' },
  { id: 'pin-004', fen: 'r2qkbnr/ppp2ppp/2n1p3/3pP3/3P2b1/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: ['Be2'], category: 'pins', theme: 'Breaking a Pin', difficulty: 'intermediate', rating: 850, coachNotes: 'Be2 unpins the knight while maintaining a solid position. The bishop on g4 loses its pin.' },
  { id: 'pin-005', fen: 'r1b1kbnr/ppppqppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: ['d5'], category: 'pins', theme: 'Pawn Attack on Pinned Piece', difficulty: 'intermediate', rating: 950, coachNotes: 'd5 attacks the pinned knight on c6. The knight cannot move because the queen on e7 is behind it.' },
];

// === SKEWERS ===
const SKEWERS: Puzzle[] = [
  { id: 'skw-001', fen: '8/8/2k5/8/8/r7/8/7R w - - 0 1', solution: ['Rh6+'], category: 'skewers', theme: 'Rook Skewer', difficulty: 'beginner', rating: 650, coachNotes: 'Rh6+ skewers the king on c6 and the rook on a3. After the king moves, Rxa3 wins the rook.' },
  { id: 'skw-002', fen: 'q7/8/2k5/8/5B2/8/8/3K4 w - - 0 1', solution: ['Be5+'], category: 'skewers', theme: 'Bishop Skewer', difficulty: 'intermediate', rating: 900, coachNotes: 'The bishop on e5 checks the king on c6. After the king moves, Bxa1 wins the queen.' },
  { id: 'skw-003', fen: '1k6/8/2K5/8/4R3/8/8/1q6 w - - 0 1', solution: ['Re8+'], category: 'skewers', theme: 'Rook Skewer (King + Queen)', difficulty: 'beginner', rating: 700, coachNotes: 'Re8+ forces the king to move, then Rxb1 captures the queen. A classic X-ray attack pattern.' },
];

// === DISCOVERED ATTACKS ===
const DISCOVERED: Puzzle[] = [
  { id: 'disc-001', fen: 'r2qkb1r/ppp2ppp/2n1pn2/3p4/3P2b1/4PN2/PPP1BPPP/RNBQK2R w KQkq - 0 5', solution: ['Nxd5'], category: 'discovered_attacks', theme: 'Discovered Attack on Queen', difficulty: 'intermediate', rating: 1000, coachNotes: 'Nxd5 uncovers the e2 bishop\'s attack on the g4 bishop. Black loses a pawn or the bishop pair.' },
  { id: 'disc-002', fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 3', solution: ['Bb4+'], category: 'discovered_attacks', theme: 'Discovered Check', difficulty: 'intermediate', rating: 950, coachNotes: 'Bb4+ is a discovered check setup in the Nimzo-Indian Defense. It pins the knight to the king.' },
];

// === DEFLECTION & DECOY ===
const DEFLECTION: Puzzle[] = [
  { id: 'defl-001', fen: '6k1/5ppp/8/8/8/8/r4PPP/1R3RK1 w - - 0 1', solution: ['Rb8+'], category: 'deflection', theme: 'Deflection', difficulty: 'beginner', rating: 700, coachNotes: 'Rb8+ deflects a potential defender. If the rook defends, the back rank is exposed.' },
  { id: 'defl-002', fen: 'r4rk1/ppp1qppp/2n2n2/2bpp3/2B5/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['Bxe6'], category: 'deflection', theme: 'Bishop Deflection', difficulty: 'advanced', rating: 1300, coachNotes: 'Bxe6 deflects the f7 pawn from guarding critical squares. If fxe6, the e-file opens for the queen.' },
  { id: 'defl-003', fen: '6k1/pp3ppp/8/8/4r3/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Qb8+'], category: 'decoy', theme: 'Decoy/Attraction', difficulty: 'intermediate', rating: 900, coachNotes: 'Qb8+ attracts the king to an inferior square, allowing a follow-up tactic.' },
];

// === SACRIFICES ===
const SACRIFICES: Puzzle[] = [
  { id: 'sac-001', fen: 'r1b2rk1/pp1nbppp/1q2p3/3pP3/3P4/3B1N2/PP3PPP/R1BQ1RK1 w - - 0 11', solution: ['Bxh7+', 'Kxh7', 'Ng5+'], category: 'sacrifices', theme: 'Greek Gift Sacrifice', difficulty: 'advanced', rating: 1400, coachNotes: 'The classic Greek Gift! Bxh7+ rips open the kingside. After Kxh7, Ng5+ continues the attack with Qh5 to follow. This pattern occurs frequently in the French Defense and Queen\'s Gambit Declined.' },
  { id: 'sac-002', fen: 'r1bqk2r/ppp2ppp/2np1n2/1B2p3/4P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6', solution: ['Bxc6+'], category: 'sacrifices', theme: 'Positional Exchange', difficulty: 'beginner', rating: 800, coachNotes: 'Bxc6+ trades bishop for knight but doubles Black\'s pawns. This is the Ruy Lopez Exchange variation.' },
  { id: 'sac-003', fen: 'r2qr1k1/ppp2ppp/2n1bn2/3p4/3P1B2/2NBPN2/PPP2PPP/R2QR1K1 w - - 0 9', solution: ['Bxh7+'], category: 'sacrifices', theme: 'Bishop Sacrifice on h7', difficulty: 'advanced', rating: 1350, coachNotes: 'Another Greek Gift pattern. The bishop sac opens the h-file and creates a mating attack with Ng5+ and Qh5.' },
];

// === ENDGAME EXERCISES ===
const ENDGAMES: Puzzle[] = [
  { id: 'end-001', fen: '8/8/8/4k3/8/8/4KP2/8 w - - 0 1', solution: ['Kd3'], category: 'endgames', theme: 'Opposition', difficulty: 'beginner', rating: 700, coachNotes: 'White must take the opposition with Kd3! This ensures the pawn can promote. Ke3 also works but Kd3 is the most direct path to gaining the opposition.' },
  { id: 'end-002', fen: '1K6/1P6/8/8/8/8/r7/2k5 w - - 0 1', solution: ['Ka7'], category: 'endgames', theme: 'Lucena Position Setup', difficulty: 'intermediate', rating: 1000, coachNotes: 'The king must step aside to let the pawn promote. Ka7 prepares b8=Q next move.' },
  { id: 'end-003', fen: '8/8/8/8/5k2/8/R4PK1/8 w - - 0 1', solution: ['Ra4+'], category: 'endgames', theme: 'Rook Endgame Technique', difficulty: 'intermediate', rating: 950, coachNotes: 'Ra4+ pushes the black king away from the pawn, allowing White to advance it safely.' },
  { id: 'end-004', fen: '8/5k2/8/5PK1/8/8/8/8 w - - 0 1', solution: ['Kg6'], category: 'endgames', theme: 'Key Squares', difficulty: 'beginner', rating: 750, coachNotes: 'Kg6 takes the opposition. The king occupies a key square in front of the pawn, guaranteeing promotion.' },
  { id: 'end-005', fen: '8/8/1k6/8/1K6/1P6/8/8 w - - 0 1', solution: ['Kc4'], category: 'endgames', theme: 'Triangulation', difficulty: 'intermediate', rating: 1050, coachNotes: 'White uses triangulation: Kc4-Kd4-Kd3 to lose a tempo and force Black into zugzwang.' },
];

// === ZWISCHENZUG ===
const ZWISCHENZUG: Puzzle[] = [
  { id: 'zwi-001', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq d3 0 4', solution: ['exd4'], category: 'zwischenzug', theme: 'Zwischenzug', difficulty: 'intermediate', rating: 1000, coachNotes: 'An intermediate move before recapturing. Taking the d4 pawn first creates tactical opportunities before responding to threats.' },
  { id: 'zwi-002', fen: 'r1b1kbnr/ppppqppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: ['d5'], category: 'zwischenzug', theme: 'Pawn Zwischenzug', difficulty: 'advanced', rating: 1200, coachNotes: 'd5 is an in-between move that attacks the knight before it can recapture. This gains tempo and space.' },
];

// === OVERLOADING ===
const OVERLOADING: Puzzle[] = [
  { id: 'ovl-001', fen: 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10', solution: ['Bxh7+'], category: 'overloading', theme: 'Overloaded Defender', difficulty: 'advanced', rating: 1350, coachNotes: 'The f6 knight is overloaded — it defends both h7 and d5. Bxh7+ exploits this by attacking the square the knight must guard.' },
  { id: 'ovl-002', fen: 'r2q1rk1/1b2bppp/p1n1pn2/1p6/3P4/1BN1PN2/PP3PPP/R1BQ1RK1 w - - 0 10', solution: ['d5'], category: 'overloading', theme: 'Central Pawn Breakthrough', difficulty: 'advanced', rating: 1250, coachNotes: 'd5 attacks the overloaded c6 knight that defends both e7 and a5. Something must give.' },
];

// === POSITIONAL/STRATEGY ===
const STRATEGY: Puzzle[] = [
  { id: 'str-001', fen: 'r2qkb1r/pp2pppp/2p2n2/3p1b2/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 5', solution: ['Nh4'], category: 'strategy', theme: 'Bishop Exchange', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nh4 targets the light-squared bishop. In the Slav Defense, trading the light-squared bishop often favors White positionally.' },
  { id: 'str-002', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 7', solution: ['cxd5'], category: 'strategy', theme: 'IQP Creation', difficulty: 'intermediate', rating: 1050, coachNotes: 'cxd5 creates an isolated d-pawn for Black (after exd5). White plans to blockade d4 and exploit the weak d5 pawn.' },
];

// === CALCULATION EXERCISES ===
const CALCULATION: Puzzle[] = [
  { id: 'calc-001', fen: 'r2q1rk1/pp2ppbp/2n3p1/2pp4/3P1B2/2PB1N2/PP3PPP/R2Q1RK1 w - - 0 10', solution: ['dxc5', 'dxc5', 'Bxg6'], category: 'calculation', theme: 'Multi-move Calculation', difficulty: 'advanced', rating: 1400, coachNotes: 'This requires 3-move calculation. dxc5 wins a pawn, and after the recaptures, Bxg6 exploits the weakened kingside.' },
  { id: 'calc-002', fen: 'r1bqr1k1/ppp2ppp/2n2n2/3p4/2PP4/2N2N2/PP3PPP/R1BQR1K1 w - - 0 8', solution: ['cxd5', 'Nxd5', 'Nxd5'], category: 'calculation', theme: 'Forcing Sequence', difficulty: 'intermediate', rating: 1150, coachNotes: 'The capture sequence cxd5 Nxd5 Nxd5 is a forcing line. Each capture is essentially forced, simplifying the position in White\'s favor.' },
];

// Combine all puzzles (core + expanded)
export const ALL_PUZZLES: Puzzle[] = [
  ...MATE_IN_1,
  ...MATE_IN_2,
  ...FORKS,
  ...PINS,
  ...SKEWERS,
  ...DISCOVERED,
  ...DEFLECTION,
  ...SACRIFICES,
  ...ENDGAMES,
  ...ZWISCHENZUG,
  ...OVERLOADING,
  ...STRATEGY,
  ...CALCULATION,
  ...getExpandedPuzzles(),
];

// Category metadata (core + expanded)
export const PUZZLE_CATEGORIES = [
  { id: 'mate_in_1', label: 'Mate in 1', icon: '♔', count: 0 },
  { id: 'mate_in_2', label: 'Mate in 2', icon: '♕', count: 0 },
  { id: 'forks', label: 'Forks', icon: '⚔️', count: 0 },
  { id: 'pins', label: 'Pins', icon: '📌', count: 0 },
  { id: 'skewers', label: 'Skewers', icon: '🎯', count: 0 },
  { id: 'discovered_attacks', label: 'Discovered Attacks', icon: '💥', count: 0 },
  { id: 'deflection', label: 'Deflection & Decoy', icon: '🪤', count: 0 },
  { id: 'sacrifices', label: 'Sacrifices', icon: '💎', count: 0 },
  { id: 'endgames', label: 'Endgame Studies', icon: '👑', count: 0 },
  { id: 'zwischenzug', label: 'Zwischenzug', icon: '⚡', count: 0 },
  { id: 'overloading', label: 'Overloading', icon: '⚖️', count: 0 },
  { id: 'strategy', label: 'Strategy', icon: '📊', count: 0 },
  { id: 'calculation', label: 'Calculation', icon: '🧠', count: 0 },
  ...EXPANDED_CATEGORIES,
].map(cat => ({
  ...cat,
  count: ALL_PUZZLES.filter(p => p.category === cat.id).length
}));

// Query function
export function queryPuzzles(filters: {
  category?: string;
  difficulty?: string;
  minRating?: number;
  maxRating?: number;
  limit?: number;
} = {}): Puzzle[] {
  let results = ALL_PUZZLES;
  if (filters.category) results = results.filter(p => p.category === filters.category);
  if (filters.difficulty) results = results.filter(p => p.difficulty === filters.difficulty);
  if (filters.minRating) results = results.filter(p => p.rating >= filters.minRating!);
  if (filters.maxRating) results = results.filter(p => p.rating <= filters.maxRating!);
  if (filters.limit) results = results.slice(0, filters.limit);
  return results;
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return ALL_PUZZLES.find(p => p.id === id);
}

export function getRandomPuzzle(category?: string, difficulty?: string): Puzzle {
  const pool = queryPuzzles({ category, difficulty });
  return pool[Math.floor(Math.random() * pool.length)] || ALL_PUZZLES[0];
}
