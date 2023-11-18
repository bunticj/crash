export class BetData {
    public roundId: string;
    public userId: number;
    public betAmount: number;
    public betWinAmount?: number;
    public ticketId?: number;
    public createdAt?: Date;
    constructor(userId: number, roundId: string, betAmount: number, betWinAmount?: number) {
        this.roundId = roundId;
        this.userId = userId;
        this.betAmount = betAmount;
        this.betWinAmount = betWinAmount;
    }
}

export type PaginatedBetData = { betsData: BetData[], page: number, totalPages: number }