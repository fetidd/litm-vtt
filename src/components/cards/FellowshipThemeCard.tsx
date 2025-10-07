import { Fellowship as LitmFellowship } from "../../litm/fellowship";
import ThemeCard from "./ThemeCard";

export default function FellowshipThemeCard({
  theme,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: FellowshipThemeCardProps) {
  return (
    <ThemeCard
      theme={theme}
      editing={editing}
      setEditing={setEditing}
      updateEntity={updateEntity}
      removeEntity={removeEntity}
      addModifier={addModifier}
      title="FELLOWSHIP"
      headerColor="rgba(97, 61, 46, 1)"
    />
  );
}

interface FellowshipThemeCardProps {
  theme: LitmFellowship;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}