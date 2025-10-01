import { generateId } from "../utils";

export type EntityType =
  | "tag"
  | "story-theme"
  | "hero-theme"
  | "status"
  | "hero"
  | "challenge"
  | "fellowship";

export abstract class Entity {
  abstract entityType: EntityType;
  name: string = "";
  owner: string = "";
  id: string = generateId();

  public get canScratch(): boolean {
    return false;
  }

  public get canModify(): boolean {
    return false;
  }

  public get canBurn(): boolean {
    return false;
  }

  public static deserialize(raw: any): Entity {
    throw Error("not implemented!");
  }

  public serialize(): object {
    throw Error("not implemented!");
  }

  static blank(): any {
    throw Error("not implemented!");
  }
}

export abstract class ModifierEntity extends Entity {
  get value(): number {
    throw Error("not implemented!");
  }
  isScratched: boolean = false;

  public override get canModify(): boolean {
    return true;
  }
}
