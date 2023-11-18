export abstract class AbstractRepository<TQuery, TEntity> {
    protected abstract queries: TQuery;
    protected abstract create(entity: TEntity): Promise<any>;
    protected abstract getByNumberId(numberId: number, ...args: any): Promise<TEntity | undefined>;
    protected abstract getByStringId(stringId: string, ...args: any): Promise<TEntity | undefined>;
    protected abstract update(...args: any): Promise<any>;
}

