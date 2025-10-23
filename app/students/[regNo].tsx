import CustomModal from "@/components/shared/CustomModal";
import IconButton from "@/components/shared/IconButton";
import StudentForm from "@/components/students/StudentForm";
import StudentDetailField from "@/components/students/StudentDetailField";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import StateStore from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import DialogContent from "@/components/shared/DialogContent";
import { deleteStudent, getAllStudents } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";

export default function Student() {
    const { regNo } = useLocalSearchParams();
    const router = useRouter();
    const { customTheme, customBorderRadius } = useMyAppContext();
    const { database } = useDatabase();
    const students = StateStore(state => state.students);
    const setStudents = StateStore(state => state.setStudents);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const student = students.find((e) => e.regNo === regNo);

    const [deleteOperation, setDeleteOperation] = useState(false);
    const handleDelete = () => {
        (async () => {
            const { success, message } = await deleteStudent(database, student);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
                return;
            }
            ToastAndroid.show(message, ToastAndroid.SHORT);

            const { response } = await getAllStudents(database);
            if (response) setStudents(response);
            toggleRefreshMetricsToken();

            toggleModal();
            router.dismiss();
        })();
    }

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(prev => !prev);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colours[customTheme].background }}>
            {student 
                ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: '5%', color: Colours[customTheme].text }}>
                                {student.firstName} {student.lastName}
                            </Text>
                            <IconButton 
                                icon="account-edit"
                                iconColor={Colours[customTheme].text}
                                onPress={() => toggleModal()}
                            />
                        </View>

                        <Image source={{ uri: student.photoUri }} 
                            style={{ borderRadius: customBorderRadius * 50, backgroundColor: Colours[customTheme].inverseBackground, height: 200, width: 200 }} 
                        />
                        
                        <View style={{ flexDirection: 'row', gap: '2%' }}>
                            <View style={{ flexDirection: 'column', marginVertical: '5%', gap: '1%' }}>
                                <StudentDetailField label="Gender" value={student.gender} />
                                <StudentDetailField label="Date of Birth" value={student.dob} />
                                <StudentDetailField label="Contact" value={student.contact} />
                                <StudentDetailField label="Address" value={student.address} />
                            </View>

                            <View style={{ flexDirection: 'column', marginVertical: '5%', gap: '1%' }}>
                                <StudentDetailField label="Registration Number" value={student.regNo} />
                                <StudentDetailField label="Email" value={student.email} />
                                <StudentDetailField label="Enrolled" value={student.enrollmentDate} />
                            </View>
                        </View>

                        <Button buttonColor="red" textColor={Colours[customTheme].text} onPress={() => {setDeleteOperation(true); toggleModal();}}>Delete Student</Button>
                    </ScrollView>
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>
                        {`Student ${regNo} does not exist!`}
                    </Text>
                )
            }

            <CustomModal modalVisible={modalVisible} toggleModal={toggleModal}>
                {deleteOperation 
                    ? (
                        <DialogContent
                            title="Delete Student"
                            message={`Are you sure you want to delete ${student?.firstName} ${student?.lastName}? This action cannot be undone.`}
                            actions={[
                                { label: "Cancel", onPress: () => {setDeleteOperation(false); toggleModal();} },
                                { label: "Delete", onPress: handleDelete, mode: "contained" }
                            ]}
                        />
                    ) 
                    : <StudentForm studentToEdit={student} toggleModal={toggleModal} />
                }
            </CustomModal>
        </SafeAreaView>
    );
}