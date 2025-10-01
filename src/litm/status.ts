import { ModifierEntity, type EntityType } from "./entity";

export class Status extends ModifierEntity {
  public override get canBurn(): boolean {
    return false;
  }
  public override get canScratch(): boolean {
    return false;
  }

  override entityType: EntityType = "status";

  private _tiers: number[] = [];
  public set tiers(toAdd: number[]) {
    if (toAdd.length) {
      this._tiers = toAdd;
    } else
      throw Error(
        "cannot add empty tiers - a status must have at least 1 tier to exist",
      );
  }
  public get tiers(): number[] {
    return this._tiers;
  }

  override get value() {
    return this.tiers.reduce((prev, curr) => Math.max(prev, curr));
  }

  static blank() {
    return new Status();
  }

  public hasTier(n: number): boolean {
    return this._tiers.includes(n);
  }

  public addTier(tier: number) {
    while (this.hasTier(tier) && tier <= 6) {
      tier++;
    }
    if (tier <= 6) this.tiers.push(tier);
  }

  public decreaseTier(amount: number) {
    this.tiers = this.tiers.map((n) => n - amount).filter((n) => n > 0);
  }

  static override deserialize(raw: any): Status {
    try {
      if (raw.name == undefined) throw Error("missing name");
      if (raw.id == undefined) throw Error("missing id");
      if (raw.tiers == undefined) throw Error("missing tiers");
      if (raw.owner == undefined) throw Error("missing owner");
      const ent = Status.blank();
      ent.name = raw.name;
      ent.id = raw.id;
      ent.tiers = raw.tiers;
      ent.owner = raw.owner;
      return ent;
    } catch (e) {
      throw Error(
        `Failed to deserialize Status from ${JSON.stringify(raw)}: ${e}`,
      );
    }
  }

  override serialize(): object {
    return {
      id: this.id,
      name: this.name,
      entityType: this.entityType,
      tiers: this.tiers,
      owner: this.owner,
    };
  }
}
