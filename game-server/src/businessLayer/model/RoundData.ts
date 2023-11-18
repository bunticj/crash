export class RoundData {
    public roundId: string;
    public crashedOn: number;
    public multipliers: number[];
    public winners?: string[];
    public durationMs?: number;
    constructor(roundId: string) {
        this.roundId = roundId;
        this.crashedOn = 0;
        this.multipliers = [];
        this.winners = [];
        this.durationMs = 0;
    }
}
