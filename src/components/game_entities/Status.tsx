import { Entity } from "@/litm/entity";
import constant, { iconStyle } from "@/constants";
import { Status as LitmStatus } from "@/litm/status";
import type React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Item, Menu, useContextMenu, type TriggerEvent } from "react-contexify";
import { createPortal } from "react-dom";
import {
  ArrowDownIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { UserContext } from "@/App";

export default function Status({
  status,
  editing,
  setEditing,
  updateEntity,
  addModifier,
  removeEntity,
  onShowEditDialog,
}: Props) {
  const statusRef = useRef<HTMLDivElement>(null);
  const [statusText, setStatusText] = useState(status.name);

  let style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: constant.STATUS_COLOR,
    border: "1px solid #46a32aff",
    borderRadius: "4px",
    width: `${statusText.length * constant.TAG_CHAR_WIDTH_MULTIPLIER + 10}px`,
    minWidth: " 100px",
    height: `${constant.STATUS_HEIGHT}px`,
    color: "#333",
    alignContent: "center",
    fontStyle: "italic",
  };

  function performUpdate() {
    setEditing(undefined);
    updateEntity(status.id, (status) => {
      status.name = statusText;
      return status;
    });
  }

  const MENU_ID = `status-menu-${status.id}`;
  const { show } = useContextMenu({ id: MENU_ID });
  function displayContextMenu(e: TriggerEvent) {
    e.stopPropagation();
    show({
      event: e,
      id: MENU_ID,
      props: {
        status: status,
      },
    });
  }

  let text = (
    <span style={{ textAlign: "center" }}>
      {status.name.toLowerCase()}-{status.value}
    </span>
  );

  const user = useContext(UserContext);
  const isMine = user?.username == status.owner || user?.role == "narrator";

  return (
    <>
      <div ref={statusRef} style={style} onContextMenu={displayContextMenu}>
        {text}
      </div>
      {createPortal(
        <Menu id={MENU_ID}>
          <Item onClick={() => addModifier(status, "add", false)}>
            {<PlusIcon style={iconStyle} />}
            {`Add status`}
          </Item>
          <Item onClick={() => addModifier(status, "subtract", false)}>
            {<MinusIcon style={iconStyle} />}
            {`Subtract status`}
          </Item>
          {isMine && (
            <>



              <Item onClick={() => {
                if (statusRef.current && onShowEditDialog) {
                  const rect = statusRef.current.getBoundingClientRect();
                  onShowEditDialog({ x: rect.right + 8, y: rect.top });
                }
              }}>
                {<PencilIcon style={iconStyle} />}Edit
              </Item>
              <Item onClick={() => removeEntity(status)}>
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

export type Props = {
  status: LitmStatus;
  editing: boolean;
  setEditing: (id: string | undefined) => void;
  updateEntity: (id: string, updater: (ent: Entity) => Entity) => void;
  addModifier: any;
  removeEntity: any;
  onShowEditDialog?: (position: { x: number; y: number }) => void;
};
