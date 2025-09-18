import { Entity } from "@/litm/entity";
import constant from "../constants"
import { Status as LitmStatus } from "../litm/status"
import type React from "react";
import { useState } from "react";

export default function Status({ status, editing, setEditing, updateEntity }: Props) {
    const [statusText, setStatusText] = useState(status.name);

    let style: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: constant.STATUS_COLOR,
        border: "1px solid #46a32aff",
        borderRadius: "4px",
        width: `${(statusText.length * constant.TAG_CHAR_WIDTH_MULTIPLIER) + 10}px`,
        minWidth: " 100px",
        height: `${constant.STATUS_HEIGHT}px`,
        color: "#333",
        alignContent: "center",
    };

    let text = <span style={{ textAlign: "center" }}>{statusText.toLowerCase()}-{status.value}</span>
    if (editing) {
        text = (
            <input
                style={{
                    background: "transparent",
                    textAlign: "center",
                    border: "none",
                    color: "black",
                    width: "fit"
                }}
                onChange={e => setStatusText(e.target.value)}
                onKeyDown={e => {
                    if (e.key == "Enter") {
                        setEditing(undefined);
                        updateEntity(status.id, tag => {
                            tag.name = statusText;
                            return tag;
                        })
                    }
                }}
                value={statusText}
            />
        )
    }
    return (
        <div style={style}>
            {text}
        </div>
    )
}

export type Props = {
    status: LitmStatus,
    editing: boolean,
    setEditing: (id: string | undefined) => void,
    updateEntity: (id: string, updater: (ent: Entity) => Entity) => void
}
