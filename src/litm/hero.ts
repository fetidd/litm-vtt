import { Entity, type EntityType } from './entity';
import User from '../user';
import { HeroTheme } from './theme';
import { Tag } from './tag';
import Fellowship from './fellowship';

export default class Hero extends Entity {
  override entityType: EntityType = 'hero';
  description: string = "";
  themes: HeroTheme[] = [];
  backpack: Tag[] = [];
  fellowship: Fellowship | undefined = undefined;
  relationships: Map<Hero, Tag> = new Map();
  promise: number = 0;
  
  constructor(
    public name: string,
    public owner: User,
  ) {
    super()
  }
}
