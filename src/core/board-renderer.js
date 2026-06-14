// ChessOS — Interactive SVG Chess Board Renderer

// SVG piece definitions (CBurnett-style simplified)
const PIECE_PATHS = {
  K: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/>
    <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/>
    <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/>
  </g>`,
  Q: `<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
    <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z" stroke-linecap="butt"/>
    <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/>
    <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>
  </g>`,
  R: `<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/>
    <path d="M34 14l-3 3H14l-3-3"/>
    <path d="M15 17v7h15v-7" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" stroke-linejoin="miter"/>
  </g>`,
  B: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <g fill="#fff" stroke-linecap="butt">
      <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/>
      <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
      <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
    </g>
    <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/>
  </g>`,
  N: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
    <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
    <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/>
  </g>`,
  P: `<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>`,
  
  k: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22.5 11.63V6" stroke-linejoin="miter"/>
    <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/>
    <path d="M20 8h5" stroke-linejoin="miter"/>
    <path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#fff"/>
    <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/>
  </g>`,
  q: `<g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <g fill="#000" stroke="none">
      <circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/>
    </g>
    <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" fill="#000" stroke-linecap="butt"/>
    <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" stroke-linecap="butt"/>
    <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/>
    <path d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0" fill="none" stroke="#fff"/>
  </g>`,
  r: `<g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt" fill="#000"/>
    <path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter" fill="#000"/>
    <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" fill="#000"/>
    <path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/>
  </g>`,
  b: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" fill="#000"/>
    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#000"/>
    <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#000"/>
    <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" fill="none" stroke="#fff" stroke-linejoin="miter"/>
  </g>`,
  n: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/>
    <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/>
    <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/>
  </g>`,
  p: `<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>`
};

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

