import { BetData, PaginatedBetData } from "../../businessLayer/model/BetData";
import { BetDataQueries } from "../database/queries/BetDataQueries";
import { AbstractRepository } from "./AbstractRepository";

export class BetDataRepository extends AbstractRepository<BetDataQueries, BetData | PaginatedBetData> {
    protected queries: BetDataQueries;
    constructor() {
        super();
        this.queries = new BetDataQueries();
    }

    public async create(betData: BetData): Promise<any> {
        const betWinAmount = betData.betAmount * -1;
        return await this.queries.createBet(betData.userId, betData.roundId, betData.betAmount, betWinAmount);
    }

    public async getByNumberId(userId: number, page: number, size: number): Promise<PaginatedBetData> {
        return await this.queries.getBetsByUserId(userId, page, size);
    }

    public async getByStringId(gameRoundId: string): Promise<PaginatedBetData> {
        const result = await this.queries.getBetsByRoundId(gameRoundId);
        return result;
    }

    public async update(ticketId: number, betWinAmount: number): Promise<any> {
        return await this.queries.updateBetTicket(ticketId, betWinAmount);
    }

}

