import { useContext, useState } from "react";
import constant, { iconStyle } from "../constants";
import { Tag as LitmTag } from "../litm/tag";
import { Item, Menu, useContextMenu, type TriggerEvent } from "react-contexify";
import { createPortal } from "react-dom";
import {
  FireIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  StrikethroughIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import type { Entity } from "@/litm/entity";
import { UserContext } from "@/App";
import TagInput from "./TagInput";

export default function Tag({
  tag,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
  isWeakness = false,
  isTheme = false,
  onCard = false
}: TagProps) {
  const [tagText, setTagText] = useState(tag.name);

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: !isWeakness ? constant.TAG_COLOR : "#f89f64ff",
    border: !isWeakness ? "1px solid #e6c200" : "1px solid #ee7f36ff",
    borderRadius: "4px",
    width: "fit-content",
    minWidth: isTheme ? "120px" : "80px",
    padding: "0 12px",
    height: isTheme ? "60" : "30px",
    color: `${tag.isScratched ? "#25252560" : "#333"}`, // TODO add scratched color to constant?
    alignContent: "center",
    fontSize: isTheme ? "1.2rem" : "1rem",
    fontWeight: isTheme ? "bolder" : "normal",
    fontStyle: "italic",
  };
  let tagObj = <span style={{ textAlign: "center", whiteSpace: "nowrap" }}>{tag.name}</span>;

  function performUpdate() {
    setEditing(undefined);
    updateEntity(tag.id, (tag) => {
      tag.name = tagText;
      return tag;
    });
  }

  const MENU_ID = `tag-menu-${tag.id}`;
  const { show } = useContextMenu({ id: MENU_ID });
  function displayContextMenu(e: TriggerEvent) {
    e.stopPropagation();
    show({
      event: e,
      id: MENU_ID,
      props: {
        tag: tag,
      },
    });
  }

  if (editing) {
    tagObj = (
      <TagInput
        value={tagText}
        onChange={setTagText}
        onSubmit={performUpdate}
        placeholder="tag name"
        autoFocus
      />
    );
  }
  const user = useContext(UserContext);
  const isMine = user?.username == tag.owner || user?.role == "narrator";

  return (
    <>
      <div style={style} onContextMenu={displayContextMenu}>
        {tagObj}
      </div>
      {createPortal(
        <Menu id={MENU_ID}>
          {isMine && tag.canBurn && !tag.isScratched && (
            <Item onClick={() => addModifier(tag, "add", true)}>
              {<FireIcon style={iconStyle} />}
              {`Burn tag`}
            </Item>
          )}
          {!tag.isScratched && (
            <Item onClick={() => addModifier(tag, "add", false)}>
              {<PlusIcon style={iconStyle} />}
              {`Add tag`}
            </Item>
          )}
          {!tag.isScratched && (
            <Item onClick={() => addModifier(tag, "subtract", false)}>
              {<MinusIcon style={iconStyle} />}
              {`Subtract tag`}
            </Item>
          )}
          {isMine && tag.canScratch && (
            <Item
              onClick={() =>
                updateEntity(tag.id, (e) => {
                  (e as LitmTag).isScratched = !tag.isScratched;
                  return e;
                })
              }
            >
              {<StrikethroughIcon style={iconStyle} />}{" "}
              {`${tag.isScratched ? "Uns" : "S"}cratch tag`}
            </Item>
          )}
          {isMine && (
            <>
              <Item onClick={() => setEditing(tag.id)}>
                {<PencilIcon style={iconStyle} />}Edit
              </Item>
              <Item onClick={() => removeEntity(tag)}>
                {<TrashIcon style={iconStyle} />}Remove
              </Item>
            </>
          )}
        </Menu>,
        document.body,
      )}
    </>
  );
}

export type TagProps = {
  tag: LitmTag;
  editing: boolean;
  setEditing: (id: string | undefined) => void;
  updateEntity: (id: string, updater: (ent: Entity) => Entity) => void;
  removeEntity: any;
  addModifier: any;
  isWeakness?: boolean;
  isTheme?: boolean;
  onCard?: boolean
};
