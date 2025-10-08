interface AdvancementProps {
  abandon: number;
  improve: number;
  milestone: number;
  maxAdvancement: number;
  onUpdate: (stat: string, value: number) => void;
}

export default function Advancement({
  abandon,
  improve,
  milestone,
  maxAdvancement,
  onUpdate,
}: AdvancementProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "auto",
      }}
    >
      {["abandon", "improve", "milestone"].map((stat) => (
        <div
          key={stat}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{stat.toUpperCase()}</span>
          <div>
            {[...Array(maxAdvancement).keys()].map((n) => (
              <input
                key={n}
                type="checkbox"
                onChange={() => {
                  const currentValue =
                    stat === "abandon"
                      ? abandon
                      : stat === "improve"
                        ? improve
                        : milestone;
                  const newValue = n < currentValue ? n : n + 1;
                  onUpdate(stat, newValue);
                }}
                checked={
                  n <
                  (stat === "abandon"
                    ? abandon
                    : stat === "improve"
                      ? improve
                      : milestone)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
