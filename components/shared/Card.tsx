import { useTheme } from "@/lib/Theme";
import { View } from "react-native";

export default function Card ({ children }: Readonly<{children: React.ReactNode}>) {
    const { colours, spacing } = useTheme();

    return (
        <View
            style={{
                width: "95%",
                backgroundColor: colours.inverseBackground,
                padding: '5%',
                borderRadius: spacing.borderRadius * 2,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
            }}
        >
            {children}
        </View>
    );
}