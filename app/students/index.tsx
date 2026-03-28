import CustomModal from "@/components/shared/CustomModal";
import FloatingActionButton from "@/components/shared/Fab";
import StudentForm from "@/components/students/Form";
import { useTheme } from "@/lib/Theme";
import { getAllStudents } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { useEffect, useState} from "react";
import { FlatList, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StudentTypes } from "@/lib/Database/Schema";
import Personcard from "@/components/PersonCard";

export default function StudentsPage() {
    const { colours } = useTheme();
    const { database } = useDatabase();
    const students = StateStore(state => state.students);
    const setStudents = StateStore(state => state.setStudents);

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(prev => !prev);

    useEffect(() => {
        (async () => {
            const { success, message, response } = await getAllStudents(database);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
            }
            const students = response as StudentTypes[];
            setStudents(students);
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: colours.background }}>
            {students?.length > 0
                ? (
                    <FlatList  
                        data={students}
                        keyExtractor={({ regNo }) => regNo}
                        renderItem={({item}) => (
                            <Personcard 
                                id={item.id} 
                                table="students" 
                                uniqueIdentifier={item.regNo} 
                                fullName={item.fullName}
                            />
                        )}
                    />
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: colours.text }}>No Students Currently Enrolled</Text>
                )
            }

            <CustomModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                onRequestCloseOperations={() => {}}
            >
                <StudentForm setModalVisible={setModalVisible} />
            </CustomModal>

            <FloatingActionButton 
                backgroundColor={colours.inverseBackground}
                color={colours.inverseText} 
                onPress={() => toggleModal()} 
            />
        </SafeAreaView>
    );
}