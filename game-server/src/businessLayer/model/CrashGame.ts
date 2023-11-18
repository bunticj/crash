import { GameStateType } from "../enum/GameStateType";
import { ITimestamps } from "../interface/HelperInterfaces";
import { RoundData } from "./RoundData";
export class CrashGame {
    public roundData: RoundData
    public gameState: GameStateType;
    public enabledActions: boolean;
    public timestamps: ITimestamps;
    constructor(roundId: string) {
        this.roundData = new RoundData(roundId);
        this.enabledActions = false;
        this.gameState = GameStateType.Creating;
        this.timestamps = { started: 0, finished: 0 };
    }
}