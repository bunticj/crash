import express from "express";
import { CustomError } from "../businessLayer/model/CustomError";
import { ErrorType } from "../businessLayer/enum/ErrorType";
import { errorHandler } from "../businessLayer/utils/ErrorHandler";
import EnvConfigVars from "../businessLayer/utils/EnvConfigVars";
import { Constants } from "../businessLayer/utils/Constants";

// handle errors before controller   
export const errorMiddleware = (error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
        if (error instanceof Error) {
            (error as CustomError)["errorType"] = ErrorType.BadRequest;
            const errorResponse = errorHandler(error);
            res.status(400).send(errorResponse);
        }
        else next();
    } catch (error) {
        const errorResponse = errorHandler(error);
        res.status(400).send(errorResponse);
    }
}

// middleware invoked on s2sRouter, since we don't have authentication in place, this was a way to secure these routes
export const s2sMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
        if (!req.body) throw new CustomError(ErrorType.BadRequest, "All S2S requests have body!", { url: req.url });
        const s2sSecret = req.body[Constants.S2SCustomBodyKeyName];
        if (s2sSecret !== EnvConfigVars.S2S_CUSTOM_SECRET) throw new CustomError(ErrorType.BadRequest, "Invalid body secret header", { s2sSecret });
        next();
    }
    catch (error) {
        const errorResponse = errorHandler(error);
        res.status(400).send(errorResponse);
    }

}


