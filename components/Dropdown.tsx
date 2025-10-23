// Dropdown.tsx
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutRectangle,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  findNodeHandle,
  ViewStyle,
  Platform,
  AccessibilityInfo,
} from "react-native";

type Align = "left" | "right" | "center";

export type DropdownItemType = {
  key: string;
  label: string | ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export type DropdownProps = {
  trigger: (props: { open: boolean; toggle: () => void; ref: (r: any) => void }) => ReactNode;
  items: DropdownItemType[];
  align?: Align;
  width?: number;
  offset?: { x?: number; y?: number };
  onOpen?: () => void;
  onClose?: () => void;
  contentStyle?: ViewStyle;
  animationDuration?: number;
  modalTransparent?: boolean;
};

/**
 * Dropdown - lightweight dropdown component implemented with React Native primitives
 *
 * Usage:
 * <Dropdown trigger={({open, toggle, ref}) => (
 *   <TouchableOpacity ref={ref} onPress={toggle}><Text>Open</Text></TouchableOpacity>
 * )} items={[...]} />
 */
export function Dropdown({
  trigger,
  items,
  align = "left",
  width = 200,
  offset = { x: 0, y: 8 },
  onOpen,
  onClose,
  contentStyle,
  animationDuration = 160,
  modalTransparent = true,
}: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
  const triggerRef = useRef<any>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    if (open) {
      Animated.timing(anim, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      onOpen?.();
      // focus for accessibility (announce)
      AccessibilityInfo.announceForAccessibility("Menu opened");
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onClose?.();
      });
      AccessibilityInfo.announceForAccessibility("Menu closed");
    }
  }, [open, anim, animationDuration, onOpen, onClose]);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
    } else {
      // measure trigger position
      const handle = findNodeHandle(triggerRef.current);
      if (!handle) {
        // fallback - just open
        setOpen(true);
        return;
      }
      // measureInWindow works on the native node handle
      // @ts-ignore - UIManager types are hairy
      UIManager.measureInWindow(
        handle,
        (x: number, y: number, w: number, h: number) => {
          setTriggerLayout({ x, y, width: w, height: h });
          setMeasured(true);
          setOpen(true);
        }
      );
    }
  }, [open]);

  // close on hardware back (Android) when open - Modal handles it by default if visible
  // compute content position:
  const computedStyle = (() => {
    if (!triggerLayout) return { top: 0, left: 0 } as const;
    const screenWidth = Platform.OS === "web" ? window.innerWidth : 100000; // web only fallback
    // default left aligned to trigger.x
    let left = triggerLayout.x + (offset.x ?? 0);
    if (align === "right") {
      left = triggerLayout.x + triggerLayout.width - width + (offset.x ?? 0);
    } else if (align === "center") {
      left = triggerLayout.x + (triggerLayout.width - width) / 2 + (offset.x ?? 0);
    }

    // avoid going off-screen left
    if (left < 6) left = 6;
    // if screen width known try to avoid going off-screen right (best-effort)
    if (screenWidth && left + width + 6 > screenWidth) {
      left = Math.max(6, (screenWidth - width) - 6);
    }

    // vertical: appear below trigger
    const top = triggerLayout.y + triggerLayout.height + (offset.y ?? 8);

    return { top, left };
  })();

  const backdropPress = () => setOpen(false);

  // animation transforms: translateY from 6 -> 0, opacity 0 -> 1
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });
  const opacity = anim;

  return (
    <>
      {trigger({ open, toggle, ref: (r: any) => (triggerRef.current = r) })}
      <Modal
        visible={open}
        transparent={modalTransparent}
        animationType="none"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
        supportedOrientations={["portrait", "landscape"]}
      >
        <Pressable style={styles.modalOverlay} onPress={backdropPress} accessibilityLabel="Close menu" />
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {/* When we have measured, show the content at computed position */}
          {measured && triggerLayout && (
            <Animated.View
              accessibilityRole="menu"
              accessibilityLabel="Dropdown menu"
              style={[
                styles.content,
                {
                  width,
                  top: computedStyle.top,
                  left: computedStyle.left,
                  opacity,
                  transform: [{ translateY }],
                },
                contentStyle,
              ]}
            >
              {items.map((it, idx) => (
                <DropdownItem
                  key={it.key}
                  item={it}
                  onRequestClose={() => setOpen(false)}
                  index={idx}
                  total={items.length}
                />
              ))}
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}

function DropdownItem({
  item,
  onRequestClose,
  index,
  total,
}: Readonly<{
  item: DropdownItemType;
  onRequestClose: () => void;
  index: number;
  total: number;
}>) {
  const handlePress = () => {
    if (item.disabled) return;
    item.onPress?.();
    onRequestClose();
  };

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ disabled: !!item.disabled }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.item,
        item.disabled && styles.itemDisabled,
        pressed && !item.disabled && styles.itemPressed,
      ]}
    >
      <View style={styles.itemLeading}>{item.leading}</View>
      {typeof item.label === "string" ? (
        <Text style={[styles.itemLabel, item.disabled && styles.itemLabelDisabled]} numberOfLines={1}>
          {item.label}
        </Text>
      ) : (
        <View style={{ flex: 1 }}>{item.label}</View>
      )}
      <View style={styles.itemTrailing}>{item.trailing}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    // border
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
  },
  item: {
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemPressed: {
    backgroundColor: "#f3f4f6",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemLeading: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  itemTrailing: {
    marginLeft: 8,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  itemLabelDisabled: {
    color: "#6b7280",
  },
});