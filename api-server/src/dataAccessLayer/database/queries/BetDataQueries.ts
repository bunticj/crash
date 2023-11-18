import { PaginatedBetData } from "../../../businessLayer/model/BetData";
import { DB } from "../Database";

export class BetDataQueries {
    public async createBet(userId: number, roundId: string, betAmount: number, betWinAmount: number): Promise<any> {
        const query = `INSERT into bet_data(userId, roundId, betAmount, betWinAmount) VALUES (?, ?, ?, ?); `;
        return await DB.runQuery(query, [userId, roundId, betAmount, betWinAmount]);
    }

    public async getBetsByUserId(userId: number, page: number = 1, limit = 10): Promise<any> {
        const query = `SELECT * FROM bet_data WHERE userId = ? LIMIT ? OFFSET ?;`;
        const offset = (page - 1) * limit;
        const betsData = await DB.runQuery(query, [userId, limit, offset]);
        const totalCountQuery = `SELECT COUNT(*) as total FROM bet_data WHERE userId = ?;`;
        const totalCountResult = await DB.runQuery(totalCountQuery, [userId]);
        const totalCount = parseInt(totalCountResult[0].total);
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedData: PaginatedBetData = { betsData, page, totalPages }
        return paginatedData
    }

    public async getBetsByRoundId(roundId: string, page: number = 1, limit = 10): Promise<any> {
        const offset = (page - 1) * limit;
        const query = `SELECT * FROM bet_data WHERE roundId = ? LIMIT ? OFFSET ?;`;
        const betsData = await DB.runQuery(query, [roundId, limit, offset]);
        const totalCountQuery = `SELECT COUNT(*) as total FROM bet_data WHERE roundId = ?;`;
        const totalCountResult = await DB.runQuery(totalCountQuery, [roundId]);
        const totalCount = parseInt(totalCountResult[0].total);
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedData: PaginatedBetData = { betsData, page, totalPages }
        return paginatedData
    }

    public async updateBetTicket(ticketId: number, betWinAmount: number): Promise<any> {
        const query = `UPDATE bet_data SET betWinAmount = ? WHERE ticketId = ?;`;
        return await DB.runQuery(query, [betWinAmount, ticketId]);
    }

}