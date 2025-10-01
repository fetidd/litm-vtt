import { type EntityType, ModifierEntity } from "./entity";
import { Tag } from "./tag";
import type { Might } from "./might";

export abstract class Theme extends ModifierEntity {
  public override get value(): number {
    return 1;
  }

  public override get canBurn(): boolean {
    return true;
  }

  public override get canScratch(): boolean {
    return true;
  }

  override isScratched: boolean = false;
  otherTags: Tag[] = [];
  weaknessTags: Tag[] = [];
  description: string = "";
}

export class StoryTheme extends Theme {
  public override get entityType(): EntityType {
    return "story-theme";
  }

  static override deserialize(raw: any): StoryTheme {
    try {
      if (raw.id == undefined) throw Error("missing id");
      if (raw.name == undefined) throw Error("missing name");
      if (raw.otherTags == undefined) throw Error("missing otherTags");
      if (raw.weaknessTags == undefined) throw Error("missing weaknessTags");
      if (raw.description == undefined) throw Error("missing description");
      if (raw.owner == undefined) throw Error("missing owner");
      if (raw.isScratched == undefined) throw Error("missing isScratched");
      const ent = StoryTheme.blank();
      ent.id = raw.id;
      ent.name = raw.name;
      ent.otherTags = raw.otherTags;
      ent.weaknessTags = raw.weaknessTags;
      ent.description = raw.description;
      ent.owner = raw.owner;
      ent.isScratched = raw.isScratched;
      return ent;
    } catch (e) {
      throw Error(
        `Failed to deserialize StoryTheme from ${JSON.stringify(raw)}: ${e}`,
      );
    }
  }

  static override blank() {
    return new StoryTheme();
  }
}

export type ThemeType =
  // origin
  | "circumstance"
  | "devotion"
  | "people"
  | "past"
  | "personality"
  | "trait"
  | "skill/trade"
  // adventure
  | "duty"
  | "influence"
  | "knowledge"
  | "prodigious ability"
  | "relic"
  | "uncanny being"
  // greatness
  | "destiny"
  | "dominion"
  | "mastery"
  | "monstrosity"
  // varying
  | "companion"
  | "magic"
  | "possession";

export class HeroTheme extends Theme {
  public override get entityType(): EntityType {
    return "hero-theme";
  }

  public get maxAdvancement(): number {
    return 3;
  }

  _improve: number = 0;
  public get improve() {
    return this._improve;
  }
  public set improve(n: number) {
    if (n < 0 || n > this.maxAdvancement)
      throw Error(`Improve must be 0-${this.maxAdvancement}`);
    this._improve = n;
  }

  _milestone: number = 0;
  public get milestone() {
    return this._milestone;
  }
  public set milestone(n: number) {
    if (n < 0 || n > this.maxAdvancement)
      throw Error(`Milestone must be 0-${this.maxAdvancement}`);
    this._milestone = n;
  }

  _abandon: number = 0;
  public get abandon() {
    return this._abandon;
  }
  public set abandon(n: number) {
    if (n < 0 || n > this.maxAdvancement)
      throw Error(`Abandon must be 0-${this.maxAdvancement}`);
    this._abandon = n;
  }

  might: Might = "origin";
  type: ThemeType | undefined = undefined;
  quest: string = "";
  specialImprovements: string[] = [];

  private constructor() {
    super();
  }

  static override blank() {
    return new HeroTheme();
  }

  static override deserialize(raw: any): HeroTheme {
    try {
      if (raw.id == undefined) throw Error("missing id");
      if (raw.name == undefined) throw Error("missing name");
      if (raw.might == undefined) throw Error("missing might");
      if (raw.type == undefined) throw Error("missing type");
      if (raw.otherTags == undefined) throw Error("missing otherTags");
      if (raw.weaknessTags == undefined) throw Error("missing weaknessTags");
      if (raw.description == undefined) throw Error("missing description");
      if (raw.improve == undefined) throw Error("missing improve");
      if (raw.milestone == undefined) throw Error("missing milestone");
      if (raw.abandon == undefined) throw Error("missing abandon");
      if (raw.quest == undefined) throw Error("missing quest");
      if (raw.specialImprovements == undefined)
        throw Error("missing specialImprovements");
      if (raw.owner == undefined) throw Error("missing owner");
      if (raw.isScratched == undefined) throw Error("missing isScratched");
      const ent = HeroTheme.blank();
      ent.id = raw.id;
      ent.name = raw.name;
      ent.might = raw.might;
      ent.type = raw.type;
      ent.otherTags = raw.otherTags.map((t: any) => Tag.deserialize(t));
      ent.weaknessTags = raw.weaknessTags.map((t: any) => Tag.deserialize(t));
      ent.description = raw.description;
      ent.improve = raw.improve;
      ent.milestone = raw.milestone;
      ent.abandon = raw.abandon;
      ent.quest = raw.quest;
      ent.specialImprovements = raw.specialImprovements;
      ent.owner = raw.owner;
      ent.isScratched = raw.isScratched;
      return ent;
    } catch (e) {
      throw Error(
        `Failed to deserialize HeroTheme from ${raw.toString()}: ${e}`,
      );
    }
  }

  override serialize(): object {
    return {
      id: this.id,
      name: this.name,
      entityType: this.entityType,
      otherTags: this.otherTags.map((t) => t.serialize()),
      weaknessTags: this.weaknessTags.map((t) => t.serialize()),
      might: this.might,
      type: this.type,
      milestone: this.milestone,
      abandon: this.abandon,
      improve: this.improve,
      quest: this.quest,
      description: this.description,
      specialImprovements: this.specialImprovements,
      owner: this.owner,
      isScratched: this.isScratched,
    };
  }
}
