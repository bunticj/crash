import { GameRoundData } from "../../../businessLayer/model/GameRoundData";
import { DB } from "../Database";

export class RoundQueries {
    public async createRound(roundId: string, createdAt: Date): Promise<any> {
        const query = `INSERT into game_round(roundId, createdAt) VALUES (?, ?);`;
        return await DB.runQuery(query, [roundId, createdAt]);
    }

    public async getByRoundId(roundId: string): Promise<GameRoundData | undefined> {
        const query = `SELECT * from game_round WHERE roundId = ?;`;
        const result: GameRoundData[] = await DB.runQuery(query, [roundId]);
        return result[0];
    }

    public async updateRound(crashedOn: number, multipliers: string, winners: string, durationMs: number, roundId: string): Promise<any> {
        const query = `UPDATE game_round SET crashedOn = ?,multipliers = ?, winners = ?, durationMs = ? WHERE roundId = ?;`;
        return await DB.runQuery(query, [crashedOn, multipliers, winners, durationMs, roundId]);
    }

}


