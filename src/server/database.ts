import type { Entity, EntityType } from '@/litm/entity';
import { deserializeRawEntity } from '@/litm/helpers';
import { Hero } from '@/litm/hero';
import type { Status } from '@/litm/status';
import type { Tag } from '@/litm/tag';
import type { HeroTheme } from '@/litm/theme';
import type { EntityPositionData } from '@/types';
import User from '@/user';
import { generateId } from '@/utils';
import { Database, type Changes, type SQLQueryBindings } from 'bun:sqlite';

export default class LitmDatabase {
    db: Database

    constructor(public connectionString: string) {
        this.db = new Database(connectionString);
        this.bootstrap()
    }

    bootstrap() { // TODO this is just while developing the database initially
        this.db.query("drop table if exists GameTableState").run();
        this.db.query("drop table if exists Tag").run();
        this.db.query("drop table if exists Status").run();
        this.db.query("drop table if exists HeroTheme").run();
        this.db.query("drop table if exists StoryTheme").run();
        this.db.query("drop table if exists User").run();
        this.db.query("drop table if exists Hero").run();
        this.db.query("drop table if exists Challenge").run();
        this.db.query("drop table if exists Fellowship").run();

        this.db.query("CREATE TABLE GameTableState (entityId STRING PRIMARY KEY NOT NULL, x REAL NOT NULL, y REAL NOT NULL);").run();

        const exampleStatuses = ["drunk", "warded", "damaged", "burning", "intimidated"];
        const exampleTags = ["sharp", "strong", "sword", "woodsman's axe", "travel supplies"];

        this.db.query("CREATE TABLE Tag (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, isScratched boolean NOT NULL);").run();
        ["sharp", "strong", "sword", "woodsman's axe", "travel supplies"].forEach((tag, i) => {
            const id = `example-tag-${i}`;
            this.db.query<{ id: string, name: string, isScratched: boolean }, SQLQueryBindings[]>(`INSERT INTO Tag VALUES ($id, $name, $isScratched);`).run({ $id: id, $name: tag, $isScratched: false });
            this.db.query(`INSERT INTO GameTableState VALUES ('${id}', ${i * 50}, ${i * 50});`).run();
        })

        this.db.query("CREATE TABLE Status (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, tiers STRING NOT NULL);").run();
        ["drunk", "warded", "damaged", "burning", "intimidated"].forEach((status, i) => {
            const id = `example-status-${i}`;
            this.db.query<{ id: string, name: string, tiers: string }, SQLQueryBindings[]>(`INSERT INTO Status VALUES ($id, $name, $tiers);`).run({ $id: id, $name: status, $tiers: (i + 1).toString() });
            this.db.query(`INSERT INTO GameTableState VALUES ('${id}', ${i * 50}, ${(i * 50 + 200)})`).run();
        })

        this.db.query("CREATE TABLE User (username STRING PRIMARY KEY NOT NULL, hashedPassword STRING NOT NULL, role STRING NOT NULL)").run();
        ["ben", "gemma", "daisy"].forEach((username, i) => this.db.query("INSERT INTO User VALUES ($username, 'password123', 'player')").run({ $username: username }))

        this.db.query("CREATE TABLE Fellowship (id STRING PRIMARY KEY NOT NULL);").run();
        this.db.query("INSERT INTO Fellowship VALUES ($id)").run({ $id: "example-fellowship-1" })

        this.db.query(`CREATE TABLE HeroTheme (
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
            specialImprovements STRING NOT NULL DEFAULT ""
            );`).run();
        this.db.query(`INSERT INTO HeroTheme VALUES ($id, $name, $might, $type, $otherTags, $weaknessTags, $improve, $milestone, $abandon, $description, $quest, $specialImprovements)`).run({
            $id: "example-herotheme-1",
            $name: "Sassy",
            $might: "origin",
            $type: "trait",
            $otherTags: "example-tag-1",
            $weaknessTags: "",
            $improve: 0,
            $milestone: 0,
            $abandon: 0,
            $description: "",
            $quest: "",
            $specialImprovements: ""
        })

        this.db.query("CREATE TABLE StoryTheme (id STRING PRIMARY KEY NOT NULL);").run();
        this.db.query("INSERT INTO StoryTheme VALUES ($id)").run({ $id: "example-storytheme-1" })

        this.db.query("CREATE TABLE Hero (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, promise NUMBER NOT NULL, description STRING NOT NULL DEFAULT '', themes STRING NOT NULL DEFAULT '', backpack STRING NOT NULL DEFAULT '', relationships STRING NOT NULL DEFAULT '', fellowship STRING, owner STRING NOT NULL);").run();
        const id = "example-hero-1";
        this.db.query<{
            id: string
        }, SQLQueryBindings[]>(`INSERT INTO Hero VALUES ($id, $name, $promise, $description, $themes, $backpack, $relationships, $fellowship, $owner);`).run({
            $id: id,
            $name: "John De'Stroyer",
            $promise: 2,
            $description: "",
            $themes: "example-herotheme-1",
            $backpack: "example-tag-3,example-tag-4",
            $relationships: "",
            $fellowship: "",
            $owner: "fetiddius"
        });
    }

