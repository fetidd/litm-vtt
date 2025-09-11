import { generateId } from "@/utils";

export abstract class Entity {
    id: string = generateId();
    abstract name: string;
    canModify: boolean = false;
    abstract announceState(): void;
}

export abstract class ModifierEntity extends Entity {
    override canModify = true;
    abstract value: number;
    abstract canBurn: boolean;
}