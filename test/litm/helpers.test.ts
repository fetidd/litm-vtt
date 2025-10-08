import { describe, it, expect } from 'bun:test';
import { deserializeRawEntity } from '../../src/litm/helpers';
import { Tag } from '../../src/litm/tag';
import { Status } from '../../src/litm/status';
import { Hero } from '../../src/litm/hero';
import { HeroTheme, StoryTheme } from '../../src/litm/theme';

describe('helpers', () => {
  describe('deserializeRawEntity', () => {
    it('should deserialize tag entity', () => {
      const raw = {
        entityType: 'tag',
        id: 'test-id',
        name: 'Test Tag',
        isScratched: false,
        owner: 'testuser'
      };
      
      const entity = deserializeRawEntity(raw);
      expect(entity).toBeInstanceOf(Tag);
      expect(entity.name).toBe('Test Tag');
    });

    it('should deserialize status entity', () => {
      const raw = {
        entityType: 'status',
        id: 'test-id',
        name: 'Test Status',
        tiers: [1, 3],
        owner: 'testuser'
      };
      
      const entity = deserializeRawEntity(raw);
      expect(entity).toBeInstanceOf(Status);
      expect(entity.name).toBe('Test Status');
    });

    it('should deserialize hero entity', () => {
      const raw = {
        entityType: 'hero',
        id: 'test-id',
        name: 'Test Hero',
        owner: 'testuser',
        promise: 2,
        description: 'Test description',
        themes: [],
        backpack: [],
        relationships: []
      };
      
      const entity = deserializeRawEntity(raw);
      expect(entity).toBeInstanceOf(Hero);
      expect(entity.name).toBe('Test Hero');
    });

    it('should deserialize hero-theme entity', () => {
      const raw = {
        entityType: 'hero-theme',
        id: 'test-id',
        name: 'Test Theme',
        owner: 'testuser',
        might: 'origin',
        type: 'trait',
        otherTags: [],
        weaknessTags: [],
        description: 'Test description',
        improve: 0,
        milestone: 0,
        abandon: 0,
        quest: '',
        specialImprovements: [],
        isScratched: false
      };
      
      const entity = deserializeRawEntity(raw);
      expect(entity).toBeInstanceOf(HeroTheme);
      expect(entity.name).toBe('Test Theme');
    });

    it('should deserialize story-theme entity', () => {
      const raw = {
        entityType: 'story-theme',
        id: 'test-id',
        name: 'Test Story Theme',
        owner: 'testuser',
        otherTags: [],
        weaknessTags: [],
        description: 'Test description',
        isScratched: false
      };
      
      const entity = deserializeRawEntity(raw);
      expect(entity).toBeInstanceOf(StoryTheme);
      expect(entity.name).toBe('Test Story Theme');
    });

    it('should throw error for unknown entity type', () => {
      const raw = {
        entityType: 'unknown-type',
        id: 'test-id',
        name: 'Test Entity'
      };
      
      expect(() => deserializeRawEntity(raw)).toThrow('Cannot deserialize unknown-type');
    });
  });
});