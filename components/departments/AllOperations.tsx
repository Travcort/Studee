import { Dispatch, SetStateAction } from "react";
import DialogContent from "../shared/DialogContent";
import DepartmentForm from "./Form";
import { DepartmentTypes } from "@/lib/Database/Schema";
import LecturerForm from "../lecturers/Form";
import LecturersList from "../lecturers/List";
import CourseForm from "../courses/Form";

type AllDepartmentOperationsProps = {
    schoolID: number;
    departmentID: number;
    departmentName: string;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    departmentToEdit: DepartmentTypes|undefined;
    deleteOperation: boolean;
    setDeleteOperation: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
    departmentHeadOperation: boolean;
    lecturersOperation: boolean;
    coursesOperation: boolean;
};

export default function AllDepartmentOperations ({ 
    schoolID, 
    departmentID, departmentName, 
    setModalVisible, departmentToEdit, 
    deleteOperation, setDeleteOperation, handleDelete, 
    departmentHeadOperation, lecturersOperation, coursesOperation 
}: Readonly<AllDepartmentOperationsProps>) {
    if (deleteOperation) {
        return (
            <DialogContent
                title="Delete Department"
                message={`Are you sure you want to delete the department of ${departmentName}? This action cannot be undone.`}
                actions={[
                    { label: "Cancel", onPress: () => {setDeleteOperation(false); setModalVisible(false);} },
                    { label: "Delete", onPress: handleDelete, mode: "contained" }
                ]}
            />
        )
    } else if(departmentHeadOperation) {
        return <LecturersList />
    } else if (lecturersOperation) {
        return <LecturerForm {...{ departmentID, setModalVisible }} />
    } else if (coursesOperation) {
        return <CourseForm {...{ schoolID, departmentID, setModalVisible }} />
    } else {
        return <DepartmentForm {...{ schoolID, departmentToEdit, setModalVisible }} />
    }
}