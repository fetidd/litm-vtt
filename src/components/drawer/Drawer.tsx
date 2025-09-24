import { UserContext } from "@/App";
import type { Challenge } from "@/litm/challenge";
import type { Entity, ModifierEntity } from "@/litm/entity";
import { type Hero as LitmHero } from "@/litm/hero";
import { useContext, useState } from "react";
import HeroCard from "../cards/HeroCard";
import { TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import ThemeCard from "../cards/HeroThemeCard";
import { HeroTheme as LitmTheme } from "@/litm/theme";
import { Tag } from "@/litm/tag";

export default function Drawer({
    websocket,
    entities,
    viewing,
    addModifier,
}: DrawerProps) {
    const user = useContext(UserContext);
    const transformContext = useTransformContext();

    const [editing, setEditing] = useState<string | undefined>(undefined)
    function updateEntity(id: string, updater: (ent: Entity) => Entity) {}

    const hero = entities.filter(e => e.entityType == "hero")[0] as LitmHero;
    const challenges = entities.filter(e => e.entityType == "challenge");

    return (
        <div style={{
            position: "relative",
            width: "80vw",
            height: "48vh",
            border: "2px solid #68ff03ff",
            borderRadius: "4px",
            boxSizing: "border-box",
            background: "rgba(46, 43, 41, 1)",
        }}>
            <TransformComponent
                wrapperStyle={{ height: "100%", width: "100%" }}
            >
                {hero && <HeroCard hero={hero} />}
                {hero && hero.themes.map(theme => {
                    return (
                        <ThemeCard
                            key={theme.id}
                            theme={theme as LitmTheme}
                            editing={editing}
                            setEditing={setEditing}
                            updateEntity={updateEntity}
                            addModifier={addModifier}
                            removeEntity={undefined}
                        />
                    )
                })}
            </TransformComponent>
        </div>
    )
}

interface DrawerProps {
    websocket: WebSocket | null,
    entities: Entity[],
    viewing: "hero" | "challenges"
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
};