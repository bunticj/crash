import express from 'express';
import * as bcrypt from 'bcrypt';
import { CustomError } from "../../businessLayer/model/CustomError";
import { errorHandler } from "../../businessLayer/utils/ErrorHandler";
import { Constants } from "../../businessLayer/utils/Constants";
import { ErrorType } from "../../businessLayer/enum/ErrorType";
import { userService } from "../../businessLayer/service/UserService";

class UserController {
    private static validateUserBody(username: string, password: string) {
        if (!username || typeof username !== 'string' || username.length > 32) throw new CustomError(ErrorType.RequestBodyError, "Invalid username", { username });
        if (!password || typeof password !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid password", { password });
    }

    public async register(req: express.Request, res: express.Response) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            UserController.validateUserBody(username, password);
            const user = await userService.getByUsername(username);
            if (user) throw new CustomError(ErrorType.UserExists, "Username already exists", { username });
            const hashedPass = await bcrypt.hash(password, Constants.bcryptSaltRounds);
            const createdUser = await userService.createUser(username, hashedPass);
            res.status(200).send(createdUser);
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(401).send(error);
        }
    }

    public async login(req: express.Request, res: express.Response) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            UserController.validateUserBody(username, password);
            const user = await userService.getByUsername(username, false);
            if (!user) throw new CustomError(ErrorType.InvalidUser, "User doesn't exist", { username })
            const isMatch = await bcrypt.compare(password, user.password!);
            if (!isMatch) throw new CustomError(ErrorType.InvalidUser, "Wrong password", { password });
            delete user.password;
            res.status(200).send(user);
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(401).send(error);
        }
    }

    public async getById(req: express.Request, res: express.Response) {
        try {
            const userId = +req.params.userId;
            if (typeof userId !== "number") throw new CustomError(ErrorType.InvalidUser, "Invalid user id");
            const user = await userService.getByUserId(userId);
            if (!user) throw new CustomError(ErrorType.InvalidUser, "User doesn't exist", { userId });
            res.status(200).send(user);
        }
        catch (err) {
            const error = errorHandler(err);
            res.status(400).send(error);
        }
    }
 

}
export const userController = new UserController();