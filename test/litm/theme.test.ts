import { describe, it, expect } from 'bun:test';
import { HeroTheme, StoryTheme } from '../../src/litm/theme';
import { Tag } from '../../src/litm/tag';

describe('HeroTheme', () => {
  it('should create blank hero theme with default properties', () => {
    const theme = HeroTheme.blank();
    expect(theme.name).toBe('');
    expect(theme.owner).toBe('');
    expect(theme.entityType).toBe('hero-theme');
    expect(theme.value).toBe(1);
    expect(theme.canBurn).toBe(true);
    expect(theme.canScratch).toBe(true);
    expect(theme.isScratched).toBe(false);
    expect(theme.otherTags).toEqual([]);
    expect(theme.weaknessTags).toEqual([]);
    expect(theme.description).toBe('');
    expect(theme.improve).toBe(0);
    expect(theme.milestone).toBe(0);
    expect(theme.abandon).toBe(0);
    expect(theme.maxAdvancement).toBe(3);
    expect(theme.might).toBe('origin');
    expect(theme.quest).toBe('');
    expect(theme.specialImprovements).toEqual([]);
  });

  it('should handle advancement properties correctly', () => {
    const theme = HeroTheme.blank();
    
    theme.improve = 2;
    expect(theme.improve).toBe(2);
    
    theme.milestone = 1;
    expect(theme.milestone).toBe(1);
    
    theme.abandon = 3;
    expect(theme.abandon).toBe(3);
    
    expect(() => { theme.improve = -1; }).toThrow('Improve must be 0-3');
    expect(() => { theme.improve = 4; }).toThrow('Improve must be 0-3');
    expect(() => { theme.milestone = -1; }).toThrow('Milestone must be 0-3');
    expect(() => { theme.abandon = 4; }).toThrow('Abandon must be 0-3');
  });

  it('should serialize correctly', () => {
    const theme = HeroTheme.blank();
    theme.name = 'Test Theme';
    theme.owner = 'testuser';
    theme.might = 'adventure';
    theme.type = 'duty';
    theme.improve = 1;
    theme.milestone = 2;
    theme.abandon = 0;
    theme.quest = 'Test quest';
    theme.description = 'Test description';
    theme.specialImprovements = ['improvement1'];
    
    const tag = Tag.blank();
    tag.name = 'Test Tag';
    theme.otherTags.push(tag);
    
    const serialized = theme.serialize();
    expect(serialized).toMatchObject({
      name: 'Test Theme',
      owner: 'testuser',
      entityType: 'hero-theme',
      might: 'adventure',
      type: 'duty',
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
      name: 'Test Theme',
      owner: 'testuser',
      might: 'greatness',
      type: 'destiny',
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
    
    const theme = HeroTheme.deserialize(raw);
    expect(theme.id).toBe('test-id');
    expect(theme.name).toBe('Test Theme');
    expect(theme.might).toBe('greatness');
    expect(theme.type).toBe('destiny');
    expect(theme.improve).toBe(2);
    expect(theme.milestone).toBe(1);
    expect(theme.abandon).toBe(0);
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => HeroTheme.deserialize({})).toThrow('Failed to deserialize HeroTheme');
    expect(() => HeroTheme.deserialize({ name: 'test' })).toThrow('missing id');
  });
});

describe('StoryTheme', () => {
  it('should create blank story theme with default properties', () => {
    const theme = StoryTheme.blank();
    expect(theme.name).toBe('');
    expect(theme.owner).toBe('');
    expect(theme.entityType).toBe('story-theme');
    expect(theme.value).toBe(1);
    expect(theme.canBurn).toBe(true);
    expect(theme.canScratch).toBe(true);
    expect(theme.isScratched).toBe(false);
    expect(theme.otherTags).toEqual([]);
    expect(theme.weaknessTags).toEqual([]);
    expect(theme.description).toBe('');
  });

  it('should deserialize correctly', () => {
    const raw = {
      id: 'test-id',
      name: 'Test Story Theme',
      owner: 'testuser',
      otherTags: [],
      weaknessTags: [],
      description: 'Test description',
      isScratched: false
    };
    
    const theme = StoryTheme.deserialize(raw);
    expect(theme.id).toBe('test-id');
    expect(theme.name).toBe('Test Story Theme');
    expect(theme.owner).toBe('testuser');
    expect(theme.description).toBe('Test description');
  });

  it('should throw error when deserializing invalid data', () => {
    expect(() => StoryTheme.deserialize({})).toThrow('Failed to deserialize StoryTheme');
    expect(() => StoryTheme.deserialize({ name: 'test' })).toThrow('missing id');
  });
});