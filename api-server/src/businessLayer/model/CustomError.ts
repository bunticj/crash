import { ErrorType } from "../enum/ErrorType";
export class CustomError extends Error {
    public errorType: ErrorType;
    public additionalData?: any;
    constructor(errorType: ErrorType, message: string = "", additionalData: any = {}) {
        super();
        this.message = message;
        this.errorType = errorType;
        this.additionalData = additionalData;
    }
}