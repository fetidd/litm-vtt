import type { Entity, ModifierEntity } from "@/litm/entity";
import { FireIcon, MinusCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/16/solid";

type Props = {
    entity: ModifierEntity;
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
    removeEntity: (entity: Entity) => void;
}

export default function ModifierContextMenu({entity, addModifier, removeEntity}: Props) {
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
            {entity.canBurn && 
                <FireIcon 
                    style={{ width: "24px", height: "24px"}} 
                    onClick={() => addModifier(entity, 'add', true)}
                />
            }
            <PlusCircleIcon 
                style={{ width: "24px", height: "24px"}}
                onClick={() => addModifier(entity, 'add', false)}
            />
            <MinusCircleIcon 
                style={{ width: "24px", height: "24px"}}
                onClick={() => addModifier(entity, 'subtract', false)}
            />
            <TrashIcon 
                style={{ width: "24px", height: "24px"}} 
                onClick={() => removeEntity(entity)}
            />
        </div>
    )
}