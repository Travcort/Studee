import React from "react";
import { View, Image, Text } from "react-native";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 64 }) => {
    const { customTheme } = useMyAppContext();

    const getInitials = (fullName: string) => {
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colours[customTheme].background,
            }}
        >
        {uri 
            ? (
                <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
                    resizeMode="cover"
                />
            ) 
            : (
                <Text
                    style={{
                        color: Colours[customTheme].text,
                        fontSize: size / 2.5,
                        fontWeight: "700",
                    }}
                >
                    {getInitials(name)}
                </Text>
            )
        }
        </View>
    );
};

export default Avatar;