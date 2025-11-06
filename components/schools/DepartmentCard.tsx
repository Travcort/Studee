import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type DepartmentCardProps = { 
    id: number;
    schoolCode: string;
    uniqueIdentifier: string;
    name: string;
    head: string;
};

export default function DepartmentCard({ id, schoolCode, uniqueIdentifier, name, head }: Readonly<DepartmentCardProps>) {
    const { customTheme, customBorderRadius } = useMyAppContext();

    return (
        <Link
            key={id}
            href={`/schools/${schoolCode}/departments/${encodeURIComponent(uniqueIdentifier)}?departmentID=${id}`}
            asChild
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: Colours[customTheme].background,
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
                        backgroundColor: Colours[customTheme].inverseBackground,
                        width: 34,
                        height: 34,
                        borderRadius: 99,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                    >
                        {uniqueIdentifier}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: Colours[customTheme].text,
                            fontSize: 17,
                            fontWeight: "600",
                        }}
                        numberOfLines={2}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: Colours[customTheme].text,
                            fontSize: 13,
                            marginTop: 3,
                        }}
                    >
                        Head: {head}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}