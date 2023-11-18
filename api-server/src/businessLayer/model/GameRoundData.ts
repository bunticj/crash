export class GameRoundData {
    public roundId: string;
    public crashedOn: number;
    public multipliers: number[];
    public winners?: string[];
    public durationMs?: number; //round duration in miliseconds
    public createdAt: Date;
    constructor(roundId: string, createdAt: Date, crashedOn: number = -1, multipliers: number[] = [], winners: string[] = [], durationMs?: number) {
        this.roundId = roundId;
        this.createdAt = createdAt;
        this.crashedOn = crashedOn;
        this.multipliers = multipliers;
        this.winners = winners;
        this.durationMs = durationMs;
    }
} 
