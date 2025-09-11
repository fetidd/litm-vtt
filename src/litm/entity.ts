export default abstract class Entity {
    id: string = Math.random().toString(36).substring(2, 15);

    abstract name: string;

    abstract announceState(): void;
}