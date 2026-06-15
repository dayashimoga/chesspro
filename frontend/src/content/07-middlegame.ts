// ChessOS — Content: Middlegame

export const middlegameContent = {
  id: 'middlegame',
  title: 'Middlegame Mastery',
  icon: '⚡',
  description: 'Master the transition from opening to middlegame. Learn attacking techniques, defensive resources, and how to create and execute plans.',
  difficulty: 'advanced',
  modules: [
    {
      id: 'attack-king',
      title: 'Attacking the King',
      difficulty: 'intermediate',
      theory: `
<h2>Attacking the Castled King</h2>
<p>A successful kingside attack requires specific conditions and techniques. Don't attack without reason — first verify that the prerequisites exist.</p>

<h3>Prerequisites for Attack</h3>
<ul>
  <li><strong>Center control or closure:</strong> You need a stable center before attacking on a wing. If the center opens while your pieces are committed to the flank, a central counterattack can be devastating.</li>
  <li><strong>Piece superiority on the attacking wing:</strong> You should have more pieces aimed at the king than the defender has protecting it.</li>
  <li><strong>Structural weaknesses:</strong> Targets like a fianchettoed king without the bishop, or advanced/missing pawns near the king.</li>
</ul>

<h3>The Greek Gift Sacrifice (Bxh7+)</h3>
<p>One of the most famous attacking patterns. After Bxh7+ Kxh7, Ng5+ Kg8 (Kg6 leads to mate), Qh5 — White has a devastating attack. Requirements: bishop on d3, knight on f3, queen access to h5, pawn on e5 (or control of e5).</p>

<h3>Pawn Storms</h3>
<p>When you've castled on opposite sides, a pawn storm (advancing pawns toward the enemy king) is standard strategy. The key is speed — your attack must arrive before your opponent's.</p>

<h3>Piece Sacrifices on h7/g7/f7</h3>
<p>These sacrifices open lines to the enemy king. Typical patterns include Bxh7+, Nxg7, Bxf7+ — each requires specific supporting pieces to make the sacrifice work.</p>
`,
      puzzles: [
        { id: 'attack_01', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/2B1P1b1/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7', solution: 'Bxf7+', theme: 'Sacrifice on f7', difficulty: 'intermediate', explanation: 'Bxf7+ removes the defender of e6 and exposes the king.' },
        { id: 'attack_02', fen: 'r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2NBPN2/PPP2PPP/R2Q1RK1 w - - 0 9', solution: 'Bxh7+', theme: 'Greek Gift', difficulty: 'advanced', explanation: 'Bxh7+ Kxh7, Ng5+ Kg8, Qh5 — the classic Greek Gift sacrifice.' }
      ]
    },
    {
      id: 'defense',
      title: 'Defensive Techniques',
      difficulty: 'advanced',
      theory: `
<h2>The Art of Defense</h2>
<p>Defense in chess is as important as attack, yet it's often neglected in study. The best defenders — Petrosian, Karpov, Carlsen — win by making their positions impregnable, then slowly outplaying their opponents.</p>

<h3>Defensive Principles</h3>
<ul>
  <li><strong>Don't panic:</strong> Stay calm and look for the best defensive resources</li>
  <li><strong>Exchange attacking pieces:</strong> Trade the opponent's most dangerous pieces</li>
  <li><strong>Create counterplay:</strong> Don't just defend — create your own threats</li>
  <li><strong>Seek simplification:</strong> In a worse position, trade toward a drawable endgame</li>
  <li><strong>Use tactical tricks:</strong> Stalemate, perpetual check, fortress</li>
</ul>

<h3>Petrosian's Method</h3>
<p>Tigran Petrosian, the "Iron Tigran," would preemptively eliminate opponent threats before they materialized — prophylaxis combined with exchanging dangerous pieces.</p>
`,
      puzzles: [
        { id: 'def_01', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4', solution: 'O-O', theme: 'King Safety', difficulty: 'beginner', explanation: 'O-O gets the king to safety. Defense starts with a safe king.' },
        { id: 'def_02', fen: 'r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7', solution: 'h3', theme: 'Prophylaxis', difficulty: 'intermediate', explanation: 'h3 asks the bishop its intentions, a prophylactic move preventing ...Bg4-h5 ideas.' }
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Transitions',
      difficulty: 'advanced',
      theory: `
<h2>Strategic Planning</h2>
<p>A plan is a series of moves aimed at achieving a specific goal. Good planning requires understanding the position's demands — what does the position want?</p>

<h3>Silman's Thinking Technique</h3>
<ol>
  <li><strong>Assess imbalances:</strong> Material, pawn structure, space, piece activity, king safety, initiative</li>
  <li><strong>Identify your advantages and weaknesses</strong></li>
  <li><strong>Create a plan that uses your advantages</strong> or addresses your weaknesses</li>
  <li><strong>Execute the plan</strong> while remaining tactically alert</li>
</ol>

<h3>Middlegame to Endgame Transition</h3>
<p>Knowing when to trade into an endgame is a crucial skill. Trade when you have a lasting advantage (material, better structure). Avoid trading when your position is dynamic and depends on piece activity.</p>
`,
      exercises: [
        { type: 'quiz', question: 'When should you transition to an endgame?', options: ['Always', 'When you have a dynamic advantage', 'When you have a lasting structural/material advantage', 'Never'], answer: 2, explanation: 'Transition to endgames when your advantage is static (material, structure). Dynamic advantages favor keeping pieces on.' }
      ]
    }
  ]
};

export default middlegameContent;
