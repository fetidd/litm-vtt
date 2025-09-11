import Entity from "../litm/entity";

export abstract class Message {
    abstract type: string;
}





export abstract class ClientMessage extends Message { }

export class UpdateGameTableEntityPosition extends ClientMessage {
    type = 'updateGameTableEntityPosition';

    constructor(public id: string, public x: number, public y: number) {
        super();
    }
}





export abstract class ServerMessage extends Message { }

export class GameTableEntitySync extends ServerMessage {
    type = 'gameTableEntitySync';

    constructor(public entities: { id: string, x: number, y: number, entity: Entity }[]) {
        super();
    }
}