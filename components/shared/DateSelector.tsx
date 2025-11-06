import { Text, View } from "react-native";
import DatePicker from 'react-native-date-picker'
import IconButton from "../shared/IconButton";
import { useMyAppContext } from "@/lib/Context";
import Colours from "@/lib/Colours";
import { useState } from "react";
import Button from "../shared/Button";
import { LecturerTypes, StudentTypes } from "@/lib/Database/Schema";

type DateSelectorProps = {
    property: keyof (StudentTypes | LecturerTypes);
    activeCalendar: string | null;
    toggleCalendarModal: () => void;
    handleChange: (key: keyof (StudentTypes | LecturerTypes), value: string) => void;
    entityToEdit?: StudentTypes | LecturerTypes;
};

const DateSelector: React.FC<DateSelectorProps> = ({ property, activeCalendar, toggleCalendarModal, handleChange, entityToEdit }) => {
    const { customTheme, customBorderRadius } = useMyAppContext();

    const [dateActive, setDateActive] = useState(!!entityToEdit);
    const [selectedDate, setSelectedDate] = useState(entityToEdit && entityToEdit[property] ? new Date(entityToEdit[property]) : new Date());

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2%', borderRadius: customBorderRadius }}>
            <IconButton icon="calendar-month" size={30} iconColor={Colours[customTheme].text}
                style={{ borderTopLeftRadius: customBorderRadius, borderBottomLeftRadius: customBorderRadius, backgroundColor: Colours[customTheme].background }} 
            /> 
            {activeCalendar === property
                ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: '2%' }}>
                        <DatePicker 
                            theme={customTheme === 'light' ? 'dark' : 'light'} style={{ width: 200 }}
                            mode="date" date={selectedDate} 
                            onDateChange={(date) => setSelectedDate(date)} 
                        />
                        <IconButton icon="check" iconColor={Colours[customTheme].inverseText} 
                            onPress={() => {
                                setDateActive(true); 
                                handleChange(property, selectedDate.toDateString()); 
                                toggleCalendarModal();
                            }} 
                        />
                    </View>
                ) 
                : dateActive
                ? (
                    <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                        <Text style={{ color: Colours[customTheme].inverseText }}>{selectedDate.toDateString()}</Text>
                        <IconButton icon="alpha-x-box" iconColor={Colours[customTheme].inverseText} onPress={() => {setDateActive(false); toggleCalendarModal()}} />
                    </View>
                )
                : (
                    <Button buttonColor="transparent" textColor={Colours[customTheme].placeholderText} onPress={() => toggleCalendarModal()} >
                        {property === "dob" ? "Choose Date of Birth" : "Choose Date"}
                    </Button>
                )
            }
        </View>
    );
}

export default DateSelector;