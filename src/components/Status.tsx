import { Entity } from "@/litm/entity";
import constant, { iconStyle } from "../constants";
import { Status as LitmStatus } from "../litm/status";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Item, Menu, useContextMenu, type TriggerEvent } from "react-contexify";
import { createPortal } from "react-dom";
import {
  ArrowDownIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function Status({
  status,
  editing,
  setEditing,
  updateEntity,
  addModifier,
  removeEntity,
}: Props) {
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
    cursor: "pointer",
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
  if (editing) {
    text = (
      <input
        style={{
          background: "transparent",
          textAlign: "center",
          border: "none",
          color: "black",
          width: "fit",
        }}
        autoFocus
        onChange={(e) => setStatusText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            performUpdate();
          }
        }}
        value={statusText}
      />
    );
  }

  return (
    <>
      <div style={style} onContextMenu={displayContextMenu}>
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

          <Item
            closeOnClick={false}
            onClick={() => {
              updateEntity(status.id, (e) => {
                status.decreaseTier(status.value > 1 ? 1 : 0);
                return e;
              });
            }}
          >
            {<ArrowDownIcon style={iconStyle} />}Decrease tier
          </Item>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => {
              return (
                <Item
                  style={{
                    border: status.hasTier(n)
                      ? `4px solid ${constant.STATUS_COLOR}`
                      : "4px solid transparent",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    updateEntity(status.id, (e) => {
                      status.addTier(n);
                      return e;
                    });
                  }}
                >
                  {n}
                </Item>
              );
            })}
          </div>

          <Item onClick={() => setEditing(status.id)}>
            {<PencilIcon style={iconStyle} />}Edit
          </Item>
          <Item onClick={() => removeEntity(status)}>
            {<TrashIcon style={iconStyle} />}Remove
          </Item>
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
};
