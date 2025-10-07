import type { Entity, EntityType } from "@/litm/entity";
import { Fellowship } from "@/litm/fellowship";
import { deserializeRawEntity } from "@/litm/helpers";
import { Hero } from "@/litm/hero";
import type { Might } from "@/litm/might";
import { Status } from "@/litm/status";
import { Tag } from "@/litm/tag";
import { HeroTheme, Theme, type ThemeType } from "@/litm/theme";
import type { EntityPositionData } from "@/types";
import User from "@/user";
import { generateId } from "@/utils";
import { readableStreamToFormData } from "bun";
import { Database, type Changes, type SQLQueryBindings } from "bun:sqlite";
import { LoremIpsum } from "lorem-ipsum";

export default class LitmDatabase {
  db: Database;

  constructor(public connectionString: string) {
    this.db = new Database(connectionString);
    this.bootstrap();
  }

  bootstrap() {
    // TODO this is just while developing the database initially
    this.db.query("drop table if exists GameTableState").run();
    this.db.query("drop table if exists Tag").run();
    this.db.query("drop table if exists Status").run();
    this.db.query("drop table if exists HeroTheme").run();
    this.db.query("drop table if exists StoryTheme").run();
    this.db.query("drop table if exists User").run();
    this.db.query("drop table if exists Hero").run();
    this.db.query("drop table if exists Challenge").run();
    this.db.query("drop table if exists Fellowship").run();

    this.db
      .query(
        "CREATE TABLE GameTableState (entityId STRING PRIMARY KEY NOT NULL, x REAL NOT NULL, y REAL NOT NULL);",
      )
      .run();
    this.db
      .query(
        "CREATE TABLE Tag (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, isScratched boolean NOT NULL, owner STRING NOT NULL);",
      )
      .run();
    this.db
      .query(
        "CREATE TABLE Status (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, tiers STRING NOT NULL, owner STRING NOT NULL);",
      )
      .run();
    this.db
      .query(
        "CREATE TABLE User (username STRING PRIMARY KEY NOT NULL, hashedPassword STRING NOT NULL, role STRING NOT NULL)",
      )
      .run();
    this.db
      .query(
        `CREATE TABLE HeroTheme (
            id STRING PRIMARY KEY NOT NULL,
            name STRING NOT NULL, 
            might STRING NOT NULL DEFAULT 'origin', 
            type STRING NOT NULL DEFAULT '',
            otherTags STRING NOT NULL DEFAULT "",
            weaknessTags STRING NOT NULL DEFAULT "",
            improve INTEGER,
            milestone INTEGER,
            abandon INTEGER,
            description STRING NOT NULL DEFAULT "",
            quest STRING NOT NULL DEFAULT "",
            specialImprovements STRING NOT NULL DEFAULT "",
            owner STRING NOT NULL,
            isScratched BOOLEAN NOT NULL
            );`,
      )
      .run();
    this.db
      .query(
        `CREATE TABLE Fellowship (
            id STRING PRIMARY KEY NOT NULL,
            name STRING NOT NULL, 
            otherTags STRING NOT NULL DEFAULT "",
            weaknessTags STRING NOT NULL DEFAULT "",
            improve INTEGER,
            milestone INTEGER,
            abandon INTEGER,
            description STRING NOT NULL DEFAULT "",
            quest STRING NOT NULL DEFAULT "",
            specialImprovements STRING NOT NULL DEFAULT "",
            owner STRING NOT NULL,
            isScratched BOOLEAN NOT NULL
            );`,
      )
      .run();
    this.db
      .query("CREATE TABLE StoryTheme (id STRING PRIMARY KEY NOT NULL);")
      .run();
    this.db
      .query(
        "CREATE TABLE Hero (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, promise NUMBER NOT NULL, description STRING NOT NULL DEFAULT '', themes STRING NOT NULL DEFAULT '', backpack STRING NOT NULL DEFAULT '', relationships STRING NOT NULL DEFAULT '', fellowship STRING, owner STRING NOT NULL);",
      )
      .run();

    // POPULATE DB
    // users
    ["ben", "gemma", "daisy"].forEach((username, i) =>
      this.db
        .query("INSERT INTO User VALUES ($username, 'password123', 'player')")
        .run({ $username: username }),
    );

    //tags
    ["sharp", "strong", "sword", "woodsman's axe", "travel supplies"].forEach(
      (tag, i) => {
        const t = Tag.deserialize({
          id: `example-tag-${i}`,
          name: tag,
          isScratched: false,
          owner: i == 1 ? "gemma" : "ben",
        });
        this.insertTag(t);
        this.addEntityToGameBoard(t, i * 50, i * 50);
      },
    );

    // statuses
    ["drunk", "warded", "damaged", "burning", "intimidated"].forEach(
      (status, i) => {
        const s = Status.deserialize({
          id: `example-status-${i}`,
          name: status,
          tiers: [i+1],
          owner: i == 1 ? "gemma" : "ben",
        });
        this.insertStatus(s);
        this.addEntityToGameBoard(s, i * 50, i * 50 + 200);
      },
    );

    const lorem = new LoremIpsum({
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });

    lorem.generateWords(3);
    lorem.generateSentences(3);
    // fellowships
    const fellowship1 = Fellowship.deserialize({
      id: "example-fellowship-1",
      name: lorem.generateWords(3),
      otherTags: [
        Tag.deserialize({
          id: "example-fellowshipothertag-1",
          name: lorem.generateWords(3),
          isScratched: false,
          owner: "ben",
        }),
        Tag.deserialize({
          id: "example-fellowshipothertag-2",
          name: lorem.generateWords(3),
          isScratched: true,
          owner: "ben",
        }),
      ],
      weaknessTags: [
        Tag.deserialize({
          id: "example-fellowshipweaknesstag-1",
          name: lorem.generateWords(3),
          isScratched: false,
          owner: "ben",
        }),
      ],
      milestone: 1,
      abandon: 2,
      improve: 1,
      quest: lorem.generateSentences(2),
      description: lorem.generateSentences(3),
      specialImprovements: [lorem.generateSentences(1), lorem.generateSentences(1), lorem.generateSentences(1)],
      owner: "ben",
      isScratched: false,
    });
    this.insertFellowship(fellowship1);

    // heroes
    this.db
      .query<
        { id: string; name: string; isScratched: boolean },
        SQLQueryBindings[]
      >(`INSERT INTO Tag VALUES ($id, $name, $isScratched, $owner);`)
      .run({
        $id: "example-tag-5",
        $name: lorem.generateWords(3),
        $isScratched: false,
        $owner: "ben",
      });
    const hero: Hero = Hero.deserialize({
      id: "example-hero-1",
      name: lorem.generateWords(3),
      promise: 2,
      description: "",
      themes: [
        HeroTheme.deserialize({
          id: "example-herotheme-1",
          name: lorem.generateWords(3),
          otherTags: [
            Tag.deserialize({
              id: "example-othertag-1",
              name: lorem.generateWords(3),
              isScratched: false,
              owner: "ben",
            }),
            Tag.deserialize({
              id: "example-othertag-2",
              name: lorem.generateWords(3),
              isScratched: true,
              owner: "ben",
            }),
          ],
          weaknessTags: [
            Tag.deserialize({
              id: "example-weaknesstag-1",
              name: lorem.generateWords(3),
              isScratched: false,
              owner: "ben",
            }),
          ],
          might: "origin",
          type: "trait",
          milestone: 1,
          abandon: 2,
          improve: 1,
          quest: lorem.generateSentences(2),
          description: lorem.generateSentences(3),
          specialImprovements: ["improvement1", "improvement2"],
          owner: "ben",
          isScratched: false,
        }),
        HeroTheme.deserialize({
          id: "example-herotheme-2",
          name: lorem.generateWords(3),
          otherTags: [
            Tag.deserialize({
              id: "example-othertag-3",
              name: lorem.generateWords(3),
              isScratched: false,
              owner: "ben",
            }),
            Tag.deserialize({
              id: "example-othertag-4",
              name: lorem.generateWords(3),
              isScratched: true,
              owner: "ben",
            }),
          ],
          weaknessTags: [
            Tag.deserialize({
              id: "example-weaknesstag-2",
              name: lorem.generateWords(3),
              isScratched: false,
              owner: "ben",
            }),
          ],
          might: "adventure",
          type: "relic",
          milestone: 1,
          abandon: 2,
          improve: 1,
          quest: lorem.generateSentences(2),
          description: lorem.generateSentences(3),
          specialImprovements: [lorem.generateSentences(1), lorem.generateSentences(1), lorem.generateSentences(1)],
          owner: "ben",
          isScratched: false,
        }),
      ],
      backpack: [
        Tag.deserialize({
          id: "example-backpacktag-1",
          name: lorem.generateWords(3),
          isScratched: false,
          owner: "ben",
        }),
      ],
      relationships: [
        [
          "Geoff",
          Tag.deserialize({
            id: "example-relationshiptag-1",
            name: lorem.generateWords(3),
            isScratched: false,
            owner: "ben",
          }),
        ],
      ],
      fellowship: fellowship1,
      owner: "ben",
    });
    this.insertHero(hero);
  }

