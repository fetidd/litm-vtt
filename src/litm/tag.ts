import { ModifierEntity } from "./entity";
import { type EntityType } from './entity';

export class Tag extends ModifierEntity {
    public override get value(): number {
      return 1
    }

    public override get canBurn(): boolean {
      return true
    }

    public override get entityType(): EntityType {
      return "tag"
    }

    public override get canScratch(): boolean {
      return true
    }

    static blank() {return new Tag()}

    
    static override deserialize(raw: any): Tag {
      try {
        if (raw.name == undefined) throw Error("missing name");
        if (raw.id == undefined) throw Error("missing id");
        if (raw.isScratched == undefined) throw Error("missing isScratched");
        let ent = Tag.blank();
        ent.name = raw.name;
        ent.id = raw.id;
        ent.isScratched = Boolean(raw.isScratched);
        return ent;
      } catch (e) {
        throw Error(`Failed to deserialize Tag from ${JSON.stringify(raw)}: ${e}`)
      }
    }

    override serialize(): object {
      return {
        id: this.id,
        name: this.name,
        entityType: this.entityType,
        isScratched: this.isScratched,
      }
    }
}
