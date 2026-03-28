import { useTheme } from "@/lib/Theme";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function PersonDetailField({ label, value }: Readonly<{ label: string, value: string }>) {
    const { colours, spacing } = useTheme();

    return (
        <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colours.placeholderText }]}>
                {label}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderRadius: spacing.borderRadius,
                        backgroundColor: colours.inverseBackground,
                        color: colours.inverseText,
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
    width: '48%',
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