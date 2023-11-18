import express from 'express';
import { CustomError } from "../../businessLayer/model/CustomError";
import { errorHandler } from "../../businessLayer/utils/ErrorHandler";
import { ErrorType } from "../../businessLayer/enum/ErrorType";
import { gameRoundService } from "../../businessLayer/service/GameRoundService";
import { RoundValidator } from '../validator/RoundValidator';
import { GameRoundData } from '../../businessLayer/model/GameRoundData';
class GameRoundController {
    public async createRound(req: express.Request, res: express.Response) {
        try {
            const { roundId, started } = req.body;
            RoundValidator.validateCreateRoundBody(roundId, started);
            const createdAt = new Date(started);
            await gameRoundService.createNewRound(roundId, createdAt);
            res.status(200).send({ message: "Round created!" });
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }

    public async getById(req: express.Request, res: express.Response) {
        try {
            const roundId = req.params.roundId;
            if (typeof roundId !== "string") throw new CustomError(ErrorType.InvalidGameRound, "Invalid round id", { roundId });
            const round = await gameRoundService.getByRoundId(roundId);
            if (!round) throw new CustomError(ErrorType.InvalidGameRound, "Game round doesn't exist", { roundId });
            res.status(200).send(round);
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }

    public async updateRound(req: express.Request, res: express.Response) {
        try {
            const roundId = req.params.roundId;
            const { crashedOn, multipliers, winners, durationMs } = req.body as GameRoundData;
            RoundValidator.validateUpdateRoundBody(roundId, crashedOn, multipliers, winners!, durationMs!)
            if (typeof roundId !== "string") throw new CustomError(ErrorType.InvalidGameRound, "Invalid round id", { roundId });
            await gameRoundService.updateRound(req.body);
            res.status(200).send({ message: "Round updated" });
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }

}

export const gameRoundController = new GameRoundController();