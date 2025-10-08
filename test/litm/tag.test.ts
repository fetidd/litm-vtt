import { describe, it, expect } from 'bun:test';
import { Tag } from '../../src/litm/tag';

describe('Tag', () => {
  it('should create blank tag with default properties', () => {
    const tag = Tag.blank();
    expect(tag.name).toBe('');
    expect(tag.owner).toBe('');
    expect(tag.value).toBe(1);
    expect(tag.canBurn).toBe(true);
    expect(tag.canScratch).toBe(true);
    expect(tag.entityType).toBe('tag');
    expect(tag.isScratched).toBe(false);
  });

  it('should serialize correctly', () => {
    const tag = Tag.blank();
    tag.name = 'Test Tag';
    tag.owner = 'testuser';
    tag.isScratched = true;
    
    const serialized = tag.serialize();
    expect(serialized).toEqual({
      id: tag.id,
      name: 'Test Tag',
      entityType: 'tag',
      isScratched: true,
      owner: 'testuser'
    });
  });

  it('should deserialize correctly', () => {
    const raw = {
      id: 'test-id',
      name: 'Test Tag',
      isScratched: false,
      owner: 'testuser'
    };
    
    const tag = Tag.deserialize(raw);
    expect(tag.id).toBe('test-id');
    expect(tag.name).toBe('Test Tag');
    expect(tag.isScratched).toBe(false);
    expect(tag.owner).toBe('testuser');
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => Tag.deserialize({})).toThrow('Failed to deserialize Tag');
    expect(() => Tag.deserialize({ name: 'test' })).toThrow('missing id');
    expect(() => Tag.deserialize({ name: 'test', id: 'test' })).toThrow('missing isScratched');
  });

  it('should handle scratched state correctly', () => {
    const tag = Tag.blank();
    expect(tag.isScratched).toBe(false);
    
    tag.isScratched = true;
    expect(tag.isScratched).toBe(true);
  });
});