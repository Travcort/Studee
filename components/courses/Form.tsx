import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import Button from "../shared/Button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTheme } from "@/lib/Theme";
import IconButton from "../shared/IconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { editCourseDetails, getAllCourses, newCourse } from "@/lib/Database/Operations";
import { useDatabase } from "@/lib/Database/Provider";
import StateStore from "@/lib/State";
import { CourseTypes, NewCourseTypes } from "@/lib/Database/Schema";

const courseKeys: (keyof NewCourseTypes)[] = [
    "name",
    "code",
    "schoolID",
    "departmentID"
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

const formLabels: Record<keyof NewCourseTypes, FormLabelType> = {
    name: {
        label: 'Course Name',
        icon: 'school',
        type: 'text'
    },
    code: {
        label: 'Course Code',
        icon: 'barcode',
        type: 'text'
    },
    schoolID: {
        label: 'School',
        icon: 'office-building',
        type: 'text'
    },
    departmentID: {
        label: 'Department',
        icon: 'office-building-outline',
        type: 'text'
    }
};

const CourseForm = ({ schoolID, departmentID, courseToEdit, setModalVisible }: { schoolID: number, departmentID: number, courseToEdit?: CourseTypes, setModalVisible: Dispatch<SetStateAction<boolean>> }) => {
    const { colours, spacing } = useTheme();
    const { database } = useDatabase();
    const schoolDetails = StateStore(state => state.schoolDetails);
    const toggleRefreshMetricsToken = StateStore(state => state.toggleRefreshMetricsToken);
    const refreshSchoolDetailsToken = StateStore(state => state.refreshSchoolDetailsToken);

    const initialCourseState = courseToEdit 
    ? {
        name: courseToEdit.name,
        code: courseToEdit.code,
        schoolID: courseToEdit.schoolID,
        departmentID: courseToEdit.departmentID,
    }
    : {
        name: '',
        code: '',
        schoolID: schoolID,
        departmentID: departmentID,
    };

    const [course, setCourse] = useState<NewCourseTypes>(initialCourseState);

    const handleChange = <K extends keyof CourseTypes>(key: K, value: string|number|null) => {
        setCourse((prev) => ({ ...prev, [key]: value }));
    };

    const handleEnrollment = async () => {
        let result;

        if(courseToEdit) {
            const updatedCourse = {
                ...courseToEdit,
                ...course
            }
            result = await editCourseDetails(database, updatedCourse);
        } else {
            result = await newCourse(database, course);
        }

        const { success, message } = result;

        if (!success) {
            ToastAndroid.show(message, ToastAndroid.LONG);
            return;
        }
        setCourse(initialCourseState);
        const { response } = await getAllCourses(database, schoolID);
        // if (response) setStateDepartments(response);
        toggleRefreshMetricsToken();
        refreshSchoolDetailsToken();

        setModalVisible(false);
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    return (
        <ScrollView contentContainerStyle={{ padding: '5%', backgroundColor: colours.inverseBackground} }>
            <Text style={{ alignSelf: 'center', padding: '2%', fontSize: 24, fontWeight: 'bold', color: colours.inverseText }}>Course Form</Text>

            {courseKeys
            .map(key => (
                <View key={key} style={[styles.inputWrapper, { borderRadius: spacing.borderRadius }]}>
                    <IconButton icon={formLabels[key].icon} size={30} iconColor={colours.text}
                        style={{ borderTopLeftRadius: spacing.borderRadius, borderBottomLeftRadius: spacing.borderRadius, backgroundColor: colours.background }} 
                    />
                    {key === "schoolID" 
                        ? (
                            <TextInput
                                style={[
                                    styles.input, 
                                    {
                                        color: colours.inverseText,
                                        borderRadius: spacing.borderRadius
                                    }
                                ]}
                                value={schoolDetails?.name}
                                editable={false}
                            />
                        ) 
                        : (key === "departmentID")
                        ? (
                            <TextInput
                                style={[
                                    styles.input, 
                                    {
                                        color: colours.inverseText,
                                        borderRadius: spacing.borderRadius
                                    }
                                ]}
                                value={schoolDetails?.departments.find(d => d.id === departmentID)?.name}
                                editable={false}
                            />
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
                                value={course[key]}
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
                {courseToEdit ? 'Update Course Details' : 'Create Course' }
            </Button>
        </ScrollView>
    );
}

export default CourseForm;

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