// ChessOS — Content: Foundations (Complete Beginner Course)

export const foundationsContent = {
  id: 'foundations',
  title: 'Chess Foundations',
  icon: '♔',
  description: 'Master the fundamentals of chess from the very first move. Learn the board, the pieces, and the rules that govern the game.',
  difficulty: 'beginner',
  modules: [
    {
      id: 'the-chessboard',
      title: 'The Chessboard',
      difficulty: 'beginner',
      theory: `
<h2>The Chessboard</h2>
<p>The chessboard is an 8×8 grid of 64 squares, alternating between light and dark colors. Every square has a unique name using <strong>algebraic notation</strong> — a system combining a letter (a–h for files) and a number (1–8 for ranks).</p>

<h3>Files, Ranks & Diagonals</h3>
<ul>
  <li><strong>Files</strong> are vertical columns labeled <code>a</code> through <code>h</code> from left to right (from White's perspective).</li>
  <li><strong>Ranks</strong> are horizontal rows numbered <code>1</code> through <code>8</code> from bottom to top (from White's perspective).</li>
  <li><strong>Diagonals</strong> are lines of same-colored squares running corner to corner.</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Key Concept</div>
  <p>The bottom-right corner must always be a light square. This is how you verify the board is set up correctly. Remember: <strong>"white on right."</strong></p>
</div>

<h3>The Center</h3>
<p>The four central squares — <code>d4</code>, <code>d5</code>, <code>e4</code>, <code>e5</code> — are the most important squares on the board. Controlling the center gives your pieces maximum mobility and influence. Most opening strategies revolve around fighting for center control.</p>

<h3>Board Orientation</h3>
<p>White always starts on ranks 1 and 2. Black always starts on ranks 7 and 8. The queen starts on her own color: the white queen on a light square (d1), the black queen on a dark square (d8).</p>
`,
      examples: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          title: 'Starting Position',
          description: 'This is how every chess game begins. All 32 pieces are arranged symmetrically.'
        },
        {
          fen: '8/8/8/3PP3/3PP3/8/8/8 w - - 0 1',
          title: 'The Center Squares',
          description: 'The four center squares (d4, d5, e4, e5) highlighted with pawns. Controlling these squares is a primary strategic goal.'
        }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', commentary: 'Welcome to ChessOS! The board consists of 64 squares. White starts on ranks 1-2, Black on ranks 7-8.' },
        { fen: '8/8/8/3PP3/3PP3/8/8/8 w - - 0 1', commentary: 'The center squares d4, d5, e4, e5 are the most critical. Controlling them determines the flow of the game.', highlights: [{ square: 'd4', color: 'rgba(16, 185, 129, 0.3)' }, { square: 'd5', color: 'rgba(16, 185, 129, 0.3)' }, { square: 'e4', color: 'rgba(16, 185, 129, 0.3)' }, { square: 'e5', color: 'rgba(16, 185, 129, 0.3)' }] }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', instruction: 'Occupy the center! Move your king\'s pawn forward two squares to e4.', expectedMove: 'e4', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! 1.e4 controls the d5 square and opens diagonals for your queen and light-squared bishop.', incorrectFeedback: 'Move the pawn on e2 forward two squares to e4.', hints: ['Select the pawn on e2 and move it to e4'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Open the game by claiming the center with your queen\'s pawn (d4).', solution: ['d4'], conceptTested: 'Opening center pawn push', maxAttempts: 3 }
      ],
      exercises: [
        { type: 'quiz', question: 'What letter represents the leftmost file from White\'s perspective?', options: ['a', 'h', 'd', 'e'], answer: 0, explanation: 'Files are labeled a through h from left to right from White\'s perspective.' },
        { type: 'quiz', question: 'How many squares are on a chessboard?', options: ['32', '48', '64', '81'], answer: 2, explanation: 'The chessboard has 8×8 = 64 squares.' },
        { type: 'quiz', question: 'Which square is in the center of the board?', options: ['a1', 'e4', 'h8', 'c3'], answer: 1, explanation: 'e4 is one of the four central squares (d4, d5, e4, e5).' },
        { type: 'quiz', question: 'What color is the bottom-right square?', options: ['Dark', 'Light'], answer: 1, explanation: 'The board must be oriented so that h1 (bottom-right) is always a light square.' }
      ]
    },
    {
      id: 'piece-movement',
      title: 'Piece Movement',
      difficulty: 'beginner',
      theory: `
<h2>How Chess Pieces Move</h2>
<p>Each of the six types of chess pieces moves in a unique way. Understanding these movements is the foundation of all chess play.</p>

<h3>The King ♔</h3>
<p>The king moves <strong>one square in any direction</strong> — horizontally, vertically, or diagonally. Though it's the most important piece (the game ends when it's trapped), it's also one of the least mobile. The king can never move to a square that is attacked by an opponent's piece.</p>

<h3>The Queen ♕</h3>
<p>The queen is the most powerful piece. She combines the movement of the rook and bishop, moving <strong>any number of squares horizontally, vertically, or diagonally</strong>. She cannot jump over other pieces. The queen is valued at approximately <strong>9 points</strong>.</p>

<h3>The Rook ♖</h3>
<p>The rook moves <strong>any number of squares horizontally or vertically</strong>. Rooks are most powerful on open files (files with no pawns) and on the 7th rank where they can attack pawns and restrict the enemy king. Value: approximately <strong>5 points</strong>.</p>

<h3>The Bishop ♗</h3>
<p>The bishop moves <strong>any number of squares diagonally</strong>. Each player starts with two bishops — one on light squares, one on dark squares. A bishop can never change its square color. The bishop pair (both bishops together) is considered a strategic advantage. Value: approximately <strong>3 points</strong>.</p>

<h3>The Knight ♘</h3>
<p>The knight has the most unique movement: it moves in an <strong>L-shape</strong> — two squares in one direction and then one square perpendicular (or vice versa). The knight is the <strong>only piece that can jump over other pieces</strong>. Value: approximately <strong>3 points</strong>.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Knight Movement Tip</div>
  <p>A knight on e4 can move to: d2, f2, c3, g3, c5, g5, d6, f6. Notice it always moves to a square of the <strong>opposite color</strong> from where it stands.</p>
</div>

<h3>The Pawn ♙</h3>
<p>Pawns move <strong>forward one square</strong>, but capture <strong>diagonally forward one square</strong>. On its first move, a pawn may advance <strong>two squares</strong>. Pawns are the only pieces that cannot move backward. Value: <strong>1 point</strong>.</p>

<h3>Relative Piece Values</h3>
<ul>
  <li>Pawn = 1</li>
  <li>Knight = 3</li>
  <li>Bishop = 3 (slightly more than knight in open positions)</li>
  <li>Rook = 5</li>
  <li>Queen = 9</li>
  <li>King = ∞ (invaluable — losing it loses the game)</li>
</ul>
`,
      examples: [
        { fen: '8/8/8/8/4K3/8/8/8 w - - 0 1', title: 'King Movement', description: 'The king on e4 can move to any adjacent square: d3, e3, f3, d4, f4, d5, e5, f5.' },
        { fen: '8/8/8/8/4Q3/8/8/8 w - - 0 1', title: 'Queen Movement', description: 'The queen combines rook and bishop movement, covering 27 squares from e4.' },
        { fen: '8/8/8/8/4R3/8/8/8 w - - 0 1', title: 'Rook Movement', description: 'The rook moves along ranks and files. From e4, it covers the entire e-file and 4th rank.' },
        { fen: '8/8/8/8/4B3/8/8/8 w - - 0 1', title: 'Bishop Movement', description: 'The bishop moves diagonally. This light-squared bishop can never reach a dark square.' },
        { fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', title: 'Knight Movement', description: 'The knight from e4 can reach 8 squares in an L-shape: d2, f2, c3, g3, c5, g5, d6, f6.' },
        { fen: '8/8/8/8/4P3/8/8/8 w - - 0 1', title: 'Pawn Movement', description: 'The pawn advances forward. From e4, this pawn can move to e5.' }
      ],
      demoSteps: [
        { fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', commentary: 'The knight stands on e4. It moves in an L-shape: two squares in one direction, then one square perpendicular.', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.4)' }] },
        { fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', commentary: 'From e4, the knight can reach 8 squares: d2, f2, c3, g3, c5, g5, d6, f6. Notice it always lands on the opposite color.', highlights: [{ square: 'd2', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'f2', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'c3', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'g3', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'c5', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'g5', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'd6', color: 'rgba(245, 158, 11, 0.3)' }, { square: 'f6', color: 'rgba(245, 158, 11, 0.3)' }] },
        { fen: '8/8/8/2N5/8/8/8/8 w - - 0 1', move: 'Nc5', commentary: 'The knight moves to c5. From the center, knights have maximum mobility. On the edge, they have fewer squares.' },
        { fen: '8/8/8/8/8/8/8/7R w - - 0 1', commentary: 'Now let\'s look at the rook. It moves along straight lines — ranks (horizontal) and files (vertical).', highlights: [{ square: 'h1', color: 'rgba(16, 185, 129, 0.4)' }] },
        { fen: '8/8/8/8/8/8/8/7R w - - 0 1', commentary: 'From h1, the rook controls the entire h-file (h1-h8) and the entire 1st rank (a1-h1). That\'s 14 squares.', arrows: [{ from: 'h1', to: 'h8', color: 'rgba(59, 130, 246, 0.6)' }, { from: 'h1', to: 'a1', color: 'rgba(59, 130, 246, 0.6)' }] },
        { fen: '8/8/8/8/3B4/8/8/8 w - - 0 1', commentary: 'The bishop moves diagonally. This bishop is on a light square (d4) and can NEVER reach a dark square — it\'s confined to its color for the entire game.', highlights: [{ square: 'd4', color: 'rgba(139, 92, 246, 0.4)' }] }
      ],
      guidedSteps: [
        { fen: '8/8/8/8/4N3/8/8/4K3 w - - 0 1', instruction: 'Move the knight to f6 — a strong outpost square.', expectedMove: 'Nf6', highlights: [{ square: 'f6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Correct! Nf6 is a powerful central square for the knight, controlling 8 important squares.', incorrectFeedback: 'Try again. The knight needs to reach f6. Remember the L-shape: two squares in one direction, one square perpendicular.', hints: ['The knight moves in an L-shape', 'From e4, f6 is two up and one right'] },
        { fen: '8/8/8/8/8/8/4P3/4K3 w - - 0 1', instruction: 'Advance the pawn two squares on its first move to e4 — controlling the center!', expectedMove: 'e4', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! Pawns can move two squares forward on their first move. e4 is the most popular opening move in chess!', incorrectFeedback: 'The pawn on e2 can move one or two squares forward on its first move. Try pushing it to e4.', hints: ['Click the pawn on e2, then click e4'] },
        { fen: '8/8/8/8/8/8/8/R3K3 w - - 0 1', instruction: 'Move the rook to the end of the first rank — slide it to a1 or h1.', expectedMove: 'Ra1', highlights: [], correctFeedback: 'The rook slides along the first rank. Rooks are powerful on open files and ranks.', incorrectFeedback: 'The rook moves along straight lines. Try moving it along the 1st rank.', hints: ['Rooks move horizontally or vertically'] }
      ],
      masteryPositions: [
        { fen: '8/8/8/8/4N3/8/8/4K3 w - - 0 1', description: 'Demonstrate your understanding of knight movement. Move the knight to capture the opponent\'s pawn.', solution: ['Nd6'], conceptTested: 'Knight L-shaped movement', maxAttempts: 5 }
      ],
      exercises: [
        { type: 'quiz', question: 'Which piece can jump over other pieces?', options: ['Bishop', 'Rook', 'Knight', 'Queen'], answer: 2, explanation: 'The knight is the only piece that can leap over other pieces on the board.' },
        { type: 'quiz', question: 'How many points is a queen worth?', options: ['5', '7', '9', '12'], answer: 2, explanation: 'The queen is valued at approximately 9 points, making it the most valuable piece after the king.' },
        { type: 'quiz', question: 'How does a pawn capture?', options: ['Straight forward', 'Diagonally forward', 'In any direction', 'Sideways'], answer: 1, explanation: 'Pawns move forward but capture diagonally forward. This is unique among chess pieces.' },
        { type: 'quiz', question: 'Can a bishop ever reach a square of the opposite color?', options: ['Yes', 'No'], answer: 1, explanation: 'A bishop is permanently confined to squares of one color throughout the entire game.' },
        { type: 'find-move', fen: '8/8/8/8/4N3/8/8/8 w - - 0 1', question: 'The knight is on e4. Which squares can it move to?', solution: ['d2','f2','c3','g3','c5','g5','d6','f6'], explanation: 'The knight moves in an L-shape: two squares in one direction and one perpendicular.' }
      ]
    },
    {
      id: 'special-rules',
      title: 'Special Rules',
      difficulty: 'beginner',
      theory: `
<h2>Special Rules of Chess</h2>
<p>Beyond basic movement, chess has several special rules that add depth and strategic possibilities to the game.</p>

<h3>Castling</h3>
<p>Castling is a special move involving the king and a rook. It's the only move where two pieces move at once. The king moves <strong>two squares toward a rook</strong>, and that rook moves to the square the king crossed.</p>

<p><strong>Kingside castling (O-O):</strong> King goes from e1 to g1, rook from h1 to f1.<br/>
<strong>Queenside castling (O-O-O):</strong> King goes from e1 to c1, rook from a1 to d1.</p>

<p><strong>Castling requirements:</strong></p>
<ul>
  <li>Neither the king nor the rook has previously moved</li>
  <li>No pieces between the king and rook</li>
  <li>The king is not currently in check</li>
  <li>The king does not pass through or land on a square attacked by an enemy piece</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Why Castle?</div>
  <p>Castling serves two purposes: it moves the king to safety behind a wall of pawns, and it activates the rook by bringing it toward the center. You should usually castle early in the game.</p>
</div>

<h3>En Passant</h3>
<p>En passant ("in passing") is a special pawn capture. When a pawn advances two squares from its starting position and lands beside an enemy pawn, the enemy pawn may capture it <strong>as if it had only moved one square</strong>. This capture must be made immediately — on the very next move — or the right is lost.</p>

<h3>Pawn Promotion</h3>
<p>When a pawn reaches the opposite end of the board (8th rank for White, 1st rank for Black), it <strong>must be promoted</strong> to a queen, rook, bishop, or knight. The pawn is removed and replaced by the chosen piece. Most players promote to a queen ("queening"), but promoting to a knight ("underpromotion") is sometimes strategically necessary.</p>

<h3>Check</h3>
<p>When a king is under direct attack by an enemy piece, it is in <strong>check</strong>. A player in check must immediately escape by: (1) moving the king, (2) blocking the attack, or (3) capturing the attacking piece. You may never leave your king in check.</p>

<h3>Checkmate</h3>
<p>Checkmate occurs when a king is in check and there is <strong>no legal move to escape</strong>. This ends the game — the player delivering checkmate wins. The king is never actually captured in chess.</p>

<h3>Stalemate & Draws</h3>
<p><strong>Stalemate</strong> occurs when a player has no legal moves but is NOT in check. This results in a draw. Other draw conditions include:</p>
<ul>
  <li><strong>Insufficient material:</strong> Neither side has enough pieces to force checkmate (e.g., K vs K, K+B vs K)</li>
  <li><strong>Threefold repetition:</strong> The same position occurs three times</li>
  <li><strong>50-move rule:</strong> 50 consecutive moves by each side without a pawn move or capture</li>
  <li><strong>Agreement:</strong> Both players agree to a draw</li>
</ul>
`,
      examples: [
        { fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', title: 'Castling Setup', description: 'Both sides can castle kingside (O-O) or queenside (O-O-O). No pieces block the path.' },
        { fen: '8/8/8/pP6/8/8/8/8 w - a6 0 1', title: 'En Passant', description: 'Black just played a7-a5. White can capture en passant with bxa6.' },
        { fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1', title: 'Pawn Promotion', description: 'White\'s pawn on e7 can advance to e8 and promote to any piece — usually a queen.' },
        { fen: 'rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1', title: 'Checkmate (Scholar\'s Mate)', description: 'Black\'s queen on h4 delivers checkmate. The white king has no escape.' },
        { fen: '5k2/5P2/5K2/8/8/8/8/8 b - - 0 1', title: 'Stalemate', description: 'Black to move but has no legal moves, yet is not in check. This is a draw by stalemate.' }
      ],
      demoSteps: [
        { fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', commentary: 'Castling is a special move. The king moves TWO squares toward a rook, and the rook jumps over to the other side. Let\'s see kingside castling (O-O).', highlights: [{ square: 'e1', color: 'rgba(16, 185, 129, 0.4)' }, { square: 'h1', color: 'rgba(59, 130, 246, 0.4)' }] },
        { fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R4RK1 w kq - 0 1', move: 'O-O', commentary: 'After O-O: the king moved from e1 to g1, and the rook jumped from h1 to f1. The king is now safe behind the pawns!', arrows: [{ from: 'e1', to: 'g1', color: 'rgba(16, 185, 129, 0.6)' }, { from: 'h1', to: 'f1', color: 'rgba(59, 130, 246, 0.6)' }] },
        { fen: '8/8/8/pP6/8/8/8/8 w - a6 0 1', commentary: 'En passant: Black just pushed a7 to a5, passing through a6. White\'s pawn on b5 can capture it AS IF it only moved one square.', highlights: [{ square: 'a5', color: 'rgba(239, 68, 68, 0.4)' }, { square: 'a6', color: 'rgba(16, 185, 129, 0.3)' }], arrows: [{ from: 'b5', to: 'a6', color: 'rgba(16, 185, 129, 0.6)' }] },
        { fen: '8/8/P7/8/8/8/8/8 w - - 0 1', commentary: 'After bxa6 en passant, the white pawn now stands on a6. En passant must be done IMMEDIATELY — on the very next move, or the right is lost forever.' },
        { fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1', commentary: 'Pawn promotion: When a pawn reaches the last rank, it MUST be promoted. Usually to a queen (the strongest piece), but sometimes a knight is better!', highlights: [{ square: 'e7', color: 'rgba(245, 158, 11, 0.4)' }], arrows: [{ from: 'e7', to: 'e8', color: 'rgba(245, 158, 11, 0.6)' }] }
      ],
      guidedSteps: [
        { fen: 'r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 2', instruction: 'Castle kingside (O-O) to bring your king to safety and activate your rook!', expectedMove: 'O-O', highlights: [{ square: 'e1', color: 'rgba(16, 185, 129, 0.3)' }, { square: 'g1', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! Castling puts your king behind a wall of pawns and activates the rook. This should be done early in every game.', incorrectFeedback: 'Try castling kingside. Click the king on e1 and move it to g1 (two squares toward the rook).', hints: ['Move the king two squares toward the h1 rook', 'Click e1 then g1'] },
        { fen: '8/8/8/pP6/8/8/8/4K3 w - a6 0 1', instruction: 'Capture en passant! The black pawn just moved a7-a5. Capture it by moving your b5 pawn to a6.', expectedMove: 'bxa6', highlights: [{ square: 'a6', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'You captured en passant! This special capture only works on the move immediately after the opponent\'s two-square pawn push.', incorrectFeedback: 'Capture en passant by moving your pawn from b5 to a6, taking the black pawn as if it only moved one square.', hints: ['Move the b5 pawn diagonally to a6'] },
        { fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1', instruction: 'Promote the pawn! Push it to e8 and it becomes a queen.', expectedMove: 'e8=Q', highlights: [{ square: 'e8', color: 'rgba(245, 158, 11, 0.3)' }], correctFeedback: 'The pawn promotes to a queen! Promotion is one of the most powerful concepts in chess — always push passed pawns!', incorrectFeedback: 'Push the pawn forward from e7 to e8. It will automatically promote.', hints: ['The pawn on e7 can advance to e8'] }
      ],
      masteryPositions: [
        { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', description: 'Demonstrate good opening play: castle to safety!', solution: ['O-O'], conceptTested: 'Castling for king safety', maxAttempts: 3 }
      ],
      exercises: [
        { type: 'quiz', question: 'Can you castle if your king is in check?', options: ['Yes', 'No'], answer: 1, explanation: 'Castling is not allowed when the king is in check.' },
        { type: 'quiz', question: 'What happens when a pawn reaches the last rank?', options: ['It\'s removed', 'It stays as a pawn', 'It must be promoted', 'The game ends'], answer: 2, explanation: 'A pawn reaching the last rank must be promoted to a queen, rook, bishop, or knight.' },
        { type: 'quiz', question: 'En passant must be played...', options: ['Anytime', 'Within 3 moves', 'Immediately on the next move', 'Before castling'], answer: 2, explanation: 'The en passant capture must be made on the very next move, or the right to do so is permanently lost.' },
        { type: 'quiz', question: 'What is stalemate?', options: ['King is in check with no escape', 'Player has no legal moves but is not in check', 'Both kings are in check', 'A player runs out of time'], answer: 1, explanation: 'Stalemate is when the player to move has no legal moves but their king is not in check. It\'s a draw.' }
      ]
    },
    {
      id: 'chess-notation',
      title: 'Chess Notation',
      difficulty: 'beginner',
      theory: `
<h2>Chess Notation</h2>
<p>Chess notation is the system used to record moves. It allows players to study games, communicate positions, and build opening knowledge.</p>

<h3>Algebraic Notation</h3>
<p>The standard notation system used worldwide. Each move records the piece and destination square:</p>
<ul>
  <li><strong>K</strong> = King, <strong>Q</strong> = Queen, <strong>R</strong> = Rook, <strong>B</strong> = Bishop, <strong>N</strong> = Knight</li>
  <li>Pawns have no letter prefix — just the destination square</li>
  <li><code>e4</code> = pawn to e4</li>
  <li><code>Nf3</code> = knight to f3</li>
  <li><code>Bb5</code> = bishop to b5</li>
</ul>

<p><strong>Special symbols:</strong></p>
<ul>
  <li><code>x</code> = captures (e.g., <code>Bxf7</code> — bishop captures on f7)</li>
  <li><code>+</code> = check</li>
  <li><code>#</code> = checkmate</li>
  <li><code>O-O</code> = kingside castling</li>
  <li><code>O-O-O</code> = queenside castling</li>
  <li><code>=Q</code> = pawn promotion to queen</li>
  <li><code>!</code> = good move, <code>!!</code> = brilliant move</li>
  <li><code>?</code> = mistake, <code>??</code> = blunder</li>
</ul>

<h3>FEN (Forsyth-Edwards Notation)</h3>
<p>FEN describes a complete board position in a single line of text. The starting position in FEN is:</p>
<p><code>rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1</code></p>
<ul>
  <li>Uppercase = White pieces, lowercase = Black pieces</li>
  <li>Numbers = consecutive empty squares</li>
  <li><code>/</code> separates ranks (starting from rank 8)</li>
  <li>After the position: active color, castling rights, en passant square, halfmove clock, fullmove number</li>
</ul>

<h3>PGN (Portable Game Notation)</h3>
<p>PGN is the standard format for recording complete games. It includes metadata (players, date, result) and the move list:</p>
<pre>[Event "World Championship"]
[White "Kasparov, Garry"]
[Black "Karpov, Anatoly"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. a3 Bb7 5. Nc3 d5 1-0</pre>
`,
      examples: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', title: 'After 1. e4', description: 'The notation "1. e4" means White\'s first move is pawn to e4.' },
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', title: 'After 1. e4 e5 2. Nf3', description: '"Nf3" means the knight moves to f3. No "N" means pawn.' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', commentary: 'Algebraic notation records every move. Moving the e-pawn two squares is written as "e4".', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.4)' }] },
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', move: 'e4', commentary: 'Now Black responds with "e5". Let\'s see it.', highlights: [{ square: 'e5', color: 'rgba(239, 68, 68, 0.4)' }] },
        { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', commentary: '"Nf3" moves the Knight to f3. The capital letter denotes the piece (K, Q, R, B, N). Pawns have no letter.' }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', instruction: 'Play e5 for Black to mirror White\'s move.', expectedMove: 'e5', highlights: [{ square: 'e5', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! e5 is recorded. Both sides claim central space.', incorrectFeedback: 'Move the Black pawn on e7 to e5.', hints: ['Move the e7 pawn forward two squares to e5'] }
      ],
      masteryPositions: [
        { fen: 'rnbqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 3 3', description: 'Attack the e5 pawn and develop your knight to f3 (Nf3).', solution: ['Nf3'], conceptTested: 'Algebraic notation Nf3', maxAttempts: 3 }
      ],
      exercises: [
        { type: 'quiz', question: 'What does "Nxe5" mean?', options: ['Knight to e5', 'Knight captures on e5', 'Knight from e5', 'New move e5'], answer: 1, explanation: 'The "x" symbol indicates a capture. Nxe5 means a knight captures the piece on e5.' },
        { type: 'quiz', question: 'What does "O-O" represent?', options: ['Queenside castling', 'Kingside castling', 'A draw', 'A null move'], answer: 1, explanation: 'O-O is kingside castling. O-O-O is queenside castling.' },
        { type: 'quiz', question: 'In FEN, what does a number represent?', options: ['Piece value', 'Move number', 'Consecutive empty squares', 'Rank number'], answer: 2, explanation: 'In the FEN piece placement, digits 1-8 represent that many consecutive empty squares.' }
      ]
    },
    {
      id: 'basic-checkmates',
      title: 'Basic Checkmates',
      difficulty: 'beginner',
      theory: `
<h2>Fundamental Checkmate Patterns</h2>
<p>Learning basic checkmate patterns is essential. These are the building blocks that every chess player must master.</p>

<h3>King & Queen vs. King</h3>
<p>The most common endgame checkmate. The technique uses the queen to progressively restrict the opponent's king to the edge of the board, then delivers checkmate with the help of your own king.</p>
<ol>
  <li>Use the queen to create a barrier, limiting the enemy king's movement</li>
  <li>Bring your king closer to support the queen</li>
  <li>Push the enemy king to the edge of the board</li>
  <li>Deliver checkmate on the edge</li>
</ol>

<div class="warning-box">
  <div class="warning-box-title">⚠️ Common Mistake</div>
  <p>Be careful not to stalemate! If the enemy king has no legal moves and is not in check, the game is drawn. Always leave the enemy king at least one square to move to until you're ready to deliver checkmate.</p>
</div>

<h3>King & Rook vs. King</h3>
<p>Slightly more complex but equally essential. The rook creates a barrier along a rank or file, while your king approaches to help deliver checkmate.</p>

<h3>Back-Rank Checkmate</h3>
<p>One of the most common tactical motifs in practical play. A rook or queen delivers checkmate on the first or eighth rank when the opponent's king is trapped behind its own pawns.</p>

<h3>Scholar's Mate</h3>
<p>A four-move checkmate: 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6?? 4. Qxf7#. While easily refuted by experienced players, it teaches the importance of the f7/f2 squares and early development.</p>
`,
      examples: [
        { fen: '4k3/8/8/8/8/8/8/4K2Q w - - 0 1', title: 'K+Q vs K Setup', description: 'White must use the queen and king together to force checkmate. The technique takes at most 10 moves.' },
        { fen: '4k3/8/4K3/8/8/8/8/7Q w - - 0 1', title: 'K+Q Checkmate Pattern', description: 'White plays Qe1 (or similar), restricting the king, then delivers mate.' },
        { fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1', title: 'K+R vs K Setup', description: 'The rook creates a barrier while the king approaches. This checkmate requires patience.' },
        { fen: '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', title: 'Back-Rank Mate Threat', description: 'If the rook reaches the 8th rank (Ra8), it\'s checkmate because the pawns block the king\'s escape.' }
      ],
      demoSteps: [
        { fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', commentary: 'Back-rank mate is one of the most common patterns. The black king is trapped behind its own pawns on f7, g7, h7.', highlights: [{ square: 'g8', color: 'rgba(239, 68, 68, 0.3)' }], arrows: [{ from: 'f7', to: 'g8', color: 'rgba(239, 68, 68, 0.4)' }, { from: 'g7', to: 'g8', color: 'rgba(239, 68, 68, 0.4)' }, { from: 'h7', to: 'g8', color: 'rgba(239, 68, 68, 0.4)' }] },
        { fen: '4R1k1/5ppp/8/8/8/8/8/6K1 w - - 0 1', move: 'Re8#', commentary: 'Re8 is CHECKMATE! The rook controls the entire 8th rank, and the king cannot escape because its own pawns block the way. This is the classic back-rank mate.' },
        { fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1', commentary: 'King + Rook checkmate: The white king on b6 controls the escape squares a7, b7, c7. The rook just needs to deliver check from behind.', highlights: [{ square: 'b6', color: 'rgba(16, 185, 129, 0.3)' }], arrows: [{ from: 'b6', to: 'a7', color: 'rgba(16, 185, 129, 0.4)' }, { from: 'b6', to: 'b7', color: 'rgba(16, 185, 129, 0.4)' }] },
        { fen: 'k7/8/1K6/8/8/8/8/R7 w - - 0 1', move: 'Ra1#', commentary: 'Ra1 is checkmate! The rook checks from a1, and the king on a8 has no escape — b8, a7, b7 are all controlled by the white king.' }
      ],
      guidedSteps: [
        { fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', instruction: 'Deliver back-rank checkmate! Slide the rook to the 8th rank.', expectedMove: 'Re8#', highlights: [{ square: 'e8', color: 'rgba(239, 68, 68, 0.3)' }], arrows: [{ from: 'e1', to: 'e8', color: 'rgba(16, 185, 129, 0.4)' }], correctFeedback: '🎉 Checkmate! The rook on e8 delivers check, and the king is trapped behind its own pawns. This is the classic back-rank mate pattern.', incorrectFeedback: 'Look at the 8th rank — it\'s completely open. If your rook goes there, the king has nowhere to run because f7, g7, h7 block its escape.', hints: ['The king is trapped behind its own pawns', 'Move the rook to the 8th rank'] },
        { fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1', instruction: 'Deliver checkmate with the rook! The king supports from b6.', expectedMove: 'Ra1#', highlights: [], correctFeedback: '🎉 Ra1 is checkmate! The white king controls all escape squares (a7, b7, b8), and the rook checks along the a-file.', incorrectFeedback: 'Your king controls the squares around the black king. You need to give check with the rook from a distance.', hints: ['The rook needs to give check along the a-file', 'Move the rook to a1'] },
        { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', instruction: 'Deliver Scholar\'s Mate! The f7 square is only defended by the king.', expectedMove: 'Qxf7#', highlights: [{ square: 'f7', color: 'rgba(239, 68, 68, 0.3)' }], arrows: [{ from: 'c4', to: 'f7', color: 'rgba(16, 185, 129, 0.4)' }], correctFeedback: '🎉 Qxf7# — Scholar\'s Mate! The queen captures on f7 with protection from the bishop on c4. The king has no escape.', incorrectFeedback: 'Look at f7 — it\'s only protected by the king. Your queen can capture there, and the bishop on c4 supports it.', hints: ['f7 is the weakest square in the opening', 'The bishop on c4 protects f7'] }
      ],
      masteryPositions: [
        { fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', description: 'Find the back-rank mate. The black king is vulnerable!', solution: ['Ra8'], conceptTested: 'Back-rank mate pattern recognition', maxAttempts: 4 },
        { fen: '5k2/4Qppp/8/8/8/8/5PPP/6K1 w - - 0 1', description: 'Deliver checkmate with the queen.', solution: ['Qe8#'], conceptTested: 'Queen checkmate delivery', maxAttempts: 3 }
      ],
      puzzles: [
        { id: 'mate1_01', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', solution: 'Re8#', theme: 'Back-Rank Mate', difficulty: 'beginner', explanation: 'The rook delivers checkmate on the 8th rank. The king is trapped behind its own pawns on f7, g7, h7.' },
        { id: 'mate1_02', fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1', solution: 'Ra1#', theme: 'K+R Checkmate', difficulty: 'beginner', explanation: 'With the white king on b6 supporting, Ra1 delivers checkmate. The black king has no escape squares.' },
        { id: 'mate1_03', fen: '5rk1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', solution: 'Ra8', theme: 'Back-Rank Mate', difficulty: 'beginner', explanation: 'Ra8 pins the rook and threatens checkmate. After Rxa8, it\'s back-rank mate.' },
        { id: 'mate1_04', fen: '2k5/8/2K5/8/8/8/8/4Q3 w - - 0 1', solution: 'Qa5', theme: 'K+Q Technique', difficulty: 'beginner', explanation: 'Multiple checkmates work here. Qa5 restricts the king and prepares mate.' },
        { id: 'mate1_05', fen: 'r1bqkbnr/pppp1Qpp/2n2p2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4', solution: 'Scholar\'s Mate', theme: 'Scholar\'s Mate', difficulty: 'beginner', explanation: 'This is Scholar\'s Mate after 1.e4 e5 2.Bc4 Nc6 3.Qh5 f6?? 4.Qxf7#. The queen and bishop combine to attack f7.' },
        { id: 'mate1_06', fen: '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 0 1', solution: 'Re8#', theme: 'Back-Rank Mate', difficulty: 'beginner', explanation: 'Re8 is checkmate. The rook controls the 8th rank and the g7, h7, f7 pawns trap the king.' },
        { id: 'mate1_07', fen: 'k7/pp6/1K6/8/8/8/8/1R6 w - - 0 1', solution: 'Ra1#', theme: 'Support Mate', difficulty: 'beginner', explanation: 'Ra1 checkmate. The rook delivers check on the a-file, the king is trapped by its own pawns.' },
        { id: 'mate1_08', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: 'Qxf7#', theme: 'Scholar\'s Mate', difficulty: 'beginner', explanation: 'Qxf7 is checkmate. The queen is protected by the bishop on c4, and the king has no escape.' }
      ]
    },
    {
      id: 'opening-principles',
      title: 'Opening Principles',
      difficulty: 'beginner',
      theory: `
<h2>Opening Principles</h2>
<p>The opening is the first phase of a chess game (roughly moves 1-15). While there are hundreds of specific openings, all good play follows these fundamental principles:</p>

<h3>1. Control the Center</h3>
<p>Place pawns and pieces in or toward the center (d4, d5, e4, e5). Central pieces have more mobility and influence over the board. The two most popular opening moves — <code>1. e4</code> and <code>1. d4</code> — immediately stake a claim in the center.</p>

<h3>2. Develop Your Pieces</h3>
<p>Bring your knights and bishops into play quickly. Each undeveloped piece is a piece not fighting for you. Aim to develop <strong>all minor pieces before move 10</strong>. Knights typically develop to f3/c3 (for White) or f6/c6 (for Black).</p>

<h3>3. Castle Early</h3>
<p>Castle within the first 10 moves to get your king to safety and connect your rooks. A king in the center is vulnerable to tactical attacks, especially once the position opens up.</p>

<h3>4. Don't Move the Same Piece Twice</h3>
<p>In the opening, move different pieces to develop your army quickly. Moving the same piece multiple times wastes valuable development time (called "tempo").</p>

<h3>5. Don't Bring the Queen Out Too Early</h3>
<p>The queen is easily harassed by minor pieces. If developed too early, your opponent gains tempo by attacking it while developing their own pieces.</p>

<h3>6. Connect Your Rooks</h3>
<p>After castling and developing all minor pieces, your rooks should "see" each other on the first rank with no pieces between them. Connected rooks defend each other and are ready to occupy open files.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 The Three Goals of the Opening</div>
  <p><strong>Development</strong> (get pieces active), <strong>King Safety</strong> (castle), and <strong>Center Control</strong> (pawns and pieces aimed at d4/d5/e4/e5). Every opening move should serve at least one of these goals.</p>
</div>
`,
      examples: [
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', title: 'After 1. e4', description: '1. e4 controls the center and opens lines for the bishop and queen. The most popular opening move.' },
        { fen: 'r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 2 2', title: 'Good Development', description: 'After 1. e4 Nc6 2. Nf3 — White develops a knight to a natural square, controls the center, and prepares castling.' },
        { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', title: 'Italian Game Setup', description: 'Both sides have developed knights and bishops, controlling the center. White should castle next (O-O).' }
      ],
      demoSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', commentary: 'Control the center: By opening with e4, White controls d5 and f5 and opens lines for development.', highlights: [{ square: 'd5', color: 'rgba(16, 185, 129, 0.4)' }, { square: 'f5', color: 'rgba(16, 185, 129, 0.4)' }] },
        { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', move: 'e4', commentary: 'Black copies with e5, defending the center and opening their own lines.', highlights: [{ square: 'd4', color: 'rgba(239, 68, 68, 0.4)' }, { square: 'f4', color: 'rgba(239, 68, 68, 0.4)' }] },
        { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', move: 'Nf3', commentary: 'White develops Nf3, activating the knight and immediately attacking Black\'s e5 pawn.', highlights: [{ square: 'e5', color: 'rgba(239, 68, 68, 0.4)' }] }
      ],
      guidedSteps: [
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', instruction: 'Start the game following opening principles: push e4 to control the center.', expectedMove: 'e4', highlights: [{ square: 'e4', color: 'rgba(16, 185, 129, 0.3)' }], correctFeedback: 'Excellent! e4 is the most popular opening move, claiming center control.', incorrectFeedback: 'Push your e-pawn forward two squares to e4.', hints: ['Select e2 and move to e4'] }
      ],
      masteryPositions: [
        { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 3 3', description: 'Attack Black\'s e5 pawn and develop your light-squared bishop to b5 (Bb5).', solution: ['Bb5'], conceptTested: 'Development with a threat (Bb5)', maxAttempts: 3 }
      ],
      exercises: [
        { type: 'quiz', question: 'Which opening move controls the center?', options: ['1. a4', '1. e4', '1. h3', '1. Na3'], answer: 1, explanation: '1. e4 places a pawn in the center, controlling d5 and f5, and opens lines for the queen and bishop.' },
        { type: 'quiz', question: 'Why should you castle early?', options: ['To trap the opponent', 'For king safety and rook activation', 'To attack', 'To promote a pawn'], answer: 1, explanation: 'Castling tucks the king away from the center and activates the rook.' },
        { type: 'quiz', question: 'Why is bringing the queen out early usually bad?', options: ['Queens are weak', 'The queen gets attacked, losing tempo', 'Rules prohibit it', 'The queen can\'t move far'], answer: 1, explanation: 'Minor pieces can attack the queen while developing, making you waste moves retreating.' }
      ]
    }
  ]
};

export default foundationsContent;
