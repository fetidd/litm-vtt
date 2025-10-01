export default class User {
  constructor(
    public username: string,
    public role: "narrator" | "player",
  ) {}

  public serialize(): object {
    return {
      username: this.username,
      role: this.role,
    };
  }

  public static deserialize(raw: any): User {
    try {
      if (raw.username == undefined) throw Error("missing username");
      if (raw.role == undefined) throw Error("missing role");
      let ent = new User(raw.username, raw.role);
      return ent;
    } catch (e) {
      throw Error(
        `Failed to deserialize User from ${JSON.stringify(raw)}: ${e}`,
      );
    }
  }
}
