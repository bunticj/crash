import { UserData } from "../../businessLayer/model/UserData";
import { UserQueries } from "../database/queries/UserQueries";
import { AbstractRepository } from "./AbstractRepository";
export class UserRepository extends AbstractRepository<UserQueries, UserData> {
    protected queries: UserQueries;
    constructor() {
        super();
        this.queries = new UserQueries();
    }

    public async create(user: UserData): Promise<any> {
        return await this.queries.createUser(user.username, user.password!);
    }

    public async getByNumberId(id: number): Promise<UserData | undefined> {
        const user = await this.queries.getByUserId(id);
        if (!user) return;
        user.balance = parseFloat(user.balance.toFixed(2));
        return user;
    }

    public async getByStringId(username: string): Promise<UserData | undefined> {
        const user = await this.queries.getByUsername(username);
        if (!user) return;
        user.balance = parseFloat(user.balance.toFixed(2));
        return user;
    }

    public async update(userId: number, transactionAmount: number): Promise<any> {
        // if the transaction is positive number, we are sure it's a win(cash out)
        const winIncrementor = transactionAmount > 0 ? 1 : 0;
        return this.queries.updateUser(transactionAmount, userId, winIncrementor);
    }
}
