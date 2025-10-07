import constants from "@/constants";
import { Tag as LitmTag } from "../../litm/tag";
import Tag from "../Tag";
import BaseCard from "./BaseCard";
import Button from "../Button";

interface ThemeCardProps {
  theme: any;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
  title?: string;
  headerColor?: string;
  style?: React.CSSProperties;
}

export default function ThemeCard({
  theme,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
  title,
  headerColor,
  style = {},
}: ThemeCardProps) {
  const themeAsTag = LitmTag.deserialize(theme);
  
  const getTitle = () => {
    if (title) return title;
    return theme.type ? theme.type.toUpperCase() : "FELLOWSHIP";
  };
  
  const getHeaderColor = () => {
    if (headerColor) return headerColor;
    if (theme.might && theme.might in constants.MIGHT_COLORS) {
      return constants.MIGHT_COLORS[theme.might as keyof typeof constants.MIGHT_COLORS];
    }
    return "rgba(97, 61, 46, 1)";
  };

  const frontContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <div style={{ marginBottom: "4px" }}>
          <Tag
            tag={themeAsTag}
            editing={editing === theme.id}
            setEditing={setEditing}
            updateEntity={updateEntity}
            isTheme={true}
            removeEntity={undefined}
            addModifier={addModifier}
          />
        </div>
        {theme.otherTags.map((tag: any) => (
          <div key={tag.id} style={{ marginBottom: "4px" }}>
            <Tag
              tag={tag}
              editing={editing === theme.id}
              setEditing={setEditing}
              updateEntity={updateEntity}
              removeEntity={undefined}
              addModifier={addModifier}
            />
          </div>
        ))}
        {editing === theme.id && (
          <Button
            onClick={() => {
              const newTag = LitmTag.blank();
              newTag.name = "New Tag";
              newTag.owner = theme.owner;
              updateEntity({ ...theme, otherTags: [...theme.otherTags, newTag] });
            }}
          >
            + Add Tag
          </Button>
        )}
        {theme.weaknessTags.map((tag: any, index: number) => (
          <div key={tag.id} style={{ marginBottom: "4px", ...(index === 0 ? { marginTop: "8px" } : {}) }}>
            <Tag
              tag={tag}
              editing={editing === theme.id}
              setEditing={setEditing}
              updateEntity={updateEntity}
              isWeakness={true}
              removeEntity={undefined}
              addModifier={addModifier}
            />
          </div>
        ))}
        {editing === theme.id && (
          <Button
            onClick={() => {
              const newTag = LitmTag.blank();
              newTag.name = "New Weakness";
              newTag.owner = theme.owner;
              updateEntity({ ...theme, weaknessTags: [...theme.weaknessTags, newTag] });
            }}
          >
            + Add Weakness
          </Button>
        )}
      </div>
        {editing === theme.id ? (
          <textarea
            value={theme.quest}
            onChange={(e) => updateEntity({ ...theme, quest: e.target.value })}
            style={{ padding: "4px", margin: "4px", resize: "vertical", minHeight: "60px" }}
          />
        ) : (
          <div style={{ padding: "4px", margin: "4px 0px", resize: "vertical", minHeight: "60px" }}>{theme.quest}</div>
        )}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "auto" }}>
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
              {[...Array(theme.maxAdvancement).keys()].map((n) => (
                <input
                  key={n}
                  type="checkbox"
                  disabled={editing !== theme.id}
                  onChange={() => {
                    if (editing === theme.id) {
                      const newValue = n < (theme as any)[stat] ? n : n + 1;
                      updateEntity({ ...theme, [stat]: newValue });
                    }
                  }}
                  checked={n < (theme as any)[stat]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const backContent = (
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
        {theme.specialImprovements.map((imp: string, n: number) =>
          editing === theme.id ? (
            <input
              key={n}
              type="text"
              value={imp}
              onChange={(e) => {
                const newImprovements = [...theme.specialImprovements];
                newImprovements[n] = e.target.value;
                updateEntity({ ...theme, specialImprovements: newImprovements });
              }}
              style={{ padding: "4px", margin: "2px" }}
            />
          ) : (
            <span key={n} style={{ padding: "4px" }}>
              {imp}
            </span>
          )
        )}
      </div>
    </>
  );

  return (
    <BaseCard
      title={getTitle()}
      headerColor={getHeaderColor()}
      entityId={theme.id}
      editing={editing}
      setEditing={setEditing}
      frontContent={frontContent}
      backContent={backContent}
      style={style}
    />
  );
}