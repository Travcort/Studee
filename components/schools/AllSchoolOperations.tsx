import { Dispatch, SetStateAction } from "react";
import LecturerForm from "../lecturers/LecturerForm";
import DialogContent from "../shared/DialogContent";
import DepartmentForm from "./DepartmentForm";
import SchoolForm from "./SchoolForm";
import { SchoolDetails } from "@/lib/State";

type AllSchoolOperationsProps = {
    toggleModal: () => void;
    schoolID: string;
    schoolName: string|undefined;
    schoolToEdit: SchoolDetails|undefined;
    deleteOperation: boolean;
    setDeleteOperation: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
    departmentOperation: boolean;
    deanOperation: boolean;
};

export default function AllSchoolOperations ({ toggleModal, schoolID, schoolName, schoolToEdit, deleteOperation, setDeleteOperation, departmentOperation, handleDelete, deanOperation }: Readonly<AllSchoolOperationsProps>) {
    if (deleteOperation) {
        return (
            <DialogContent
                title="Delete School"
                message={`Are you sure you want to delete ${schoolName}? This action cannot be undone.`}
                actions={[
                    { label: "Cancel", onPress: () => {setDeleteOperation(false); toggleModal();} },
                    { label: "Delete", onPress: handleDelete, mode: "contained" }
                ]}
            />
        )
    } else if (departmentOperation) {
        return <DepartmentForm schoolID={Number(schoolID)} toggleModal={toggleModal} />
    } else if (deanOperation) {
        return <LecturerForm toggleModal={toggleModal} />
    } else {
        return <SchoolForm schoolToEdit={schoolToEdit} toggleModal={toggleModal} />
    }
}