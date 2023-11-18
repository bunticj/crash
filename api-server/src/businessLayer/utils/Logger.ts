import EnvConfigVars from "./EnvConfigVars";
import Winston from "winston";
import ExpressWinston from 'express-winston';
import { Handler } from "express";

class Logger {
    private verbose: number;
    public winstonLogger: Handler;
    constructor(verbose: number) {
        this.verbose = verbose;
        this.winstonLogger = ExpressWinston.logger({
            transports: [new Winston.transports.Console()],
            format: Winston.format.combine(Winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS'
            }), Winston.format.json())
        });
    }

    public error(error: string): void {
        console.error(new Date().toISOString() + " [ERROR]: " + error);
    }

    public critical(error: string): void {
        console.error(new Date().toISOString() + " [CRITICAL]: " + error);
    }

    public debug(message: string): void {
        if (!this.verbose) return;
        console.debug(new Date().toISOString() + " [DEBUG]: " + message);
    }

    public log(message: string): void {
        console.log(new Date().toISOString() + " [INFO]: " + message);
    }
}

export const LOGGER = new Logger(EnvConfigVars.VERBOSE_LOGS);
