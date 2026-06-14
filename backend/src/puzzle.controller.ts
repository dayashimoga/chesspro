import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PuzzleService } from './puzzle.service';

@Controller('puzzles')
export class PuzzleController {
  constructor(private puzzleService: PuzzleService) {}

  @Post('attempt')
  async logAttempt(@Body() body: { userId: string; puzzleId: string; solved: boolean }) {
    return this.puzzleService.logAttempt(body.userId, body.puzzleId, body.solved);
  }

  @Post('srs/schedule')
  async scheduleSrsReview(@Body() body: { userId: string; cardId: string; quality: number }) {
    return this.puzzleService.scheduleSrsReview(body.userId, body.cardId, body.quality);
  }

  @Get('srs/due')
  async getDueCards(@Query('userId') userId: string) {
    return this.puzzleService.getDueCards(userId);
  }
}
export default PuzzleController;
