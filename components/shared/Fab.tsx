import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface FABProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export default function FloatingActionButton({
  icon = "plus",
  label,
  onPress,
  color = "#fff",
  backgroundColor = "#6200ee",
  position = "bottom-right",
}: Readonly<FABProps>) {

    return (
        <View style={[styles.container, positionStyles[position]]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={[styles.button, { backgroundColor }]}
            >
                {icon && <MaterialCommunityIcons name={icon} size={24} color={color} />}
                {label && <Text style={[styles.label, { color }]}>{label}</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    zIndex: 99,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: '5%',
    paddingVertical: 16,
    borderRadius: 99,
    elevation: 6, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

const positionStyles = StyleSheet.create({
  "bottom-right": {
    right: 24,
  },
  "bottom-left": {
    left: 24,
  },
  "bottom-center": {
    alignSelf: "center",
  },
});