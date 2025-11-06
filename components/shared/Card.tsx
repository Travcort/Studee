import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { View } from "react-native";

export default function Card ({ children }: Readonly<{children: React.ReactNode}>) {
    const { customTheme, customBorderRadius } = useMyAppContext();
    return (
        <View
            style={{
                width: "95%",
                backgroundColor: Colours[customTheme].inverseBackground,
                padding: '5%',
                borderRadius: customBorderRadius * 2,
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