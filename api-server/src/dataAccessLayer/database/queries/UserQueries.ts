import { UserData } from "../../../businessLayer/model/UserData";
import { DB } from "../Database";

export class UserQueries {
    public async createUser(username: string, password: string): Promise<any> {
        const query = `INSERT into user(username, password) VALUES (?, ?);`;
        return await DB.runQuery(query, [username, password]);
    }

    public async getByUsername(username: string): Promise<UserData | undefined> {
        const query = `SELECT * from user WHERE username = ?;`;
        const result: UserData[] = await DB.runQuery(query, [username]);
        return result[0];
    }

    public async getByUserId(userId: number): Promise<UserData | undefined> {
        const query = `SELECT * from user WHERE userId = ?;`;
        const result: UserData[] = await DB.runQuery(query, [userId]);
        return result[0];
    }

    public async updateUser(transactionAmount: number, userId: number, winIncrementor: number): Promise<any> {
        const query = `UPDATE user SET balance = balance + ?, win = win + ? WHERE userId = ?;`;
        return await DB.runQuery(query, [transactionAmount, winIncrementor, userId]);
    }

}

