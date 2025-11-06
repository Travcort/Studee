import { Dispatch, SetStateAction } from "react";
import DialogContent from "../shared/DialogContent";
import DepartmentForm from "./DepartmentForm";
import { DepartmentTypes } from "@/lib/Database/Schema";
import LecturerForm from "../lecturers/LecturerForm";

type AllDeparmentOperationsProps = {
    schoolID: number;
    departmentName: string|undefined;
    toggleModal: () => void;
    departmentToEdit: DepartmentTypes|undefined;
    deleteOperation: boolean;
    setDeleteOperation: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
    departmentHeadOperation: boolean;
    lecturersOperation: boolean;
};

export default function AllDeparmentOperations ({ schoolID, departmentName, toggleModal, departmentToEdit, deleteOperation, setDeleteOperation, handleDelete, departmentHeadOperation, lecturersOperation }: Readonly<AllDeparmentOperationsProps>) {
    if (deleteOperation) {
        return (
            <DialogContent
                title="Delete Department"
                message={`Are you sure you want to delete ${departmentName}? This action cannot be undone.`}
                actions={[
                    { label: "Cancel", onPress: () => {setDeleteOperation(false); toggleModal();} },
                    { label: "Delete", onPress: handleDelete, mode: "contained" }
                ]}
            />
        )
    } else if(departmentHeadOperation) {
        return <LecturerForm toggleModal={toggleModal} />
    } else if (lecturersOperation) {
        return <LecturerForm toggleModal={toggleModal} />
    } else {
        return <DepartmentForm schoolID={schoolID} departmentToEdit={departmentToEdit} toggleModal={toggleModal} />
    }
}