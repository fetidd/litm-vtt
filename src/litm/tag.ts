import {ModifierEntity} from "./entity";

export default class Tag extends ModifierEntity {
    override canBurn: boolean = true;
    constructor(
        public name: string, 
        public value: number = 1, 
        public isBurned: boolean = false) 
    {
        super();
    }
    announceState() {
        console.log(`Tag ${this.name} ${this.id}`);
    }
} 