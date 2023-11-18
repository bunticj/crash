import * as dotenv from "dotenv";
dotenv.config();
export default {
    GAME_SERVER_PORT: +(process.env.GAME_SERVER_PORT)! || 5000,
    GAME_SERVER_HOST: process.env.GAME_SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    VERBOSE_LOGS: +(process.env.VERBOSE_LOGS)! || 0,
    S2S_CUSTOM_SECRET: process.env.S2S_CUSTOM_SECRET,
    API_SERVER_BASE_URL:process.env.API_SERVER_BASE_URL  
}
