import Colours from "@/lib/Colours";
import { useMyAppContext } from "@/lib/Context";
import { Dispatch, SetStateAction } from "react";
import { Modal, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type CustomModalProps = {
    modalVisible: boolean;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    onRequestCloseOperations: () => void;
    children: React.ReactNode
};

export default function CustomModal ({ modalVisible, setModalVisible, onRequestCloseOperations, children }: Readonly<CustomModalProps>) {
    const { customTheme } = useMyAppContext();

    return (
        <SafeAreaProvider>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { onRequestCloseOperations(); setModalVisible(false); }}
            >
                <SafeAreaView 
                    style={{ flex: 1, justifyContent: 'center', backgroundColor: Colours[customTheme].overlay }}
                >
                    <View style={{ margin: '5%', padding: '2%', borderRadius: 12, backgroundColor: Colours[customTheme].inverseBackground, elevation: 5 }}>
                        {children}
                    </View>
                </SafeAreaView>

            </Modal>
        </SafeAreaProvider>
    );
}