import { generateId } from "../utils";

export type EntityType = "tag" | "story-theme" | "hero-theme" | "status" | "hero" | "challenge" | "fellowship";

export abstract class Entity {
    abstract entityType: EntityType;
    abstract name: string;
    isScratched: boolean = false;

    constructor(public id: string = generateId()) {
        this.id = id
    }

    public get canScratch(): boolean {
      return true;
    }

    public get canModify(): boolean {
      return false
    }

    public static deserialize(raw: any): Entity {
        throw Error("not implemented!")
    }

    public serialize(): any {
        throw Error("not implemented!")
    }
}

export abstract class ModifierEntity extends Entity {
    public override get canModify(): boolean {
      return true
    }

    abstract value: number;
    abstract canBurn: boolean;
}
