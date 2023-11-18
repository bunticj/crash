import express from 'express';
import { betController } from '../controller/BetController';
import { gameRoundController } from '../controller/GameRoundController';

// Server to Server router
export const s2sRouter = express.Router();

//Game round routes
s2sRouter.post('/round/create-round', gameRoundController.createRound);
s2sRouter.post('/round/:roundId', gameRoundController.updateRound);    

//Bet routes
s2sRouter.post('/bet/new-bet', betController.placeBet);
s2sRouter.post('/bet/cash-out', betController.cashOut);