    getAllHeroes() {
        const sql = "SELECT Hero.id, Hero.name, Hero.promise, Hero.description, Hero.themes, Hero.backpack, Hero.relationships, Hero.fellowship, Hero.owner FROM Hero";
        const query = this.db.query<{
            id: string,
            name: string,
            promise: number,
            description: string,
            themes: string,
            backpack: string,
            relationships: string,
            fellowship: string,
            owner: string
        }, SQLQueryBindings[]>(sql);
        const res = query.all();
        const heroes = res.map(raw => {
            // add themes
            const themes: HeroTheme[] = raw.themes.split(",").map(id => this.getThemeById(id));
            // add backpack tags
            const backpack: Tag[] = raw.backpack.split(",").map(id => this.getTagById(id));
            // add relationships
            if (raw.relationships) {
                var relationships: (string | Tag)[][] = raw.relationships.split(",").map(relStr => {
                    const [hero, tagId] = relStr.split("__");
                    const tag = this.getTagById(tagId!);
                    return [hero!, tag]
                });
            } else {
                var relationships: (string | Tag)[][] = [];
            }
            // add fellowship
            // add owning user
            const toDes = { ...raw, backpack: backpack, relationships: relationships, themes: themes, entityType: "hero" };
            const des = deserializeRawEntity(toDes) as Hero
            return des;
        });
        return heroes
    }

    getTagById(id: string): Tag {
        const rawTag: any = this.db.query<{ id: string, name: string, isScratched: boolean }, SQLQueryBindings[]>("SELECT * FROM Tag WHERE id = $id").get({ $id: id });
        const tag = deserializeRawEntity({ ...rawTag, entityType: "tag" }) as Tag;
        return tag;
    }

    getThemeById(id: string): HeroTheme {
        const rawTheme: any = this.db.query("SELECT * FROM HeroTheme WHERE id = $id").get({ $id: id });
        if (rawTheme.otherTags) {
            rawTheme.otherTags = rawTheme.otherTags.split(",").map((t: string) => this.getTagById(t));
        } else rawTheme.otherTags = [];
        if (rawTheme.weaknessTags) {
            rawTheme.weaknessTags = rawTheme.weaknessTags.split(",").map((t: string) => this.getTagById(t));
        } else rawTheme.weaknessTags = [];
        const theme: HeroTheme = deserializeRawEntity({ ...rawTheme, entityType: "hero-theme" }) as HeroTheme;
        return theme;
    }

    getAllDrawerEntities() {
        const heroes = this.getAllHeroes();
        return heroes
    }

    createNewEntity(entity: Entity) {
        let result: Changes | undefined = undefined;
        switch (entity.entityType) {
            case "tag": { result = this.insertTag(entity as Tag); break }
            case "status": { result = this.insertStatus(entity as Status); break }
            default: throw Error(`Cannot insert ${entity.entityType}`)
        }
        singleRecordCheck(result);
    }

