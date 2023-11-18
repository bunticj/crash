import { ErrorType } from "../../businessLayer/enum/ErrorType";
import { CustomError } from "../../businessLayer/model/CustomError";
import { errorHandler } from "../../businessLayer/utils/ErrorHandler";

export class BetValidator {

    public static validatePlaceBetBody(userId: number, roundId: string, betAmount: number) {
        if (!userId || typeof userId !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid userId", { userId });
        if (!betAmount || typeof betAmount !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid betAmount", { betAmount });
        if (!roundId || typeof roundId !== 'string' || roundId.length > 32) throw new CustomError(ErrorType.RequestBodyError, "Invalid roundId", { roundId });
    }

    public static validateCashOutBody(userId: number, ticketId: number, betWinAmount: number) {
        if (!userId || typeof userId !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid userId", { userId });
        if (!betWinAmount || typeof betWinAmount !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid betWinAmount", { betWinAmount });
        if (!ticketId || typeof ticketId !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid ticketId", { ticketId });
    }

    public static validateQueryIsNumber(page?: any, size?: any): number[] {
        let parsedPageNum = 1;
        let parsedSizeNum = 10;
        try {
            if (page && typeof page === "string") {
                const tryParse = parseInt(page);
                if (!isNaN(tryParse)) parsedPageNum = tryParse;
            }
            if (size && typeof size === "string") {
                const tryParse = parseInt(size);
                if (!isNaN(tryParse) && tryParse <= 50) parsedSizeNum = tryParse;
            }
        } catch (error) {
            errorHandler(error);
        }
        finally {
            return [parsedPageNum, parsedSizeNum];
        }

    }
}

