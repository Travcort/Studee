import { View, Text, StyleSheet, Pressable } from "react-native";
import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";

const DialogContent = ({
  title,
  message,
  actions = [],
}: {
  title: string;
  message?: string;
  actions?: { label: string; onPress: () => void; mode?: "text" | "contained" }[];
}) => {
  const { customTheme, customBorderRadius } = useMyAppContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colours[customTheme].inverseBackground,
          borderRadius: customBorderRadius * 2,
        },
      ]}
    >
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: Colours[customTheme].inverseText },
        ]}
      >
        {title}
      </Text>

      {/* Message */}
      {message && (
        <Text
          style={[
            styles.message,
            { color: Colours[customTheme].inverseText },
          ]}
        >
          {message}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {actions.map((action, i) => (
          <Pressable
            key={i}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor:
                  action.mode === "contained"
                    ? Colours[customTheme].background
                    : "transparent",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={{
                color:
                  action.mode === "contained"
                    ? Colours[customTheme].text
                    : Colours[customTheme].inverseText,
                fontWeight: "600",
              }}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default DialogContent;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    padding: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});