// ChessOS — Content: Advanced Chess & Tournament Preparation

export const advancedContent = {
  id: 'advanced',
  title: 'Advanced Chess & Tournament Prep',
  icon: '🎯',
  description: 'Advanced topics for competitive players: exchange sacrifices, positional sacrifices, tournament psychology, time management, and engine-assisted analysis.',
  difficulty: 'expert',
  modules: [
    {
      id: 'positional-sacrifices',
      title: 'Positional & Exchange Sacrifices',
      difficulty: 'expert',
      theory: `
<h2>Positional Sacrifices</h2>
<p>Unlike tactical sacrifices (which lead to forced sequences), positional sacrifices yield <strong>long-term strategic advantages</strong> — improved piece activity, pawn structure, or initiative — without a clear forced win.</p>

<h3>The Exchange Sacrifice (Rook for Minor Piece)</h3>
<p>Petrosian popularized the exchange sacrifice. Giving up a rook (5 points) for a knight or bishop (3 points) can be justified when:</p>
<ul>
  <li>It eliminates a dangerous enemy piece (especially a strong knight on an outpost)</li>
  <li>It destroys the opponent's pawn structure</li>
  <li>The minor piece gained is more active than the lost rook</li>
  <li>The remaining position favors minor pieces over rooks (closed position)</li>
</ul>

<h3>Pawn Sacrifices for Positional Compensation</h3>
<p>A pawn sacrifice in the opening or early middlegame for:</p>
<ul>
  <li>Development advantage</li>
  <li>Control of key squares</li>
  <li>Open lines for your pieces</li>
  <li>Initiative</li>
</ul>

<h3>The Benko Gambit Philosophy</h3>
<p>1.d4 Nf6 2.c4 c5 3.d5 b5 — Black sacrifices a pawn for lasting queenside pressure with ...a6, ...Bxa6, and rooks on the a and b files. The compensation lasts deep into the endgame.</p>
`,
      puzzles: [
        { id: 'exch_01', fen: 'r1bq1rk1/ppp1nppp/3p4/3Np3/2B5/8/PPP2PPP/R1BQ1RK1 w - - 0 10', solution: 'Rxf7', theme: 'Exchange Sacrifice', difficulty: 'expert', explanation: 'Rxf7 sacrifices the exchange to demolish Black\'s kingside and create a lasting attack.' },
        { id: 'pos_sac_01', fen: 'r1bqkbnr/pppppppp/2n5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 3', solution: 'd5', theme: 'Positional Pawn Sacrifice', difficulty: 'advanced', explanation: 'd5 sacrifices a pawn for rapid development and control of the center.' }
      ]
    },
    {
      id: 'tournament-psychology',
      title: 'Tournament Psychology',
      difficulty: 'advanced',
      theory: `
<h2>Chess Psychology & Tournament Preparation</h2>

<h3>Pre-Game Preparation</h3>
<ul>
  <li><strong>Study your opponent:</strong> Review their recent games, opening repertoire, and playing style</li>
  <li><strong>Prepare surprises:</strong> Have a novelty or unusual line ready</li>
  <li><strong>Physical preparation:</strong> Sleep, nutrition, and exercise matter enormously</li>
  <li><strong>Mental preparation:</strong> Visualization, confidence, and focus</li>
</ul>

<h3>Time Management</h3>
<ul>
  <li><strong>Opening (10-15% of time):</strong> Move quickly in known territory</li>
  <li><strong>Critical moments (40-50% of time):</strong> Spend time where it matters — key decisions, complex tactics</li>
  <li><strong>Endgame (20-30% of time):</strong> Reserve enough time for accurate endgame play</li>
  <li><strong>Buffer (10%):</strong> Always maintain a time buffer for unexpected complications</li>
</ul>

<h3>Dealing with Adversity</h3>
<ul>
  <li>After a loss, analyze objectively but don't dwell</li>
  <li>In a losing position, create maximum practical problems</li>
  <li>When winning, don't relax — maintain concentration</li>
  <li>Trust your preparation and training</li>
</ul>

<h3>The Inner Game</h3>
<p>Chess is as much a psychological battle as a board battle. Maintaining composure, managing time pressure, and staying focused for 4-6 hours are skills that require training, just like tactics and strategy.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Lasker's Wisdom</div>
  <p>"When you see a good move, look for a better one." — Emanuel Lasker. This principle prevents hasty decisions and leads to deeper, more accurate play.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'How much of your time should you spend on critical positions?', options: ['10%', '20%', '40-50%', '80%'], answer: 2, explanation: 'About 40-50% of your time should be reserved for the most critical moments — key decisions and complex tactical positions.' },
        { type: 'quiz', question: 'After losing a game, you should...', options: ['Stop playing', 'Analyze objectively and move on', 'Change your opening repertoire', 'Play faster next time'], answer: 1, explanation: 'After a loss, analyze the game objectively to learn from mistakes, but don\'t dwell on it. Maintain confidence for the next game.' }
      ]
    },
    {
      id: 'engine-analysis',
      title: 'Engine-Assisted Analysis',
      difficulty: 'expert',
      theory: `
<h2>Using Chess Engines Effectively</h2>
<p>Chess engines are the most powerful analytical tools available, but they must be used correctly to improve your understanding rather than create dependency.</p>

<h3>How to Analyze with Engines</h3>
<ol>
  <li><strong>Analyze on your own first:</strong> Before turning on the engine, form your own evaluation and find candidate moves</li>
  <li><strong>Let the engine run:</strong> Give it adequate time (at least 30 seconds per move for meaningful analysis)</li>
  <li><strong>Understand WHY:</strong> Don't just note the engine's best move — understand why it's best. What does the engine see that you missed?</li>
  <li><strong>Focus on critical moments:</strong> Analyze positions where you were unsure, not every move</li>
</ol>

<h3>Engine Limitations</h3>
<ul>
  <li>Engines evaluate positions, not plans — they don't explain strategic concepts</li>
  <li>Engine evaluations of +0.3 vs +0.1 are often meaningless for human play</li>
  <li>Closed positions may require very deep analysis for accurate evaluation</li>
  <li>Engine "best moves" may not be the best practical moves for humans</li>
</ul>

<h3>Evaluation Interpretation</h3>
<ul>
  <li><code>0.0</code>: Equal position</li>
  <li><code>+0.5</code>: Slight advantage for White</li>
  <li><code>+1.0</code>: Clear advantage (roughly a pawn)</li>
  <li><code>+2.0</code>: Winning advantage</li>
  <li><code>+3.0+</code>: Decisive advantage</li>
  <li><code>M5</code>: Mate in 5 moves</li>
</ul>
`,
      exercises: [
        { type: 'quiz', question: 'When analyzing with an engine, you should first...', options: ['Turn on the engine immediately', 'Analyze on your own first', 'Skip to the endgame', 'Look at opening theory'], answer: 1, explanation: 'Always analyze on your own first, then check with the engine. This develops your analytical skills rather than creating dependency.' }
      ]
    }
  ]
};

export default advancedContent;
