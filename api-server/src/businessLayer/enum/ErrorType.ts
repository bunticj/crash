export enum ErrorType {
    //api
    InvalidUser = 1,
    RequestBodyError = 2,
    QueryError = 3,
    InvalidGameRound = 4,
    UserExists = 5,
    BadRequest = 6,
    //shared
    GenericError = 20,

    //game-server
    InvalidMethod = 30,
    UserActionDisabled = 31,
    InvalidGameState = 32,
    SingleBetPerRound = 33,
    InvalidEventData = 34,
    PlaceBetFailed = 35,
}