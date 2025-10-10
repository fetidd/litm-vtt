import { useState } from "react";
import { Hero as LitmHero } from "@/litm/hero";
import Button from "@/components/ui/Button";
import { dialogStyles } from "@/styles/dialogStyles";

interface CreateHeroFormProps {
  onCreateHero: (hero: LitmHero) => void;
  onCancel: () => void;
  username: string;
}

export default function CreateHeroForm({ onCreateHero, onCancel, username }: CreateHeroFormProps) {
  const [heroName, setHeroName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroName.trim()) {
      const newHero = LitmHero.blank();
      newHero.name = heroName.trim();
      newHero.owner = username;
      onCreateHero(newHero);
    }
  };

  return (
    <div style={{
      ...dialogStyles.dialog,
      minWidth: "300px"
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={{ margin: 0, ...dialogStyles.smallText, fontSize: "14px" }}>You don't have a hero yet. Create one to get started!</p>
        <div>
          <label style={{ display: "block", marginBottom: "4px", ...dialogStyles.smallText }}>Hero Name:</label>
          <input
            type="text"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="Enter hero name"
            style={dialogStyles.input}
            autoFocus
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="submit"
            disabled={!heroName.trim()}
            style={heroName.trim() ? dialogStyles.primaryButton : dialogStyles.disabledButton}
          >
            Create Hero
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={dialogStyles.secondaryButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}