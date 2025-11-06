import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { useState } from "react";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PhotoUploadInput from "../shared/PhotoUploadInput";
import { getAllLecturers } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { LecturerTypes } from "@/lib/Database/Schema";
import DateSelector from "../shared/DateSelector";

const lecturerKeys: (keyof LecturerTypes)[] = [
    "staffNo",
    "firstName",
    "lastName",
    "gender",
    "dob",
    "contact",
    "email",
    "address",
    "employmentDate",
    "photoUri",
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

const formLabels: Record<keyof LecturerTypes, FormLabelType> = {
    id: {
        label: 'ID',
        icon: 'account-outline',
        type: 'none'
    },
    staffNo: {
        label: 'Staff Number',
        icon: 'account',
        type: 'text'
    },
    firstName: {
        label: 'First Name',
        icon: 'account-edit',
        type: 'text'
    },
    lastName: {
        label: 'Last Name',
        icon: 'account-edit-outline',
        type: 'text'
    },
    gender: {
        label: 'Gender',
        icon: 'gender-male-female',
        type: 'text'
    },
    dob: {
        label: 'Date of Birth',
        icon: 'calendar-month',
        type: 'text'
    },
    contact: {
        label: 'Telephone Number',
        icon: 'phone',
        type: 'tel'
    },
    email: {
        label: 'Email',
        icon: 'email',
        type: 'email'
    },
    address: {
        label: 'Address',
        icon: 'map-marker',
        type: 'text'
    },
    employmentDate: {
        label: 'Employed',
        icon: 'school',
        type: 'text'
    },
    departmentID: {
        label: 'Department',
        icon: 'school',
        type: 'text'
    },
    photoUri: {
        label: 'Photo',
        icon: 'camera',
        type: 'text'
    }
};

const LecturerForm = ({ lecturerToEdit, toggleModal }: { lecturerToEdit?: LecturerTypes, toggleModal: () => void }) => {
    const { customTheme, customBorderRadius } = useMyAppContext();
    const { database } = useDatabase();
    const setStateLecturers = StateStore(state => state.setLecturers);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const initialLecturerState = lecturerToEdit 
    ?? {
        staffNo: '',
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        gender: '',
        dob: '',
        employmentDate: '',
        address: '',
        photoUri: ''
    };

    const [lecturer, setLecturer] = useState<Omit<LecturerTypes, "id" | "departmentID">>(initialLecturerState);

    const [activeCalendar, setActiveCalendar] = useState<string|null>(null);
    const toggleCalendarModal = (key: string) => {
        setActiveCalendar(prev => prev === key ? null : key);
    };

    const handleChange = <K extends keyof LecturerTypes>(key: K, value: string) => {
        setLecturer((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        const { success, message } = await (lecturerToEdit ? editLecturerDetails(database, lecturer) : newLecturer(database, lecturer));
        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setLecturer(initialLecturerState);
        const { response } = await getAllLecturers(database);
        if (response) setStateLecturers(response);
        toggleRefreshMetricsToken();

        toggleModal();
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: Colours[customTheme].inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: Colours[customTheme].inverseText }}>Lecturer Enrollment</Text>

            {lecturerKeys
            .filter((e) => !e.includes("staffNo"))
            .map(key => (
                key === 'photoUri' 
                ? (
                    <PhotoUploadInput key={key}
                        photoUri={lecturer.photoUri}
                        onChange={(uri) => handleChange('photoUri', uri)}
                    />
                ) 
                : (key === 'dob')
                ? (
                    <DateSelector key={key} 
                        entityToEdit={lecturerToEdit}
                        activeCalendar={activeCalendar} 
                        toggleCalendarModal={() => toggleCalendarModal(key)} 
                        property={key} handleChange={handleChange}
                    />
                )
                : (
                    <View key={key} style={[styles.inputWrapper, { borderRadius: customBorderRadius }]}>
                        <IconButton icon={formLabels[key].icon} size={30} iconColor={Colours[customTheme].text}
                            style={{ borderTopLeftRadius: customBorderRadius, borderBottomLeftRadius: customBorderRadius, backgroundColor: Colours[customTheme].background }} 
                        />
                        <TextInput
                            style={[
                                styles.input, 
                                {
                                    backgroundColor: lecturerToEdit && key === 'staffNo' ? Colours[customTheme].placeholderText : 'none', 
                                    color: Colours[customTheme].inverseText,
                                    borderRadius: customBorderRadius
                                }
                            ]}
                            inputMode={formLabels[key].type}
                            placeholder={formLabels[key].label}
                            value={lecturer[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            placeholderTextColor={Colours[customTheme].placeholderText}
                            editable={!(lecturerToEdit && key === 'staffNo')}
                        />
                    </View>
                )
            ))}

            <Button textColor={Colours[customTheme].text} buttonColor={Colours[customTheme].background} 
                onPress={handleEnrollment}
            >
                {lecturerToEdit ? 'Update Lecturer Details' : 'Enroll Lecturer' }
            </Button>
        </ScrollView>
    );
}

export default LecturerForm;

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