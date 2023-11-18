
import http from "http";
import https from "https";
import { Server as IoServer } from "socket.io"
import fs from "fs"
import EnvConfigVars from "./businessLayer/utils/EnvConfigVars";
import { LOGGER } from "./businessLayer/utils/Logger";
import { SocketServer } from "./socketLayer/SocketServer";
import { Constants } from "./businessLayer/utils/Constants";
import { CrashManager } from "./crashLayer/CrashManager";

let server: http.Server | https.Server;
if (EnvConfigVars.HTTP_PROTOCOL_TYPE === 'https') {
    const key = fs.readFileSync(`${EnvConfigVars.HTTPS_KEY_PATH}`);
    const cert = fs.readFileSync(`${EnvConfigVars.HTTPS_CERT_PATH}`);
    server = https.createServer({ key, cert });
}
else server = http.createServer();
const ioServer = new IoServer(server, { allowEIO3: true, cors: { origin: "*" } });
server.listen(EnvConfigVars.GAME_SERVER_PORT, () => {
    LOGGER.log(`Server available at ${Constants.serverFullUrlName}`);
});

export const socketServer = new SocketServer(ioServer);
// init first game 3 seconds after server start
setTimeout(() => CrashManager.startSystems(), 3000);

