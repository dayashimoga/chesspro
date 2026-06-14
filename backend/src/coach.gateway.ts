import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CoachGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('position_change')
  handlePositionChange(
    @MessageBody() data: { fen: string; lastMove?: string },
    @ConnectedSocket() client: Socket
  ) {
    // Basic AI commentary rules based on FEN elements
    let commentary = 'Focus on coordinate development and coordinate safety.';
    let threat = 'No immediate threat detected.';

    if (data.fen.includes('q') || data.fen.includes('Q')) {
      commentary = 'The queens are active. Keep close watch on absolute pins and forks.';
    }
    
    if (data.lastMove) {
      commentary = `Last move played: ${data.lastMove}. Analyze the newly opened diagonals and files.`;
    }

    if (data.fen.split(' ')[1] === 'b') {
      threat = 'Black to move. Watch out for counter-attacking forks and back rank mates.';
    }

    client.emit('coach_feedback', {
      commentary,
      threat,
      evaluation: '+0.5' // placeholder average evaluation
    });
  }
}
export default CoachGateway;
