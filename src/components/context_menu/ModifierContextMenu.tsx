import type Entity from "@/litm/entity";
import { FireIcon, MinusCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/16/solid";

type Props = {
    entity: Entity;
}

export default function ModifierContextMenu({entity}: Props) {
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
            <PlusCircleIcon style={{ width: "24px", height: "24px"}}/>
            <MinusCircleIcon style={{ width: "24px", height: "24px"}}/>
            <FireIcon style={{ width: "24px", height: "24px"}}/>
            <TrashIcon style={{ width: "24px", height: "24px"}}/>
        </div>
    )
}