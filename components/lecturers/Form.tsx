import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "@/lib/Theme";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PhotoUploadInput from "../shared/PhotoUploadInput";
import { editLecturerDetails, getAllLecturers, newLecturer } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { LecturerTypes, NewLecturerTypes } from "@/lib/Database/Schema";
import DateSelector from "../shared/DateSelector";

const lecturerKeys: (keyof NewLecturerTypes)[] = [
    "staffNo",
    "fullName",
    "gender",
    "dob",
    "contact",
    "email",
    "address",
    "departmentID",
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

const formLabels: Record<keyof NewLecturerTypes, FormLabelType> = {
    staffNo: {
        label: 'Staff Number',
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

const LecturerForm = ({ departmentID, lecturerToEdit, setModalVisible }: { departmentID: number, lecturerToEdit?: LecturerTypes, setModalVisible: Dispatch<SetStateAction<boolean>> }) => {
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    
    const schoolDetails = StateStore(state => state.schoolDetails);
    const setStateLecturers = StateStore(state => state.setLecturers);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);

    const initialLecturerState = lecturerToEdit 
    ? {
        staffNo: lecturerToEdit.staffNo,
        fullName: lecturerToEdit.fullName,
        email: lecturerToEdit.email,
        contact: lecturerToEdit.contact,
        gender: lecturerToEdit.gender,
        dob: lecturerToEdit.dob,
        departmentID: lecturerToEdit.departmentID,
        address: lecturerToEdit.address,
        photoUri: lecturerToEdit.photoUri
    }
    : {
        staffNo: '',
        fullName: '',
        email: '',
        contact: '',
        gender: '',
        dob: '',
        departmentID: departmentID,
        address: '',
        photoUri: ''
    };

    const [allLecturers, setAllLecturers] = useState<LecturerTypes[] | null>(null);
    const [lecturer, setLecturer] = useState<NewLecturerTypes>(initialLecturerState);

    const [activeCalendar, setActiveCalendar] = useState<string|null>(null);
    const toggleCalendarModal = (key: string) => {
        setActiveCalendar(prev => prev === key ? null : key);
    };

    const handleChange = <K extends keyof LecturerTypes>(key: K, value: string) => {
        setLecturer((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        let result;
        
        if (lecturerToEdit) {
            const updatedLecturer = {
                ...lecturerToEdit,
                lecturer
            }
            result = await editLecturerDetails(database, updatedLecturer);
        } else {
            result = await newLecturer(database, lecturer);
        }

        const { success, message } = result;

        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setLecturer(initialLecturerState);
        const { response } = await getAllLecturers(database);
        if (response) setStateLecturers(response);
        toggleRefreshMetricsToken();

        setModalVisible(false);
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    useEffect(() => {
        (async () => {
            const { success, message, response } = await getAllLecturers(database);
            if (!success) {
                ToastAndroid.show(message, ToastAndroid.LONG);
            }
            const allLecturers = response as LecturerTypes[];
            setAllLecturers(allLecturers);
        })();
    }, []);

    useEffect(() => {
        if (!lecturerToEdit && allLecturers) {
            const currentYear = new Date().getFullYear();
            const newLecNumber = (allLecturers.filter(lec => {
                const year = new Date(lec.employmentDate).getFullYear();
                return year === currentYear;
            }).length ?? 0) + 1;
            const generatedStaffNo = `ST/LEC/${currentYear}/${newLecNumber}`;

            setLecturer(prev => ({
                ...prev,
                staffNo: generatedStaffNo
            }));
        }
    }, [allLecturers]);

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: colours.inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: colours.inverseText }}>Lecturer Enrollment</Text>

            {lecturerKeys
            .map(key => (
                key === 'staffNo' 
                ? (
                    <View key={key} style={[styles.inputWrapper, { borderRadius: spacing.borderRadius }]}>
                        <IconButton icon={'school'} size={30} iconColor={colours.text}
                            style={{ borderTopLeftRadius: spacing.borderRadius, borderBottomLeftRadius: spacing.borderRadius, backgroundColor: colours.background }} 
                        />

                        <TextInput
                            style={[
                                styles.input, 
                                {
                                    backgroundColor: colours.placeholderText, 
                                    color: colours.inverseText,
                                    borderRadius: spacing.borderRadius
                                }
                            ]}
                            value={lecturer.staffNo}
                            editable={false}
                        />
                    </View>
                ) 
                : (key === 'photoUri') 
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
                : (key === 'departmentID')
                ? (
                    <View key={key} style={[styles.inputWrapper, { borderRadius: spacing.borderRadius }]}>
                        <IconButton icon={'school'} size={30} iconColor={colours.text}
                            style={{ borderTopLeftRadius: spacing.borderRadius, borderBottomLeftRadius: spacing.borderRadius, backgroundColor: colours.background }} 
                        />

                        <TextInput
                            style={[
                                styles.input, 
                                {
                                    backgroundColor: colours.placeholderText, 
                                    color: colours.inverseText,
                                    borderRadius: spacing.borderRadius
                                }
                            ]}
                            value={schoolDetails?.departments.find(dep => dep.id === departmentID)?.name}
                            editable={false}
                        />
                    </View>
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
                                    color: colours.inverseText,
                                    borderRadius: spacing.borderRadius
                                }
                            ]}
                            inputMode={formLabels[key].type}
                            placeholder={formLabels[key].label}
                            value={lecturer[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            placeholderTextColor={colours.placeholderText}
                        />
                    </View>
                )
            ))}

            <Button textColor={colours.text} buttonColor={colours.background} 
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