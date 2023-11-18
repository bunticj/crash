import express from 'express';
import { userController } from '../controller/UserController';
import { gameRoundController } from '../controller/GameRoundController';
import { betController } from '../controller/BetController';

export const clientRouter = express.Router();

// User routes
clientRouter.post('/register', userController.register);
clientRouter.post('/login', userController.login);
clientRouter.get('/user/:userId', userController.getById);

//Game round routes
clientRouter.get('/round/:roundId', gameRoundController.getById);

//Bet routes
clientRouter.get('/bet/user/:userId', betController.getBetsByUserId);
