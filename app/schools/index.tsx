import CustomModal from "@/components/shared/CustomModal";
import FloatingActionButton from "@/components/shared/Fab";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { getAllSchools } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { useEffect, useState} from "react";
import { FlatList, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SchoolTypes } from "@/lib/Database/Schema";
import SchoolCard from "@/components/schools/SchoolCard";
import SchoolForm from "@/components/schools/SchoolForm";

export default function SchoolsPage() {
    const { customTheme } = useMyAppContext();
    const { database } = useDatabase();
    const stateSchools = StateStore(state => state.schools);
    const setStateSchools = StateStore(state => state.setSchools);
    const stateLecturers = StateStore(state => state.lecturers); 

    const enrichedSchools = stateSchools.map(school => {
        const dean = stateLecturers.find(lecturer => lecturer.id === school.deanID);
        return {
            ...school,
            deanName: dean ? `${dean.firstName} ${dean.lastName}` : 'Vacant',
        };
    });

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(prev => !prev);

    useEffect(() => {
        (async () => {
            const { success, message, response } = await getAllSchools(database);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
            }
            const schools = response as SchoolTypes[];
            setStateSchools(schools);
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Colours[customTheme].background }}>
            {stateSchools?.length > 0
                ? (
                    <FlatList  
                        data={enrichedSchools}
                        keyExtractor={({ id }) => String(id)}
                        renderItem={({item}) => (
                            <SchoolCard
                                id={item.id} 
                                uniqueIdentifier={item.code}
                                name={item.name}
                                dean={item.deanName}
                            />
                        )}
                    />
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>No School Has Been Established Yet</Text>
                )
            }

            <CustomModal 
                modalVisible={modalVisible} 
                toggleModal={toggleModal}
                onRequestCloseOperations={() => {}}
            >
                <SchoolForm toggleModal={toggleModal} />
            </CustomModal>

            <FloatingActionButton 
                backgroundColor={Colours[customTheme].inverseBackground}
                color={Colours[customTheme].inverseText} 
                onPress={() => toggleModal()} 
            />
        </SafeAreaView>
    );
}