export class BoardRenderer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.size = options.size || 400;
    this.squareSize = this.size / 8;
    this.flipped = options.flipped || false;
    this.interactive = options.interactive !== false;
    this.showCoords = options.showCoords !== false;
    this.showLegalMoves = options.showLegalMoves !== false;
    this.onMove = options.onMove || null;
    this.onSquareClick = options.onSquareClick || null;

    // State
    this.position = null; // 8x8 array from chess.js board()
    this.selectedSquare = null;
    this.legalMoves = [];
    this.highlights = [];
    this.arrows = [];
    this.lastMove = null;
    this.checkSquare = null;
    this.dragPiece = null;
    this.dragOffset = { x: 0, y: 0 };

    // Colors
    this.lightColor = options.lightColor || '#e8dcc8';
    this.darkColor = options.darkColor || '#7b945d';

    this._createSVG();
    this._bindEvents();
  }

  _createSVG() {
    const totalSize = this.size;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', totalSize);
    this.svg.setAttribute('height', totalSize);
    this.svg.setAttribute('viewBox', `0 0 ${totalSize} ${totalSize}`);
    this.svg.classList.add('chess-board-svg');
    this.svg.style.userSelect = 'none';

    // Background
    const bg = this._el('rect', { x: 0, y: 0, width: totalSize, height: totalSize, fill: '#2a2a3a', rx: 4 });
    this.svg.appendChild(bg);

    // Board group
    this.boardGroup = this._el('g');
    this.svg.appendChild(this.boardGroup);

    // Layers
    this.squaresLayer = this._el('g');
    this.highlightLayer = this._el('g');
    this.piecesLayer = this._el('g');
    this.legalMovesLayer = this._el('g');
    this.arrowsLayer = this._el('g');
    this.dragLayer = this._el('g');

    this.boardGroup.appendChild(this.squaresLayer);
    this.boardGroup.appendChild(this.highlightLayer);
    this.boardGroup.appendChild(this.piecesLayer);
    this.boardGroup.appendChild(this.legalMovesLayer);
    this.boardGroup.appendChild(this.arrowsLayer);
    this.boardGroup.appendChild(this.dragLayer);

    // Draw squares
    this._drawSquares();

    this.container.innerHTML = '';
    this.container.appendChild(this.svg);
  }

  _el(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    return el;
  }

  _drawSquares() {
    this.squaresLayer.innerHTML = '';
    const sq = this.squareSize;
    const files = this.flipped ? [...FILES].reverse() : FILES;
    const ranks = this.flipped ? [...RANKS].reverse() : RANKS;

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const isLight = (r + f) % 2 === 0;
        const rect = this._el('rect', {
          x: f * sq,
          y: r * sq,
          width: sq,
          height: sq,
          fill: isLight ? this.lightColor : this.darkColor,
          'data-file': f,
          'data-rank': r
        });
        this.squaresLayer.appendChild(rect);

        // Internal coordinates coordinates within the board
        if (this.showCoords) {
          // Bottom row shows file letters
          if (r === 7) {
            const text = this._el('text', {
              x: f * sq + sq - 10,
              y: r * sq + sq - 4,
              'font-size': '10',
              'font-family': "'JetBrains Mono', monospace",
              'font-weight': '700',
              fill: isLight ? this.darkColor : this.lightColor,
              opacity: '0.8',
              'pointer-events': 'none'
            });
            text.textContent = files[f];
            this.squaresLayer.appendChild(text);
          }
          // Rightmost column shows rank numbers
          if (f === 7) {
            const text = this._el('text', {
              x: f * sq + sq - 10,
              y: r * sq + 12,
              'font-size': '10',
              'font-family': "'JetBrains Mono', monospace",
              'font-weight': '700',
              fill: isLight ? this.darkColor : this.lightColor,
              opacity: '0.8',
              'pointer-events': 'none'
            });
            text.textContent = ranks[r];
            this.squaresLayer.appendChild(text);
          }
        }
      }
    }
  }



  // Convert board coordinates to SVG coordinates
  _toSVG(file, rank) {
    const f = this.flipped ? 7 - file : file;
    const r = this.flipped ? 7 - rank : rank;
    return { x: f * this.squareSize, y: r * this.squareSize };
  }

  // Convert SVG coordinates to board square
  _toSquare(svgX, svgY) {
    let f = Math.floor(svgX / this.squareSize);
    let r = Math.floor(svgY / this.squareSize);
    if (this.flipped) { f = 7 - f; r = 7 - r; }
    if (f < 0 || f > 7 || r < 0 || r > 7) return null;
    return FILES[f] + RANKS[r];
  }

  // Set position from chess.js board()
  setPosition(board, lastMove = null, checkSquare = null) {
    this.position = board;
    this.lastMove = lastMove;
    this.checkSquare = checkSquare;
    this._render();
  }

  // Set position from FEN
  setFEN(fen) {
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    const board = [];
    
    for (const row of rows) {
      const boardRow = [];
      for (const ch of row) {
        if (/\d/.test(ch)) {
          for (let i = 0; i < parseInt(ch); i++) boardRow.push(null);
        } else {
          boardRow.push({
            type: ch.toLowerCase(),
            color: ch === ch.toUpperCase() ? 'w' : 'b'
          });
        }
      }
      board.push(boardRow);
    }
    
    this.position = board;
    this._render();
  }

  _render() {
    this._drawHighlights();
    this._drawPieces();
    this._drawLegalMoveIndicators();
    this._drawArrows();
  }

  _drawHighlights() {
    this.highlightLayer.innerHTML = '';
    const sq = this.squareSize;

    // Last move highlight
    if (this.lastMove) {
      for (const square of [this.lastMove.from, this.lastMove.to]) {
        const f = FILES.indexOf(square[0]);
        const r = RANKS.indexOf(square[1]);
        const pos = this._toSVG(f, r);
        const rect = this._el('rect', {
          x: pos.x, y: pos.y, width: sq, height: sq,
          fill: 'rgba(255, 255, 80, 0.25)'
        });
        this.highlightLayer.appendChild(rect);
      }
    }

    // Selected square
    if (this.selectedSquare) {
      const f = FILES.indexOf(this.selectedSquare[0]);
      const r = RANKS.indexOf(this.selectedSquare[1]);
      const pos = this._toSVG(f, r);
      const rect = this._el('rect', {
        x: pos.x, y: pos.y, width: sq, height: sq,
        fill: 'rgba(16, 185, 129, 0.5)'
      });
      this.highlightLayer.appendChild(rect);
    }

    // Check highlight
    if (this.checkSquare) {
      const f = FILES.indexOf(this.checkSquare[0]);
      const r = RANKS.indexOf(this.checkSquare[1]);
      const pos = this._toSVG(f, r);
      const grad = this._el('radialGradient', { id: 'check-grad' });
      const s1 = this._el('stop', { offset: '0%', 'stop-color': 'rgba(255,0,0,0.8)' });
      const s2 = this._el('stop', { offset: '100%', 'stop-color': 'rgba(255,0,0,0)' });
      grad.appendChild(s1);
      grad.appendChild(s2);
      this.highlightLayer.appendChild(grad);
      
      const rect = this._el('rect', {
        x: pos.x, y: pos.y, width: sq, height: sq,
        fill: 'rgba(239, 68, 68, 0.6)'
      });
      this.highlightLayer.appendChild(rect);
    }

    // Custom highlights
    for (const hl of this.highlights) {
      const f = FILES.indexOf(hl.square[0]);
      const r = RANKS.indexOf(hl.square[1]);
      const pos = this._toSVG(f, r);
      const attrs = {
        x: pos.x, y: pos.y, width: sq, height: sq,
        fill: hl.color || 'rgba(16, 185, 129, 0.3)'
      };
      if (hl.class) {
        attrs.class = hl.class;
      }
      const rect = this._el('rect', attrs);
      this.highlightLayer.appendChild(rect);
    }
  }

  _drawPieces() {
    this.piecesLayer.innerHTML = '';
    if (!this.position) return;
    
    const sq = this.squareSize;
    const scale = sq / 45; // SVG pieces designed for 45x45

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = this.position[r][f];
        if (!piece) continue;
        
        // Skip dragged piece
        if (this.dragPiece) {
          const dragF = FILES.indexOf(this.dragPiece.square[0]);
          const dragR = RANKS.indexOf(this.dragPiece.square[1]);
          if (f === dragF && r === dragR) continue;
        }

        const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
        const svg = PIECE_PATHS[key];
        if (!svg) continue;

        const pos = this._toSVG(f, r);
        const g = this._el('g', {
          transform: `translate(${pos.x}, ${pos.y}) scale(${scale})`,
          'data-square': FILES[f] + RANKS[r],
          style: 'cursor: pointer;'
        });
        g.innerHTML = svg;
        this.piecesLayer.appendChild(g);
      }
    }
  }

  _drawLegalMoveIndicators() {
    this.legalMovesLayer.innerHTML = '';
    if (!this.showLegalMoves || !this.selectedSquare || this.legalMoves.length === 0) return;

    const sq = this.squareSize;

    for (const move of this.legalMoves) {
      const f = FILES.indexOf(move.to[0]);
      const r = RANKS.indexOf(move.to[1]);
      const pos = this._toSVG(f, r);

      if (move.captured) {
        // Capture indicator: ring
        const ring = this._el('circle', {
          cx: pos.x + sq / 2,
          cy: pos.y + sq / 2,
          r: sq / 2 - 2,
          fill: 'none',
          stroke: 'rgba(16, 185, 129, 0.6)',
          'stroke-width': 3
        });
        this.legalMovesLayer.appendChild(ring);
      } else {
        // Move indicator: dot
        const dot = this._el('circle', {
          cx: pos.x + sq / 2,
          cy: pos.y + sq / 2,
          r: sq / 6,
          fill: 'rgba(16, 185, 129, 0.4)'
        });
        this.legalMovesLayer.appendChild(dot);
      }
    }
  }

  _drawArrows() {
    this.arrowsLayer.innerHTML = '';
    const sq = this.squareSize;

    for (const arrow of this.arrows) {
      const fromF = FILES.indexOf(arrow.from[0]);
      const fromR = RANKS.indexOf(arrow.from[1]);
      const toF = FILES.indexOf(arrow.to[0]);
      const toR = RANKS.indexOf(arrow.to[1]);

      const from = this._toSVG(fromF, fromR);
      const to = this._toSVG(toF, toR);

      const x1 = from.x + sq / 2;
      const y1 = from.y + sq / 2;
      const x2 = to.x + sq / 2;
      const y2 = to.y + sq / 2;

      // Arrowhead marker
      const markerId = `arrow-${arrow.from}-${arrow.to}`;
      const defs = this._el('defs');
      const marker = this._el('marker', {
        id: markerId, viewBox: '0 0 10 10', refX: 8, refY: 5,
        markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse'
      });
      const path = this._el('path', {
        d: 'M 0 0 L 10 5 L 0 10 z',
        fill: arrow.color || 'rgba(245, 158, 11, 0.8)'
      });
      marker.appendChild(path);
      defs.appendChild(marker);
      this.arrowsLayer.appendChild(defs);

      const attrs = {
        x1, y1, x2, y2,
        stroke: arrow.color || 'rgba(245, 158, 11, 0.8)',
        'stroke-width': arrow.width || 8,
        'stroke-linecap': 'round',
        'marker-end': `url(#${markerId})`,
        opacity: arrow.opacity || 0.8
      };
      if (arrow.class) {
        attrs.class = arrow.class;
      }
      if (arrow.dashed) {
        attrs['stroke-dasharray'] = '8, 4';
      }

      const line = this._el('line', attrs);
      this.arrowsLayer.appendChild(line);
    }
  }

  // Event handling
  _bindEvents() {
    if (!this.interactive) return;

    const getSquare = (e) => {
      const rect = this.svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return this._toSquare(x, y);
    };

    this.svg.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const square = getSquare(e);
      if (!square) return;

      if (this.selectedSquare) {
        // Try to make a move
        const isLegal = this.legalMoves.some(m => m.to === square);
        if (isLegal) {
          this._makeMove(this.selectedSquare, square);
        } else {
          this._selectSquare(square);
        }
      } else {
        this._selectSquare(square);
      }
    });

    // Touch support
    this.svg.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const square = getSquare(touch);
      if (!square) return;

      if (this.selectedSquare) {
        const isLegal = this.legalMoves.some(m => m.to === square);
        if (isLegal) {
          this._makeMove(this.selectedSquare, square);
        } else {
          this._selectSquare(square);
        }
      } else {
        this._selectSquare(square);
      }
    }, { passive: false });
  }

  _selectSquare(square) {
    if (!this.position) return;
    
    const f = FILES.indexOf(square[0]);
    const r = RANKS.indexOf(square[1]);
    const piece = this.position[r]?.[f];

    if (piece && this.onSquareClick) {
      const moves = this.onSquareClick(square, piece);
      if (moves) {
        this.selectedSquare = square;
        this.legalMoves = moves;
        this._render();
        return;
      }
    }

    this.selectedSquare = null;
    this.legalMoves = [];
    this._render();
  }

  _makeMove(from, to) {
    // Check for promotion
    const fromF = FILES.indexOf(from[0]);
    const fromR = RANKS.indexOf(from[1]);
    const piece = this.position[fromR]?.[fromF];
    
    let promotion = null;
    if (piece && piece.type === 'p') {
      const toRank = to[1];
      if ((piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')) {
        promotion = 'q'; // Auto-promote to queen
      }
    }

    if (this.onMove) {
      this.onMove(from, to, promotion);
    }

    this.selectedSquare = null;
    this.legalMoves = [];
  }

  // Public API
  flip() {
    this.flipped = !this.flipped;
    this._createSVG();
    this._bindEvents();
    this._render();
  }

  setHighlights(highlights) {
    this.highlights = highlights;
    this._render();
  }

  setArrows(arrows) {
    this.arrows = arrows;
    this._render();
  }

  clearAnnotations() {
    this.highlights = [];
    this.arrows = [];
    this.selectedSquare = null;
    this.legalMoves = [];
    this._render();
  }

  resize(size) {
    this.size = size;
    this.squareSize = size / 8;
    this._createSVG();
    this._bindEvents();
    if (this.position) this._render();
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export default BoardRenderer;
