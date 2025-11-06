import { create } from 'zustand';
import * as SQLite from 'expo-sqlite';
import { CourseTypes, DepartmentTypes, LecturerTypes, SchoolTypes, StudentTypes } from './Database/Schema';
import { getAllCourses, getAllDepartmentLecturers, getAllDepartments, getLecturer, getSchool } from './Database/Operations';

export type DepartmentDetails = DepartmentTypes & {
    head: LecturerTypes|undefined;
    courses: CourseTypes[];
    lecturers: LecturerTypes[];
};

export type SchoolDetails = SchoolTypes & {
    dean: LecturerTypes|undefined;
    departments: DepartmentDetails[];
};

export type Response<T> = {
    success: boolean;
    message: string;
    response?: T;
};

interface StateStoreTypes {
    // Metrics
    refreshMetricsToken: number,
    toggleRefreshMetricsToken: () => void,

    schoolDetailsToken: number,
    refreshSchoolDetailsToken: () => void,

    schools: Array<SchoolTypes>,
    setSchools: (schools: Array<SchoolTypes>) => void,

    departments: Array<DepartmentTypes>,
    setDepartments: (deparments: Array<DepartmentTypes>) => void,

    getSchoolDetails: (db: SQLite.SQLiteDatabase, schoolID: number) => Promise<Response<SchoolDetails>>,
    schoolDetails: SchoolDetails|null,
    setSchoolDetails: (detailedSchool: SchoolDetails) => void,

    students: Array<StudentTypes>,
    setStudents: (students: Array<StudentTypes>) => void,

    lecturers: Array<LecturerTypes>,
    setLecturers: (teachers: Array<LecturerTypes>) => void
};

const StateStore = create<StateStoreTypes>((set, get) => ({
    refreshMetricsToken: 0,
    toggleRefreshMetricsToken: () => set((state) => ({ refreshMetricsToken: state.refreshMetricsToken + 1 })),

    schools: [],
    setSchools: (schools: SchoolTypes[]) => set({ schools }),

    departments: [],
    setDepartments: (departments: DepartmentTypes[]) => set({ departments }),

    schoolDetailsToken: 0,
    refreshSchoolDetailsToken: () => set((state) => ({ schoolDetailsToken: state.schoolDetailsToken + 1 })),

    getSchoolDetails: async (db, schoolID) => {
        try {
            // School
            const schoolResponse = await getSchool(db, schoolID);
            if (!schoolResponse.success || !schoolResponse.response) {
                throw new Error(schoolResponse.message);
            }

            const school = schoolResponse.response;

            // Dean
            let dean: LecturerTypes|undefined;
            if(school.deanID) {
                const {success, response} = await getLecturer(db, school.deanID);
                if(success && response) {
                    dean = response;
                }
            }

            // Departments
            const departmentsResponse = await getAllDepartments(db, schoolID);
            if (!departmentsResponse.success || !departmentsResponse.response) {
                throw new Error(departmentsResponse.message);
            }

            const departments = departmentsResponse.response;

            // Department Courses
            const departmentsWithCourses = await Promise.all(
                departments.map(async (department) => {
                    const { success, message, response } = await getAllCourses(db, department.id);
                    if (!success || !response) {
                        throw new Error(message);
                    }

                    return {
                        ...department,
                        courses: response
                    };
                })
            );

            // Department Head and Lecturers
            const departmentsWithCoursesAndLecturers = await Promise.all(
                departmentsWithCourses.map(async (department) => {
                    const { success, message, response } = await getAllDepartmentLecturers(db, department.id);
                    if (!success || !response) {
                        throw new Error(message);
                    }
                    const head = response.find((l) => l.id === department.headID)

                    return {
                        ...department,
                        head,
                        lecturers: response
                    };
                })
            );

            // Full School Details
            const schoolDetails = { ...school, dean, departments: departmentsWithCoursesAndLecturers }
            get().setSchoolDetails(schoolDetails);
            return {
                success: true,
                message: `Successfully retrieved details for ${school.name}`,
                response: schoolDetails
            };
        } catch (error) {
            console.error("Getting School Details in State:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error occurred while retrieving school details",
            };
        }
    },
    schoolDetails: null,
    setSchoolDetails: (detailedSchool: SchoolDetails) => set({ schoolDetails: detailedSchool }),

    students: [],
    setStudents: (students: StudentTypes[]) => set({ students }),

    lecturers: [],
    setLecturers: (lecturers: LecturerTypes[]) => set({ lecturers })
}));

export default StateStore;