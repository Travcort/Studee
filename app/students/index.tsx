import CustomModal from "@/components/shared/CustomModal";
import FloatingActionButton from "@/components/shared/Fab";
import StudentForm from "@/components/students/StudentForm";
import Studentcard from "@/components/students/StudentCard";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { getAllStudents, StudentTypes } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { useEffect, useState} from "react";
import { FlatList, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentsPage() {
    const { customTheme } = useMyAppContext();
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
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Colours[customTheme].background }}>
            {students?.length > 0
                ? (
                    <FlatList  
                        data={students}
                        keyExtractor={({ regNo }) => regNo}
                        renderItem={({item}) => (
                            <Studentcard item={item} />
                        )}
                    />
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>No Students Currently Enrolled</Text>
                )
            }

            <CustomModal modalVisible={modalVisible} toggleModal={toggleModal}>
                <StudentForm toggleModal={toggleModal} />
            </CustomModal>

            <FloatingActionButton 
                backgroundColor={Colours[customTheme].inverseBackground}
                color={Colours[customTheme].inverseText} 
                onPress={() => toggleModal()} 
            />
        </SafeAreaView>
    );
}