  insertEntityList<E>(
    list: Entity[],
    insertCallback: (e: E) => void,
    stringerFn: (s: string, el: Entity) => string = (s: string, el: Entity) => {
      s += `${el.id},`;
      return s;
    },
  ): string {
    let listString = "";
    list.forEach((el) => {
      insertCallback(el as E);
      listString = stringerFn(listString, el);
    });
    return this.trimListString(listString);
  }

  insertEntityMap<E>(
    map: Map<string, Entity>,
    insertCallback: (e: E) => void,
    stringerFn: (s: string, el: Entity, key: string) => string = (
      s: string,
      el: Entity,
      key: string,
    ) => {
      s += `${key}__${el.id},`;
      return s;
    },
  ): string {
    let listString = "";
    map.forEach((value, key) => {
      insertCallback(value as E);
      listString = stringerFn(listString, value, key);
    });
    return this.trimListString(listString);
  }

  trimListString(listString: string): string {
    if (listString.length) {
      listString = listString.substring(0, listString.length - 1);
    }
    return listString;
  }

  insertHeroTheme(theme: HeroTheme) {
    const otherTags = this.insertEntityList<Tag>(
      theme.otherTags,
      this.insertTag.bind(this),
    );
    const weaknessTags = this.insertEntityList<Tag>(
      theme.weaknessTags,
      this.insertTag.bind(this),
    );
    const heroThemeInsertObj = {
      $id: theme.id,
      $name: theme.name,
      $might: theme.might as Might,
      $type: theme.type as ThemeType,
      $otherTags: otherTags,
      $weaknessTags: weaknessTags,
      $improve: theme.improve,
      $milestone: theme.milestone,
      $abandon: theme.abandon,
      $description: theme.description,
      $quest: theme.quest,
      $specialImprovements: theme.specialImprovements.join(","),
      $owner: theme.owner,
      $isScratched: theme.isScratched,
    };
    console.log(heroThemeInsertObj);
    this.db
      .query(
        `INSERT INTO HeroTheme VALUES ($id, $name, $might, $type, $otherTags, $weaknessTags, $improve, $milestone, $abandon, $description, $quest, $specialImprovements, $owner, $isScratched)`,
      )
      .run(heroThemeInsertObj);
  }

