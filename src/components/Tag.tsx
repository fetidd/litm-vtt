import constant from "../constants"
import { Tag as LitmTag } from "../litm/tag"

export default function Tag({ tag }: TagProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: constant.TAG_COLOR,
            border: "1px solid #e6c200",
            borderRadius: "4px",
            width: `${tag.name.length/2}rem`,
            height: "30px",
            color: `${tag.isScratched ? "#25252560" : "#333"}`, // TODO add scratched color to constant?
            alignContent: "center",
        }}>
        <span style={{textAlign: "center"}}>{tag.name}</span>
        </div>
    )
}

export type TagProps = {
    tag: LitmTag
}