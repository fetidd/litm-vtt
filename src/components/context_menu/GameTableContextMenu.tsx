import constants from "@/constants";
import type { Status } from "@/litm/status";
import { ClockIcon, TagIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

type Props = {
    createNewGameBoardTag: (e: React.MouseEvent) => void,
    createNewGameBoardStatus: (e: React.MouseEvent, tier: number) => void,
    currentlyEditing: boolean,
    stopEditing: () => void,
}

export default function GameTableContextMenu({ createNewGameBoardTag, createNewGameBoardStatus, currentlyEditing, stopEditing }: Props) {

    const itemStyle: React.CSSProperties = {
        display: "flex",
        alignContent: "center",
        padding: "2px",
        borderRadius: "4px",
    }
    const iconStyle: React.CSSProperties = {
        width: "20px",
        height: "20px",
        marginRight: "8px"
    }


    const [hovered, setHovered] = useState("");
    function generateMenuItem(hoverId: string, onClick: (any: React.MouseEvent) => void, icon: any, text: string) {
        return (
            <div
                style={{ ...itemStyle, background: hovered == hoverId ? "rgba(243, 203, 185, 0.96)" : "transparent" }}
                onClick={onClick}
                onMouseEnter={() => setHovered(hoverId)}
                onMouseLeave={() => setHovered("")}
                key={hoverId}
            >
                {icon}
                {text}
            </div>
        )
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "100 50px 80px rgba(0, 0, 0, 1)",
            color: "#333",
            width: "300px"
        }}>
            {generateMenuItem("new_tag", e => {if (currentlyEditing) stopEditing(); createNewGameBoardTag(e)}, <TagIcon style={iconStyle} />, "New tag")}
            {/* {generateMenuItem("new_status", e => createNewGameBoardStatus(e), <ClockIcon style={iconStyle} />, "New status")} */}
            <div style={itemStyle}>
                <ClockIcon style={iconStyle} />
                New status
                {[1, 2, 3, 4, 5, 6].map(n => {
                    return (
                        <span
                            key={n}
                            style={{
                                padding: "0 5px",
                                border: `solid 4px ${hovered == `tier-${n}` ? "rgba(243, 203, 185, 0.96)" : "transparent"}`,
                                borderRadius: "4px"
                            }}
                            onClick={(ev) => {
                                if (currentlyEditing) stopEditing();
                                createNewGameBoardStatus(ev, n)
                            }}
                            onMouseEnter={() => setHovered(`tier-${n}`)}
                            onMouseLeave={() => setHovered("")}
                        >{n}</span>
                    )
                })}
            </div>
        </div>
    )
}