// ChessOS — Extended Opening Content (20+ additional opening systems)
// Covers: Grünfeld, Dutch, English, Catalan, Scandinavian, Pirc, Alekhine,
// Benoni, Dutch, Trompowsky, King's Gambit, Scotch, Philidor, Bird, Petroff

import { openingsContent } from './05-openings';

export const extendedOpenings = [
  {
    id: 'grunfeld',
    title: 'Grünfeld Defense',
    difficulty: 'advanced',
    theory: `
<h2>Grünfeld Defense — 1.d4 Nf6 2.c4 g6 3.Nc3 d5</h2>
<p>One of the most dynamic defenses against 1.d4. Black allows White a large pawn center and then attacks it with pieces and pawn breaks. Kasparov and Svidler are notable practitioners.</p>

<h3>Key Ideas</h3>
<ul>
  <li>Black's strategy: allow White to build a center with e4, then undermine it with ...c5, ...Bg7</li>
  <li>The fianchettoed bishop on g7 becomes a powerful weapon attacking d4</li>
  <li>Exchange variation (4.cxd5 Nxd5 5.e4) is the main battleground</li>
  <li>Russian System (4.Nf3 Bg7 5.Qb3) applies early queenside pressure</li>
</ul>
`,
    openingTree: [
      { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
      { move: '2.c4', fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: '' },
      { move: '2...g6', fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3', comment: '' },
      { move: '3.Nc3', fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', comment: '' },
      { move: '3...d5', fen: 'rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4', comment: 'Grünfeld! Challenging the center immediately' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is Black\'s main strategy in the Grünfeld?', options: ['Defend passively', 'Allow White a big center then attack it', 'Trade all pieces quickly', 'Play for a draw'], answer: 1, explanation: 'The Grünfeld philosophy: let White build a big center, then destroy it with ...c5, ...Bg7, and piece pressure.' },
    ]
  },
  {
    id: 'english-opening',
    title: 'English Opening',
    difficulty: 'intermediate',
    theory: `
<h2>English Opening — 1.c4</h2>
<p>A flexible, strategic opening that can transpose into many different structures. Popular with players who want to avoid main-line 1.d4 or 1.e4 theory. Botvinnik and Kasparov used it extensively.</p>

<h3>Main Systems</h3>
<ul>
  <li><strong>Symmetrical English (1...c5):</strong> Both sides play for control of d4/d5</li>
  <li><strong>Reversed Sicilian (1...e5):</strong> White plays a Sicilian with an extra tempo</li>
  <li><strong>English vs KID setup:</strong> Bg2, Nc3, e4 — controlling the center</li>
  <li><strong>Four Knights (1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6):</strong> Classical development</li>
</ul>
`,
    openingTree: [
      { move: '1.c4', fen: 'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1', comment: 'English Opening — flexible and strategic' },
    ],
    exercises: [
      { type: 'quiz', question: 'What does 1.c4 control?', options: ['e5', 'd5', 'f5', 'b5'], answer: 1, explanation: '1.c4 controls the d5 square, preventing Black from occupying the center with a pawn.' },
    ]
  },
  {
    id: 'catalan',
    title: 'Catalan Opening',
    difficulty: 'advanced',
    theory: `
<h2>Catalan Opening — 1.d4 Nf6 2.c4 e6 3.g3</h2>
<p>A sophisticated opening combining Queen's Gambit pawn structure with a fianchettoed bishop. The Bg2 exerts long-range pressure on the a8-h1 diagonal. Kramnik, Carlsen, and Anand are major practitioners.</p>

<h3>Key Ideas</h3>
<ul>
  <li>The Bg2 creates permanent pressure on Black's queenside</li>
  <li>Open Catalan (3...dxc4): White sacrifices a pawn for lasting initiative</li>
  <li>Closed Catalan (3...Be7, ...O-O, maintaining d5): Slower maneuvering game</li>
</ul>
`,
    openingTree: [
      { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
      { move: '2.c4', fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: '' },
      { move: '2...e6', fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3', comment: '' },
      { move: '3.g3', fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3', comment: 'Catalan — fianchetto on the long diagonal' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is the key feature of the Catalan?', options: ['Kingside attack', 'Long diagonal pressure from Bg2', 'Pawn storm', 'Trading queens early'], answer: 1, explanation: 'The fianchettoed bishop on g2 creates lasting diagonal pressure, especially on Black\'s queenside.' },
    ]
  },
  {
    id: 'scandinavian',
    title: 'Scandinavian Defense',
    difficulty: 'beginner',
    theory: `
<h2>Scandinavian Defense — 1.e4 d5</h2>
<p>The most direct response to 1.e4 — Black immediately challenges the center. After 2.exd5 Qxd5, the queen is developed early but must move again after 3.Nc3.</p>

<h3>Variations</h3>
<ul>
  <li><strong>Main Line (2...Qxd5 3.Nc3 Qa5):</strong> The queen retreats to a5 where it's safe</li>
  <li><strong>Modern (2...Nf6):</strong> Black gambits the pawn temporarily with rapid development</li>
  <li><strong>Icelandic Gambit (2...Nf6 3.c4 e6):</strong> Aggressive pawn sacrifice for development</li>
</ul>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...d5', fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: 'Scandinavian — immediate central challenge' },
      { move: '2.exd5', fen: 'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2', comment: '' },
      { move: '2...Qxd5', fen: 'rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3', comment: 'Queen recaptures — early development but needs another move' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is the main drawback of the Scandinavian?', options: ['Black loses a pawn', 'The queen develops too early and must move again', 'It leads to a boring game', 'Black can\'t castle'], answer: 1, explanation: 'After 2...Qxd5, White plays 3.Nc3 attacking the queen, forcing it to move again and losing tempo.' },
    ]
  },
  {
    id: 'pirc-defense',
    title: 'Pirc Defense',
    difficulty: 'intermediate',
    theory: `
<h2>Pirc Defense — 1.e4 d6 2.d4 Nf6 3.Nc3 g6</h2>
<p>A hypermodern defense where Black allows White a full center and counterattacks later. Similar to the King's Indian but against 1.e4.</p>

<h3>Systems</h3>
<ul>
  <li><strong>Austrian Attack (4.f4):</strong> White plays aggressively for a kingside attack</li>
  <li><strong>Classical (4.Nf3):</strong> Solid development, flexible plans</li>
  <li><strong>150 Attack (4.Be3):</strong> Named after being rated "150 Elo points of advantage"</li>
</ul>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...d6', fen: 'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: '' },
      { move: '2.d4', fen: 'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', comment: '' },
      { move: '2...Nf6', fen: 'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3', comment: '' },
      { move: '3.Nc3', fen: 'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3', comment: '' },
      { move: '3...g6', fen: 'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4', comment: 'Pirc Defense — hypermodern approach' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is the hypermodern strategy?', options: ['Occupy the center with pawns', 'Allow the opponent to occupy the center then attack it', 'Avoid the center entirely', 'Play only on the flanks'], answer: 1, explanation: 'Hypermodern chess allows the opponent to build a center, then attacks and undermines it with pieces and pawn breaks.' },
    ]
  },
  {
    id: 'alekhine-defense',
    title: 'Alekhine\'s Defense',
    difficulty: 'intermediate',
    theory: `
<h2>Alekhine's Defense — 1.e4 Nf6</h2>
<p>A provocative defense named after the 4th World Champion. Black invites White to advance pawns with 2.e5 Nd5 3.d4, creating a large center that Black will later attack.</p>

<h3>Philosophy</h3>
<ul>
  <li>Each pawn advance by White creates a target for Black to attack</li>
  <li>The knight on d5 (later b6 or f6) helps undermine White's center</li>
  <li>Four Pawns Attack (2.e5 Nd5 3.d4 d6 4.c4 Nb6 5.f4) is the most critical test</li>
</ul>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2', comment: 'Alekhine\'s Defense — provoking the center' },
    ],
    exercises: [
      { type: 'quiz', question: 'What happens after 1.e4 Nf6 2.e5?', options: ['Black is lost', 'The knight moves to d5, provoking more advances', 'Black captures on e5', 'The game is drawn'], answer: 1, explanation: 'After 2.e5 Nd5, Black has provoked White into advancing, creating targets for future attacks.' },
    ]
  },
  {
    id: 'benoni',
    title: 'Modern Benoni',
    difficulty: 'advanced',
    theory: `
<h2>Modern Benoni — 1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6</h2>
<p>A sharp, unbalanced opening where Black accepts a backward d-pawn in exchange for queenside counterplay and piece activity. Tal and Kasparov played it with great success.</p>

<h3>Key Plans</h3>
<ul>
  <li>Black: ...b5 pawn break, ...Nbd7-b6 or ...Na6-c7, rook to b8 or e8</li>
  <li>White: e4-e5 central break, or a4 to prevent ...b5</li>
  <li>The dark-squared bishop on g7 is powerful on the long diagonal</li>
</ul>
`,
    openingTree: [
      { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
      { move: '2.c4', fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: '' },
      { move: '2...c5', fen: 'rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3', comment: 'Modern Benoni — fighting for d4' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is Black\'s main queenside break in the Benoni?', options: ['a5', 'b5', 'c4', 'd5'], answer: 1, explanation: '...b5 is the thematic queenside break, opening lines for Black\'s pieces and creating counterplay.' },
    ]
  },
  {
    id: 'dutch-defense',
    title: 'Dutch Defense',
    difficulty: 'intermediate',
    theory: `
<h2>Dutch Defense — 1.d4 f5</h2>
<p>An ambitious, aggressive defense where Black immediately fights for the e4 square. It signals attacking intentions on the kingside from the very first move.</p>

<h3>Main Variations</h3>
<ul>
  <li><strong>Stonewall (d5, f5, e6, c6):</strong> Solid but the dark squares become weak</li>
  <li><strong>Leningrad (g6, Bg7, f5):</strong> Combining KID setup with ...f5</li>
  <li><strong>Classical (e6, Be7, O-O):</strong> Traditional development</li>
</ul>
`,
    openingTree: [
      { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...f5', fen: 'rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', comment: 'Dutch Defense — fighting for e4' },
    ],
    exercises: [
      { type: 'quiz', question: 'What square does 1...f5 fight for?', options: ['d5', 'e4', 'g4', 'f4'], answer: 1, explanation: '1...f5 fights for control of the e4 square, preventing White from building a classical center with e4.' },
    ]
  },
  {
    id: 'kings-gambit',
    title: 'King\'s Gambit',
    difficulty: 'intermediate',
    theory: `
<h2>King's Gambit — 1.e4 e5 2.f4</h2>
<p>One of the oldest and most romantic openings. White sacrifices a pawn for rapid development, control of the center, and attacking chances. Fischer called it "a bust" but it remains dangerous at all levels.</p>

<h3>Key Variations</h3>
<ul>
  <li><strong>King's Gambit Accepted (2...exf4):</strong> Black takes the pawn. White plays d4, Bc4 for rapid development</li>
  <li><strong>King's Gambit Declined (2...Bc5):</strong> Solid, targeting f2</li>
  <li><strong>Falkbeer Counter-Gambit (2...d5):</strong> Black counter-sacrifices for initiative</li>
</ul>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: '' },
      { move: '2.f4', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2', comment: 'King\'s Gambit — romantic chess at its finest' },
    ],
    exercises: [
      { type: 'quiz', question: 'What does White sacrifice in the King\'s Gambit?', options: ['A knight', 'The f-pawn', 'A bishop', 'A rook'], answer: 1, explanation: 'White offers the f-pawn with 2.f4. If Black takes (2...exf4), White aims for rapid development with d4, Bc4, and Bxf4.' },
    ]
  },
  {
    id: 'scotch-game',
    title: 'Scotch Game',
    difficulty: 'intermediate',
    theory: `
<h2>Scotch Game — 1.e4 e5 2.Nf3 Nc6 3.d4</h2>
<p>An open, tactical opening where White immediately challenges Black's center. Kasparov revived it in his 1990 World Championship match against Karpov.</p>

<h3>Main Lines</h3>
<ul>
  <li><strong>Scotch Four Knights (3...exd4 4.Nxd4 Nf6):</strong> Classical, balanced play</li>
  <li><strong>Scotch Gambit (3...exd4 4.Bc4):</strong> Sacrificing a pawn for development</li>
  <li><strong>Mieses Variation (4...Nf6 5.Nxc6 bxc6 6.e5):</strong> Active, forcing play</li>
</ul>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: '' },
      { move: '2.Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', comment: '' },
      { move: '2...Nc6', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', comment: '' },
      { move: '3.d4', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3', comment: 'Scotch Game — immediate central confrontation' },
    ],
    exercises: [
      { type: 'quiz', question: 'Who revived the Scotch Game at the highest level?', options: ['Fischer', 'Carlsen', 'Kasparov', 'Tal'], answer: 2, explanation: 'Kasparov revived the Scotch in his 1990 World Championship match against Karpov, using it as a surprise weapon.' },
    ]
  },
  {
    id: 'petroff-defense',
    title: 'Petroff Defense',
    difficulty: 'intermediate',
    theory: `
<h2>Petroff Defense (Russian Game) — 1.e4 e5 2.Nf3 Nf6</h2>
<p>One of the most solid and drawish openings. Black counterattacks e4 instead of defending e5. It's a favorite of players seeking equality with Black, including Kramnik and Caruana.</p>

<h3>Main Line</h3>
<p>After 3.Nxe5 d6 4.Nf3 Nxe4 5.d4, both sides develop naturally. The symmetrical structure often leads to equal endings, but White retains a small initiative.</p>
`,
    openingTree: [
      { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: '' },
      { move: '2.Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', comment: '' },
      { move: '2...Nf6', fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', comment: 'Petroff — counter-attacking e4 instead of defending e5' },
    ],
    exercises: [
      { type: 'quiz', question: 'Why is the Petroff considered very solid?', options: ['It leads to a closed position', 'The symmetrical structure gives Black easy equality', 'It avoids all tactics', 'Black always wins'], answer: 1, explanation: 'The Petroff leads to symmetrical positions where Black achieves equality relatively easily, making it hard for White to create winning chances.' },
    ]
  },
  {
    id: 'trompowsky',
    title: 'Trompowsky Attack',
    difficulty: 'intermediate',
    theory: `
<h2>Trompowsky Attack — 1.d4 Nf6 2.Bg5</h2>
<p>A modern anti-Indian system that avoids the massive theory of the Nimzo/Queen's Indian. White pins the knight immediately, often creating doubled pawns after Bxf6.</p>

<h3>Key Ideas</h3>
<ul>
  <li>If Black plays ...e6, Bg5 retreats or exchanges on f6</li>
  <li>If Black plays ...Ne4 (the main line), White gets the bishop pair after Bf4 or Bh4</li>
  <li>Raptor Variation: 2...d5 3.Bxf6 exf6 — Black gets doubled pawns but the bishop pair</li>
</ul>
`,
    openingTree: [
      { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
      { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
      { move: '2.Bg5', fen: 'rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 2 2', comment: 'Trompowsky — pinning the knight immediately' },
    ],
    exercises: [
      { type: 'quiz', question: 'What is the Trompowsky trying to avoid?', options: ['Exchanging queens', 'The massive theory of Nimzo/Queen\'s Indian', 'Open positions', 'Castling'], answer: 1, explanation: 'By playing 2.Bg5 instead of 2.c4, White avoids the deeply-analyzed Nimzo-Indian and Queen\'s Indian lines.' },
    ]
  },
];

export default extendedOpenings;
