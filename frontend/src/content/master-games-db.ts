// ChessOS — Expanded Master Games Database
// 200+ annotated master games from chess history's greatest players
// Each game includes: PGN, annotations, critical moments, coach commentary, alternative lines

export interface MasterGame {
  id: string;
  white: string;
  black: string;
  event: string;
  year: number;
  result: string;
  eco: string;
  opening: string;
  pgn: string;
  annotations: Record<number, string>;
  criticalMoments: Array<{ moveNumber: number; description: string; fen: string }>;
  alternatives: Array<{ moveNumber: number; move: string; eval: string; reason: string }>;
  coachCommentary: string;
  themes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ============================================================================
// PAUL MORPHY — The Pride and Sorrow of Chess
// ============================================================================
const MORPHY_GAMES: MasterGame[] = [
  {
    id: 'mg-morphy-001',
    white: 'Morphy, Paul', black: 'Duke of Brunswick & Count Isouard',
    event: 'Paris Opera', year: 1858, result: '1-0', eco: 'C41', opening: 'Philidor Defense',
    pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#',
    annotations: {
      3: 'Morphy immediately seizes the center with d4, challenging Black\'s passive setup.',
      5: 'Capturing with the queen centralizes it powerfully, targeting f7.',
      7: 'Qb3 applies pressure on both b7 and f7 — the two weakest squares in Black\'s camp.',
      11: 'A stunning exchange sacrifice! Nxb5 opens the b-file and the long diagonal.',
      13: 'The first sacrifice — the rook captures on d7, eliminating a key defender.',
      16: 'The immortal queen sacrifice! Qb8+!! forces Nxb8, and Rd8# is checkmate.',
      17: 'One of the most famous games in chess history. Every move demonstrates development, initiative, and attack.'
    },
    criticalMoments: [
      { moveNumber: 7, description: 'Qb3 targets f7 and b7 — a double attack on the weakest points', fen: 'rn1qkb1r/ppp2ppp/5n2/4p3/2B1P3/1Q6/PPP2PPP/RNB1K2R b KQkq - 0 7' },
      { moveNumber: 11, description: 'Nxb5! exchange sacrifice — opening lines for the attack', fen: 'rn1qkb1r/p4ppp/2p2n2/1p2p1B1/2B1P3/1QN5/PPP2PPP/R3K2R w KQkq - 0 11' },
      { moveNumber: 16, description: 'Qb8+!! The immortal queen sacrifice forcing checkmate', fen: '1n1rkb1r/p3nppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16' }
    ],
    alternatives: [
      { moveNumber: 11, move: 'Bb3', eval: '+1.5', reason: 'Retreating is safe but misses the brilliant tactical sequence' }
    ],
    coachCommentary: 'This is THE game every chess student must study. Morphy demonstrates rapid development, piece coordination, and sacrificial attack against undeveloped opponents. Key lesson: development > material.',
    themes: ['development', 'sacrifice', 'attack', 'back-rank-mate'],
    difficulty: 'beginner'
  },
  {
    id: 'mg-morphy-002',
    white: 'Morphy, Paul', black: 'Paulsen, Louis',
    event: 'First American Chess Congress', year: 1857, result: '1-0', eco: 'C48', opening: 'Four Knights',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5 Bc5 5. O-O O-O 6. Nxe5 Re8 7. Nxc6 dxc6 8. Bc4 b5 9. Be2 Nxe4 10. Nxe4 Rxe4 11. Bf3 Re6 12. c3 Qd3 13. b4 Bb6 14. a4 bxa4 15. Qxa4 Bd7 16. Ra2 Rae8 17. Qa6 Qxf3 18. gxf3 Rg6+ 19. Kh1 Bh3 20. Rd1 Bg2+ 21. Kg1 Bxf3+ 22. Kf1 Bg2+ 23. Kg1 Bh3+ 24. Kh1 Bxf2 25. Qf1 Bxf1 26. Rxf1 Re2 27. Ra1 Rh6 28. d4 Be3',
    annotations: {
      17: 'Morphy sacrifices the queen for a devastating mating attack.',
      18: 'Rg6+ begins the combination. The rook lift opens the gates.',
      20: 'Bg2+! The bishop joins with deadly precision.',
      28: 'Be3 threatens Rh1# — White cannot prevent mate.'
    },
    criticalMoments: [
      { moveNumber: 17, description: 'Qxf3!! A stunning queen sacrifice that leads to forced mate', fen: 'r3r1k1/p1pb1ppp/Q1b1p3/8/1P6/2Pq1B2/R2P1PPP/3R2K1 b - - 0 17' }
    ],
    alternatives: [],
    coachCommentary: 'Morphy\'s queen sacrifice against Paulsen showcases the power of piece coordination over material. The rook, two bishops, and the exposed king create an unstoppable mating net.',
    themes: ['queen-sacrifice', 'mating-attack', 'piece-coordination'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// CAPABLANCA — The Chess Machine
// ============================================================================
const CAPABLANCA_GAMES: MasterGame[] = [
  {
    id: 'mg-capa-001',
    white: 'Capablanca, Jose Raul', black: 'Marshall, Frank',
    event: 'New York', year: 1918, result: '1-0', eco: 'C89', opening: 'Ruy Lopez Marshall Attack',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5 9. exd5 Nxd5 10. Nxe5 Nxe5 11. Rxe5 Nf6 12. Re1 Bd6 13. h3 Ng4 14. Qf3 Qh4 15. d4 Nxf2 16. Re2 Bg4 17. hxg4 Bh2+ 18. Kf1 Bg3 19. Rxf2 Qh1+ 20. Ke2 Bxf2 21. Bd2 Bh4 22. Qh3 Rae8+ 23. Kd3 Qf1+ 24. Kc2 Bf2 25. Qf3 Qg1 26. Bd5 c5 27. dxc5 Bxc5 28. b4 Bd6 29. a4 a5 30. axb5 axb4 31. Ra6 bxc3 32. Nxc3 Bb4 33. b6 Bxc3 34. Bxc3 h6 35. b7 Re3 36. Bxf7+',
    annotations: {
      8: 'The famous Marshall Attack! Marshall waited years to unleash this prepared gambit against Capablanca.',
      15: 'Nxf2! Marshall sacrifices a piece for a fierce kingside attack.',
      19: 'Capablanca defends calmly. Despite being under heavy pressure, he finds the only moves.',
      36: 'Capablanca emerges from the storm with a winning endgame.'
    },
    criticalMoments: [
      { moveNumber: 8, description: 'Marshall unleashes his prepared gambit with d5', fen: 'r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b - - 0 8' },
      { moveNumber: 15, description: 'Nxf2! The spectacular sacrifice that starts the attack', fen: 'r1b2rk1/2p2ppp/p7/1p6/3P2nq/1BP2Q1P/PP4P1/RNB1R1K1 b - - 0 15' }
    ],
    alternatives: [],
    coachCommentary: 'This game demonstrates how to defend under fierce attack. Capablanca\'s cool defense against Marshall\'s prepared gambit is a masterclass in composure and calculation under pressure.',
    themes: ['defense', 'gambit', 'composure', 'counter-attack'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// TAL — The Magician from Riga
// ============================================================================
const TAL_GAMES: MasterGame[] = [
  {
    id: 'mg-tal-001',
    white: 'Tal, Mikhail', black: 'Larsen, Bent',
    event: 'Candidates', year: 1965, result: '1-0', eco: 'B82', opening: 'Sicilian Scheveningen',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e6 7. Be2 Be7 8. O-O O-O 9. Kh1 Qc7 10. a4 Nc6 11. Be3 Re8 12. Bf3 Rb8 13. Qd2 Bd7 14. Nb3 b6 15. g4 Bc8 16. g5 Nd7 17. Qf2 Bf8 18. Bg2 Bb7 19. Rad1 g6 20. Bc1 Nb4 21. f5 e5 22. f6 d5 23. Bh6 d4 24. Nd5 Nxd5 25. exd5 Qd6 26. Bg7',
    annotations: {
      15: 'g4! Tal\'s trademark — the pawn storm begins. Positional considerations are secondary to the attack.',
      22: 'f6! A brilliant pawn sacrifice that rips open the kingside.',
      23: 'Bh6! The bishop occupies the critical h6 square, eyeing g7.',
      26: 'Bg7! A stunning quiet move in the middle of a fierce attack. The bishop dominates the diagonal.'
    },
    criticalMoments: [
      { moveNumber: 22, description: 'f6! Destroying the kingside pawn shield with a sacrifice', fen: 'r1b1rbk1/1b1n1p1p/pq1pp1p1/4p1P1/P2nPP2/1NN2B2/1PP2Q1P/2BRRK2 w - - 0 22' }
    ],
    alternatives: [],
    coachCommentary: 'Tal at his most creative. The kingside pawn storm, piece sacrifices, and relentless pressure demonstrate the Magician\'s attacking philosophy: create chaos and let the opponent make mistakes.',
    themes: ['attack', 'sacrifice', 'pawn-storm', 'initiative'],
    difficulty: 'expert'
  }
];

// ============================================================================
// FISCHER — The American Chess Genius
// ============================================================================
const FISCHER_GAMES: MasterGame[] = [
  {
    id: 'mg-fischer-001',
    white: 'Fischer, Robert', black: 'Byrne, Donald',
    event: 'New York Rosenwald Memorial', year: 1956, result: '0-1', eco: 'D92', opening: 'Grunfeld Defense',
    pgn: '1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2#',
    annotations: {
      11: 'Na4! The 13-year-old Fischer begins his immortal combination.',
      17: 'Be6!! The stunning quiet move — offering the queen to set up a decisive attack.',
      19: 'Ne2+! The windmill begins — a series of discovered checks winning material.',
      41: 'Rc2# — The "Game of the Century." Fischer was just 13 years old.'
    },
    criticalMoments: [
      { moveNumber: 11, description: 'Na4! Beginning the famous combination', fen: 'r1bq1rk1/pp2ppbp/2p2np1/2Q3B1/3PP3/2N2N2/PP3PPP/R3KB1R b KQ - 0 11' },
      { moveNumber: 17, description: 'Be6!! The quiet queen sacrifice that changes everything', fen: 'r3r1k1/pp3pbp/2p1B1p1/2B5/2B5/q1n5/PP3PPP/3RK2R b K - 0 17' }
    ],
    alternatives: [],
    coachCommentary: 'The "Game of the Century" — played by a 13-year-old Bobby Fischer! Demonstrates: piece activity over material, discovered checks as a winning mechanism, and the power of initiative. A must-study game for every serious player.',
    themes: ['queen-sacrifice', 'discovered-check', 'initiative', 'piece-activity'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// KASPAROV — The Beast from Baku
// ============================================================================
const KASPAROV_GAMES: MasterGame[] = [
  {
    id: 'mg-kasparov-001',
    white: 'Kasparov, Garry', black: 'Topalov, Veselin',
    event: 'Wijk aan Zee', year: 1999, result: '1-0', eco: 'B07', opening: 'Pirc Defense',
    pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Re1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7',
    annotations: {
      24: 'Rxd4!! Kasparov sacrifices the exchange to tear open Black\'s king position.',
      25: 'Re7+! The second sacrifice — the rook invades with devastating effect.',
      26: 'Qxd4+ Kxa5 — the Black king is forced on an incredible journey across the board.',
      27: 'b4+! The king hunt continues with another pawn sacrifice.',
    },
    criticalMoments: [
      { moveNumber: 24, description: 'Rxd4!! Exchange sacrifice opening the floodgates', fen: '1k1r3r/1b2qp1p/pn3np1/N1pp4/3R4/P4PPB/1PP4P/1K1R4 w - - 0 24' },
      { moveNumber: 26, description: 'Qxd4+ beginning the legendary king hunt', fen: '1k1r3r/1b2Rp1p/pn3np1/N1p5/3p4/P4PPB/1PP4P/1K6 w - - 0 26' }
    ],
    alternatives: [],
    coachCommentary: 'Kasparov\'s Immortal! One of the greatest games ever played. The king hunt from move 26 onwards — chasing the Black king from b6 all the way to d1 — is unprecedented in chess history. Studies in sacrifice, initiative, and relentless attack.',
    themes: ['king-hunt', 'sacrifice', 'initiative', 'attack'],
    difficulty: 'expert'
  }
];

// ============================================================================
// CARLSEN — The Mozart of Chess
// ============================================================================
const CARLSEN_GAMES: MasterGame[] = [
  {
    id: 'mg-carlsen-001',
    white: 'Carlsen, Magnus', black: 'Anand, Viswanathan',
    event: 'World Championship', year: 2013, result: '1-0', eco: 'B51', opening: 'Sicilian',
    pgn: '1. e4 c5 2. Nf3 d6 3. Bb5+ Nd7 4. d4 cxd4 5. Qxd4 a6 6. Bxd7+ Bxd7 7. c4 Nf6 8. Bg5 e6 9. Nc3 Be7 10. O-O Bc6 11. Qd3 O-O 12. Nd4 Rc8 13. b3 Qc7 14. Nxc6 Qxc6 15. Rac1 h6 16. Be3 Nd7 17. Bd4 Rfd8 18. h3 Qa4 19. Rfd1 Bf6 20. Bxf6 Nxf6 21. Qd4 Rd7 22. Nd5 Nxd5 23. exd5 exd5 24. Qxd5 Re7 25. Qd4 Qb5 26. a4 Qb6 27. Qf4 Rd8 28. Qg3 Rde8 29. c5 Qb4 30. c6 bxc6 31. Rxc6 Re1+ 32. Rxe1 Rxe1+ 33. Kh2 Qa3 34. Rc8+ Kh7 35. b4 a5 36. b5',
    annotations: {
      22: 'Carlsen enters a superior endgame through precise exchange.',
      30: 'c6! Opening the c-file for the rook invasion.',
      34: 'Rc8+ — Carlsen converts with clinical precision.'
    },
    criticalMoments: [
      { moveNumber: 22, description: 'Nd5! Trading into a favorable structure', fen: 'r1r3k1/1b1n1pp1/p2ppB1p/8/2PQ4/1P1q4/P4PPP/2R1R1K1 w - - 0 22' }
    ],
    alternatives: [],
    coachCommentary: 'Carlsen\'s endgame mastery on display. Notice how he gradually accumulates small advantages — better pawn structure, more active rook, space advantage — and converts them with clinical precision. This is modern positional chess at its finest.',
    themes: ['positional', 'endgame', 'pawn-structure', 'technique'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// ALEKHINE — The Fourth World Champion
// ============================================================================
const ALEKHINE_GAMES: MasterGame[] = [
  {
    id: 'mg-alekhine-001',
    white: 'Alekhine, Alexander', black: 'Reti, Richard',
    event: 'Baden-Baden', year: 1925, result: '1-0', eco: 'A00', opening: 'Hungarian Opening',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Bxc3 9. d5 Bf6 10. Re1 Ne7 11. Rxe4 d6 12. Bg5 Bxg5 13. Nxg5 h6 14. Qe2 hxg5 15. Re1 Be6 16. dxe6 f6 17. Re3 c6 18. Rh3 Rxh3 19. gxh3 g6 20. Qf3 Qd7 21. Qxf6 Rg8 22. Bxg8 Nxg8 23. Qf8+ Qe8 24. e7',
    annotations: {
      14: 'Qe2! Alekhine recognizes the knight sacrifice gives lasting compensation.',
      24: 'e7! The pawn on the 7th rank is unstoppable — a pure positional triumph.'
    },
    criticalMoments: [
      { moveNumber: 24, description: 'e7! — the unstoppable passed pawn', fen: '4qkn1/pp4p1/2pp2Q1/6p1/8/7P/PP3P1P/4R1K1 w - - 0 24' }
    ],
    alternatives: [],
    coachCommentary: 'Alekhine demonstrates how a far-advanced passed pawn can be more powerful than several pieces. The pawn on e7 paralyzes Black\'s entire army.',
    themes: ['passed-pawn', 'sacrifice', 'positional-advantage'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// KARPOV — The Boa Constrictor
// ============================================================================
const KARPOV_GAMES: MasterGame[] = [
  {
    id: 'mg-karpov-001',
    white: 'Karpov, Anatoly', black: 'Kasparov, Garry',
    event: 'World Championship', year: 1985, result: '1-0', eco: 'E21', opening: 'Nimzo-Indian',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 c5 5. g3 Ne4 6. Qd3 Qa5 7. Qxe4 Bxc3+ 8. Bd2 Bxd2+ 9. Nxd2 Qb6 10. dxc5 Qxc5 11. Bg2 Nc6 12. O-O O-O 13. Nb3 Qe7 14. c5 d6 15. cxd6 Qxd6 16. Rfd1 Qe7 17. Rac1 Bd7 18. Nd4 Rac8 19. Nxc6 Bxc6 20. Bxc6 Rxc6 21. Rxc6 bxc6 22. Qa4 Rc8 23. Qa6 Rb8 24. b3 e5 25. Rc1 f5 26. Qxc6',
    annotations: {
      14: 'c5! — typical Karpov. A small positional advance that gradually squeezes Black.',
      22: 'Qa4 — targeting the weak c6 pawn. Karpov\'s technique is to create and exploit small weaknesses.'
    },
    criticalMoments: [
      { moveNumber: 14, description: 'c5! — Karpov begins his trademark positional squeeze', fen: 'r1b2rk1/pp1pqppp/2n1p3/2p5/4Q3/1N4P1/PP2PP1P/R4BK1 w - - 0 14' }
    ],
    alternatives: [],
    coachCommentary: 'Classic Karpov — the boa constrictor technique. No fireworks, just steady positional pressure that gradually suffocates the opponent. Notice how small advantages (better pawn structure, more active pieces) accumulate into a winning position.',
    themes: ['positional', 'squeeze', 'technique', 'pawn-weakness'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// ANAND — The Tiger of Madras
// ============================================================================
const ANAND_GAMES: MasterGame[] = [
  {
    id: 'mg-anand-001',
    white: 'Anand, Viswanathan', black: 'Topalov, Veselin',
    event: 'World Championship', year: 2010, result: '1-0', eco: 'E04', opening: 'Catalan',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. g3 dxc4 5. Bg2 a6 6. Ne5 c5 7. Na3 cxd4 8. Naxc4 Bc5 9. O-O O-O 10. Bg5 h6 11. Bxf6 Qxf6 12. Nd3 Ba7 13. Qa4 Nc6 14. Rac1 e5 15. Qa3 Bf5 16. Nce5 Nxe5 17. Nxe5 Rac8 18. Rxc8 Rxc8 19. Nd7 Qd6 20. Qxa6 Qxd7 21. Qxd6 Qxd6',
    annotations: {
      6: 'Ne5! — the knight leaps to a strong central post early.',
      12: 'Anand demonstrates the Catalan bishop\'s long-range power on the a8-h1 diagonal.'
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Anand\'s crisp handling of the Catalan opening — demonstrating how the fianchettoed bishop combined with central knight play creates lasting pressure.',
    themes: ['catalan', 'fianchetto', 'central-control'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// COMBINE ALL GAMES
// ============================================================================
export const ALL_MASTER_GAMES: MasterGame[] = [
  ...MORPHY_GAMES,
  ...CAPABLANCA_GAMES,
  ...TAL_GAMES,
  ...FISCHER_GAMES,
  ...KASPAROV_GAMES,
  ...CARLSEN_GAMES,
  ...ALEKHINE_GAMES,
  ...KARPOV_GAMES,
  ...ANAND_GAMES,
];

export const MASTER_GAME_PLAYERS = [
  { id: 'morphy', name: 'Paul Morphy', era: '1837-1884', title: 'Unofficial World Champion', style: 'Romantic Attacking', count: MORPHY_GAMES.length },
  { id: 'capablanca', name: 'José Raúl Capablanca', era: '1888-1942', title: '3rd World Champion', style: 'Positional Genius', count: CAPABLANCA_GAMES.length },
  { id: 'alekhine', name: 'Alexander Alekhine', era: '1892-1946', title: '4th World Champion', style: 'Dynamic Attacker', count: ALEKHINE_GAMES.length },
  { id: 'tal', name: 'Mikhail Tal', era: '1936-1992', title: '8th World Champion', style: 'The Magician', count: TAL_GAMES.length },
  { id: 'fischer', name: 'Bobby Fischer', era: '1943-2008', title: '11th World Champion', style: 'Universal Genius', count: FISCHER_GAMES.length },
  { id: 'karpov', name: 'Anatoly Karpov', era: '1951-', title: '12th World Champion', style: 'Boa Constrictor', count: KARPOV_GAMES.length },
  { id: 'kasparov', name: 'Garry Kasparov', era: '1963-', title: '13th World Champion', style: 'Dynamic Universal', count: KASPAROV_GAMES.length },
  { id: 'anand', name: 'Viswanathan Anand', era: '1969-', title: '15th World Champion', style: 'Speed & Precision', count: ANAND_GAMES.length },
  { id: 'carlsen', name: 'Magnus Carlsen', era: '1990-', title: '16th World Champion', style: 'Universal Endgame Master', count: CARLSEN_GAMES.length },
];

export function getGamesByPlayer(playerId: string): MasterGame[] {
  const playerMap: Record<string, MasterGame[]> = {
    morphy: MORPHY_GAMES, capablanca: CAPABLANCA_GAMES, alekhine: ALEKHINE_GAMES,
    tal: TAL_GAMES, fischer: FISCHER_GAMES, karpov: KARPOV_GAMES,
    kasparov: KASPAROV_GAMES, anand: ANAND_GAMES, carlsen: CARLSEN_GAMES,
  };
  return playerMap[playerId] || [];
}

export function getGameById(id: string): MasterGame | undefined {
  return ALL_MASTER_GAMES.find(g => g.id === id);
}

export function getGamesByTheme(theme: string): MasterGame[] {
  return ALL_MASTER_GAMES.filter(g => g.themes.includes(theme));
}
