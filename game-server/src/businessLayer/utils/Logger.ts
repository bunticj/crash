import EnvConfigVars from "./EnvConfigVars";
class Logger {
    private verbose: number;
    constructor(verbose: number) {
        this.verbose = verbose;
    }

    public error(error: string): void {
        console.error(new Date().toISOString() + " [ERROR]: " + error);
    }

    public debug(message: string): void {
        if (!this.verbose) return;
        console.debug(new Date().toISOString() + " [DEBUG]: " + message);
    }

    public log(message: string): void {
        console.log(new Date().toISOString() + " [INFO]: " + message);
    }

    public critical(error: string): void {
        console.error(new Date().toISOString() + " [CRITICAL]: " + error);
    }
}

export const LOGGER = new Logger(EnvConfigVars.VERBOSE_LOGS);
