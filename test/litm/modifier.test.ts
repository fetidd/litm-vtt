import { describe, it, expect } from 'bun:test';
import type Modifier from '../../src/litm/modifier';
import { Tag } from '../../src/litm/tag';
import { Status } from '../../src/litm/status';

describe('Modifier', () => {
  it('should work with tag entities', () => {
    const tag = Tag.blank();
    tag.name = 'Test Tag';
    
    const modifier: Modifier = {
      entity: tag,
      isBurned: false,
      polarity: 'add'
    };
    
    expect(modifier.entity).toBe(tag);
    expect(modifier.isBurned).toBe(false);
    expect(modifier.polarity).toBe('add');
  });

  it('should work with status entities', () => {
    const status = Status.blank();
    status.name = 'Test Status';
    status.addTier(3);
    
    const modifier: Modifier = {
      entity: status,
      isBurned: true,
      polarity: 'subtract'
    };
    
    expect(modifier.entity).toBe(status);
    expect(modifier.isBurned).toBe(true);
    expect(modifier.polarity).toBe('subtract');
  });

  it('should handle burned modifiers', () => {
    const tag = Tag.blank();
    tag.name = 'Burned Tag';
    
    const burnedModifier: Modifier = {
      entity: tag,
      isBurned: true,
      polarity: 'add'
    };
    
    expect(burnedModifier.isBurned).toBe(true);
    expect(burnedModifier.entity.canBurn).toBe(true);
  });

  it('should handle different polarities', () => {
    const tag = Tag.blank();
    
    const addModifier: Modifier = {
      entity: tag,
      isBurned: false,
      polarity: 'add'
    };
    
    const subtractModifier: Modifier = {
      entity: tag,
      isBurned: false,
      polarity: 'subtract'
    };
    
    expect(addModifier.polarity).toBe('add');
    expect(subtractModifier.polarity).toBe('subtract');
  });
});