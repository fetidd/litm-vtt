import {ModifierEntity} from "./entity";

export class Tag extends ModifierEntity {
    override canBurn: boolean = true;
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