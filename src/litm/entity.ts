import { generateId } from "../utils";

export type EntityType = "tag" | "theme" | "status" | "hero" | "challenge" | "fellowship";
export abstract class Entity {
    id: string = generateId();
    abstract entityType: EntityType;
    abstract name: string;
    canScratch: boolean = false;
    isScratched: boolean = false;
    canModify: boolean = false;
}

export abstract class ModifierEntity extends Entity {
    override canModify = true;
    abstract value: number;
    abstract canBurn: boolean;
}
