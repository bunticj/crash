import { GameRoundData } from "../../businessLayer/model/GameRoundData";
import { RoundQueries } from "../database/queries/RoundQueries";
import { AbstractRepository } from "./AbstractRepository";

export class GameRoundRepository extends AbstractRepository<RoundQueries, GameRoundData> {
    protected queries: RoundQueries;
    constructor() {
        super();
        this.queries = new RoundQueries();
    }

    public async create(gameRound: GameRoundData): Promise<any> {
        return await this.queries.createRound(gameRound.roundId, gameRound.createdAt);
    }

    public async getByNumberId(id: number): Promise<GameRoundData | undefined> {
        // Not implemented
        return;
    }

    public async getByStringId(gameRoundId: string): Promise<GameRoundData | undefined> {
        const gameRound = await this.queries.getByRoundId(gameRoundId);
        if (!gameRound) return;
        if (gameRound.multipliers) gameRound.multipliers = JSON.parse(gameRound.multipliers as any);
        if (gameRound.winners) gameRound.winners = JSON.parse(gameRound.winners as any);
        return gameRound;
    }

    public async update(gameRound: GameRoundData): Promise<any> {
        const stringMultipliers = JSON.stringify(gameRound.multipliers);
        const stringWinners = JSON.stringify(gameRound.winners);
        return await this.queries.updateRound(gameRound.crashedOn, stringMultipliers, stringWinners, gameRound.durationMs!, gameRound.roundId);
    }

}

