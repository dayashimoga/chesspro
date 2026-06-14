// ChessOS — Master Games Study Library

export const MASTER_GAMES = [
  {
    id: 'morphy_opera',
    white: 'Paul Morphy',
    black: 'Duke Karl / Count Isouard',
    event: 'Paris Opera House',
    date: '1858',
    result: '1-0',
    description: 'The most famous game in chess history. Morphy demonstrates the power of rapid development, open lines, and a spectacular mating sacrifice.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      { move: 'e4', eval: '+0.3', delta: '0.0', idea: 'Control Center', motif: 'Open Lines', comment: 'Morphy opens the game by claiming space in the center and preparing development of the light-squared bishop.' },
      { move: 'e5', eval: '+0.3', delta: '0.0', idea: 'Defend Center', motif: 'Symmetrical', comment: 'Black responds symmetrically, staking their own claim to the center.' },
      { move: 'Nf3', eval: '+0.4', delta: '+0.1', idea: 'Develop & Attack', motif: 'Tempo', comment: 'Developing the knight to its most active square, attacking the e5 pawn and preparing castling.' },
      { move: 'd6', eval: '+0.6', delta: '-0.2', idea: 'Philidor Defense', motif: 'Passive Def', comment: 'The Philidor Defense. It defends the e5 pawn but restricts the dark-squared bishop.' },
      { move: 'd4', eval: '+0.7', delta: '+0.1', idea: 'Center Breakthrough', motif: 'Space', comment: 'Morphy immediately strikes in the center, challenging Black\'s pawn on e5.' },
      { move: 'Bg4', eval: '+1.1', delta: '-0.4', idea: 'Counter Threat', motif: 'Pin', comment: 'Black pins the f3 knight. However, this is considered slightly passive compared to dxe5.' },
      { move: 'dxe5', eval: '+1.2', delta: '+0.1', idea: 'Exploit Pin', motif: 'Tactics', comment: 'Morphy exchanges pawns. Black cannot recapture immediately without losing the queen.' },
      { move: 'Bxf3', eval: '+1.3', delta: '-0.1', idea: 'Eliminate Defender', motif: 'Trade', comment: 'Forced to trade the bishop to avoid losing material, giving up the bishop pair.' },
      { move: 'Qxf3', eval: '+1.3', delta: '0.0', idea: 'Active Queen', motif: 'Development', comment: 'Morphy recaptures with the queen, keeping active pressure and development leads.' },
      { move: 'dxe5', eval: '+1.4', delta: '-0.1', idea: 'Recapture Pawn', motif: 'Material Equal', comment: 'Black recaptures the pawn on e5, keeping material balance but lagging in development.' },
      { move: 'Bc4', eval: '+1.8', delta: '+0.4', idea: 'Mating Threat', motif: 'Weak f7', comment: 'Morphy develops the bishop with a direct threat of checkmate on f7.' },
      { move: 'Nf6', eval: '+1.8', delta: '0.0', idea: 'Block Mate', motif: 'Defense', comment: 'Black blocks the mating line with the knight, developing a piece.' },
      { move: 'Qb3', eval: '+2.3', delta: '+0.5', idea: 'Double Attack', motif: 'Weak b7 & f7', comment: 'Morphy creates a double attack on b7 and f7. A classic tactical concept.' },
      { move: 'Qe7', eval: '+2.3', delta: '0.0', idea: 'Defend f7', motif: 'Defensive Move', comment: 'Black defends the f7 pawn, but now the b7 pawn is undefended.' },
      { move: 'Nc3', eval: '+2.7', delta: '+0.4', idea: 'Rapid Development', motif: 'Prophylaxis', comment: 'Instead of greedily taking on b7, Morphy prioritizes development. Dynamic play!' },
      { move: 'c6', eval: '+2.8', delta: '-0.1', idea: 'Defend b7', motif: 'Pawn Wall', comment: 'Black guards the b5 and d5 squares, hoping to stabilize the position.' },
      { move: 'Bg5', eval: '+3.2', delta: '+0.4', idea: 'Absolute Pin', motif: 'Pin', comment: 'Morphy pins the f6 knight to the queen, locking down Black\'s defenses.' },
      { move: 'b5', eval: '+4.1', delta: '-0.9', idea: 'Chase Bishop', motif: 'Weakening', comment: 'Black tries to drive away the c4 bishop, but this creates massive weaknesses in their structure.' },
      { move: 'Nxb5', eval: '+4.5', delta: '+0.4', idea: 'Knight Sacrifice', motif: 'Breakthrough', comment: 'Morphy sacrifices the knight for two pawns to blast open the lines to the black king!' },
      { move: 'cxb5', eval: '+4.5', delta: '0.0', idea: 'Accept Sacrifice', motif: 'Material Gain', comment: 'Black accepts the sacrifice, but their king remains stranded in the center.' },
      { move: 'Bxb5+', eval: '+4.8', delta: '+0.3', idea: 'Check & Attack', motif: 'Tempo', comment: 'Morphy recaptures with check, developing with force.' },
      { move: 'Nbd7', eval: '+4.8', delta: '0.0', idea: 'Block Check', motif: 'Defense', comment: 'Black blocks with the knight, but this piece is now pinned absolutely.' },
      { move: 'O-O-O', eval: '+5.5', delta: '+0.7', idea: 'Castle & Attack', motif: 'King Safety', comment: 'Morphy castles queenside, bringing the rook directly into the attack on the pinned d7 knight!' },
      { move: 'Rd8', eval: '+5.5', delta: '0.0', idea: 'Defend Pinned Piece', motif: 'Defense', comment: 'Black defends the d7 knight with the rook. All black pieces are tied down.' },
      { move: 'Rxd7', eval: '+6.8', delta: '+1.3', idea: 'Rook Sacrifice', motif: 'Deflection', comment: 'Morphy sacrifices the rook to remove the defender of the d7 square!' },
      { move: 'Rxd7', eval: '+6.8', delta: '0.0', idea: 'Recapture Rook', motif: 'Defense', comment: 'Black recaptures with the rook, which is now also pinned.' },
      { move: 'Rd1', eval: '+7.5', delta: '+0.7', idea: 'Bring Last Reserve', motif: 'Attack', comment: 'Morphy brings his final piece, the h1 rook, to d1. Unbelievable coordination!' },
      { move: 'Qe6', eval: '+8.2', delta: '-0.7', idea: 'Offer Queen Trade', motif: 'Desperation', comment: 'Black offers a queen trade, hoping to relieve the pressure, but it is too late.' },
      { move: 'Bxd7+', eval: '+12.0', delta: '+3.8', idea: 'Check & Win', motif: 'Elimination', comment: 'Morphy exchanges on d7, bringing the mate sequence to its climax.' },
      { move: 'Nxd7', eval: '+12.0', delta: '0.0', idea: 'Recapture Knight', motif: 'Defense', comment: 'Black recaptures with the knight, leaving the back rank vulnerable.' },
      { move: 'Qb8+', eval: '+Mate', delta: '0.0', idea: 'Queen Sacrifice', motif: 'Decoy/Attraction', comment: 'Morphy sacrifices the queen! This attracts the d7 knight to b8, leaving d8 open.' },
      { move: 'Nxb8', eval: '+Mate', delta: '0.0', idea: 'Accept Queen Sacrifice', motif: 'Forced', comment: 'Forced recapture. The b8 square is now blocked by Black\'s own knight.' },
      { move: 'Rd8#', eval: '+Mate', delta: '0.0', idea: 'Mating Blow', motif: 'Back Rank Mate', comment: 'Checkmate! The lone rook delivers the final blow, supported by the bishop. Masterpiece.' }
    ]
  },
  {
    id: 'fischer_byrne',
    white: 'Donald Byrne',
    black: 'Bobby Fischer',
    event: 'Rosenwald Memorial',
    date: '1956',
    result: '0-1',
    description: 'The "Game of the Century". A 13-year-old Bobby Fischer sacrifices his queen for a winning attack, showing depth of calculation far beyond his years.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      { move: 'Nf3', eval: '+0.2', delta: '0.0', idea: 'Reti Opening', motif: 'Flexibility', comment: 'Byrne opens with the flexible knight development, avoiding early commitments.' },
      { move: 'Nf6', eval: '+0.2', delta: '0.0', idea: 'Symmetrical Development', motif: 'Flexibility', comment: 'Fischer responds symmetrically, keeping options open.' }
    ]
  }
];

export function getMasterGame(id) {
  return MASTER_GAMES.find(g => g.id === id);
}
