import { ModifierEntity } from "./entity";
import type { Tag } from "./tag";

export abstract class Theme extends ModifierEntity {
    override value = 1;
    override canBurn = true;

    tags: Tag[] = [];
    weaknessTags: Tag[] = [];
    description: string = "";

    constructor(public name: string) {
        super()
    }
}

export class StoryTheme extends Theme {}

export class HeroTheme extends Theme {
    improve: number = 0;
    milestone: number = 0;
    abandon: number = 0;
    quest: string = ""
    specialImprovements: string[] = [];
}