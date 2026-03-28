import { useTheme } from "@/lib/Theme";
import { Text, View } from "react-native";
import PersonDetailField from "./PersonDetailField";

type Props = {
    heading: string;
    details: {
        label: string;
        value: string;
    }[];
};

export default function PersonSectionCard ({ heading, details }: Readonly<Props>) {
    const { colours } = useTheme();

    return (
        <View style={{
            backgroundColor: colours.background,
            borderRadius: 12,
            padding: 15,
            elevation: 2
        }}>
            <Text style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 10,
                color: colours.text
            }}>
                {heading}
            </Text>

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: 10
            }}>
                {details.map(detail => (
                    <PersonDetailField key={detail.label} label={detail.label} value={detail.value} />
                ))}
            </View>
        </View>
    );
}