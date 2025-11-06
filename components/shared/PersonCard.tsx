import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type PersonCardProps = { 
    id: number; 
    table: 'students'|'lecturers'; 
    uniqueIdentifier: string;
    firstName: string;
    lastName: string;
};

export default function Personcard({ id, table, uniqueIdentifier, firstName, lastName }: Readonly<PersonCardProps>) {
    const { customTheme, customBorderRadius } = useMyAppContext();

    return (
        <Link
            key={id}
            href={`/${table}/${encodeURIComponent(uniqueIdentifier)}`}
            asChild
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: Colours[customTheme].inverseBackground,
                    borderRadius: customBorderRadius,
                    margin: '1%',
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    gap: '5%',
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 3,
                }}
            >
                <View
                    style={{
                        backgroundColor: Colours[customTheme].background ?? "#007AFF",
                        width: 34,
                        height: 34,
                        borderRadius: 99,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: Colours[customTheme].text,
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                    >
                        {firstName.charAt(0)}{lastName.charAt(0)}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontSize: 17,
                            fontWeight: "600",
                        }}
                        numberOfLines={1}
                    >
                        {firstName} {lastName}
                    </Text>
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontSize: 13,
                            marginTop: 3,
                        }}
                    >
                        {table === 'students' ? 'Reg No:' : 'Staff No:'} {uniqueIdentifier}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}