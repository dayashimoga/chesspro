// ChessOS — Content: Master Game Studies (Fully Interactive)

export const masterGamesContent = {
  id: 'master-games',
  title: 'Master Game Studies',
  icon: '🏆',
  description: 'Study annotated games from the greatest players in chess history. Understand their thinking, strategies, and brilliant combinations.',
  difficulty: 'advanced',
  modules: [
    {
      id: 'morphy-games',
      title: 'Paul Morphy — The Pride of Chess',
      difficulty: 'intermediate',
      theory: `
<h2>Paul Morphy (1837–1884)</h2>
<p>Morphy was the first unofficial world champion and is considered the greatest natural chess talent in history. His games demonstrate the power of <strong>rapid development, open lines, and aggressive but sound attacking play</strong>.</p>
`,
      demoSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          commentary: 'Let\'s look at Paul Morphy\'s famous Opera House game. He starts with 1.e4, claiming space in the center.',
          arrows: [{ from: 'e2', to: 'e4', color: 'rgba(16, 185, 129, 0.8)' }]
        },
        {
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          commentary: 'Black responds with 1...e5, mirroring White\'s claim. Morphy will prioritize rapid development next.'
        }
      ],
      guidedSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          instruction: 'Play Morphy\'s signature opening move, advancing the king\'s pawn two squares.',
          expectedMove: 'e4',
          correctFeedback: 'Excellent! 1.e4 is the classical start to claim the center.',
          incorrectFeedback: 'Try pushing the e-pawn to e4.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'What was the core strategic theme of Paul Morphy\'s play?', options: ['Endgame grinding', 'Rapid development and open lines', 'Slow maneuvers', 'Defense only'], answer: 1, explanation: 'Morphy pioneered rapid development and opening lines for rapid tactical attacks.' }
      ],
      masteryPositions: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          description: 'Make Black\'s mirror response to Morphy\'s opening move.',
          solution: ['e5'],
          conceptTested: 'Classical symmetry',
          maxAttempts: 3
        }
      ],
      games: [
        {
          id: 'morphy_opera',
          white: 'Paul Morphy',
          black: 'Duke of Brunswick & Count Isouard',
          event: 'Paris Opera House',
          year: 1858,
          result: '1-0',
          pgn: '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#',
          annotations: {
            '3.d4': 'Morphy immediately opens the center. He understood that development + open lines = attack.',
            '6.Bc4': 'Targeting f7, the weakest point. Morphy already has two pieces developed while his opponents have none.'
          },
          themes: ['Rapid Development', 'Open Lines', 'Sacrificial Attack', 'Queen Sacrifice']
        }
      ]
    },
    {
      id: 'fischer-games',
      title: 'Bobby Fischer — The Greatest',
      difficulty: 'advanced',
      theory: `
<h2>Bobby Fischer (1943–2008)</h2>
<p>Fischer's games combine deep preparation, technical precision, and relentless willpower.</p>
`,
      demoSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          commentary: 'Bobby Fischer often opened with 1.e4, calling it "best by test". Let\'s look at his development plans.',
          arrows: [{ from: 'e2', to: 'e4', color: 'rgba(16, 185, 129, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          instruction: 'Play Fischer\'s favorite opening move.',
          expectedMove: 'e4',
          correctFeedback: 'Great! e4 was Fischer\'s absolute favorite first move.',
          incorrectFeedback: 'Push the e-pawn.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'Which opening move did Fischer describe as "best by test"?', options: ['d4', 'e4', 'Nf3', 'c4'], answer: 1, explanation: 'Fischer famously wrote that 1.e4 is "best by test".' }
      ],
      masteryPositions: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          description: 'Play the Sicilian Defense response (c5), which Fischer often faced and also played himself.',
          solution: ['c5'],
          conceptTested: 'Sicilian Defense',
          maxAttempts: 3
        }
      ],
      games: [
        {
          id: 'fischer_byrne',
          white: 'Donald Byrne',
          black: 'Bobby Fischer',
          event: 'Rosenwald Memorial',
          year: 1956,
          result: '0-1',
          pgn: '1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2#',
          annotations: {
            '11...Na4': 'The 13-year-old Fischer begins a brilliant combination.'
          },
          themes: ['Queen Sacrifice', 'Windmill', 'Piece Coordination']
        }
      ]
    },
    {
      id: 'kasparov-games',
      title: 'Garry Kasparov — The Greatest Attacker',
      difficulty: 'expert',
      theory: `
<h2>Garry Kasparov (1963–present)</h2>
<p>Kasparov dominated chess for over 20 years with ferocious attacking play and deep preparation.</p>
`,
      demoSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          commentary: 'Kasparov often preferred 1.d4 in World Championship matches to steer the game into complex strategic battles.',
          arrows: [{ from: 'd2', to: 'd4', color: 'rgba(16, 185, 129, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          instruction: 'Play Kasparov\'s preferred queen\'s pawn opening move.',
          expectedMove: 'd4',
          correctFeedback: 'Excellent! 1.d4 leads to rich, strategic positions.',
          incorrectFeedback: 'Push the d-pawn to d4.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'Garry Kasparov dominated chess for how many years as World Champion?', options: ['5 years', '10 years', '15 years', 'Over 20 years'], answer: 3, explanation: 'Kasparov was the undisputed World Champion from 1985 to 2000, and remained No. 1 until 2005.' }
      ],
      masteryPositions: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
          description: 'Play the aggressive Nf6 response to d4, preparing the King\'s Indian Defense.',
          solution: ['Nf6'],
          conceptTested: 'KID setup',
          maxAttempts: 3
        }
      ],
      games: [
        {
          id: 'kasparov_topalov',
          white: 'Garry Kasparov',
          black: 'Veselin Topalov',
          event: 'Wijk aan Zee',
          year: 1999,
          result: '1-0',
          pgn: '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2 Nbd7 8.Bh6 Bxh6 9.Qxh6 Bb7 10.a3 e5 11.O-O-O Qe7 12.Kb1 a6 13.Nc1 O-O-O 14.Nb3 exd4 15.Rxd4 c5 16.Rd1 Nb6 17.g3 Kb8 18.Na5 Ba8 19.Bh3 d5 20.Qf4+ Ka7 21.Re1 d4 22.Nd5 Nbxd5 23.exd5 Qd6 24.Rxd4 cxd4 25.Re7+ Kb6 26.Qxd4+ Kxa5 27.b4+ Ka4 28.Qc3 Qxd5 29.Ra7 Bb7 30.Rxb7 Qc4 31.Qxf6 Kxa3 32.Qxa6+ Kxb4 33.c3+ Kxc3 34.Qa1+ Kd2 35.Qb2+ Kd1 36.Bf1 Rd2 37.Rd7 Rxd7 38.Bxc4 bxc4 39.Qxh8 Rd3 40.Qa8 c3 41.Qa4+ Ke1 42.f4 f5 43.Kc1 Rd2 44.Qa7 1-0',
          annotations: {
            '24.Rxd4': 'Kasparov begins one of the most brilliant combinations in history.'
          },
          themes: ['Rook Sacrifice', 'King Hunt', 'Initiative']
        }
      ]
    },
    {
      id: 'carlsen-games',
      title: 'Magnus Carlsen — The Mozart of Chess',
      difficulty: 'expert',
      theory: `
<h2>Magnus Carlsen (1990–present)</h2>
<p>Carlsen excels at extracting wins from dead-drawn positions through pure technical precision.</p>
`,
      demoSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          commentary: 'Carlsen is highly flexible. He often plays 1.Nf3 to avoid sharp opening theory and enter a pure positional battle.',
          arrows: [{ from: 'g1', to: 'f3', color: 'rgba(16, 185, 129, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          instruction: 'Develop White\'s king\'s knight to f3.',
          expectedMove: 'Nf3',
          correctFeedback: 'Excellent! Nf3 is a highly flexible choice preferred by Carlsen.',
          incorrectFeedback: 'Develop the knight to f3.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'What is Magnus Carlsen\'s peak classical rating?', options: ['2850', '2872', '2882', '2900'], answer: 2, explanation: 'Carlsen reached a peak rating of 2882, the highest in history.' }
      ],
      masteryPositions: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
          description: 'Play Black\'s classical central response d5.',
          solution: ['d5'],
          conceptTested: 'Flexible centerline response',
          maxAttempts: 3
        }
      ],
      games: []
    },
    {
      id: 'tal-games',
      title: 'Mikhail Tal — The Magician',
      difficulty: 'advanced',
      theory: `
<h2>Mikhail Tal (1936–1992)</h2>
<p>Tal was the most brilliant attacking player in chess history, known for spectacular sacrifices.</p>
`,
      demoSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          commentary: 'Tal loved open tactical positions. He opened with 1.e4 to invite sharp lines.',
          arrows: [{ from: 'e2', to: 'e4', color: 'rgba(239, 68, 68, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          instruction: 'Open the game with e4 to invite tactical complications.',
          expectedMove: 'e4',
          correctFeedback: 'Perfect! e4 sets up open attacking opportunities.',
          incorrectFeedback: 'Move the e-pawn.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'What was Mikhail Tal\'s nickname?', options: ['The Iron Tigran', 'The Magician from Riga', 'The Chess Machine', 'The Pride of Riga'], answer: 1, explanation: 'Mikhail Tal was widely known as "The Magician from Riga".' }
      ],
      masteryPositions: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          description: 'Play the French Defense response (e6), inviting White\'s central attack.',
          solution: ['e6'],
          conceptTested: 'French Defense entry',
          maxAttempts: 3
        }
      ],
      games: []
    }
  ]
};

export default masterGamesContent;