  insertFellowship(theme: Fellowship) {
    const otherTags = this.insertEntityList<Tag>(
      theme.otherTags,
      this.insertTag.bind(this),
    );
    const weaknessTags = this.insertEntityList<Tag>(
      theme.weaknessTags,
      this.insertTag.bind(this),
    );
    const fellowshipInsertObj = {
      $id: theme.id,
      $name: theme.name,
      $otherTags: otherTags,
      $weaknessTags: weaknessTags,
      $improve: theme.improve,
      $milestone: theme.milestone,
      $abandon: theme.abandon,
      $description: theme.description,
      $quest: theme.quest,
      $specialImprovements: theme.specialImprovements.join(","),
      $owner: theme.owner,
      $isScratched: theme.isScratched,
    };
    console.log(fellowshipInsertObj);
    this.db
      .query(
        `INSERT INTO Fellowship VALUES ($id, $name, $otherTags, $weaknessTags, $improve, $milestone, $abandon, $description, $quest, $specialImprovements, $owner, $isScratched)`,
      )
      .run(fellowshipInsertObj);
  }

  getFellowshipById(id: string): Fellowship {
    const rawFship: any = this.db
      .query<
        { id: string; name: string; isScratched: boolean },
        SQLQueryBindings[]
      >("SELECT * FROM Fellowship WHERE id = $id")
      .get({ $id: id });
    if (!rawFship) {
      throw new Error(`Fellowship ${id} does not exist`);
    }
    if (rawFship.otherTags) {
      console.log(rawFship);
      rawFship.otherTags = rawFship.otherTags
        .split(",")
        .map((t: string) => this.getTagById(t));
    } else rawFship.otherTags = [];
    if (rawFship.weaknessTags) {
      rawFship.weaknessTags = rawFship.weaknessTags
        .split(",")
        .map((t: string) => this.getTagById(t));
    } else rawFship.weaknessTags = [];
    rawFship.specialImprovements = rawFship.specialImprovements.split(",");
    const fellowship = Fellowship.deserialize(rawFship);
    return fellowship;
  }

