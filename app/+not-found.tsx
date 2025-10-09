import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import Colours from '@/lib/Colours';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import Button from '@/components/Button';
import { useMyAppContext } from '@/lib/Context';

export default function NotFoundScreen() {
  const { customTheme } = useMyAppContext();
  const animation = useRef<LottieView>(null);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: Colours[customTheme].background }]}>
        <Text style={{ color: Colours[customTheme].text }}>It's time to rethink your life's choices</Text>
        <LottieView
            autoPlay
            ref={animation}
            loop={true}
            style={{
                width: '40%',
                height: '40%'
            }}
            source={require('@/assets/lottie/cat-not-found.json')}
        />

        <Link href="/" style={styles.link}>
          <Button mode='contained'>I wanna go home!</Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});