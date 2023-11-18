import { UserRepository } from "../../dataAccessLayer/repository/UserRepository";
import { CustomError } from "../model/CustomError";
import { UserData } from "../model/UserData";
import { ErrorType } from "../enum/ErrorType";

class UserService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getByUsername(username: string, shouldHidePassword = true): Promise<UserData | undefined> {
        const userData = await this.userRepository.getByStringId(username);
        if (userData && shouldHidePassword) delete userData.password;
        return userData;
    }

    public async getByUserId(userId: number, shouldHidePassword = true): Promise<UserData | undefined> {
        const userData = await this.userRepository.getByNumberId(userId);
        if (userData && shouldHidePassword) delete userData.password;
        return userData;
    }

    public async createUser(username: string, password: string): Promise<UserData> {
        const user = new UserData(username, password);
        const result = await this.userRepository.create(user);
        if (result.error) throw result.error as CustomError;
        const userData = await this.getByUsername(username);
        if (!userData) throw new CustomError(ErrorType.InvalidUser);
        return userData;
    }

    // balance should be updated on 'placeBet' and 'cashOut'. 
    public async updateUserBalance(userId: number, transactionAmount: number) {
        const result = await this.userRepository.update(userId, transactionAmount);
        if (result.error) throw result.error as CustomError;
    }
}

// TODO later, implement DI  to instantiate all service classes at once
export const userService = new UserService();