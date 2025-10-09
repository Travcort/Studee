import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Application from 'expo-application';
import React from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function DrawerContent() {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => BackHandler.exitApp()}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="logout" size={22} color="#333" />
        <Text style={styles.label}>Exit</Text>
      </TouchableOpacity>

      <View style={[styles.item, { justifyContent: 'flex-start' }]}>
        <Text style={[styles.label, { color: '#666' }]}>
          App Version: {Application.nativeApplicationVersion ?? 'N/A'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: '10%',
    marginBottom: '10%',
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});