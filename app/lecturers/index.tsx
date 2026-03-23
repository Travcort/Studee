import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { getAllLecturers } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { useEffect } from "react";
import { FlatList, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LecturerTypes } from "@/lib/Database/Schema";
import Personcard from "@/components/PersonCard";

export default function LecturersPage() {
    const { customTheme } = useMyAppContext();
    const { database } = useDatabase();
    const lecturers = StateStore(state => state.lecturers);
    const setLecturers = StateStore(state => state.setLecturers);

    useEffect(() => {
        (async () => {
            const { success, message, response } = await getAllLecturers(database);
            if(!success && message) {
                ToastAndroid.show(message, ToastAndroid.LONG);
            }
            const lecturers = response as LecturerTypes[];
            setLecturers(lecturers);
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Colours[customTheme].background }}>
            {lecturers?.length > 0
                ? (
                    <FlatList  
                        data={lecturers}
                        keyExtractor={({ staffNo }) => staffNo}
                        renderItem={({item}) => (
                            <Personcard 
                                id={item.id} 
                                table="lecturers" 
                                uniqueIdentifier={item.staffNo} 
                                fullName={item.fullName}
                            />
                        )}
                    />
                ) 
                : (
                    <Text style={{ alignSelf: 'center', marginTop: '80%', fontSize: 18, fontWeight: 'bold', color: Colours[customTheme].text }}>No Lecturers Currently Enrolled</Text>
                )
            }
        </SafeAreaView>
    );
}