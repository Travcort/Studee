import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
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
    const { customTheme } = useMyAppContext();

    return (
        <View style={{
            backgroundColor: Colours[customTheme].background,
            borderRadius: 12,
            padding: 15,
            elevation: 2
        }}>
            <Text style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 10,
                color: Colours[customTheme].text
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