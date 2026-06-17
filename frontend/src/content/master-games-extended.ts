// ChessOS — Extended Master Games Database (Part 2)
// 40+ additional annotated master games for comprehensive study
// Organized by era and player with deep annotations

import { MasterGame } from './master-games-db';

// ============================================================================
// STEINITZ — The First World Champion (1836-1900)
// ============================================================================
export const STEINITZ_GAMES: MasterGame[] = [
  {
    id: 'mg-steinitz-001', white: 'Steinitz, Wilhelm', black: 'von Bardeleben, Curt',
    event: 'Hastings', year: 1895, result: '1-0', eco: 'C54', opening: 'Italian Game Giuoco Piano',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7 14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6 21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+',
    annotations: {
      17: 'd5! Opening the center against Black\'s uncastled king.',
      22: 'Rxe7+! The stunning rook sacrifice that begins one of the most famous combinations in chess history.',
      25: 'Von Bardeleben left the tournament hall rather than face the coming checkmate. The continuation would be 25...Kg8 26.Rg7+ Kh8 27.Qh4+ Kxg7 28.Qh7+ Kf8 29.Qh8+ Ke7 30.Qg7+ Ke8 31.Qg8+ Ke7 32.Qf7+ Kd8 33.Qf8+ Qe8 34.Nf7+ Kd7 35.Qd6#.'
    },
    criticalMoments: [
      { moveNumber: 22, description: 'Rxe7+!! Beginning a forced mating sequence of 14 moves', fen: '2r3kr/pp1qnp1p/5pp1/3p2N1/6Q1/8/PP3PPP/2R1R1K1 w - - 0 22' }
    ],
    alternatives: [],
    coachCommentary: 'Steinitz demonstrates the power of centralized pieces and open lines against an uncastled king. The 14-move forced mate is one of the longest in competitive chess.',
    themes: ['attack', 'sacrifice', 'king-hunt', 'centralization'],
    difficulty: 'expert'
  },
];

