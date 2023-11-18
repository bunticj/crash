import SchedulerService from "../businessLayer/services/SchedulerService";
import { SchedulerType } from "../businessLayer/enum/SchedulerType";
import { IAuthSocket, IDictionary } from "../businessLayer/interface/HelperInterfaces";
import SocketHandler from "./SocketHandler";

class SocketUserManager {
    private userSockets: IDictionary<SocketHandler>; // { userId: SocketHandler }
    constructor() {
        this.userSockets = {};
    }

    // init socket handlers, and save them for reference
    public addNewSocket(socket: IAuthSocket) {
        const userId = socket.userId!;
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, userId);
        const oldSocketHandler: SocketHandler | undefined = this.userSockets[userId];
        this.userSockets[userId] = new SocketHandler(socket, oldSocketHandler?.isSubscribed, oldSocketHandler?.socket);
    }

    // remove user and clean data
    public removeSocket(userId: number) {
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, userId);
        delete this.userSockets[userId];
    }
}

export const socketManager = new SocketUserManager();