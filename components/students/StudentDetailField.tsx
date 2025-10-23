import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function StudentDetailField({ label, value }: Readonly<{ label: string, value: string }>) {
    const { customTheme, customBorderRadius } = useMyAppContext();

    return (
        <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: Colours[customTheme].placeholderText }]}>
                {label}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderRadius: customBorderRadius,
                        backgroundColor: Colours[customTheme].inverseBackground,
                        color: Colours[customTheme].inverseText,
                    },
                ]}
                value={value}
                editable={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  fieldContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
  },
});