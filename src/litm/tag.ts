import Entity from "./entity";

export default class Tag extends Entity {
    name: string;
    value: number = 1;

    constructor(name: string, value: number = 1) {
        super();
        this.name = name;
        this.value = value;
    }
    announceState() {
        console.log(`Tag ${this.name} ${this.id}`);
    }
} 