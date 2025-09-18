import { useState } from "react";
import constant from "../constants"
import { Tag as LitmTag } from "../litm/tag"
import type { Entity } from "@/litm/entity";

export default function Tag({ tag, editing, setEditing, updateEntity }: TagProps) {
    console.log("tag render")
    const [tagText, setTagText] = useState(tag.name);

    const style: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: constant.TAG_COLOR,
        border: "1px solid #e6c200",
        borderRadius: "4px",
        width: `${tag.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER}px`,
        minWidth: "80px",
        height: "30px",
        color: `${tag.isScratched ? "#25252560" : "#333"}`, // TODO add scratched color to constant?
        alignContent: "center",
    }
    let text = <span style={{ textAlign: "center" }}>{tag.name}</span>;
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
                onChange={e => setTagText(e.target.value)}
                onKeyDown={e => {if (e.key == "Enter") {
                    setEditing(undefined);
                    updateEntity(tag.id, tag => {
                        tag.name = tagText;
                        return tag;
                    })
                }}}
                value={tagText}
            />
        )
    }

    return (
        <div style={style}>
            {text}
        </div>
    )
}

export type TagProps = {
    tag: LitmTag,
    editing: boolean,
    setEditing: (id: string | undefined) => void,
    updateEntity: (id: string, updater: (ent: Entity) => Entity) => void
}