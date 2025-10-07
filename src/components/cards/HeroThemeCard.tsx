import { HeroTheme as LitmTheme } from "../../litm/theme";
import ThemeCard from "./ThemeCard";

export default function HeroThemeCard({
  theme,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroThemeCardProps) {
  return (
    <ThemeCard
      theme={theme}
      editing={editing}
      setEditing={setEditing}
      updateEntity={updateEntity}
      removeEntity={removeEntity}
      addModifier={addModifier}
    />
  );
}

interface HeroThemeCardProps {
  theme: LitmTheme;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}