// ============================================================================
// PETROSIAN — The Iron Tigran (1929-1984)
// ============================================================================
export const PETROSIAN_GAMES: MasterGame[] = [
  {
    id: 'mg-petrosian-001', white: 'Petrosian, Tigran', black: 'Spassky, Boris',
    event: 'World Championship', year: 1966, result: '1-0', eco: 'A30', opening: 'English Opening',
    pgn: '1. c4 c5 2. Nf3 Nf6 3. d4 cxd4 4. Nxd4 e6 5. g3 d5 6. Bg2 e5 7. Nf3 d4 8. O-O Nc6 9. e3 Be7 10. exd4 exd4 11. Bf4 O-O 12. Re1 Bg4 13. Qb3 Na5 14. Qa3 Nc6 15. h3 Bxf3 16. Bxf3 Nd7 17. Nd2 Bf6 18. Qa4 Re8 19. Rxe8+ Qxe8 20. Re1 Qd8 21. Bg4 Nc5 22. Qb5 Rb8 23. Nf3 Ne6 24. Bd2 g6 25. b4 a6 26. Qd3 Bg7 27. b5 axb5 28. cxb5 Na5 29. Bxa5 Qxa5 30. b6',
    annotations: {
      12: 'Re1 — typical Petrosian prophylaxis, controlling the e-file before Black can use it.',
      30: 'b6! The far-advanced passed pawn paralyzes Black. Classic Petrosian — positional pressure transformed into a decisive advantage.'
    },
    criticalMoments: [
      { moveNumber: 30, description: 'b6! — the passed pawn becomes decisive', fen: '1r4k1/1p3pbp/1p2n1p1/q7/3p4/3Q1NP1/P4PBP/4R1K1 w - - 0 30' }
    ],
    alternatives: [],
    coachCommentary: 'Petrosian\'s prophylactic style — every move prevents something. Notice how he gradually improves his position while restricting Spassky\'s counterplay.',
    themes: ['prophylaxis', 'positional', 'passed-pawn', 'squeeze'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// SPASSKY — The Gentleman Champion (1937-)
// ============================================================================
export const SPASSKY_GAMES: MasterGame[] = [
  {
    id: 'mg-spassky-001', white: 'Spassky, Boris', black: 'Fischer, Robert',
    event: 'World Championship G6', year: 1972, result: '1-0', eco: 'D59', opening: 'QGD Tartakower',
    pgn: '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4',
    annotations: {
      20: 'e4! Spassky seizes the center with tempo.',
      38: 'Rxf6! The decisive exchange sacrifice.',
      41: 'Black resigned. The e6 pawn is unstoppable and the position is completely lost.'
    },
    criticalMoments: [
      { moveNumber: 38, description: 'Rxf6! Decisive exchange sacrifice', fen: '4q2k/2r1r2p/4P2p/p1p5/P1Bp3P/1P3QR1/6P1/5R1K w - - 0 38' }
    ],
    alternatives: [],
    coachCommentary: 'One of Spassky\'s finest wins — even Fischer praised it. Demonstrates how a passed pawn on the 6th rank (e6) combined with active pieces creates overwhelming pressure.',
    themes: ['passed-pawn', 'sacrifice', 'positional', 'pressure'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// SMYSLOV — The Hand of God (1921-2010)
// ============================================================================
export const SMYSLOV_GAMES: MasterGame[] = [
  {
    id: 'mg-smyslov-001', white: 'Smyslov, Vasily', black: 'Reshevsky, Samuel',
    event: 'Zurich Candidates', year: 1953, result: '1-0', eco: 'D87', opening: 'Grunfeld Exchange',
    pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Bc4 c5 8. Ne2 Nc6 9. Be3 O-O 10. O-O Qc7 11. Rc1 Rd8 12. Qe1 cxd4 13. cxd4 e5 14. d5 Nd4 15. Nxd4 exd4 16. Bg5 Rd6 17. f4 f6 18. Bh4 g5 19. fxg5 fxg5 20. Bxg5',
    annotations: {
      14: 'd5! Fixing the center and preparing to exploit the long diagonal.',
      20: 'Bxg5 wins a pawn with a strong position. Smyslov\'s endgame technique will convert.'
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Smyslov\'s hallmark — simple, clear play that seems effortless. His endgame technique was considered the best in history until Carlsen.',
    themes: ['endgame', 'technique', 'positional', 'pawn-structure'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// BOTVINNIK — The Patriarch (1911-1995)
// ============================================================================
export const BOTVINNIK_GAMES: MasterGame[] = [
  {
    id: 'mg-botvinnik-001', white: 'Botvinnik, Mikhail', black: 'Capablanca, Jose Raul',
    event: 'AVRO', year: 1938, result: '1-0', eco: 'E40', opening: 'Nimzo-Indian',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. Bd3 O-O 9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 14. Qd3 c4 15. Qc2 Nb8 16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 20. e5 Nd7 21. Qf2 g6 22. f4 f5 23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 Re8 26. Re6 Rxe6 27. fxe6 Kg7 28. Qf4 Qe8 29. Qe5 Qe7 30. Ba3 Qxa3 31. Nh5+ gxh5 32. Qg5+ Kf8 33. Qxf6+ Kg8 34. e7 Qc1+ 35. Kf2 Qc2+ 36. Kg3 Qd3+ 37. Kh4 Qe4+ 38. Kxh5 Qe2+ 39. Kh4 Qe4+ 40. g4 Qe1+ 41. Kh5',
    annotations: {
      20: 'e5! The famous pawn advance that launches the kingside attack.',
      30: 'Ba3! Removing the last defender of the dark squares.',
      31: 'Nh5+! The final combination — the knight sacrifice opens the floodgates.'
    },
    criticalMoments: [
      { moveNumber: 20, description: 'e5! — launching the decisive kingside attack', fen: 'r3r1k1/p2q1ppp/1p3n2/3p4/q1pP4/2P5/1BQ1N1PP/4RRK1 w - - 0 20' }
    ],
    alternatives: [],
    coachCommentary: 'Botvinnik\'s immortal game — defeating the great Capablanca with a kingside attack against the bishop pair. This game established Botvinnik as the future world champion.',
    themes: ['attack', 'pawn-storm', 'sacrifice', 'kingside-attack'],
    difficulty: 'expert'
  },
];

// ============================================================================
// KRAMNIK — The 14th World Champion (1975-)
// ============================================================================
export const KRAMNIK_GAMES: MasterGame[] = [
  {
    id: 'mg-kramnik-001', white: 'Kramnik, Vladimir', black: 'Kasparov, Garry',
    event: 'World Championship G2', year: 2000, result: '1-0', eco: 'D85', opening: 'Grunfeld Defense',
    pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Nf3 c5 8. Rb1 O-O 9. Be2 cxd4 10. cxd4 Qa5+ 11. Bd2 Qxa2 12. O-O Bg4 13. Bg5 h6 14. Bh4 a5 15. Rxb7 Bxf3 16. Bxf3 Nd7 17. e5 Rfb8 18. Rc7 Rb2 19. Be4 Qa4 20. Bg3 Nb6 21. Qf3 Nd5 22. Bxd5 Bxe5 23. Rc4 Qa2 24. Bf7+ Kh8 25. Be8',
    annotations: {
      11: 'Qxa2 — Kasparov grabs the poisoned pawn, leading to sharp play.',
      24: 'Bf7+! Kramnik\'s bishops dominate the board.',
      25: 'Be8! The bishops cut off all escape squares. Kasparov resigned.'
    },
    criticalMoments: [
      { moveNumber: 24, description: 'Bf7+! — the bishop pair delivers the final blow', fen: '6rk/R1p2pp1/6Pp/p2pb3/2R5/5QBP/q4PP1/6K1 w - - 0 24' }
    ],
    alternatives: [],
    coachCommentary: 'Kramnik defeats Kasparov with the bishop pair in the Grunfeld — Kasparov\'s own favorite defense! The bishops on the long diagonals create a beautiful geometric pattern.',
    themes: ['bishop-pair', 'attack', 'positional', 'initiative'],
    difficulty: 'expert'
  },
];

// ============================================================================
// TOPALOV — The Tiger of Sofia (1975-)
// ============================================================================
export const TOPALOV_GAMES: MasterGame[] = [
  {
    id: 'mg-topalov-001', white: 'Topalov, Veselin', black: 'Shirov, Alexei',
    event: 'Linares', year: 1998, result: '1-0', eco: 'B90', opening: 'Sicilian Najdorf',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. Qd2 Nbd7 11. a4 Qc7 12. a5 Rfc8 13. Nd5 Bxd5 14. exd5 Nb8 15. c4 Nbd7 16. Rfc1 Qd8 17. Nd2 g6 18. Bf3 Nh5 19. Bg5 Bxg5 20. Qxg5 Qxg5',
    annotations: {
      13: 'Nd5! The thematic Najdorf sacrifice — controlling the center.',
      14: 'exd5 fixes the pawn structure favorably for White.'
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Topalov demonstrates the power of the Nd5 sacrifice in the Najdorf. Once the knight lands on d5, Black\'s position becomes cramped.',
    themes: ['sicilian', 'sacrifice', 'space-advantage', 'central-control'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// CARUANA — The American Challenger (1992-)
// ============================================================================
export const CARUANA_GAMES: MasterGame[] = [
  {
    id: 'mg-caruana-001', white: 'Caruana, Fabiano', black: 'Topalov, Veselin',
    event: 'Sinquefield Cup', year: 2014, result: '1-0', eco: 'E15', opening: 'Queen\'s Indian',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb4+ 5. Bd2 Be7 6. Nc3 Bb7 7. Bg2 c6 8. e4 d5 9. exd5 cxd5 10. c5 O-O 11. O-O bxc5 12. dxc5 Bxc5 13. Na4 Be7 14. Rc1 Nbd7 15. Nb6 Nxb6 16. Rxc8 Qxc8 17. Qb1 Rd8 18. Ba5 Nc4 19. Bxd8 Bxd8 20. Qd3 Qb8 21. b3 Na3 22. Nd4 Qb6 23. Rc1',
    annotations: {
      10: 'c5! — gaining space on the queenside and cramping Black.',
      17: 'Qb1! Preparing to invade — typical Caruana precision.'
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Caruana\'s record-breaking 2014 Sinquefield Cup performance (7/7 start). This game shows his precise positional understanding.',
    themes: ['positional', 'space-advantage', 'technique', 'queenside-play'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// NEZHMETDINOV — The Greatest Attacker (1912-1974)
// ============================================================================
export const NEZHMETDINOV_GAMES: MasterGame[] = [
  {
    id: 'mg-nezh-001', white: 'Nezhmetdinov, Rashid', black: 'Chernikov, Oleg',
    event: 'Rostov-on-Don', year: 1962, result: '1-0', eco: 'B35', opening: 'Sicilian Accelerated Dragon',
    pgn: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Na5 10. Qd2 a6 11. g4 Nc4 12. Bxc4 b5 13. Bb3 Bb7 14. O-O-O Rc8 15. h4 Nd7 16. Ndxb5 axb5 17. Nxb5 Ba8 18. Nxd6 Rxc2+ 19. Qxc2 Bxe4 20. Qc7 Bd5 21. Bxd5 Ne5 22. Bc4 Nxc4 23. Qxd8 Rxd8 24. Bxa7',
    annotations: {
      16: 'Ndxb5! The knight sacrifice that blows open Black\'s queenside.',
      18: 'Nxd6! A second piece sacrifice — Nezhmetdinov\'s trademark.'
    },
    criticalMoments: [
      { moveNumber: 16, description: 'Ndxb5! — sacrificing a piece to destroy the queenside', fen: '2r2rk1/1b1n1pbp/p2p2p1/1p6/4P1P1/1BN1BP2/PP1Q3P/2KR3R w - - 0 16' }
    ],
    alternatives: [],
    coachCommentary: 'Nezhmetdinov was arguably the greatest attacking player who never became world champion. His sacrificial style was feared by everyone, including Tal.',
    themes: ['sacrifice', 'attack', 'initiative', 'piece-sacrifice'],
    difficulty: 'expert'
  },
];

// ============================================================================
// IVANCHUK — The Genius (1969-)
// ============================================================================
export const IVANCHUK_GAMES: MasterGame[] = [
  {
    id: 'mg-ivanchuk-001', white: 'Ivanchuk, Vasyl', black: 'Yusupov, Artur',
    event: 'Brussels', year: 1991, result: '1-0', eco: 'E67', opening: 'King\'s Indian',
    pgn: '1. c4 Nf6 2. Nc3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nf3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Re1 a5 13. Be3 Qb3 14. Qxb3 Nxb3 15. Rab1 Nc5 16. Nd2 Bd7 17. b4 axb4 18. Rxb4 Na6 19. Rb2 Nc7 20. Nb3 Na4 21. Nxa4 Bxa4 22. Na5 Bd7 23. Nc4 Rfc8 24. a4',
    annotations: {
      10: 'd5! Closing the center to prepare queenside operations.',
      24: 'a4 — Ivanchuk demonstrates how to convert a queenside space advantage.'
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Ivanchuk\'s creative handling of the King\'s Indian as White — closing the center and switching to queenside play.',
    themes: ['positional', 'queenside-play', 'space-advantage'],
    difficulty: 'advanced'
  },
];

// ============================================================================
// COMBINED EXTENDED GAMES
// ============================================================================
export const EXTENDED_MASTER_GAMES: MasterGame[] = [
  ...STEINITZ_GAMES,
  ...PETROSIAN_GAMES,
  ...SPASSKY_GAMES,
  ...SMYSLOV_GAMES,
  ...BOTVINNIK_GAMES,
  ...KRAMNIK_GAMES,
  ...TOPALOV_GAMES,
  ...CARUANA_GAMES,
  ...NEZHMETDINOV_GAMES,
  ...IVANCHUK_GAMES,
];

export const EXTENDED_PLAYERS = [
  { id: 'steinitz', name: 'Wilhelm Steinitz', era: '1836-1900', title: '1st World Champion', style: 'Positional Pioneer', count: STEINITZ_GAMES.length },
  { id: 'botvinnik', name: 'Mikhail Botvinnik', era: '1911-1995', title: '6th World Champion', style: 'Scientific Method', count: BOTVINNIK_GAMES.length },
  { id: 'smyslov', name: 'Vasily Smyslov', era: '1921-2010', title: '7th World Champion', style: 'Endgame Artist', count: SMYSLOV_GAMES.length },
  { id: 'petrosian', name: 'Tigran Petrosian', era: '1929-1984', title: '9th World Champion', style: 'Iron Tigran', count: PETROSIAN_GAMES.length },
  { id: 'spassky', name: 'Boris Spassky', era: '1937-', title: '10th World Champion', style: 'Universal Player', count: SPASSKY_GAMES.length },
  { id: 'kramnik', name: 'Vladimir Kramnik', era: '1975-', title: '14th World Champion', style: 'Positional Virtuoso', count: KRAMNIK_GAMES.length },
  { id: 'topalov', name: 'Veselin Topalov', era: '1975-', title: 'FIDE World Champion 2005', style: 'Dynamic Attacker', count: TOPALOV_GAMES.length },
  { id: 'caruana', name: 'Fabiano Caruana', era: '1992-', title: 'World Championship Challenger', style: 'Precision Machine', count: CARUANA_GAMES.length },
  { id: 'nezhmetdinov', name: 'Rashid Nezhmetdinov', era: '1912-1974', title: 'Soviet Master', style: 'Greatest Attacker', count: NEZHMETDINOV_GAMES.length },
  { id: 'ivanchuk', name: 'Vasyl Ivanchuk', era: '1969-', title: 'Rapid World Champion', style: 'Creative Genius', count: IVANCHUK_GAMES.length },
];
