import Chip from "@/components/shared/Chip";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { getAllStudents } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
    const { customTheme } = useMyAppContext();
    const { database } = useDatabase();
    const router = useRouter();
    const refreshMetricsToken = StateStore(state => state.refreshMetricsToken);

    const [metrics, setMetrics] = useState({ students: 0, teachers: 0 });

    useEffect(() => {
      (async() => {
        const students = await getAllStudents(database);
        setMetrics({ students: students?.response?.length ?? 0, teachers: 0 })
      })();
    }, [refreshMetricsToken]);

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Colours[customTheme].background }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Chip label="Students Enrolled" lines={2} badge={metrics.students} onPress={() => router.navigate('/students')} />
            <Chip label="Teachers Enrolled" lines={2} badge={metrics.teachers} />
          </View>
        </SafeAreaView>
    );
}