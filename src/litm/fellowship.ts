import { Entity, type EntityType } from "./entity";

export default class Fellowship extends Entity {
    override entityType: EntityType = "fellowship";

    constructor(
      public name: string,
    ) {
      super()
    }
}
