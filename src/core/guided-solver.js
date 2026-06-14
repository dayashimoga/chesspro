// ChessOS — Guided Puzzle Solver (7-Step GM Thought Process)
import { ChessEngine } from './chess-engine.js';
import { stockfishService } from './stockfish-service.js';

export class GuidedSolver {
  constructor(board, puzzle, options = {}) {
    this.board = board;
    this.puzzle = puzzle;
    this.options = options;
    
    this.engine = new ChessEngine(puzzle.FEN);
    this.step = 1;
    this.state = {
      kingSafety: null,
      motifsSelected: [],
      overloadedPiece: null,
      candidates: [],
      opponentResponses: []
    };

    // Callbacks
    this.onStepChange = options.onStepChange || null;
    this.onComplete = options.onComplete || null;
    this.onFeedback = options.onFeedback || null;

    this._calculateAnswers();
  }

  // Pre-calculate correct answers dynamically
  _calculateAnswers() {
    // 1. King Safety calculation
    const whiteAttacks = this._countKingAreaAttackers('w');
    const blackAttacks = this._countKingAreaAttackers('b');
    
    if (whiteAttacks > blackAttacks + 1) {
      this.correctKingSafety = 'White';
    } else if (blackAttacks > whiteAttacks + 1) {
      this.correctKingSafety = 'Black';
    } else {
      this.correctKingSafety = 'Equal';
    }

    // 2. Motif matching
    this.correctMotif = this.puzzle.category;

    // 3. Overloaded piece detection
    this.correctOverloaded = this._findOverloadedPiece();
  }

