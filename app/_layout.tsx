import DrawerContent from '@/components/DrawerContent';
import PageHeader from '@/components/PageHeader';
import { MyAppContext } from '@/lib/Context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Drawer as DrawerLayout } from 'react-native-drawer-layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const customTheme = useColorScheme() ?? "light";
  const [open, setOpen] = useState(false);

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={customTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar hidden={true} />
        <DrawerLayout
          drawerStyle={{ width: '70%' }}
          drawerPosition='left'
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderDrawerContent={() => <DrawerContent />}
        >   
          <MyAppContext.Provider value={{ customTheme, setOpen }}>
            <Stack>
              <Stack.Screen name="index" options={{ 
                header: () => <PageHeader page='Home' setOpen={setOpen} />
                }} 
              />
            </Stack>
          </MyAppContext.Provider>
        </DrawerLayout>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
