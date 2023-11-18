import { MessageType } from "../enum/MessageType";
export class Message<T>{
    public messageType: MessageType;
    public data: T;
    constructor(messageType: MessageType, data: T) {
        this.messageType = messageType;
        this.data = data;
    }
}