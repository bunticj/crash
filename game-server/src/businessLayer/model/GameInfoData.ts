import { GameStateType } from "../enum/GameStateType";
import { IDictionary } from "../interface/HelperInterfaces";

export class GameInfoData {
    public gameState: GameStateType;
    public currentMultiplier?: number;
    public placedBets: IDictionary<number>; // { username - betAmount }
    constructor(gameState: GameStateType, currentMultiplier?: number, placedBets: IDictionary<number> = {}) {
        this.gameState = gameState;
        this.currentMultiplier = currentMultiplier;
        this.placedBets = placedBets;
    }
}