import { type EntityType, ModifierEntity } from "./entity";
import type { Tag } from "./tag";
import type { Might } from "./might";

export abstract class Theme extends ModifierEntity {
    public override get value(): number {
      return 1
    }

    public override get canBurn(): boolean {
      return true
    }

    public override get canScratch(): boolean {
      return true
    }

    override isScratched: boolean = false;

    tags: Tag[] = [];
    weaknessTags: Tag[] = [];
    description: string = "";

    constructor(public name: string) {
        super()
    }
}

export class StoryTheme extends Theme {
    public override get entityType(): EntityType {
      return "story-theme"
    }

    static override deserialize(raw: any): StoryTheme {
      try {
        if (raw.name == undefined) throw Error("missing name");
        if (raw.id == undefined) throw Error("missing id");
        const ent = new StoryTheme(raw.name);
        ent.id = raw.id;
        ent.tags = raw.tags || [];
        ent.weaknessTags = raw.weaknessTags || [];
        ent.description = raw.description || "";
        return ent;
      } catch (e) {
        throw Error(`Failed to deserialize StoryTheme from ${JSON.stringify(raw)}: ${e}`)
      }
    }
}

export type ThemeType = (
    // origin
    'circumstance' | 'devotion' | 'people' | 'past' | 'personality' | 'trait' | 'skill/trade' |
    // adventure
    'duty' | 'influence' | 'knowledge' | 'prodigious ability' | 'relic' | 'uncanny being' |
    // greatness
    'destiny' | 'dominion' | 'mastery' | 'monstrosity' |
    // varying
    'companion' | 'magic' | 'possession'
);

export class HeroTheme extends Theme {
    public override get entityType(): EntityType {
      return "hero-theme"
    }

    _improve: number = 0;
    public get improve() {
      return this._improve
    }
    public set improve(n: number) {
      if (n < 0 || n > 5) throw Error("Improve must be 0-5")
        this._improve = n;
    }

    _milestone: number = 0;
    public get milestone() {
      return this._milestone
    }
    public set milestone(n: number) {
      if (n < 0 || n > 5) throw Error("Milestone must be 0-5")
        this._milestone = n;
    }

    _abandon: number = 0;
    public get abandon() {
      return this._abandon
    }
    public set abandon(n: number) {
      if (n < 0 || n > 5) throw Error("Abandon must be 0-5")
        this._abandon = n;
    }

    quest: string = "";
    specialImprovements: string[] = [];

    constructor(public override name: string, public type: ThemeType, public might: Might) {
        super(name)
    }

    static override deserialize(raw: any): HeroTheme {
      try {
        if (raw.name == undefined) throw Error("missing name");
        if (raw.id == undefined) throw Error("missing id");
        if (raw.might == undefined) throw Error("missing might");
        if (raw.type == undefined) throw Error("missing type");
        const ent = new HeroTheme(raw.name, raw.type, raw.might);
        ent.id = raw.id;
        ent.tags = raw.tags || [];
        ent.weaknessTags = raw.weaknessTags || [];
        ent.description = raw.description || "";
        ent.improve = raw.improve || 0;
        ent.milestone = raw.milestone || 0;
        ent.abandon = raw.abandon || 0;
        ent.quest = raw.quest || "";
        ent.specialImprovements = raw.specialImprovements || [];
        return ent;
      } catch (e){
        throw Error(`Failed to deserialize HeroTheme from ${raw.toString()}: ${e}`)
      }
    }
}
