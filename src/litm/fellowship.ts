import { type EntityType } from "./entity";
import { Tag } from "./tag";
import { Theme } from "./theme";

export class Fellowship extends Theme {
  override entityType: EntityType = "fellowship-theme";

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

  quest: string = "";
  specialImprovements: string[] = [];

  private constructor() {
    super();
  }

  static override blank() {
    return new Fellowship();
  }

  static override deserialize(raw: any): Fellowship {
      try {
        if (raw.id == undefined) throw Error("missing id");
        if (raw.name == undefined) throw Error("missing name");
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
        const ent = Fellowship.blank();
        ent.id = raw.id;
        ent.name = raw.name;
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
          `Failed to deserialize Fellowship from ${raw.toString()}: ${e}`,
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
