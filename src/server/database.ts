import type { Entity, EntityType } from '@/litm/entity';
import { deserializeRawEntity } from '@/litm/helpers';
import type { Status } from '@/litm/status';
import type { Tag } from '@/litm/tag';
import type { EntityPositionData } from '@/types';
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
        this.db.query("drop table if exists Theme").run();
        this.db.query("drop table if exists User").run();
        this.db.query("drop table if exists Hero").run();
        this.db.query("drop table if exists Challenge").run();

        this.db.query("CREATE TABLE GameTableState (entityId STRING PRIMARY KEY NOT NULL, x REAL NOT NULL, y REAL NOT NULL);").run();

        const exampleStatuses = ["drunk", "warded", "damaged", "burning", "intimidated"];
        const exampleTags = ["sharp", "strong", "sword", "woodsman's axe", "travel supplies"];

        this.db.query("CREATE TABLE Tag (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, isScratched boolean NOT NULL);").run();
        for (let i = 0; i < 5; i++) {
            const id = generateId();
            this.db.query<{ id: string, name: string, isScratched: boolean}, SQLQueryBindings[]>(`INSERT INTO Tag VALUES ($id, $name, $isScratched);`).run({$id: id, $name: exampleTags[i]!, $isScratched: false});
            const sql2 = `INSERT INTO GameTableState VALUES ('${id}', ${i * 50}, ${i * 50});`
            this.db.query(sql2).run();
        }

        this.db.query("CREATE TABLE Status (id STRING PRIMARY KEY NOT NULL, name STRING NOT NULL, tiers STRING NOT NULL);").run();
        for (let i = 0; i < 5; i++) {
            const id = generateId();
            const sql = `INSERT INTO Status VALUES ('${id}', '${exampleStatuses[i]}', '${i}');`;
            this.db.query<{ id: string, name: string, tiers: string}, SQLQueryBindings[]>(`INSERT INTO Status VALUES ($id, $name, $tiers);`).run({$id: id, $name: exampleStatuses[i]!, $tiers: (i+1).toString()});
            const sql2 = `INSERT INTO GameTableState VALUES ('${id}', ${i * 50}, ${(i * 50 + 200)})`;
            this.db.query(sql2).run();
        }
    }

    createNewEntity(entity: Entity) {
        let result: Changes | undefined = undefined;
        switch (entity.entityType) {
            case "tag": {result = this.insertTag(entity as Tag); break}
            case "status": {result = this.insertStatus(entity as Status); break}
            default: throw Error(`Cannot insert ${entity.entityType}`)
        }
        singleRecordCheck(result);
    }

    insertTag({id, name, isScratched}: Tag): Changes {
        return this.db.query(`INSERT INTO Tag (id, name, isScratched) VALUES ($id, $name, $scratched);`).run({ $id: id, $name: name, $scratched: isScratched ? 1 : 0 });
    }

    insertStatus({id, name, tiers}: Status): Changes {
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
            case "tag": {result = this.updateTag(entity as Tag); break}
            case "status": {result = this.updateStatus(entity as Status); break}
            default: throw Error(`Cannot update ${entity.entityType}`)
        }
        singleRecordCheck(result);
    }

    updateTag({id, name, isScratched}: Tag): Changes {
        return this.db.query(`UPDATE Tag SET name = $name, isScratched = $scratched WHERE id = $id`).run({ $id: id, $name: name, $scratched: isScratched });
    }

    updateStatus({id, name, tiers}: Status): Changes {
        return this.db.query(`UPDATE Status SET name = $name, tiers = $tiers WHERE id = $id`).run({ $id: id, $name: name, $tiers: tiers.join(",") });
    }

    updateEntityPosition(id: string, x: number, y: number) {
        const result = this.db.query(`UPDATE GameTableState SET x = $x, y = $y WHERE entityId = $id`).run({ $x: x, $y: y, $id: id });
        singleRecordCheck(result);
    }

}

function singleRecordCheck(result: Changes) {
    if (result.changes != 1) {
        console.error(`Changed ${result.changes} records when should only have changed 1!`);
    }
}