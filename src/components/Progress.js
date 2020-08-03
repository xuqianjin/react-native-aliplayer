import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  progressView: {
    width: '100%',
    height: 2,
    position: 'absolute',
    bottom: 0,
  },
  progressValue: {
    height: '100%',
  },
});

function Progress({ disable, value, maxValue, themeColor }) {
  if (disable) {
    return null;
  }
  const progress = `${maxValue ? Math.floor((value * 100) / maxValue) : 0}%`;
  return (
    <View style={styles.progressView}>
      <View style={[styles.progressValue, { width: progress, backgroundColor: themeColor }]}></View>
    </View>
  );
}
export default Progress;
