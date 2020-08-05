import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';

import ControlIcon from './ControlIcon';

const styles = StyleSheet.create({
  stateViewLoading: {
    maxWidth: '50%',
  },
  stateViewError: {
    width: 200,
    alignItems: 'center',
  },
  textError: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  textLoading: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 12,
  },
  textLoadingTitle: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
});

function StateView({
  isPlaying,
  isLoading,
  isError,
  loadingObj,
  errorObj,
  onPressPlay,
  onPressReload,
  themeColor,
}) {
  const { percent } = loadingObj;
  const { message } = errorObj;
  let view = null;
  if (isLoading) {
    view = (
      <View style={styles.stateViewLoading}>
        <ActivityIndicator size="large" color={themeColor} />
        <Text style={styles.textLoading}>
          <Text>缓冲中...</Text>
          {!!percent && <Text>{`${percent}%`}</Text>}
        </Text>
      </View>
    );
  }
  if (!isPlaying) {
    view = (
      <View>
        <ControlIcon onPress={onPressPlay} size={40} name="playcircleo" />
      </View>
    );
  }
  if (isError) {
    view = (
      <View style={styles.stateViewError}>
        <Text
          style={styles.textError}
          numberOfLines={1}
          ellipsizeMode="tail"
        >{`播放出错:${message}`}</Text>
        <Button
          title="重试"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={{ width: 80, height: 30, backgroundColor: themeColor }}
          onPress={onPressReload}
        />
      </View>
    );
  }
  return view;
}

export default StateView;
