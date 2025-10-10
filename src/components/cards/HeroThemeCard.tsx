import { HeroTheme as LitmTheme } from "@/litm/theme";
import ThemeCard from "./ThemeCard";
import type { SearchParams } from "@/types";
import type { Entity } from "@/litm/entity";

export default function HeroThemeCard({
  theme,
  updateEntity,
  removeEntity,
  addModifier,
  parentId = undefined,
}: HeroThemeCardProps) {
  return (
    <ThemeCard
      theme={theme}
      updateEntity={(
        params: SearchParams,
        updater: (ent: Entity) => Entity,
      ) => {
        updateEntity({ ...params, themeType: "hero" }, updater);
      }}
      removeEntity={removeEntity}
      addModifier={addModifier}
      parentId={parentId}
    />
  );
}

interface HeroThemeCardProps {
  theme: LitmTheme;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
  parentId?: string;
}
