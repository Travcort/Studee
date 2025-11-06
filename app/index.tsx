import Chip from "@/components/shared/Chip";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { getAllDepartmentsCount, getAllLecturers, getAllSchools, getAllStudents } from "@/lib/Database/Operations";
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

    const [metrics, setMetrics] = useState({ schools: 0, departments: 0, lecturers: 0, students: 0 });

    useEffect(() => {
      (async() => {
        const schools = await getAllSchools(database, true);
        const departments = await getAllDepartmentsCount(database);
        const students = await getAllStudents(database);
        const lecturers = await getAllLecturers(database, true);
        setMetrics({ 
          schools: schools.count ?? 0, 
          departments: departments.count ?? 0, 
          lecturers: lecturers.count ?? 0, 
          students: students?.response?.length ?? 0 
        });
      })();
    }, [refreshMetricsToken]);

    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Colours[customTheme].background }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap',  justifyContent: 'space-between', alignItems: 'center', gap: '2%' }}>
          <Chip label="Schools" lines={2} badge={metrics.schools} onPress={() => router.navigate('/schools')} />
          <Chip label="Departments" lines={2} badge={metrics.departments} onPress={() => router.navigate('/schools')} />
          <Chip label="Students Enrolled" lines={2} badge={metrics.students} onPress={() => router.navigate('/students')} />
          <Chip label="Total Lecturers" lines={2} badge={metrics.lecturers} onPress={() => router.navigate('/lecturers')} />
        </View>
      </SafeAreaView>
    );
}