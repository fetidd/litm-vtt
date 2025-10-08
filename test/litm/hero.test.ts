import { describe, it, expect } from 'bun:test';
import { Hero } from '../../src/litm/hero';
import { HeroTheme } from '../../src/litm/theme';
import { Tag } from '../../src/litm/tag';
import { Fellowship } from '../../src/litm/fellowship';

describe('Hero', () => {
  it('should create blank hero with default properties', () => {
    const hero = Hero.blank();
    expect(hero.name).toBe('');
    expect(hero.owner).toBe('');
    expect(hero.entityType).toBe('hero');
    expect(hero.description).toBe('');
    expect(hero.themes).toEqual([]);
    expect(hero.backpack).toEqual([]);
    expect(hero.fellowship).toBeUndefined();
    expect(hero.relationships).toBeInstanceOf(Map);
    expect(hero.promise).toBe(0);
    expect(hero.maxPromise).toBe(5);
  });

  it('should handle promise correctly', () => {
    const hero = Hero.blank();
    hero.promise = 3;
    expect(hero.promise).toBe(3);
    
    expect(() => { hero.promise = -1; }).toThrow('Promise must be 0-5');
    expect(() => { hero.promise = 6; }).toThrow('Promise must be 0-5');
  });

  it('should serialize correctly', () => {
    const hero = Hero.blank();
    hero.name = 'Test Hero';
    hero.owner = 'testuser';
    hero.description = 'A test hero';
    hero.promise = 2;
    
    const tag = Tag.blank();
    tag.name = 'Test Tag';
    hero.backpack.push(tag);
    
    hero.relationships.set('Friend', tag);
    
    const serialized = hero.serialize();
    expect(serialized.name).toBe('Test Hero');
    expect(serialized.owner).toBe('testuser');
    expect(serialized.description).toBe('A test hero');
    expect(serialized.promise).toBe(2);
    expect(serialized.backpack).toHaveLength(1);
    expect(serialized.relationships).toHaveLength(1);
  });

  it('should deserialize correctly', () => {
    const raw = {
      id: 'test-id',
      name: 'Test Hero',
      owner: 'testuser',
      promise: 3,
      description: 'Test description',
      themes: [],
      backpack: [],
      relationships: [],
      fellowship: undefined
    };
    
    const hero = Hero.deserialize(raw);
    expect(hero.id).toBe('test-id');
    expect(hero.name).toBe('Test Hero');
    expect(hero.owner).toBe('testuser');
    expect(hero.promise).toBe(3);
    expect(hero.description).toBe('Test description');
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => Hero.deserialize({})).toThrow('Failed to deserialize Hero');
    expect(() => Hero.deserialize({ name: 'test' })).toThrow('missing id');
  });

  it('should handle relationships correctly', () => {
    const hero = Hero.blank();
    const tag = Tag.blank();
    tag.name = 'Friend';
    
    hero.relationships.set('Alice', tag);
    expect(hero.relationships.has('Alice')).toBe(true);
    expect(hero.relationships.get('Alice')).toBe(tag);
  });
});