// ChessOS — Expanded Middlegame Content (Complete Middlegame University)
// Covers: Pawn Structures, Weak Squares, Outposts, Open Files, Initiative,
// Space, Piece Activity, Prophylaxis, Attack, Defense, Counterplay, Transformation

export const middlegameContent = {
  id: 'middlegame',
  title: 'Middlegame Mastery',
  icon: '⚔️',
  description: 'Master the art of middlegame strategy — from pawn structures and piece activity to attacking and defensive techniques.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'pawn-structures',
      title: 'Pawn Structures',
      difficulty: 'intermediate',
      theory: `
<h2>Pawn Structures — The Skeleton of the Position</h2>
<p>Pawn structures determine the character of the position. They dictate where your pieces belong, what plans are appropriate, and which endgames are favorable.</p>

<h3>Common Pawn Structures</h3>
<ul>
  <li><strong>Isolated Queen's Pawn (IQP):</strong> Dynamic play — the pawn controls central squares but is a long-term weakness</li>
  <li><strong>Hanging Pawns:</strong> Two connected pawns without support — dynamic but vulnerable</li>
  <li><strong>Pawn Chain:</strong> Diagonal chain of pawns (e.g., d4-e5 in the French) — attack the base!</li>
  <li><strong>Doubled Pawns:</strong> Structural weakness but extra open file for rooks</li>
  <li><strong>Passed Pawn:</strong> A pawn with no opposing pawn in front or on adjacent files — extremely powerful in endgames</li>
  <li><strong>Backward Pawn:</strong> A pawn that cannot advance because it would be captured, and its neighbors have already advanced</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Nimzowitsch's Principle</div>
  <p>"First restrain, then blockade, then destroy." A passed pawn must be blockaded by a piece (ideally a knight), then attacked from all sides.</p>
</div>

<h3>Key Concepts</h3>
<ul>
  <li>Every pawn move creates weaknesses — pawns cannot go backward</li>
  <li>The pawn structure determines the optimal piece placement</li>
  <li>Pawn breaks (like c4-c5 or f4-f5) change the structure and create new dynamics</li>
  <li>In the endgame, pawn structure is often the decisive factor</li>
</ul>
`,
      examples: [
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/3P4/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 0 8', title: 'Isolated Queen\'s Pawn', description: 'After cxd5 exd5, Black has an IQP on d5. White targets it; Black seeks dynamic play.' },
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/2ppP3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6', title: 'French Pawn Chain', description: 'The d4-e5 chain. White attacks on the kingside; Black undermines the base with c5 and f6.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What is an isolated queen\'s pawn?', options: ['A pawn on the a-file', 'A pawn with no friendly pawns on adjacent files', 'A pawn that has been doubled', 'A passed pawn'], answer: 1, explanation: 'An IQP has no friendly pawns on adjacent files, making it vulnerable but also giving it dynamic potential.' },
        { type: 'quiz', question: 'According to Nimzowitsch, what should you do with a passed pawn?', options: ['Advance it immediately', 'Trade it off', 'Restrain → Blockade → Destroy', 'Ignore it'], answer: 2, explanation: '"First restrain, then blockade, then destroy" — Nimzowitsch\'s famous strategy against passed pawns.' },
      ]
    },
    {
      id: 'weak-squares',
      title: 'Weak Squares',
      difficulty: 'intermediate',
      theory: `
<h2>Weak Squares & Outposts</h2>
<p>A <strong>weak square</strong> is a square that can no longer be defended by pawns. An <strong>outpost</strong> is a weak square occupied by a piece (usually a knight) that cannot be challenged by enemy pawns.</p>

<h3>Identifying Weak Squares</h3>
<ul>
  <li>Look at the opponent's pawn structure — squares that cannot be protected by pawns are weak</li>
  <li>Common weak squares after ...e5 in the Sicilian: d5 becomes a permanent outpost for White</li>
  <li>After g3, the f3 and h3 squares become potentially weak</li>
  <li>Pawn moves create weaknesses — every advance leaves holes behind</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Knights Love Outposts</div>
  <p>A knight on an outpost is a powerful piece — it's defended by a pawn, cannot be challenged by enemy pawns, and controls key squares. A knight on d5 in the Sicilian can be worth as much as a rook!</p>
</div>
`,
      examples: [
        { fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/2N1BNP1/PPPQPPBP/R4RK1 w - - 0 9', title: 'Outpost on d5', description: 'Nd5 — the knight occupies a powerful outpost that cannot be challenged by pawns.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What makes a square "weak"?', options: ['It\'s occupied by an enemy piece', 'It cannot be defended by pawns', 'It\'s on the edge of the board', 'It\'s unoccupied'], answer: 1, explanation: 'A weak square is one that can no longer be protected by pawns, making it a permanent target for piece occupation.' },
      ]
    },
    {
      id: 'initiative',
      title: 'Initiative & Tempo',
      difficulty: 'advanced',
      theory: `
<h2>Initiative — Making the Opponent React</h2>
<p>The initiative means you are dictating the play — your opponent must respond to your threats rather than creating their own. In chess, having the initiative is a significant advantage.</p>

<h3>How to Gain Initiative</h3>
<ul>
  <li><strong>Faster development:</strong> Get your pieces out quickly and to active squares</li>
  <li><strong>Central control:</strong> Occupy or pressure the center to restrict the opponent</li>
  <li><strong>Creating threats:</strong> Each move should threaten something — even small threats force reactions</li>
  <li><strong>Tempo gains:</strong> Attack pieces to force them to move, gaining time for development</li>
  <li><strong>Piece activity:</strong> An active piece participates in the battle; a passive piece is a liability</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Initiative = Time</div>
  <p>When you have the initiative, you control the TEMPO of the game. Your opponent is always one step behind, reacting rather than acting. The key is to maintain pressure — never let up!</p>
</div>

<h3>Losing the Initiative</h3>
<p>Common ways to lose the initiative: making unnecessary defensive moves, passive piece retreats, exchanging active pieces, and playing without a plan.</p>
`,
      examples: [
        { fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 0 5', title: 'Italian Game Initiative', description: 'White has the initiative through rapid development and central pressure. Ng5 or d4 maintains pressure.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What is the initiative in chess?', options: ['Having more material', 'Dictating the play and forcing reactions', 'Having more pawns', 'Being the first to castle'], answer: 1, explanation: 'The initiative means you control the flow of the game — your opponent must react to your threats.' },
      ]
    },
    {
      id: 'piece-activity',
      title: 'Piece Activity',
      difficulty: 'intermediate',
      theory: `
<h2>Piece Activity — The Life Force of Your Position</h2>
<p>Piece activity is about how well your pieces are placed and how much influence they have over the board. Active pieces control key squares, attack enemy weaknesses, and coordinate with each other.</p>

<h3>Principles of Piece Activity</h3>
<ul>
  <li><strong>Centralization:</strong> Pieces in the center control the most squares</li>
  <li><strong>Coordination:</strong> Pieces working together are more powerful than the sum of their parts</li>
  <li><strong>Mobility:</strong> Pieces should have multiple options and not be restricted</li>
  <li><strong>Bad pieces:</strong> A piece blocked by its own pawns (like a "bad bishop") reduces your effective force</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Improve Your Worst Piece</div>
  <p>When you don't know what to do, identify your worst-placed piece and improve it. This is one of the most practical middlegame rules — it almost always leads to improvement.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P4/2NBPN2/PPP2PPP/R1BQ1RK1 w - - 0 7', title: 'Active vs Passive Pieces', description: 'Both sides have similar material but White\'s pieces are more actively placed — the d3 bishop eyes h7, and the c3 knight supports d5.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What should you do when you don\'t know what to do?', options: ['Move a pawn', 'Trade queens', 'Improve your worst piece', 'Castle'], answer: 2, explanation: '"Improve your worst piece" — one of the most practical pieces of advice in chess.' },
      ]
    },
    {
      id: 'prophylaxis',
      title: 'Prophylaxis',
      difficulty: 'advanced',
      theory: `
<h2>Prophylaxis — Thinking for Your Opponent</h2>
<p>Prophylaxis (or "prophylactic thinking") is the art of asking <strong>"What does my opponent want to do?"</strong> before each move and preventing it. It was perfected by Petrosian and Karpov.</p>

<h3>Prophylactic Thinking Process</h3>
<ol>
  <li>Identify your opponent's ideal plan or best move</li>
  <li>Ask: "Can I prevent this without making concessions?"</li>
  <li>If yes, play the prophylactic move</li>
  <li>If no, ask: "Is my own plan stronger than their threat?"</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 Petrosian's Philosophy</div>
  <p>"The best move is often not the most active one, but the one that prevents the opponent's best plan." Prophylaxis is not passive — it's strategic defense that creates opportunities.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8', title: 'Prophylactic a3', description: 'a3 prevents Nb4 (which would pressure d3) — a classic prophylactic move.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What is prophylaxis?', options: ['Attacking the opponent\'s king', 'Preventing the opponent\'s best plan', 'A medical term only', 'Trading pieces'], answer: 1, explanation: 'Prophylaxis is the art of preventing the opponent\'s best plan before executing your own.' },
      ]
    },
    {
      id: 'attack-defense',
      title: 'Attack & Defense',
      difficulty: 'advanced',
      theory: `
<h2>The Art of Attack & Defense</h2>
<p>Knowing when to attack and when to defend is one of the most important skills in chess. The key is recognizing the signals that indicate which approach is correct.</p>

<h3>When to Attack</h3>
<ul>
  <li>When you have more pieces near the enemy king than your opponent has defenders</li>
  <li>When the opponent's king has moved or lost castling rights</li>
  <li>When pawn structure weaknesses (like h6, g6 without a fianchetto) exist near the king</li>
  <li>When you have a space advantage near the enemy king</li>
  <li>When your pieces are better coordinated for an attack</li>
</ul>

<h3>When to Defend</h3>
<ul>
  <li>When you're under attack — don't panic, find the calmest defense</li>
  <li>When the opponent has the initiative — exchange active pieces to neutralize</li>
  <li>When you have a structural advantage — trade pieces to reach a favorable endgame</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Attack Like Tal, Defend Like Petrosian</div>
  <p>Attack: Don't calculate every variation — feel the position and create threats faster than your opponent can defend. Defend: Stay calm, trade attacking pieces, and trust your position.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/3p4/3P1B2/2N1PN2/PPP1BPPP/R2Q1RK1 w - - 0 8', title: 'Kingside Attack Setup', description: 'White has developed toward the kingside. Qd3 + Bxh7+ sacrifice is a common attacking pattern.' },
      ],
      exercises: [
        { type: 'quiz', question: 'When should you attack the enemy king?', options: ['Always', 'When you have more pieces near their king than they have defenders', 'Only in the endgame', 'When you\'re losing'], answer: 1, explanation: 'Attack when you have more pieces aimed at the enemy king than your opponent has defenders — numerical superiority at the point of attack.' },
      ]
    },
    {
      id: 'transformation',
      title: 'Transformation of Advantages',
      difficulty: 'expert',
      theory: `
<h2>Transformation of Advantages</h2>
<p>One of the deepest concepts in chess strategy: converting one type of advantage into another. A temporary advantage (like the initiative) must be transformed into a permanent one (like a better pawn structure) before it evaporates.</p>

<h3>Types of Advantage Transformation</h3>
<ul>
  <li><strong>Material → Position:</strong> Sacrifice material for a lasting positional advantage</li>
  <li><strong>Initiative → Material:</strong> Use your active pieces to win material</li>
  <li><strong>Space → Attack:</strong> Use your space advantage to launch a kingside attack</li>
  <li><strong>Development → Initiative:</strong> Use faster development to seize the initiative</li>
  <li><strong>Tactics → Endgame:</strong> Use tactical threats to force a favorable endgame</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Steinitz's Theory</div>
  <p>Wilhelm Steinitz, the first World Champion, taught that advantages accumulate gradually. Once you have enough small advantages, you can transform them into a decisive combination. The art is knowing WHEN to transform.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/3P4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8', title: 'Accumulating Advantages', description: 'White gradually accumulates small advantages — better development, central pressure — before transforming into a direct attack.' },
      ],
      exercises: [
        { type: 'quiz', question: 'What is "transformation of advantages"?', options: ['Trading queens', 'Converting one type of advantage into another', 'Promoting a pawn', 'Castling on the opposite side'], answer: 1, explanation: 'Transformation means converting a temporary advantage (like initiative) into a permanent one (like better pawn structure or material).' },
      ]
    },
  ]
};

export default middlegameContent;
