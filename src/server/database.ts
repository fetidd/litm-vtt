import type { Entity } from '@/litm/entity';
import type { EntityPositionData } from '@/types';
import { Database } from 'bun:sqlite';

export default class LitmDatabase {
    db: Database
    constructor(public connectionString: string) {
        this.db = new Database(connectionString);
        this.bootstrap()
    }

    bootstrap() {
        this.db.query("CREATE TABLE Tag (id string PRIMARY KEY, name string, isScratched boolean);").run();
        this.db.query("CREATE TABLE GameBoardState (entityId string PRIMARY KEY, x real, y real)").run();
        for (let i = 0; i < 5; i++) {
          const id = crypto.randomUUID();
          const sql = `INSERT INTO Tag VALUES ('${id}', 'tag_${i}', false); INSERT INTO GameBoardState VALUES (${id}, ${i*10}, ${i*10});`;
          this.db.query(sql).run();
        }
    }

    createNewEntity(entity: Entity) {}

    addEntityToGameBoard(entity: Entity, x: number, y: number) {}

    getAllEntitiesWithPositions(): EntityPositionData[] {
        return []
    }

    updateEntity(entity: Entity) {}

}