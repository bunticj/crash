import { socketServer } from "../../App";
import { MessageType } from "../enum/MessageType";
import { Message } from "../model/Message";
import { gameService } from "./GameService";
import SchedulerService from "./SchedulerService";
import { Constants } from "../utils/Constants";
import { IErrorResponse } from "../interface/HelperInterfaces";

export class BroadcastService {
    public static sendMessageToRoom<T>(message: Message<T>) {
        socketServer.io.to(Constants.roomName).emit(Constants.messageName, message);
    }

    public static sendErrorMessageToUser(socketId: string, errorData: IErrorResponse) {
        const message = new Message(MessageType.ErrorMessage, errorData);
        socketServer.io.to(socketId).emit(Constants.messageName, message);
    }

    public static initBroadcast() {
        const intervalId = setInterval(() => {
            SchedulerService.setIntervalId(intervalId)
            const info = gameService.getBroadcastInfo();
            if (!info) return;
            const message = new Message(MessageType.RoundInfo, info);
            this.sendMessageToRoom(message);
        }, Constants.INTERVAL_TIMER);
    }

}