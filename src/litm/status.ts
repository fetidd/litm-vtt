import { ModifierEntity, type EntityType } from "./entity";

export class Status extends ModifierEntity {
    override canBurn = false;
    override entityType: EntityType = 'status';

    private _tiers: number[] = [];

    override get value() {
      return this.tiers.reduce((prev, curr) => Math.max(prev, curr))
    }

    constructor(
      public name: string,
      public initialTier: number = 1
    ) {
      super()
      this._tiers.push(initialTier);
    }

    public hasTier(n: number): boolean {
      return this._tiers.includes(n)
    }

    public set tiers(toAdd: number[]) {
      this._tiers = toAdd
    }

    public get tiers(): number[] {
      return this._tiers
    }

    public addTier(tier: number) {
      while (this.hasTier(tier) && tier <= 6) {
        tier++;
      }
      if (tier <= 6) this.tiers.push(tier);
    }

    public decreaseTier(amount: number) {
      this.tiers = this.tiers.map(n => n - amount).filter(n => n > 0);
    }

    static override deserialize(raw: any): Status {
      try {
        let ent = new Status(raw.name);
        ent.id = raw.id;
        ent.tiers = raw._tiers; // TODO need a whole fucking day on serializing and deserializing. Ballache!
        return ent;
      } catch {
        throw Error(`Failed to deserialize Status from ${raw.toString()}`)
      }
    }
  
}
