import * as SQLite from 'expo-sqlite';
import { 
    SCHOOLS_TABLE, SchoolTypes, NewSchoolTypes,
    DEPARTMENTS_TABLE, DepartmentTypes, NewDepartmentTypes,
    LECTURERS_TABLE, LecturerTypes, NewLecturerTypes,
    COURSES_TABLE, CourseTypes, NewCourseTypes, 
    UNITS_TABLE, UnitTypes, NewUnitTypes, 
    STUDENTS_TABLE, StudentTypes, 

} from './Schema';

export const newSchool = async (db: SQLite.SQLiteDatabase, school: NewSchoolTypes) => {
    try {
        await db.runAsync(`INSERT OR IGNORE INTO ${SCHOOLS_TABLE} 
            (name, code, deanID) 
            VALUES (?, ?, ?);`,
            [school.name, school.code, school.deanID]
        );

        return { success: true, message: `Successfully created ${school.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while creating a new School'
        };
    }
};

export const getAllSchools = async (db: SQLite.SQLiteDatabase, countOnly = false) => {
    try {
        if (countOnly) {
            const result = await db.getAllAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${SCHOOLS_TABLE};`);
            return { success: true, message: `Successfully retrieved the ${SCHOOLS_TABLE} count`, count: result[0]?.count ?? 0 };
        }

        const response: SchoolTypes[] = await db.getAllAsync(`SELECT * FROM ${SCHOOLS_TABLE};`);
        return { success: true, message: 'Successfully retrieved all schools', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all schools'
        };
    }
};

export const getSchool = async (db: SQLite.SQLiteDatabase, schoolID: number) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${SCHOOLS_TABLE} WHERE id = (?);`, schoolID);
        if(!row) {
            return { success: false, message: 'No Such School Exists' };
        }
        const response = row as SchoolTypes;
        return { success: true, message: 'Successfully retrieved the School', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving the school'
        };
    }
};

export const editSchoolDetails = async (db: SQLite.SQLiteDatabase, school: SchoolTypes) => {
    try {
        await db.runAsync(`UPDATE ${SCHOOLS_TABLE} 
            SET name = (?), code = (?), deanID = (?) 
            WHERE id = (?);`, 
            [school.name, school.code, school.deanID, school.id]
        );
        return { success: true, message: `Successfully updated ${school.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while editing the school details'
        };
    }
};

export const deleteSchool = async (db: SQLite.SQLiteDatabase, school: SchoolTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${SCHOOLS_TABLE} WHERE id = (?);`, school.id);
        return { success: true, message: `Successfully deleted ${school.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while deleting the school'
        };
    }
};

export const newDepartment = async (db: SQLite.SQLiteDatabase, department: NewDepartmentTypes) => {
    try {
        const schoolID = department.schoolID;
        if(!schoolID) {
            return { success: false, message: 'The Department must be associated with a School' };
        }

        await db.runAsync(`INSERT OR IGNORE INTO ${DEPARTMENTS_TABLE} 
            (name, code, schoolID, headID) 
            VALUES (?, ?, ?, ?);`,
            [department.name, department.code, schoolID, department.headID]
        );
        return { success: true, message: `Successfully created ${department.name}` };
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while creating a new school department'
        };
    }
};

export const getAllDepartmentsCount = async (db: SQLite.SQLiteDatabase) => {
    try {
        const result = await db.getAllAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${DEPARTMENTS_TABLE};`);
        return { success: true, message: `Successfully retrieved the ${DEPARTMENTS_TABLE} count`, count: result[0]?.count ?? 0 };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving the departments count'
        };
    }
}

export const getAllDepartments = async (db: SQLite.SQLiteDatabase, schoolID: number) => {
    try {
        const response: DepartmentTypes[] = await db.getAllAsync(`SELECT * FROM ${DEPARTMENTS_TABLE} WHERE schoolID = (?);`, schoolID);
        return { success: true, message: 'Successfully retrieved the School Departments', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all school departments'
        };
    }
};

export const getDepartment = async (db: SQLite.SQLiteDatabase, departmentID: number) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${DEPARTMENTS_TABLE} WHERE id = (?);`, departmentID);
        if(!row) {
            return { success: false, message: 'No Such Department Exists' };
        }
        const response = row as DepartmentTypes;
        return { success: true, message: 'Successfully retrieved the School Department', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all school departments'
        };
    }
};

