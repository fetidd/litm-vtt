import { Entity, type EntityType } from "./entity";

export class Challenge extends Entity {
  override entityType: EntityType = "challenge";

  constructor(public name: string) {
    super();
  }
}
