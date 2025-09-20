import { Tag as LitmTag } from "../litm/tag";
import { Status as LitmStatus } from "../litm/status";
import { StoryTheme as LitmStoryTheme, HeroTheme as LitmHeroTheme } from "../litm/theme";
import type { EntityPositionData, StateSetter } from "../types";
import { deserializeRawEntity } from "@/litm/helpers";


export function handleClientGameTableEntitySync(
    { entities }: { entities: EntityPositionData[] }, 
    setGameTableEntities: StateSetter<EntityPositionData[]>
) {
    setGameTableEntities(() => entities.map((data) => {return {...data, entity: deserializeRawEntity(data.entity)}}))
}