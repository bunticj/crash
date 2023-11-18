import { Socket } from "socket.io";
import { ErrorType } from "../enum/ErrorType";
export interface IAuthSocket extends Socket {
    userId?: number;
    username?: string;
    shouldSkipClearData?: boolean;
}

export interface IDictionary<T> {
    [key: string | number]: T;
}

export interface ITimestamps {
    started: number;
    finished: number;
}

export interface IErrorResponse {
    errorType: ErrorType;
    name: string;
} 
export interface IBetPlacedEvent {
    betAmount: number;
    autoCashMultiplier?: number;
}

export interface IAutoCashOutUser {
    userId:number;
    autoMultiplier:number;
}

