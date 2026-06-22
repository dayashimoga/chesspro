// ChessOS — Test Setup for Vitest + React Testing Library
import '@testing-library/jest-dom/vitest';

// Mock localStorage for all tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Worker for Stockfish
class MockWorker {
  onmessage: ((e: any) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  constructor() {
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: 'worker_ready' });
      }
    }, 0);
  }
  postMessage(data: any) {
    if (typeof data === 'string' && data.startsWith('go')) {
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({ data: 'info depth 3 multipv 1 score cp 20 pv e2e4' });
          this.onmessage({ data: 'bestmove e2e4' });
        }
      }, 5);
    }
  }
  terminate() {}
}

Object.defineProperty(window, 'Worker', { value: MockWorker, configurable: true, writable: true });

// Mock URL.createObjectURL
URL.createObjectURL = () => 'blob:mock-url';
URL.revokeObjectURL = () => {};
