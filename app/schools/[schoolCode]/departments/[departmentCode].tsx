import AllDeparmentOperations from "@/components/schools/AllDepartmentOperations";
import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CustomModal from "@/components/shared/CustomModal";
import DetailField from "@/components/shared/DetailField";
import IconButton from "@/components/shared/IconButton";
import Personcard from "@/components/shared/PersonCard";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { deleteDepartment } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import { DepartmentTypes } from "@/lib/Database/Schema";
import StateStore, { DepartmentDetails } from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Department() {
    const { departmentCode, departmentID } = useLocalSearchParams<{ departmentCode: string; departmentID: string }>();
    const router = useRouter();
    const { database } = useDatabase();
    const { customTheme } = useMyAppContext();
    
    const refreshSchoolDetailsToken = StateStore(state => state.refreshSchoolDetailsToken);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const schoolDetails = StateStore(state => state.schoolDetails); 
    
    const [department, setDepartment] = useState<DepartmentDetails|null>(null);
    const [departmentToEdit, setDepartmentToEdit] = useState<DepartmentTypes|null>(null);
    const schoolID = departmentToEdit?.schoolID!;
    

    useEffect(() => {
        const department = schoolDetails?.departments.find((d) => d.id === Number(departmentID));
        if (department) {
            const { head, courses, lecturers, ...base } = department;
            setDepartmentToEdit(base);
            setDepartment(department);
        }
    }, [schoolDetails, departmentID]);

    const [deleteOperation, setDeleteOperation] = useState(false);
    const [departmentHeadOperation, setDepartmentHeadOperation] = useState(false);
    const [lecturersOperation, setLecturersOperation] = useState(false);
    const handleDelete = () => {
        (async () => {
            if(!departmentToEdit) {
                ToastAndroid.show('The Department To Edit has not been set', ToastAndroid.SHORT);
                return;
            }
            const { success, message } = await deleteDepartment(database, departmentToEdit)
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
                return;
            }
            toggleRefreshMetricsToken();
            refreshSchoolDetailsToken();
            ToastAndroid.show(message, ToastAndroid.SHORT);
            toggleModal();
            router.dismiss();
        })();
    };
    
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(prev => !prev);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colours[customTheme].background }}>
            {department
                ? (
                    <View style={{ gap: '2%', alignItems: 'center' }}>
                        <Card>
                            <View style={{ position: "relative", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "700", color: Colours[customTheme].inverseText }}>
                                    {department.name}
                                </Text>

                                <IconButton
                                    icon="account-edit"
                                    iconColor={Colours[customTheme].inverseText}
                                    onPress={() =>  toggleModal()}
                                    style={{
                                        position: "absolute",
                                        top: '20%',
                                        right: '2%',
                                        zIndex: 1,
                                    }}
                                />
                            </View>

                            <Text style={{ fontSize: 14, color: Colours[customTheme].placeholderText, marginTop: 4 }}>
                                Code: {department.code}
                            </Text>

                            <Text style={{ fontSize: 13, color: Colours[customTheme].placeholderText }}>
                                Established: {new Date(department.started).toLocaleDateString()}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                The Department Head
                            </Text>
                            {department.head
                                ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                                        <Avatar 
                                            uri={department.head.photoUri}
                                            name={department.head.firstName ?? 'Not Available'}
                                            size={72}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <DetailField label="Name" value={department.head.firstName} />
                                            <DetailField label="Email" value={department.head.email} />
                                            <DetailField label="Contact" value={department.head.contact} />
                                        </View>
                                    </View>
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                            No Department Head Yet
                                        </Text>

                                        <Button onPress={() => {setDepartmentHeadOperation(true); toggleModal();}}>Appoint Department Head</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText }}>LECTURERS</Text>
                            {department.lecturers.length > 0 
                                ? (
                                    <FlatList  
                                        contentContainerStyle={{ width: '95%', alignSelf: 'center' }}
                                        data={department.lecturers}
                                        keyExtractor={({ id }) => String(id)}
                                        renderItem={({item}) => (
                                            <Personcard
                                                id={item.id} 
                                                table="lecturers"
                                                uniqueIdentifier={item.staffNo}
                                                firstName={item.firstName}
                                                lastName={item.lastName}
                                            />
                                        )}
                                        ListFooterComponent={<Button onPress={() => {setLecturersOperation(true); toggleModal();}}>Add New Lecturer</Button>}
                                    />
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                            No Department Lecturers Yet
                                        </Text>

                                        <Button onPress={() => {setLecturersOperation(true); toggleModal();}}>Add Lecturer</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Button buttonColor="red" textColor={Colours[customTheme].text} onPress={() => {setDeleteOperation(true); toggleModal();}}>
                            Delete Department
                        </Button>
                    </View>
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>
                        {`Department ${departmentCode} does not exist!`}
                    </Text>
                )
            }

            <CustomModal 
                modalVisible={modalVisible} 
                toggleModal={toggleModal}
                onRequestCloseOperations={() => {
                    setDeleteOperation(false);
                    setDepartmentHeadOperation(false);
                    setLecturersOperation(false);
                }}
            >
                {departmentToEdit && 
                    <AllDeparmentOperations 
                        departmentName={department?.name} 
                        {...{ schoolID, toggleModal, 
                                departmentToEdit, deleteOperation, setDeleteOperation, handleDelete, 
                                departmentHeadOperation, lecturersOperation 
                        }} 
                    />
                }
            </CustomModal>
        </SafeAreaView>
    );
}