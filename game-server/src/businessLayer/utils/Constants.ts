import EnvConfigVars from "./EnvConfigVars";
export class Constants {
    // scheduler duration
    public static readonly DISCONNECT_TIMER = 30000;  // ms => 30s;
    public static readonly INTERVAL_TIMER = 100; // ms => 0.1s
    public static readonly ACCEPT_BET_DURATION = 10000; // ms => 10s;
    public static readonly CRASH_DURATION = 1000;  // ms => 1s;
    public static readonly PREPARE_DURATION = 2000;  // ms => 2s;

    // configuration
    public static readonly S2SCustomBodyKeyName = "custom-s2s-key";
    public static readonly serverFullUrlName = `${EnvConfigVars.HTTP_PROTOCOL_TYPE}://${EnvConfigVars.GAME_SERVER_HOST}:${EnvConfigVars.GAME_SERVER_PORT}`;
    public static readonly roundApiPathName = `${EnvConfigVars.API_SERVER_BASE_URL}/s2s/round`;
    public static readonly betApiPathName = `${EnvConfigVars.API_SERVER_BASE_URL}/s2s/bet`;

    // socket events
    public static readonly subscribeName = "subscribe";
    public static readonly unsubscribeName = "unsubscribe";
    public static readonly placeBetName = "place_bet";
    public static readonly cashOutName = "cash_out";
    public static readonly disconnectName = "disconnect";
    public static readonly messageName = "message";
    public static readonly roomName = "crash_game_room";
    public static readonly skipDisconnectReasonsArray = ["transport close", "ping timeout"];
}

