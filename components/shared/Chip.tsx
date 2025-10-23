import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Image,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMyAppContext } from '@/lib/Context';
import Colours from '@/lib/Colours';

export type ChipMode = 'flat' | 'outlined';

export interface ChipProps {
  label: string;
  onPress?: () => void;
  onClose?: () => void;
  avatar?: string | ImageSourcePropType;
  icon?: keyof typeof MaterialIcons.glyphMap;
  badge?: number | string;
  selected?: boolean;
  mode?: ChipMode;
  lines?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  avatarSize?: number;
  accessibilityLabel?: string;
  testID?: string;
}

export default function Chip({
  label,
  onPress,
  onClose,
  avatar,
  icon,
  badge,
  selected = false,
  mode = 'flat',
  lines = 1,
  disabled = false,
  style,
  labelStyle,
  avatarSize = 28,
  accessibilityLabel,
  testID,
}: Readonly<ChipProps>) {
    const { customTheme, customBorderRadius } = useMyAppContext();
    const scale = useRef(new Animated.Value(1)).current;

    const startPress = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
    };
    const endPress = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    };

    const containerStyle = [
        styles.container,
        mode === 'outlined' ? styles.outlined : styles.flat,
        selected && { backgroundColor: '#e0f7fa' },
        disabled && { opacity: 0.5 },
        style,
    ];

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                testID={testID}
                accessibilityLabel={accessibilityLabel || label}
                accessibilityRole={onPress ? 'button' : 'none'}
                android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
                onPressIn={startPress}
                onPressOut={endPress}
                onPress={disabled ? undefined : onPress}
                style={({ pressed }) => [
                    containerStyle, 
                    { backgroundColor: Colours[customTheme].inverseBackground, borderRadius: customBorderRadius }, 
                    pressed && Platform.OS === 'ios' && styles.pressed
                ]}
                disabled={disabled}
            >
                {avatar 
                    ? (
                        <Image
                            source={typeof avatar === 'string' ? { uri: avatar } : avatar}
                            style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
                        />
                    ) 
                    : icon 
                    ? (
                        <View style={styles.iconWrap}>
                            <MaterialIcons name={icon} size={18} />
                        </View>
                    ) 
                    : null
                }

                <Text numberOfLines={lines ?? 1} style={[{ flexShrink: 1, fontSize: 14, color: Colours[customTheme].inverseText }, labelStyle]}>{label}</Text> 

                {badge !== undefined && badge !== null 
                    ? (
                        <View style={[styles.badgeWrap, { backgroundColor: Colours[customTheme].badge }]}>
                            <Text style={{ color: Colours[customTheme].text, fontSize: 12, fontWeight: '600' }}>{String(badge)}</Text>
                        </View>
                    ) 
                    : onClose 
                    ? (
                        <Pressable
                            onPress={onClose}
                            accessibilityLabel={`Remove ${label}`}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.closeWrap, pressed && styles.closePressed]}
                        >
                            <MaterialIcons name="close" size={18} />
                        </Pressable>
                    ) 
                    : null
                }
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    maxWidth: 150,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
  },
  flat: {
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    marginRight: 8,
    resizeMode: 'cover',
  },
  iconWrap: {
    marginRight: 8,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrap: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  closeWrap: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 12,
  },
  closePressed: {
    opacity: 0.6,
  },
});