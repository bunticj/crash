import { CustomError } from "../../businessLayer/model/CustomError";
import { ErrorType } from "../../businessLayer/enum/ErrorType";
export class RoundValidator {
    
    public static validateCreateRoundBody(roundId: string, started: number) {
        if (!started || typeof started !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid round start", { started });
        if (!roundId || typeof roundId !== 'string' || roundId.length > 32) throw new CustomError(ErrorType.RequestBodyError, "Invalid roundId", { roundId });
    }
    
    public static validateUpdateRoundBody(roundId: string, crashedOn: number, multipliers: number[], winners: string[], durationMs: number) {
        if (!roundId || typeof roundId !== 'string' || roundId.length > 32) throw new CustomError(ErrorType.RequestBodyError, "Invalid roundId", { roundId });
        if (!crashedOn || typeof crashedOn !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid crashedOn", { crashedOn });
        if (!multipliers || !Array.isArray(multipliers) || !multipliers.length) throw new CustomError(ErrorType.RequestBodyError, "Invalid multipliers", { multipliers });
        if (!winners || !Array.isArray(winners)) throw new CustomError(ErrorType.RequestBodyError, "Invalid winners", { winners });
        if (!durationMs || typeof durationMs !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid durationMs", { durationMs });
    }

}

