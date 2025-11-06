import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { useState } from "react";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { editDepartment, getAllDepartments, newDepartment } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { DepartmentTypes, NewDepartmentTypes } from "@/lib/Database/Schema";
import DropdownMenu from "../shared/DropdownMenu";

const departmentKeys: (keyof DepartmentTypes)[] = [
    "id",
    "name",
    "code",
    "schoolID",
    "headID"
];

type KeyboardType =
| 'decimal'
| 'email'
| 'none'
| 'numeric'
| 'search'
| 'tel'
| 'text'
| 'url';

type FormLabelType = {
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    type: KeyboardType;
};

const formLabels: Record<keyof DepartmentTypes, FormLabelType> = {
    id: {
        label: 'ID',
        icon: 'identifier',
        type: 'text'
    },
    name: {
        label: 'Department Name',
        icon: 'school',
        type: 'text'
    },
    code: {
        label: 'Department Code',
        icon: 'barcode',
        type: 'text'
    },
    schoolID: {
        label: 'School',
        icon: 'account-tie',
        type: 'text'
    },
    headID: {
        label: 'Department Head',
        icon: 'account-tie',
        type: 'text'
    },
    started: {
        label: 'Started',
        icon: 'calendar-start',
        type: 'text'
    }
};

const DepartmentForm = ({ schoolID, departmentToEdit, toggleModal }: { schoolID: number, departmentToEdit?: DepartmentTypes, toggleModal: () => void }) => {
    const { customTheme, customBorderRadius } = useMyAppContext();
    const { database } = useDatabase();
    const stateLecturers = StateStore(state => state.lecturers);
    const setStateDepartments = StateStore(state => state.setDepartments);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const refreshSchoolDetailsToken = StateStore(state => state.refreshSchoolDetailsToken);

    const initialDepartmentState = departmentToEdit 
    ?? {
        name: '',
        code: '',
        schoolID: schoolID,
        headID: null,
    };

    const [department, setDepartment] = useState<DepartmentTypes|NewDepartmentTypes>(initialDepartmentState);

    const handleChange = <K extends keyof DepartmentTypes>(key: K, value: string|number|null) => {
        setDepartment((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        const { success, message } = await (departmentToEdit ? editDepartment(database, department) : newDepartment(database, department));
        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setDepartment(initialDepartmentState);
        const { response } = await getAllDepartments(database, schoolID);
        if (response) setStateDepartments(response);
        toggleRefreshMetricsToken();
        refreshSchoolDetailsToken();

        toggleModal();
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: Colours[customTheme].inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: Colours[customTheme].inverseText }}>Department Form</Text>

            {departmentKeys
            .filter((key) => key !== "id" && key !== "started" && key !== "schoolID")
            .map(key => (
                <View key={key} style={[styles.inputWrapper, { borderRadius: customBorderRadius }]}>
                    <IconButton icon={formLabels[key].icon} size={30} iconColor={Colours[customTheme].text}
                        style={{ borderTopLeftRadius: customBorderRadius, borderBottomLeftRadius: customBorderRadius, backgroundColor: Colours[customTheme].background }} 
                    />
                    {key === "headID" 
                        ? (
                            department.headID 
                            ? (
                                <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Text style={{ color: Colours[customTheme].inverseText }}>{school[key]}</Text>
                                    <IconButton icon="alpha-x-box" iconColor={Colours[customTheme].inverseText} onPress={() => handleChange(key, null)} />
                                </View>
                            )
                            : (
                                <DropdownMenu
                                    trigger={() => (
                                        <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, color: Colours[customTheme].placeholderText }}>School Dean</Text>
                                            <MaterialCommunityIcons name="arrow-expand-down" size={28} color={Colours[customTheme].placeholderText } />
                                        </View>
                                    )}
                                    items={stateLecturers.length > 0 
                                        ? (
                                            stateLecturers.map((e) => ({ 
                                                label: `${e.firstName} ${e.lastName}`, 
                                                onPress: () => handleChange(key, e.id) 
                                            }))
                                        ) 
                                        : ([{ label: "No Lecturers available for appointment as Dean", onPress: () => ToastAndroid.show("Where are your managerial skills?", ToastAndroid.SHORT)}])
                                    }
                                />
                            )
                        ) 
                        : (
                            <TextInput
                                style={[
                                    styles.input, 
                                    {
                                        // backgroundColor: departmentToEdit && key === 'id' ? Colours[customTheme].placeholderText : 'none', 
                                        color: Colours[customTheme].inverseText,
                                        borderRadius: customBorderRadius
                                    }
                                ]}
                                inputMode={formLabels[key].type}
                                autoCapitalize="characters"
                                placeholder={formLabels[key].label}
                                value={department[key]}
                                onChangeText={(text) => handleChange(key, text)}
                                placeholderTextColor={Colours[customTheme].placeholderText}
                                editable={!departmentToEdit}
                            />
                        )
                    }
                </View>
            ))}

            <Button textColor={Colours[customTheme].text} buttonColor={Colours[customTheme].background} 
                onPress={handleEnrollment}
            >
                {departmentToEdit ? 'Update Department Details' : 'Create Department' }
            </Button>
        </ScrollView>
    );
}

export default DepartmentForm;

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: `${2}%`
  },
  input: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 10,
    fontSize: 16,
  }
});