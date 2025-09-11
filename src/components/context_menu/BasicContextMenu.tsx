import type { Entity } from "@/litm/entity";
import { FireIcon, MinusCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/16/solid";

type Props = {
    entity: Entity;
    removeEntity: (entity: Entity) => void;
}

export default function BasicContextMenu({entity, removeEntity}: Props) {
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
            <TrashIcon style={{ width: "24px", height: "24px"}} onClick={() => removeEntity(entity)}/>
        </div>
    )
}