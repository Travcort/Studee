import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colours from '@/lib/Colours';
import { useMyAppContext } from '@/lib/Context';
import IconButton from './IconButton';

type PhotoUploadInputProps = {
  photoUri: string;
  onChange: (uri: string) => void;
};

const PhotoUploadInput: React.FC<PhotoUploadInputProps> = ({ photoUri, onChange }) => {
    const { customTheme, customBorderRadius } = useMyAppContext();

    const pickImage = async () => {
        const result = await launchImageLibraryAsync({
          mediaTypes: 'images'
        });

        if (!result.canceled && result.assets?.length) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <TouchableOpacity style={[styles.container, { borderRadius: customBorderRadius, backgroundColor: Colours[customTheme].background }]} onPress={pickImage} activeOpacity={0.8}>
        {photoUri 
            ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: photoUri }} style={styles.image} />
                  <View style={styles.iconWrapper}>
                    <IconButton
                      icon="close-circle-outline"
                      iconColor={Colours[customTheme].text}
                      size={20}
                      onPress={() => onChange('')}
                      style={{
                        backgroundColor: Colours[customTheme].background,
                        borderRadius: 50,
                        elevation: 2,
                      }}
                    />
                  </View>
                </View>
            ) 
            : (
                <View style={styles.placeholder}>
                    <MaterialCommunityIcons name="camera-plus" size={36} color={Colours[customTheme].placeholderText} />
                    <Text style={styles.placeholderText}>Upload Photo</Text>
                </View>
            )
        }
        </TouchableOpacity>
    );
};

export default PhotoUploadInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    height: '20%',
    width: '50%',
    margin: '4%',
    padding: '3%'
  },
  imageContainer: {
    width: 150,
    height: 150,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  iconWrapper: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  placeholder: {
    gap: `${3}%`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  }
});