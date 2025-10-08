import { describe, it, expect } from 'bun:test';
import { Fellowship } from '../../src/litm/fellowship';
import { Tag } from '../../src/litm/tag';

describe('Fellowship', () => {
  it('should create blank fellowship with default properties', () => {
    const fellowship = Fellowship.blank();
    expect(fellowship.name).toBe('');
    expect(fellowship.owner).toBe('');
    expect(fellowship.entityType).toBe('fellowship-theme');
    expect(fellowship.value).toBe(1);
    expect(fellowship.canBurn).toBe(true);
    expect(fellowship.canScratch).toBe(true);
    expect(fellowship.isScratched).toBe(false);
    expect(fellowship.otherTags).toEqual([]);
    expect(fellowship.weaknessTags).toEqual([]);
    expect(fellowship.description).toBe('');
    expect(fellowship.improve).toBe(0);
    expect(fellowship.milestone).toBe(0);
    expect(fellowship.abandon).toBe(0);
    expect(fellowship.maxAdvancement).toBe(3);
    expect(fellowship.quest).toBe('');
    expect(fellowship.specialImprovements).toEqual([]);
  });

  it('should handle advancement properties correctly', () => {
    const fellowship = Fellowship.blank();
    
    fellowship.improve = 2;
    expect(fellowship.improve).toBe(2);
    
    fellowship.milestone = 1;
    expect(fellowship.milestone).toBe(1);
    
    fellowship.abandon = 3;
    expect(fellowship.abandon).toBe(3);
    
    expect(() => { fellowship.improve = -1; }).toThrow('Improve must be 0-3');
    expect(() => { fellowship.improve = 4; }).toThrow('Improve must be 0-3');
    expect(() => { fellowship.milestone = -1; }).toThrow('Milestone must be 0-3');
    expect(() => { fellowship.abandon = 4; }).toThrow('Abandon must be 0-3');
  });

  it('should serialize correctly', () => {
    const fellowship = Fellowship.blank();
    fellowship.name = 'Test Fellowship';
    fellowship.owner = 'testuser';
    fellowship.improve = 1;
    fellowship.milestone = 2;
    fellowship.abandon = 0;
    fellowship.quest = 'Test quest';
    fellowship.description = 'Test description';
    fellowship.specialImprovements = ['improvement1'];
    
    const tag = Tag.blank();
    tag.name = 'Test Tag';
    fellowship.otherTags.push(tag);
    
    const serialized = fellowship.serialize();
    expect(serialized).toMatchObject({
      name: 'Test Fellowship',
      owner: 'testuser',
      entityType: 'fellowship-theme',
      improve: 1,
      milestone: 2,
      abandon: 0,
      quest: 'Test quest',
      description: 'Test description',
      specialImprovements: ['improvement1']
    });
    expect((serialized as any).otherTags).toHaveLength(1);
  });

  it('should deserialize correctly', () => {
    const raw = {
      id: 'test-id',
      name: 'Test Fellowship',
      owner: 'testuser',
      otherTags: [],
      weaknessTags: [],
      description: 'Test description',
      improve: 2,
      milestone: 1,
      abandon: 0,
      quest: 'Test quest',
      specialImprovements: ['improvement1'],
      isScratched: false
    };
    
    const fellowship = Fellowship.deserialize(raw);
    expect(fellowship.id).toBe('test-id');
    expect(fellowship.name).toBe('Test Fellowship');
    expect(fellowship.owner).toBe('testuser');
    expect(fellowship.improve).toBe(2);
    expect(fellowship.milestone).toBe(1);
    expect(fellowship.abandon).toBe(0);
    expect(fellowship.quest).toBe('Test quest');
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => Fellowship.deserialize({})).toThrow('Failed to deserialize Fellowship');
    expect(() => Fellowship.deserialize({ name: 'test' })).toThrow('missing id');
  });
});