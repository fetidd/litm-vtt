import { UserContext } from "@/App";
import type { Challenge } from "@/litm/challenge";
import type { Entity, ModifierEntity } from "@/litm/entity";
import { type Hero as LitmHero } from "@/litm/hero";
import { useContext, useState } from "react";
import HeroCard from "@/components/cards/HeroCard";
import "../../../assets/scrollbar.css";
import ThemeCard from "@/components/cards/HeroThemeCard";
import { HeroTheme as LitmTheme } from "@/litm/theme";
import { Tag } from "@/litm/tag";
import FellowshipThemeCard from "@/components/cards/FellowshipThemeCard";
import type { WebSocketManager } from "@/websocket/WebSocketManager";
import ScrollContainer from "@/components/ui/ScrollContainer";

export default function Drawer({
  websocket,
  entities,
  viewing,
  addModifier,
  onUpdateEntity,
  onCreateHero,
  loading = false,
}: DrawerProps) {
  const user = useContext(UserContext);
  const heroes = entities.filter((e) => e.entityType == "hero") as LitmHero[];
  const challenges = entities.filter((e) => e.entityType == "challenge");
  const myHero = heroes.find(h => h.owner === user?.username);
  const allHeroes = user?.role === "narrator" ? heroes : heroes.filter(h => h.owner === user?.username);
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (user?.role === "narrator") {
      return allHeroes.length > 0 ? allHeroes[0]!.owner : "challenges";
    }
    return "my-hero";
  });

  const [editing, setEditing] = useState<string | undefined>(undefined);
  
  function updateEntity(id: string, updater: (ent: Entity) => Entity) {
    const entity = entities.find(e => e.id === id);
    if (entity && (user?.role === "narrator" || entity.owner === user?.username)) {
      const updated = updater(entity);
      onUpdateEntity?.(updated);
    }
  }
  
  const getActiveHero = () => {
    if (activeTab === "challenges") return null;
    if (user?.role === "narrator") {
      return heroes.find(h => h.owner === activeTab);
    }
    return myHero;
  };
  
  const activeHero = getActiveHero();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "2px solid #68ff03ff",
        borderRadius: "4px",
        boxSizing: "border-box",
        background: "rgba(46, 43, 41, 1)",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {user?.role === "narrator" && (
        <div style={{ display: "flex", background: "rgba(30, 30, 30, 1)", borderBottom: "1px solid #555" }}>
          {allHeroes.map(hero => (
            <button
              key={hero.owner}
              onClick={() => setActiveTab(hero.owner)}
              style={{
                padding: "8px 12px",
                background: activeTab === hero.owner ? "rgba(104, 255, 3, 0.2)" : "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {hero.owner}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("challenges")}
            style={{
              padding: "8px 12px",
              background: activeTab === "challenges" ? "rgba(104, 255, 3, 0.2)" : "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Challenges
          </button>
        </div>
      )}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%", 
            color: "white" 
          }}>
            <div style={{ 
              border: "3px solid #333", 
              borderTop: "3px solid #68ff03ff", 
              borderRadius: "50%", 
              width: "40px", 
              height: "40px", 
              animation: "spin 1s linear infinite" 
            }}></div>
          </div>
        ) : (
          <ScrollContainer style={{ height: "100%" }}>
            <div style={{ padding: "8px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
            {activeTab === "challenges" ? (
              <div style={{ color: "white", padding: "20px" }}>
                <h3>Challenges</h3>
                <p>Challenge management coming soon...</p>
              </div>
            ) : activeHero ? (
              <>
                <HeroCard
                  hero={activeHero}
                  updateEntity={updateEntity}
                  addModifier={addModifier}
                  removeEntity={undefined}
                />
                {activeHero.themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme as LitmTheme}
                    updateEntity={updateEntity}
                    addModifier={addModifier}
                    removeEntity={undefined}
                  />
                ))}
                {activeHero.fellowship && (
                  <FellowshipThemeCard
                    theme={activeHero.fellowship}
                    updateEntity={updateEntity}
                    addModifier={addModifier}
                    removeEntity={undefined}
                  />
                )}
              </>
            ) : user?.role === "player" ? (
              <div style={{ 
                color: "white", 
                padding: "20px", 
                textAlign: "center", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "16px" 
              }}>
                <h3>No Hero Found</h3>
                <p>You need to create a hero to get started.</p>
                <button
                  onClick={onCreateHero}
                  style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: "#68ff03ff",
                    color: "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Click Here to Create Your Hero
                </button>
              </div>
            ) : null}
            </div>
          </ScrollContainer>
        )}
      </div>
    </div>
  );
}

interface DrawerProps {
  websocket: WebSocketManager | null;
  entities: Entity[];
  viewing: "hero" | "challenges";
  addModifier: (
    entity: ModifierEntity,
    polarity: "add" | "subtract",
    isBurned: boolean,
  ) => void;
  onUpdateEntity?: (entity: Entity) => void;
  onCreateHero?: () => void;
  loading?: boolean;
}
