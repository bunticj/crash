import * as dotenv from "dotenv";
dotenv.config();
export default {
    SERVER_PORT: +(process.env.SERVER_PORT)! || 3000,
    SERVER_HOST: process.env.SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH, // If we want to use https, add certificate path  and set protocol in .env file
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    S2S_CUSTOM_SECRET: process.env.S2S_CUSTOM_SECRET,
    VERBOSE_LOGS: +(process.env.VERBOSE_LOGS)! || 0,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: +(process.env.DB_PORT)! || 3306,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_USER_PASSWORD: process.env.DB_USER_PW,
}