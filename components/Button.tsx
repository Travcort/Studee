import React from 'react';
import {
    GestureResponderEvent,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

export type ButtonMode = 'contained' | 'outlined' | 'text';

export interface ButtonProps {
  /** Button mode (contained, outlined, or text) */
  mode?: ButtonMode;
  /** Function called when button is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Background color (for contained mode) */
  buttonColor?: string;
  /** Text color */
  textColor?: string;
  /** Optional custom style */
  style?: StyleProp<ViewStyle>;
  /** Optional text style */
  labelStyle?: StyleProp<TextStyle>;
  /** Children — can be text, icons, or custom elements */
  children?: React.ReactNode;
}

export default function Button({
  mode = 'contained',
  onPress,
  disabled = false,
  buttonColor = '#6200ee',
  textColor = '#fff',
  style,
  labelStyle,
  children,
}: ButtonProps) {
  const background =
    mode === 'contained' ? buttonColor : 'transparent';
  const border =
    mode === 'outlined' ? { borderWidth: 1, borderColor: textColor } : {};

  const textCol =
    mode === 'contained' ? textColor : buttonColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{
        color: 'rgba(0,0,0,0.1)',
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: disabled ? '#ccc' : background },
        border,
        pressed && { opacity: Platform.OS === 'ios' ? 0.7 : 1 },
        style,
      ]}
    >
      <View style={styles.content}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.label,
              { color: disabled ? '#888' : textCol },
              labelStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});