import { describe, it, expect } from 'bun:test';
import { Entity, ModifierEntity } from '../../src/litm/entity';

class TestEntity extends Entity {
  entityType = 'tag' as const;
  
  static override blank() {
    return new TestEntity();
  }
  
  override serialize() {
    return { id: this.id, name: this.name, entityType: this.entityType, owner: this.owner };
  }
  
  static override deserialize(raw: any) {
    const entity = new TestEntity();
    entity.id = raw.id;
    entity.name = raw.name;
    entity.owner = raw.owner;
    return entity;
  }
}

class TestModifierEntity extends ModifierEntity {
  entityType = 'tag' as const;
  
  get value() {
    return 2;
  }
  
  static override blank() {
    return new TestModifierEntity();
  }
  
  override serialize() {
    return { id: this.id, name: this.name, entityType: this.entityType, owner: this.owner, isScratched: this.isScratched };
  }
}

describe('Entity', () => {
  it('should create entity with default values', () => {
    const entity = new TestEntity();
    expect(entity.name).toBe('');
    expect(entity.owner).toBe('');
    expect(entity.id).toBeDefined();
    expect(entity.canScratch).toBe(false);
    expect(entity.canModify).toBe(false);
    expect(entity.canBurn).toBe(false);
  });

  it('should serialize and deserialize correctly', () => {
    const entity = new TestEntity();
    entity.name = 'Test Entity';
    entity.owner = 'testuser';
    
    const serialized = entity.serialize();
    const deserialized = TestEntity.deserialize(serialized);
    
    expect(deserialized.name).toBe('Test Entity');
    expect(deserialized.owner).toBe('testuser');
    expect(deserialized.id).toBe(entity.id);
  });
});

describe('ModifierEntity', () => {
  it('should extend Entity with modifier properties', () => {
    const entity = new TestModifierEntity();
    expect(entity.value).toBe(2);
    expect(entity.isScratched).toBe(false);
    expect(entity.canModify).toBe(true);
  });

  it('should handle scratched state', () => {
    const entity = new TestModifierEntity();
    entity.isScratched = true;
    expect(entity.isScratched).toBe(true);
  });
});