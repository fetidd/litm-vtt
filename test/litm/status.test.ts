import { describe, it, expect } from 'bun:test';
import { Status } from '../../src/litm/status';

describe('Status', () => {
  it('should create blank status with default properties', () => {
    const status = Status.blank();
    expect(status.name).toBe('');
    expect(status.owner).toBe('');
    expect(status.canBurn).toBe(false);
    expect(status.canScratch).toBe(false);
    expect(status.entityType).toBe('status');
    expect(status.tiers).toEqual([]);
  });

  it('should handle tiers correctly', () => {
    const status = Status.blank();
    status.addTier(3);
    expect(status.tiers).toContain(3);
    expect(status.hasTier(3)).toBe(true);
    expect(status.hasTier(2)).toBe(false);
    expect(status.value).toBe(3);
  });

  it('should add multiple tiers and calculate max value', () => {
    const status = Status.blank();
    status.addTier(2);
    status.addTier(4);
    status.addTier(1);
    expect(status.value).toBe(4);
    expect(status.tiers).toEqual([2, 4, 1]);
  });

  it('should handle duplicate tiers by incrementing', () => {
    const status = Status.blank();
    status.addTier(3);
    status.addTier(3); // Should become 4
    expect(status.tiers).toContain(3);
    expect(status.tiers).toContain(4);
  });

  it('should not add tiers above 6', () => {
    const status = Status.blank();
    status.tiers = [6];
    status.addTier(6); // Should not add anything
    expect(status.tiers).toEqual([6]);
  });

  it('should decrease tiers correctly', () => {
    const status = Status.blank();
    status.tiers = [3, 5, 2];
    status.decreaseTier(1);
    expect(status.tiers).toEqual([2, 4, 1]);
    
    status.decreaseTier(2);
    expect(status.tiers).toEqual([2]); // Only 2 remains, others filtered out
  });

  it('should serialize correctly', () => {
    const status = Status.blank();
    status.name = 'Test Status';
    status.owner = 'testuser';
    status.tiers = [2, 4];
    
    const serialized = status.serialize();
    expect(serialized).toEqual({
      id: status.id,
      name: 'Test Status',
      entityType: 'status',
      tiers: [2, 4],
      owner: 'testuser'
    });
  });

  it('should deserialize correctly', () => {
    const raw = {
      id: 'test-id',
      name: 'Test Status',
      tiers: [1, 3, 5],
      owner: 'testuser'
    };
    
    const status = Status.deserialize(raw);
    expect(status.id).toBe('test-id');
    expect(status.name).toBe('Test Status');
    expect(status.tiers).toEqual([1, 3, 5]);
    expect(status.owner).toBe('testuser');
    expect(status.value).toBe(5);
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => Status.deserialize({})).toThrow('Failed to deserialize Status');
    expect(() => Status.deserialize({ name: 'test' })).toThrow('missing id');
    expect(() => Status.deserialize({ name: 'test', id: 'test' })).toThrow('missing tiers');
  });

  it('should throw error when setting empty tiers', () => {
    const status = Status.blank();
    expect(() => { status.tiers = []; }).toThrow('cannot add empty tiers');
  });
});