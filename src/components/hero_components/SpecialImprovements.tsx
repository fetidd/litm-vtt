
interface SpecialImprovementsProps {
  specialImprovements: string[];
  onUpdate: (specialImprovements: string[]) => void;
}

export default function SpecialImprovements({
  specialImprovements,
  onUpdate,
}: SpecialImprovementsProps) {
  return (
    <>
      <h3
        style={{
          margin: "1px -12px",
          padding: "4px 12px",
          backgroundColor: "rgba(204, 165, 126, 0.43)",
          textAlign: "center",
        }}
      >
        Special Improvements
      </h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {specialImprovements.map((imp: string, n: number) => {
          const [name, description] = imp.split(": ");
          return (
            <span key={n} style={{ padding: "4px" }} title={description}>
              {name}
            </span>
          );
        })}
      </div>
    </>
  );
}
