import express from 'express';
import { CustomError } from "../../businessLayer/model/CustomError";
import { errorHandler } from "../../businessLayer/utils/ErrorHandler";
import { ErrorType } from "../../businessLayer/enum/ErrorType";
import { betDataService } from '../../businessLayer/service/BetDataService';
import { BetValidator } from '../validator/BetValidator';

class BetController {
    public async getBetsByUserId(req: express.Request, res: express.Response) {
        try {
            const userId = +req.params.userId;
            const [page, size] = BetValidator.validateQueryIsNumber(req.query.page, req.query.size);
            if (typeof userId !== "number") throw new CustomError(ErrorType.InvalidUser, "Invalid user id");
            const paginatedBetData = await betDataService.getBetsByUserId(userId, page, size);
            res.status(200).send(paginatedBetData);
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }

    public async placeBet(req: express.Request, res: express.Response) {
        try {
            const { userId, roundId, betAmount } = req.body;
            BetValidator.validatePlaceBetBody(userId, roundId, betAmount);
            const ticketId = await betDataService.createBet(userId, roundId, betAmount);
            res.status(200).send({ ticketId });
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }

    public async cashOut(req: express.Request, res: express.Response) {
        try {
            const { userId, ticketId, betWinAmount } = req.body;
            BetValidator.validateCashOutBody(userId, ticketId, betWinAmount);
            await betDataService.cashOut(userId, ticketId, betWinAmount);
            res.status(200).send({ message: "OK" });
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }
}

export const betController = new BetController();