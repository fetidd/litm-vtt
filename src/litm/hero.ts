import { Entity, type EntityType } from './entity';
import User from '../user';
import { HeroTheme } from './theme';
import { Tag } from './tag';
import { Fellowship } from './fellowship';
import { deserializeRawEntity } from './helpers';

export class Hero extends Entity {
  override entityType: EntityType = 'hero';
  description: string = "";
  themes: HeroTheme[] = [];
  backpack: Tag[] = [];
  fellowship: Fellowship | undefined = undefined;
  relationships: Map<string, Tag> = new Map();

  public get maxPromise(): number {
    return 3
  }

  _promise: number = 0;
  public get promise() {
    return this._promise
  }
  public set promise(n: number) {
    if (n < 0 || n > this.maxPromise) throw Error(`Promise must be 0-${this.maxPromise}`)
    this._promise = n;
  }

  static blank() {
    return new Hero()
  }

  public override serialize(): {
    id: string,
    name: string,
    promise: number,
    description: string,
    entityType: string,
    themes: object[],
    backpack: object[],
    fellowship?: object,
    relationships: object[],
    owner: string
  } {
    return {
      id: this.id,
      name: this.name,
      promise: this.promise,
      description: this.description,
      entityType: this.entityType,
      themes: this.themes.map(theme => theme.serialize()),
      backpack: this.backpack.map(tag => tag.serialize()),
      fellowship: this.fellowship?.serialize(),
      relationships: Array.from(this.relationships.entries()),
      owner: this.owner
    }
  }

  static override deserialize(raw: any): Hero {
    try {
      if (raw.name == undefined) throw Error("missing name");
      if (raw.id == undefined) throw Error("missing id");
      if (raw.owner == undefined && raw.owner.username == undefined) throw Error("missing/invalid user");
      let ent = Hero.blank();
      ent.id = raw.id;
      ent.promise = raw.promise;
      ent.description = raw.description;
      ent.themes = raw.themes.map((theme: any) => deserializeRawEntity(theme))
      ent.backpack = raw.backpack.map((tag: any) => deserializeRawEntity(tag))
      if (raw.fellowship) {
        ent.fellowship = deserializeRawEntity(raw.fellowship)
      }
      raw.relationships.forEach((el: any) => {
        ent.relationships.set(el[0], deserializeRawEntity(el[1]) as Tag);
      });
      return ent;
    } catch (e) {
      throw Error(`Failed to deserialize Hero from ${JSON.stringify(raw)}: ${e}`)
    }
  }
}
