import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type SchoolCardProps = { 
    id: number,
    uniqueIdentifier: string;
    name: string;
    dean: string;
};

export default function SchoolCard({ id, uniqueIdentifier, name, dean }: Readonly<SchoolCardProps>) {
    const { customTheme, customBorderRadius } = useMyAppContext();

    return (
        <Link
            key={id}
            href={`/schools/${encodeURIComponent(uniqueIdentifier)}?schoolID=${id}`}
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
                        backgroundColor: Colours[customTheme].background,
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
                        {uniqueIdentifier}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontSize: 17,
                            fontWeight: "600",
                        }}
                        numberOfLines={2}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: Colours[customTheme].inverseText,
                            fontSize: 13,
                            marginTop: 3,
                        }}
                    >
                        Dean: {dean}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}