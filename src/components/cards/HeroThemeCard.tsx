import { HeroTheme as LitmTheme } from "../../litm/theme";
import ThemeCard from "./ThemeCard";

export default function HeroThemeCard({
  theme,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroThemeCardProps) {
  return (
    <ThemeCard
      theme={theme}
      updateEntity={updateEntity}
      removeEntity={removeEntity}
      addModifier={addModifier}
    />
  );
}

interface HeroThemeCardProps {
  theme: LitmTheme;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}