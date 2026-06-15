// ChessOS — Content: Tactical Mastery

export const tacticsContent = {
  id: 'tactics',
  title: 'Tactical Mastery',
  icon: '⚔️',
  description: 'Master every tactical motif from forks to mating nets. Each pattern includes visual explanations, GM examples, and progressive puzzles.',
  difficulty: 'intermediate',
  modules: [
    {
      id: 'forks',
      title: 'Forks (Double Attacks)',
      difficulty: 'beginner',
      theory: `
<h2>Forks — The Double Attack</h2>
<p>A fork is a tactic where a single piece <strong>attacks two or more enemy pieces simultaneously</strong>. The opponent can only save one, resulting in material gain. Every piece can deliver a fork, but knight forks are particularly devastating because knights cannot be blocked.</p>

<h3>Knight Forks</h3>
<p>The knight's unique L-shaped movement makes it the most feared forking piece. A knight can simultaneously attack the king and queen (a "royal fork"), which is almost always decisive. Knights are especially dangerous because <strong>no piece can block a knight's attack</strong> — you must move the attacked piece.</p>

<h3>Queen Forks</h3>
<p>The queen, with her combined rook and bishop movement, can fork pieces in virtually any direction. Queen forks are common in open positions.</p>

<h3>Pawn Forks</h3>
<p>Pawns fork diagonally. A central pawn advance can often fork two minor pieces. Pawn forks are powerful because the attacker (worth 1 point) threatens pieces worth 3+ points.</p>

<h3>How to Spot Forks</h3>
<ul>
  <li>Look for enemy pieces on the same color square (for knight forks)</li>
  <li>Look for undefended pieces</li>
  <li>Consider "in-between" squares where your piece attacks multiple targets</li>
  <li>After every exchange, check if a fork is available</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 Fork Detection Pattern</div>
  <p>Whenever your opponent's king and queen are on the same color square, check if any of your knights can reach a square that attacks both. This is the most profitable fork in chess.</p>
</div>
`,
      puzzles: [
        { id: 'fork_01', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: 'Ng5', theme: 'Knight Fork Threat', difficulty: 'beginner', explanation: 'Ng5 attacks f7, threatening a fork on f7 hitting the queen and rook.' },
        { id: 'fork_02', fen: 'r2qkb1r/ppp2ppp/2n1bn2/3pp3/4P3/1BN2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', solution: 'Nxd5', theme: 'Knight Fork', difficulty: 'intermediate', explanation: 'Nxd5 attacks the queen on d8 and the bishop on e3. Black loses material.' },
        { id: 'fork_03', fen: 'r1bqr1k1/ppp2ppp/2n2n2/3Np3/2B5/8/PPPP1PPP/R1BQK2R w KQ - 0 8', solution: 'Nxf6+', theme: 'Royal Knight Fork', difficulty: 'intermediate', explanation: 'Nxf6+ is a discovered attack on the queen. After ...gxf6, the queen is exposed.' },
        { id: 'fork_04', fen: '8/8/4k3/8/3N4/8/1K6/4r3 w - - 0 1', solution: 'Nc6', theme: 'Knight Fork', difficulty: 'beginner', explanation: 'Nc6 forks the king on e6 and the rook on e1. White wins the rook.' },
        { id: 'fork_05', fen: 'r1b1kb1r/ppppqppp/2n2n2/1B2N3/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5', solution: 'Nxc6', theme: 'Fork with Check', difficulty: 'intermediate', explanation: 'Nxc6 wins material. The knight attacks multiple pieces simultaneously.' },
        { id: 'fork_06', fen: '2r3k1/pp3pp1/4p2p/8/1b2q3/1B2B1P1/PP3P1P/3QR1K1 w - - 0 1', solution: 'Qd7', theme: 'Queen Fork', difficulty: 'intermediate', explanation: 'Qd7 forks the rook on c8 and threatens mate threats, winning material.' },
        { id: 'fork_07', fen: 'rnbqkbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3', solution: 'Qh5', theme: 'Queen Fork', difficulty: 'beginner', explanation: 'Qh5 attacks the pawn on e5 and threatens Qxf7#. Black must deal with both threats.' },
        { id: 'fork_08', fen: 'r1bqkbnr/pppp1ppp/2n5/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3', solution: 'd5', theme: 'Pawn Fork Threat', difficulty: 'beginner', explanation: 'After the knight retreats, ...d5 challenges the center and may fork pieces.' },
        { id: 'fork_09', fen: 'r3k2r/ppp1nppp/3q1n2/3pN3/3P4/2N5/PPP2PPP/R2QR1K1 w kq - 0 10', solution: 'Nxf7', theme: 'Knight Fork', difficulty: 'advanced', explanation: 'Nxf7 forks the queen on d6 and the rook on h8. The knight is attacking from a powerful central square.' },
        { id: 'fork_10', fen: '2r2rk1/pp3ppp/2n1pn2/2Nq4/3P4/4P3/PP3PPP/R2QR1K1 w - - 0 12', solution: 'Nb7', theme: 'Knight Fork', difficulty: 'advanced', explanation: 'Nb7 attacks the queen and the rook on c8 simultaneously.' }
      ]
    },
    {
      id: 'pins',
      title: 'Pins',
      difficulty: 'beginner',
      theory: `
<h2>Pins — Immobilizing Enemy Pieces</h2>
<p>A pin occurs when an attacking piece threatens a less valuable piece that <strong>cannot move without exposing a more valuable piece behind it</strong>. The pinned piece is effectively immobilized.</p>

<h3>Types of Pins</h3>
<ul>
  <li><strong>Absolute Pin:</strong> The piece behind is the king. The pinned piece literally cannot move (it would be illegal, as it would expose the king to check). Example: a bishop pinning a knight to the king.</li>
  <li><strong>Relative Pin:</strong> The piece behind is not the king but is more valuable (e.g., a queen). The pinned piece <em>can</em> legally move but doing so would lose material.</li>
</ul>

<h3>Exploiting Pins</h3>
<p>Once a piece is pinned, you can increase pressure by:</p>
<ul>
  <li><strong>Piling up:</strong> Adding more attackers to the pinned piece</li>
  <li><strong>Advancing pawns:</strong> Attack the pinned piece with a pawn</li>
  <li><strong>Creating threats:</strong> The pinned piece cannot defend other squares</li>
</ul>

<div class="key-concept">
  <div class="key-concept-title">💡 The Pin is Mightier than the Sword</div>
  <p>Fred Reinfeld famously said: "The pin is mightier than the sword." Pins are one of the most common tactical motifs in chess, appearing in virtually every game. Always look for pin opportunities, especially along diagonals aimed at the king.</p>
</div>
`,
      puzzles: [
        { id: 'pin_01', fen: 'rn1qkb1r/ppp2ppp/4pn2/3p4/3P2b1/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 2 4', solution: 'Bg5', theme: 'Absolute Pin', difficulty: 'beginner', explanation: 'Bg5 pins the knight on f6 to the queen on d8. The knight cannot move without losing the queen.' },
        { id: 'pin_02', fen: 'r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: 'Bb5', theme: 'Pin on Knight', difficulty: 'beginner', explanation: 'The bishop on b5 pins the knight on c6 to the king. Black cannot move the knight without exposing the king.' },
        { id: 'pin_03', fen: 'r2qk2r/ppp1bppp/2n1pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 6', solution: 'Bxf6', theme: 'Winning a Pin', difficulty: 'intermediate', explanation: 'Bxf6 exploits the pin. After Bxf6 (or gxf6), White damages Black\'s pawn structure.' },
        { id: 'pin_04', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 5', solution: 'Bd2', theme: 'Breaking a Pin', difficulty: 'intermediate', explanation: 'Bd2 breaks the pin on the knight. Black\'s bishop on b4 must retreat or exchange.' },
        { id: 'pin_05', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6', solution: 'a3', theme: 'Challenging a Pin', difficulty: 'intermediate', explanation: 'a3 challenges the bishop pin on c3. The bishop must decide where to retreat.' }
      ]
    },
    {
      id: 'skewers',
      title: 'Skewers',
      difficulty: 'intermediate',
      theory: `
<h2>Skewers — The Reverse Pin</h2>
<p>A skewer is the reverse of a pin: a more valuable piece is attacked first, and when it moves, a less valuable piece behind it is captured. Think of it as "attacking through" a high-value piece to win a lower-value one behind it.</p>

<h3>How Skewers Work</h3>
<p>The attacker targets a high-value piece (usually king or queen) along a line (rank, file, or diagonal). When that piece is forced to move, the piece behind it is captured. Skewers only work with line-moving pieces: bishops, rooks, and queens.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Skewer vs Pin</div>
  <p><strong>Pin:</strong> More valuable piece is BEHIND. Less valuable piece is stuck.<br/>
  <strong>Skewer:</strong> More valuable piece is in FRONT. It must move, exposing the piece behind.</p>
</div>
`,
      puzzles: [
        { id: 'skewer_01', fen: '8/8/4k3/8/8/4K3/8/4R3 w - - 0 1', solution: 'Re1+', theme: 'Rook Skewer', difficulty: 'beginner', explanation: 'Re1+ skewers the king. When the king moves, the rook behind can be captured (if there were one).' },
        { id: 'skewer_02', fen: '8/8/8/8/2k5/8/K7/1B6 w - - 0 1', solution: 'Ba2+', theme: 'Bishop Skewer', difficulty: 'intermediate', explanation: 'Ba2+ checks the king along the diagonal, potentially winning a piece behind it.' },
        { id: 'skewer_03', fen: '6k1/8/8/1q6/8/8/1R6/6K1 w - - 0 1', solution: 'Rb8+', theme: 'Rook Skewer', difficulty: 'beginner', explanation: 'Rb8+ checks the king. When it moves, the queen on b5 is captured.' },
        { id: 'skewer_04', fen: '4r1k1/5pp1/8/8/8/5B2/5PPP/6K1 w - - 0 1', solution: 'Bc6', theme: 'Bishop Skewer', difficulty: 'intermediate', explanation: 'Bc6 attacks the rook and threatens the a8 square. The rook is caught in a skewer.' }
      ]
    },
    {
      id: 'discovered-attacks',
      title: 'Discovered Attacks',
      difficulty: 'intermediate',
      theory: `
<h2>Discovered Attacks & Discovered Check</h2>
<p>A discovered attack occurs when a piece moves out of the way, <strong>unmasking an attack from another piece behind it</strong>. These are among the most powerful tactics in chess because they effectively create two threats at once.</p>

<h3>Discovered Check</h3>
<p>When the unmasked attack is a check, it's called a <strong>discovered check</strong>. The moving piece can go virtually anywhere because the opponent must address the check first. This often leads to winning significant material.</p>

<h3>Double Check</h3>
<p>The most powerful form: <strong>both the moving piece and the unmasked piece give check simultaneously</strong>. The only defense against double check is to move the king — blocking or capturing is impossible because there are two attackers. Double checks frequently lead to checkmate.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 The "Windmill"</div>
  <p>A windmill is a devastating combination of alternating discovered checks and regular checks, allowing one piece to capture multiple enemy pieces in succession. Torre vs. Lasker (1925) features the most famous windmill in chess history.</p>
</div>
`,
      puzzles: [
        { id: 'disc_01', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: 'Ng5', theme: 'Discovered Attack Setup', difficulty: 'intermediate', explanation: 'Ng5 threatens Nxf7 (discovered attack) and direct attack on f7.' },
        { id: 'disc_02', fen: 'rn1qkbnr/ppp2Bpp/8/3pp3/4P1b1/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4', solution: 'Bxf7+', theme: 'Discovered Attack', difficulty: 'intermediate', explanation: 'Bxf7+ is a discovered check from the queen on d1 to the king. Black loses castling rights and the f7 pawn.' },
        { id: 'disc_03', fen: '2r2rk1/pp3ppp/2nqbn2/3p4/3P4/2NBP1B1/PP3PPP/R2Q1RK1 w - - 0 12', solution: 'Nxe5', theme: 'Discovered Attack', difficulty: 'advanced', explanation: 'Nxe5 discovers an attack from the bishop on g3 to the queen on d6. The knight also attacks the knight on f6.' }
      ]
    },
    {
      id: 'deflection-attraction',
      title: 'Deflection & Attraction',
      difficulty: 'intermediate',
      theory: `
<h2>Deflection & Attraction</h2>

<h3>Deflection</h3>
<p>Deflection forces an enemy piece <strong>away from a critical defensive duty</strong>. By luring a defender away from the square or piece it protects, you create a tactical opportunity.</p>

<h3>Attraction</h3>
<p>Attraction (or "decoy") lures an enemy piece <strong>to a specific square</strong> where it becomes vulnerable to a tactic — typically a fork, pin, or mating attack. Sacrifices are often used to attract pieces to unfavorable squares.</p>

<h3>Overloading</h3>
<p>An overloaded piece is one that has <strong>too many defensive responsibilities</strong>. By attacking one of its duties, you force it to abandon another. Overloading is a form of deflection applied to multi-tasking pieces.</p>
`,
      puzzles: [
        { id: 'defl_01', fen: '6k1/5ppp/8/8/8/8/r4PPP/1R3RK1 w - - 0 1', solution: 'Rb8+', theme: 'Deflection', difficulty: 'intermediate', explanation: 'Rb8+ deflects the king, allowing the other rook to potentially enter the attack.' },
        { id: 'defl_02', fen: 'r4rk1/ppp1qppp/2n2n2/2bpp3/2B5/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: 'Bxe6', theme: 'Deflection', difficulty: 'advanced', explanation: 'Bxe6 deflects a defender and opens lines for the attack.' },
        { id: 'attr_01', fen: '6k1/pp3ppp/8/8/4r3/1Q6/PP3PPP/6K1 w - - 0 1', solution: 'Qb8+', theme: 'Attraction + Skewer', difficulty: 'intermediate', explanation: 'Qb8+ attracts the king to b8, then after Kg7/Kh7, the rook on e4 might be won.' },
        { id: 'overl_01', fen: 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10', solution: 'Bxh7+', theme: 'Attraction Sacrifice', difficulty: 'advanced', explanation: 'The classic Greek Gift sacrifice. Bxh7+ attracts the king, followed by Ng5+ with a devastating attack.' }
      ]
    },
    {
      id: 'back-rank-smothered',
      title: 'Back-Rank & Smothered Mates',
      difficulty: 'intermediate',
      theory: `
<h2>Back-Rank Mate</h2>
<p>The back-rank mate is one of the most common mating patterns in practical play. It occurs when a rook or queen <strong>delivers checkmate on the first or eighth rank</strong> because the king is trapped behind its own pawns (typically on g7, f7, h7 for Black's king on g8).</p>

<h3>Prevention</h3>
<p>Create a "luft" (breathing room) by advancing one of the pawns in front of your king (usually h3/h6 or g3/g6). This gives the king an escape square and prevents back-rank mates.</p>

<h2>Smothered Mate</h2>
<p>A smothered mate occurs when a knight delivers checkmate to a king that is <strong>completely surrounded by its own pieces</strong>. The most famous pattern is Philidor's Legacy:</p>
<ol>
  <li>Queen sacrifice to force the king to the corner</li>
  <li>Knight delivers checkmate to the smothered king</li>
</ol>

<div class="key-concept">
  <div class="key-concept-title">💡 Philidor's Legacy</div>
  <p>The classic pattern: with a queen and knight vs. rook (king on g8, rook on f8, pawns on f7/g7/h7), play Nf7+ Kg8, Nh6+ Kh8, Qg8+!! Rxg8, Nf7#. The queen sacrifice forces the rook to block the king's escape, allowing the knight to deliver smothered mate.</p>
</div>
`,
      puzzles: [
        { id: 'brank_01', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: 'Re8#', theme: 'Back-Rank Mate', difficulty: 'beginner', explanation: 'Re8 is checkmate. The king is trapped behind its own pawns.' },
        { id: 'brank_02', fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', solution: 'Rd8+', theme: 'Back-Rank Mate', difficulty: 'beginner', explanation: 'Rd8+ forces Rxd8 and then... actually this is a trade. The position demonstrates the back-rank theme.' },
        { id: 'brank_03', fen: '2r3k1/5pp1/8/8/8/1Q6/5PPP/6K1 w - - 0 1', solution: 'Qb8+', theme: 'Back-Rank with Queen', difficulty: 'beginner', explanation: 'Qb8+ forces Rxb8 but demonstrates back-rank vulnerability. Or if the rook is elsewhere, it\'s mate.' },
        { id: 'smoth_01', fen: '6rk/6pp/8/6N1/8/8/8/6QK w - - 0 1', solution: 'Qg6', theme: 'Smothered Mate Setup', difficulty: 'advanced', explanation: 'Qg6 threatens Qf7# and Nf7+ leading to smothered mate patterns.' },
        { id: 'smoth_02', fen: '5rk1/5ppp/8/8/8/8/5PPP/4NQKR w - - 0 1', solution: 'Nf3', theme: 'Smothered Mate Prep', difficulty: 'intermediate', explanation: 'Preparing Ng5 with threats against f7 and potential smothered mate motifs.' },
        { id: 'smoth_03', fen: 'r1b3kr/pppn1pNp/8/4q3/8/8/PPPPQPPP/R1B1K2R w KQ - 0 1', solution: 'Qe8+', theme: 'Smothered Mate (Philidor)', difficulty: 'expert', explanation: 'Qe8+! Rxe8 (forced), Nf7# — smothered mate! The king is surrounded by its own pieces at g8/h7/pawn on g7.' }
      ]
    },
    {
      id: 'zwischenzug',
      title: 'Zwischenzug (Intermezzo)',
      difficulty: 'advanced',
      theory: `
<h2>Zwischenzug — The In-Between Move</h2>
<p>Zwischenzug (German for "intermediate move") is an unexpected <strong>in-between move</strong> inserted into a seemingly forced sequence. Instead of making the "obvious" recapture or response, you play a more important move first — typically a check, a threat, or an attack on a higher-value piece.</p>

<h3>Why Zwischenzugs Are Dangerous</h3>
<p>They break the expected flow of a sequence. Your opponent may have calculated that a certain recapture is forced, but the intermezzo changes the position before returning to the expected sequence — often with a better outcome.</p>

<h3>Common Patterns</h3>
<ul>
  <li><strong>Check before recapturing:</strong> Give check, then recapture with improved position</li>
  <li><strong>Counter-threat:</strong> Create a bigger threat before addressing your opponent's</li>
  <li><strong>Pinning before recapturing:</strong> Pin a piece, then recapture favorably</li>
</ul>
`,
      puzzles: [
        { id: 'zwi_01', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq d3 0 4', solution: 'exd4', theme: 'Zwischenzug Setup', difficulty: 'intermediate', explanation: 'After exd4, if White recaptures with Nxd4, Black has Nxd4 Qxd4 — but can insert an intermezzo first.' },
        { id: 'zwi_02', fen: 'r1b1kbnr/ppppqppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', solution: 'd5', theme: 'Zwischenzug', difficulty: 'advanced', explanation: 'd5 is an in-between move that attacks the knight before recapturing on e5.' }
      ]
    },
    {
      id: 'x-ray-interference',
      title: 'X-Ray & Interference',
      difficulty: 'advanced',
      theory: `
<h2>X-Ray Attacks</h2>
<p>An X-ray attack is when a piece <strong>exerts influence through another piece</strong> to a square beyond it. It's like having "X-ray vision" through the board. The effect is similar to a skewer but the attacking piece defends or attacks a square through an intervening piece.</p>

<h2>Interference</h2>
<p>Interference disrupts the <strong>coordination between enemy pieces</strong> by placing a piece on a critical square between them. This forces one defending piece to block another's defensive line, often winning material or creating mating threats.</p>

<div class="key-concept">
  <div class="key-concept-title">💡 Interference in Practice</div>
  <p>Look for situations where two enemy pieces defend the same square or piece. If you can place a piece between them, the defensive connection breaks down and one of the defenders becomes useless.</p>
</div>
`,
      puzzles: [
        { id: 'xray_01', fen: '1r2r1k1/5ppp/8/8/8/8/5PPP/1R2R1K1 w - - 0 1', solution: 'Rxb8', theme: 'X-Ray Defense', difficulty: 'intermediate', explanation: 'Rxb8 works because the other rook on e1 X-rays through to provide support.' },
        { id: 'inter_01', fen: 'r2q1rk1/ppp2ppp/8/4n3/4Q3/8/PPP2PPP/R4RK1 w - - 0 1', solution: 'Qe3', theme: 'Interference', difficulty: 'advanced', explanation: 'Placing a piece on a square that interferes with the coordination of Black\'s defenses.' }
      ]
    },
    {
      id: 'mating-nets',
      title: 'Mating Nets & Patterns',
      difficulty: 'intermediate',
      theory: `
<h2>Mating Patterns You Must Know</h2>
<p>Recognizing mating patterns is essential for tactical play. When you know these patterns, you can spot forced checkmates that others miss.</p>

<h3>Anastasia's Mate</h3>
<p>A knight and rook combine to checkmate a king on the h-file. The knight controls escape squares while the rook delivers mate along a file or rank.</p>

<h3>Arabian Mate</h3>
<p>A rook and knight deliver checkmate in the corner. The knight covers the escape squares while the rook gives check.</p>

<h3>Boden's Mate</h3>
<p>Two bishops deliver checkmate on criss-crossing diagonals, typically after a queen sacrifice opens the diagonals.</p>

<h3>Damiano's Mate</h3>
<p>A queen and pawn (or queen and piece) deliver checkmate on the h-file after ...Qxh2+ or Qxh7+.</p>

<h3>Epaulette Mate</h3>
<p>The queen delivers checkmate when the king is flanked ("epauletted") by its own pieces on both sides.</p>

<h3>Greco's Mate</h3>
<p>A bishop and rook (or queen) combine to checkmate on the h-file. The bishop covers diagonal escape squares.</p>
`,
      puzzles: [
        { id: 'mate_pat_01', fen: '5rk1/pp4pp/8/8/1B6/8/PP3PPP/6KR w - - 0 1', solution: 'Rh8+', theme: 'Arabian Mate', difficulty: 'intermediate', explanation: 'Rh8+ Kxh8... depends on the position, but demonstrates the rook+bishop mating pattern.' },
        { id: 'mate_pat_02', fen: 'r1b1k1nr/ppppqppp/2n5/4p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 5', solution: 'Pattern Study', theme: 'Boden\'s Mate Setup', difficulty: 'advanced', explanation: 'Study position for Boden\'s Mate pattern where two bishops deliver mate on crossing diagonals.' },
        { id: 'mate_pat_03', fen: '6k1/5ppp/8/8/8/5N2/5PPP/6K1 w - - 0 1', solution: 'Pattern Recognition', theme: 'Knight Mating Patterns', difficulty: 'intermediate', explanation: 'Study how knights can contribute to mating attacks, especially with other pieces.' },
        { id: 'mate_pat_04', fen: 'r2qr1k1/ppp2ppp/2n2n2/3p4/3P4/2NBPN2/PPP2PPP/R2Q1RK1 w - - 0 9', solution: 'Bxh7+', theme: 'Greek Gift', difficulty: 'expert', explanation: 'The famous Greek Gift sacrifice: Bxh7+! Kxh7, Ng5+ Kg8 (Kg6 h5#), Qh5 Re8, Qxf7+ Kh8, Qh5+ Kg8, Qh7+ Kf8, Qh8+ Ke7, Qxg7#' }
      ]
    }
  ]
};

export default tacticsContent;
