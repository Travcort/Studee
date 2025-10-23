import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';
import appJson from './app.json';

const getPackageName = () => process.env.PACKAGE_NAME ?? 'com.tirva.Studee.dev';
const getAppName = () => process.env.APP_NAME ?? 'Studee Dev';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: getAppName(),
    slug: "Studee",
    scheme: process.env.APP_SCHEME ?? 'studeedev',
    orientation: "portrait",
    icon: "./assets/images/adaptive-icon.png",
    userInterfaceStyle: "automatic",
    platforms: [
      'android',
      'ios'
    ],
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
        runtimeVersion: appJson.expo.version,
        supportsTablet: true
    },
    android: {
      package: getPackageName(),
        runtimeVersion: appJson.expo.version,
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false
    },
    plugins: [
      "expo-router",
      "expo-sqlite",
      "expo-image-picker",
    ]
});
