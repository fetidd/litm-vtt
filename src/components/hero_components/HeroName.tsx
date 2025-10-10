import { useState } from "react";
import { Item, ContextMenuWrapper } from "@/components/ui/ContextMenu";
import { PencilIcon } from "@heroicons/react/24/solid";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { createPortal } from "react-dom";

interface HeroNameProps {
  name: string;
  onUpdate: (name: string) => void;
}

export default function HeroName({
  name,
  onUpdate,
}: HeroNameProps) {
  const [editingName, setEditingName] = useState<{ position: { x: number; y: number } } | null>(null);
  
  return (
    <>
      <ContextMenuWrapper
        menu={
          <Item onClick={(params) => {
            const x = params?.triggerEvent?.clientX || 200;
            const y = params?.triggerEvent?.clientY || 100;
            setEditingName({ position: { x: x + 8, y } });
          }}>
            <PencilIcon style={{ width: "16px", height: "16px", marginRight: "8px" }} />
            Edit Name
          </Item>
        }
      >
        <div style={{ fontSize: "2rem", textAlign: "center", cursor: "pointer" }}>
          {name}
        </div>
      </ContextMenuWrapper>
      {editingName && createPortal(
        <TagEditDialog
          tag={{ name }}
          position={editingName.position}
          onSave={(newName, isPublic) => {
            onUpdate(newName);
            setEditingName(null);
          }}
          onCancel={() => setEditingName(null)}
          isOwner={true}
        />,
        document.body,
      )}
    </>
  );
}