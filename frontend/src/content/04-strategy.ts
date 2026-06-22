// ChessOS — Content: Strategic Chess (Interactive)
export const strategyContent = {
  "id": "strategy",
  "title": "Strategic Chess",
  "icon": "🏰",
  "description": "Understand the deep positional principles that govern chess: pawn structures, piece placement, space, and long-term planning.",
  "difficulty": "intermediate",
  "modules": [
    {
      "id": "pawn-structures",
      "title": "Pawn Structures",
      "difficulty": "intermediate",
      "theory": "\n<h2>Pawn Structure — The Skeleton of the Position</h2>\n<p>Philidor called pawns \"the soul of chess.\" The pawn structure determines the character of the position: which pieces are strong, where to attack, and what plans to pursue.</p>\n\n<h3>Isolated Pawns</h3>\n<p>An isolated pawn has no friendly pawns on adjacent files. It cannot be defended by other pawns and becomes a target. However, an isolated d-pawn (IQP) can be a dynamic advantage because:</p>\n<ul>\n  <li>It controls key central squares (c5, e5)</li>\n  <li>It provides open files for rooks on c and e files</li>\n  <li>It creates attacking chances with d4-d5 breakthrough</li>\n</ul>\n<p>The IQP is strong in the middlegame (active pieces compensate) but weak in the endgame (no pieces to support it).</p>\n\n<h3>Doubled Pawns</h3>\n<p>Two pawns of the same color on the same file. Generally a weakness because they can't protect each other and one may become a target. However, doubled pawns can control important squares and open files for rooks.</p>\n\n<h3>Backward Pawns</h3>\n<p>A pawn that cannot be advanced because the square in front is controlled by an enemy pawn, and it cannot be supported by adjacent pawns. The square in front of a backward pawn is often a strong outpost for the opponent.</p>\n\n<h3>Hanging Pawns</h3>\n<p>Two adjacent pawns (usually on c4 and d4 or c5 and d5) with no pawns on adjacent files. They can be dynamic (if advanced, they create space) or weak (if blockaded, they become targets).</p>\n\n<h3>Passed Pawns</h3>\n<p>A pawn with no enemy pawns ahead of it on the same or adjacent files. Passed pawns are extremely powerful, especially in the endgame, because they threaten promotion. <em>\"A passed pawn is a criminal which should be kept under lock and key.\"</em> — Nimzowitsch</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Pawn Majority</div>\n  <p>A pawn majority on one side of the board (e.g., 3 vs. 2 on the queenside) can create a passed pawn. The side with the majority should advance those pawns to create a passer.</p>\n</div>\n",
      "examples": [
        {
          "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
          "title": "Isolated Queen Pawn (IQP)",
          "description": "White has an isolated d4 pawn. It controls c5 and e5, but is a long-term weakness."
        },
        {
          "fen": "r1bq1rk1/pp2ppbp/2np1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 7",
          "title": "Central Pawn Duo",
          "description": "White's pawns on d4 and e4 control the center powerfully."
        },
        {
          "fen": "r1bq1rk1/ppp2ppp/2n2n2/3pp3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 6",
          "title": "Pawn Chain",
          "description": "White has a pawn chain (c3-d4-e5). Pawns support each other in a diagonal formation."
        }
      ],
      "exercises": [
        {
          "type": "quiz",
          "question": "What is an isolated pawn?",
          "options": [
            "A pawn with no adjacent friendly pawns",
            "A pawn that has been captured",
            "A pawn on the edge of the board",
            "A pawn that cannot move"
          ],
          "answer": 0,
          "explanation": "An isolated pawn has no friendly pawns on adjacent files to support it."
        },
        {
          "type": "quiz",
          "question": "A passed pawn is dangerous because...",
          "options": [
            "It attacks more squares",
            "It threatens to promote",
            "It blocks the opponent's rook",
            "It's worth more points"
          ],
          "answer": 1,
          "explanation": "A passed pawn has a clear path to promotion with no enemy pawns to stop it."
        }
      ],
      "demoSteps": [
        {
          "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
          "commentary": "Let's explore the key strategic principles of Pawn Structures in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
          "instruction": "To practice this concept, execute the logical move: Na4.",
          "expectedMove": "Na4",
          "correctFeedback": "Excellent! You played Na4 correctly.",
          "incorrectFeedback": "Try to make the move Na4."
        }
      ],
      "masteryPositions": [
        {
          "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "Na4"
          ],
          "conceptTested": "Pawn Structures",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "piece-activity",
      "title": "Piece Activity & Outposts",
      "difficulty": "intermediate",
      "theory": "\n<h2>Piece Activity</h2>\n<p>The activity and coordination of your pieces is often more important than material count. A well-placed knight can be worth more than a poorly-placed rook.</p>\n\n<h3>Outposts</h3>\n<p>An outpost is a square (usually in the opponent's half of the board) that cannot be attacked by enemy pawns. Knights on outposts are particularly powerful because:</p>\n<ul>\n  <li>They cannot be driven away by pawns</li>\n  <li>They control important squares deep in enemy territory</li>\n  <li>They can only be removed by piece exchanges</li>\n</ul>\n\n<h3>Good Bishop vs. Bad Bishop</h3>\n<p>A bishop is \"good\" when most of its pawns are on the opposite color, leaving its diagonals open. A \"bad\" bishop is blocked by its own pawns. When you have a bad bishop, try to trade it or get your pawns off its color.</p>\n\n<h3>Rook Activity</h3>\n<ul>\n  <li><strong>Open files:</strong> Place rooks on files with no pawns</li>\n  <li><strong>Half-open files:</strong> Files with only enemy pawns</li>\n  <li><strong>7th rank:</strong> A rook on the 7th rank attacks enemy pawns and restricts the king</li>\n  <li><strong>Doubling rooks:</strong> Two rooks on the same file multiply their power</li>\n</ul>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 The Principle of Two Weaknesses</div>\n  <p>When your opponent has one weakness, they can usually defend it. To win, create a <strong>second weakness</strong> on a different part of the board. The defender cannot cover both simultaneously, and you can switch the point of attack.</p>\n</div>\n",
      "examples": [
        {
          "fen": "r1bq1rk1/ppp2ppp/2n2n2/3Np3/2B1P3/8/PPPP1PPP/R1BQ1RK1 w - - 0 7",
          "title": "Knight Outpost",
          "description": "White's knight on d5 is a powerful outpost — it cannot be attacked by Black's pawns and dominates the center."
        },
        {
          "fen": "r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 6",
          "title": "Open File Control",
          "description": "After piece exchanges, rooks will contest the open c-file."
        }
      ],
      "exercises": [
        {
          "type": "quiz",
          "question": "What makes a knight outpost strong?",
          "options": [
            "It's in the center",
            "Enemy pawns can't attack it",
            "It's protected by a pawn",
            "All of the above"
          ],
          "answer": 3,
          "explanation": "The ideal outpost is centralized, safe from pawn attacks, and supported by a friendly pawn."
        },
        {
          "type": "quiz",
          "question": "Where do rooks belong?",
          "options": [
            "On closed files",
            "Behind friendly pawns",
            "On open files",
            "In the corner"
          ],
          "answer": 2,
          "explanation": "Rooks need open or half-open files to exert maximum influence."
        }
      ],
      "demoSteps": [
        {
          "fen": "r1bq1rk1/ppp2ppp/2n2n2/3Np3/2B1P3/8/PPPP1PPP/R1BQ1RK1 w - - 0 7",
          "commentary": "Let's explore the key strategic principles of Piece Activity & Outposts in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "r1bq1rk1/ppp2ppp/2n2n2/3Np3/2B1P3/8/PPPP1PPP/R1BQ1RK1 w - - 0 7",
          "instruction": "To practice this concept, execute the logical move: Nb6.",
          "expectedMove": "Nb6",
          "correctFeedback": "Excellent! You played Nb6 correctly.",
          "incorrectFeedback": "Try to make the move Nb6."
        }
      ],
      "masteryPositions": [
        {
          "fen": "r1bq1rk1/ppp2ppp/2n2n2/3Np3/2B1P3/8/PPPP1PPP/R1BQ1RK1 w - - 0 7",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "Nb6"
          ],
          "conceptTested": "Piece Activity & Outposts",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "space-initiative",
      "title": "Space & Initiative",
      "difficulty": "advanced",
      "theory": "\n<h2>Space Advantage</h2>\n<p>Space is the amount of territory your pieces can access. A space advantage gives your pieces more room to maneuver while cramping your opponent's pieces.</p>\n\n<h3>How Space Works</h3>\n<p>Pawns define space. Pawns on the 4th and 5th ranks control squares in the opponent's territory. A space advantage is valuable because:</p>\n<ul>\n  <li>Your pieces have more mobility</li>\n  <li>You can transfer pieces between flanks more easily</li>\n  <li>The opponent's pieces are cramped and poorly coordinated</li>\n  <li>You have more options for attack</li>\n</ul>\n\n<h2>Initiative</h2>\n<p>The initiative means you are dictating the play — making threats that your opponent must respond to. The side with the initiative controls the game's tempo and direction.</p>\n\n<h3>Maintaining Initiative</h3>\n<ul>\n  <li>Create threats with every move</li>\n  <li>Keep your opponent on the defensive</li>\n  <li>Don't waste time on passive moves</li>\n  <li>Convert initiative to a lasting advantage before it dissipates</li>\n</ul>\n\n<h2>Prophylaxis</h2>\n<p>Prophylaxis is thinking about your opponent's plans and preventing them. Before making your own move, ask: <em>\"What does my opponent want to do?\"</em> — then stop it. Petrosian and Karpov were masters of prophylactic thinking.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Dynamic vs Static Advantages</div>\n  <p><strong>Static advantages</strong> (better structure, bishop pair, extra material) persist. <strong>Dynamic advantages</strong> (initiative, piece activity, development lead) are temporary and must be converted. The art of strategy is converting dynamic advantages into static ones.</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "What is prophylaxis?",
          "options": [
            "An aggressive attack",
            "Preventing your opponent's plans",
            "Sacrificing material",
            "Trading pieces"
          ],
          "answer": 1,
          "explanation": "Prophylaxis is the art of anticipating and preventing your opponent's plans before they materialize."
        },
        {
          "type": "quiz",
          "question": "Dynamic advantages should be...",
          "options": [
            "Ignored",
            "Converted to static advantages",
            "Traded for material",
            "Maintained forever"
          ],
          "answer": 1,
          "explanation": "Dynamic advantages (initiative, activity) are temporary and should be converted to lasting static advantages."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Space & Initiative in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Space & Initiative",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "weak-squares-deep",
      "title": "Weak Squares & Color Complexes",
      "difficulty": "intermediate",
      "theory": "\n<h2>Weak Squares — The Foundation of Positional Play</h2>\n<p>A weak square is one that can no longer be defended by pawns. Once a pawn advances past a square, that square can become a permanent weakness exploitable by the opponent's pieces — especially knights.</p>\n\n<h3>Creating Weak Squares</h3>\n<ul>\n  <li><strong>Pawn advances:</strong> e.g., f3 weakens e3 and g3</li>\n  <li><strong>Pawn exchanges:</strong> Opening a file may expose weak squares</li>\n  <li><strong>Piece pressure:</strong> Forcing pawn moves that create weaknesses</li>\n</ul>\n\n<h3>Exploiting Weak Squares</h3>\n<p>Knights are the best pieces for exploiting weak squares because they can occupy outposts permanently. Bishops can also exploit weak color complexes — if your opponent has weakened all squares of one color, your bishop on that color becomes dominant.</p>\n\n<h3>Color Complex Weakness</h3>\n<p>When multiple squares of the same color are weak (e.g., after trading the dark-squared bishop and pushing pawns off dark squares), the remaining bishop of that color for the opponent becomes \"bad\" while yours becomes dominant.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Nimzowitsch's Rule</div>\n  <p>\"First restrain, then blockade, then destroy.\" When you identify a weakness, restrain the opponent's ability to eliminate it, blockade it with a piece (ideally a knight), then attack it.</p>\n</div>\n",
      "examples": [
        {
          "fen": "r1bq1rk1/pp2ppbp/2np2p1/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 9",
          "title": "Weak d5 Square",
          "description": "Black has weakened d5 with ...d6 and ...g6. White can plant a knight on d5."
        },
        {
          "fen": "r1bq1rk1/ppp2pp1/2n1p2p/3pP3/3P1B2/2N2N2/PPP2PPP/R2QR1K1 w - - 0 9",
          "title": "Dark Square Weakness",
          "description": "After exchanging the dark-squared bishop, all of Black's dark squares are vulnerable."
        }
      ],
      "exercises": [
        {
          "type": "quiz",
          "question": "What piece is best at exploiting weak squares?",
          "options": [
            "Queen",
            "Rook",
            "Knight",
            "Bishop"
          ],
          "answer": 2,
          "explanation": "Knights are ideal for exploiting weak squares because they can permanently occupy outposts that can't be attacked by pawns."
        },
        {
          "type": "quiz",
          "question": "A \"color complex\" weakness occurs when...",
          "options": [
            "You lose your queen",
            "Multiple squares of one color are weak",
            "Pawns are doubled",
            "The king is exposed"
          ],
          "answer": 1,
          "explanation": "A color complex weakness means multiple squares of the same color have become permanently weak, often after trading the bishop of that color."
        }
      ],
      "demoSteps": [
        {
          "fen": "r1bq1rk1/pp2ppbp/2np2p1/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 9",
          "commentary": "Let's explore the key strategic principles of Weak Squares & Color Complexes in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "r1bq1rk1/pp2ppbp/2np2p1/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 9",
          "instruction": "To practice this concept, execute the logical move: Bb5.",
          "expectedMove": "Bb5",
          "correctFeedback": "Excellent! You played Bb5 correctly.",
          "incorrectFeedback": "Try to make the move Bb5."
        }
      ],
      "masteryPositions": [
        {
          "fen": "r1bq1rk1/pp2ppbp/2np2p1/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 9",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "Bb5"
          ],
          "conceptTested": "Weak Squares & Color Complexes",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "bishop-pair",
      "title": "The Bishop Pair Advantage",
      "difficulty": "intermediate",
      "theory": "\n<h2>The Power of Two Bishops</h2>\n<p>The two bishops together are stronger than bishop + knight or two knights, especially in open positions. Steinitz estimated the bishop pair as worth approximately half a pawn extra.</p>\n\n<h3>Why the Bishop Pair is Strong</h3>\n<ul>\n  <li><strong>Coverage:</strong> Together they control squares of both colors</li>\n  <li><strong>Long diagonals:</strong> In open positions, bishops dominate from distance</li>\n  <li><strong>Coordination:</strong> They support each other and create mating patterns</li>\n  <li><strong>Endgame power:</strong> The bishop pair is especially strong in endgames with pawns on both sides</li>\n</ul>\n\n<h3>When to Trade a Bishop</h3>\n<p>Trade one of your opponent's bishops if:</p>\n<ul>\n  <li>The position is becoming closed (knights > bishops)</li>\n  <li>You can get the bishop pair yourself</li>\n  <li>The traded bishop was particularly active</li>\n</ul>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Fischer's View</div>\n  <p>\"I always liked the bishop pair. The two bishops can create a deadly crossfire that is hard to defend against.\" — Bobby Fischer</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "The bishop pair is estimated to be worth...",
          "options": [
            "Nothing extra",
            "Half a pawn extra",
            "A full pawn extra",
            "Two pawns extra"
          ],
          "answer": 1,
          "explanation": "Steinitz and modern analysis suggest the bishop pair is worth approximately half a pawn in open positions."
        },
        {
          "type": "quiz",
          "question": "In what type of position is the bishop pair strongest?",
          "options": [
            "Closed positions",
            "Symmetric positions",
            "Open positions",
            "Endgames without pawns"
          ],
          "answer": 2,
          "explanation": "In open positions, bishops have long diagonals and maximum range, making the pair most powerful."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of The Bishop Pair Advantage in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "The Bishop Pair Advantage",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "minority-attack",
      "title": "The Minority Attack",
      "difficulty": "advanced",
      "theory": "\n<h2>The Minority Attack</h2>\n<p>A minority attack uses fewer pawns (typically 2) against more (typically 3) to create weaknesses in the opponent's pawn structure. It's one of the most important strategic concepts in chess.</p>\n\n<h3>The Classic b4-b5 Break</h3>\n<p>In the Queen's Gambit structures (Carlsbad structure), White often plays a4-b4-b5 to attack Black's c6-d5 pawn chain. After b5 cxb5, Black gets an isolated c-pawn or backward c-pawn, which becomes a long-term target.</p>\n\n<h3>Steps of the Minority Attack</h3>\n<ol>\n  <li>Secure the kingside — ensure your king is safe</li>\n  <li>Place a rook on the b-file</li>\n  <li>Advance the a and b pawns</li>\n  <li>Exchange with bxc6 or wait for ...cxb5</li>\n  <li>Target the resulting weak pawn</li>\n</ol>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Patience is Key</div>\n  <p>The minority attack is a long-term plan. Don't rush the pawn advance — prepare it carefully and be ready to switch plans if the opponent counter-attacks on the other wing.</p>\n</div>\n",
      "examples": [
        {
          "fen": "r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8",
          "title": "Carlsbad Structure",
          "description": "The typical Carlsbad pawn structure where White plays a minority attack with b4-b5."
        }
      ],
      "exercises": [
        {
          "type": "quiz",
          "question": "A minority attack typically involves...",
          "options": [
            "4 pawns vs 3",
            "2 pawns vs 3",
            "1 pawn vs 2",
            "Sacrificing a pawn"
          ],
          "answer": 1,
          "explanation": "A minority attack uses 2 pawns against 3 to create structural weaknesses."
        }
      ],
      "demoSteps": [
        {
          "fen": "r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8",
          "commentary": "Let's explore the key strategic principles of The Minority Attack in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8",
          "instruction": "To practice this concept, execute the logical move: c5.",
          "expectedMove": "c5",
          "correctFeedback": "Excellent! You played c5 correctly.",
          "incorrectFeedback": "Try to make the move c5."
        }
      ],
      "masteryPositions": [
        {
          "fen": "r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "c5"
          ],
          "conceptTested": "The Minority Attack",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "piece-exchanges",
      "title": "The Art of Piece Exchanges",
      "difficulty": "advanced",
      "theory": "\n<h2>When to Exchange Pieces</h2>\n<p>Knowing when to exchange and when to maintain pieces is a crucial skill. Wrong exchanges can transform a winning position into a draw or even a loss.</p>\n\n<h3>Exchange When:</h3>\n<ul>\n  <li>You have a material advantage — fewer pieces = easier to convert</li>\n  <li>Your opponent has an active piece that you can eliminate</li>\n  <li>Exchanging leads to a favorable pawn structure</li>\n  <li>You are under attack — exchanges reduce attacking potential</li>\n  <li>You want to reach a winning endgame</li>\n</ul>\n\n<h3>Avoid Exchanging When:</h3>\n<ul>\n  <li>You have the initiative — more pieces = more attacking chances</li>\n  <li>Your pieces are more active than the opponent's</li>\n  <li>The exchange gives your opponent open lines</li>\n  <li>You have a space advantage — cramped positions are harder to hold with more pieces</li>\n</ul>\n\n<h3>The Capablanca Method</h3>\n<p>Capablanca was the master of simplification. He would exchange the \"right\" pieces to reach technically won endgames. The key: exchange your opponent's active pieces and keep your strong ones.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Exchange Your Opponent's Best Piece</div>\n  <p>Identify your opponent's best piece — the one creating the most problems — and exchange it. This often transforms the position dramatically.</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "When ahead in material, you should generally...",
          "options": [
            "Avoid all exchanges",
            "Exchange pieces to simplify",
            "Only exchange pawns",
            "Keep all pieces on the board"
          ],
          "answer": 1,
          "explanation": "When ahead in material, exchanging pieces (not pawns) makes the advantage easier to convert."
        },
        {
          "type": "quiz",
          "question": "When should you avoid exchanges?",
          "options": [
            "When you are under attack",
            "When you have the initiative",
            "When your opponent is passive",
            "When you are ahead in material"
          ],
          "answer": 1,
          "explanation": "When you have the initiative, keep pieces on the board to maintain attacking chances. More pieces = more threats."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of The Art of Piece Exchanges in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "The Art of Piece Exchanges",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "restriction-technique",
      "title": "Restriction & Prophylactic Thinking",
      "difficulty": "advanced",
      "theory": "\n<h2>The Art of Restriction</h2>\n<p>Restriction means limiting your opponent's pieces and pawns from achieving their ideal positions. It's the first step of Nimzowitsch's famous \"restrain, blockade, destroy\" principle.</p>\n\n<h3>Methods of Restriction</h3>\n<ul>\n  <li><strong>Pawn chains:</strong> Control key squares to prevent piece maneuvers</li>\n  <li><strong>Piece placement:</strong> A knight on e5 restricts the bishop on c8</li>\n  <li><strong>Prophylactic moves:</strong> Small preventing moves (h3, a3) that stop counterplay</li>\n  <li><strong>Control of open files:</strong> Occupy the file to prevent rook activity</li>\n</ul>\n\n<h3>Petrosian's Prophylaxis</h3>\n<p>Petrosian would ask three questions before every move:</p>\n<ol>\n  <li>What is my opponent threatening?</li>\n  <li>What is my opponent's ideal plan?</li>\n  <li>How can I prevent it without worsening my position?</li>\n</ol>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 \"Do Nothing\" Moves</div>\n  <p>Sometimes the best strategy is a quiet move that improves your position while preventing your opponent's plans. These \"do nothing\" moves are often the hardest to find but the most effective.</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "The three steps of Nimzowitsch's principle are...",
          "options": [
            "Attack, defend, draw",
            "Develop, attack, checkmate",
            "Restrain, blockade, destroy",
            "Open, invade, convert"
          ],
          "answer": 2,
          "explanation": "Nimzowitsch's famous principle: first restrain the opponent's counterplay, then blockade their weaknesses, then destroy them."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Restriction & Prophylactic Thinking in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Restriction & Prophylactic Thinking",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "pawn-majority",
      "title": "Pawn Majorities & Breakthroughs",
      "difficulty": "advanced",
      "theory": "\n<h2>Pawn Majority Strategy</h2>\n<p>A pawn majority (more pawns than your opponent on one side of the board) is a strategic asset because it can create a passed pawn.</p>\n\n<h3>Healthy vs Unhealthy Majority</h3>\n<ul>\n  <li><strong>Healthy majority:</strong> All pawns on adjacent files, no doubled pawns</li>\n  <li><strong>Unhealthy majority:</strong> Doubled pawns, isolated pawns, or backward pawns in the majority</li>\n</ul>\n\n<h3>Using the Majority</h3>\n<p>Advance the majority to create a passed pawn. The key technical rule: advance the pawn that does NOT have an opponent directly in front of it first. This prevents blockade.</p>\n\n<h3>Queenside Majority</h3>\n<p>A queenside majority is generally more valuable because the king usually castles kingside, making it harder to stop a queenside passed pawn.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Botvinnik's Rule</div>\n  <p>\"A queenside pawn majority is a valuable endgame asset because the king is far away from the passed pawn.\" — Mikhail Botvinnik</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "When advancing a pawn majority, which pawn should you push first?",
          "options": [
            "The one closest to the center",
            "The one WITHOUT an opponent directly ahead",
            "The one on the edge",
            "The one already most advanced"
          ],
          "answer": 1,
          "explanation": "Push the pawn that has no direct opponent first — this prevents blockade and creates a passed pawn more efficiently."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Pawn Majorities & Breakthroughs in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Pawn Majorities & Breakthroughs",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "blockade-technique",
      "title": "Blockade Strategy",
      "difficulty": "advanced",
      "theory": "\n<h2>The Blockade</h2>\n<p>A blockade means placing a piece (ideally a knight) directly in front of an enemy passed pawn to stop it from advancing. The blockading piece gains tremendous power because it sits on a permanently secure square.</p>\n\n<h3>The Ideal Blockader</h3>\n<ul>\n  <li><strong>Knight:</strong> The best blockader — it radiates power in all directions while stopping the pawn</li>\n  <li><strong>Bishop:</strong> Good blockader if it controls important diagonals from the square</li>\n  <li><strong>King:</strong> Excellent blockader in the endgame</li>\n  <li><strong>Rook:</strong> Worst blockader — its long-range power is wasted on blockading duty</li>\n</ul>\n\n<h3>Breaking a Blockade</h3>\n<p>To break a blockade, exchange the blockading piece. Use piece pressure to force the blockader away, or create a second threat elsewhere.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Nimzowitsch's Legacy</div>\n  <p>Nimzowitsch wrote extensively about blockade in \"My System.\" His key insight: the blockader doesn't just stop the pawn — it becomes a powerful piece because the pawn underneath it provides a natural anchor.</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "The best piece for blockading a passed pawn is usually...",
          "options": [
            "Queen",
            "Rook",
            "Bishop",
            "Knight"
          ],
          "answer": 3,
          "explanation": "The knight is the ideal blockader — it radiates power in all directions while sitting on a secure square in front of the pawn."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Blockade Strategy in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Blockade Strategy",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "good-knight-bad-bishop",
      "title": "Good Knight vs Bad Bishop",
      "difficulty": "advanced",
      "theory": "\n<h2>Knight Superiority Over Bishop</h2>\n<p>While bishops are generally considered slightly better than knights (especially in open positions), there are many positions where the knight clearly dominates.</p>\n\n<h3>When Knight > Bishop</h3>\n<ul>\n  <li><strong>Closed positions:</strong> Pawns block bishop diagonals, knight hops over</li>\n  <li><strong>Central outposts:</strong> A knight on a secure central square dominates</li>\n  <li><strong>Same-color pawns:</strong> If an opponent has pawns on the bishop's color</li>\n  <li><strong>Both flanks engaged:</strong> Knight can reach both sides of the board</li>\n</ul>\n\n<h3>The Bad Bishop</h3>\n<p>A bishop blocked by its own pawns (most pawns on the same color as the bishop) is \"bad.\" Ways to deal with a bad bishop:</p>\n<ul>\n  <li>Trade it for the opponent's knight or good bishop</li>\n  <li>Place it outside the pawn chain (e.g., Bc8-a6 in the French Defense)</li>\n  <li>Change the pawn structure to free the bishop</li>\n</ul>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "A \"bad\" bishop is one that...",
          "options": [
            "Has been recently moved",
            "Is blocked by its own pawns",
            "Is on the edge of the board",
            "Has no pawns to defend"
          ],
          "answer": 1,
          "explanation": "A bad bishop is blocked by its own pawns on the same color squares, limiting its mobility and influence."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Good Knight vs Bad Bishop in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Good Knight vs Bad Bishop",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "centralization",
      "title": "The Principle of Centralization",
      "difficulty": "intermediate",
      "theory": "\n<h2>Centralization — Control the Center</h2>\n<p>Pieces in the center control the maximum number of squares and can be redeployed to either flank quickly. Centralization is one of the most fundamental strategic principles.</p>\n\n<h3>Piece Centralization</h3>\n<ul>\n  <li><strong>Knights:</strong> A knight on e4 or d5 controls 8 squares; on a1 it controls only 2</li>\n  <li><strong>Bishops:</strong> A bishop on e4 controls both long diagonals</li>\n  <li><strong>Queen:</strong> A centralized queen is powerful but can be attacked</li>\n  <li><strong>King (endgame):</strong> In the endgame, centralize the king — it becomes a fighting piece</li>\n</ul>\n\n<h3>Central Pawn Control</h3>\n<p>The classical ideal is e4+d4 (or e5+d5 for Black), but hypermodern theory shows you can also control the center with pieces while letting the opponent overextend with pawns.</p>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Steinitz's Principle</div>\n  <p>\"The right to attack belongs to the side with a positional advantage.\" Centralized pieces give you the positional advantage that justifies an attack.</p>\n</div>\n",
      "examples": [
        {
          "fen": "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          "title": "Classical Center",
          "description": "White's pawns on d4 and e4 form the ideal classical center, controlling key squares."
        }
      ],
      "exercises": [
        {
          "type": "quiz",
          "question": "A knight on d5 controls how many squares?",
          "options": [
            "4",
            "6",
            "8",
            "12"
          ],
          "answer": 2,
          "explanation": "A centralized knight controls up to 8 squares, making it maximally powerful."
        },
        {
          "type": "quiz",
          "question": "In the endgame, the king should...",
          "options": [
            "Stay safe in the corner",
            "Be centralized",
            "Protect the rook",
            "Stay behind pawns"
          ],
          "answer": 1,
          "explanation": "In the endgame, the king becomes a fighting piece and should be centralized to support pawns and attack the opponent's position."
        }
      ],
      "demoSteps": [
        {
          "fen": "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          "commentary": "Let's explore the key strategic principles of The Principle of Centralization in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          "instruction": "To practice this concept, execute the logical move: d5.",
          "expectedMove": "d5",
          "correctFeedback": "Excellent! You played d5 correctly.",
          "incorrectFeedback": "Try to make the move d5."
        }
      ],
      "masteryPositions": [
        {
          "fen": "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "d5"
          ],
          "conceptTested": "The Principle of Centralization",
          "maxAttempts": 3
        }
      ]
    },
    {
      "id": "positional-evaluation",
      "title": "Positional Evaluation Checklist",
      "difficulty": "expert",
      "theory": "\n<h2>How to Evaluate Any Position</h2>\n<p>Strong players can assess a position quickly using a systematic checklist. Master this, and you'll always know who stands better and what plans to pursue.</p>\n\n<h3>The Evaluation Checklist</h3>\n<ol>\n  <li><strong>Material:</strong> Count the pieces — who has more? Any imbalances?</li>\n  <li><strong>King Safety:</strong> Are both kings safe? Any attacking chances?</li>\n  <li><strong>Pawn Structure:</strong> Weak pawns? Passed pawns? Pawn islands?</li>\n  <li><strong>Piece Activity:</strong> Which pieces are active? Which are passive?</li>\n  <li><strong>Space:</strong> Who controls more territory?</li>\n  <li><strong>Development:</strong> (In the opening) Who is further developed?</li>\n  <li><strong>Initiative:</strong> Who is dictating the play?</li>\n  <li><strong>Files/Diagonals:</strong> Open files for rooks? Long diagonals for bishops?</li>\n</ol>\n\n<h3>Making a Plan</h3>\n<p>After evaluating, identify the most important imbalance and create a plan around it. For example:</p>\n<ul>\n  <li>If you have a better structure → aim for an endgame</li>\n  <li>If you have more piece activity → attack before the advantage fades</li>\n  <li>If you have a space advantage → maneuver pieces and create threats on both flanks</li>\n  <li>If you have a passed pawn → support it and push for promotion</li>\n</ul>\n\n<div class=\"key-concept\">\n  <div class=\"key-concept-title\">💡 Silman's Imbalance Theory</div>\n  <p>Every chess position contains imbalances: material, piece activity, pawn structure, space, initiative. Identify the key imbalance and build your plan around it. Don't play random moves — every move should serve the plan dictated by the position's imbalances.</p>\n</div>\n",
      "exercises": [
        {
          "type": "quiz",
          "question": "The first thing to check when evaluating a position is...",
          "options": [
            "Tactics",
            "Material",
            "King safety",
            "Pawn structure"
          ],
          "answer": 1,
          "explanation": "Material is the most concrete factor — always check material balance first before evaluating positional elements."
        },
        {
          "type": "quiz",
          "question": "If you have a space advantage, you should...",
          "options": [
            "Trade all pieces",
            "Maneuver and create threats on both flanks",
            "Sacrifice material",
            "Offer a draw"
          ],
          "answer": 1,
          "explanation": "A space advantage allows you to maneuver freely. Use it to create threats on both flanks, stretching the opponent's defense."
        }
      ],
      "demoSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "commentary": "Let's explore the key strategic principles of Positional Evaluation Checklist in this position."
        }
      ],
      "guidedSteps": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "instruction": "To practice this concept, execute the logical move: a3.",
          "expectedMove": "a3",
          "correctFeedback": "Excellent! You played a3 correctly.",
          "incorrectFeedback": "Try to make the move a3."
        }
      ],
      "masteryPositions": [
        {
          "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "description": "Demonstrate your mastery by playing the continuation move in this position.",
          "solution": [
            "a3"
          ],
          "conceptTested": "Positional Evaluation Checklist",
          "maxAttempts": 3
        }
      ]
    }
  ]
};

export default strategyContent;
