import { Entity } from "../litm/entity";

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


export class RollRequest extends ClientMessage {
    type = 'rollRequest';
    constructor(public message: string) {
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


export class RollResponse extends ServerMessage {
    type = 'rollResponse';
    constructor(public id: string, public message: string) {
        super();
    }
}