import CustomModal from "@/components/shared/CustomModal";
import IconButton from "@/components/shared/IconButton";
import StudentForm from "@/components/students/Form";
import { useTheme } from "@/lib/Theme";
import StateStore from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import DialogContent from "@/components/shared/DialogContent";
import { deleteStudent, getAllStudents } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import PersonSectionCard from "@/components/PersonSectionCard";

export default function Student() {
    const { regNo } = useLocalSearchParams();
    const router = useRouter();
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    const students = StateStore(state => state.students);
    const setStudents = StateStore(state => state.setStudents);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const student = students.find((e) => e.regNo === regNo);

    const [deleteOperation, setDeleteOperation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    if(!student) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colours.background }}>
                <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: colours.text }}>
                    {`Student ${regNo} does not exist!`}
                </Text>
            </SafeAreaView>
        );
    }

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

            setModalVisible(false);
            router.dismiss();
        })();
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: '5%', color: colours.text }}>
                        {student.fullName}
                    </Text>
                    <IconButton 
                        icon="account-edit"
                        iconColor={colours.text}
                        onPress={() => setModalVisible(true)}
                    />
                </View>

                <Image source={{ uri: student.photoUri }} 
                    style={{ borderRadius: spacing.borderRadius * 50, backgroundColor: colours.inverseBackground, height: 200, width: 200 }} 
                />
                
                <View style={{ padding: '4%', gap: 20 }}>
                    <PersonSectionCard 
                        heading="Personal Info"
                        details={[
                            {
                                label: "Gender",
                                value: student.gender
                            },
                            {
                                label: "Date of Birth",
                                value: student.dob
                            },
                            {
                                label: "Contact",
                                value: student.contact
                            },
                            {
                                label: "Address",
                                value: student.address
                            }
                        ]}
                    />

                    <PersonSectionCard 
                        heading="School Info"
                        details={[
                            {
                                label: "Registration Number",
                                value: student.regNo
                            },
                            {
                                label: "Email",
                                value: student.email
                            },
                            {
                                label: "Enrollment Date",
                                value: student.enrollmentDate
                            }
                        ]}
                    />
                </View>

                <Button buttonColor="red" textColor={colours.text} onPress={() => {setDeleteOperation(true); setModalVisible(true);}}>Delete Student</Button>
            </ScrollView>

            <CustomModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                onRequestCloseOperations={() => {
                    setDeleteOperation(false);
                }}
            >
                {deleteOperation 
                    ? (
                        <DialogContent
                            title="Delete Student"
                            message={`Are you sure you want to delete student ${student.fullName}? This action cannot be undone.`}
                            actions={[
                                { label: "Cancel", onPress: () => {setDeleteOperation(false); setModalVisible(false);} },
                                { label: "Delete", onPress: handleDelete, mode: "contained" }
                            ]}
                        />
                    ) 
                    : <StudentForm studentToEdit={student} setModalVisible={setModalVisible} />
                }
            </CustomModal>
        </SafeAreaView>
    );
}