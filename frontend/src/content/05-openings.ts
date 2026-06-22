// ChessOS — Content: Opening Mastery

export const openingsContent = {
  id: 'openings',
  title: 'Opening Mastery',
  icon: '📖',
  description: 'Learn the most important chess openings with main lines, sidelines, traps, typical tactics, and middlegame plans.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'italian-game',
      title: 'Italian Game',
      difficulty: 'beginner',
      theory: `
<h2>The Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4)</h2>
<p>One of the oldest and most classical openings, dating back to the 16th century. The Italian Game develops the bishop to an active diagonal aimed at f7, the weakest point in Black's position.</p>

<h3>Main Ideas for White</h3>
<ul>
  <li>Control the center with d3 or d4</li>
  <li>Attack the vulnerable f7 square</li>
  <li>Rapid development and early castling</li>
  <li>Build pressure with c3 and d4</li>
</ul>

<h3>Main Line: Giuoco Piano (3...Bc5)</h3>
<p>The "Quiet Game" — both bishops develop to active diagonals. Play continues with 4.c3 (preparing d4) or 4.d3 (the modern approach).</p>

<h3>Two Knights Defense (3...Nf6)</h3>
<p>A sharper alternative. Black immediately counterattacks e4. After 4.Ng5 (attacking f7) or 4.d3 (quiet), the positions become highly tactical.</p>

<h3>Traps</h3>
<p><strong>Fried Liver Attack:</strong> After 3...Nf6 4.Ng5 d5 5.exd5 Nxd5?? 6.Nxf7! — White sacrifices the knight on f7, drawing the king out. This leads to a powerful attack after 6...Kxf7 7.Qf3+ Ke6 8.Nc3.</p>
`,
      openingTree: [
        { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: 'King\'s pawn opening' },
        { move: '1...e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: 'Open game' },
        { move: '2.Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', comment: 'Attacks e5, develops with tempo' },
        { move: '2...Nc6', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', comment: 'Defends e5' },
        { move: '3.Bc4', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', comment: 'Italian Game — targets f7' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the main target for White in the Italian Game?', options: ['d5', 'f7', 'e5', 'c6'], answer: 1, explanation: 'The bishop on c4 and potential Ng5 both target the f7 square, which is only defended by the king.' },
        { type: 'quiz', question: 'What does 4.c3 prepare in the Italian Game?', options: ['Castling', 'Nc3', 'd4', 'b4'], answer: 2, explanation: '4.c3 prepares the central advance d4, fighting for control of the center.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', commentary: 'The Italian Game begins with 1.e4, establishing a pawn in the center and opening paths for the queen and bishop.' },
        { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', commentary: 'Black mirrors with 1...e5. White plays 2.Nf3 to attack e5 and develop a knight actively.' },
        { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', commentary: 'After 2...Nc6 defending e5, White plays 3.Bc4. This Bishop placement targets the weak f7 square directly.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', instruction: 'Claim the center with 1.e4!', expectedMove: 'e4', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! 1.e4 is the most popular opening move.', incorrectFeedback: 'Move the pawn on e2 to e4.', hints: ['Pawn on e2 to e4'] },
        { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', instruction: 'Develop your knight to f3 to attack the e5 pawn.', expectedMove: 'Nf3', highlights: [{ square: 'f3', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Great! 2.Nf3 develops with tempo by creating an immediate threat.', incorrectFeedback: 'Move the knight to f3.', hints: ['Knight on g1 to f3'] },
        { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', instruction: 'Develop the light-squared bishop to c4, aiming at the weakest point on f7.', expectedMove: 'Bc4', highlights: [{ square: 'c4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Beautiful! The Italian bishop is now actively placed.', incorrectFeedback: 'Move the bishop to c4.', hints: ['Bishop on f1 to c4'] }
      ],
      masteryPositions: [
        { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', description: 'Attack the f7 square actively with Ng5.', solution: ['Ng5'], conceptTested: 'Fried Liver setup', maxAttempts: 3 }
      ]
    },
    {
      id: 'ruy-lopez',
      title: 'Ruy Lopez',
      difficulty: 'intermediate',
      theory: `
<h2>Ruy Lopez (Spanish Game) — 1.e4 e5 2.Nf3 Nc6 3.Bb5</h2>
<p>The Ruy Lopez is considered the most important opening in chess. Named after a 16th-century Spanish priest, it has been a battleground for world champions for over a century.</p>

<h3>Strategic Ideas</h3>
<p>The bishop on b5 doesn't capture the knight immediately — it <strong>pins it</strong> and threatens to remove the defender of e5. The key strategic idea is to maintain tension and build a strong center.</p>

<h3>Morphy Defense (3...a6)</h3>
<p>The most popular response. 3...a6 asks the bishop its intentions. After 4.Ba4, Black plays ...Nf6, ...Be7, and ...b5 (the classic Closed Ruy Lopez setup).</p>

<h3>Berlin Defense (3...Nf6)</h3>
<p>Made famous by Kramnik's victory over Kasparov in 2000. After 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5, the resulting "Berlin Wall" endgame is extremely solid for Black but hard to win.</p>

<h3>Marshall Attack (8...d5)</h3>
<p>A famous gambit where Black sacrifices a pawn for a fierce kingside attack. 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5!? — a dynamic sacrifice that has been tested at the highest levels.</p>
`,
      openingTree: [
        { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: '' },
        { move: '2.Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', comment: '' },
        { move: '2...Nc6', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', comment: '' },
        { move: '3.Bb5', fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', comment: 'Ruy Lopez — pins the knight, puts pressure on e5' }
      ],
      exercises: [
        { type: 'quiz', question: 'Why doesn\'t White capture Bxc6 immediately?', options: ['It\'s illegal', 'Maintaining the pin is stronger', 'The bishop is trapped', 'It loses tempo'], answer: 1, explanation: 'Maintaining the pin with 3.Bb5 creates lasting pressure. Capturing immediately gives Black the bishop pair and open b-file.' }
      ],
      demoSteps: [
        { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', commentary: 'After 1.e4 e5 2.Nf3 Nc6, White places the bishop on b5, threatening to remove the defender of the e5 pawn.' }
      ],
      guidedSteps: [
        { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', instruction: 'Develop your bishop to b5 to create structural pressure.', expectedMove: 'Bb5', highlights: [{ square: 'b5', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! You entered the Ruy Lopez.', incorrectFeedback: 'Move your bishop to b5.', hints: ['Bishop on f1 to b5'] }
      ],
      masteryPositions: [
        { fen: 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', description: 'Retreat the bishop to a4 to maintain the pin on the knight (Ba4).', solution: ['Ba4'], conceptTested: 'Bishop retreat in Morphy defense', maxAttempts: 3 }
      ]
    },
    {
      id: 'queens-gambit',
      title: 'Queen\'s Gambit',
      difficulty: 'intermediate',
      theory: `
<h2>Queen's Gambit — 1.d4 d5 2.c4</h2>
<p>The Queen's Gambit is one of the oldest and most respected openings. Despite its name, it's not a true gambit — White can always recover the pawn. The aim is to undermine Black's d5 pawn and gain central control.</p>

<h3>Queen's Gambit Declined (2...e6)</h3>
<p>The classical, solid response. Black maintains the d5 pawn but locks in the light-squared bishop behind the pawn chain. Key plans:</p>
<ul>
  <li>Black aims for ...c5 or ...dxc4 followed by ...c5</li>
  <li>The minority attack (b4-b5) is White's typical queenside plan</li>
  <li>White often plays for a central space advantage</li>
</ul>

<h3>Queen's Gambit Accepted (2...dxc4)</h3>
<p>Black takes the pawn, temporarily conceding the center. The modern interpretation is not to hold the pawn but to develop quickly with ...a6, ...b5, ...Bb7. White plays e3 and Bxc4 to recover the pawn.</p>

<h3>Slav Defense (2...c6)</h3>
<p>Black supports d5 with a pawn while keeping the light-squared bishop's path open (unlike in the QGD). After 3.Nf3 Nf6 4.Nc3, Black can play ...dxc4 (Slav) or ...e6 (Semi-Slav).</p>
`,
      openingTree: [
        { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: 'Queen\'s pawn opening' },
        { move: '1...d5', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', comment: 'Symmetric center' },
        { move: '2.c4', fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: 'Queen\'s Gambit — challenges d5' }
      ],
      exercises: [
        { type: 'quiz', question: 'Is the Queen\'s Gambit a true gambit?', options: ['Yes, White permanently sacrifices a pawn', 'No, White can always recover the pawn'], answer: 1, explanation: 'The Queen\'s Gambit is not a true gambit. After 2...dxc4, White can recover the pawn with e3 and Bxc4.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', commentary: 'White offers the c-pawn with 2.c4 to distract Black\'s d5 pawn from the center.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', instruction: 'Play c4 to challenge Black\'s central pawn.', expectedMove: 'c4', highlights: [{ square: 'c4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! The c4 push defines the Queen\'s Gambit.', incorrectFeedback: 'Move the pawn on c2 to c4.', hints: ['c2 to c4'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/ppp1pppp/8/8/2pP4/4P3/PP3PPP/RNBQKBNR w KQkq - 0 3', description: 'Recover the gambited pawn by capturing on c4 (Bxc4).', solution: ['Bxc4'], conceptTested: 'Recovering the gambit pawn', maxAttempts: 3 }
      ]
    },
    {
      id: 'sicilian-defense',
      title: 'Sicilian Defense',
      difficulty: 'intermediate',
      theory: `
<h2>Sicilian Defense — 1.e4 c5</h2>
<p>The most popular and statistically the highest-scoring response to 1.e4. The Sicilian creates an <strong>asymmetrical pawn structure</strong>, leading to sharp, dynamic play where both sides have winning chances.</p>

<h3>Why the Sicilian Works</h3>
<p>1...c5 immediately fights for the d4 square without committing to a symmetric structure. After an eventual d4 by White (usually after 2.Nf3 and 3.d4), Black captures cxd4, gaining a central pawn majority (d and e pawns vs. White's e-pawn) and the half-open c-file.</p>

<h3>Open Sicilian (2.Nf3, 3.d4)</h3>
<p>The main line. White opens the center quickly. Major variations include:</p>
<ul>
  <li><strong>Najdorf (5...a6):</strong> Bobby Fischer's weapon. The most theoretically demanding.</li>
  <li><strong>Dragon (5...g6):</strong> Black fianchettoes the bishop. The Yugoslav Attack (6.Be3 Bg7 7.f3) leads to mutual kingside/queenside attacks.</li>
  <li><strong>Classical (5...Nc6):</strong> Solid development, Kasparov played this extensively.</li>
  <li><strong>Scheveningen (5...e6):</strong> Flexible pawn structure, allows ...d5 later.</li>
</ul>

<h3>Anti-Sicilians</h3>
<p>White can avoid the Open Sicilian with systems like the Closed Sicilian (2.Nc3), Grand Prix Attack (2.Nc3, 3.f4), Alapin (2.c3), or Smith-Morra Gambit (2.d4 cxd4 3.c3).</p>
`,
      openingTree: [
        { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...c5', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: 'Sicilian Defense — fights for d4' },
        { move: '2.Nf3', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', comment: '' },
        { move: '2...d6', fen: 'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3', comment: 'Most common — prepares ...Nf6' },
        { move: '3.d4', fen: 'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3', comment: 'Open Sicilian begins' }
      ],
      exercises: [
        { type: 'quiz', question: 'Why is 1...c5 the most popular reply to 1.e4?', options: ['It\'s the safest move', 'It creates asymmetry with winning chances for both sides', 'It controls e4', 'It develops a piece'], answer: 1, explanation: 'The Sicilian creates an asymmetric position. Statistically it gives Black the best winning chances while White retains advantage.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', commentary: 'As Black, playing 1...c5 creates an asymmetrical center, stopping White from getting an easy d4 push.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', instruction: 'As Black, launch the Sicilian Defense with c5!', expectedMove: 'c5', highlights: [{ square: 'c5', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! You entered the Sicilian.', incorrectFeedback: 'Move the c7 pawn to c5.', hints: ['c7 to c5'] },
        { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', instruction: 'Play d6 to prepare development and control e5.', expectedMove: 'd6', highlights: [{ square: 'd6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Nice! This is the most common continuation.', incorrectFeedback: 'Move your d-pawn to d6.', hints: ['d7 to d6'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3', description: 'Capture White\'s d4 pawn to open the c-file (cxd4).', solution: ['cxd4'], conceptTested: 'Exchange in Open Sicilian', maxAttempts: 3 }
      ]
    },
    {
      id: 'london-system',
      title: 'London System',
      difficulty: 'beginner',
      theory: `
<h2>London System — 1.d4, 2.Nf3, 3.Bf4</h2>
<p>The London System is one of the most popular "system" openings at all levels. It's a solid, reliable setup that can be played against virtually any Black response.</p>

<h3>Key Setup</h3>
<p>White's ideal setup: pawns on d4 and e3, bishop on f4, knights on f3 and d2, and king castled short. This setup is nearly universal regardless of Black's response.</p>

<h3>Advantages</h3>
<ul>
  <li>Requires minimal memorization</li>
  <li>Solid and reliable at all levels</li>
  <li>The Bf4 develops before e3 blocks it in</li>
  <li>Leads to comfortable middlegame positions</li>
</ul>

<h3>Plans</h3>
<ul>
  <li>Control e5 with d4 + Nf3 (+ e3 if needed)</li>
  <li>Kingside attack with Ne5, Nd2-f3-e5</li>
  <li>c4 break when appropriate</li>
  <li>Bg3 if the bishop is attacked, maintaining the piece</li>
</ul>
`,
      openingTree: [
        { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...d5', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', comment: '' },
        { move: '2.Nf3', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2', comment: '' },
        { move: '2...Nf6', fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQ - 2 3', comment: '' },
        { move: '3.Bf4', fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3', comment: 'London System — bishop develops before e3' }
      ],
      exercises: [
        { type: 'quiz', question: 'Why does the bishop go to f4 before e3?', options: ['e3 would block the bishop\'s path', 'f4 is a better square', 'It\'s a trap', 'To attack f7'], answer: 0, explanation: 'If White plays e3 first, the dark-squared bishop gets trapped behind the pawn chain. Bf4 must come before e3.' }
      ],
      demoSteps: [
        { fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3', commentary: 'In the London System, White develops the dark-squared bishop to f4 before locking it in with e3.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3', instruction: 'Develop your dark-squared bishop to f4.', expectedMove: 'Bf4', highlights: [{ square: 'f4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! The bishop is active on f4.', incorrectFeedback: 'Move bishop to f4.', hints: ['Bishop on c1 to f4'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 3 3', description: 'Consolidate your center and open lines with e3.', solution: ['e3'], conceptTested: 'London pawn structure support', maxAttempts: 3 }
      ]
    },
    {
      id: 'caro-kann',
      title: 'Caro-Kann Defense',
      difficulty: 'intermediate',
      theory: `
<h2>Caro-Kann Defense — 1.e4 c6</h2>
<p>A solid, reliable defense that aims for ...d5 on the next move. Unlike the French Defense (1...e6), the Caro-Kann keeps the light-squared bishop active. Karpov and Capablanca were notable practitioners.</p>

<h3>Main Variations</h3>
<ul>
  <li><strong>Classical (4...Bf5):</strong> Black develops the bishop outside the pawn chain. Solid and reliable.</li>
  <li><strong>Advance (3.e5):</strong> White grabs space but Black undermines with ...c5 and ...Bf5.</li>
  <li><strong>Exchange (3.exd5):</strong> Leads to symmetrical, often quiet positions.</li>
  <li><strong>Two Knights/Modern (3.Nc3 or 3.Nd2):</strong> Various setups with distinct characters.</li>
</ul>
`,
      openingTree: [
        { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...c6', fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: 'Caro-Kann — prepares ...d5' },
        { move: '2.d4', fen: 'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', comment: '' },
        { move: '2...d5', fen: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3', comment: 'Main position — challenging the center' }
      ],
      exercises: [
        { type: 'quiz', question: 'What advantage does the Caro-Kann have over the French Defense?', options: ['It\'s more aggressive', 'The light-squared bishop isn\'t blocked', 'It wins more games', 'It avoids all theory'], answer: 1, explanation: 'In the French (1...e6), the light-squared bishop is stuck behind the e6-d5 pawn chain. The Caro-Kann avoids this problem.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', commentary: 'The Caro-Kann begins with 1...c6, preparing a solid d5 strike in the center.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', instruction: 'As Black, prepare the d5 push with c6.', expectedMove: 'c6', highlights: [{ square: 'c6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! You entered the Caro-Kann.', incorrectFeedback: 'Move the c7 pawn to c6.', hints: ['c7 to c6'] },
        { fen: 'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', instruction: 'Play d5 to strike at the center.', expectedMove: 'd5', highlights: [{ square: 'd5', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Great! You have challenged White\'s center.', incorrectFeedback: 'Move your d-pawn to d5.', hints: ['d7 to d5'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', description: 'Develop the light-squared bishop outside the pawn structure to f5.', solution: ['Bf5'], conceptTested: 'Light-squared bishop development', maxAttempts: 3 }
      ]
    },
    {
      id: 'french-defense',
      title: 'French Defense',
      difficulty: 'intermediate',
      theory: `
<h2>French Defense — 1.e4 e6</h2>
<p>A solid, counter-attacking opening where Black immediately supports d5. It creates a closed pawn structure with typical battles around the d4 and e5 chain.</p>
`,
      openingTree: [
        { move: '1.e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...e6', fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', comment: 'French Defense — supports d5' },
        { move: '2.d4', fen: 'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', comment: '' },
        { move: '2...d5', fen: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', comment: 'Advance variation center' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is Black\'s main strategic problem in the French Defense?', options: ['Vulnerable king', 'Bad light-squared bishop', 'Lack of space on kingside'], answer: 1, explanation: 'The pawn on e6 blocks the light-squared bishop on c8, which becomes Black\'s "bad bishop" for the rest of the game.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', commentary: 'The French Defense starts with 1...e6, preparing ...d5 while maintaining a solid pawn chain.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', instruction: 'As Black, prepare the d5 push with e6.', expectedMove: 'e6', highlights: [{ square: 'e6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! You entered the French Defense.', incorrectFeedback: 'Move the e7 pawn to e6.', hints: ['e7 to e6'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', description: 'Attack White\'s center with c5.', solution: ['c5'], conceptTested: 'French center counter-attack', maxAttempts: 3 }
      ]
    },
    {
      id: 'kings-indian',
      title: 'King\'s Indian Defense',
      difficulty: 'advanced',
      theory: `
<h2>King's Indian Defense — 1.d4 Nf6 2.c4 g6</h2>
<p>A hypermodern defense where Black allows White to occupy the center with pawns, planning to attack and undermine it later. It is highly dynamic and leads to sharp double-edged play.</p>
`,
      openingTree: [
        { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
        { move: '2.c4', fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: '' },
        { move: '2...g6', fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3', comment: 'King\'s Indian setup' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the standard middlegame plan for Black in the King\'s Indian Defense?', options: ['Queenside minority attack', 'Kingside pawn storm with f5-f4', 'Symmetrical trading'], answer: 1, explanation: 'Black usually castles kingside and launches a direct attack on White\'s king with ...f5-f4 and ...g5.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', commentary: 'The King\'s Indian is hypermodern. Black starts with 1...Nf6 controlling the e4 and d5 squares.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', instruction: 'As Black, develop your knight to f6.', expectedMove: 'Nf6', highlights: [{ square: 'f6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Great! You have entered the King\'s Indian territory.', incorrectFeedback: 'Move the knight to f6.', hints: ['Knight on g8 to f6'] },
        { fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', instruction: 'Prepare the bishop fianchetto with g6.', expectedMove: 'g6', highlights: [{ square: 'g6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! Preparing to place the bishop on the long diagonal.', incorrectFeedback: 'Move your g-pawn to g6.', hints: ['g7 to g6'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', description: 'Complete the fianchetto by placing the bishop on g7 (Bg7).', solution: ['Bg7'], conceptTested: 'Bishop fianchetto completion', maxAttempts: 3 }
      ]
    },
    {
      id: 'nimzo-indian',
      title: 'Nimzo-Indian Defense',
      difficulty: 'advanced',
      theory: `
<h2>Nimzo-Indian Defense — 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4</h2>
<p>One of the most respected and solid defenses against 1.d4. Black pins the knight on c3, controlling the e4 square and keeping the pawn structure flexible.</p>
`,
      openingTree: [
        { move: '1.d4', fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', comment: '' },
        { move: '1...Nf6', fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2', comment: '' },
        { move: '2.c4', fen: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', comment: '' },
        { move: '2...e6', fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3', comment: '' },
        { move: '3.Nc3', fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', comment: '' },
        { move: '3...Bb4', fen: 'rnbqk2r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4', comment: 'Nimzo-Indian pinning the knight' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the main strategic purpose of pinning White\'s c3-knight?', options: ['To win the knight immediately', 'To prevent White from playing e4 easily', 'To prepare queenside castling'], answer: 1, explanation: 'By pinning the knight, Black stops White from playing e4 easily, fighting for control of the center using pieces rather than pawns.' }
      ],
      demoSteps: [
        { fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', commentary: 'After 3.Nc3, Black plays 3...Bb4, pinning the knight to the king and preventing an easy 4.e4 push.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', instruction: 'Pin the knight to the king with Bb4!', expectedMove: 'Bb4', highlights: [{ square: 'b4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! You successfully pinned the knight.', incorrectFeedback: 'Move your bishop to b4.', hints: ['Bishop on f8 to b4'] }
      ],
      masteryPositions: [
        { fen: 'rnbqk2r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4', description: 'As White, play Qc2 to defend the pinned knight on c3 and prevent doubled pawns.', solution: ['Qc2'], conceptTested: 'Nimzo-Indian Rubenstein variation', maxAttempts: 3 }
      ]
    }
  ]
};

export default openingsContent;
