import { type Entity } from "./litm/entity";
import { Status } from "./litm/status";
import { Tag } from "./litm/tag";
import { HeroTheme, StoryTheme } from "./litm/theme";

export function generateId(): string {
    // return Math.random().toString(36).substring(2, 15)
    return crypto.randomUUID()
}

// export function deserializeRawEntity(entity: any): Tag | StoryTheme | HeroTheme | Status {
//     let deserializer: undefined | ((e: Entity) => any) = undefined;
//     switch (entity.entityType) {
//         case "tag":         {deserializer = Tag.deserialize; break;}
//         case "status":      {deserializer = Status.deserialize; break;}
//         case "hero-theme":  {deserializer = HeroTheme.deserialize; break;}
//         case "story-theme": {deserializer = StoryTheme.deserialize; break;}
//     }
//     if (deserializer == undefined) throw Error(`Cannot deserialize ${entity.entityType}`);
//     const deserialized = deserializer(entity);
//     return deserialized;
// }
