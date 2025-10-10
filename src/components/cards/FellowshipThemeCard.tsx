import { Fellowship as LitmFellowship } from "@/litm/fellowship";
import ThemeCard from "./ThemeCard";
import type { SearchParams } from "@/types";
import type { Entity } from "@/litm/entity";

export default function FellowshipThemeCard({
  theme,
  updateEntity,
  removeEntity,
  addModifier,
  parentId = undefined,
}: FellowshipThemeCardProps) {
  return (
    <ThemeCard
      theme={theme}
      updateEntity={(
        params: SearchParams,
        updater: (ent: Entity) => Entity,
      ) => {
        updateEntity({ ...params, themeType: "fellowship" }, updater);
      }}
      removeEntity={removeEntity}
      addModifier={addModifier}
      parentId={parentId}
      title="FELLOWSHIP"
      headerColor="rgba(97, 61, 46, 1)"
    />
  );
}

interface FellowshipThemeCardProps {
  theme: LitmFellowship;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
  parentId?: string;
}
