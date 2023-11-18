import { BetSystem } from "../../crashLayer/BetSystem";
import { ErrorType } from "../enum/ErrorType";
import { GameStateType } from "../enum/GameStateType";
import { IAutoCashOutUser, IBetPlacedEvent, IDictionary } from "../interface/HelperInterfaces";
import { CrashGame } from "../model/CrashGame";
import { BroadcastService } from "./BroadcastService";
import { CustomError } from "../model/CustomError";
import { Message } from "../model/Message";
import { MessageType } from "../enum/MessageType";
import { BetUserData } from "../model/BetUserData";
import { CashOutInfoData } from "../model/CashOutInfoData";
import { GameInfoData } from "../model/GameInfoData";

class GameService {
    private activeGame?: CrashGame;
    private betRound: IDictionary<BetUserData> = {};
    private betWinners: IDictionary<CashOutInfoData> = {};
    private autoCashMultipliers: IAutoCashOutUser[] = [];

    public isActionEnabled() {
        return this.activeGame && this.activeGame.enabledActions;
    }

    public reinitializeData() {
        delete this.activeGame;
        this.betRound = {};
    }

    public getCurrentInstance(): CrashGame | undefined {
        return this.activeGame;
    }
    public setCurrentInstance(crashGame: CrashGame) {
        this.activeGame = crashGame;
    }

    public getUserBetData(userId: number): BetUserData | undefined {
        return this.betRound[userId];
    }

    public getWinners() {
        const winners = Object.values(this.betWinners).map(cashOutInfo => cashOutInfo.username);
        return winners;
    }

    public getAutoCashedMultipliers(): IAutoCashOutUser[] {
        return this.autoCashMultipliers;
    }

    public setAutoCashedMultipliers(autoCashMultipliers: IAutoCashOutUser[]): void {
        this.autoCashMultipliers = autoCashMultipliers;
    }



    public getBroadcastInfo(): GameInfoData | undefined {
        if (!this.activeGame) return;
        const gameState = this.activeGame.gameState;
        let currentMultiplier = 0;
        if (gameState === GameStateType.Flying) {
            const multipliers = this.activeGame.roundData.multipliers;
            currentMultiplier = multipliers[multipliers.length - 1];
        }
        else if (gameState === GameStateType.Crash) currentMultiplier = this.activeGame.roundData.crashedOn;

        const placedBets: IDictionary<number> = {};
        Object.values(this.betRound).forEach(betData => placedBets[betData.betInfo.username] = betData.betInfo.betAmount);
        const gameInfo = new GameInfoData(gameState, currentMultiplier, placedBets);
        return gameInfo;
    }

    public async placeBet(userId: number, username: string, placedBet: IBetPlacedEvent): Promise<void> {
        if (this.activeGame?.gameState !== GameStateType.AcceptingBets) throw new CustomError(ErrorType.InvalidGameState, `Game not in state ${GameStateType[GameStateType.AcceptingBets]}!`, { currentState: this.activeGame?.gameState });
        if (this.betRound[userId]) throw new CustomError(ErrorType.SingleBetPerRound, `User ${username} already placed bet in this round`, { userId, username, placedBet });
        const betData = await BetSystem.placeBet(userId, this.activeGame!.roundData.roundId, username, placedBet);
        if (!betData) throw new CustomError(ErrorType.PlaceBetFailed, `Can't place bet on API server`, { userId, username, placedBet });
        const autoMultiplier = betData.betInfo.autoCashMultiplier;
        if (autoMultiplier) this.autoCashMultipliers.push({ autoMultiplier, userId });
        this.betRound[userId] = betData;
        const message = new Message(MessageType.BetPlaced, betData.betInfo);
        BroadcastService.sendMessageToRoom(message);
    }

    public async cashOut(userId: number, multiplierFromAutoCash?: number): Promise<void> {
        if (this.activeGame?.gameState !== GameStateType.Flying) throw new CustomError(ErrorType.InvalidGameState, `Game not in state ${GameStateType[GameStateType.Flying]}!`, { currentState: this.activeGame?.gameState });
        if (!this.betRound[userId]) throw new CustomError(ErrorType.InvalidBet, `User ${userId} didn't placed bet in this round`);
        if (this.betWinners[userId]) throw new CustomError(ErrorType.AlreadyCashedOut, `User ${userId} already cashed out this round`);
        const cashOutInfoData = await BetSystem.cashOut(userId, multiplierFromAutoCash);
        if (!cashOutInfoData) throw new CustomError(ErrorType.CashOutFailed, `Can't cash out bet on API server`, { userId, ticketId: this.betRound[userId].ticketId });
        this.betWinners[userId] = cashOutInfoData;
        const message = new Message(MessageType.CashOut, cashOutInfoData);
        BroadcastService.sendMessageToRoom(message);
    }
}
export const gameService = new GameService();

