import { FlatList, ToastAndroid } from "react-native";
import LecturerCard from "./Card";
import { useEffect, useState } from "react";
import { getAllLecturers } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import { LecturerTypes } from "@/lib/Database/Schema";

export default function LecturersList () {
    const { database } = useDatabase();

    const [allLecturers, setAllLecturers] = useState<LecturerTypes[] | null>(null);

    useEffect(() => {
        (async () => {
            const { success, message, response } = await getAllLecturers(database);
            if(!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
            }
            const allLecturers = response as LecturerTypes[];
            setAllLecturers(allLecturers);
        })();
    }, []);

    return (
        <FlatList 
            data={allLecturers}
            renderItem={({ item }) => (
                <LecturerCard 
                    id={item.id}
                    name={item.fullName}
                    uniqueIdentifier={item.staffNo}
                    staffNo={item.staffNo}
                />
            )}
        />
    );
}