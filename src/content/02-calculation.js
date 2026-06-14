// ChessOS — Content: Calculation Training

export const calculationContent = {
  id: 'calculation',
  title: 'Calculation Training',
  icon: '🧠',
  description: 'Develop your ability to see ahead. Learn candidate moves, forcing sequences, and visualization techniques used by grandmasters.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'candidate-moves',
      title: 'Candidate Moves',
      difficulty: 'intermediate',
      theory: `
<h2>Candidate Moves — The Foundation of Calculation</h2>
<p>Before calculating variations, you must identify the <strong>candidate moves</strong> — the moves worth considering. Alexander Kotov, in his classic "Think Like a Grandmaster," defined the process:</p>
<ol>
  <li><strong>Identify all forcing moves:</strong> checks, captures, and threats</li>
  <li><strong>Evaluate each candidate:</strong> calculate the consequences</li>
  <li><strong>Make your decision:</strong> choose the best continuation</li>
</ol>

<h3>The Forcing Moves Hierarchy</h3>
<ul>
  <li><strong>Checks</strong> — the most forcing (opponent MUST respond)</li>
  <li><strong>Captures</strong> — often force a recapture</li>
  <li><strong>Threats</strong> — force defensive action</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The CCT Method</div>
  <p><strong>Checks, Captures, Threats</strong> — always consider these three categories first when analyzing any position. This systematic approach ensures you don't miss critical tactical possibilities.</p>
</div>

<h3>Avoiding Tunnel Vision</h3>
<p>A common mistake is to calculate only the first candidate that looks promising. Always consider at least 2-3 candidate moves before going deep into any one line. Grandmasters typically identify 3-5 candidates per move.</p>
`,
      exercises: [
        { type: 'find-candidates', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', question: 'Identify the top 3 candidate moves for White', solution: ['Ng5', 'd3', 'O-O'], explanation: 'Ng5 (attacking f7), d3 (solid development), and O-O (king safety) are the main candidates. Ng5 is the most forcing.' },
        { type: 'find-candidates', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', question: 'List the candidate moves', solution: ['O-O', 'c3', 'd3', 'Nc3', 'b4'], explanation: 'Multiple reasonable candidates exist. O-O and c3 are the most popular, leading to the Italian Game main lines.' }
      ],
      puzzles: [
        { id: 'calc_cand_01', fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7', solution: 'Bg5', theme: 'Candidate Moves', difficulty: 'intermediate', explanation: 'Bg5 pins the knight and creates pressure. Other candidates: a4, Be3, h3.' },
        { id: 'calc_cand_02', fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQ - 4 4', solution: 'Nxe5', theme: 'Forcing Candidate', difficulty: 'intermediate', explanation: 'Nxe5 is a forcing capture. After Nxe5, White can play d4 with tempo. Always check captures first!' }
      ]
    },
    {
      id: 'calculation-depth',
      title: 'Calculation Depth Training',
      difficulty: 'intermediate',
      theory: `
<h2>Building Calculation Depth</h2>
<p>Calculation depth measures how many moves ahead you can see accurately. Club players typically see 2-3 moves ahead; masters see 5-8; grandmasters can see 10-15 in forcing lines.</p>

<h3>2-Ply (1 move ahead)</h3>
<p>See your move and your opponent's best response. Focus on immediate tactics.</p>

<h3>4-Ply (2 moves ahead)</h3>
<p>Your move → opponent's response → your follow-up → opponent's response. This is where most combinations are found.</p>

<h3>6-Ply (3 moves ahead)</h3>
<p>Deep enough for most practical combinations. Many brilliant sacrifices are calculated to this depth.</p>

<h3>Progressive Training Method</h3>
<ol>
  <li>Start with mate-in-1 puzzles (2-ply)</li>
  <li>Progress to mate-in-2 (4-ply)</li>
  <li>Graduate to mate-in-3 (6-ply)</li>
  <li>Practice complex tactical sequences</li>
  <li>Add positional calculation (evaluating final positions)</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 The Tree of Variations</div>
  <p>Visualize calculation as a tree: your candidate moves are the main branches, opponent responses are sub-branches. A key skill is <strong>pruning</strong> — eliminating unpromising branches early to focus calculation on the critical lines.</p>
</div>
`,
      puzzles: [
        { id: 'calc_2ply_01', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: 'Re8#', theme: '2-Ply Mate', difficulty: 'beginner', explanation: 'One move calculation: Re8 is checkmate. The king is trapped behind its pawns.' },
        { id: 'calc_2ply_02', fen: '3qk3/8/8/8/8/8/8/3QK3 w - - 0 1', solution: 'Qd2', theme: '2-Ply', difficulty: 'beginner', explanation: 'Centralizing the queen. Simple one-move thinking.' },
        { id: 'calc_4ply_01', fen: 'r2qk2r/ppp2ppp/2n2n2/2bNp1B1/2B1P3/3P4/PPP2PPP/R2QK2R w KQkq - 0 7', solution: 'Nxf6+', theme: '4-Ply Combination', difficulty: 'intermediate', explanation: 'Nxf6+ gxf6, Bxf6 — winning a pawn and ruining Black\'s king safety. Two moves deep.' },
        { id: 'calc_4ply_02', fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', solution: 'Bxf7+', theme: '4-Ply', difficulty: 'intermediate', explanation: 'Bxf7+ Kxf7, Nxe5+ recovering the piece with an extra pawn.' },
        { id: 'calc_6ply_01', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 0 5', solution: 'Bg5', theme: '6-Ply Plan', difficulty: 'advanced', explanation: 'Bg5 pins the knight. The plan continues with Nd5 (threatening Nxf6+ and Bxf6). Three moves of calculation needed.' },
        { id: 'calc_6ply_02', fen: 'r2q1rk1/pppb1ppp/2n2n2/3pp3/3PP3/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 8', solution: 'dxe5', theme: '6-Ply Sequence', difficulty: 'advanced', explanation: 'dxe5 dxe4, Nxe4 Nxe4, Bxe4 — winning a pawn after a three-move forcing sequence.' }
      ]
    },
    {
      id: 'visualization',
      title: 'Board Visualization',
      difficulty: 'advanced',
      theory: `
<h2>Board Visualization & Blindfold Training</h2>
<p>Visualization — the ability to see positions in your mind without a physical board — is a trainable skill that separates strong players from the rest.</p>

<h3>Why Visualization Matters</h3>
<p>When calculating variations, you need to "see" the resulting position after several moves. If you can't maintain an accurate mental picture, your calculations will have errors.</p>

<h3>Training Methods</h3>
<ul>
  <li><strong>Name that Square:</strong> Practice instantly knowing the color of any square (e.g., d4 is dark, e4 is light)</li>
  <li><strong>Knight Path:</strong> Visualize a knight's path from one square to another</li>
  <li><strong>Piece Placement:</strong> Set up positions from FEN notation in your mind</li>
  <li><strong>Blindfold Puzzles:</strong> Solve simple tactics without looking at a board</li>
  <li><strong>Blindfold Games:</strong> Play simple games without seeing the board (advanced)</li>
</ul>

<h3>The Square Color Exercise</h3>
<p>Can you instantly tell the color of any square? Use this rule: if the file letter and rank number are both odd or both even, the square is <strong>dark</strong>. Otherwise, it's <strong>light</strong>. (a=1, b=2, etc.)</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Visualization Benchmark</div>
  <p>Beginner: Can visualize 1-2 moves ahead. Intermediate: 3-4 moves in simple positions. Advanced: 5-6 moves. Expert: 8+ moves in forcing lines. Grandmaster: Can play entire games blindfolded.</p>
</div>
`,
      exercises: [
        { type: 'quiz', question: 'What color is the square f3?', options: ['Light', 'Dark'], answer: 0, explanation: 'f=6 (even), 3 (odd). Even+Odd = Light square. You can verify: f3 is a light square.' },
        { type: 'quiz', question: 'What color is the square d4?', options: ['Light', 'Dark'], answer: 1, explanation: 'd=4 (even), 4 (even). Even+Even = Dark square.' },
        { type: 'quiz', question: 'A knight on a1 needs minimum how many moves to reach h8?', options: ['4', '5', '6', '7'], answer: 2, explanation: 'A knight needs at least 6 moves to travel from a1 to h8 (opposite corner). Try: a1-b3-c5-d7-f8-g6-h8.' },
        { type: 'quiz', question: 'Which piece always stays on squares of one color?', options: ['Knight', 'Bishop', 'Rook', 'Queen'], answer: 1, explanation: 'The bishop always moves diagonally, so it can never change its square color.' }
      ],
      puzzles: [
        { id: 'viz_01', fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', solution: 'Visualization Exercise', theme: 'Knight Movement', difficulty: 'beginner', explanation: 'From e4, trace the knight to every possible square it can reach in exactly 2 moves. This builds your knight vision.' },
        { id: 'viz_02', fen: '8/8/8/8/4B3/8/8/8 w - - 0 1', solution: 'Visualization Exercise', theme: 'Diagonal Vision', difficulty: 'beginner', explanation: 'The bishop on e4 controls two diagonals. Name all squares it can reach. Practice seeing long diagonals instantly.' }
      ]
    }
  ]
};

export default calculationContent;
