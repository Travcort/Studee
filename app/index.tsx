import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
    const { customTheme } = useMyAppContext();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colours[customTheme].background }]}>
          <Text style={{ color: Colours[customTheme].text }}>Hello Tarv!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
});