export const editDepartment = async (db: SQLite.SQLiteDatabase, department: DepartmentTypes) => {
    try {
        await db.runAsync(`UPDATE ${DEPARTMENTS_TABLE} 
            SET name = (?), code = (?), schoolID = (?), headID = (?)
            WHERE id = (?);`, 
            [department.name, department.code, department.schoolID, department.headID, department.id]
        );
        return { success: false, message: `Successfully updated ${department.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the school department details'
        };
    }
};

export const deleteDepartment = async (db: SQLite.SQLiteDatabase, department: DepartmentTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${DEPARTMENTS_TABLE} WHERE id = (?);`, department.id);
        return { success: true, message: `Successfully deleted ${department.name} `};
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while deleting the school department'
        };
    }
};

export const newCourse = async (db: SQLite.SQLiteDatabase, course: NewCourseTypes) => {
    try {
        await db.runAsync(`INSERT OR IGNORE INTO ${COURSES_TABLE} 
            (name, code, schoolID, departmentID) 
            VALUES (?, ?, ?, ?);`, 
            [course.name, course.code, course.schoolID, course.departmentID]
        );
        return { success: true, message: `Successfully created ${course.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while creating a new course'
        };
    }
};

export const getAllCourses = async (db: SQLite.SQLiteDatabase, departmentID: number) => {
    try {
        const response: CourseTypes[] = await db.getAllAsync(`SELECT * FROM ${COURSES_TABLE} WHERE departmentID = (?);`, departmentID);
        return { success: true, message: 'Successfully retrieved the course', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all the courses'
        };
    }
};

export const getCourse = async (db: SQLite.SQLiteDatabase, courseID: number) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${COURSES_TABLE} WHERE id = (?);`, courseID);
        if(!row) {
            return { success: false, message: 'No Such Course Exists' };
        }
        const response = row as CourseTypes;
        return { success: true, message: 'Successfully retrieved the course', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving the course'
        };
    }
};

export const editCourse = async (db: SQLite.SQLiteDatabase, course: CourseTypes) => {
    try {
        await db.runAsync(`UPDATE ${COURSES_TABLE} 
            SET name = (?), code = (?), schoolID = (?), departmentID = (?) 
            WHERE id = (?);`, 
            [course.name, course.code, course.schoolID, course.departmentID, course.departmentID]
        );
        return { success: true, message: `Successfully updated ${course.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the course'
        };
    }
};

export const deleteCourse = async (db: SQLite.SQLiteDatabase, course: CourseTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${COURSES_TABLE} WHERE id = (?);`, course.id);
        return { success: true, message: `Successfully deleted ${course.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while deleting the course'
        };
    }
};

// UNITS
export const newUnit = async (db: SQLite.SQLiteDatabase, unit: NewUnitTypes) => {
    try {
        await db.runAsync(`INSERT OR IGNORE INTO ${UNITS_TABLE} 
            (name, code, creditHours, departmentID) 
            VALUES (?, ?, ?, ?);`, 
            [unit.name, unit.code, unit.creditHours, unit.departmentID]
        );
        return { success: true, message: `Successfully created ${unit.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while creating a new unit'
        };
    }
};

export const getAllUnits = async (db: SQLite.SQLiteDatabase, departmentID: number) => {
    try {
        const response: UnitTypes[] = await db.getAllAsync(`SELECT * FROM ${UNITS_TABLE} WHERE departmentID = (?);`, departmentID);
        return { success: true, message: 'Successfully retrieved the Unit', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving all units'
        };
    }
};

export const getUnit = async (db: SQLite.SQLiteDatabase, unitID: number) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${UNITS_TABLE} WHERE id = (?);`, unitID);
        if(!row) {
            return { success: false, message: 'No Such Unit Exists' };
        }
        const response = row as UnitTypes;
        return { success: true, message: 'Successfully retrieved the Unit', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving the unit'
        };
    }
};

export const editUnit = async (db: SQLite.SQLiteDatabase, unit: UnitTypes) => {
    try {
        await db.runAsync(`UPDATE ${UNITS_TABLE} 
            SET name = (?), code = (?), creditHours = (?), departmentID = (?) 
            WHERE id = (?);`, 
            [unit.name, unit.code, unit.creditHours, unit.departmentID, unit.id]  
        );
        return { success: true, message: `Successfully updated ${unit.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the unit'
        };
    }
};

