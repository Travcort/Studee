import * as SQLite from 'expo-sqlite';

const STUDENTS_TABLE = 'students';
const TEACHERS_TABLE = 'teachers';

export type StudentTypes = {
    regNo: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    contact: string;
    email: string;
    address: string;
    enrollmentDate: string;
    photoUri: string;
};

export const initStudentsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.runAsync(`CREATE TABLE IF NOT EXISTS ${STUDENTS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                regNo TEXT UNIQUE,
                firstName TEXT,
                lastName TEXT,
                gender TEXT,
                dob TEXT,
                contact TEXT,
                email TEXT,
                address TEXT,
                enrollmentDate TEXT,
                photoUri TEXT
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

export const newStudent = async (db: SQLite.SQLiteDatabase, student: StudentTypes) => {
    try {
        if(!student.regNo || !student.firstName || !student.lastName) {
            return { success: false, message: 'The Registration Number, First and Last Name are mandatory' }
        }

        await db.runAsync(`INSERT INTO ${STUDENTS_TABLE} 
            (regNo, firstName, lastName, gender, dob, contact, email, address, enrollmentDate, photoUri) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
            [student.regNo, student.firstName, student.lastName, student.gender, student.dob, student.contact, student.email, student.address, student.enrollmentDate, student.photoUri]
        );
        return { success: true, message: `Successfully enrolled ${student.firstName} ${student.lastName}`}
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while enrolling a new student'
        };
    }
}

export const editStudentDetails = async (db: SQLite.SQLiteDatabase, student: StudentTypes) => {
    try {
        if(!student.regNo || !student.firstName || !student.lastName) {
            return { success: false, message: 'The Registration Number, First and Last Name are mandatory' }
        }
        
        await db.runAsync(`UPDATE ${STUDENTS_TABLE} SET 
            regNo = (?), firstName = (?), lastName = (?), gender = (?), dob = (?), contact = (?), email = (?), address = (?), enrollmentDate = (?), photoUri = (?) 
            WHERE regNo = (?);`, 
            [student.regNo, student.firstName, student.lastName, student.gender, student.dob, student.contact, student.email, student.address, student.enrollmentDate, student.photoUri, student.regNo]
        );
        return { success: true, message: `Successfully updated ${student.firstName} ${student.lastName}'s details`}
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the student details'
        };
    }
}

export const getStudent = async (db: SQLite.SQLiteDatabase, regNo: string) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${STUDENTS_TABLE} WHERE regNo = (?);`, regNo);
        const response = row as StudentTypes;
        return { success: true, message: `Successfully retrieved ${response.firstName}`, response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving a student'
        };
    }
}

export const deleteStudent = async (db: SQLite.SQLiteDatabase, student: StudentTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${STUDENTS_TABLE} WHERE regNo = (?);`, student.regNo);
        return { success: true, message: `Successfully unenrolled ${student.firstName} ${student.lastName}`}
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while unenrolling the student'
        };
    }
}

export const getAllStudents = async (db: SQLite.SQLiteDatabase) => {
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

export const initTeachersTable = async (db: SQLite.SQLiteDatabase) => {
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