  insertHero(hero: Hero) {
    const relString = this.insertEntityMap<Tag>(
      hero.relationships,
      this.insertTag.bind(this),
    );
    const themes = this.insertEntityList<HeroTheme>(
      hero.themes,
      this.insertHeroTheme.bind(this),
    );
    const backpack = this.insertEntityList<Tag>(
      hero.backpack,
      this.insertTag.bind(this),
    );
    const heroInsertObj = {
      $id: hero.id,
      $name: hero.name,
      $promise: hero.promise,
      $description: hero.description,
      $themes: themes,
      $backpack: backpack,
      $relationships: relString,
      $fellowship: hero.fellowship != undefined ? hero.fellowship.id : "",
      $owner: hero.owner,
    };
    console.log(heroInsertObj);
    this.db
      .query<
        {
          id: string;
        },
        SQLQueryBindings[]
      >(
        `INSERT INTO Hero VALUES ($id, $name, $promise, $description, $themes, $backpack, $relationships, $fellowship, $owner);`,
      )
      .run(heroInsertObj);
  }

  getAllHeroes() {
    const sql = "SELECT * FROM Hero";
    const query = this.db.query<
      {
        id: string;
        name: string;
        promise: number;
        description: string;
        themes: string;
        backpack: string;
        relationships: string;
        fellowship: string;
        owner: string;
      },
      SQLQueryBindings[]
    >(sql);
    const res = query.all();
    const heroes = res.map((raw) => {
      // add themes
      const themes: HeroTheme[] = raw.themes
        .split(",")
        .filter((t) => t)
        .map((id) => this.getThemeById(id));
      // add backpack tags
      const backpack: Tag[] = raw.backpack
        .split(",")
        .filter((t) => t)
        .map((id) => this.getTagById(id));
      // add relationships
      if (raw.relationships) {
        var relationships: (string | Tag)[][] = raw.relationships
          .split(",")
          .map((relStr) => {
            const [hero, tagId] = relStr.split("__");
            const tag = this.getTagById(tagId!);
            return [hero!, tag];
          });
      } else {
        var relationships: (string | Tag)[][] = [];
      }
      // add fellowship
      const fellowship = this.getFellowshipById(raw.fellowship);
      const toDes = {
        ...raw,
        backpack: backpack,
        relationships: relationships,
        themes: themes,
        fellowship: fellowship,
        entityType: "hero",
      };
      const des = Hero.deserialize(toDes);
      return des;
    });
    return heroes;
  }

  getTagById(id: string): Tag {
    const rawTag: any = this.db
      .query<
        { id: string; name: string; isScratched: boolean },
        SQLQueryBindings[]
      >("SELECT * FROM Tag WHERE id = $id")
      .get({ $id: id });
    if (!rawTag) {
      throw new Error(`Tag ${id} does not exist`);
    }
    const tag = Tag.deserialize(rawTag);
    return tag;
  }

  getThemeById(id: string): HeroTheme {
    const rawTheme: any = this.db
      .query("SELECT * FROM HeroTheme WHERE id = $id")
      .get({ $id: id });
    if (!rawTheme) {
      throw new Error(`Theme ${id} does not exist`);
    }
    if (rawTheme.otherTags) {
      console.log(rawTheme);
      rawTheme.otherTags = rawTheme.otherTags
        .split(",")
        .map((t: string) => this.getTagById(t));
    } else rawTheme.otherTags = [];
    if (rawTheme.weaknessTags) {
      rawTheme.weaknessTags = rawTheme.weaknessTags
        .split(",")
        .map((t: string) => this.getTagById(t));
    } else rawTheme.weaknessTags = [];
    rawTheme.specialImprovements = rawTheme.specialImprovements.split(",");
    const theme = HeroTheme.deserialize(rawTheme);
    return theme;
  }

  getAllDrawerEntities() {
    const heroes = this.getAllHeroes();
    return heroes;
  }

  createNewEntity(entity: Entity) {
    let result: Changes | undefined = undefined;
    switch (entity.entityType) {
      case "tag": {
        result = this.insertTag(entity as Tag);
        break;
      }
      case "status": {
        result = this.insertStatus(entity as Status);
        break;
      }
      default:
        throw Error(`Cannot insert ${entity.entityType}`);
    }
    singleRecordCheck(result);
  }

  insertTag({ id, name, isScratched, owner }: Tag): Changes {
    return this.db
      .query(
        `INSERT INTO Tag (id, name, isScratched, owner) VALUES ($id, $name, $scratched, $owner);`,
      )
      .run({
        $id: id,
        $name: name,
        $scratched: isScratched ? 1 : 0,
        $owner: owner,
      });
  }

