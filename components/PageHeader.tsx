import Colours from '@/lib/Colours';
import { useMyAppContext } from "@/lib/Context";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarButton from "./AvatarButton";
import IconButton from "./IconButton";

interface PageHeaderProps {
  page: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ page, setOpen }) => {
    const { customTheme } = useMyAppContext();

    return (
      <SafeAreaView style={[styles.pageHeader, { backgroundColor: Colours[customTheme].background }]}>
          <AvatarButton setOpen={setOpen} />
          <Text style={{ color: Colours[customTheme].text, fontWeight: '700', fontSize: 20 }}>{page}</Text>
          <IconButton
            icon="bell"
            iconColor={Colours[customTheme].text}
            size={20}
            onPress={() => ToastAndroid.show('Ding! 😂', ToastAndroid.SHORT)}
          />
      </SafeAreaView>
    );
}

export default PageHeader;

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: `${2}%`,
    paddingBottom: `${-10}%`
  }
});