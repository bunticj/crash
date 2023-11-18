import { SchedulerType } from "../enum/SchedulerType";
import { IDictionary } from "../interface/HelperInterfaces";
import { Constants } from "../utils/Constants";
import { LOGGER } from "../utils/Logger";
import { GameSystem } from "../../crashLayer/GameSystem";
import { socketManager } from "../../socketLayer/SocketManager";
export default class SchedulerService {
    private static schedulers: IDictionary<IDictionary<NodeJS.Timeout>> = {};// { ownerId :   { schedulerType : timeout }}
    private static broadcastIntervalId?: NodeJS.Timeout;
    // cancel setTimeout
    public static cancelScheduler(schedulerType: SchedulerType, ownerId: string | number) {
        const scheduler = SchedulerService.schedulers[ownerId];
        if (scheduler && scheduler[schedulerType]) {
            clearTimeout(scheduler[schedulerType]);
            delete scheduler[schedulerType];
        }
    }
    public static setIntervalId(broadcastIntervalId: NodeJS.Timeout) {
        this.broadcastIntervalId = broadcastIntervalId;
    }

    public static cancelBroadcastInterval() {
        clearInterval(this.broadcastIntervalId);
        delete this.broadcastIntervalId;
        LOGGER.critical(`Broadcast interval cleared!!`);
    }

    // manage set time out execution
    public static executeScheduler(schedulerType: SchedulerType, ownerId: string | number) {
        this.cancelScheduler(schedulerType, ownerId);
        let schedulerCallback: () => void;
        let delayInMs = 0;
        switch (schedulerType) {
            case SchedulerType.DisconnectPlayer: {
                delayInMs = Constants.DISCONNECT_TIMER;
                schedulerCallback = () => socketManager.removeSocket(ownerId as number);
                break;
            }
            case SchedulerType.AcceptingBets: {
                delayInMs = Constants.ACCEPT_BET_DURATION;
                schedulerCallback = () => GameSystem.prepareGameState();
                break;
            }
            case SchedulerType.Preparing: {
                delayInMs = Constants.PREPARE_DURATION;
                schedulerCallback = () => GameSystem.flyingGameState();
                break;
            }
            case SchedulerType.Crash: {
                delayInMs = Constants.CRASH_DURATION;
                schedulerCallback = () => GameSystem.initNewGame();
                break;
            }
            default: {
                LOGGER.critical(`Invalid scheduler type, data = ${JSON.stringify({ schedulerType, ownerId })}`);
                return;
            }
        }
        if (!this.schedulers[ownerId]) this.schedulers[ownerId] = {};
        SchedulerService.schedulers[ownerId][schedulerType] = setTimeout(() => {
            schedulerCallback();
        }, delayInMs);

    }
}
