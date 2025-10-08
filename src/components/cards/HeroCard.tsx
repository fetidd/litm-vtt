import { Hero as LitmHero } from "@/litm/hero";
import BaseCard from "./BaseCard";
import Button from "@/components/ui/Button";
import Promise from "@/components/hero_components/Promise";
import Quintessences from "@/components/hero_components/Quintessences";
import Backpack from "@/components/hero_components/Backpack";
import Notes from "@/components/hero_components/Notes";
import Relationships from "@/components/hero_components/Relationships";
import HeroName from "@/components/hero_components/HeroName";
import PlayerName from "@/components/hero_components/PlayerName";

export default function HeroCard({
  hero,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroCardProps) {
  const frontContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <HeroName
          name={hero.name}
          onUpdate={(name) => updateEntity({ ...hero, name })}
        />

        <PlayerName
          owner={hero.owner}
          onUpdate={(owner) => updateEntity({ ...hero, owner })}
        />

        <Relationships
          relationships={hero.relationships}
          updateEntity={updateEntity}
          addModifier={addModifier}
          owner={hero.owner}
          onUpdate={(relationships) => updateEntity({ ...hero, relationships })}
        />
      </div>

      <Promise
        promise={hero.promise}
        maxPromise={hero.maxPromise}
        onUpdate={(value) => updateEntity({ ...hero, promise: value })}
      />

      <Quintessences
        quintessences={(hero as any).quintessences || []}
        onUpdate={(quintessences) => updateEntity({ ...hero, quintessences })}
      />
    </div>
  );

  const backContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <Backpack
          backpack={hero.backpack}
          updateEntity={updateEntity}
          addModifier={addModifier}
          owner={hero.owner}
          onUpdate={(backpack) => updateEntity({ ...hero, backpack })}
        />
      </div>

      <Notes
        notes={(hero as any).notes || []}
        onUpdate={(notes) => updateEntity({ ...hero, notes })}
      />
    </div>
  );

  return (
    <BaseCard
      title="HERO"
      headerColor="rgba(122, 79, 61, 1)"
      entityId={hero.id}
      frontContent={frontContent}
      backContent={backContent}
    />
  );
}

interface HeroCardProps {
  hero: LitmHero;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}