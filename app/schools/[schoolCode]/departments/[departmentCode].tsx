import AllDepartmentOperations from "@/components/departments/AllOperations";
import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CustomModal from "@/components/shared/CustomModal";
import DetailField from "@/components/shared/DetailField";
import IconButton from "@/components/shared/IconButton";
import Personcard from "@/components/PersonCard";
import { useTheme } from "@/lib/Theme";
import { deleteDepartment } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import { DepartmentTypes } from "@/lib/Database/Schema";
import StateStore, { DepartmentDetails } from "@/lib/State";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CourseCard from "@/components/courses/Card";

export default function Department() {
    const { departmentCode, departmentID } = useLocalSearchParams<{ departmentCode: string; departmentID: string }>();
    const router = useRouter();
    const { database } = useDatabase();
    const { colours } = useTheme();
    
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
    const [coursesOperation, setCoursesOperation] = useState(false);
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
            setModalVisible(false);
            router.dismiss();
        })();
    };
    
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.background }}>
            {department
                ? (
                    <View style={{ gap: '2%', alignItems: 'center' }}>
                        <Card>
                            <View style={{ position: "relative", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "700", color: colours.inverseText }}>
                                    {department.name}
                                </Text>

                                <IconButton
                                    icon="account-edit"
                                    iconColor={colours.inverseText}
                                    onPress={() =>  setModalVisible(true)}
                                    style={{
                                        position: "absolute",
                                        top: '20%',
                                        right: '2%',
                                        zIndex: 1,
                                    }}
                                />
                            </View>

                            <Text style={{ fontSize: 14, color: colours.placeholderText, marginTop: 4 }}>
                                Code: {department.code}
                            </Text>

                            <Text style={{ fontSize: 13, color: colours.placeholderText }}>
                                Established: {new Date(department.started).toLocaleDateString()}
                            </Text>
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText, margin: '2%' }}>
                                The Department Head
                            </Text>
                            {department.head
                                ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                                        <Avatar 
                                            uri={department.head.photoUri}
                                            name={department.head.fullName ?? 'Not Available'}
                                            size={72}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <DetailField label="Name" value={department.head.fullName} />
                                            <DetailField label="Email" value={department.head.email} />
                                            <DetailField label="Contact" value={department.head.contact} />
                                        </View>
                                    </View>
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText, margin: '2%' }}>
                                            No Department Head Yet
                                        </Text>

                                        <Button onPress={() => {setDepartmentHeadOperation(true); setModalVisible(true);}}>Appoint Department Head</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText }}>LECTURERS</Text>
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
                                                fullName={item.fullName}
                                            />
                                        )}
                                        ListFooterComponent={<Button onPress={() => {setLecturersOperation(true); setModalVisible(true);}}>Add New Lecturer</Button>}
                                    />
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText, margin: '2%' }}>
                                            No Department Lecturers Yet
                                        </Text>

                                        <Button onPress={() => {setLecturersOperation(true); setModalVisible(true);}}>Add Lecturer</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Card>
                            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText }}>COURSES</Text>
                            {department.courses.length > 0 
                                ? (
                                    <FlatList  
                                        contentContainerStyle={{ width: '95%', alignSelf: 'center' }}
                                        data={department.courses}
                                        keyExtractor={({ id }) => String(id)}
                                        renderItem={({item}) => (
                                            <CourseCard
                                                id={item.id} 
                                                schoolCode={schoolDetails?.code!} // Trust me Bro!! TODO: Come up with a better solution
                                                departmentCode={item.code}
                                                uniqueIdentifier={item.code}
                                                name={item.name}
                                            />
                                        )}
                                        ListFooterComponent={<Button onPress={() => {setCoursesOperation(true); setModalVisible(true);}}>Create New Course</Button>}
                                    />
                                ) 
                                : (
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: "600", color: colours.inverseText, margin: '2%' }}>
                                            No Courses Yet
                                        </Text>

                                        <Button onPress={() => {setCoursesOperation(true); setModalVisible(true);}}>Create Course</Button>
                                    </View>
                                )
                            }
                        </Card>

                        <Button buttonColor="red" textColor={colours.text} onPress={() => {setDeleteOperation(true); setModalVisible(true);}}>
                            Delete Department
                        </Button>
                    </View>
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: colours.text }}>
                        {`Department ${departmentCode} does not exist!`}
                    </Text>
                )
            }

            <CustomModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                onRequestCloseOperations={() => {
                    setDeleteOperation(false);
                    setDepartmentHeadOperation(false);
                    setLecturersOperation(false);
                }}
            >
                {department && departmentToEdit &&
                    <AllDepartmentOperations
                        departmentID={Number(departmentID)}
                        departmentName={department.name} 
                        {...{ schoolID, setModalVisible, 
                                departmentToEdit, deleteOperation, setDeleteOperation, handleDelete, 
                                departmentHeadOperation, lecturersOperation, coursesOperation 
                        }} 
                    />
                }
            </CustomModal>
        </SafeAreaView>
    );
}