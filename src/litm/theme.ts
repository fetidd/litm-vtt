import { type EntityType, ModifierEntity } from "./entity";
import type { Tag } from "./tag";
import type { Might } from "./might";

export abstract class Theme extends ModifierEntity {
    override value = 1;
    override canBurn = true;
    override canScratch = true;
    override isScratched: boolean = false;

    tags: Tag[] = [];
    weaknessTags: Tag[] = [];
    description: string = "";

    constructor(public name: string) {
        super()
    }
}

export class StoryTheme extends Theme {
    entityType: EntityType = "story-theme"

    static override deserialize(raw: any): StoryTheme {
      try {
        let ent = new StoryTheme(raw.name);
        ent.id = raw.id;
        ent.tags = raw.tags;
        ent.weaknessTags = raw.weaknessTags;
        ent.description = raw.description;
        return ent;
      } catch {
        throw Error(`Failed to deserialize StoryTheme from ${raw.toString()}`)
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
    entityType: EntityType = "hero-theme"
    improve: number = 0;
    milestone: number = 0;
    abandon: number = 0;
    quest: string = "";
    specialImprovements: string[] = [];

    constructor(public override name: string, public type: ThemeType, public might: Might) {
        super(name)
    }

    static override deserialize(raw: any): HeroTheme {
      try {
        let ent = new HeroTheme(raw.name, raw.type, raw.might);
        ent.id = raw.id;
        ent.tags = raw.tags;
        ent.weaknessTags = raw.weaknessTags;
        ent.description = raw.description;
        ent.improve = raw.improve;
        ent.milestone = raw.milestone;
        ent.abandon = raw.abandon;
        ent.quest = raw.quest;
        ent.specialImprovements = raw.specialImprovements;
        return ent;
      } catch {
        throw Error(`Failed to deserialize HeroTheme from ${raw.toString()}`)
      }
    }
}
