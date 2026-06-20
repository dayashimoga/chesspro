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
    },
    {
      id: 'dynamic-vs-static',
      title: 'Dynamic vs Static Advantages',
      difficulty: 'expert',
      theory: `
<h2>Understanding Advantage Types</h2>
<p>Every chess advantage falls into one of two categories, and understanding the difference is critical for correct decision-making.</p>

<h3>Static Advantages (Permanent)</h3>
<ul>
  <li><strong>Material advantage:</strong> Extra pieces or pawns</li>
  <li><strong>Better pawn structure:</strong> Fewer weaknesses, passed pawns</li>
  <li><strong>Bishop pair:</strong> Long-term piece advantage</li>
  <li><strong>Permanent outposts:</strong> Squares that can't be challenged</li>
</ul>

<h3>Dynamic Advantages (Temporary)</h3>
<ul>
  <li><strong>Development lead:</strong> More pieces in play (fades as opponent catches up)</li>
  <li><strong>Initiative:</strong> Tempo advantage (fades if not converted)</li>
  <li><strong>King safety imbalance:</strong> One king exposed (can be resolved)</li>
  <li><strong>Piece activity:</strong> Better-placed pieces (opponent can regroup)</li>
</ul>

<h3>The Conversion Process</h3>
<p>The art of chess strategy is converting dynamic advantages into static ones before they evaporate. A development lead should be converted into a structural advantage or material gain. Initiative should be converted into a lasting positional plus.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Steinitz's Accumulation Theory</div>
  <p>Small advantages accumulate. You don't need one big advantage — many small ones (slightly better structure + slightly more active pieces + slightly safer king) combine into a decisive advantage.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'A development lead is what type of advantage?', options: ['Static', 'Dynamic', 'Permanent', 'Material'], answer: 1, explanation: 'A development lead is dynamic — it fades as the opponent catches up. You must act quickly to convert it.' },
        { type: 'quiz', question: 'To convert a dynamic advantage, you should...', options: ['Wait patiently', 'Act quickly before it fades', 'Exchange all pieces', 'Move your king to safety'], answer: 1, explanation: 'Dynamic advantages are temporary. You must act decisively to convert them into permanent (static) advantages.' }
      ]
    },
    {
      id: 'fortress-concepts',
      title: 'Fortress & Drawing Techniques',
      difficulty: 'expert',
      theory: `
<h2>The Fortress — Drawing From Inferior Positions</h2>
<p>A fortress is a defensive setup that cannot be broken, even against a significant material advantage. Recognizing fortress patterns can save many "lost" games.</p>

<h3>Common Fortress Types</h3>
<ul>
  <li><strong>Rook + pawn vs Queen:</strong> The rook stays close to the king, creating a drawing mechanism</li>
  <li><strong>Wrong-color bishop + rook pawn:</strong> The bishop doesn't control the promotion square corner</li>
  <li><strong>Opposite-colored bishops:</strong> The defender blockades on the opposite color</li>
  <li><strong>Rook + bishop vs Rook:</strong> Theoretical draw with correct defense (Philidor position)</li>
</ul>

<h3>Creating a Fortress</h3>
<ol>
  <li>Identify if a fortress pattern exists in your position</li>
  <li>Exchange attacking pieces to reach the fortress structure</li>
  <li>Place your pieces on their fortress squares</li>
  <li>Never deviate from the fortress unless forced</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 Practical Importance</div>
  <p>At the top level, fortress knowledge saves many half-points. Knowing when a position is theoretically drawn gives confidence to defend actively rather than passively surrendering.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'A fortress is...', options: ['An attacking formation', 'A defensive setup that cannot be broken', 'A pawn structure', 'An opening system'], answer: 1, explanation: 'A fortress is a defensive position that holds a draw even against a material advantage, because the opponent cannot make progress.' }
      ]
    },
    {
      id: 'opposite-color-bishops',
      title: 'Opposite-Colored Bishop Strategies',
      difficulty: 'expert',
      theory: `
<h2>Opposite-Colored Bishops — The Great Equalizer</h2>
<p>Opposite-colored bishops (each side has a bishop on a different color) create unique dynamics that every advanced player must understand.</p>

<h3>In the Middlegame: Attacking Advantage</h3>
<p>With queens and rooks still on the board, opposite-colored bishops FAVOR the attacker because:</p>
<ul>
  <li>The defender's bishop cannot block the attacker's bishop</li>
  <li>The attacker can create threats on squares the defender's bishop doesn't control</li>
  <li>It's like playing with an extra piece on the attack</li>
</ul>

<h3>In the Endgame: Drawing Tendency</h3>
<p>In pure bishop endgames (no other pieces), opposite-colored bishops strongly favor a draw because:</p>
<ul>
  <li>The defender can blockade on the opposite color</li>
  <li>Even two extra pawns may not be enough to win</li>
  <li>The defender's bishop covers squares the attacker's pawns need</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The Rule of Two Pawns</div>
  <p>In opposite-colored bishop endings, even a two-pawn advantage may not be enough to win. The defender places the bishop on the correct color and creates a blockade. However, if the pawns are far apart (both flanks), winning chances increase.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'In the middlegame, opposite-colored bishops favor...', options: ['The defender', 'The attacker', 'Neither side', 'The side with more pawns'], answer: 1, explanation: 'In the middlegame with queens and rooks, opposite-colored bishops favor the attacker because the defender\'s bishop cannot block the attacker\'s threats.' },
        { type: 'quiz', question: 'In a pure opposite-colored bishop endgame, two extra pawns...', options: ['Always win', 'May not be enough to win', 'Guarantee a draw', 'Are meaningless'], answer: 1, explanation: 'Two extra pawns may not win if the defender can blockade on the right color. However, widely separated pawns give better winning chances.' }
      ]
    },
    {
      id: 'rook-endgame-mastery',
      title: 'Rook Endgame Mastery',
      difficulty: 'expert',
      theory: `
<h2>Rook Endgames — The Most Common Endgame</h2>
<p>Approximately 50% of all endgames are rook endgames. Mastering them is essential for competitive chess.</p>

<h3>Key Principles</h3>
<ul>
  <li><strong>Activity over material:</strong> An active rook is worth more than a passive rook + extra pawn</li>
  <li><strong>King centralization:</strong> The king must be active in rook endgames</li>
  <li><strong>Rook behind passed pawns:</strong> Place your rook behind passed pawns (yours or opponent's)</li>
  <li><strong>7th rank:</strong> A rook on the 7th rank is enormously powerful</li>
  <li><strong>Cut off the king:</strong> Use your rook to cut off the enemy king from the action</li>
</ul>

<h3>Critical Positions</h3>
<ul>
  <li><strong>Lucena Position:</strong> K+R+P vs K+R where the pawn side wins by "building the bridge"</li>
  <li><strong>Philidor Position:</strong> The drawing technique — keep the rook on the 3rd rank, then check from behind</li>
  <li><strong>Vancura Position:</strong> Drawing with rook pawn using lateral rook</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Tarrasch's Rule</div>
  <p>"Rooks belong behind passed pawns." Whether it's your own passed pawn or your opponent's, place the rook behind it. Your rook gains space as your pawn advances; against the enemy's pawn, your rook gains mobility as the pawn advances.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'The most important principle in rook endgames is...', options: ['Material count', 'Rook activity', 'Pawn structure', 'King safety'], answer: 1, explanation: 'Activity is the most important factor in rook endgames. An active rook can be worth more than a passive rook plus an extra pawn.' },
        { type: 'quiz', question: 'Where should you place your rook relative to a passed pawn?', options: ['In front of it', 'Behind it', 'Next to it', 'Anywhere'], answer: 1, explanation: 'Tarrasch\'s rule: rooks belong behind passed pawns, whether it\'s your own or the opponent\'s.' }
      ]
    },
    {
      id: 'practical-decision-making',
      title: 'Practical Decision-Making at the Board',
      difficulty: 'expert',
      theory: `
<h2>Making Better Decisions Under Pressure</h2>
<p>Tournament chess requires making dozens of critical decisions under time pressure. Developing a systematic decision-making process improves accuracy.</p>

<h3>The Candidate Moves Method (Kotov)</h3>
<ol>
  <li><strong>Identify candidates:</strong> List 3-5 promising moves</li>
  <li><strong>Analyze each:</strong> Calculate the main line for each candidate</li>
  <li><strong>Evaluate:</strong> Compare the resulting positions</li>
  <li><strong>Choose:</strong> Select the move leading to the best position</li>
  <li><strong>Verify:</strong> Double-check for blunders before playing</li>
</ol>

<h3>The Blunder-Check</h3>
<p>Before making ANY move, perform a quick blunder-check:</p>
<ul>
  <li>Does my move leave any piece undefended?</li>
  <li>Does my move allow a check, capture, or threat?</li>
  <li>Am I forgetting about any of my opponent's pieces?</li>
  <li>Is there a forcing sequence my opponent can play?</li>
</ul>

<h3>Clock Management</h3>
<p>Spend time proportionally to the importance of the position:</p>
<ul>
  <li><strong>Known positions:</strong> Move quickly, save time</li>
  <li><strong>Critical moments:</strong> Invest time — these moves decide the game</li>
  <li><strong>Equal positions:</strong> Make reasonable moves at moderate speed</li>
  <li><strong>Time trouble:</strong> Simplify, avoid complications, trust your instincts</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The Two-Minute Rule</div>
  <p>If you can't see a clear forced win, limit your think time to 2-3 minutes per move. Prolonged thinking rarely finds solutions that initial analysis missed, and it creates dangerous time pressure later.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'The Candidate Moves method starts with...', options: ['Calculating one move deeply', 'Listing 3-5 promising moves', 'Checking the clock', 'Evaluating the position'], answer: 1, explanation: 'The Candidate Moves method begins by identifying 3-5 promising moves, then analyzing each systematically before choosing.' },
        { type: 'quiz', question: 'Before making any move, you should always...', options: ['Check the evaluation', 'Perform a blunder-check', 'Look at your opponent', 'Write the move down'], answer: 1, explanation: 'A quick blunder-check before every move prevents the most common cause of losses — overlooking simple tactics.' }
      ]
    },
    {
      id: 'competitive-mindset',
      title: 'The Competitive Mindset',
      difficulty: 'advanced',
      theory: `
<h2>Developing a Champion's Mindset</h2>
<p>The difference between good players and great players often comes down to psychology and mental fortitude, not chess knowledge.</p>

<h3>Before the Game</h3>
<ul>
  <li><strong>Preparation:</strong> Study your opponent's recent games and known weaknesses</li>
  <li><strong>Physical readiness:</strong> Good sleep, proper nutrition, light exercise</li>
  <li><strong>Mental warm-up:</strong> Solve a few puzzles to activate your chess brain</li>
  <li><strong>Confidence:</strong> Remind yourself of your best games and training</li>
</ul>

<h3>During the Game</h3>
<ul>
  <li><strong>Stay in the present:</strong> Focus on the current position, not past mistakes</li>
  <li><strong>Maintain objectivity:</strong> Evaluate honestly, don't fall in love with bad plans</li>
  <li><strong>Manage emotions:</strong> Don't let frustration or excitement cloud judgment</li>
  <li><strong>Use your opponent's time:</strong> Think during their turn</li>
</ul>

<h3>After the Game</h3>
<ul>
  <li><strong>Win or lose, analyze:</strong> Always review the game, ideally with your opponent</li>
  <li><strong>Learn, don't blame:</strong> Focus on lessons, not excuses</li>
  <li><strong>Recover mentally:</strong> Take a break before the next round</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Kasparov's Philosophy</div>
  <p>"Chess is mental torture." The best players embrace the difficulty and find motivation in the challenge. Every game is an opportunity to learn and grow stronger.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'During a game, the most important mental skill is...', options: ['Confidence', 'Objectivity', 'Aggression', 'Speed'], answer: 1, explanation: 'Objectivity is crucial — you must honestly evaluate the position and adjust your plans accordingly, not persist with flawed ideas.' },
        { type: 'quiz', question: 'After losing a game, you should...', options: ['Stop playing for a week', 'Analyze the game to learn from mistakes', 'Ignore it and move on', 'Change your entire opening repertoire'], answer: 1, explanation: 'Always analyze lost games — they are your best learning opportunities. Find the critical moments and understand what went wrong.' }
      ]
    }
  ]
};

export default advancedContent;
