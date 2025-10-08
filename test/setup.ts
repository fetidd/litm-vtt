// Mock generateId function for consistent testing
import { mock } from 'bun:test';

let idCounter = 0;
mock.module('../src/utils', () => ({
  generateId: () => `test-id-${++idCounter}`
}));