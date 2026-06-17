// ChessOS — Expanded Endgame Content (Complete Endgame University)
// Covers: Opposition, Triangulation, Zugzwang, Lucena, Philidor, Rook Endgames,
// Queen Endgames, Minor Piece Endgames, Fortresses, Practical Endgames

export const endgameContent = {
  id: 'endgames',
  title: 'Endgame Mastery',
  icon: '👑',
  description: 'Master the art of converting advantages and defending inferior positions. From basic king and pawn endgames to complex rook endings.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'opposition',
      title: 'Opposition',
      difficulty: 'beginner',
      theory: `
<h2>Opposition — The Key to King & Pawn Endgames</h2>
<p>Opposition is the most fundamental concept in endgame play. Two kings stand in <strong>direct opposition</strong> when they face each other with one square between them on the same rank, file, or diagonal.</p>

<h3>Types of Opposition</h3>
<ul>
  <li><strong>Direct Opposition:</strong> Kings separated by 1 square on the same rank or file</li>
  <li><strong>Distant Opposition:</strong> Kings separated by 3 or 5 squares on the same rank or file</li>
  <li><strong>Diagonal Opposition:</strong> Kings separated diagonally by an odd number of squares</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The Golden Rule</div>
  <p>The player who does NOT have to move holds the opposition. The side with the opposition forces the opponent to give way, gaining access to critical squares.</p>
</div>

<h3>Why Opposition Matters</h3>
<p>In King + Pawn vs King endgames, the stronger side needs the opposition to shepherd the pawn to promotion. Without it, the defender can block the pawn's path.</p>

<h3>Key Squares</h3>
<p>For each pawn position, there are <strong>key squares</strong> — if the attacking king reaches one of these squares, the pawn promotes regardless of whose move it is. For a pawn on the 5th rank, the key squares are the three squares on the 6th rank directly ahead.</p>
`,
      examples: [
        { fen: '8/8/4k3/8/4K3/4P3/8/8 w - - 0 1', title: 'Direct Opposition', description: 'White has the opposition. Black must give way, allowing White\'s king to advance and support the pawn.' },
        { fen: '8/4k3/8/4K3/4P3/8/8/8 w - - 0 1', title: 'Key Squares Concept', description: 'White\'s king is on a key square (e5). The pawn will promote regardless of whose move it is.' },
        { fen: '8/8/8/8/4k3/8/4K3/4P4 w - - 0 1', title: 'Distant Opposition', description: 'With the pawn far back, White needs to advance the king first while maintaining the opposition.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is direct opposition?', options: ['Kings adjacent diagonally', 'Kings facing each other with one square between', 'Kings on the same diagonal', 'Kings on opposite sides'], answer: 1, explanation: 'Direct opposition means the kings face each other with exactly one square between them on the same rank or file.' },
        { type: 'quiz', question: 'Who benefits from having the opposition?', options: ['The player who must move', 'The player who does NOT have to move', 'Always White', 'Always the attacker'], answer: 1, explanation: 'The player who does NOT have to move holds the opposition and can force the opponent to give way.' },
        { type: 'quiz', question: 'What are key squares for a pawn on e5?', options: ['d6, e6, f6', 'd5, e5, f5', 'e7, e8', 'd4, e4, f4'], answer: 0, explanation: 'For a pawn on the 5th rank, the key squares are the three squares directly ahead on the 6th rank.' },
        { type: 'find-move', fen: '8/8/4k3/8/8/4K3/4P3/8 w - - 0 1', question: 'White to move. What is the best move to seize the opposition?', solution: ['Ke4'], explanation: 'Ke4 takes the direct opposition. Now Black must move aside, and White gains ground.' }
      ]
    },
    {
      id: 'triangulation',
      title: 'Triangulation',
      difficulty: 'intermediate',
      theory: `
<h2>Triangulation — Losing a Tempo with Purpose</h2>
<p>Triangulation is a maneuver where the king makes a triangular path (3 moves) to return to a square it previously occupied, effectively <strong>losing a tempo</strong> to transfer the move to the opponent.</p>

<h3>When to Triangulate</h3>
<p>Triangulation is used when the current position would be winning if it were the opponent's turn to move (zugzwang). By triangulating, you achieve the same position with the opponent to move.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 The Triangulation Recipe</div>
  <p>1. Identify a position where the opponent in zugzwang would lose<br/>
  2. Find three squares the king can traverse in a triangle<br/>
  3. Make the triangular maneuver to arrive at the same position with the opponent to move</p>
</div>

<h3>Classic Example</h3>
<p>White King on d4, Black King on d6, White pawn on e4. White plays Kc4 (step 1), Kc5 (step 2), Kd5 (step 3) — arriving at the same relative position but now it's Black to move.</p>
`,
      examples: [
        { fen: '8/8/3k4/8/3KP3/8/8/8 w - - 0 1', title: 'Triangulation Setup', description: 'White needs to reach this position with Black to move. The triangulation path is Kc4-Kc5-Kd5.' },
        { fen: '8/8/1k6/1p6/1P6/1K6/8/8 w - - 0 1', title: 'Mutual Zugzwang', description: 'Whoever moves loses. White triangulates Ka4-Ka3-Kb3 to put Black in zugzwang.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the purpose of triangulation?', options: ['To gain material', 'To lose a tempo and transfer the move', 'To promote a pawn', 'To reach a stalemate'], answer: 1, explanation: 'Triangulation loses a tempo so the opponent must move in a position of zugzwang.' },
        { type: 'quiz', question: 'How many moves does a basic triangulation require?', options: ['1', '2', '3', '4'], answer: 2, explanation: 'A triangulation uses 3 king moves to return to the same position with the opponent to move.' }
      ]
    },
    {
      id: 'zugzwang',
      title: 'Zugzwang',
      difficulty: 'intermediate',
      theory: `
<h2>Zugzwang — When Moving Is Losing</h2>
<p>Zugzwang (German: "compulsion to move") is a situation where the obligation to make a move puts the player at a disadvantage. If they could "pass," they would be fine — but chess requires you to move.</p>

<h3>Recognizing Zugzwang</h3>
<ul>
  <li>The player to move has no useful moves — every legal move worsens their position</li>
  <li>Most common in endgames with few pieces</li>
  <li>Can be <strong>mutual zugzwang</strong> — whoever moves loses</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Zugzwang Patterns</div>
  <p>Look for zugzwang when: the opponent's king is restricted, pieces are locked, and any move breaks a defensive formation. Creating zugzwang is the primary weapon in many endgames.</p>
</div>
`,
      examples: [
        { fen: '8/8/p1p5/1p1p4/1P1Pk3/2P1p3/2K1P3/8 b - - 0 1', title: 'Mutual Zugzwang', description: 'A famous mutual zugzwang. Whoever moves loses — every move breaks a critical pawn structure.' },
        { fen: '8/8/1k6/1p6/1P6/1K6/8/8 b - - 0 1', title: 'Simple Zugzwang', description: 'Black to move must abandon the defense of b5 or allow White to penetrate.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is zugzwang?', options: ['A German opening', 'A position where being forced to move is a disadvantage', 'A type of checkmate', 'A draw condition'], answer: 1, explanation: 'Zugzwang means any move you make worsens your position.' },
        { type: 'quiz', question: 'In which phase of the game is zugzwang most common?', options: ['Opening', 'Middlegame', 'Endgame', 'All phases equally'], answer: 2, explanation: 'Zugzwang is most common in endgames when there are few pieces and mobility is limited.' }
      ]
    },
    {
      id: 'lucena-position',
      title: 'Lucena Position',
      difficulty: 'intermediate',
      theory: `
<h2>The Lucena Position — The Most Important Rook Endgame</h2>
<p>The Lucena position is a <strong>winning configuration</strong> in rook and pawn vs. rook endgames. Mastering it is essential because it arises (or can be steered toward) in a huge percentage of practical rook endgames.</p>

<h3>The Position</h3>
<p>White has a pawn on the 7th rank with the king in front of the pawn. Black's rook checks from the side, preventing the king from emerging.</p>

<h3>The Bridge-Building Technique</h3>
<ol>
  <li>Move the rook to the 4th rank (the "bridge position")</li>
  <li>Step the king to the side, using the rook as a shelter from checks</li>
  <li>Advance the rook to cut off the enemy king — this is the "bridge"</li>
  <li>The king emerges and the pawn promotes</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 The Bridge</div>
  <p>The rook on the 4th rank acts as a "bridge" — it blocks lateral checks once the king steps aside. This technique is one of the most important in all of chess.</p>
</div>
`,
      examples: [
        { fen: '1K1k4/1P6/8/8/8/8/1r6/5R2 w - - 0 1', title: 'Lucena Position', description: 'White wins by building a bridge: Rf4! then Kc7, Rc4+, and the king shelters behind the rook.' },
        { fen: '3K4/3P1k2/8/8/8/8/4r3/5R2 w - - 0 1', title: 'Bridge in Action', description: 'Rf4 starts the bridge. After Re4-Ke7, the rook interposes on e4 blocking checks.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the first step in the bridge-building technique?', options: ['Advance the pawn', 'Move king to the side', 'Place the rook on the 4th rank', 'Give check'], answer: 2, explanation: 'The rook goes to the 4th rank first to prepare the bridge position.' },
        { type: 'quiz', question: 'Why is the Lucena position important?', options: ['It is rare', 'It demonstrates stalemate', 'It is the most common winning technique in rook endgames', 'It only applies to knight endgames'], answer: 2, explanation: 'The Lucena position and bridge technique is the fundamental winning method in rook endgames.' }
      ]
    },
    {
      id: 'philidor-position',
      title: 'Philidor Position',
      difficulty: 'intermediate',
      theory: `
<h2>The Philidor Position — The Key to Defending Rook Endgames</h2>
<p>The Philidor position is the <strong>drawing technique</strong> for the defending side in rook and pawn vs. rook endgames. It is the counterpart to the Lucena position.</p>

<h3>The Defensive Setup</h3>
<p>Place your rook on the <strong>3rd rank</strong> (6th rank for Black) — this prevents the enemy king from advancing past the 6th rank. Wait until the pawn advances to the 6th rank, then switch to <strong>checking from behind</strong>.</p>

<h3>Two-Phase Defense</h3>
<ol>
  <li><strong>Phase 1 — Passive Defense:</strong> Keep the rook on the 3rd rank, preventing the king from advancing</li>
  <li><strong>Phase 2 — Active Defense:</strong> Once the pawn reaches the 6th rank, go to the back rank and give perpetual checks from behind</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 Philidor's Rule</div>
  <p>The rook on the 3rd rank is passive but effective. The moment the pawn advances to the 6th rank (blocking the king's shelter), switch to back-rank checking. The exposed king can never escape the checks.</p>
</div>
`,
      examples: [
        { fen: '8/3k4/8/3KP3/8/3r4/8/4R3 b - - 0 1', title: 'Philidor Defense Setup', description: 'Black\'s rook on d3 prevents the White king from advancing. This is the key defensive position.' },
        { fen: '4k3/8/4KP2/8/8/8/8/4r3 b - - 0 1', title: 'Back-Rank Checking', description: 'The pawn has reached the 6th rank, so Black switches to checking from behind with Re1+.' }
      ],
      exercises: [
        { type: 'quiz', question: 'Where should the defending rook be placed in the Philidor position?', options: ['Behind the pawn', 'In front of the pawn', 'On the 3rd rank', 'Next to the king'], answer: 2, explanation: 'The rook on the 3rd rank prevents the attacking king from advancing beyond the 6th rank.' },
        { type: 'quiz', question: 'When should you switch to checking from behind?', options: ['Immediately', 'When the pawn reaches the 6th rank', 'Only in the opening', 'Never'], answer: 1, explanation: 'Switch to back-rank checking once the pawn advances to the 6th rank, as it blocks the king\'s shelter.' }
      ]
    },
    {
      id: 'rook-endgames',
      title: 'Rook Endgame Principles',
      difficulty: 'intermediate',
      theory: `
<h2>Rook Endgame Principles</h2>
<p>Rook endgames occur in roughly 50% of all games that reach an endgame. Mastering them is essential for tournament success.</p>

<h3>Fundamental Principles</h3>
<ul>
  <li><strong>Activity is paramount:</strong> An active rook is worth far more than a passive one</li>
  <li><strong>Rooks belong behind passed pawns:</strong> Whether attacking or defending, place rooks behind passed pawns</li>
  <li><strong>The 7th rank is golden:</strong> A rook on the 7th rank attacks pawns and restricts the king</li>
  <li><strong>Cut off the enemy king:</strong> Use the rook to cut off the enemy king from the passed pawn</li>
  <li><strong>King activity:</strong> Centralize your king — it's a fighting piece in the endgame</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Tarrasch's Rule</div>
  <p>"Always place rooks behind passed pawns — your own or your opponent's." Behind your own pawn, the rook gains space as the pawn advances. Behind the opponent's pawn, the rook restricts the pawn's advance.</p>
</div>
`,
      examples: [
        { fen: '8/R4pk1/8/5p2/5P2/6K1/8/1r6 w - - 0 1', title: 'Rook on the 7th', description: 'White\'s rook on a7 dominates the 7th rank, attacking the f7 pawn and confining the Black king.' },
        { fen: '8/8/8/5p2/5k2/8/R4PK1/1r6 w - - 0 1', title: 'Rook Behind Passed Pawn', description: 'Both rooks are optimally placed behind the respective passed pawns.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is Tarrasch\'s Rule for rook endgames?', options: ['Always trade rooks', 'Place rooks behind passed pawns', 'Keep rooks on the back rank', 'Advance the king first'], answer: 1, explanation: 'Tarrasch\'s Rule: Always place rooks behind passed pawns, whether your own or your opponent\'s.' },
        { type: 'quiz', question: 'Why is the 7th rank important for rooks?', options: ['It\'s closest to promotion', 'It attacks pawns and restricts the king', 'Rooks are trapped there', 'It\'s the starting position'], answer: 1, explanation: 'A rook on the 7th rank attacks enemy pawns on their starting squares and confines the king to the back rank.' }
      ]
    },
    {
      id: 'queen-endgames',
      title: 'Queen Endgames',
      difficulty: 'advanced',
      theory: `
<h2>Queen Endgames</h2>
<p>Queen endgames are among the most complex in chess. The queen's enormous power means perpetual check is always a danger, making converting advantages difficult.</p>

<h3>Key Principles</h3>
<ul>
  <li><strong>Perpetual check danger:</strong> Always be alert to perpetual check possibilities</li>
  <li><strong>Centralize the queen:</strong> A centralized queen controls the most squares</li>
  <li><strong>King safety matters:</strong> Even in endgames, an exposed king invites checks</li>
  <li><strong>Passed pawns are decisive:</strong> A passed pawn supported by the queen is extremely powerful</li>
  <li><strong>Queen + Pawn vs Queen:</strong> Usually drawn if the defending queen can give perpetual check</li>
</ul>
`,
      examples: [
        { fen: '8/1Q4pk/8/8/8/8/6PP/4q1K1 w - - 0 1', title: 'Queen Centralization', description: 'White\'s centralized queen controls the board while Black\'s queen is passive on e1.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is the biggest danger in queen endgames?', options: ['Stalemate', 'Perpetual check', 'Back rank mate', 'Pawn races'], answer: 1, explanation: 'In queen endgames, the defending side can often force perpetual check due to the queen\'s range.' }
      ]
    },
    {
      id: 'minor-piece-endgames',
      title: 'Minor Piece Endgames',
      difficulty: 'advanced',
      theory: `
<h2>Bishop and Knight Endgames</h2>
<p>Minor piece endgames (bishops and knights) have unique characteristics that make them distinct from rook endgames.</p>

<h3>Bishop Endgames</h3>
<ul>
  <li><strong>Opposite-colored bishops:</strong> Strong tendency to draw even with extra pawns</li>
  <li><strong>Same-colored bishops:</strong> Extra pawn is usually decisive</li>
  <li><strong>Good bishop vs bad bishop:</strong> A bishop not blocked by its own pawns is "good"</li>
  <li><strong>The wrong bishop:</strong> In corner promotions, having the wrong colored bishop (not controlling the promotion square) means you cannot win K+B+RP vs K</li>
</ul>

<h3>Knight Endgames</h3>
<ul>
  <li><strong>Similar to king and pawn endgames:</strong> Knight endgames often reduce to pawn endgames</li>
  <li><strong>Knights are bad with passed pawns on both sides:</strong> The knight is a short-range piece</li>
  <li><strong>Knights love outposts:</strong> A centralized knight supported by a pawn is very strong</li>
</ul>

<h3>Bishop vs Knight</h3>
<p>Bishops prefer open positions with pawns on both sides. Knights prefer closed positions with fixed pawn structures. The bishop pair is worth approximately half a pawn extra.</p>
`,
      examples: [
        { fen: '8/pp3k2/2p2b2/3p4/3P1B2/2P2K2/PP6/8 w - - 0 1', title: 'Good vs Bad Bishop', description: 'White\'s bishop is "good" (not blocked by its own pawns) while Black\'s bishop is "bad" (blocked by pawns on c6, d5).' }
      ],
      exercises: [
        { type: 'quiz', question: 'In opposite-colored bishop endgames, what is the typical result?', options: ['White always wins', 'Usually a draw', 'Black always wins', 'Always checkmate'], answer: 1, explanation: 'Opposite-colored bishop endgames have a strong drawing tendency because each bishop controls squares the other cannot.' },
        { type: 'quiz', question: 'What is a "wrong bishop" in K+B+RP vs K?', options: ['A bishop that moved too early', 'A bishop that doesn\'t control the promotion square', 'A bishop on the wrong color', 'Both B and C'], answer: 3, explanation: 'The "wrong bishop" is one that doesn\'t control the corner promotion square, making the position a draw.' }
      ]
    },
    {
      id: 'fortresses',
      title: 'Fortress Positions',
      difficulty: 'advanced',
      theory: `
<h2>Fortresses — Drawing with Less Material</h2>
<p>A fortress is a defensive setup where the weaker side creates an impregnable position that the stronger side cannot breach, despite having a significant material advantage.</p>

<h3>Common Fortress Types</h3>
<ul>
  <li><strong>Rook vs Bishop + Pawn:</strong> The rook can often create a fortress by controlling the pawn's promotion square</li>
  <li><strong>Knight + pawns fortress:</strong> A well-placed knight with pawns can hold against a queen</li>
  <li><strong>Opposite-colored bishop fortress:</strong> The defender blocks the critical diagonal</li>
  <li><strong>Rook + Pawn vs Queen:</strong> Certain pawn positions create an impenetrable fortress</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Fortress Recognition</div>
  <p>Recognizing fortress possibilities is crucial for both sides — the defender to create one, and the attacker to prevent it. Key signs: fixed pawn structure, blocked position, limited entry points.</p>
</div>
`,
      examples: [
        { fen: '8/8/8/1p6/1Pk5/2P5/2K5/8 w - - 0 1', title: 'Pawn Fortress', description: 'The blocked pawn structure creates a fortress. Neither side can make progress.' }
      ],
      exercises: [
        { type: 'quiz', question: 'What is a fortress in chess?', options: ['A castle formation', 'An impregnable defensive position despite material deficit', 'A king safety setup', 'An opening system'], answer: 1, explanation: 'A fortress is a defensive position the stronger side cannot penetrate, resulting in a draw despite material advantage.' }
      ]
    },
    {
      id: 'practical-endgames',
      title: 'Practical Endgame Techniques',
      difficulty: 'intermediate',
      theory: `
<h2>Practical Endgame Techniques</h2>
<p>These are the most important endgame skills for tournament play — techniques you'll use in real games repeatedly.</p>

<h3>Essential Techniques</h3>
<ul>
  <li><strong>King and Queen vs King:</strong> Systematic technique to force mate in ≤10 moves</li>
  <li><strong>King and Rook vs King:</strong> Drive the king to the edge using the rook as a barrier</li>
  <li><strong>Two Bishops vs King:</strong> Coordinate the bishops to force the king to a corner</li>
  <li><strong>Converting extra material:</strong> Trade pieces (not pawns) when ahead in material</li>
  <li><strong>Pawn races:</strong> Calculate accurately who queens first</li>
  <li><strong>The rule of the square:</strong> Can the king catch a passed pawn? Draw a mental square from the pawn to the promotion square — if the king is inside or can enter it, the pawn is caught.</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Rule of the Square</div>
  <p>Draw an imaginary square from the pawn's current position to the promotion square. If the opposing king can step inside this square (on their turn), they catch the pawn. If not, the pawn promotes.</p>
</div>
`,
      examples: [
        { fen: '8/8/8/1p6/8/8/5K2/8 w - - 0 1', title: 'Rule of the Square', description: 'Can White\'s king catch the b-pawn? Draw the square from b5 to b1-f1-f5-b5. Is the king inside?' },
        { fen: '8/8/8/8/4k3/8/4K3/4Q3 w - - 0 1', title: 'K+Q vs K Technique', description: 'Use the queen to create a barrier, then bring the king closer to deliver checkmate on the edge.' }
      ],
      exercises: [
        { type: 'quiz', question: 'When ahead in material in the endgame, what should you generally trade?', options: ['Pawns', 'Pieces (not pawns)', 'Everything', 'Nothing'], answer: 1, explanation: 'When ahead in material, trade pieces (not pawns) to simplify. Keep pawns to have promotion potential.' },
        { type: 'quiz', question: 'What is the Rule of the Square?', options: ['A pawn structure rule', 'A method to determine if a king can catch a passed pawn', 'A mating technique', 'A castling rule'], answer: 1, explanation: 'The Rule of the Square tells you whether a king can catch a passed pawn by imagining a square from the pawn to its promotion square.' }
      ]
    }
  ]
};

export default endgameContent;
