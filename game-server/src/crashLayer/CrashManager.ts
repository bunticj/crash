import SchedulerService from "../businessLayer/services/SchedulerService";
import { GameStateType } from "../businessLayer/enum/GameStateType";
import { SchedulerType } from "../businessLayer/enum/SchedulerType";
import { httpClient } from "../businessLayer/utils/HttpClient";
import { LOGGER } from "../businessLayer/utils/Logger";
import { GameSystem } from "./GameSystem";
import { BroadcastService } from "../businessLayer/services/BroadcastService";
import { CrashGame } from "../businessLayer/model/CrashGame";
import { Constants } from "../businessLayer/utils/Constants";
export class CrashManager {
    public static startSystems() {
        GameSystem.initNewGame();
        BroadcastService.initBroadcast();
    }

    public static sendHttpBasedOnGameState(gameInstance: CrashGame) {
        const roundId = gameInstance.roundData.roundId;
        switch (gameInstance?.gameState) {
            case GameStateType.AcceptingBets: {
                const started = gameInstance.timestamps.started;
                const fullUrl = `${Constants.roundApiPathName}/create-round`
                httpClient.sendHttpRequest(fullUrl, { roundId, started }, "post")
                    .then(() => LOGGER.log(`Round ${roundId} created`))
                    .catch(error => {
                        LOGGER.critical(`Can't create new round. RoundId = ${roundId}. Error ${error.message}`);
                        SchedulerService.cancelScheduler(SchedulerType.AcceptingBets, roundId);
                        SchedulerService.cancelBroadcastInterval();
                    });
                break;
            }
            case GameStateType.Crash: {
                const fullUrl = `${Constants.roundApiPathName}/${roundId}`;
                httpClient.sendHttpRequest(fullUrl, gameInstance.roundData, "post")
                    .then(() => LOGGER.debug(`Round ${roundId} updated`))
                    .catch(error => {
                        LOGGER.critical(`Can't update round. RoundId = ${roundId}. Error ${error.message}`);
                        SchedulerService.cancelScheduler(SchedulerType.Crash, roundId);
                        SchedulerService.cancelBroadcastInterval();
                    });
                break;
            }
            default: LOGGER.critical(`Invalid GameStateType ${gameInstance.gameState}, can't send http`);
        }
    }

}