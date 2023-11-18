import { GameRoundRepository } from "../../dataAccessLayer/repository/GameRoundRepository";
import { CustomError } from "../model/CustomError";
import { GameRoundData } from "../model/GameRoundData";

class GameRoundService {
    private gameRoundRepository: GameRoundRepository;
    constructor() {
        this.gameRoundRepository = new GameRoundRepository();
    }

    public async getByRoundId(roundId: string): Promise<GameRoundData | undefined> {
        const gameRound = await this.gameRoundRepository.getByStringId(roundId);
        return gameRound;
    }

    public async createNewRound(roundId: string, createdAt: Date): Promise<void> {
        const gameRound = new GameRoundData(roundId,createdAt);
        const result = await this.gameRoundRepository.create(gameRound);
        if (result.error) throw result.error as CustomError;
    }

    public async updateRound(gameRound: GameRoundData) {
       const result =  await this.gameRoundRepository.update(gameRound);
        if (result.error) throw result.error as CustomError;
    }

}

export const gameRoundService = new GameRoundService();