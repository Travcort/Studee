import { Dispatch, SetStateAction } from "react";
import DialogContent from "../shared/DialogContent";
import DepartmentForm from "../departments/Form";
import SchoolForm from "./Form";
import { SchoolDetails } from "@/lib/State";
import LecturersList from "../lecturers/List";

type AllSchoolOperationsProps = {
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    schoolID: string;
    schoolName: string;
    schoolToEdit: SchoolDetails|undefined;
    deleteOperation: boolean;
    setDeleteOperation: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
    departmentOperation: boolean;
    deanOperation: boolean;
};

export default function AllSchoolOperations ({ setModalVisible, schoolID, schoolName, schoolToEdit, deleteOperation, setDeleteOperation, departmentOperation, handleDelete, deanOperation }: Readonly<AllSchoolOperationsProps>) {
    if (deleteOperation) {
        return (
            <DialogContent
                title="Delete School"
                message={`Are you sure you want to delete ${schoolName}? This action cannot be undone.`}
                actions={[
                    { label: "Cancel", onPress: () => {setDeleteOperation(false); setModalVisible(false);} },
                    { label: "Delete", onPress: handleDelete, mode: "contained" }
                ]}
            />
        )
    } else if (departmentOperation) {
        return <DepartmentForm schoolID={Number(schoolID)} setModalVisible={setModalVisible} />
    } else if (deanOperation) {
        return <LecturersList />
    } else {
        return <SchoolForm {...{ schoolToEdit, setModalVisible }} />
    }
}