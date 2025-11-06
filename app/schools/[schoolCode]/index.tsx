import CustomModal from "@/components/shared/CustomModal";
import IconButton from "@/components/shared/IconButton";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import StateStore, { SchoolDetails } from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import { getAllSchools } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import DetailField from "@/components/shared/DetailField";
import Avatar from "@/components/shared/Avatar";
import DepartmentCard from "@/components/schools/DepartmentCard";
import Card from "@/components/shared/Card";
import AllSchoolOperations from "@/components/schools/AllSchoolOperations";

export default function School() {
    const { schoolCode, schoolID } = useLocalSearchParams<{ schoolCode: string; schoolID: string }>();
    const router = useRouter();
    const { customTheme } = useMyAppContext();
    const { database } = useDatabase();

    const [school, setSchool] = useState<SchoolDetails|null>(null);
    const [schoolToEdit, setSchoolToEdit] = useState<SchoolDetails|null>(null);
    const setStateSchools = StateStore(state => state.setSchools);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const getSchoolDetails = StateStore(state => state.getSchoolDetails);
    const schoolDetailsToken = StateStore(state => state.schoolDetailsToken);

    const [deleteOperation, setDeleteOperation] = useState(false);
    const [departmentOperation, setDepartmentOperation] = useState(false);
    const [deanOperation, setDeanOperation] = useState(false);
    const handleDelete = () => {
        (async () => {
            const { response } = await getAllSchools(database);
            if (response) setStateSchools(response);
            toggleRefreshMetricsToken();

            toggleModal();
            router.dismiss();
        })();
    };

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(prev => !prev);

    useEffect(() => {
        (async() => {
            const id = Number(schoolID)
            const {success, message, response} = await getSchoolDetails(database, id);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
                return;
            }
            const school = response as SchoolDetails;
            setSchool(school);
            setSchoolToEdit(school);
        })();
    }, [schoolDetailsToken]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colours[customTheme].background }}>
            {school
                ? (
                    <View style={{ gap: '2%', alignItems: 'center' }}>
                        <Card>
                            <View style={{ position: "relative", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "700", color: Colours[customTheme].inverseText }}>
                                    {school.name}
                                </Text>

                                <IconButton
                                    icon="account-edit"
                                    iconColor={Colours[customTheme].inverseText}
                                    onPress={toggleModal}
                                    style={{
                                        position: "absolute",
                                        top: '20%',
                                        right: '2%',
                                        zIndex: 1,
                                    }}
                                />
                            </View>

                            <Text style={{ fontSize: 14, color: Colours[customTheme].placeholderText, marginTop: 4 }}>
                                Code: {school.code}
                            </Text>

                            <Text style={{ fontSize: 13, color: Colours[customTheme].placeholderText }}>
                                Established: {new Date(school.started).toLocaleDateString()}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                The Dean
                            </Text>

                            {school.dean 
                                ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                                        <Avatar 
                                            uri={school.dean.photoUri}
                                            name={school.dean.firstName ?? 'Not Available'}
                                            size={72}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <DetailField label="Name" value={school.dean.firstName} />
                                            <DetailField label="Email" value={school.dean.email} />
                                            <DetailField label="Contact" value={school.dean.contact} />
                                        </View>
                                    </View>
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                            No Dean Yet
                                        </Text>

                                        <Button onPress={() => {setDeanOperation(true); toggleModal();}}>Appoint Dean</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText }}>DEPARTMENTS</Text>
                            {school.departments.length > 0 
                                ? (
                                    <FlatList  
                                        contentContainerStyle={{ width: '95%', alignSelf: 'center' }}
                                        data={school.departments}
                                        keyExtractor={({ id }) => String(id)}
                                        renderItem={({item}) => (
                                            <DepartmentCard
                                                id={item.id} 
                                                schoolCode={school.code}
                                                uniqueIdentifier={item.code}
                                                name={item.name}
                                                head={item.head ? `${item.head?.firstName} ${item.head?.lastName}` : 'Vacant'}
                                            />
                                        )}
                                        ListFooterComponent={<Button onPress={() => {setDepartmentOperation(true); toggleModal();}}>Create New Department</Button>}
                                    />
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: Colours[customTheme].inverseText, margin: '2%' }}>
                                            No Departments Yet
                                        </Text>

                                        <Button onPress={() => {setDepartmentOperation(true); toggleModal();}}>Create Department</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Button buttonColor="red" textColor={Colours[customTheme].text} onPress={() => {setDeleteOperation(true); toggleModal();}}>Delete School</Button>
                    </View>
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>
                        {`School ${schoolCode} does not exist!`}
                    </Text>
                )
            }

            <CustomModal 
                modalVisible={modalVisible}
                toggleModal={toggleModal} 
                onRequestCloseOperations={() => {
                    setDeleteOperation(false);
                    setDepartmentOperation(false);
                    setDeanOperation(false);
                }} 
            >
                {schoolToEdit && <AllSchoolOperations schoolName={school?.name} {...{ toggleModal, schoolID, schoolToEdit, deleteOperation, setDeleteOperation, handleDelete, departmentOperation, deanOperation }} />}
            </CustomModal>
        </SafeAreaView>
    );
}