export class CashOutInfoData {
    public username: string;
    public multiplier: number;
    public betAmount: number;
    public betWinAmount: number;
    constructor(username: string, multiplier: number, betAmount: number, betWinAmount: number) {
        this.username = username;
        this.multiplier = multiplier;
        this.betAmount = betAmount
        this.betWinAmount = betWinAmount;
    }
}