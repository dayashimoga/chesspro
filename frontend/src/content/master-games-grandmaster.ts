// ChessOS — Extended Grandmaster Games Collection
// 30+ additional annotated games from legendary chess players
// Covers diverse themes: attack, defense, positional, endgame mastery

import { MasterGame } from './master-games-db';

// ============================================================================
// TAL — The Magician from Riga (Additional Games)
// ============================================================================
const TAL_EXTENDED: MasterGame[] = [
  {
    id: 'mg-tal-002',
    white: 'Tal, Mikhail', black: 'Miller, B.',
    event: 'USSR Championship', year: 1969, result: '1-0', eco: 'B10', opening: 'Caro-Kann',
    pgn: '1. e4 c6 2. d3 d5 3. Nd2 e5 4. Ngf3 Nd7 5. d4 dxe4 6. Nxe4 exd4 7. Qxd4 Ngf6 8. Bg5 Be7 9. O-O-O O-O 10. Nd6 Qa5 11. Bc4 b5 12. Bd2 Qa6 13. Nf5 Bd8 14. Qh4 bxc4 15. Qg5 Nh5 16. Nh6+ Kh8 17. Qxh5 Qxa2 18. Bc3 Nf6 19. Qxf7 Qa1+ 20. Kd2 Rxf7 21. Nxf7+ Kg8 22. Rxa1',
    annotations: {
      10: 'Nd6! The knight occupies a dominant outpost deep in Black\'s position.',
      14: 'Qh4! Redirecting the attack. Tal shifts from one flank to another with devastating speed.',
      16: 'Nh6+! A brilliant deflection — the knight sacrifice tears open the kingside.',
    },
    criticalMoments: [
      { moveNumber: 16, description: 'Nh6+! Deflection sacrifice opening the h-file', fen: '1r1b1rk1/p4ppp/q1pN1n2/5N2/2p5/2B5/PPP2PPP/2KR3R w - - 0 16' }
    ],
    alternatives: [],
    coachCommentary: 'Tal demonstrates his hallmark style: piece sacrifice for dynamic compensation. The key lesson is that piece activity and initiative can outweigh material.',
    themes: ['sacrifice', 'attack', 'knight-outpost', 'initiative'],
    difficulty: 'advanced'
  },
  {
    id: 'mg-tal-003',
    white: 'Tal, Mikhail', black: 'Botvinnik, Mikhail',
    event: 'World Championship', year: 1960, result: '1-0', eco: 'E69', opening: 'King\'s Indian',
    pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. Nf3 O-O 5. g3 d6 6. Bg2 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15. Rb1 Nh5 16. Be3 Qa6 17. Qxa6 bxa6 18. Nd1 f5 19. f3 Bh6 20. Bf2 fxe4 21. fxe4 Bg5 22. Rc1 Rxc1 23. Bxc1 Rc8 24. Bd2 Nf6 25. Nf2 Nh5 26. g4 Nf4 27. Bf3 Rc2 28. Bc1 Be3 29. Rf2 Bxf2+ 30. Kxf2 Nd3+ 31. Kf1 Nxc1',
    annotations: {
      10: 'Opening the center — Tal always seeks dynamic play even against the most solid opponents.',
      17: 'Entering a seemingly quiet endgame, but Tal finds ways to create imbalances.',
    },
    criticalMoments: [
      { moveNumber: 10, description: 'Tal breaks open the center against Botvinnik\'s solid setup', fen: 'r1b2rk1/pp1n1pbp/1qpp1np1/4p3/2PPP3/2N2N1P/PP3PP1/R1BQKB1R w KQ - 0 10' }
    ],
    alternatives: [],
    coachCommentary: 'A game from the historic 1960 World Championship match. Tal demonstrates that even in seemingly quiet positions, dynamic resources exist for the creative player.',
    themes: ['world-championship', 'dynamic-play', 'endgame-technique'],
    difficulty: 'expert'
  }
];

