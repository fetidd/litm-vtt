import constants from "@/constants";
import { Tag as LitmTag } from "../../litm/tag";
import Tag from "@/components/game_entities/Tag";
import BaseCard from "./BaseCard";
import Button from "@/components/ui/Button";
import Advancement from "@/components/hero_components/Advancement";
import TagArea from "@/components/hero_components/TagArea";
import SpecialImprovements from "@/components/hero_components/SpecialImprovements";
import Quest from "@/components/hero_components/Quest";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { useState } from "react";
import { createPortal } from "react-dom";

interface ThemeCardProps {
  theme: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
  title?: string;
  headerColor?: string;
  style?: React.CSSProperties;
}

export default function ThemeCard({
  theme,
  updateEntity,
  removeEntity,
  addModifier,
  title,
  headerColor,
  style = {},
}: ThemeCardProps) {
  const [editingTag, setEditingTag] = useState<{ tag: any; position: { x: number; y: number } } | null>(null);
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
            updateEntity={updateEntity}
            isTheme={true}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) => setEditingTag({ tag: themeAsTag, position })}
          />
        </div>
        <TagArea
          otherTags={theme.otherTags}
          weaknessTags={theme.weaknessTags}
          updateEntity={updateEntity}
          addModifier={addModifier}
          owner={theme.owner}
          onUpdate={(otherTags, weaknessTags) => updateEntity({ ...theme, otherTags, weaknessTags })}
        />
      </div>
      <Quest
        quest={theme.quest}
        onUpdate={(quest) => updateEntity({ ...theme, quest })}
      />
      <Advancement
        abandon={theme.abandon}
        improve={theme.improve}
        milestone={theme.milestone}
        maxAdvancement={theme.maxAdvancement}
        onUpdate={(stat, value) => updateEntity({ ...theme, [stat]: value })}
      />
    </div>
  );

  const backContent = (
    <SpecialImprovements
      specialImprovements={theme.specialImprovements}
      onUpdate={(specialImprovements) => updateEntity({ ...theme, specialImprovements })}
    />
  );

  return (
    <>
      <BaseCard
        title={getTitle()}
        headerColor={getHeaderColor()}
        entityId={theme.id}
        frontContent={frontContent}
        backContent={backContent}
        style={style}
      />
      {editingTag && createPortal(
        <TagEditDialog
          tag={editingTag.tag}
          position={editingTag.position}
          onSave={(name, isPublic) => {
            updateEntity(editingTag.tag.id, (tag: any) => {
              tag.name = name;
              return tag;
            });
            setEditingTag(null);
          }}
          onCancel={() => setEditingTag(null)}
          isOwner={true}
        />,
        document.body,
      )}
    </>
  );
}