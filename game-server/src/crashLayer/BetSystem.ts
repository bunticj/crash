import { Constants } from "../businessLayer/utils/Constants";
import { httpClient } from "../businessLayer/utils/HttpClient";
import { LOGGER } from "../businessLayer/utils/Logger";
import { BetUserData } from "../businessLayer/model/BetUserData";
import { gameService } from "../businessLayer/services/GameService";
import { IBetPlacedEvent } from "../businessLayer/interface/HelperInterfaces";
import { CashOutInfoData } from "../businessLayer/model/CashOutInfoData";
import { errorHandler } from "../businessLayer/utils/ErrorHandler";

export class BetSystem {
    public static async placeBet(userId: number, roundId: string, username: string, betEventData: IBetPlacedEvent): Promise<BetUserData | undefined> {
        const parsedBetAmount = parseFloat(betEventData.betAmount.toFixed(2));
        let autoCashMultiplier: number | undefined;
        const fullUrl = `${Constants.betApiPathName}/new-bet`;
        const result = await httpClient.sendHttpRequest(fullUrl, { userId, roundId, betAmount: parsedBetAmount }, "post")
            .catch(error => LOGGER.error(JSON.stringify(error.response.data)));
        if (!result || !result.data.ticketId) return;
        const ticketId = result.data.ticketId;
        if (betEventData.autoCashMultiplier) autoCashMultiplier = parseFloat(betEventData.autoCashMultiplier.toFixed(3));
        const betData = new BetUserData(username, parsedBetAmount, ticketId, autoCashMultiplier);
        return betData;
    }

    public static async cashOut(userId: number, multiplierFromAutoCash?: number): Promise<CashOutInfoData | undefined> {
        const game = gameService.getCurrentInstance();
        if (!game) {
            LOGGER.critical(`Game doesn't exist: ${new Error().stack}, userId = ${userId}!`);
            return;
        }
        const userBetData = gameService.getUserBetData(userId);
        if (!userBetData) return;
        const multipliers = game?.roundData.multipliers;
        const currentMultiplier = multiplierFromAutoCash ? multiplierFromAutoCash : multipliers[multipliers!.length - 1];
        const betWinAmount = (currentMultiplier * userBetData.betInfo.betAmount);
        const parsedBetWinAmount = parseFloat(betWinAmount.toFixed(2));
        const fullUrl = `${Constants.betApiPathName}/cash-out`;
        const result = await httpClient.sendHttpRequest(fullUrl, { userId, ticketId: userBetData.ticketId, betWinAmount: parsedBetWinAmount }, "post")
            .catch(error => LOGGER.error(JSON.stringify(error.response.data)));
        if (!result) return;
        const cashOutData = new CashOutInfoData(userBetData.betInfo.username, currentMultiplier, userBetData.betInfo.betAmount, parsedBetWinAmount);
        return cashOutData;
    }

    public static async autoCashOutSystem(currentMultiplier: number) {
        let autoMultipliers = gameService.getAutoCashedMultipliers();
        const cashOutPromises: Promise<any>[] = [];
        const updatedAutoMultipliers = autoMultipliers.filter(autoData => {
            if (currentMultiplier < autoData.autoMultiplier) return autoData;
            else cashOutPromises.push(gameService.cashOut(autoData.userId, currentMultiplier));
        });
        await Promise.all(cashOutPromises)
            .catch(error => errorHandler(error));

        gameService.setAutoCashedMultipliers(updatedAutoMultipliers);
    }

}