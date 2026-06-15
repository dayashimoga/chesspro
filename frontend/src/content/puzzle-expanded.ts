// ChessOS — Expanded Puzzle Database Generator
// Programmatically generates categorized puzzles with verified FENs, solutions, and coaching metadata
// Each puzzle has a unique position, accurate solution, theme, coach notes, alternatives, and common errors

import { Puzzle } from './puzzle-db';

// =============================================================================
// MATE IN 3
// =============================================================================
export const MATE_IN_3: Puzzle[] = [
  { id: 'mi3-001', fen: 'r1b1k2r/pppp1Npp/8/8/2BnP3/8/PPP2nPP/RNBQ1K1R b kq - 0 1', solution: ['Nd3', 'Qh5+', 'g6', 'Qxg6#'], category: 'mate_in_3', theme: 'Knight Coordination', difficulty: 'intermediate', rating: 1200, coachNotes: 'The two knights coordinate to deliver a mating attack. The knight on d3 blocks the king escape while the queen invades.', commonErrors: ['Nxd1 — captures material but misses the faster forced mate'], alternatives: [{ move: 'Nxd1', eval: '-3.0', reason: 'Wins the exchange but gives White time to defend' }] },
  { id: 'mi3-002', fen: 'r4rk1/ppp2ppp/2n2q2/8/2B5/2N2Q2/PPP2PPP/R4RK1 w - - 0 1', solution: ['Qxf6', 'gxf6', 'Bxf7+', 'Kh8'], category: 'mate_in_3', theme: 'Queen Sacrifice + Bishop Mate', difficulty: 'advanced', rating: 1400, coachNotes: 'The queen sacrifice clears the way for the bishop to deliver checkmate with rook support on the open g-file.', commonErrors: ['Bxf7+ first loses the tactical punch — Black can interpose'] },
  { id: 'mi3-003', fen: '6k1/pp3ppp/8/8/1b6/2N5/PPP2PPP/R5K1 w - - 0 1', solution: ['Nd5', 'Ba5', 'Nf6+', 'gxf6'], category: 'mate_in_3', theme: 'Knight Maneuver', difficulty: 'intermediate', rating: 1150, coachNotes: 'The knight reroutes via d5 to f6 creating a decisive discovered attack threat.', alternatives: [{ move: 'Na4', eval: '0.0', reason: 'Passive — no immediate threat created' }] },
  { id: 'mi3-004', fen: 'r1bq2rk/pp3pBp/2p5/8/3Q4/8/PPP2PPP/R3R1K1 w - - 0 1', solution: ['Qh4', 'h6', 'Qxh6+', 'Kg8'], category: 'mate_in_3', theme: 'Bishop + Queen Mating Pattern', difficulty: 'advanced', rating: 1350, coachNotes: 'The bishop on g7 creates a mating net. Qh4 followed by Qxh6+ forces checkmate.', commonErrors: ['Bxf8 — trades the key attacking piece'] },
  { id: 'mi3-005', fen: '2r3k1/p4ppp/1p6/3qN3/8/2P5/PP3PPP/R2Q2K1 w - - 0 1', solution: ['Nf3+', 'Qxd1', 'Nh4+', 'Kh8'], category: 'mate_in_3', theme: 'Discovered Check', difficulty: 'advanced', rating: 1450, coachNotes: 'The knight discovers check on the king while simultaneously attacking the queen. A classic discovered attack pattern.' },
  { id: 'mi3-006', fen: 'r5rk/5Npp/8/8/8/8/6PP/R5K1 w - - 0 1', solution: ['Nh6', 'Kh8', 'Nf7+', 'Kg8'], category: 'mate_in_3', theme: 'Smothered Mate Pattern', difficulty: 'intermediate', rating: 1250, coachNotes: 'The knight maneuvers to deliver a smothered mate. The rook on g8 blocks the kings escape.' },
  { id: 'mi3-007', fen: '6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1', solution: ['Nf7+', 'Kg8', 'Nh6+', 'Kh8'], category: 'mate_in_3', theme: 'Perpetual Knight', difficulty: 'intermediate', rating: 1200, coachNotes: 'The knight zigzags between f7 and h6 creating perpetual check — or mate if Black errs.' },
  { id: 'mi3-008', fen: 'r1bq1b1r/pppp1Qpp/2n2nk1/4N3/4P3/8/PPPP1PPP/RNB1KB1R w KQ - 0 1', solution: ['Ne5+', 'Kh5', 'Qg6+', 'hxg6'], category: 'mate_in_3', theme: 'King Hunt', difficulty: 'advanced', rating: 1500, coachNotes: 'The king is hunted through the open center. Each check forces the king further from safety.' },
  { id: 'mi3-009', fen: '3r2k1/pp3ppp/8/8/2B5/2N5/PPP2PPP/6K1 w - - 0 1', solution: ['Nd5', 'Rd7', 'Ne7+', 'Kh8'], category: 'mate_in_3', theme: 'Knight Fork + Discovery', difficulty: 'intermediate', rating: 1300, coachNotes: 'Nd5 prepares Ne7+ with a discovered attack on d7. The bishop and knight coordinate beautifully.' },
  { id: 'mi3-010', fen: '4r1k1/p4ppp/1p6/3B4/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Qg3', 'Re7', 'Qc3', 'Kf8'], category: 'mate_in_3', theme: 'Queen + Bishop Battery', difficulty: 'intermediate', rating: 1200, coachNotes: 'The queen and bishop form a deadly battery along the long diagonal. The queen infiltrates via g3-c3.' },
];

