import { describe, it, expect } from 'bun:test';
import type { Might } from '../../src/litm/might';

describe('Might', () => {
  it('should accept valid might values', () => {
    const origin: Might = 'origin';
    const adventure: Might = 'adventure';
    const greatness: Might = 'greatness';
    
    expect(origin).toBe('origin');
    expect(adventure).toBe('adventure');
    expect(greatness).toBe('greatness');
  });

  it('should work in arrays', () => {
    const mights: Might[] = ['origin', 'adventure', 'greatness'];
    expect(mights).toHaveLength(3);
    expect(mights).toContain('origin');
    expect(mights).toContain('adventure');
    expect(mights).toContain('greatness');
  });

  it('should work in switch statements', () => {
    const getMightDescription = (might: Might): string => {
      switch (might) {
        case 'origin':
          return 'Your background and history';
        case 'adventure':
          return 'Your skills and abilities';
        case 'greatness':
          return 'Your destiny and power';
        default:
          return 'Unknown might';
      }
    };
    
    expect(getMightDescription('origin')).toBe('Your background and history');
    expect(getMightDescription('adventure')).toBe('Your skills and abilities');
    expect(getMightDescription('greatness')).toBe('Your destiny and power');
  });
});