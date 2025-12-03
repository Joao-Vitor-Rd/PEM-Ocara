export interface IDataBase {
    pool(): any;
    testConnection(): Promise<void>;
    initialize(): Promise<void>;
    close(): Promise<void>;
}