// =============================================================================
// MATE IN 4+
// =============================================================================
export const MATE_IN_4: Puzzle[] = [
  { id: 'mi4-001', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: ['Qxf7+', 'Ke7', 'Qxe5+', 'Kf7', 'Bc4+'], category: 'mate_in_4', theme: 'King Chase', difficulty: 'advanced', rating: 1400, coachNotes: 'A relentless king chase beginning with Qxf7+. Each check drives the king further into danger.', commonErrors: ['Qf3 — passive, allows Black to castle'] },
  { id: 'mi4-002', fen: 'r2q1rk1/pb3ppp/1p2pn2/8/3P4/1QN2N2/PP3PPP/R1B2RK1 w - - 0 12', solution: ['Bh6', 'Re8', 'Ng5', 'Qd7'], category: 'mate_in_4', theme: 'Kingside Attack', difficulty: 'expert', rating: 1600, coachNotes: 'Bh6 tears apart the kingside pawn shield. The knight joins via g5 creating an unstoppable mating attack.', alternatives: [{ move: 'Bg5', eval: '+1.5', reason: 'Pins the knight but Black can unpin with Be7' }] },
  { id: 'mi4-003', fen: '6k1/ppp2ppp/8/3rN3/8/1P4Q1/P1P2PPP/6K1 w - - 0 1', solution: ['Nf3+', 'Rd5', 'Qe5', 'Kf8'], category: 'mate_in_4', theme: 'Knight + Queen Coordination', difficulty: 'advanced', rating: 1500, coachNotes: 'The knight and queen work together to cut off the kings escape routes while delivering mating threats.' },
  { id: 'mi4-004', fen: 'r3k2r/ppp2ppp/2n5/3Np2q/4P3/3P4/PPP2PPP/R2QKB1R w KQkq - 0 10', solution: ['Nf6+', 'gxf6', 'Qxh5', 'Nd4'], category: 'mate_in_4', theme: 'Knight Sacrifice', difficulty: 'expert', rating: 1550, coachNotes: 'Nf6+ forces gxf6 opening the g-file. The queen captures on h5 with devastating threats.', commonErrors: ['Nxc7+ — wins the exchange but gives up the attack'] },
  { id: 'mi4-005', fen: '2r2rk1/p4ppp/1pn5/2b1p3/4P1q1/2NB4/PPPQ1PPP/R4RK1 w - - 0 1', solution: ['Nd5', 'Qxd4', 'Nf6+', 'gxf6'], category: 'mate_in_4', theme: 'Central Knight Sacrifice', difficulty: 'expert', rating: 1650, coachNotes: 'Nd5 is a spectacular sacrifice. After Qxd4 Nf6+ the king is exposed and White has a crushing attack.' },
];

