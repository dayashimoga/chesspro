// ChessOS — Content: Calculation Training (Fully Interactive)

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
      examples: [
        { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', title: 'Candidate Search', description: 'Ng5 (attacking f7), d3 (solid development), and O-O (king safety) are the main candidates. Ng5 is the most forcing.' }
      ],
      demoSteps: [
        {
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
          commentary: 'Italian Game. Let\'s find candidate moves targeting the weak f7 square using Checks, Captures, and Threats.',
          arrows: [{ from: 'c4', to: 'f7', color: 'rgba(239, 68, 68, 0.8)' }]
        },
        {
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 4 4',
          commentary: 'Move 1: Ng5 is an active candidate move that directly attacks f7. Black is forced to respond with d5.',
          arrows: [{ from: 'g5', to: 'f7', color: 'rgba(239, 68, 68, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
          instruction: 'Move your knight to g5 to attack f7.',
          expectedMove: 'Ng5',
          correctFeedback: 'Excellent! Ng5 is the most active, forcing candidate move.',
          incorrectFeedback: 'Try placing the knight on g5.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the correct priority sequence for identifying candidates?', options: ['Threats → Captures → Checks', 'Checks → Captures → Threats', 'Development → Defense → Attack'], answer: 1, explanation: 'Checks, Captures, and Threats (CCT) is the correct hierarchy of forcing moves.' }
      ],
      masteryPositions: [
        {
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
          description: 'Calculate and sacrifice the bishop on f7 to draw out Black\'s king.',
          solution: ['Bxf7+'],
          conceptTested: 'Forcing Sacrifice Candidate',
          maxAttempts: 3
        }
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
`,
      examples: [
        { fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', title: '2-Ply Back Rank', description: 'One move calculation: Re8 is checkmate. The king is trapped behind its pawns.' }
      ],
      demoSteps: [
        {
          fen: 'r2qk2r/ppp2ppp/2n2n2/2bNp1B1/2B1P3/3P4/PPP2PPP/R2QK2R w KQkq - 0 7',
          commentary: 'Let\'s calculate a 4-ply (2 moves deep) exchange sequence. The knight on d5 is key.'
        },
        {
          fen: 'r2qk2r/ppp2ppp/2n1Bn2/2bNp1B1/2B1P3/3P4/PPP2PPP/R2QK2R w KQkq - 0 7',
          commentary: 'Step 1: White plays Nxf6+ (check). Black is forced to respond.'
        },
        {
          fen: 'r2qk2r/ppp2p1p/2n1Bp2/2bNp1B1/2B1P3/3P4/PPP2PPP/R2QK2R w KQkq - 0 7',
          commentary: 'Step 2: Black recaptures with gxf6. White will follow up next.'
        }
      ],
      guidedSteps: [
        {
          fen: 'r2qk2r/ppp2ppp/2n2n2/2bNp1B1/2B1P3/3P4/PPP2PPP/R2QK2R w KQkq - 0 7',
          instruction: 'Calculate the recapture threat: capture the knight on f6.',
          expectedMove: 'Nxf6+',
          correctFeedback: 'Great! Nxf6+ forces Black to ruin their pawn structure.',
          incorrectFeedback: 'Look at the knight on f6.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'How many plys represent a sequence of 3 full moves?', options: ['3', '6', '9'], answer: 1, explanation: 'Each ply is a half-move (one player\'s turn). 3 full moves = 6 plys.' }
      ],
      masteryPositions: [
        {
          fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
          description: 'Deliver checkmate in one move (2-ply).',
          solution: ['Re8#'],
          conceptTested: 'Back rank mate',
          maxAttempts: 3
        }
      ]
    },
    {
      id: 'visualization',
      title: 'Board Visualization',
      difficulty: 'advanced',
      theory: `
<h2>Board Visualization & Blindfold Training</h2>
<p>Visualization — the ability to see positions in your mind without a physical board — is a trainable skill that separates strong players from the rest.</p>

<h3>The Square Color Exercise</h3>
<p>Can you instantly tell the color of any square? Use this rule: if the file letter and rank number are both odd or both even, the square is <strong>dark</strong>. Otherwise, it's <strong>light</strong>. (a=1, b=2, etc.)</p>
`,
      examples: [
        { fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', title: 'Knight Sight', description: 'From e4, visualize the squares the knight can reach in 1 move.' }
      ],
      demoSteps: [
        {
          fen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
          commentary: 'Let\'s visualize the knight on e4 hopping to c5.',
          arrows: [{ from: 'e4', to: 'c5', color: 'rgba(16, 185, 129, 0.8)' }]
        }
      ],
      guidedSteps: [
        {
          fen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
          instruction: 'Move the knight from e4 to c5.',
          expectedMove: 'Nc5',
          correctFeedback: 'Correct! You visualized the knight\'s move perfectly.',
          incorrectFeedback: 'Try moving the knight to c5.'
        }
      ],
      exercises: [
        { type: 'quiz', question: 'What color is the d4 square?', options: ['Light', 'Dark'], answer: 1, explanation: 'd is file 4, rank is 4. Both even = Dark.' }
      ],
      masteryPositions: [
        {
          fen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
          description: 'Jump the knight to f6.',
          solution: ['Nf6'],
          conceptTested: 'Knight visualization',
          maxAttempts: 3
        }
      ]
    }
  ]
};

export default calculationContent;
