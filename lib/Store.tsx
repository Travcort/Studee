import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null;
const DATABASE_NAME = 'studee.db';
const STUDENTS_TABLE = 'students';
const TEACHERS_TABLE = 'teachers';

const getDbConnection = async () => {
    if(!db) {
        db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    }

    return db;
}

export type StudentTypes = {
    rollNo: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    contact: string;
    email: string;
    address: string;
    classId: string;
    photoUri: string;
};

export const initStudentsTable = async () => {
    db = await getDbConnection();

    try {
        await db.runAsync(`CREATE TABLE IF NOT EXISTS ${STUDENTS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roll_no TEXT UNIQUE,
                first_name TEXT,
                last_name TEXT,
                gender TEXT,
                dob TEXT,
                contact TEXT,
                email TEXT,
                address TEXT,
                class_id INTEGER,
                photo_uri TEXT
            );`
        );
        return { success: true, message: `Successfully initialized ${STUDENTS_TABLE} table` };
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${STUDENTS_TABLE}`
        };
    }
}

export const newStudent = async (student: StudentTypes) => {
    db = await getDbConnection();

    try {
        await db.runAsync(`INSERT INTO ${STUDENTS_TABLE} 
            (roll_no, first_name, last_name, gender, dob, contact, email, address, class_id, photo_uri) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
            [student.rollNo, student.firstName, student.lastName, student.gender, student.dob, student.contact, student.email, student.address, student.classId, student.photoUri]
        );
        return { success: true, message: `Successfully enrolled ${student.firstName} ${student.lastName}`}
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while enrolling a new student'
        };
    }
}

export const getAllStudents = async () => {
    db = await getDbConnection();

    try {
        const rows = await db.getAllAsync(`SELECT * FROM ${STUDENTS_TABLE};`);
        const response = rows as StudentTypes[];
        return { success: true, message: 'Successfully retrieved all the students', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all the students'
        };
    }
}

export const initTeachersTable = async () => {
    db = await getDbConnection();

    try {
        await db.runAsync(`CREATE TABLE IF NOT EXISTS ${TEACHERS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                staff_no TEXT UNIQUE,
                first_name TEXT,
                last_name TEXT,
                gender TEXT,
                dob TEXT,
                contact TEXT,
                email TEXT,
                address TEXT,
                subject TEXT,
                photo_uri TEXT
            );`
        );
        return { success: true, message: `Successfully initialized ${TEACHERS_TABLE} table` };
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${TEACHERS_TABLE}`
        };
    }
}