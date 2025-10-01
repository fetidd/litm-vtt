import { Entity, type EntityType } from "./entity";
import { HeroTheme } from "./theme";
import { Tag } from "./tag";
import { Fellowship } from "./fellowship";
import { deserializeRawEntity } from "./helpers";
import type { RawHero } from "@/types";

export class Hero extends Entity {
  override entityType: EntityType = "hero";
  description: string = "";
  themes: HeroTheme[] = [];
  backpack: Tag[] = [];
  fellowship: Fellowship | undefined = undefined;
  relationships: Map<string, Tag> = new Map();

  // PROMISE
  private _promise: number = 0;
  public get promise() {
    return this._promise;
  }
  public set promise(n: number) {
    if (n < 0 || n > this.maxPromise)
      throw Error(`Promise must be 0-${this.maxPromise}`);
    this._promise = n;
  }
  public get maxPromise(): number {
    return 3;
  }

  static override blank() {
    return new Hero();
  }

  public override serialize(): RawHero {
    return {
      id: this.id,
      name: this.name,
      promise: this.promise,
      description: this.description,
      entityType: this.entityType,
      themes: this.themes.map((theme) => theme.serialize()),
      backpack: this.backpack.map((tag) => tag.serialize()),
      fellowship: this.fellowship?.serialize(),
      relationships: Array.from(this.relationships.entries()),
      owner: this.owner,
    };
  }

  static override deserialize(raw: any): Hero {
    try {
      if (raw.id == undefined) throw Error("missing id");
      if (raw.name == undefined) throw Error("missing name");
      if (raw.owner == undefined) throw Error("missing owner");
      if (raw.promise == undefined) throw Error("missing promise");
      if (raw.themes == undefined) throw Error("missing themes");
      if (raw.relationships == undefined) throw Error("missing relationships");
      if (raw.description == undefined) throw Error("missing description");
      if (raw.backpack == undefined) throw Error("missing backpack");
      // if (raw.fellowship == undefined) throw Error("missing fellowship"); // TODO maybe a special Fellowship type for "No Fellowship"?
      let ent = Hero.blank();
      ent.id = raw.id;
      ent.name = raw.name;
      ent.owner = raw.owner;
      ent.promise = raw.promise;
      ent.description = raw.description;
      ent.themes = raw.themes.map((theme: any) => HeroTheme.deserialize(theme));
      ent.backpack = raw.backpack.map((tag: any) => Tag.deserialize(tag));
      if (raw.fellowship) {
        ent.fellowship = Fellowship.deserialize(raw.fellowship);
      }
      raw.relationships.forEach((el: any) => {
        ent.relationships.set(el[0], Tag.deserialize(el[1]));
      });
      return ent;
    } catch (e) {
      throw Error(
        `Failed to deserialize Hero from ${JSON.stringify(raw)}: ${e}`,
      );
    }
  }
}
