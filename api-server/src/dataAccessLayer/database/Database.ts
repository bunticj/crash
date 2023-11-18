import { createPool, Pool, PoolConfig, PoolConnection } from 'mariadb';
import EnvConfigVars from '../../businessLayer/utils/EnvConfigVars';
import { CustomError } from '../../businessLayer/model/CustomError';
import { ErrorType } from '../../businessLayer/enum/ErrorType';

class Database {
    private pool: Pool;
    constructor(poolConfig: PoolConfig) {
        this.pool = createPool(poolConfig);
    }

    public async runQuery(sqlQuery: string, parameters: any[]): Promise<any> {
        let connection: PoolConnection | undefined;
        let returnData;
        try {
            connection = await this.pool.getConnection();
            returnData = await connection.query(sqlQuery, parameters);
        }
        catch (err) {
            const error = (err as Error);
            returnData = { error: new CustomError(ErrorType.QueryError, error.message, { name: error.name, query: sqlQuery, stack: error.stack }) };
        } finally {
            if (connection) await connection.release();
            return returnData;
        }
    }
}
const config: PoolConfig = {
    host: EnvConfigVars.DB_HOST,
    user: EnvConfigVars.DB_USER,
    password: EnvConfigVars.DB_USER_PASSWORD,
    database: EnvConfigVars.DB_NAME,
    port: EnvConfigVars.DB_PORT,
    connectionLimit: 20
}
export const DB = new Database(config);