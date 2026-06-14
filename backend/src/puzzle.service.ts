import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PuzzleService {
  constructor(private prisma: PrismaService) {}

  // Log solving attempt
  async logAttempt(userId: string, puzzleId: string, solved: boolean) {
    return this.prisma.puzzleLog.create({
      data: {
        userId,
        puzzleId,
        solved
      }
    });
  }

  // Spaced Repetition SM-2 scheduling algorithm
  async scheduleSrsReview(userId: string, cardId: string, quality: number) {
    // Quality ranges from 0 (forgot) to 5 (perfect recall)
    const existing = await this.prisma.srsCard.findUnique({
      where: { userId_cardId: { userId, cardId } }
    });

    let repetitions = 0;
    let interval = 1;
    let easeFactor = 2.5;

    if (existing) {
      repetitions = existing.repetitions;
      interval = existing.interval;
      easeFactor = existing.easeFactor;
    }

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Ease factor adjustment formula
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return this.prisma.srsCard.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: {
        repetitions,
        interval,
        easeFactor,
        nextReviewDate
      },
      create: {
        userId,
        cardId,
        repetitions,
        interval,
        easeFactor,
        nextReviewDate
      }
    });
  }

  // Get cards due for review
  async getDueCards(userId: string) {
    return this.prisma.srsCard.findMany({
      where: {
        userId,
        nextReviewDate: {
          lte: new Date()
        }
      }
    });
  }
}
export default PuzzleService;
