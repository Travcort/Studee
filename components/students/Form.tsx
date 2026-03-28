import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTheme } from "@/lib/Theme";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PhotoUploadInput from "../shared/PhotoUploadInput";
import { editStudentDetails, newStudent, getAllStudents } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { NewStudentTypes, StudentTypes } from "@/lib/Database/Schema";
import DateSelector from "../shared/DateSelector";

const studentKeys: (keyof NewStudentTypes)[] = [
    "regNo",
    "fullName",
    "gender",
    "dob",
    "contact",
    "email",
    "address",
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

const formLabels: Record<keyof NewStudentTypes, FormLabelType> = {
    regNo: {
        label: 'Registration Number',
        icon: 'account',
        type: 'text'
    },
    fullName: {
        label: 'Full Name',
        icon: 'account-edit',
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
    photoUri: {
        label: 'Photo',
        icon: 'camera',
        type: 'text'
    }
};

const StudentForm = ({ studentToEdit, setModalVisible }: { studentToEdit?: StudentTypes, setModalVisible: Dispatch<SetStateAction<boolean>> }) => {
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    const setStudents = StateStore(state => state.setStudents);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const initialStudentState = studentToEdit
        ? {
            regNo: studentToEdit.regNo,
            fullName: studentToEdit.fullName,
            email: studentToEdit.email,
            contact: studentToEdit.contact,
            gender: studentToEdit.gender,
            dob: studentToEdit.dob,
            address: studentToEdit.address,
            photoUri: studentToEdit.photoUri,
        }
        : {
            regNo: '',
            fullName: '',
            email: '',
            contact: '',
            gender: '',
            dob: '',
            address: '',
            photoUri: ''
        };

    const [student, setStudent] = useState<NewStudentTypes>(initialStudentState);

    const [activeCalendar, setActiveCalendar] = useState<string|null>(null);
    const toggleCalendarModal = (key: string) => {
        setActiveCalendar(prev => prev === key ? null : key);
    };

    const handleChange = <K extends keyof StudentTypes>(key: K, value: string) => {
        setStudent((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        let result;

        if (studentToEdit) {
            const updatedStudent = {
                ...studentToEdit,
                ...student
            };

            result = await editStudentDetails(database, updatedStudent);
        } else {
            result = await newStudent(database, student);
        }

        const { success, message } = result;

        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }

        setStudent(initialStudentState);

        const { response } = await getAllStudents(database);
        if (response) setStudents(response);

        toggleRefreshMetricsToken();
        setModalVisible(false);

        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: colours.inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: colours.inverseText }}>Student Enrollment</Text>

            {studentKeys
            .filter((e) => !e.includes("regNo"))
            .map(key => (
                key === 'photoUri' 
                ? (
                    <PhotoUploadInput key={key}
                        photoUri={student.photoUri}
                        onChange={(uri) => handleChange('photoUri', uri)}
                    />
                ) 
                : (key === 'dob')
                ? (
                    <DateSelector key={key} 
                        entityToEdit={studentToEdit}
                        activeCalendar={activeCalendar} 
                        toggleCalendarModal={() => toggleCalendarModal(key)} 
                        property={key} handleChange={handleChange}
                    />
                )
                : (
                    <View key={key} style={[styles.inputWrapper, { borderRadius: spacing.borderRadius }]}>
                        <IconButton icon={formLabels[key].icon} size={30} iconColor={colours.text}
                            style={{ borderTopLeftRadius: spacing.borderRadius, borderBottomLeftRadius: spacing.borderRadius, backgroundColor: colours.background }} 
                        />
                        <TextInput
                            style={[
                                styles.input, 
                                {
                                    backgroundColor: studentToEdit && key === 'regNo' ? colours.placeholderText : 'none', 
                                    color: colours.inverseText,
                                    borderRadius: spacing.borderRadius
                                }
                            ]}
                            inputMode={formLabels[key].type}
                            placeholder={formLabels[key].label}
                            value={student[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            placeholderTextColor={colours.placeholderText}
                            editable={!(studentToEdit && key === 'regNo')}
                        />
                    </View>
                )
            ))}

            <Button textColor={colours.text} buttonColor={colours.background} 
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