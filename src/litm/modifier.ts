import Entity from "./entity";

export default interface Modifier {
    entity: Entity
    value: number;
    polarity: 'add' | 'subtract';
}