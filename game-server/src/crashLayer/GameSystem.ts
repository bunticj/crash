import { GameStateType } from "../businessLayer/enum/GameStateType";
import EnvConfigVars from "../businessLayer/utils/EnvConfigVars";
import { CrashGame } from "../businessLayer/model/CrashGame"
import SchedulerService from "../businessLayer/services/SchedulerService";
import { SchedulerType } from "../businessLayer/enum/SchedulerType";
import { Constants } from "../businessLayer/utils/Constants";
import { LOGGER } from "../businessLayer/utils/Logger";
import { gameService } from "../businessLayer/services/GameService";
import { CrashManager } from "./CrashManager";
import { BetSystem } from "./BetSystem";
export class GameSystem {
    public static initNewGame() {
        gameService.reinitializeData();
        const roundId = `${EnvConfigVars.GAME_SERVER_PORT}_${Date.now()}`; // A bit 'Hacky' unique id generator :)  
        LOGGER.log(`Initializing round ${roundId}...`);
        const activeGame = new CrashGame(roundId);
        gameService.setCurrentInstance(activeGame);
        this.acceptingBetsState(activeGame);
    }

    public static acceptingBetsState(activeGame: CrashGame) {
        activeGame.enabledActions = true;
        activeGame.gameState = GameStateType.AcceptingBets;
        activeGame.timestamps.started = Date.now();
        const roundId = activeGame.roundData.roundId;
        LOGGER.log(`Accepting bets!`);
        gameService.setCurrentInstance(activeGame);
        SchedulerService.executeScheduler(SchedulerType.AcceptingBets, roundId);
        CrashManager.sendHttpBasedOnGameState(activeGame);
    }

    public static prepareGameState() {
        const activeGame = gameService.getCurrentInstance()!;
        activeGame.enabledActions = false;
        LOGGER.log(`Preparing for flying state...`);
        activeGame.gameState = GameStateType.Preparing;
        gameService.setCurrentInstance(activeGame);
        SchedulerService.executeScheduler(SchedulerType.Preparing, activeGame.roundData.roundId);
    }

    public static flyingGameState() {
        const activeGame = gameService.getCurrentInstance()!;
        activeGame.enabledActions = true;
        activeGame.gameState = GameStateType.Flying;
        gameService.setCurrentInstance(activeGame);
        LOGGER.log(`Flying state started!`);
        this.handleMultipliers(activeGame);
    }

    public static crashGameState(activeGame: CrashGame, currentMultiplier: number) {
        activeGame.enabledActions = false;
        activeGame.gameState = GameStateType.Crash;
        activeGame.timestamps.finished = Date.now();
        activeGame.roundData.durationMs = activeGame.timestamps.finished - activeGame.timestamps.started;
        LOGGER.log(`Game Crashed on ${currentMultiplier}, after ${activeGame.roundData.durationMs * 0.001} seconds`);
        activeGame.roundData.crashedOn = currentMultiplier;
        activeGame.roundData.winners = gameService.getWinners();
        gameService.setCurrentInstance(activeGame);
        CrashManager.sendHttpBasedOnGameState(activeGame);
        SchedulerService.executeScheduler(SchedulerType.Crash, activeGame.roundData.roundId);
    }

    // crash game logic
    private static handleMultipliers(activeGame: CrashGame) {
        let durationInMs = 0;
        const maxMultiplier = this.getMaxMultiplier();

        const intervalId = setInterval(() => {
            const durationInSeconds = durationInMs * 0.001;
            const currentMultiplier = this.getCurrentMultiplier(durationInSeconds);
            if (currentMultiplier >= maxMultiplier) {
                activeGame.enabledActions = false;
                gameService.setCurrentInstance(activeGame);
                const parsedMultiplier = parseFloat(currentMultiplier.toFixed(3));
                clearInterval(intervalId);
                this.crashGameState(activeGame, parsedMultiplier);
            } else {
                const parsedMultiplier = parseFloat(currentMultiplier.toFixed(3));
                activeGame.roundData.multipliers.push(parsedMultiplier);
                gameService.setCurrentInstance(activeGame);
                BetSystem.autoCashOutSystem(parsedMultiplier)
                    .catch(error => LOGGER.error(error));
                durationInMs += Constants.INTERVAL_TIMER;
                LOGGER.debug(`Current  ${parsedMultiplier}, duration in seconds ${durationInSeconds}`);
            }
        }, Constants.INTERVAL_TIMER);
    }

    private static getMaxMultiplier(): number {
        return Math.floor(Math.random() * 1_000) / 100 + 1;
    }

    private static getCurrentMultiplier(gameDurationInSeconds: number): number {
        return 1 + 0.05 * gameDurationInSeconds + 0.005 * Math.pow(gameDurationInSeconds, 2) + 0.00000000001 * Math.pow(gameDurationInSeconds, 7.2);
    }


}


