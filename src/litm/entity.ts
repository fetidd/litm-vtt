import { generateId } from "../utils";

export type EntityType = "tag" | "story-theme" | "hero-theme" | "status" | "hero" | "challenge" | "fellowship";

export abstract class Entity {
    abstract entityType: EntityType;
    abstract name: string;
    canScratch: boolean = false;
    isScratched: boolean = false;
    canModify: boolean = false;

    constructor(public id: string = generateId()) {
        this.id = id
    }

    public static deserialize(raw: any): Entity {
        throw Error("not implemented!")
    }

    public static serialize(): any {
        throw Error("not implemented!")
    }
}

export abstract class ModifierEntity extends Entity {
    override canModify = true;
    abstract value: number;
    abstract canBurn: boolean;
}