export const deleteUnit = async (db: SQLite.SQLiteDatabase, unit: UnitTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${UNITS_TABLE} WHERE id = (?);`, unit.id);
        return { success: true, message: `Successfully deleted ${unit.name}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while deleting the unit'
        };
    }
};

// LECTURERS
export const newLecturer = async (db: SQLite.SQLiteDatabase, lecuturer: NewLecturerTypes ) => {
    try {
        await db.runAsync(`INSERT OR IGNORE INTO ${LECTURERS_TABLE} 
            (staffNo, firstName, lastName, gender, dob, contact, email, address, photoUri, departmentID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
            [lecuturer.staffNo, lecuturer.firstName, lecuturer.lastName, lecuturer.gender, lecuturer.dob, lecuturer.contact, lecuturer.email, lecuturer.address, lecuturer.photoUri, lecuturer.departmentID]
        );
        return { success: true, message: `Successfully enrolled lecturer ${lecuturer.firstName} ${lecuturer.lastName}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while enrolling a new lecturer'
        };
    }
};

export const getAllLecturers = async (db: SQLite.SQLiteDatabase, countOnly = false) => {
    try {
        if (countOnly) {
            const result = await db.getAllAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${LECTURERS_TABLE};`);
            return { success: true, message: `Successfully retrieved the ${LECTURERS_TABLE} count`, count: result[0]?.count ?? 0 };
        }

        const rows = await db.getAllAsync(`SELECT * FROM ${LECTURERS_TABLE};`);
        const response = rows as LecturerTypes[];
        return { success: true, message: `Successfully retrieved all the ${LECTURERS_TABLE}`, response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : `Unknown error occurred while retrieving all the ${LECTURERS_TABLE}`
        };
    }
};

export const getAllDepartmentLecturers = async (db: SQLite.SQLiteDatabase, departmentID: number) => {
    try {
        const response: LecturerTypes[] = await db.getAllAsync(`SELECT * FROM ${LECTURERS_TABLE} WHERE departmentID = (?);`, departmentID);
        console.log("Department Lecturers:", response);
        return { success: true, message: 'Successfully retrieved all department lecturers', response}
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving department lecturers'
        };
    }
};

export const getLecturer = async (db: SQLite.SQLiteDatabase, lecturerID: number) => {
    try {
        const row = await db.getFirstAsync(`SELECT * FROM ${LECTURERS_TABLE} WHERE id = (?);`, lecturerID);
        if(!row) {
            return { success: false, message: 'No Such Lecturer Exists' };
        }
        const response = row as LecturerTypes;
        return { success: true, message: 'Successfully retrieved lecturer', response };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while retrieving the lecturer details'
        };
    }
};

export const editLecturer = async (db: SQLite.SQLiteDatabase, lecturer: LecturerTypes) => {
    try {
        await db.runAsync(`UPDATE ${LECTURERS_TABLE} SET 
            staffNo = (?), firstName = (?), lastName = (?), gender = (?), dob = (?), contact = (?), email = (?), address = (?), photoUri = (?) 
            WHERE id = (?);`,
            [lecturer.staffNo, lecturer.firstName, lecturer.lastName, lecturer.gender, lecturer.dob, lecturer.contact, lecturer.email, lecturer.address, lecturer.photoUri, lecturer.id]
        );
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the lecturer details'
        };
    }
};

export const deleteLecturer = async (db:SQLite.SQLiteDatabase, lecturer: LecturerTypes) => {
    try {
        await db.runAsync(`DELETE FROM ${LECTURERS_TABLE} WHERE id = (?);`, lecturer.id);
        return { success: true, message: `Successfully deleted lecturer ${lecturer.firstName} ${lecturer.lastName}` };
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error occurred while updating the lecturer details'
        };
    }
};


// STUDENTS
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
        return { success: true, message: `Successfully unenrolled ${student.firstName} ${student.lastName}` };
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
};