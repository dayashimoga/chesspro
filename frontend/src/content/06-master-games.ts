// ChessOS — Content: Master Game Studies

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

<h3>Key Themes in Morphy's Games</h3>
<ul>
  <li>Rapid piece development (Morphy often had all pieces developed while opponents had barely moved)</li>
  <li>Opening lines for attacks (sacrificing pawns for tempo and open files)</li>
  <li>Combining development advantage with tactical strikes</li>
  <li>Punishing slow or greedy play by opponents</li>
</ul>
`,
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
            '6.Bc4': 'Targeting f7, the weakest point. Morphy already has two pieces developed while his opponents have none.',
            '9.Bg5': 'A fourth piece enters the game. Morphy now has massive development advantage.',
            '10.Nxb5': 'A stunning sacrifice. Morphy opens lines at the cost of a knight.',
            '11.Bxb5+': 'Check! The combination unfolds. Morphy\'s development advantage converts to a decisive attack.',
            '12.O-O-O': 'Castling queenside brings the rook into the attack immediately. Every piece participates.',
            '13.Rxd7': 'Sacrifice! The rook crashes through.',
            '16.Qb8+': 'The brilliant finale — a queen sacrifice! After Nxb8, Rd8 is checkmate. All of Morphy\'s pieces coordinate perfectly.',
            '17.Rd8#': 'Checkmate. A perfect attacking game demonstrating the power of rapid development.'
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
<p>Fischer's games combine deep preparation, technical precision, and relentless willpower. He revolutionized opening preparation and was known for his incredible endgame technique and fighting spirit.</p>

<h3>Fischer's Hallmarks</h3>
<ul>
  <li>Deep opening preparation (decades ahead of his time)</li>
  <li>Crystal-clear positional understanding</li>
  <li>Tenacious defense when required</li>
  <li>Superior endgame technique</li>
  <li>Will to win in every game</li>
</ul>
`,
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
            '11...Na4': 'The 13-year-old Fischer begins a brilliant combination. The knight heads to c3 to destroy White\'s center.',
            '13...Nxe4': 'Fischer grabs the e4 pawn, seemingly losing material. But he\'s calculated everything.',
            '17...Be6': 'A quiet move in the middle of a storm — the bishop retreats to a powerful diagonal while maintaining the attack.',
            '18...Bxc4+': 'The combination deepens. Fischer sacrificed his queen for a devastating discovered check.',
            '19...Ne2+': 'The knight dances around White\'s king in a "windmill" pattern, picking up pieces.',
            '41...Rc2#': 'Checkmate! One of the greatest games ever played, by a 13-year-old.'
          },
          themes: ['Queen Sacrifice', 'Windmill', 'Piece Coordination', 'Calculation']
        }
      ]
    },
    {
      id: 'kasparov-games',
      title: 'Garry Kasparov — The Greatest Attacker',
      difficulty: 'expert',
      theory: `
<h2>Garry Kasparov (1963–present)</h2>
<p>Kasparov dominated chess for over 20 years with a combination of deep preparation, extraordinary calculation, and ferocious attacking play. His dynamic style pushed the boundaries of what was thought possible on the chessboard.</p>

<h3>Kasparov's Strengths</h3>
<ul>
  <li>Unprecedented opening preparation</li>
  <li>Dynamic piece play and initiative</li>
  <li>Willingness to sacrifice for the initiative</li>
  <li>Psychological dominance over opponents</li>
  <li>Ability to create complications even in quiet positions</li>
</ul>
`,
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
            '24.Rxd4': 'Kasparov begins one of the most brilliant combinations in chess history. The rook sacrifice opens the position.',
            '25.Re7+': 'Another rook enters with check! The king is forced to march up the board.',
            '26.Qxd4+': 'Check! The black king is now on a5, completely exposed.',
            '27.b4+': 'The quiet pawn move is actually the key! The king must go to a4.',
            '28.Qc3': 'Threatening Qa1# and maintaining the attack. Every piece participates.',
            '29.Ra7': 'The remaining rook joins the hunt. The black king has no shelter.'
          },
          themes: ['Rook Sacrifice', 'King Hunt', 'Initiative', 'Piece Coordination']
        }
      ]
    },
    {
      id: 'carlsen-games',
      title: 'Magnus Carlsen — The Mozart of Chess',
      difficulty: 'expert',
      theory: `
<h2>Magnus Carlsen (1990–present)</h2>
<p>Carlsen is the highest-rated player in chess history (2882 peak). His style combines deep positional understanding with relentless technical grinding. He excels at extracting wins from "dead drawn" positions through pure technique and stamina.</p>

<h3>Carlsen's Distinctive Traits</h3>
<ul>
  <li>Superior endgame technique — perhaps the best ever</li>
  <li>Ability to create imbalances from nothing</li>
  <li>Psychological pressure through perfect technique</li>
  <li>Universal style — equally comfortable in tactical and positional play</li>
  <li>Incredible competitive stamina</li>
</ul>

<h3>Learning from Carlsen</h3>
<p>Study Carlsen for endgame mastery, the art of "pressing" in equal positions, and how to convert minimal advantages into wins.</p>
`,
      games: [
        {
          id: 'carlsen_anand_2013',
          white: 'Magnus Carlsen',
          black: 'Viswanathan Anand',
          event: 'World Championship',
          year: 2013,
          result: '1-0',
          pgn: '1.Nf3 d5 2.g3 g6 3.Bg2 Bg7 4.d4 c6 5.O-O Nf6 6.b3 O-O 7.Bb2 Bf5 8.c4 Nbd7 9.Nc3 dxc4 10.bxc4 Nb6 11.c5 Nc4 12.Bc1 Nd5 13.Qb3 Na5 14.Qa3 Nc4 15.Qa4 Nd6 16.cxd6 exd6 17.Qc2 Re8 18.Rd1 Nf6 19.Bf4 Nh5 20.Bd2 Re6 21.e4 Bd7 22.a4 Qe7 23.a5 f6 24.Rab1 Rae8 25.Qc1 Kh8 26.b4 Qf8 27.Bc3 Be7 28.Nd2 Bf8 29.Nb3 d5 30.e5 fxe5 31.dxe5 Bc8 32.Na4 1-0',
          annotations: {
            '11.c5': 'Carlsen gains space on the queenside, a typical strategic idea.',
            '16.cxd6': 'Creating a structural imbalance. White has more space and Black has isolated pawns.',
            '30.e5': 'The breakthrough! Carlsen opens the center with a powerful pawn advance.',
            '32.Na4': 'A quiet move that leaves Black in a hopeless position. Classic Carlsen — squeezing the life out of the position.'
          },
          themes: ['Positional Play', 'Space Advantage', 'Structural Advantage', 'Strategic Squeeze']
        }
      ]
    },
    {
      id: 'tal-games',
      title: 'Mikhail Tal — The Magician',
      difficulty: 'advanced',
      theory: `
<h2>Mikhail Tal (1936–1992)</h2>
<p>Tal was the most brilliant attacking player in chess history. His style featured audacious sacrifices, breathtaking combinations, and a willingness to create chaos on the board. He became World Champion in 1960 at age 23.</p>

<h3>Tal's Philosophy</h3>
<blockquote>"You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one." — Mikhail Tal</blockquote>
<ul>
  <li>Speculative sacrifices that were difficult to refute over the board</li>
  <li>Creating maximum complications</li>
  <li>Practical play — putting pressure on the opponent's clock and nerves</li>
  <li>Initiative above material</li>
</ul>
`,
      games: [
        {
          id: 'tal_larsen',
          white: 'Mikhail Tal',
          black: 'Bent Larsen',
          event: 'Candidates Match',
          year: 1965,
          result: '1-0',
          pgn: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e6 5.Nc3 d6 6.Be3 Nf6 7.f3 Be7 8.Qd2 O-O 9.O-O-O a6 10.g4 Nxd4 11.Bxd4 b5 12.g5 Nd7 13.h4 b4 14.Na4 Bb7 15.Qxb4 Bc6 16.b3 Bxa4 17.bxa4 d5 18.Bd3 dxe4 19.fxe4 e5 20.Be3 Bc5 21.Bxc5 Nxc5 22.h5 Nxa4 23.g6 fxg6 24.hxg6 h6 25.Rdg1 Qe7 26.Bc4+ Kh8 27.Rh5 Nc5 28.Rxe5 Qf6 29.Rxc5 Qxg6 30.Rc7 1-0',
          annotations: {
            '10.g4': 'Typical Tal — the pawn storm begins immediately.',
            '14.Na4': 'Sacrificing a pawn for the initiative. Pure Tal.',
            '23.g6': 'Ripping open the king position with a pawn sacrifice.',
            '30.Rc7': 'The rook invades with devastating effect. Total domination of the position.'
          },
          themes: ['Kingside Attack', 'Pawn Storm', 'Sacrificial Play', 'Initiative']
        }
      ]
    }
  ]
};

export default masterGamesContent;
