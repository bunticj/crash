import SchedulerService from "../businessLayer/services/SchedulerService";
import { SchedulerType } from "../businessLayer/enum/SchedulerType";
import { IAuthSocket, IBetPlacedEvent } from "../businessLayer/interface/HelperInterfaces";
import { Constants } from "../businessLayer/utils/Constants";
import { LOGGER } from "../businessLayer/utils/Logger";
import { socketManager } from "./SocketManager";
import { errorHandler } from "../businessLayer/utils/ErrorHandler";
import { BroadcastService } from "../businessLayer/services/BroadcastService";
import { gameService } from "../businessLayer/services/GameService";
import { CustomError } from "../businessLayer/model/CustomError";
import { ErrorType } from "../businessLayer/enum/ErrorType";

export default class SocketHandler {
    public socket: IAuthSocket;
    public isSubscribed: boolean;
    constructor(socket: IAuthSocket, isSubscribed = false, oldSocket?: IAuthSocket) {
        this.socket = socket;
        this.isSubscribed = isSubscribed;
        this.initializeSocketHandlers(oldSocket);
    }

    // attach listeners
    private initializeSocketHandlers(oldSocket?: IAuthSocket) {
        this.connectionHandler(oldSocket);
        this.disconnectHandler();
        this.subscribeHandler();
        this.unsubscribeHandler();
        this.placeBetHandler();
        this.cashOutHandler();
    }

    private connectionHandler(oldSocket?: IAuthSocket) {
        // handle multiple logins, disconnect the previous socket, subscribe if it was subscribed before
        if (oldSocket) {
            oldSocket.shouldSkipClearData = true;
            oldSocket.disconnect()
        }
        if (this.isSubscribed) this.socket.join(Constants.roomName);
    }

    private disconnectHandler() {
        this.socket.on(Constants.disconnectName, (reason) => {
            const userId = this.socket.userId!;
            const username = this.socket.username!;
            LOGGER.debug(`Socket Disconnect called for ${username}, on socket ${this.socket.id} because ${reason}`);

            // if the connection unexpectedly fails(internet issue, or something, wait for the possible
            // reconnect for 45 seconds. If it doesn't reconnect until then, trigger remove user
            if (Constants.skipDisconnectReasonsArray.includes(reason)) SchedulerService.executeScheduler(SchedulerType.DisconnectPlayer, userId);
            else if (!this.socket.shouldSkipClearData) socketManager.removeSocket(userId);
        });
    }

    private subscribeHandler() {
        this.socket.on(Constants.subscribeName, () => {
            try {
                const userId = this.socket.userId!;
                this.socket.join(Constants.roomName);
                this.isSubscribed = true;
                LOGGER.debug(`User ${userId} subscribed!`);
            }
            catch (err) {
                const error = errorHandler(err);
                BroadcastService.sendErrorMessageToUser(this.socket.id, error);
            }
        });
    }

    private unsubscribeHandler() {
        this.socket.on(Constants.unsubscribeName, () => {
            try {
                const userId = this.socket.userId!;
                this.isSubscribed = false;
                this.socket.leave(Constants.roomName);
                LOGGER.debug(`User ${userId} unsubscribed!`);
            }
            catch (err) {
                const error = errorHandler(err);
                BroadcastService.sendErrorMessageToUser(this.socket.id, error);
            }
        });
    }

    private placeBetHandler() {
        this.socket.on(Constants.placeBetName, async (data: IBetPlacedEvent) => {
            try {
                const userId = this.socket.userId!;
                const username = this.socket.username!;
                if (!this.isSubscribed) throw new CustomError(ErrorType.UserNotSubscribed, "User not subscribed", { userId, socketId: this.socket.id });
                if (!data.betAmount || typeof data.betAmount !== "number" || data.betAmount < 1) throw new CustomError(ErrorType.InvalidEventData, "Invalid betAmount", { betAmount: data.betAmount });
                if (data.autoCashMultiplier && (typeof data.autoCashMultiplier !== "number" || data.autoCashMultiplier < 1)) throw new CustomError(ErrorType.InvalidEventData, "Invalid autoCashMultiplier", { autoCashMultiplier: data.autoCashMultiplier });
                if (!gameService.isActionEnabled()) throw new CustomError(ErrorType.UserActionDisabled, "Can't place bets while action is disabled");
                await gameService.placeBet(userId, username, data);
                LOGGER.log(`User ${userId} placed bet`);
            }
            catch (err) {
                const error = errorHandler(err);
                BroadcastService.sendErrorMessageToUser(this.socket.id, error);
            }
        });
    }

    private cashOutHandler() {
        this.socket.on(Constants.cashOutName, async () => {
            try {
                const userId = this.socket.userId!;
                if (!this.isSubscribed) throw new CustomError(ErrorType.UserNotSubscribed, "User not subscribed", { userId, socketId: this.socket.id });
                if (!gameService.isActionEnabled()) throw new CustomError(ErrorType.UserActionDisabled, "Can't place bets while action is disabled")
                await gameService.cashOut(userId, undefined);
                LOGGER.log(`User ${userId} cashed out`);
            }
            catch (err) {
                const error = errorHandler(err);
                BroadcastService.sendErrorMessageToUser(this.socket.id, error);
            }
        });
    }

}

