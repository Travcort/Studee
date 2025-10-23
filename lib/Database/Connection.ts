import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null;

const DATABASE_NAME = 'studee.db';

export const getDBConnection = () => {
    if (!db) {
        db = SQLite.openDatabaseSync(DATABASE_NAME)
    }

    return db;
}