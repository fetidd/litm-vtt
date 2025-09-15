import { Entity } from "@/litm/entity";
import constant from "../constants"
import { Status as LitmStatus } from "../litm/status"

export default function Status({ status }: Props) {
    const statusText = `${status.name} ${status.value}`;
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: constant.STATUS_COLOR,
            border: "1px solid #46a32aff",
            borderRadius: "4px",
            width: `${statusText.length*constant.TAG_CHAR_WIDTH_MULTIPLIER}px`,
            minWidth: "4rem",
            height: `${constant.STATUS_HEIGHT}px`,
            color: "#333",
            alignContent: "center",
        }}>
            <span style={{textAlign: "center"}}>{statusText}</span>
        </div>
    )
}

export type Props = {
    status: LitmStatus
}
