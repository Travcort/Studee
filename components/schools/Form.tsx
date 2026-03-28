import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTheme } from "@/lib/Theme";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { editSchoolDetails, getAllSchools, newSchool } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { NewSchoolTypes, SchoolTypes } from "@/lib/Database/Schema";
import DropdownMenu from "../shared/DropdownMenu";

const schoolKeys: (keyof NewSchoolTypes)[] = [
    "name",
    "code",
    "deanID"
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

const formLabels: Record<keyof NewSchoolTypes, FormLabelType> = {
    name: {
        label: 'School Name',
        icon: 'school',
        type: 'text'
    },
    code: {
        label: 'School Code',
        icon: 'barcode',
        type: 'text'
    },
    deanID: {
        label: 'Dean',
        icon: 'account-tie',
        type: 'text'
    }
};

const SchoolForm = ({ schoolToEdit, setModalVisible }: { schoolToEdit?: SchoolTypes, setModalVisible: Dispatch<SetStateAction<boolean>> }) => {
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    const setStateSchools = StateStore(state => state.setSchools);
    const stateLecturers = StateStore(state => state.lecturers);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const initialSchoolState = schoolToEdit 
    ?? {
        name: '',
        code: '',
        deanID: null,
    };

    const [school, setSchool] = useState<SchoolTypes|NewSchoolTypes>(initialSchoolState);

    const handleChange = <K extends keyof SchoolTypes>(key: K, value: string|number|null) => {
        setSchool((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        let result;

        if(schoolToEdit) {
            const updatedSchool = {
                ...schoolToEdit,
                ...school
            }
            result = await editSchoolDetails(database, updatedSchool);
        } else {
            result = await newSchool(database, school);
        }

        const { success, message } = result;
        
        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setSchool(initialSchoolState);
        const { response } = await getAllSchools(database);
        if (response) setStateSchools(response);
        toggleRefreshMetricsToken();

        setModalVisible(false);
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: colours.inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: colours.inverseText }}>School Creation</Text>

            {schoolKeys
            .map(key => (
                <View key={key} style={[styles.inputWrapper, { borderRadius: spacing.borderRadius }]}>
                    <IconButton icon={formLabels[key].icon} size={30} iconColor={colours.text}
                        style={{ borderTopLeftRadius: spacing.borderRadius, borderBottomLeftRadius: spacing.borderRadius, backgroundColor: colours.background }} 
                    />
                    {key === "deanID" 
                        ? (
                            school.deanID 
                            ? (
                                <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Text style={{ color: colours.inverseText }}>{school[key]}</Text>
                                    <IconButton icon="alpha-x-box" iconColor={colours.inverseText} onPress={() => handleChange(key, null)} />
                                </View>
                            )
                            : (
                                <DropdownMenu
                                    trigger={() => (
                                        <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, color: colours.placeholderText }}>School Dean</Text>
                                            <MaterialCommunityIcons name="arrow-expand-down" size={28} color={colours.placeholderText } />
                                        </View>
                                    )}
                                    items={stateLecturers.length > 0 
                                        ? (
                                            stateLecturers.map((e) => ({ 
                                                label: e.fullName, 
                                                onPress: () => handleChange(key, e.id) 
                                            }))
                                        ) 
                                        : ([{ label: "No Lecturers enrolled", onPress: () => ToastAndroid.show("Where are your managerial skills?", ToastAndroid.SHORT)}])
                                    }
                                />
                            )
                        ) 
                        : (
                            <TextInput
                                style={[
                                    styles.input, 
                                    {
                                        color: colours.inverseText,
                                        borderRadius: spacing.borderRadius
                                    }
                                ]}
                                inputMode={formLabels[key].type}
                                autoCapitalize="characters"
                                placeholder={formLabels[key].label}
                                value={school[key]}
                                onChangeText={(text) => handleChange(key, text)}
                                placeholderTextColor={colours.placeholderText}
                            />
                        )
                    }
                </View>
            ))}

            <Button textColor={colours.text} buttonColor={colours.background} 
                onPress={handleEnrollment}
            >
                {schoolToEdit ? 'Update School Details' : 'Create School' }
            </Button>
        </ScrollView>
    );
}

export default SchoolForm;

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