import { useState } from "react";

interface HeroNameProps {
  name: string;
  onUpdate: (name: string) => void;
}

export default function HeroName({
  name,
  onUpdate,
}: HeroNameProps) {
  return (
    <div style={{ fontSize: "2rem", textAlign: "center" }}>
      {name}
    </div>
  );
}