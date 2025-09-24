import { generateId } from "../utils";

export type EntityType = "tag" | "story-theme" | "hero-theme" | "status" | "hero" | "challenge" | "fellowship";

export abstract class Entity {
    abstract entityType: EntityType;
    name: string = "";
    owner: string = "";
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

    public serialize(): object {
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
