import { Entity } from "../litm/entity";

export abstract class Message {
    abstract type: string;
}





export abstract class ClientMessage extends Message { }

export class UpdateClientGameTableEntityPosition extends ClientMessage {
    type = 'updateGameTableEntityPosition';
    constructor(public id: string, public x: number, public y: number) {
        super();
    }
}

export class CreateNewGameTableEntity extends ClientMessage {
    type = 'createNewGameTableEntity';
    constructor(public entity: Entity, public x: number, public y: number) {
        super();
    }
}

export class UpdateClientGameTableEntityDetails extends ClientMessage {
    type = 'updateGameTableDetails';
    constructor(public entity: Entity) {
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

export class UpdateGameTableEntityPosition extends ServerMessage {
    type = 'updateGameTableEntityPosition';
    constructor(public id: string, public x: number, public y: number) {
        super();
    }
}


export class UpdateGameTableEntityDetails extends ServerMessage {
    type = 'updateGameTableDetails';
    constructor(public entity: Entity) {
        super();
    }
}



export class RollResponse extends ServerMessage {
    type = 'rollResponse';
    constructor(public id: string, public message: string) {
        super();
    }
}