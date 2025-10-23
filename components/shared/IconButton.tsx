import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { GestureResponderEvent, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface IconButtonProps {
  /* The icon name from MaterialCommunityIcons */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /* The color of the icon */
  iconColor?: string;
  /* The size of the icon in pixels */
  size?: number;
  /* Optional background color of the circular button */
  backgroundColor?: string;
  /* Function called when button is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /* Optional additional styles for the container */
  style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconColor = '#000',
  size = 24,
  backgroundColor = 'transparent',
  onPress,
  style,
}) => {
  const buttonSize = size + 16;

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        {
          backgroundColor,
          width: buttonSize,
          height: buttonSize,
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={icon} size={size} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
