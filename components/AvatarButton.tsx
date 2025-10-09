import Colours from '@/lib/Colours';
import { useMyAppContext } from '@/lib/Context';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AvatarButton({ setOpen }: Readonly<{ setOpen: Dispatch<SetStateAction<boolean>>}>) {
  const { customTheme } = useMyAppContext();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => setOpen(prev => !prev)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: Colours[customTheme].text },
        ]}
      >
        <Text style={{ color: Colours[customTheme].background }}>TK</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }
});