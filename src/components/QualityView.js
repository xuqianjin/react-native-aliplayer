import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';

import ChooseList from './ChooseList';
import ControlIcon from './ControlIcon';
import { getBitrateLabel } from '../lib/utils';

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

function QualityView({ visible, bitrateList, bitrateIndex, themeColor, onClose, onChange }) {
  if (!visible) {
    return null;
  }

  const chooseData = bitrateList.map((o) => {
    return { value: o.index, label: getBitrateLabel(o) };
  });

  chooseData.unshift({ label: '自动', value: -1 });

  return (
    <SafeAreaView style={styles.quality}>
      <View style={styles.content} onPress={onClose}>
        <View style={styles.row}>
          <Text style={styles.textWhite}>画质:</Text>
          <ChooseList
            data={chooseData}
            defaultValue={bitrateIndex}
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
