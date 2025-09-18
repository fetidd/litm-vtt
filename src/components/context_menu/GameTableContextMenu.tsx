import { ClockIcon, TagIcon } from "@heroicons/react/16/solid";

type Props = {
    createNewGameBoardTag: (e: React.MouseEvent) => void,
    createNewGameBoardStatus: (e: React.MouseEvent) => void,
}

export default function GameTableContextMenu({createNewGameBoardTag, createNewGameBoardStatus}: Props) {

    

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            gap: "8px", 
            padding: "8px",
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "100 50px 80px rgba(0, 0, 0, 1)",
            color: "#333",
        }}>
            <TagIcon 
                style={{ width: "24px", height: "24px"}} 
                onClick={e => {createNewGameBoardTag(e)}}
            />
            <ClockIcon 
                style={{ width: "24px", height: "24px"}} 
                onClick={e => {createNewGameBoardStatus(e)}}
            />
        </div>
    )
}