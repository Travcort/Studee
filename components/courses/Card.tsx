import { useTheme } from "@/lib/Theme";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type CourseCardProps = { 
    id: number;
    schoolCode: string;
    departmentCode: string;
    uniqueIdentifier: string;
    name: string;
};

export default function CourseCard({ id, schoolCode, departmentCode, uniqueIdentifier, name }: Readonly<CourseCardProps>) {
    const { colours, spacing } = useTheme();

    return (
        <Link
            key={id}
            href={`/schools/${schoolCode}/departments/${departmentCode}/${encodeURIComponent(uniqueIdentifier)}?courseID=${id}`}
            asChild
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: colours.background,
                    borderRadius: spacing.borderRadius,
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
                        backgroundColor: colours.inverseBackground,
                        width: 34,
                        height: 34,
                        borderRadius: 99,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: colours.inverseText,
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
                            color: colours.text,
                            fontSize: 17,
                            fontWeight: "600",
                        }}
                        numberOfLines={2}
                    >
                        {name}
                    </Text>
                    {/* <Text
                        style={{
                            color: colours.text,
                            fontSize: 13,
                            marginTop: 3,
                        }}
                    >
                        Head: {head}
                    </Text> */}
                </View>
            </TouchableOpacity>
        </Link>
    );
}