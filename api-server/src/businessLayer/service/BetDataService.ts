import { CustomError } from "../model/CustomError";
import { BetDataRepository } from "../../dataAccessLayer/repository/BetDataRepository";
import { BetData, PaginatedBetData } from "../model/BetData";
import { userService } from "./UserService";

class BetDataService {
    private betDataRepository: BetDataRepository;
    constructor() {
        this.betDataRepository = new BetDataRepository();
    }

    // get limited number bets
    public async getBetsByUserId(userId: number, page: number, size: number): Promise<PaginatedBetData> {
        const bets = await this.betDataRepository.getByNumberId(userId, page, size);
        return bets;
    }

    // create new bet and reduce user balance by betAmount
    public async createBet(userId: number, roundId: string, betAmount: number): Promise<number> {
        const betData = new BetData(userId, roundId, betAmount)
        const result = await this.betDataRepository.create(betData);
        if (result.error) throw result.error as CustomError;
        const ticketId = parseInt(result.insertId);
        const amountToReduceBalance = betAmount * -1;
        await userService.updateUserBalance(userId, amountToReduceBalance);
        return ticketId;
    }

    // update ticket with betWinAmount and increase user balance and win count
    public async cashOut(userId: number, ticketId: number, betWinAmount: number) {
        const result = await this.betDataRepository.update(ticketId, betWinAmount);
        if (result.error) throw result.error as CustomError;
        await userService.updateUserBalance(userId, betWinAmount);
    }
}

export const betDataService = new BetDataService();