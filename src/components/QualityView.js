import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';

import ChooseList from './ChooseList';
import ControlIcon from './ControlIcon';

const styles = StyleSheet.create({
  quality: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  textWhite: {
    color: 'white',
    fontSize: 18,
  },
  close: {
    marginTop: 5,
  },
});

function QualityView({ visible, qualityList, playSource, themeColor, onClose, onChange }) {
  if (!visible) {
    return null;
  }

  return (
    <SafeAreaView style={styles.quality}>
      <View style={styles.content} onPress={onClose}>
        <View style={styles.row}>
          <Text style={styles.textWhite}>画质:</Text>
          <ChooseList
            data={qualityList}
            defaultValue={playSource}
            themeColor={themeColor}
            onChange={onChange}
          />
        </View>
        <View style={styles.close}>
          <ControlIcon name="closecircleo" onPress={onClose} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default QualityView;