    insertTag({ id, name, isScratched }: Tag): Changes {
        return this.db.query(`INSERT INTO Tag (id, name, isScratched) VALUES ($id, $name, $scratched);`).run({ $id: id, $name: name, $scratched: isScratched ? 1 : 0 });
    }

    insertStatus({ id, name, tiers }: Status): Changes {
        return this.db.query(`INSERT INTO Status (id, name, tiers) VALUES ($id, $name, $tiers)`).run({ $id: id, $name: name, $tiers: tiers.join(",") });
    }

    addEntityToGameBoard(entity: Entity, x: number, y: number) {
        const result = this.db.query(`INSERT INTO GameTableState (entityId, x, y) VALUES ($id, $x, $y)`).run({ $x: x, $y: y, $id: entity.id });
        singleRecordCheck(result);
    }

    getAllTagsWithPositions(): EntityPositionData[] {
        const sql = "SELECT Tag.id, Tag.name, Tag.isScratched, GameTableState.x, GameTableState.y FROM GameTableState INNER JOIN Tag on Tag.id = GameTableState.entityId;";
        const query = this.db.query<{ id: string, name: string, isScratched: boolean, x: number, y: number }, SQLQueryBindings[]>(sql);
        const tags: EntityPositionData[] = Array.from(query.iterate()).map((r) => {
            return { entity: deserializeRawEntity({ id: r.id, name: r.name, isScratched: r.isScratched, entityType: "tag" }), position: { x: r.x, y: r.y } }
        });
        return tags
    }

    getAllStatusesWithPositions(): EntityPositionData[] {
        const sql = "SELECT Status.id, Status.name, Status.tiers, GameTableState.x, GameTableState.y FROM GameTableState INNER JOIN Status on Status.id = GameTableState.entityId;";
        const query = this.db.query<{ id: string, name: string, tiers: string, x: number, y: number }, SQLQueryBindings[]>(sql);
        const statuses: EntityPositionData[] = query.all().map((r) => {
            const tiers = r.tiers.toString().split(",").map(t => parseInt(t));
            return { entity: deserializeRawEntity({ id: r.id, name: r.name, _tiers: tiers, entityType: "status" }), position: { x: r.x, y: r.y } }
        });
        return statuses
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
            case "tag": { result = this.updateTag(entity as Tag); break }
            case "status": { result = this.updateStatus(entity as Status); break }
            default: throw Error(`Cannot update ${entity.entityType}`)
        }
        singleRecordCheck(result);
    }

    updateTag({ id, name, isScratched }: Tag): Changes {
        return this.db.query(`UPDATE Tag SET name = $name, isScratched = $scratched WHERE id = $id`).run({ $id: id, $name: name, $scratched: isScratched });
    }

    updateStatus({ id, name, tiers }: Status): Changes {
        return this.db.query(`UPDATE Status SET name = $name, tiers = $tiers WHERE id = $id`).run({ $id: id, $name: name, $tiers: tiers.join(",") });
    }

    updateEntityPosition(id: string, x: number, y: number) {
        const result = this.db.query(`UPDATE GameTableState SET x = $x, y = $y WHERE entityId = $id`).run({ $x: x, $y: y, $id: id });
        singleRecordCheck(result);
    }

    deleteEntity(id: string, type: EntityType) {
        singleRecordCheck(this.db.query(`DELETE FROM GameTableState WHERE entityId = $id`).run({ $id: id }));
        singleRecordCheck(this.db.query(`DELETE FROM ${getTableForEntityType(type)} WHERE id = $id`).run({ $id: id }));
    }

}

function getTableForEntityType(entityType: EntityType): string {
    switch (entityType) {
        case "tag": return "Tag";
        case "status": return "Status";
        // case "story-theme": return "StoryTheme";
        default: throw new Error(`${entityType} does not have table`)
    }
}

function singleRecordCheck(result: Changes) {
    if (result.changes != 1) {
        console.error(`Changed ${result.changes} records when should only have changed 1!`);
    }
}