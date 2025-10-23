import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { useState } from "react";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PhotoUploadInput from "../shared/PhotoUploadInput";
import DateSelector from "./DateSelector";
import { editStudentDetails, newStudent, getAllStudents, StudentTypes } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";

const studentKeys: (keyof StudentTypes)[] = [
    "regNo",
    "firstName",
    "lastName",
    "gender",
    "dob",
    "contact",
    "email",
    "address",
    "enrollmentDate",
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

const formLabels: Record<keyof StudentTypes, FormLabelType> = {
    regNo: {
        label: 'Registration Number',
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
    enrollmentDate: {
        label: 'Class',
        icon: 'school',
        type: 'text'
    },
    photoUri: {
        label: 'Photo',
        icon: 'camera',
        type: 'text'
    }
};

const StudentForm = ({ studentToEdit, toggleModal }: { studentToEdit?: StudentTypes, toggleModal: () => void }) => {
    const { customTheme, customBorderRadius } = useMyAppContext();
    const { database } = useDatabase();
    const setStudents = StateStore(state => state.setStudents);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const initialStudentState = studentToEdit 
    ?? {
        regNo: '',
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        gender: '',
        dob: '',
        enrollmentDate: '',
        address: '',
        photoUri: ''
    };

    const [student, setStudent] = useState<StudentTypes>(initialStudentState);

    const [activeCalendar, setActiveCalendar] = useState<string|null>(null);
    const toggleCalendarModal = (key: string) => {
        setActiveCalendar(prev => prev === key ? null : key);
    };

    const handleChange = <K extends keyof StudentTypes>(key: K, value: string) => {
        setStudent((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        const { success, message } = await (studentToEdit ? editStudentDetails(database, student) : newStudent(database, student));
        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setStudent(initialStudentState);
        const { response } = await getAllStudents(database);
        if (response) setStudents(response);
        toggleRefreshMetricsToken();

        toggleModal();
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: Colours[customTheme].inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: Colours[customTheme].inverseText }}>Student Enrollment</Text>

            {studentKeys.map(key => (
                key === 'photoUri' 
                ? (
                    <PhotoUploadInput key={key}
                        photoUri={student.photoUri}
                        onChange={(uri) => handleChange('photoUri', uri)}
                    />
                ) 
                : (key === 'dob' || key === 'enrollmentDate')
                ? (
                    <DateSelector key={key} studentToEdit={studentToEdit}
                        activeCalendar={activeCalendar} toggleCalendarModal={() => toggleCalendarModal(key)} property={key} handleChange={handleChange}
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
                                    backgroundColor: studentToEdit && key === 'regNo' ? Colours[customTheme].placeholderText : 'none', 
                                    color: Colours[customTheme].inverseText,
                                    borderRadius: customBorderRadius
                                }
                            ]}
                            inputMode={formLabels[key].type}
                            placeholder={formLabels[key].label}
                            value={student[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            placeholderTextColor={Colours[customTheme].placeholderText}
                            editable={!(studentToEdit && key === 'regNo')}
                        />
                    </View>
                )
            ))}

            <Button textColor={Colours[customTheme].text} buttonColor={Colours[customTheme].background} 
                onPress={handleEnrollment}
            >
                {studentToEdit ? 'Update Student Details' : 'Enroll Student' }
            </Button>
        </ScrollView>
    );
}

export default StudentForm;

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