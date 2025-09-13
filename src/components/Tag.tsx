import { TAG_CHAR_WIDTH_MULTIPLIER } from "../constants"
import { Tag as LitmTag } from "../litm/tag"

export default function Tag({ tag }: Props) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#fff9a6",
            border: "1px solid #e6c200",
            borderRadius: "4px",
            width: `${tag.name.length*TAG_CHAR_WIDTH_MULTIPLIER}px`,
            height: "30px",
            color: "#333",
            alignContent: "center",
        }}>
        <span style={{textAlign: "center"}}>{tag.name}</span>
        </div>
    )
}

type Props = {
    tag: LitmTag
}