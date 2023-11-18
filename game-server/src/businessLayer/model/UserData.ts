export class UserData {
    public userId?: number;
    public username: string;
    public password?: string;
    public balance: number;
    public win: number;
    public createdAt?: Date;
    constructor(username: string, password: string, balance: number = 0, win: number = 0) {
        this.username = username;
        this.password = password;
        this.balance = balance;
        this.win = win;

    }
} 
