import {type EntityType, ModifierEntity} from "./entity";

export class Tag extends ModifierEntity {
    entityType: EntityType = "tag";
    override canBurn: boolean = true;
    override canScratch: boolean = true;
    constructor(
        public name: string, 
        public value: number = 1, 
        public isBurned: boolean = false) 
    {
        super();
    }
}

export class PowerTag extends Tag {}

export class StoryTag extends Tag {}
