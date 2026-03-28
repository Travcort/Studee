import CustomModal from "@/components/shared/CustomModal";
import IconButton from "@/components/shared/IconButton";
import { useTheme } from "@/lib/Theme";
import StateStore from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import DialogContent from "@/components/shared/DialogContent";
import { deleteLecturer, getAllLecturers } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import LecturerForm from "@/components/lecturers/Form";
import PersonSectionCard from "@/components/PersonSectionCard";

export default function Lecturer() {
    const { staffNo } = useLocalSearchParams();
    const router = useRouter();
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    const lecturers = StateStore(state => state.lecturers);
    const setLecturers = StateStore(state => state.setLecturers);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const lecturer = lecturers.find((e) => e.staffNo === staffNo);

    const [deleteOperation, setDeleteOperation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    if(!lecturer) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colours.background }}>
                <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: colours.text }}>
                    {`Lecturer ${staffNo} does not exist!`}
                </Text>
            </SafeAreaView>
        );
    }

    const schoolDetails = StateStore(state => state.schoolDetails);
    const department = schoolDetails?.departments.find(dep => dep.id === lecturer.departmentID);

    const handleDelete = () => {
        (async () => {
            const { success, message } = await deleteLecturer(database, lecturer);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
                return;
            }
            ToastAndroid.show(message, ToastAndroid.SHORT);

            const { response } = await getAllLecturers(database);
            if (response) setLecturers(response);
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
                        {lecturer.fullName}
                    </Text>
                    <IconButton 
                        icon="account-edit"
                        iconColor={colours.text}
                        onPress={() => setModalVisible(true)}
                    />
                </View>

                <Image source={{ uri: lecturer.photoUri }} 
                    style={{ borderRadius: spacing.borderRadius * 50, backgroundColor: colours.inverseBackground, height: 200, width: 200 }} 
                />
                
                <View style={{ padding: '4%', gap: 20 }}>
                    <PersonSectionCard 
                        heading="Personal Info"
                        details={[
                            {
                                label: "Gender",
                                value: lecturer.gender
                            },
                            {
                                label: "Date of Birth",
                                value: lecturer.dob
                            },
                            {
                                label: "Contact",
                                value: lecturer.contact
                            },
                            {
                                label: "Address",
                                value: lecturer.address
                            }
                        ]}
                    />

                    <PersonSectionCard 
                        heading="Work Info"
                        details={[
                            {
                                label: "Staff Number",
                                value: lecturer.staffNo
                            },
                            {
                                label: "Email",
                                value: lecturer.email
                            },
                            {
                                label: "Employment Date",
                                value: lecturer.employmentDate
                            },
                            {
                                label: "School",
                                value: schoolDetails?.name ?? "Unknown"
                            },
                            {
                                label: "Department",
                                value: department?.name ?? "Unknown"
                            }
                        ]}
                    />
                </View>

                <Button buttonColor="red" textColor={colours.text} onPress={() => {setDeleteOperation(true); setModalVisible(true);}}>Delete Lecturer</Button>
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
                            title="Delete Lecturer"
                            message={`Are you sure you want to delete Lecturer ${lecturer.fullName}? This action cannot be undone.`}
                            actions={[
                                { label: "Cancel", onPress: () => {setDeleteOperation(false); setModalVisible(false);} },
                                { label: "Delete", onPress: handleDelete, mode: "contained" }
                            ]}
                        />
                    ) 
                    : <LecturerForm departmentID={lecturer.departmentID} lecturerToEdit={lecturer} setModalVisible={setModalVisible} />
                }
            </CustomModal>
        </SafeAreaView>
    );
}