  _countKingAreaAttackers(color) {
    // Basic heuristic: check squares around king
    const board = this.engine.board();
    let kingSquare = null;
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === color) {
          kingSquare = String.fromCharCode(97 + f) + (8 - r);
          break;
        }
      }
    }

    if (!kingSquare) return 0;

    // Count attacking pieces targeting this area
    const enemyColor = color === 'w' ? 'b' : 'w';
    let attackersCount = 0;
    
    // Simulate opponent turns to see moves hitting neighboring squares
    const clone = new ChessEngine(this.engine.fen());
    // Force turn to enemy
    const fenParts = clone.fen().split(' ');
    fenParts[1] = enemyColor;
    clone.load(fenParts.join(' '));

    const file = kingSquare.charCodeAt(0) - 97;
    const rank = parseInt(kingSquare[1]);

    const neighbors = [];
    for (let df = -1; df <= 1; df++) {
      for (let dr = -1; dr <= 1; dr++) {
        const nf = file + df;
        const nr = rank + dr;
        if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8) {
          neighbors.push(String.fromCharCode(97 + nf) + nr);
        }
      }
    }

    const legalMoves = clone.moves({ verbose: true });
    for (const sq of neighbors) {
      if (legalMoves.some(m => m.to === sq)) {
        attackersCount++;
      }
    }

    return attackersCount;
  }

  _findOverloadedPiece() {
    const board = this.engine.board();
    const activeColor = this.engine.turn();
    const defenseMap = {};

    // Map which pieces defend which other pieces
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.color === activeColor) {
          const square = String.fromCharCode(97 + f) + (8 - r);
          // Get moves ignoring opponent blocks
          const defenses = this._getDefendedSquares(square, piece);
          for (const defSq of defenses) {
            if (!defenseMap[defSq]) defenseMap[defSq] = [];
            defenseMap[defSq].push(square);
          }
        }
      }
    }

    // Overloaded = piece defending > 1 attacked piece
    for (const defSq in defenseMap) {
      const defenders = defenseMap[defSq];
      for (const def of defenders) {
        // If defender defends multiple squares
        const defendedByThis = Object.entries(defenseMap)
          .filter(([sq, list]) => list.includes(def))
          .map(([sq]) => sq);
        if (defendedByThis.length > 1) {
          return def; // Return the overloaded piece square
        }
      }
    }

    return 'None';
  }

  _getDefendedSquares(square, piece) {
    // Heuristic helper to find what a piece guards
    const squares = [];
    const files = 'abcdefgh';
    const f = files.indexOf(square[0]);
    const r = parseInt(square[1]);

    if (piece.type === 'p') {
      const dir = piece.color === 'w' ? 1 : -1;
      if (f > 0) squares.push(files[f - 1] + (r + dir));
      if (f < 7) squares.push(files[f + 1] + (r + dir));
    }
    // Simple bishop/rook/knight/queen spans can be checked similarly, or we skip complex rules
    return squares;
  }

  // Go to next step
  nextStep() {
    this.step++;
    if (this.step > 7) {
      if (this.onComplete) this.onComplete();
    } else {
      if (this.onStepChange) this.onStepChange(this.step);
    }
  }

  // Answer King Safety
  answerKingSafety(choice) {
    const isCorrect = choice.toLowerCase() === this.correctKingSafety.toLowerCase();
    if (this.onFeedback) {
      this.onFeedback({
        isCorrect,
        message: isCorrect 
          ? `Correct! The ${this.correctKingSafety} King is less safe due to coordination threats.`
          : `Incorrect. Look closer at attacker numbers and open lines around the kings.`
      });
    }
    if (isCorrect) {
      this.state.kingSafety = choice;
      setTimeout(() => this.nextStep(), 1500);
    }
    return isCorrect;
  }

  // Answer Motif
  answerMotif(motif) {
    const isCorrect = motif.toLowerCase() === this.correctMotif.toLowerCase() || 
                      motif.toLowerCase().includes(this.puzzle.theme.toLowerCase()) ||
                      this.puzzle.theme.toLowerCase().includes(motif.toLowerCase());
    
    if (this.onFeedback) {
      this.onFeedback({
        isCorrect,
        message: isCorrect
          ? `Correct! The tactical theme is indeed related to ${this.puzzle.theme}.`
          : `Incorrect. Consider the alignment, double threats, or geometry in the position.`
      });
    }
    if (isCorrect) {
      this.state.motifsSelected.push(motif);
      setTimeout(() => this.nextStep(), 1500);
    }
    return isCorrect;
  }

  // Answer Overloaded
  answerOverloaded(square) {
    const isCorrect = square === this.correctOverloaded;
    if (this.onFeedback) {
      this.onFeedback({
        isCorrect,
        message: isCorrect
          ? `Excellent! You spotted the overloaded element.`
          : `No, that piece is not overloaded. Check defender workloads.`
      });
    }
    if (isCorrect) {
      this.state.overloadedPiece = square;
      setTimeout(() => this.nextStep(), 1500);
    }
    return isCorrect;
  }

  // Input Candidate Move
  addCandidateMove(from, to) {
    const moveStr = `${from}${to}`;
    if (this.state.candidates.some(c => c.move === moveStr)) return;

    const testEngine = new ChessEngine(this.puzzle.FEN);
    const move = testEngine.move({ from, to, promotion: 'q' });
    
    if (!move) {
      if (this.onFeedback) this.onFeedback({ isCorrect: false, message: 'Invalid move!' });
      return;
    }

    // Evaluate candidate move
    let rating = 'Too slow';
    const cleanSol = this.puzzle.solution.split(' ')[0];
    
    if (move.san === cleanSol || moveStr === cleanSol || move.lan === cleanSol) {
      rating = 'Excellent';
    } else {
      // Use local minimax evaluator fallback
      const score = testEngine.evaluate();
      if (score > 100) {
        rating = 'Interesting';
      }
    }

    this.state.candidates.push({
      move: move.san,
      lan: moveStr,
      rating
    });

    if (this.onFeedback) {
      this.onFeedback({
        isCorrect: rating === 'Excellent',
        message: `Candidate move: ${move.san} is evaluated as: **${rating}**`,
        candidates: this.state.candidates
      });
    }

    if (rating === 'Excellent') {
      setTimeout(() => this.nextStep(), 2000);
    }
  }

  // Force Calculation
  submitResponseMove(from, to) {
    // Opponent reply moves validation
    const expectedReplies = this.puzzle.solution.split(' ');
    const currentPly = this.engine.history.length;
    
    // We expect the opponent's reply at ply index 1, 3, etc.
    const expectedMove = expectedReplies[currentPly];
    
    const move = this.engine.move({ from, to, promotion: 'q' });
    if (!move) {
      if (this.onFeedback) this.onFeedback({ isCorrect: false, message: 'Illegal move!' });
      return;
    }

    const isCorrect = move.san === expectedMove || `${from}${to}` === expectedMove || move.lan === expectedMove;

    if (isCorrect) {
      this.board.setPosition(this.engine.board(), this.engine.lastMove());
      
      // If we still have moves left in the main line
      if (this.engine.history.length < expectedReplies.length) {
        // Play the player's next move automatically to prompt next defense
        const nextPlayerMove = expectedReplies[this.engine.history.length];
        setTimeout(() => {
          this.engine.move(nextPlayerMove);
          this.board.setPosition(this.engine.board(), this.engine.lastMove());
          
          if (this.engine.history.length >= expectedReplies.length) {
            this.nextStep();
          } else {
            if (this.onFeedback) {
              this.onFeedback({
                isCorrect: true,
                message: `Correct! Opponent played ${move.san}. Now calculate their response after my ${nextPlayerMove}.`
              });
            }
          }
        }, 800);
      } else {
        this.nextStep();
      }
    } else {
      this.engine.undo();
      if (this.onFeedback) {
        this.onFeedback({
          isCorrect: false,
          message: `Incorrect defense. Calculate Black's toughest resource after Bxf7+.`
        });
      }
    }
  }
}
