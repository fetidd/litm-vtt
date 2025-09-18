import { Tag as LitmTag } from "../litm/tag";
import { Status as LitmStatus } from "../litm/status";
import { StoryTheme as LitmStoryTheme, HeroTheme as LitmHeroTheme } from "../litm/theme";
import type { EntityPositionData, StateSetter } from "../types";


export function handleClientGameTableEntitySync(
    { entities }: { entities: EntityPositionData[] }, 
    setGameTableEntities: StateSetter<EntityPositionData[]>) 
{
    entities.forEach((epd: EntityPositionData) => {
        setGameTableEntities(prev => {
            const existingEntity = prev.find(ent => ent.entity.id === epd.entity.id);
            if (existingEntity) {
                existingEntity.position.x = epd.position.x;
                existingEntity.position.y = epd.position.y;
                return [...prev.filter(e => existingEntity.entity.id != e.entity.id), { ...existingEntity, position: { x: epd.position.x, y: epd.position.y } }]
            } else {
                let ent: LitmStatus | LitmTag | LitmStoryTheme | undefined = undefined;
                switch (epd.entity.entityType) {
                    case "tag":
                        {ent = LitmTag.deserialize(epd.entity)
                        break;}
                    case "status":
                        {ent = LitmStatus.deserialize(epd.entity)
                        break;}
                    case "story-theme":
                        {ent = LitmStoryTheme.deserialize(epd.entity)
                        break;}
                    case "hero-theme":
                        {ent = LitmHeroTheme.deserialize(epd.entity)
                        break;}
                }
                if (ent == undefined) throw Error(`Received entity data that we cannot deserialize: ${JSON.stringify(epd.entity)}`)
                return [...prev, { position: { x: epd.position.x, y: epd.position.y }, entity: ent }];
            }
        });
    });
}