import { useState } from "react";
import { Hero as LitmHero } from "@/litm/hero";
import Button from "./Button";

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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p>You don't have a hero yet. Create one to get started!</p>
      <div>
        <label style={{ display: "block", marginBottom: "4px" }}>Hero Name:</label>
        <input
          type="text"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          placeholder="Enter hero name"
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          autoFocus
        />
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" disabled={!heroName.trim()}>
          Create Hero
        </Button>
      </div>
    </form>
  );
}