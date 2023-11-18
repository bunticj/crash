import { CustomError } from "../model/CustomError";
import { ErrorType } from "../enum/ErrorType";
import { LOGGER } from "./Logger";
import { IErrorResponse } from "../interface/HelperInterfaces";

export const errorHandler = (err: any): IErrorResponse => {
    const error = err as CustomError;
    try {
        LOGGER.error(error + ", " + JSON.stringify(error));
    }
    catch {
        // If error has some data that can't be stringified
        LOGGER.error(`Could not JSON.stringify error!! Message ${error.message}, name = ${error.name}, stack = ${error.stack}, additionalData = ${error.additionalData}`);
    }
    finally {
        const errorType = error.errorType || ErrorType.GenericError;
        return { errorType, name: ErrorType[errorType] };
    }
}

