import {type EntityType, ModifierEntity} from "./entity";

export class Tag extends ModifierEntity {
    value = 1;
    entityType: EntityType = "tag";
    override canBurn: boolean = true;
    override canScratch: boolean = true;
    constructor(
        public name: string
    )
    {
        super();
    }

    static override deserialize(raw: any): Tag {
      try {
        let ent = new Tag(raw.name);
        ent.id = raw.id;
        ent.isScratched = raw.isScratched;
        return ent;
      } catch {
        throw Error(`Failed to deserialize Tag from ${raw.toString()}`)
      }
    }
}
