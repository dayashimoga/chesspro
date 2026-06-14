// ChessOS — Content: Endgame Mastery

export const endgameContent = {
  id: 'endgames',
  title: 'Endgame Mastery',
  icon: '♚',
  description: 'Master the critical endgame positions that decide games. From basic king+pawn to complex rook endings — learn what every serious player must know.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'king-pawn',
      title: 'King & Pawn Endings',
      difficulty: 'intermediate',
      theory: `
<h2>King & Pawn Endings</h2>
<p>King and pawn endings are the foundation of all endgame play. As Capablanca said: <em>"In order to improve your game, you must study the endgame before everything else."</em></p>

<h3>The Rule of the Square</h3>
<p>Can a king catch a passed pawn? Draw an imaginary square from the pawn to its promotion square. If the king can enter this square (on its move), it catches the pawn. Count squares diagonally — the king moves one square in any direction per move.</p>

<h3>Opposition</h3>
<p><strong>Opposition</strong> is the most important concept in king and pawn endings. When two kings face each other with one square between them, the player NOT to move has the opposition — a crucial advantage.</p>
<ul>
  <li><strong>Direct opposition:</strong> Kings on same rank or file, one square apart</li>
  <li><strong>Distant opposition:</strong> Kings on same rank or file, 3 or 5 squares apart</li>
  <li><strong>Diagonal opposition:</strong> Kings on same diagonal, one square apart</li>
</ul>
<p>The side with opposition can force the opposing king to retreat, allowing their own king to advance.</p>

<h3>Key Positions</h3>
<p><strong>King + Pawn vs. King:</strong> The result depends on whether the stronger side can achieve a "key square" (also called "critical square"). For a pawn on the 5th rank, the key squares are the three squares two ranks ahead of the pawn.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 The Key Squares Rule</div>
  <p>For a pawn on the 2nd-4th rank, the key squares are the three squares TWO ranks ahead. For a pawn on the 5th rank, the key squares are the three squares ONE rank ahead AND two ranks ahead. If your king reaches a key square, the pawn promotes (with correct play).</p>
</div>

<h3>Triangulation</h3>
<p>Triangulation is a technique where the king takes three moves to reach a square it could reach in one, effectively losing a tempo and transferring the move to the opponent. This is used to gain opposition.</p>

<h3>Zugzwang</h3>
<p>Zugzwang (German: "compulsion to move") is a position where the player to move is at a disadvantage <em>because</em> they must move. Any move worsens their position. Zugzwang is most common in endgames, particularly king and pawn endings.</p>
`,
      examples: [
        { fen: '8/8/8/8/4k3/8/4P3/4K3 w - - 0 1', title: 'K+P vs K — Basic Position', description: 'White to move. The goal is to advance the pawn while keeping the opponent\'s king at bay using opposition.' },
        { fen: '8/8/4k3/8/4P3/4K3/8/8 w - - 0 1', title: 'Opposition', description: 'White has direct opposition (kings face each other, one square between). Ke3 with the opposition means White can advance the pawn.' },
        { fen: '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1', title: 'Key Squares', description: 'The key squares for the e2 pawn are d4, e4, f4. If White\'s king reaches any of these, the pawn promotes.' },
        { fen: '8/8/8/3k4/8/3KP3/8/8 w - - 0 1', title: 'Triangulation', description: 'White can use triangulation (Kd3-c3-d4 or Kd3-e2-d4) to transfer the move to Black and gain opposition.' }
      ],
      puzzles: [
        { id: 'kp_01', fen: '8/8/8/5k2/8/5K2/5P2/8 w - - 0 1', solution: 'Ke3', theme: 'Opposition', difficulty: 'intermediate', explanation: 'Ke3! takes the opposition. Now after ...Ke5 Kf3, White maintains control. The key is to keep opposition.' },
        { id: 'kp_02', fen: '8/5k2/8/5K2/5P2/8/8/8 w - - 0 1', solution: 'Ke5', theme: 'Key Squares', difficulty: 'intermediate', explanation: 'Ke5 occupies a key square. The f-pawn will promote because White\'s king controls the critical squares ahead.' },
        { id: 'kp_03', fen: '8/8/8/8/3pk3/8/3PK3/8 w - - 0 1', solution: 'Ke1', theme: 'Triangulation', difficulty: 'advanced', explanation: 'Ke1! begins a triangulation maneuver. White will reach d2 with Black to move, gaining opposition.' },
        { id: 'kp_04', fen: '8/8/4k3/4p3/4P3/4K3/8/8 w - - 0 1', solution: 'Kf3', theme: 'Zugzwang', difficulty: 'advanced', explanation: 'After Kf3, if Black plays ...Kd6, then Kf4 gains the key squares. Mutual zugzwang positions are critical.' }
      ]
    },
    {
      id: 'rook-endings',
      title: 'Rook Endings',
      difficulty: 'advanced',
      theory: `
<h2>Rook Endings</h2>
<p>Rook endings are the most common type of endgame in practical play. Tartakower said: <em>"All rook endings are drawn"</em> — an exaggeration, but it highlights how tricky they are.</p>

<h3>The Lucena Position</h3>
<p>The most important winning position in rook endings. With your pawn on the 7th rank and your king on the promotion square, the winning technique is called "building a bridge":</p>
<ol>
  <li>Move your rook to the 4th rank (creating a shield)</li>
  <li>Bring your king out from in front of the pawn</li>
  <li>Use the rook to block checks from the 4th rank (the "bridge")</li>
</ol>

<h3>The Philidor Position</h3>
<p>The most important drawing technique. With the defending king on the promotion square and the pawn not yet on the 6th rank:</p>
<ol>
  <li>Keep your rook on the 6th rank (preventing the attacking king from advancing)</li>
  <li>When the pawn advances to the 6th rank, move your rook to the 1st rank</li>
  <li>Give checks from behind (the longest possible distance)</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 Rook Ending Principle</div>
  <p><strong>Rooks belong behind passed pawns</strong> — whether your own or your opponent's. Behind your own pawn, the rook's scope increases as the pawn advances. Behind the enemy's pawn, the rook can harass it from maximum distance.</p>
</div>

<h3>Key Principles</h3>
<ul>
  <li>Activate your rook — a passive rook loses most endgames</li>
  <li>Rooks need open files</li>
  <li>The 7th rank is a rook's paradise</li>
  <li>Cut off the enemy king</li>
  <li>Create passed pawns</li>
</ul>
`,
      examples: [
        { fen: '1K1k4/1P6/8/8/8/8/8/r4R2 w - - 0 1', title: 'Lucena Position', description: 'White wins by "building a bridge." Rf4! then Kc7, Rd8+ Ke7, Rd4 — blocking checks from the 4th rank.' },
        { fen: '8/3k4/R7/3KP3/8/8/8/4r3 b - - 0 1', title: 'Philidor Position', description: 'Black draws by keeping the rook on the 6th rank until the pawn advances, then giving checks from behind.' },
        { fen: '8/1r6/8/1P1K4/1k6/8/8/1R6 w - - 0 1', title: 'Rook Behind Passed Pawn', description: 'White\'s rook is behind the passed pawn — the ideal position. As the pawn advances, the rook\'s scope increases.' }
      ],
      puzzles: [
        { id: 'rook_01', fen: '1K1k4/1P6/8/8/8/8/8/r4R2 w - - 0 1', solution: 'Rf4', theme: 'Lucena (Building the Bridge)', difficulty: 'advanced', explanation: 'Rf4! begins the bridge-building technique. After ...Ra1, Ka7 Ra2+, Kb6 Rb2+, Kc6 Rc2+, Kb5! and Rd4 blocks the checks.' },
        { id: 'rook_02', fen: '8/8/3R4/3kp3/8/3K4/8/4r3 w - - 0 1', solution: 'Ra6', theme: 'Cutting Off the King', difficulty: 'intermediate', explanation: 'Ra6 cuts off the black king from the a-file side, preventing it from supporting the e-pawn\'s advance.' },
        { id: 'rook_03', fen: '3k4/R7/8/3KP3/8/8/8/4r3 w - - 0 1', solution: 'e6', theme: 'Pawn Advance', difficulty: 'advanced', explanation: 'e6! threatens promotion. The rook on a7 controls the 7th rank, supporting the pawn\'s advance.' }
      ]
    },
    {
      id: 'minor-piece-endings',
      title: 'Minor Piece Endings',
      difficulty: 'advanced',
      theory: `
<h2>Minor Piece Endings</h2>

<h3>Bishop vs. Knight</h3>
<p>Generally, the bishop is slightly better in open positions with pawns on both sides of the board (it can operate on both flanks simultaneously). The knight is better in closed positions where the bishop's diagonals are blocked.</p>

<h3>Good Bishop vs. Bad Bishop</h3>
<p>A "bad" bishop is one whose own pawns are fixed on the same color squares, blocking its diagonals. A "good" bishop operates on the opposite color from its pawns, with open diagonals.</p>

<h3>Same-Color Bishop Endings</h3>
<p>With same-color bishops, the stronger side can often create a decisive advantage with an extra pawn, as the defending bishop cannot block a pawn on the opposite color.</p>

<h3>Opposite-Color Bishop Endings</h3>
<p>Opposite-color bishops are notoriously drawish in the endgame — even with 1-2 extra pawns, the defending side can often hold. This is because the defending bishop can blockade on squares the attacking bishop cannot reach.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 The Wrong Bishop</div>
  <p>A rook pawn (a or h) with a bishop that doesn't control the promotion square is often drawn even with an extra pawn. For example, with a h-pawn and a dark-squared bishop, if the enemy king reaches h8 (a light square), the game is drawn.</p>
</div>
`,
      puzzles: [
        { id: 'minor_01', fen: '8/8/8/3k4/8/3BK3/3P4/8 w - - 0 1', solution: 'Ke4', theme: 'Bishop + Pawn', difficulty: 'intermediate', explanation: 'Ke4 advances the king. With correct technique, White wins by escorting the pawn to promotion.' },
        { id: 'minor_02', fen: '8/8/8/8/2kn4/8/2KP4/8 w - - 0 1', solution: 'd3', theme: 'Pawn vs Knight', difficulty: 'intermediate', explanation: 'Advancing the pawn creates threats. The knight must maneuver carefully to stop promotion.' },
        { id: 'minor_03', fen: '8/8/8/8/8/2k5/p1B5/2K5 w - - 0 1', solution: 'Bb1', theme: 'Wrong Color Bishop Corner', difficulty: 'advanced', explanation: 'Bb1! blocks the a2 pawn. If Black plays ...axb1=Q+, Kxb1 is a draw because it\'s a stalemate or wrong-colored bishop corner.' },
        { id: 'minor_04', fen: '8/8/8/6N1/8/8/p7/k6K w - - 0 1', solution: 'Nf3', theme: 'Knight vs Rook Pawn', difficulty: 'advanced', explanation: 'Nf3! heads to d2 or e1 to stop the pawn from promoting. The knight can successfully draw against a rook pawn.' }
      ]
    },
    {
      id: 'queen-endings',
      title: 'Queen Endings & Fortresses',
      difficulty: 'expert',
      theory: `
<h2>Queen Endings</h2>
<p>Queen endings are among the most complex in chess. The queen's mobility means there are always perpetual check possibilities, making many queen endings drawn despite material advantages.</p>

<h3>Queen vs. Pawn on 7th Rank</h3>
<p>Usually the queen wins, except against a bishop-pawn or rook-pawn on the 7th rank with the king nearby. Against a central pawn, the winning technique involves using the queen to bring the king closer while preventing promotion.</p>

<h2>Fortresses</h2>
<p>A fortress is a drawing technique where the weaker side constructs an impregnable position that the stronger side cannot breach, despite material advantage. Common fortress patterns:</p>
<ul>
  <li><strong>Rook vs. Bishop:</strong> The defending king sits in the corner opposite to the bishop's color</li>
  <li><strong>Rook vs. Knight:</strong> The knight stays close to the king, the defending side controls key squares</li>
  <li><strong>Queen vs. Rook:</strong> With the rook staying close to the king, a fortress can sometimes hold</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Practical Endgame Rule</div>
  <p>In queen endings, always check for perpetual check opportunities — both as attacker (to draw if losing) and as defender (to avoid if winning). A queen can give perpetual check from surprisingly few positions.</p>
</div>
`,
      puzzles: [
        { id: 'queen_01', fen: '8/8/8/8/8/5K2/6Pq/5Q2 w - - 0 1', solution: 'Qf2', theme: 'Queen Endgame', difficulty: 'expert', explanation: 'Qf2 offers a queen trade. If Qh3+, Qg3 blocks. The extra pawn wins with the queens on.' },
        { id: 'queen_02', fen: '8/7P/8/8/8/5k2/1q6/3K4 w - - 0 1', solution: 'h8=Q', theme: 'Queen vs Pawn on 7th', difficulty: 'advanced', explanation: 'h8=Q+ promotes the pawn with check, creating a queen vs queen drawing or winning resource.' },
        { id: 'fort_01', fen: '8/8/8/8/8/5k2/5r2/5K1R w - - 0 1', solution: 'Draw', theme: 'Fortress', difficulty: 'advanced', explanation: 'This position is a theoretical draw. The rook defends from close range and the defending king cannot be driven out.' },
        { id: 'fort_02', fen: '8/8/p7/kp6/1p6/1P6/8/K7 w - - 0 1', solution: 'Ka2', theme: 'King & Pawn Fortress', difficulty: 'intermediate', explanation: 'Ka2! holds the draw. The king simply shuffles between a1 and a2, and Black cannot breach the pawn barrier.' }
      ]
    }
  ]
};

export default endgameContent;
