declare namespace NodeJS {
    interface ProcessEnv {
        LAMBDA_ENV   : string;
        DDB_TRACKING : string;
        DDB_SNAPSHOTS: string;
    }
}