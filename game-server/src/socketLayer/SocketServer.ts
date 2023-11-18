import { Server, Socket } from 'socket.io';
import { LOGGER } from '../businessLayer/utils/Logger';
import EnvConfigVars from '../businessLayer/utils/EnvConfigVars';
import { httpClient } from '../businessLayer/utils/HttpClient';
import { IAuthSocket } from '../businessLayer/interface/HelperInterfaces';
import { UserData } from '../businessLayer/model/UserData';
import { socketManager } from './SocketManager';

export class SocketServer {
    public io: Server;
    constructor(io: Server) {
        this.io = io;
        this.setupSockets();
    }
    //validate and initialize socket handlers
    private setupSockets() {
        this.io.use(async (socket: Socket, next) => {
            if (await this.authenticateSocket(socket as IAuthSocket)) next();
            else {
                LOGGER.error(`Invalid authentication ${socket.handshake.query.userId}`);
                socket.disconnect(true);
            }
        });

        this.io.on("connection", (socket: IAuthSocket) => {
            LOGGER.debug(`User ${socket.userId} connected with socket ${socket.id}`);
            socketManager.addNewSocket(socket);
        });
    }

    // even though we won't implement full authentication, we still need info for the user
    private async authenticateSocket(socket: IAuthSocket): Promise<boolean> {
        try {
            if (!socket || !socket.handshake.query.userId) return false;
            const userId = +socket.handshake.query.userId as number;
            const fullUrl = `${EnvConfigVars.API_SERVER_BASE_URL}/api/user/${userId}`;
            const axiosResponse = await httpClient.sendHttpRequest(fullUrl, undefined, "GET");
            if (!axiosResponse.data || axiosResponse.status !== 200) return false;
            const userData = axiosResponse.data as UserData;
            socket.userId = userData.userId;
            socket.username = userData.username;
            return true;
        }
        catch (error) {
            LOGGER.error(error as any);
            return false;
        }
    }
}
