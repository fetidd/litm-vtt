import { type EntityType, ModifierEntity } from "./entity";
import type { Tag } from "./tag";
import type { Might } from "./might";

export abstract class Theme extends ModifierEntity {
    entityType: EntityType = "theme"
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

export class StoryTheme extends Theme {}

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
    improve: number = 0;
    milestone: number = 0;
    abandon: number = 0;
    quest: string = "";
    specialImprovements: string[] = [];

    constructor(public override name: string, public type: ThemeType, public might: Might) {
        super(name)
    }
}