  insertStatus({ id, name, tiers, owner }: Status): Changes {
    return this.db
      .query(
        `INSERT INTO Status (id, name, tiers, owner) VALUES ($id, $name, $tiers, $owner)`,
      )
      .run({ $id: id, $name: name, $tiers: tiers.join(","), $owner: owner });
  }

  addEntityToGameBoard(entity: Entity, x: number, y: number) {
    const result = this.db
      .query(`INSERT INTO GameTableState (entityId, x, y) VALUES ($id, $x, $y)`)
      .run({ $x: x, $y: y, $id: entity.id });
    singleRecordCheck(result);
  }

  getAllTagsWithPositions(): EntityPositionData[] {
    const sql =
      "SELECT Tag.id, Tag.name, Tag.isScratched, Tag.owner, GameTableState.x, GameTableState.y FROM GameTableState INNER JOIN Tag on Tag.id = GameTableState.entityId;";
    const query = this.db.query<
      {
        id: string;
        name: string;
        isScratched: boolean;
        owner: string;
        x: number;
        y: number;
      },
      SQLQueryBindings[]
    >(sql);
    const tags: EntityPositionData[] = Array.from(query.iterate()).map((r) => {
      return {
        entity: Tag.deserialize({
          id: r.id,
          name: r.name,
          isScratched: r.isScratched,
          owner: r.owner,
        }),
        position: { x: r.x, y: r.y },
      };
    });
    return tags;
  }

  getAllStatusesWithPositions(): EntityPositionData[] {
    const sql =
      "SELECT Status.id, Status.name, Status.tiers, Status.owner, GameTableState.x, GameTableState.y FROM GameTableState INNER JOIN Status on Status.id = GameTableState.entityId;";
    const query = this.db.query<
      {
        id: string;
        name: string;
        tiers: string;
        owner: string;
        x: number;
        y: number;
      },
      SQLQueryBindings[]
    >(sql);
    const statuses: EntityPositionData[] = query.all().map((r) => {
      const tiers = r.tiers
        .toString()
        .split(",")
        .map((t) => parseInt(t));
      return {
        entity: Status.deserialize({
          id: r.id,
          name: r.name,
          tiers: tiers,
          owner: r.owner,
        }),
        position: { x: r.x, y: r.y },
      };
    });
    return statuses;
  }

  getAllEntitiesWithPositions(): EntityPositionData[] {
    const tags = this.getAllTagsWithPositions();
    const statuses = this.getAllStatusesWithPositions();
    const entities = tags.concat(statuses);
    return entities;
  }

  updateEntity(entity: Entity) {
    let result: Changes | undefined = undefined;
    switch (entity.entityType) {
      case "tag": {
        result = this.updateTag(entity as Tag);
        break;
      }
      case "status": {
        result = this.updateStatus(entity as Status);
        break;
      }
      default:
        throw Error(`Cannot update ${entity.entityType}`);
    }
    singleRecordCheck(result);
  }

  updateTag({ id, name, isScratched }: Tag): Changes {
    return this.db
      .query(
        `UPDATE Tag SET name = $name, isScratched = $scratched WHERE id = $id`,
      )
      .run({ $id: id, $name: name, $scratched: isScratched });
  }

  updateStatus({ id, name, tiers }: Status): Changes {
    return this.db
      .query(`UPDATE Status SET name = $name, tiers = $tiers WHERE id = $id`)
      .run({ $id: id, $name: name, $tiers: tiers.join(",") });
  }

  updateEntityPosition(id: string, x: number, y: number) {
    const result = this.db
      .query(`UPDATE GameTableState SET x = $x, y = $y WHERE entityId = $id`)
      .run({ $x: x, $y: y, $id: id });
    singleRecordCheck(result);
  }

  deleteEntity(id: string, type: EntityType) {
    singleRecordCheck(
      this.db
        .query(`DELETE FROM GameTableState WHERE entityId = $id`)
        .run({ $id: id }),
    );
    singleRecordCheck(
      this.db
        .query(`DELETE FROM ${getTableForEntityType(type)} WHERE id = $id`)
        .run({ $id: id }),
    );
  }
}

function getTableForEntityType(entityType: EntityType): string {
  switch (entityType) {
    case "tag":
      return "Tag";
    case "status":
      return "Status";
    // case "story-theme": return "StoryTheme";
    default:
      throw new Error(`${entityType} does not have table`);
  }
}

function singleRecordCheck(result: Changes) {
  if (result.changes != 1) {
    console.error(
      `Changed ${result.changes} records when should only have changed 1!`,
    );
  }
}
