import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  Animated, 
  Easing, 
  TouchableWithoutFeedback, 
  Modal,
  StyleSheet 
} from "react-native";

type DropdownItem = {
  label: string;
  onPress: () => void;
};

type DropdownMenuProps = {
  trigger: () => React.ReactNode;
  items: DropdownItem[];
};

const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const { customTheme, customBorderRadius } = useMyAppContext();
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => setVisible(!visible);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 50,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <View>
      {/* Trigger Button */}
      <Pressable style={[styles.trigger, { borderRadius: customBorderRadius }]} onPress={toggleMenu}>
        {trigger}
      </Pressable>

      {/* Menu */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={[styles.overlay, { backgroundColor: Colours[customTheme].overlay }]}>
            <Animated.View
              style={[
                styles.menu,
                { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
              ]}
            >
              {items.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    item.onPress();
                    setVisible(false);
                  }}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    flexDirection: "row",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    minWidth: 180,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 15,
  },
});

export default DropdownMenu;