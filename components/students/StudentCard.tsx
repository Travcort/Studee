import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { StudentTypes } from "@/lib/Database/Operations";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Studentcard({ item}: Readonly<{ item: StudentTypes}>) {
    const { customTheme, customBorderRadius } = useMyAppContext();

    return (
        <Link
            key={item.regNo}
            href={`/students/${encodeURIComponent(item.regNo)}`}
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
                        {item.firstName.charAt(0)}{item.lastName.charAt(0)}
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
                        {item.firstName} {item.lastName}
                    </Text>
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontSize: 13,
                            marginTop: 3,
                        }}
                    >
                        Reg No: {item.regNo}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}