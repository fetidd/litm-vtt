import React from "react";
import { Tag as LitmTag } from "@/litm/tag";
import EntityEditDialog from "./EntityEditDialog";

interface TagEditDialogProps {
  tag: LitmTag;
  position: { x: number; y: number };
  onSave: (name: string, isPublic: boolean) => void;
  onCancel: () => void;
  isOwner?: boolean;
}

export default function TagEditDialog({ tag, position, onSave, onCancel, isOwner = false }: TagEditDialogProps) {
  return (
    <EntityEditDialog
      position={position}
      onSave={onSave}
      onCancel={onCancel}
      initialName={tag.name}
      showPublicCheckbox={isOwner}
    />
  );
}