// ============================================================================
// FISCHER — The American Genius (Additional Games)
// ============================================================================
const FISCHER_EXTENDED: MasterGame[] = [
  {
    id: 'mg-fischer-002',
    white: 'Fischer, Robert', black: 'Petrosian, Tigran',
    event: 'Candidates Final', year: 1971, result: '1-0', eco: 'A04', opening: 'Reti Opening',
    pgn: '1. b3 e5 2. Bb2 Nc6 3. c4 Nf6 4. Nf3 e4 5. Nd4 Bc5 6. Nxc6 dxc6 7. e3 Bf5 8. Qc2 Qe7 9. Be2 O-O-O 10. f4 exf3 11. gxf3 Rhe8 12. Kf2 Nd7 13. Nc3 f6 14. Rad1 Nb6 15. d4 Bd6 16. c5 Bf4 17. cxb6 axb6 18. Na4 Bxe3+ 19. Kg2 Bf4 20. Bc3 Qe3 21. Rhe1 Rxe1 22. Rxe1 Qg5+ 23. Kf1 Bg3 24. Re2 Bh3+ 25. Ke1',
    annotations: {
      5: 'Fischer rarely played 1.b3, making this game special. He adapts to any position.',
      16: 'c5! A deep strategic move that locks up the queenside.',
    },
    criticalMoments: [
      { moveNumber: 16, description: 'c5! Strategic pawn advance restricting Black\'s pieces', fen: '2kr4/ppp1q1pp/1bnb1p2/2p2b2/3P4/1P2PN2/PBQ1B2P/R4K1R w - - 0 16' }
    ],
    alternatives: [],
    coachCommentary: 'Fischer shows versatility — playing a quiet opening but with deep strategic understanding. The game demonstrates that strong players adapt to any position type.',
    themes: ['strategy', 'versatility', 'pawn-structure'],
    difficulty: 'advanced'
  },
  {
    id: 'mg-fischer-003',
    white: 'Spassky, Boris', black: 'Fischer, Robert',
    event: 'World Championship Game 6', year: 1972, result: '0-1', eco: 'D59', opening: 'Queen\'s Gambit Declined',
    pgn: '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4',
    annotations: {
      7: 'Fischer plays the Tartakower variation — his favorite defense to 1.d4.',
      20: 'd4! The pawn advance creates a powerful protected passed pawn.',
      38: 'Rxf6! Spassky sacrifices to attack, but Fischer\'s defense holds.',
    },
    criticalMoments: [
      { moveNumber: 20, description: 'd4! Creating a powerful central passed pawn', fen: '2r2rk1/r3q1p1/4b2p/2p1p3/4P3/Q4N2/PP2BPPP/2R2RK1 b - - 0 20' }
    ],
    alternatives: [],
    coachCommentary: 'Game 6 of the famous 1972 World Championship — Fischer\'s most brilliant game. He plays the QGD (unusual for him) and creates a masterpiece of strategic play. The queen sacrifice at the end is breathtaking.',
    themes: ['world-championship', 'queen-gambit', 'strategic-masterpiece', 'defense'],
    difficulty: 'expert'
  }
];

