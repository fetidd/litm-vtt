import { ModifierEntity } from "./entity";

export default interface Modifier {
    entity: ModifierEntity
    isBurned: boolean
    polarity: 'add' | 'subtract';
}