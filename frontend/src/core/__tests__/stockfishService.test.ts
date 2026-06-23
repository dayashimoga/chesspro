// ChessOS — Stockfish Service Unit Tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { stockfishService } from '../stockfishService';

describe('StockfishService', () => {
  let mockWorkerInstance: any;

  beforeEach(() => {
    // Reset service state
    (stockfishService as any).worker = null;
    (stockfishService as any).status = 'idle';
    (stockfishService as any).analysisResolve = null;
    (stockfishService as any).analysisReject = null;
    (stockfishService as any).currentLines = [];
    (stockfishService as any).bestMoveFound = null;
    (stockfishService as any).onInfoCallback = null;
    (stockfishService as any).initPromise = null;
    (stockfishService as any).isWarmedUp = false;

    // Create a mock worker instance that we can control
    mockWorkerInstance = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      onmessage: null,
      onerror: null,
    };

    // Override the global Worker constructor to return our mock
    vi.stubGlobal('Worker', vi.fn().mockImplementation(() => {
      // Simulate asynchronous initialization message
      setTimeout(() => {
        if (mockWorkerInstance.onmessage) {
          mockWorkerInstance.onmessage({ data: 'worker_ready' });
        }
      }, 0);
      return mockWorkerInstance;
    }));
  });

  describe('initialization', () => {
    it('should initialize and request UCI interface', async () => {
      await stockfishService.init();
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('uci');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('setoption name MultiPV value 1');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('setoption name Hash value 16');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('isready');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('position startpos');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('go movetime 1');
      expect((stockfishService as any).status).toBe('ready');
    });

    it('should resolve immediately if already initialized', async () => {
      await stockfishService.init();
      const firstWorker = (stockfishService as any).worker;
      await stockfishService.init();
      expect((stockfishService as any).worker).toBe(firstWorker);
    });
  });

  describe('analysis and line parsing', () => {
    it('should analyze FEN and resolve on bestmove', async () => {
      const analyzePromise = stockfishService.analyze('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 10);
      
      // Allow worker to initialize
      await new Promise(resolve => setTimeout(resolve, 5));

      // Simulate stockfish outputting evaluation info lines
      if (mockWorkerInstance.onmessage) {
        mockWorkerInstance.onmessage({
          data: 'info depth 5 seldepth 5 multipv 1 score cp 35 nodes 234 nps 1122 pv e2e4 e7e5'
        });
        mockWorkerInstance.onmessage({
          data: 'info depth 5 seldepth 5 multipv 2 score cp -10 nodes 234 nps 1122 pv d2d4 d7d5'
        });
        mockWorkerInstance.onmessage({
          data: 'bestmove e2e4 ponder e7e5'
        });
      }

      const result = await analyzePromise;
      expect(result.bestMove).toBe('e2e4');
      expect(result.lines).toHaveLength(2);
      expect(result.lines[0].displayScore).toBe('+0.35');
      expect(result.lines[0].pv).toEqual(['e2e4', 'e7e5']);
      expect(result.lines[1].displayScore).toBe('-0.10');
      expect(result.lines[1].pv).toEqual(['d2d4', 'd7d5']);
    });

    it('should parse mate scores correctly', async () => {
      const analyzePromise = stockfishService.analyze('k7/8/8/8/8/8/8/1Q2K3 w - - 0 1', 5);
      
      await new Promise(resolve => setTimeout(resolve, 5));

      if (mockWorkerInstance.onmessage) {
        mockWorkerInstance.onmessage({
          data: 'info depth 3 multipv 1 score mate 2 pv b1b7'
        });
        mockWorkerInstance.onmessage({
          data: 'info depth 3 multipv 2 score mate -1 pv a8b8'
        });
        mockWorkerInstance.onmessage({
          data: 'bestmove b1b7'
        });
      }

      const result = await analyzePromise;
      expect(result.bestMove).toBe('b1b7');
      expect(result.lines[0].displayScore).toBe('M2');
      expect(result.lines[0].score).toBe(99998); // 100000 - 2
      expect(result.lines[1].displayScore).toBe('M-1');
      expect(result.lines[1].score).toBe(-99999); // -100000 - (-1)
    });
  });

  describe('helper methods', () => {
    it('should send custom commands to worker', async () => {
      await stockfishService.init();
      stockfishService.send('isready');
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('isready');
    });

    it('should stop ongoing analysis', async () => {
      const analyzePromise = stockfishService.analyze('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 10);
      await new Promise(resolve => setTimeout(resolve, 5));
      
      stockfishService.stop();
      
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith('stop');
      const result = await analyzePromise;
      expect(result.bestMove).toBeNull();
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle worker error initialization', async () => {
      vi.stubGlobal('Worker', vi.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockWorkerInstance.onmessage) {
            mockWorkerInstance.onmessage({ data: 'worker_error: Failed to load' });
          }
        }, 0);
        return mockWorkerInstance;
      }));

      await expect(stockfishService.init()).rejects.toThrow('worker_error');
    });

    it('should handle runtime worker errors', async () => {
      vi.stubGlobal('Worker', vi.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockWorkerInstance.onerror) {
            mockWorkerInstance.onerror(new ErrorEvent('error', { message: 'Runtime crash' }));
          }
        }, 0);
        return mockWorkerInstance;
      }));

      await expect(stockfishService.init()).rejects.toThrow();
    });

    it('should ignore invalid info lines', async () => {
      const analyzePromise = stockfishService.analyze('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 10);
      await new Promise(resolve => setTimeout(resolve, 5));
      if (mockWorkerInstance.onmessage) {
        mockWorkerInstance.onmessage({ data: 'info invalid line missing score and pv' });
        mockWorkerInstance.onmessage({ data: 'bestmove e2e4' });
      }
      const result = await analyzePromise;
      expect(result.lines).toHaveLength(0);
    });
  });
});