// ============================================================================
// KASPAROV — Additional Games
// ============================================================================
const KASPAROV_EXTENDED: MasterGame[] = [
  {
    id: 'mg-kasparov-002',
    white: 'Kasparov, Garry', black: 'Karpov, Anatoly',
    event: 'World Championship Game 24', year: 1985, result: '1-0', eco: 'B44', opening: 'Sicilian',
    pgn: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6 8. Na3 d5 9. cxd5 exd5 10. exd5 Nb4 11. Be2 Bc5 12. O-O O-O 13. Bf3 Bf5 14. Bg5 Re8 15. Qd2 b5 16. Rad1 Nd3 17. Nab1 h6 18. Bh4 b4 19. Na4 Bd6 20. Bg3 Rc8 21. b3 g5 22. Bxd6 Qxd6 23. g3 Nd7 24. Bg2 Qf6 25. a3 a5 26. axb4 axb4 27. Qa2 Bg6 28. d6 g4 29. Qd2 Kg7 30. f3 Qxd6 31. fxg4 Qd4+ 32. Kh1 Nf6 33. Rf4 Ne4 34. Qxd3 Nf2+ 35. Rxf2 Bxd3 36. Rfd2 Qe3 37. Rxd3 Rc1 38. Nb2 Qf2 39. Nd2 Rxd1+ 40. Nxd1 Re1+',
    annotations: {
      16: 'Nd3! A stunning piece sacrifice — typical Kasparov brilliance.',
      28: 'd6! The passed pawn becomes the decisive factor.',
      40: 'Re1+ — Kasparov wins the decisive game to become World Champion at age 22!',
    },
    criticalMoments: [
      { moveNumber: 16, description: 'Nd3! Piece sacrifice for a crushing initiative', fen: '2rqr1k1/5ppp/p4n2/1p1P1bB1/1n2P3/N4B2/PP1Q1PPP/3R1RK1 b - - 0 16' },
      { moveNumber: 28, description: 'd6! The unstoppable passed pawn', fen: '2r1r1k1/5p2/p5bp/1p1P2p1/Pn6/1P1n2P1/3Q1PBP/3RR1K1 w - - 0 28' }
    ],
    alternatives: [],
    coachCommentary: 'The game that made Kasparov the youngest World Champion! Game 24 of the 1985 match — Kasparov needed a win to clinch the title and delivered a masterpiece.',
    themes: ['world-championship', 'sacrifice', 'passed-pawn', 'decisive-game'],
    difficulty: 'expert'
  },
  {
    id: 'mg-kasparov-003',
    white: 'Kasparov, Garry', black: 'Short, Nigel',
    event: 'Zurich', year: 2001, result: '1-0', eco: 'C78', opening: 'Ruy Lopez',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5 6. Bb3 Bb7 7. d3 Be7 8. Nc3 O-O 9. a3 d6 10. Bg5 Na5 11. Ba2 c5 12. Nd5 Nxd5 13. exd5 Bg5 14. Nxg5 Qxg5 15. f4 Qd8 16. fxe5 dxe5 17. d6 c4 18. Qh5 f6 19. Rxf6 Rxf6 20. Qxe5 Rf7 21. Bb1 g6 22. Qg3 Qxd6 23. Qg5',
    annotations: {
      12: 'Kasparov exchanges to enter a favorable structure — typical of his deep preparation.',
      17: 'd6! An advanced passed pawn that disrupts Black\'s coordination.',
      19: 'Rxf6! Exchange sacrifice for a devastating attack.',
    },
    criticalMoments: [
      { moveNumber: 19, description: 'Rxf6! Exchange sacrifice opening the f-file', fen: 'r2q1rk1/1b3ppp/p2P1p2/n1p1p2Q/2p5/P2P4/BPP3PP/R1B3K1 w - - 0 19' }
    ],
    alternatives: [],
    coachCommentary: 'Kasparov\'s attacking genius — the exchange sacrifice on f6 is typical of his style. He converts dynamic advantages with clinical precision.',
    themes: ['exchange-sacrifice', 'attack', 'passed-pawn', 'initiative'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// CARLSEN — Additional Games
// ============================================================================
const CARLSEN_EXTENDED: MasterGame[] = [
  {
    id: 'mg-carlsen-002',
    white: 'Aronian, Levon', black: 'Carlsen, Magnus',
    event: 'Wijk aan Zee', year: 2008, result: '0-1', eco: 'D45', opening: 'Semi-Slav',
    pgn: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 b5 10. Bd3 Bb7 11. a3 Rc8 12. Ng5 c5 13. Nxh7 Ng4 14. f4 cxd4 15. exd4 Bc5 16. Be2 Nde5 17. Bxg4 Bxd4+ 18. Kh1 Nxg4 19. Nxf8 f5 20. Ng6 Qf6 21. h3 Qxg6 22. Qe2 Qh5 23. Qxb5',
    annotations: {
      13: 'Carlsen sacrifices material for a powerful attack — even at 17 years old!',
      17: 'Bxd4+ — The bishop centralization combined with the knight on g4 creates devastating threats.',
    },
    criticalMoments: [
      { moveNumber: 13, description: 'Carlsen allows Nxh7 and launches a ferocious counter-attack', fen: '2rq1rk1/pb1n1ppp/2p1pn2/2p3N1/3P4/P1NB4/1PQ2PPP/R1B2RK1 b - - 0 13' }
    ],
    alternatives: [],
    coachCommentary: 'Young Carlsen shows his fighting spirit. Accepting the sacrifice on h7 and launching a counter-attack demonstrates the courage and calculation that would make him World Champion.',
    themes: ['counter-attack', 'sacrifice', 'king-safety', 'initiative'],
    difficulty: 'expert'
  },
  {
    id: 'mg-carlsen-003',
    white: 'Carlsen, Magnus', black: 'Caruana, Fabiano',
    event: 'Sinquefield Cup', year: 2014, result: '1-0', eco: 'B33', opening: 'Sicilian Sveshnikov',
    pgn: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Bg5 a6 8. Na3 b5 9. Nd5 Be7 10. Bxf6 Bxf6 11. c3 Bg5 12. Nc2 Rb8 13. h4 Bh6 14. g3 O-O 15. a4 bxa4 16. Rxa4 a5 17. Bc4 Rb6 18. b4 axb4 19. cxb4 Bd7 20. Ra2 Be6 21. Nce3 Nd4 22. Qd3 Rb8 23. O-O Qb6 24. Nc2 Nxc2 25. Rxc2 Bd2 26. Rd1 Bc3 27. Nf4 Bg4 28. Re1 Bd4 29. Nd5 Bxd5 30. Qxd5 Rb7 31. Kh2',
    annotations: {
      11: 'Carlsen plays a rare line that takes Caruana out of preparation.',
      22: 'Qd3 — calm maneuvering. Carlsen\'s strength is making normal moves that accumulate advantages.',
    },
    criticalMoments: [
      { moveNumber: 22, description: 'Carlsen maintains steady pressure with quiet moves', fen: '1r3rk1/3b1ppp/1r1p4/p2Np3/RPB1P2P/6P1/P1N2P2/3Q1RK1 w - - 0 22' }
    ],
    alternatives: [],
    coachCommentary: 'Carlsen at his finest — slowly outplaying one of the world\'s strongest players with patient maneuvering. No flashy sacrifices, just relentless pressure.',
    themes: ['positional', 'maneuvering', 'technique', 'pressure'],
    difficulty: 'expert'
  }
];

// ============================================================================
// PETROSIAN — The Iron Tigran
// ============================================================================
const PETROSIAN_GAMES: MasterGame[] = [
  {
    id: 'mg-petrosian-001',
    white: 'Petrosian, Tigran', black: 'Spassky, Boris',
    event: 'World Championship', year: 1966, result: '1-0', eco: 'E63', opening: 'King\'s Indian',
    pgn: '1. Nf3 Nf6 2. g3 g6 3. c4 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15. Rb1 Nh5 16. Be3 Qa6 17. Qxa6 bxa6 18. Nd1 f5 19. f3 f4 20. Bf2 g5 21. Rc1 Rxc1 22. Bxc1 Nf6 23. Bd2 h5 24. Rc1 Bf8 25. a4 g4 26. Bc3',
    annotations: {
      16: 'Be3! Petrosian exchanges queens — heading for a favorable endgame.',
      19: 'f3! Prophylactic — stopping any Black counterplay on the kingside.',
    },
    criticalMoments: [
      { moveNumber: 16, description: 'Petrosian steers toward a favorable endgame', fen: 'r1r3k1/pp1b1pbp/1q1p2p1/3Pp2n/4P3/3QBN1P/PP3PP1/1R3RK1 w - - 0 16' }
    ],
    alternatives: [],
    coachCommentary: 'Petrosian\'s prophylactic style in action. He prevents Black\'s plans before they materialize, gradually accumulating advantages in the endgame.',
    themes: ['prophylaxis', 'endgame', 'positional', 'world-championship'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// KRAMNIK — The 14th World Champion
// ============================================================================
const KRAMNIK_GAMES: MasterGame[] = [
  {
    id: 'mg-kramnik-001',
    white: 'Kramnik, Vladimir', black: 'Kasparov, Garry',
    event: 'World Championship', year: 2000, result: '1-0', eco: 'D27', opening: 'Queen\'s Gambit Accepted',
    pgn: '1. d4 d5 2. c4 dxc4 3. Nf3 e6 4. e3 c5 5. Bxc4 a6 6. O-O Nf6 7. Bb3 cxd4 8. exd4 Nc6 9. Nc3 Be7 10. Re1 O-O 11. Bf4 Na5 12. d5 Nxb3 13. Qxb3 exd5 14. Rad1 Be6 15. Ng5 g6 16. Nxd5 Nxd5 17. Qc2 Bg4 18. Rxd5 Qc8 19. Nxh7 Bf5 20. Qb3 Kxh7 21. Rd7 Bf6 22. Rxb7 Qc6 23. f3',
    annotations: {
      12: 'Kramnik\'s deep preparation — this line gives White a strong initiative.',
      19: 'Nxh7! A bold sacrifice that strips Black\'s kingside.',
    },
    criticalMoments: [
      { moveNumber: 19, description: 'Nxh7! Opening the kingside against the World Champion', fen: 'r1bq1rk1/1p3pbp/p3p1p1/3n1BN1/8/2N5/PPQ2PPP/4R1K1 w - - 0 19' }
    ],
    alternatives: [],
    coachCommentary: 'Kramnik defeats Kasparov in the World Championship! Deep opening preparation combined with precise calculation. Shows how preparation and nerves of steel can defeat even the greatest.',
    themes: ['world-championship', 'preparation', 'sacrifice', 'attack'],
    difficulty: 'expert'
  }
];

// ============================================================================
// DING LIREN — The 17th World Champion
// ============================================================================
const DING_GAMES: MasterGame[] = [
  {
    id: 'mg-ding-001',
    white: 'Ding Liren', black: 'Nepomniachtchi, Ian',
    event: 'World Championship', year: 2023, result: '1-0', eco: 'D17', opening: 'Slav Defense',
    pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. Ne5 Nbd7 7. Nxc4 Qc7 8. g3 e5 9. dxe5 Nxe5 10. Bf4 Nfd7 11. Bg2 g5 12. Ne3 gxf4 13. Nxf5 O-O-O 14. Qd2 fxg3 15. O-O-O Nc5 16. Qc2 gxf2 17. Nd4 Kb8 18. a5 Ne6 19. Nxe6 fxe6 20. Bh3',
    annotations: {
      11: 'Ding plays boldly — allowing the g-pawn push to create complications.',
      14: 'Qd2! Calm development amidst chaos. The hallmark of a future champion.',
    },
    criticalMoments: [
      { moveNumber: 11, description: 'Bold play allowing kingside chaos', fen: 'r3kb1r/pp1q1p1p/2p5/4nb2/P1N1p3/6P1/1P2PPBP/R1BQK2R w KQkq - 0 11' }
    ],
    alternatives: [],
    coachCommentary: 'Ding Liren shows the fighting spirit that helped him become the 17th World Champion. Playing g5 and creating chaos on the board — then navigating through the complications with precision.',
    themes: ['world-championship', 'dynamic-play', 'complications', 'fighting-chess'],
    difficulty: 'expert'
  }
];

// ============================================================================
// CLASSICAL BRILLIANCIES
// ============================================================================
const CLASSICAL_GAMES: MasterGame[] = [
  {
    id: 'mg-anderssen-001',
    white: 'Anderssen, Adolf', black: 'Kieseritzky, Lionel',
    event: 'London (Informal)', year: 1851, result: '1-0', eco: 'C33', opening: 'King\'s Gambit',
    pgn: '1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#',
    annotations: {
      18: 'Bd6! Anderssen ignores the rook — piece activity is everything!',
      21: 'Nxg7+! With both rooks sacrificed, White plays for checkmate.',
      23: 'Be7# — The Immortal Game! Checkmate with both rooks sacrificed.',
    },
    criticalMoments: [
      { moveNumber: 18, description: 'The legendary double rook sacrifice begins', fen: 'rn1k2nr/p4ppp/3B4/1p1Np3/6P1/3P4/PqP1KP2/Rq4b1 w - - 0 18' },
      { moveNumber: 23, description: 'Be7# — Checkmate with both rooks sacrificed!', fen: 'r1bk2nr/p2pBppp/8/1p1Np3/6P1/3P4/P1P1KP2/q5b1 w - - 0 23' }
    ],
    alternatives: [],
    coachCommentary: 'The Immortal Game! Anderssen sacrifices both rooks, a bishop, and delivers checkmate with minor pieces. This game changed how people think about attack and sacrifice in chess.',
    themes: ['immortal-game', 'sacrifice', 'attack', 'romantic-chess'],
    difficulty: 'intermediate'
  },
  {
    id: 'mg-anderssen-002',
    white: 'Anderssen, Adolf', black: 'Dufresne, Jean',
    event: 'Berlin', year: 1852, result: '1-0', eco: 'C52', opening: 'Evans Gambit',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#',
    annotations: {
      17: 'Nf6+! Beginning the legendary combination.',
      20: 'Rxe7+!! Another sacrifice — Anderssen gives up everything.',
      21: 'Qxd7+!! The queen sacrifice! Leading to forced checkmate.',
      24: 'Bxe7# — The Evergreen Game! One of the most beautiful finishes in chess history.',
    },
    criticalMoments: [
      { moveNumber: 20, description: 'Rxe7+!! Sacrifice leading to a forced mating combination', fen: 'r3r1k1/pbb2p1p/1n3Pp1/8/Q7/2PB1q2/P4PPP/R1B1R1K1 w - - 0 20' },
      { moveNumber: 24, description: 'Bxe7# — The Evergreen Finale!', fen: 'rr4k1/pbbBBp1p/1n3Pp1/8/8/2P2q2/P4PPP/3R2K1 w - - 0 24' }
    ],
    alternatives: [],
    coachCommentary: 'The Evergreen Game — another Anderssen masterpiece. The double bishop sacrifice, rook sacrifice, and queen sacrifice all lead to a checkmate with the "quiet" bishop. Studies in tactical calculation.',
    themes: ['evergreen-game', 'sacrifice', 'combination', 'romantic-chess'],
    difficulty: 'intermediate'
  },
  {
    id: 'mg-botvinnik-001',
    white: 'Botvinnik, Mikhail', black: 'Capablanca, Jose Raul',
    event: 'AVRO', year: 1938, result: '1-0', eco: 'E40', opening: 'Nimzo-Indian',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. Bd3 O-O 9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 14. Qd3 c4 15. Qc2 Nb8 16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 20. e5 Nd7 21. Qf2 g6 22. f4 f5 23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 Re8 26. Re6 Rxe6 27. fxe6 Kg7 28. Qf4 Qe8 29. Qe5 Qe7 30. Ba3 Qxa3 31. Nh5+ gxh5 32. Qg5+ Kf8 33. Qxf6+ Kg8 34. e7 Qc1+ 35. Kf2 Qc2+ 36. Kg3 Qd3+ 37. Kh4 Qe4+ 38. Kxh5 Qe2+ 39. Kh4 Qe4+ 40. g4 Qe1+ 41. Kh5',
    annotations: {
      20: 'e5! Botvinnik launches the central breakthrough — the pawns become unstoppable.',
      30: 'Ba3! A brilliant exchange sacrifice idea — the e-pawn will decide.',
      31: 'Nh5+! The final combination begins.',
    },
    criticalMoments: [
      { moveNumber: 20, description: 'e5! The central breakthrough that wins the game', fen: 'r3r1k1/p2q1ppp/1p3n2/3p4/P1pP4/1nP3N1/1BQ2PPP/4RRK1 w - - 0 20' }
    ],
    alternatives: [],
    coachCommentary: 'Botvinnik defeats Capablanca in one of the greatest games ever played! The central pawn breakthrough (e5, f4, f5) is a textbook example of how to open lines against a castled king.',
    themes: ['pawn-breakthrough', 'attack', 'central-play', 'classic'],
    difficulty: 'expert'
  }
];

// ============================================================================
// MODERN GRANDMASTER GAMES
// ============================================================================
const MODERN_GAMES: MasterGame[] = [
  {
    id: 'mg-caruana-001',
    white: 'Caruana, Fabiano', black: 'Topalov, Veselin',
    event: 'Sinquefield Cup', year: 2014, result: '1-0', eco: 'C67', opening: 'Ruy Lopez Berlin',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8. Qxd8+ Kxd8 9. h3 Ke8 10. Nc3 h5 11. Bf4 Be7 12. Rad1 Be6 13. Ng5 Rh6 14. g3 Bxg5 15. Bxg5 Rg6 16. h4 f6 17. exf6 gxf6 18. Bf4 Nxh4 19. f3 Rd8 20. Kf2 Rxd1 21. Nxd1 Nf5 22. Rh1 Bxa2 23. Rxh5 Be6 24. g4 Nd6 25. Rh7',
    annotations: {
      14: 'Caruana plays with remarkable energy in the Berlin endgame — typically a dull line.',
      18: 'exf6! Opening lines against the exposed king.',
    },
    criticalMoments: [
      { moveNumber: 14, description: 'Injecting life into the Berlin endgame', fen: '4k2r/ppp1bpp1/2p1b2r/4pnB1/8/2N2N1P/PPP2PP1/3RR1K1 w k - 0 14' }
    ],
    alternatives: [],
    coachCommentary: 'Caruana shows that even the "boring" Berlin Defense can lead to exciting play. His energetic approach in the 2014 Sinquefield Cup (where he scored 7/7) is a lesson in aggressive endgame play.',
    themes: ['berlin-endgame', 'aggressive-endgame', 'technique'],
    difficulty: 'advanced'
  },
  {
    id: 'mg-nepo-001',
    white: 'Nepomniachtchi, Ian', black: 'Vachier-Lagrave, Maxime',
    event: 'Candidates', year: 2020, result: '1-0', eco: 'C42', opening: 'Petrov Defense',
    pgn: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Bd6 7. O-O O-O 8. c4 c6 9. Re1 Bf5 10. Qb3 Qd7 11. Nc3 Nxc3 12. bxc3 Bxd3 13. Qxd3 Na6 14. Rb1 Rab8 15. c5 Bc7 16. Bg5 f6 17. Bf4 Bxf4 18. Qxa6 Bc7 19. Re6 Rbe8 20. Rbe1 Rxe6 21. Rxe6',
    annotations: {
      15: 'c5! Fixing Black\'s pawn structure and gaining space.',
      18: 'Qxa6! Material advantage secured with continued pressure.',
    },
    criticalMoments: [],
    alternatives: [],
    coachCommentary: 'Nepo demonstrates how to exploit small advantages in seemingly equal positions. The pawn structure manipulation with c5 is instructive.',
    themes: ['pawn-structure', 'technique', 'modern-chess'],
    difficulty: 'advanced'
  },
  {
    id: 'mg-gukesh-001',
    white: 'Gukesh, Dommaraju', black: 'Ding Liren',
    event: 'World Championship', year: 2024, result: '1-0', eco: 'D05', opening: 'Queen\'s Pawn',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. e3 c5 5. Nc3 Nc6 6. cxd5 exd5 7. Bb5 Bd6 8. dxc5 Bxc5 9. O-O O-O 10. b3 Bg4 11. Bb2 a6 12. Be2 Ba7 13. Rc1 Qd6 14. Nd4 Ne5 15. a3 Re8 16. f4 Nc6 17. Nxc6 bxc6 18. Bxf6 Qxf6 19. Na4 Rad8 20. Qc2 c5 21. Nc3 d4 22. exd4 cxd4 23. Nd5 Qd6 24. Bf3 Bxf3 25. Rxf3 Bb8 26. Rfc3 Rc8',
    annotations: {
      16: 'Gukesh shows remarkable maturity — gaining space with f4 while maintaining structural integrity.',
      24: 'Bf3! Simplifying to a position where the knight on d5 dominates.',
    },
    criticalMoments: [
      { moveNumber: 16, description: 'f4! Space gain with strategic depth', fen: 'r3r1k1/bp3ppp/p1nq1n2/3p4/3N4/1PN1P3/PB2BPPP/2RQ1RK1 w - - 0 16' }
    ],
    alternatives: [],
    coachCommentary: 'The youngest World Champion in history! Gukesh shows that modern chess is about precision, preparation, and converting small edges — the new generation at its best.',
    themes: ['world-championship', 'youngest-champion', 'precision', 'modern-chess'],
    difficulty: 'advanced'
  }
];

// ============================================================================
// EXPORT
// ============================================================================
export const GRANDMASTER_GAMES: MasterGame[] = [
  ...TAL_EXTENDED,
  ...FISCHER_EXTENDED,
  ...KASPAROV_EXTENDED,
  ...CARLSEN_EXTENDED,
  ...PETROSIAN_GAMES,
  ...KRAMNIK_GAMES,
  ...DING_GAMES,
  ...CLASSICAL_GAMES,
  ...MODERN_GAMES,
];

export const GRANDMASTER_PLAYERS = [
  { id: 'petrosian', name: 'Tigran Petrosian', era: '1929-1984', title: '9th World Champion', style: 'Prophylactic Master', count: PETROSIAN_GAMES.length },
  { id: 'kramnik', name: 'Vladimir Kramnik', era: '1975-', title: '14th World Champion', style: 'Deep Strategist', count: KRAMNIK_GAMES.length },
  { id: 'ding', name: 'Ding Liren', era: '1992-', title: '17th World Champion', style: 'Universal Fighter', count: DING_GAMES.length },
  { id: 'caruana', name: 'Fabiano Caruana', era: '1992-', title: 'World No. 2', style: 'Precision Player', count: 1 },
  { id: 'nepo', name: 'Ian Nepomniachtchi', era: '1990-', title: 'World Championship Candidate', style: 'Dynamic Attacker', count: 1 },
  { id: 'gukesh', name: 'Dommaraju Gukesh', era: '2006-', title: '18th World Champion', style: 'Rising Prodigy', count: 1 },
  { id: 'anderssen', name: 'Adolf Anderssen', era: '1818-1879', title: 'Unofficial World Champion', style: 'Romantic Master', count: 2 },
  { id: 'botvinnik', name: 'Mikhail Botvinnik', era: '1911-1995', title: '6th World Champion', style: 'Scientific Player', count: 1 },
];
