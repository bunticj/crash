
import http from "http";
import https from "https";
import cors from "cors";
import express from "express";
import fs from "fs"
import EnvConfigVars from "./businessLayer/utils/EnvConfigVars";
import { LOGGER } from "./businessLayer/utils/Logger";
import { errorMiddleware, s2sMiddleware } from "./apiLayer/Middleware";
import { clientRouter } from "./apiLayer/router/ClientRouter";
import { s2sRouter } from "./apiLayer/router/S2SRouter";

const expressApp: express.Application = express();

// Set middlewares
expressApp.use(cors({ origin: "*" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.use(LOGGER.winstonLogger);
expressApp.use('*', errorMiddleware);
expressApp.use('/api', clientRouter);
expressApp.use('/s2s', s2sMiddleware, s2sRouter);


let server: http.Server | https.Server;
// If we want to create a secure server
if (EnvConfigVars.HTTP_PROTOCOL_TYPE === 'https') {
    const key = fs.readFileSync(`${EnvConfigVars.HTTPS_KEY_PATH}`);
    const cert = fs.readFileSync(`${EnvConfigVars.HTTPS_CERT_PATH}`);
    server = https.createServer({ key, cert }, expressApp);
}
else server = http.createServer(expressApp);

server.listen(EnvConfigVars.SERVER_PORT, () => {
    LOGGER.log(`API Server available at ${EnvConfigVars.HTTP_PROTOCOL_TYPE}://${EnvConfigVars.SERVER_HOST}:${EnvConfigVars.SERVER_PORT}`);
});
