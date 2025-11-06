import { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { getDBConnection } from './Connection';
import { ToastAndroid } from 'react-native';
import { 
  initSchoolsTable, initDepartmentsTable,  
  initCoursesTable, initUnitsTable,  
  initLecturersTable,  
  initStudentsTable
} from './Schema';

type DatabaseContextType = {
  database: SQLite.SQLiteDatabase;
  ready: boolean;
};

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [ready, setReady] = useState(false);
    const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        const db = getDBConnection();
        setDatabase(db);

        (async () => {
          try {
            // Initialize tables
            await initSchoolsTable(db);
            await initDepartmentsTable(db);
            await initCoursesTable(db);
            await initUnitsTable(db);
            await initLecturersTable(db);
            await initStudentsTable(db);

            setReady(true);
          } catch (error) {
            console.error('DB init failed:', error);
            ToastAndroid.show('Database initialization failed', ToastAndroid.LONG);
          }
        })();
    }, []);

    if (!database) return null;

    return (
        <DatabaseContext.Provider value={{ database, ready }}>
          {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error("useDatabase must be used within a DatabaseProvider");
  return ctx;
};