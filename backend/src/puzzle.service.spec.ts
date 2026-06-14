import { PuzzleService } from './puzzle.service';
import { PrismaService } from './prisma.service';

describe('PuzzleService SM-2 Spaced Repetition', () => {
  let service: PuzzleService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      puzzleLog: {
        create: jest.fn(),
      },
      srsCard: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };
    service = new PuzzleService(prismaMock as unknown as PrismaService);
  });

  it('should schedule next review correctly on perfect recall (quality = 5)', async () => {
    prismaMock.srsCard.findUnique.mockResolvedValue(null); // No existing card
    prismaMock.srsCard.upsert.mockImplementation((args: any) => args.create);

    const result = await service.scheduleSrsReview('usr_01', 'crd_01', 5);

    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeGreaterThan(2.5); // EF increases on good quality
  });

  it('should reset repetitions and set interval to 1 on failure (quality = 1)', async () => {
    prismaMock.srsCard.findUnique.mockResolvedValue({
      userId: 'usr_01',
      cardId: 'crd_01',
      repetitions: 4,
      interval: 12,
      easeFactor: 2.3,
      nextReviewDate: new Date(),
    });
    prismaMock.srsCard.upsert.mockImplementation((args: any) => args.update);

    const result = await service.scheduleSrsReview('usr_01', 'crd_01', 1);

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.3); // EF decreases on poor quality
  });
});
