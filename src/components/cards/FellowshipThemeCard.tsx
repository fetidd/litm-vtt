import constants, { CARD_STYLE } from "@/constants";
import { Fellowship as LitmFellowship } from "../../litm/fellowship";
import { useState } from "react";

export default function FellowshipThemeCard({
  theme,
}: FellowshipThemeCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div style={CARD_STYLE}>
      {side == "front" && (
        <>
          {/* Power Tags (first being larger)*/}
          {/* Weakness tags */}
          {/* Quest */}
          {/* Abandon (3 checkboxes)*/}
          {/* Improve (3 checkboxes)*/}
          {/* Milestone (3 checkboxes)*/}
        </>
      )}
      {side == "back" && <>{/* Special improvements */}</>}
      <span onClick={() => setSide(side == "front" ? "back" : "front")}>
        flip
      </span>
    </div>
  );
}

interface FellowshipThemeCardProps {
  theme: LitmFellowship;
}
