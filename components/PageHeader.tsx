import { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarButton from "./shared/AvatarButton";
import IconButton from "./shared/IconButton";
import { useTheme } from '@/lib/Theme';

interface PageHeaderProps {
  page: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ page, setOpen }) => {
    const { colours } = useTheme();

    return (
      <SafeAreaView style={[styles.pageHeader, { backgroundColor: colours.background }]}>
          <AvatarButton setOpen={setOpen} />
          <Text style={{ color: colours.text, fontWeight: '700', fontSize: 20 }}>{page}</Text>
          <IconButton
            icon="bell"
            iconColor={colours.text}
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