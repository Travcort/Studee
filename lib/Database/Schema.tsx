import * as SQLite from 'expo-sqlite';

export const SCHOOLS_TABLE = 'schools';
export const DEPARTMENTS_TABLE = 'departments';
export const SCHOOL_DEPARTMENTS_TABLE = 'school_departments';
export const COURSES_TABLE = 'courses';
export const UNITS_TABLE = 'units';
export const COURSE_UNITS_TABLE = 'course_units';
export const LECTURERS_TABLE = 'lecturers';
export const LECTURER_UNITS_TABLE = 'lecturer_units';
export const STUDENTS_TABLE = 'students';

export type SchoolTypes = {
    id: number;
    name: string;
    code: string;
    deanID: number|null;
    started: string;
};

export type NewSchoolTypes = Omit<SchoolTypes, "id"|"started">;

export const initSchoolsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${SCHOOLS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                code TEXT UNIQUE NOT NULL,
                deanID INTEGER UNIQUE,
                started DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (deanID) REFERENCES ${LECTURERS_TABLE} (id) ON DELETE SET NULL
            );`
        );
        return { success: true, message: `Successfully initialized ${SCHOOLS_TABLE}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${SCHOOLS_TABLE}`
        };
    }
};

export type DepartmentTypes = {
    id: number;
    name: string;
    code: string;
    schoolID: number;
    headID: number|null;
    started: string;
};

export type NewDepartmentTypes = Omit<DepartmentTypes, "id"|"started">;

export const initDepartmentsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${DEPARTMENTS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                code TEXT UNIQUE NOT NULL,
                schoolID INTEGER NOT NULL,
                headID INTEGER,
                started DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (schoolID) REFERENCES ${SCHOOLS_TABLE} (id),
                FOREIGN KEY (headID) REFERENCES ${LECTURERS_TABLE} (id)
            );`
        );
        return { success: true, message: `Successfully initialized ${DEPARTMENTS_TABLE}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${DEPARTMENTS_TABLE}`
        };
    }
};

export const initSchoolDepartmentsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${SCHOOL_DEPARTMENTS_TABLE} (
            schoolID INTEGER NOT NULL,
            departmentID INTEGER NOT NULL,
            PRIMARY KEY (schoolID, departmentID),
            FOREIGN KEY (schoolID) REFERENCES ${SCHOOLS_TABLE} (id) ON DELETE CASCADE,
            FOREIGN KEY (departmentID) REFERENCES ${DEPARTMENTS_TABLE} (id) ON DELETE CASCADE
            );`
        );
        return { success: true, message: `Successfully initialized ${SCHOOL_DEPARTMENTS_TABLE} table` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${SCHOOL_DEPARTMENTS_TABLE}`
        };
    }
};

export type CourseTypes = {
    id: number;
    name: string;
    code: string;
    schoolID: number;
    departmentID: number;
    started: string;
};

export type NewCourseTypes = Omit<CourseTypes, "id"|"started">;

export const initCoursesTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${COURSES_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                code TEXT UNIQUE NOT NULL,
                schoolID INTEGER NOT NULL,
                departmentID INTEGER NOT NULL,
                started DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (schoolID) REFERENCES ${SCHOOLS_TABLE} (id),
                FOREIGN KEY (departmentID) REFERENCES ${DEPARTMENTS_TABLE} (id)
            );`
        );
        return { success: true, message: `Successfully initialized ${COURSES_TABLE}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${COURSES_TABLE}`
        };
    }
};

export type UnitTypes = {
    id: number;
    name: string;
    code: string;
    creditHours: number;
    departmentID: number;
    started: string;
};

export type NewUnitTypes = Omit<UnitTypes, "id"|"started">;

export const initUnitsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${UNITS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                code TEXT UNIQUE NOT NULL,
                creditHours INTEGER NOT NULL,
                departmentID INTEGER NOT NULL,
                started DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (departmentID) REFERENCES ${DEPARTMENTS_TABLE} (id)
            );`
        );
        return { success: true, message: `Successfully initialized ${UNITS_TABLE}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${UNITS_TABLE}`
        };
    }
}

export const initCourseUnitsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${COURSE_UNITS_TABLE} (
            courseID INTEGER NOT NULL,
            unitID INTEGER NOT NULL,
            PRIMARY KEY (courseID, unitID),
            FOREIGN KEY (courseID) REFERENCES ${COURSES_TABLE} (id) ON DELETE CASCADE,
            FOREIGN KEY (unitID) REFERENCES ${UNITS_TABLE} (id) ON DELETE CASCADE
            );`
        );
        return { success: true, message: `Successfully initialized ${COURSE_UNITS_TABLE} table` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${COURSE_UNITS_TABLE}`
        };
    }
};

export type LecturerTypes = {
    id: number;
    staffNo: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    contact: string;
    email: string;
    address: string;
    photoUri: string;
    employmentDate: string;
    departmentID: number;
};

export type NewLecturerTypes = Omit<LecturerTypes, "id"|"employmentDate">;

export const initLecturersTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${LECTURERS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                staffNo TEXT UNIQUE NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                gender TEXT NOT NULL,
                dob TEXT NOT NULL,
                contact TEXT NOT NULL,
                email TEXT NOT NULL,
                address TEXT,
                photoUri TEXT NOT NULL,
                employmentDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                departmentID INTEGER NOT NULL,
                FOREIGN KEY (departmentID) REFERENCES ${DEPARTMENTS_TABLE} (id)
            );`
        );
        return { success: true, message: `Successfully initialized ${LECTURERS_TABLE} table` };
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${LECTURERS_TABLE}`
        };
    }
};

export const initLecturerUnitsTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${LECTURER_UNITS_TABLE} (
                lecturerID INTEGER NOT NULL,
                unitID INTEGER NOT NULL,
                PRIMARY KEY (lecturerID, unitID),
                FOREIGN KEY (lecturerID) REFERENCES ${LECTURERS_TABLE} (id) ON DELETE CASCADE,
                FOREIGN KEY (unitID) REFERENCES ${UNITS_TABLE} (id) ON DELETE CASCADE
            );`
        );
        return { success: true, message: `Successfully initialized ${LECTURER_UNITS_TABLE} table` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while initializing ${LECTURER_UNITS_TABLE}`
        };
    }
};

export type StudentTypes = {
    id: number;
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
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${STUDENTS_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                regNo TEXT UNIQUE NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                gender TEXT,
                dob TEXT NOT NULL,
                contact TEXT,
                email TEXT,
                address TEXT,
                enrollmentDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                photoUri TEXT,
                schoolID INTEGER NOT NULL,
                departmentid INTEGER NOT NULL,
                courseID INTEGER NOT NULL,
                FOREIGN KEY (schoolID) REFERENCES ${SCHOOLS_TABLE} (id),
                FOREIGN KEY (departmentID) REFERENCES ${DEPARTMENTS_TABLE} (id),
                FOREIGN KEY (courseID) REFERENCES ${COURSES_TABLE} (id)
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
};