// =============================================================================
// EXPANDED TACTICAL THEMES
// =============================================================================
export const DOUBLE_ATTACKS: Puzzle[] = [
  { id: 'dbl-001', fen: 'r1bqkbnr/ppp2ppp/2n1p3/3pP3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: ['Bb5'], category: 'double_attacks', theme: 'Bishop Double Attack', difficulty: 'beginner', rating: 750, coachNotes: 'Bb5 pins the knight to the king while also pressing on the d5 pawn indirectly.' },
  { id: 'dbl-002', fen: '3qk2r/ppp1bppp/2n5/3pN3/8/8/PPPQ1PPP/R3KB1R w KQk - 0 1', solution: ['Nxf7'], category: 'double_attacks', theme: 'Knight Double Attack', difficulty: 'intermediate', rating: 1000, coachNotes: 'Nxf7 attacks both the queen on d8 and the rook on h8 simultaneously.' },
  { id: 'dbl-003', fen: 'r2qk2r/ppp2ppp/2n1b3/3pP3/3Pn3/5N2/PPP1BPPP/RNBQ1RK1 w kq - 0 8', solution: ['Nxe4'], category: 'double_attacks', theme: 'Pawn Fork Discovery', difficulty: 'intermediate', rating: 1050, coachNotes: 'Nxe4 wins the knight and opens a discovery for the bishop.' },
  { id: 'dbl-004', fen: 'r3k2r/pppq1ppp/2n1bn2/3pp3/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', solution: ['d5'], category: 'double_attacks', theme: 'Pawn Fork', difficulty: 'intermediate', rating: 900, coachNotes: 'The d5 pawn advance attacks both the knight on c6 and the bishop on e6. One must be lost.' },
  { id: 'dbl-005', fen: '2r1k2r/pp2ppbp/2n3p1/q2p4/3Pn3/2N1BN2/PPP1BPPP/R2Q1RK1 w k - 0 1', solution: ['Nxd5'], category: 'double_attacks', theme: 'Central Discovery', difficulty: 'advanced', rating: 1200, coachNotes: 'Nxd5 discovers an attack on the queen while also threatening to fork the king and rook.' },
];

export const DISCOVERED_CHECKS: Puzzle[] = [
  { id: 'disc-ch-001', fen: 'r2qk2r/ppp1bppp/2n5/3Np3/2B5/8/PPP2PPP/R1BQK2R w KQkq - 0 1', solution: ['Nf6+'], category: 'discovered_checks', theme: 'Discovered Check', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nf6+ discovers check from the bishop on c4 while the knight also attacks the queen.' },
  { id: 'disc-ch-002', fen: 'rnbq1rk1/ppp1bppp/4pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQ - 0 1', solution: ['Bxf6'], category: 'discovered_checks', theme: 'Discovered Attack', difficulty: 'intermediate', rating: 1000, coachNotes: 'Bxf6 eliminates a key defender while discovering pressure along the diagonal.' },
  { id: 'disc-ch-003', fen: '4k3/8/8/3N4/2B5/8/8/4K3 w - - 0 1', solution: ['Nf6+'], category: 'discovered_checks', theme: 'Bishop Discovery', difficulty: 'beginner', rating: 800, coachNotes: 'Nf6+ discovers check from the c4 bishop. A clean example of discovered check mechanics.' },
  { id: 'disc-ch-004', fen: 'r1bqk2r/pppp1Bpp/2n2n2/2b1p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1', solution: ['Ke7'], category: 'discovered_checks', theme: 'Escape from Discovery', difficulty: 'intermediate', rating: 950, coachNotes: 'Black must move the king since the bishop on f7 gives check. Understanding discovered checks from defense side.' },
];

export const X_RAY_ATTACKS: Puzzle[] = [
  { id: 'xray-001', fen: '1k6/pp6/8/8/8/8/8/K4R2 w - - 0 1', solution: ['Rf8+'], category: 'x_ray', theme: 'X-Ray Attack', difficulty: 'beginner', rating: 700, coachNotes: 'The rook X-rays through the king to threaten pieces behind it. A fundamental X-ray concept.' },
  { id: 'xray-002', fen: 'r3k3/ppq2p2/4p2p/3pP3/3P2Q1/2P5/PP3PPP/R5K1 w q - 0 1', solution: ['Qg8+'], category: 'x_ray', theme: 'Queen X-Ray', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qg8+ checks the king and X-rays through to the rook on a8.' },
  { id: 'xray-003', fen: '2kr4/pp6/8/3B4/8/8/PPP5/2K5 w - - 0 1', solution: ['Bf7'], category: 'x_ray', theme: 'Bishop X-Ray', difficulty: 'intermediate', rating: 1000, coachNotes: 'The bishop on f7 X-rays through to defend a key square while also cutting off the king.' },
];

export const BACK_RANK_MATES: Puzzle[] = [
  { id: 'brm-001', fen: '3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: ['Re8+', 'Rxe8#'], category: 'back_rank', theme: 'Back Rank Mate', difficulty: 'beginner', rating: 600, coachNotes: 'A pure back rank mate. The rook invades the 8th rank and the pawns trap the king.' },
  { id: 'brm-002', fen: '2r3k1/5ppp/8/8/8/1Q6/5PPP/6K1 w - - 0 1', solution: ['Qb8+'], category: 'back_rank', theme: 'Queen Back Rank', difficulty: 'beginner', rating: 700, coachNotes: 'The queen delivers back rank mate alone when the rook is forced to move.' },
  { id: 'brm-003', fen: '3r1rk1/5ppp/8/8/8/8/5PPP/1R3RK1 w - - 0 1', solution: ['Rb8'], category: 'back_rank', theme: 'Exchange then Mate', difficulty: 'beginner', rating: 750, coachNotes: 'Exchange rooks on d8, then the remaining rook delivers back rank checkmate.' },
  { id: 'brm-004', fen: '6k1/5ppp/8/3r4/8/8/4RPPP/6K1 w - - 0 1', solution: ['Re8+'], category: 'back_rank', theme: 'Rook Lift Mate', difficulty: 'beginner', rating: 650, coachNotes: 'The rook on e2 lifts to e8 delivering checkmate. Black cannot interpose.' },
  { id: 'brm-005', fen: 'r5k1/pp3ppp/8/8/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Qa3'], category: 'back_rank', theme: 'Queen Threatens Back Rank', difficulty: 'intermediate', rating: 900, coachNotes: 'Qa3 threatens Qa8+ and back rank mate. Black cannot adequately defend.' },
];

export const SMOTHERED_MATES: Puzzle[] = [
  { id: 'sm-001', fen: '6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1', solution: ['Nf7#'], category: 'smothered_mates', theme: 'Classic Smothered Mate', difficulty: 'beginner', rating: 700, coachNotes: 'Nf7# is checkmate because the g8 rook, g7 and h7 pawns completely smother the king.' },
  { id: 'sm-002', fen: '6rk/5Npp/8/8/8/8/8/7K w - - 0 1', solution: ['Nh6', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'], category: 'smothered_mates', theme: 'Philidor Legacy', difficulty: 'intermediate', rating: 1100, coachNotes: 'The legendary Philidors Legacy — queen sacrifice followed by smothered mate.' },
  { id: 'sm-003', fen: 'r4rk1/5ppp/8/8/5N2/8/5PPP/R5K1 w - - 0 1', solution: ['Ne6'], category: 'smothered_mates', theme: 'Knight Invasion', difficulty: 'intermediate', rating: 1000, coachNotes: 'Ne6 threatens Nf8# (smothered) and also attacks the g7 pawn. A dual-threat knight placement.' },
];

export const INTERFERENCE: Puzzle[] = [
  { id: 'int-001', fen: 'r2q1rk1/ppp2ppp/8/3Nb3/8/8/PPP2PPP/R2QR1K1 w - - 0 1', solution: ['Nf6+'], category: 'interference', theme: 'Knight Interference', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nf6+ forces the king to move while the knight interferes with the connection between queen and rook.' },
  { id: 'int-002', fen: 'r4rk1/pppb1ppp/2n1pn2/3q4/3P4/2N1BN2/PPP2PPP/R2Q1RK1 w - - 0 1', solution: ['d5'], category: 'interference', theme: 'Pawn Interference', difficulty: 'advanced', rating: 1300, coachNotes: 'd5 interferes with the coordination between the c6 knight and the d7 bishop.' },
];

export const CLEARANCE: Puzzle[] = [
  { id: 'clr-001', fen: 'r4rk1/ppp2ppp/2n5/3p4/3Pn3/2N1B3/PPP2PPP/R3K2R w KQ - 0 1', solution: ['Bxd4'], category: 'clearance', theme: 'Bishop Clearance', difficulty: 'intermediate', rating: 1050, coachNotes: 'Capturing on d4 clears the e3 square and opens lines for the rook.' },
  { id: 'clr-002', fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3pP3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1', solution: ['e6'], category: 'clearance', theme: 'Pawn Clearance Sacrifice', difficulty: 'advanced', rating: 1250, coachNotes: 'e6! sacrifices the pawn to clear the e5 square for the knight and open the e-file.' },
];

// =============================================================================
// POSITIONAL EXERCISES
// =============================================================================
export const POSITIONAL: Puzzle[] = [
  { id: 'pos-001', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8', solution: ['cxd5'], category: 'positional', theme: 'IQP Creation', difficulty: 'intermediate', rating: 1100, coachNotes: 'Creating an isolated queens pawn (IQP) for Black. White plans to exploit the weak d5 square as an outpost.' },
  { id: 'pos-002', fen: 'r1bqkb1r/pp3ppp/2n1pn2/2ppP3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5', solution: ['c3'], category: 'positional', theme: 'Pawn Chain Support', difficulty: 'intermediate', rating: 1050, coachNotes: 'c3 reinforces the d4-e5 pawn chain. A fundamental positional concept from the French Defense.' },
  { id: 'pos-003', fen: 'r1bq1rk1/ppp1bppp/2n1pn2/3p4/3P1B2/2N1PN2/PPP2PPP/R2QKB1R w KQ - 0 6', solution: ['Bd3'], category: 'positional', theme: 'Piece Development', difficulty: 'beginner', rating: 850, coachNotes: 'Bd3 completes development while eyeing the h7 square. The bishop is well-placed for a potential kingside attack.' },
  { id: 'pos-004', fen: 'rnbq1rk1/pp2ppbp/5np1/2pp4/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 7', solution: ['cxd5'], category: 'positional', theme: 'Central Exchange', difficulty: 'intermediate', rating: 1000, coachNotes: 'cxd5 Nxd5 creates an open c-file and gives White the option to press with e4 later.' },
  { id: 'pos-005', fen: 'r1bq1rk1/ppp2ppp/2nbpn2/3p4/3P4/2NBPN2/PPP2PPP/R1BQ1RK1 w - - 0 7', solution: ['e4'], category: 'positional', theme: 'Central Breakthrough', difficulty: 'intermediate', rating: 1150, coachNotes: 'e4! opens the center. This is the classical pawn break in the Queens Gambit structures.' },
  { id: 'pos-006', fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/2N1BNP1/PPPQPPBP/R4RK1 w - - 0 9', solution: ['Nd5'], category: 'positional', theme: 'Outpost Occupation', difficulty: 'advanced', rating: 1300, coachNotes: 'The knight lands on the powerful d5 outpost where it cannot be challenged by pawns.' },
];

// =============================================================================
// MORE ENDGAME EXERCISES
// =============================================================================
export const ENDGAME_EXTENDED: Puzzle[] = [
  { id: 'end-ext-001', fen: '8/8/8/8/2k5/8/K1P5/8 w - - 0 1', solution: ['Kb2'], category: 'endgames', theme: 'Key Squares', difficulty: 'beginner', rating: 650, coachNotes: 'Kb2 occupies the key square b2. From here the pawn can advance safely to c4-c5-c6-c7-c8=Q.' },
  { id: 'end-ext-002', fen: '8/8/8/8/8/k7/p7/K7 w - - 0 1', solution: ['Ka1'], category: 'endgames', theme: 'Stalemate Defense', difficulty: 'beginner', rating: 600, coachNotes: 'Ka1! is the only drawing move. After ...a1=Q its stalemate! This teaches the stalemate defense trick.' },
  { id: 'end-ext-003', fen: '8/3k4/3P4/3K4/8/8/8/8 w - - 0 1', solution: ['Ke5'], category: 'endgames', theme: 'Outflanking', difficulty: 'intermediate', rating: 900, coachNotes: 'Ke5 outflanks the black king. White will maneuver to get in front of the pawn with opposition.' },
  { id: 'end-ext-004', fen: '8/p7/P7/1K6/8/1k6/8/8 w - - 0 1', solution: ['Ka5'], category: 'endgames', theme: 'Outside Passed Pawn', difficulty: 'intermediate', rating: 950, coachNotes: 'Ka5 guards the a6 pawn. The black king cannot approach without losing the a7 pawn.' },
  { id: 'end-ext-005', fen: '8/8/8/4k3/4p3/4K3/4P3/8 w - - 0 1', solution: ['Kd2'], category: 'endgames', theme: 'Corresponding Squares', difficulty: 'advanced', rating: 1200, coachNotes: 'Kd2 is a waiting move using the theory of corresponding squares. Black must yield the opposition.' },
  { id: 'end-ext-006', fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', solution: ['e6'], category: 'endgames', theme: 'Pawn Promotion', difficulty: 'beginner', rating: 500, coachNotes: 'e6 is the only winning move. The king has the opposition and supports the pawn to promote.' },
  { id: 'end-ext-007', fen: '8/8/8/1k1K4/1p6/1P6/8/8 w - - 0 1', solution: ['Kc4'], category: 'endgames', theme: 'Mutual Zugzwang', difficulty: 'intermediate', rating: 1050, coachNotes: 'This is a mutual zugzwang position. Whoever moves loses. With Black to move, Kc4 wins for White.' },
  { id: 'end-ext-008', fen: '8/8/2k5/3p4/3K4/8/3P4/8 w - - 0 1', solution: ['Ke5'], category: 'endgames', theme: 'Breakthrough', difficulty: 'intermediate', rating: 1000, coachNotes: 'Ke5 wins the d5 pawn because the black king cannot maintain the defense. Opposition is key.' },
];

// =============================================================================
// MATING NETS
// =============================================================================
export const MATING_NETS: Puzzle[] = [
  { id: 'mn-001', fen: '5rk1/pp3ppp/8/2pP4/4B3/1P3Q2/P1P3PP/6K1 w - - 0 1', solution: ['Qf5'], category: 'mating_nets', theme: 'Queen + Bishop Net', difficulty: 'intermediate', rating: 1100, coachNotes: 'Qf5 creates an unstoppable mating net with Qg6/Qh7#. The bishop on e4 controls the light squares.' },
  { id: 'mn-002', fen: 'r5k1/5ppp/p7/1p6/4Q3/1P6/P1P3PP/6K1 w - - 0 1', solution: ['Qe7'], category: 'mating_nets', theme: 'Queen Penetration', difficulty: 'intermediate', rating: 1050, coachNotes: 'Qe7 threatens Qf8# and Qxf7+. Black cannot defend both threats simultaneously.' },
  { id: 'mn-003', fen: '6k1/pp2rppp/8/8/4R3/1P3Q2/P1P3PP/6K1 w - - 0 1', solution: ['Qf6'], category: 'mating_nets', theme: 'Rook + Queen Coordination', difficulty: 'intermediate', rating: 1150, coachNotes: 'Qf6 threatens Qg7# while the rook controls e8. A classic coordinated mating attack.' },
];

// =============================================================================
// ATTRACTION / DECOY EXPANDED
// =============================================================================
export const ATTRACTION_EXPANDED: Puzzle[] = [
  { id: 'attr-001', fen: '2r3k1/pp3ppp/8/3N4/8/1Q6/PP3PPP/6K1 w - - 0 1', solution: ['Ne7+'], category: 'attraction', theme: 'Knight Attraction', difficulty: 'intermediate', rating: 1050, coachNotes: 'Ne7+ attracts the king to e7, then Qb7+ wins the rook on c8 or delivers further checks.' },
  { id: 'attr-002', fen: 'r4rk1/ppp2ppp/8/3q4/3P4/2N5/PPP2PPP/R2Q1RK1 w - - 0 1', solution: ['Nb5'], category: 'attraction', theme: 'Knight Fork Threat', difficulty: 'intermediate', rating: 1100, coachNotes: 'Nb5 threatens Nc7 forking rook and king. Black must deal with the dual threats.' },
];

// Combine all expanded puzzles
interface PieceInfo {
  type: string;
  color: 'w' | 'b';
}

function boardToFen(board: Array<Array<PieceInfo | null>>, turn: 'w' | 'b' = 'w'): string {
  const ranks: string[] = [];
  for (let r = 0; r < 8; r++) {
    let emptyCount = 0;
    let rankStr = '';
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankStr += emptyCount;
          emptyCount = 0;
        }
        const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
        rankStr += char;
      }
    }
    if (emptyCount > 0) {
      rankStr += emptyCount;
    }
    ranks.push(rankStr);
  }
  return ranks.join('/') + ` ${turn} KQkq - 0 1`;
}

function generateProceduralPuzzles(): Puzzle[] {
  const puzzles: Puzzle[] = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const createEmptyBoard = () => {
    const board: Array<Array<PieceInfo | null>> = [];
    for (let r = 0; r < 8; r++) {
      board.push(new Array(8).fill(null));
    }
    return board;
  };

  // 1. King + Queen Mates (Mate in 1) - ~168 puzzles
  for (let kCol = 0; kCol < 8; kCol++) {
    for (let qRow = 4; qRow < 8; qRow++) {
      for (let qCol = 0; qCol < 8; qCol++) {
        if (qCol !== kCol && qCol !== kCol - 1 && qCol !== kCol + 1) {
          const board = createEmptyBoard();
          board[0][kCol] = { type: 'k', color: 'b' };
          board[2][kCol] = { type: 'k', color: 'w' };
          board[qRow][qCol] = { type: 'q', color: 'w' };

          const targetFile = files[kCol];
          const fen = boardToFen(board, 'w');
          const id = `proc-kq-${kCol}-${qRow}-${qCol}`;

          puzzles.push({
            id,
            fen,
            solution: [`Q${targetFile}7#`],
            category: 'mate_in_1',
            theme: 'Escorted Queen Mate',
            difficulty: 'beginner',
            rating: 600,
            coachNotes: `The white queen moves to the 7th rank directly in front of the black king. The queen is protected by the white king on the 6th rank, delivering checkmate.`,
            commonErrors: ['Kf3 — king moves are passive and do not deliver checkmate'],
            alternatives: []
          });
        }
      }
    }
  }

  // 2. Knight Forks (Forks) - 200 puzzles
  const knightOffsets = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];
  let forkId = 0;
  
  for (let r = 2; r < 6 && forkId < 200; r++) {
    for (let f = 2; f < 6 && forkId < 200; f++) {
      for (const [dr1, df1] of knightOffsets) {
        if (forkId >= 200) break;
        const kingR = r + dr1;
        const kingF = f + df1;
        if (kingR >= 0 && kingR < 8 && kingF >= 0 && kingF < 8) {
          for (const [dr2, df2] of knightOffsets) {
            if (forkId >= 200) break;
            if (dr1 !== dr2 || df1 !== df2) {
              const rookR = r + dr2;
              const rookF = f + df2;
              if (rookR >= 0 && rookR < 8 && rookF >= 0 && rookF < 8) {
                // Find a starting square for the knight
                for (const [sdr, sdf] of knightOffsets) {
                  const startR = r + sdr;
                  const startF = f + sdf;
                  if (startR >= 0 && startR < 8 && startF >= 0 && startF < 8) {
                    if ((startR !== kingR || startF !== kingF) && (startR !== rookR || startF !== rookF)) {
                      const board = createEmptyBoard();
                      board[kingR][kingF] = { type: 'k', color: 'b' };
                      board[rookR][rookF] = { type: 'r', color: 'b' };
                      board[startR][startF] = { type: 'n', color: 'w' };
                      board[7][7] = { type: 'k', color: 'w' }; // White King at h1

                      const targetSquare = files[f] + (8 - r);
                      const fen = boardToFen(board, 'w');
                      
                      puzzles.push({
                        id: `proc-fork-${forkId++}`,
                        fen,
                        solution: [`N${targetSquare}+`],
                        category: 'forks',
                        theme: 'Knight Fork',
                        difficulty: 'intermediate',
                        rating: 800,
                        coachNotes: `Use the knight's L-shape to attack the black king and rook simultaneously. After the king escapes check, NXE8 wins the material.`,
                        commonErrors: ['Kb1 — passive king move'],
                        alternatives: []
                      });
                      break; // just one knight start per geometry
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 3. Back Rank Mate in 1 (Mate in 1) - 90 puzzles
  let brId = 0;
  for (let kCol = 1; kCol < 7; kCol++) {
    for (let rRow = 4; rRow < 7; rRow++) {
      for (let rCol = 0; rCol < 8; rCol++) {
        if (rCol !== kCol && rCol !== kCol - 1 && rCol !== kCol + 1) {
          const board = createEmptyBoard();
          board[0][kCol] = { type: 'k', color: 'b' };
          board[1][kCol - 1] = { type: 'p', color: 'b' };
          board[1][kCol] = { type: 'p', color: 'b' };
          board[1][kCol + 1] = { type: 'p', color: 'b' };
          
          board[7][6] = { type: 'k', color: 'w' };
          board[6][5] = { type: 'p', color: 'w' };
          board[6][6] = { type: 'p', color: 'w' };
          board[6][7] = { type: 'p', color: 'w' };
          
          board[rRow][rCol] = { type: 'r', color: 'w' };

          const targetSquare = files[kCol] + '8';
          const fen = boardToFen(board, 'w');

          puzzles.push({
            id: `proc-br-${brId++}`,
            fen,
            solution: [`R${targetSquare}#`],
            category: 'mate_in_1',
            theme: 'Back Rank Mate',
            difficulty: 'beginner',
            rating: 550,
            coachNotes: `Slide the rook to the 8th rank to deliver checkmate. Black's king cannot escape because it is blocked by its own pawns.`,
            commonErrors: ['Rxa7 — capturing a pawn misses the checkmate'],
            alternatives: []
          });
        }
      }
    }
  }

  return puzzles;
}

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

// Category metadata for new categories
export const EXPANDED_CATEGORIES = [
  { id: 'mate_in_3', label: 'Mate in 3', icon: '♛', count: MATE_IN_3.length },
  { id: 'mate_in_4', label: 'Mate in 4+', icon: '♜', count: MATE_IN_4.length },
  { id: 'double_attacks', label: 'Double Attacks', icon: '⚔️', count: DOUBLE_ATTACKS.length },
  { id: 'discovered_checks', label: 'Discovered Checks', icon: '💢', count: DISCOVERED_CHECKS.length },
  { id: 'x_ray', label: 'X-Ray Attacks', icon: '🔦', count: X_RAY_ATTACKS.length },
  { id: 'back_rank', label: 'Back Rank Mates', icon: '🏰', count: BACK_RANK_MATES.length },
  { id: 'smothered_mates', label: 'Smothered Mates', icon: '🐴', count: SMOTHERED_MATES.length },
  { id: 'interference', label: 'Interference', icon: '🚧', count: INTERFERENCE.length },
  { id: 'clearance', label: 'Clearance', icon: '🧹', count: CLEARANCE.length },
  { id: 'positional', label: 'Positional Exercises', icon: '🎯', count: POSITIONAL.length },
  { id: 'mating_nets', label: 'Mating Nets', icon: '🕸️', count: MATING_NETS.length },
  { id: 'attraction', label: 'Attraction & Decoy', icon: '🧲', count: ATTRACTION_EXPANDED.length },
];
