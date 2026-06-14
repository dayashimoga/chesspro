// ChessOS — Content: Strategy

export const strategyContent = {
  id: 'strategy',
  title: 'Strategic Chess',
  icon: '🏰',
  description: 'Understand the deep positional principles that govern chess: pawn structures, piece placement, space, and long-term planning.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'pawn-structures',
      title: 'Pawn Structures',
      difficulty: 'intermediate',
      theory: `
<h2>Pawn Structure — The Skeleton of the Position</h2>
<p>Philidor called pawns "the soul of chess." The pawn structure determines the character of the position: which pieces are strong, where to attack, and what plans to pursue.</p>

<h3>Isolated Pawns</h3>
<p>An isolated pawn has no friendly pawns on adjacent files. It cannot be defended by other pawns and becomes a target. However, an isolated d-pawn (IQP) can be a dynamic advantage because:</p>
<ul>
  <li>It controls key central squares (c5, e5)</li>
  <li>It provides open files for rooks on c and e files</li>
  <li>It creates attacking chances with d4-d5 breakthrough</li>
</ul>
<p>The IQP is strong in the middlegame (active pieces compensate) but weak in the endgame (no pieces to support it).</p>

<h3>Doubled Pawns</h3>
<p>Two pawns of the same color on the same file. Generally a weakness because they can't protect each other and one may become a target. However, doubled pawns can control important squares and open files for rooks.</p>

<h3>Backward Pawns</h3>
<p>A pawn that cannot be advanced because the square in front is controlled by an enemy pawn, and it cannot be supported by adjacent pawns. The square in front of a backward pawn is often a strong outpost for the opponent.</p>

<h3>Hanging Pawns</h3>
<p>Two adjacent pawns (usually on c4 and d4 or c5 and d5) with no pawns on adjacent files. They can be dynamic (if advanced, they create space) or weak (if blockaded, they become targets).</p>

<h3>Passed Pawns</h3>
<p>A pawn with no enemy pawns ahead of it on the same or adjacent files. Passed pawns are extremely powerful, especially in the endgame, because they threaten promotion. <em>"A passed pawn is a criminal which should be kept under lock and key."</em> — Nimzowitsch</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Pawn Majority</div>
  <p>A pawn majority on one side of the board (e.g., 3 vs. 2 on the queenside) can create a passed pawn. The side with the majority should advance those pawns to create a passer.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9', title: 'Isolated Queen Pawn (IQP)', description: 'White has an isolated d4 pawn. It controls c5 and e5, but is a long-term weakness.' },
        { fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 7', title: 'Central Pawn Duo', description: 'White\'s pawns on d4 and e4 control the center powerfully.' },
        { fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 6', title: 'Pawn Chain', description: 'White has a pawn chain (c3-d4-e5). Pawns support each other in a diagonal formation.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is an isolated pawn?', options: ['A pawn with no adjacent friendly pawns', 'A pawn that has been captured', 'A pawn on the edge of the board', 'A pawn that cannot move'], answer: 0, explanation: 'An isolated pawn has no friendly pawns on adjacent files to support it.' },
        { type: 'quiz', question: 'A passed pawn is dangerous because...', options: ['It attacks more squares', 'It threatens to promote', 'It blocks the opponent\'s rook', 'It\'s worth more points'], answer: 1, explanation: 'A passed pawn has a clear path to promotion with no enemy pawns to stop it.' }
      ]
    },
    {
      id: 'piece-activity',
      title: 'Piece Activity & Outposts',
      difficulty: 'intermediate',
      theory: `
<h2>Piece Activity</h2>
<p>The activity and coordination of your pieces is often more important than material count. A well-placed knight can be worth more than a poorly-placed rook.</p>

<h3>Outposts</h3>
<p>An outpost is a square (usually in the opponent's half of the board) that cannot be attacked by enemy pawns. Knights on outposts are particularly powerful because:</p>
<ul>
  <li>They cannot be driven away by pawns</li>
  <li>They control important squares deep in enemy territory</li>
  <li>They can only be removed by piece exchanges</li>
</ul>

<h3>Good Bishop vs. Bad Bishop</h3>
<p>A bishop is "good" when most of its pawns are on the opposite color, leaving its diagonals open. A "bad" bishop is blocked by its own pawns. When you have a bad bishop, try to trade it or get your pawns off its color.</p>

<h3>Rook Activity</h3>
<ul>
  <li><strong>Open files:</strong> Place rooks on files with no pawns</li>
  <li><strong>Half-open files:</strong> Files with only enemy pawns</li>
  <li><strong>7th rank:</strong> A rook on the 7th rank attacks enemy pawns and restricts the king</li>
  <li><strong>Doubling rooks:</strong> Two rooks on the same file multiply their power</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The Principle of Two Weaknesses</div>
  <p>When your opponent has one weakness, they can usually defend it. To win, create a <strong>second weakness</strong> on a different part of the board. The defender cannot cover both simultaneously, and you can switch the point of attack.</p>
</div>
`,
      examples: [
        { fen: 'r1bq1rk1/ppp2ppp/2n2n2/3Np3/2B1P3/8/PPPP1PPP/R1BQ1RK1 w - - 0 7', title: 'Knight Outpost', description: 'White\'s knight on d5 is a powerful outpost — it cannot be attacked by Black\'s pawns and dominates the center.' },
        { fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 6', title: 'Open File Control', description: 'After piece exchanges, rooks will contest the open c-file.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What makes a knight outpost strong?', options: ['It\'s in the center', 'Enemy pawns can\'t attack it', 'It\'s protected by a pawn', 'All of the above'], answer: 3, explanation: 'The ideal outpost is centralized, safe from pawn attacks, and supported by a friendly pawn.' },
        { type: 'quiz', question: 'Where do rooks belong?', options: ['On closed files', 'Behind friendly pawns', 'On open files', 'In the corner'], answer: 2, explanation: 'Rooks need open or half-open files to exert maximum influence.' }
      ]
    },
    {
      id: 'space-initiative',
      title: 'Space & Initiative',
      difficulty: 'advanced',
      theory: `
<h2>Space Advantage</h2>
<p>Space is the amount of territory your pieces can access. A space advantage gives your pieces more room to maneuver while cramping your opponent's pieces.</p>

<h3>How Space Works</h3>
<p>Pawns define space. Pawns on the 4th and 5th ranks control squares in the opponent's territory. A space advantage is valuable because:</p>
<ul>
  <li>Your pieces have more mobility</li>
  <li>You can transfer pieces between flanks more easily</li>
  <li>The opponent's pieces are cramped and poorly coordinated</li>
  <li>You have more options for attack</li>
</ul>

<h2>Initiative</h2>
<p>The initiative means you are dictating the play — making threats that your opponent must respond to. The side with the initiative controls the game's tempo and direction.</p>

<h3>Maintaining Initiative</h3>
<ul>
  <li>Create threats with every move</li>
  <li>Keep your opponent on the defensive</li>
  <li>Don't waste time on passive moves</li>
  <li>Convert initiative to a lasting advantage before it dissipates</li>
</ul>

<h2>Prophylaxis</h2>
<p>Prophylaxis is thinking about your opponent's plans and preventing them. Before making your own move, ask: <em>"What does my opponent want to do?"</em> — then stop it. Petrosian and Karpov were masters of prophylactic thinking.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Dynamic vs Static Advantages</div>
  <p><strong>Static advantages</strong> (better structure, bishop pair, extra material) persist. <strong>Dynamic advantages</strong> (initiative, piece activity, development lead) are temporary and must be converted. The art of strategy is converting dynamic advantages into static ones.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'What is prophylaxis?', options: ['An aggressive attack', 'Preventing your opponent\'s plans', 'Sacrificing material', 'Trading pieces'], answer: 1, explanation: 'Prophylaxis is the art of anticipating and preventing your opponent\'s plans before they materialize.' },
        { type: 'quiz', question: 'Dynamic advantages should be...', options: ['Ignored', 'Converted to static advantages', 'Traded for material', 'Maintained forever'], answer: 1, explanation: 'Dynamic advantages (initiative, activity) are temporary and should be converted to lasting static advantages.' }
      ]
    }
  ]
};

export default strategyContent;
