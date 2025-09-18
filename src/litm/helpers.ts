import type { Entity } from "./entity";
import { Status } from "./status";
import { Tag } from "./tag";
import { HeroTheme, StoryTheme } from "./theme";

export function deserializeRawEntity(entity: any): Tag | StoryTheme | HeroTheme | Status {
    let deserializer: undefined | ((e: Entity) => any) = undefined;
    switch (entity.entityType) {
        case "tag":         {deserializer = Tag.deserialize; break;}
        case "status":      {deserializer = Status.deserialize; break;}
        case "hero-theme":  {deserializer = HeroTheme.deserialize; break;}
        case "story-theme": {deserializer = StoryTheme.deserialize; break;}
    }
    if (deserializer == undefined) throw Error(`Cannot deserialize ${entity.entityType}`);
    const deserialized = deserializer(entity);
    return deserialized;
}
