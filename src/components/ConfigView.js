import React, { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Switch } from 'react-native';

import ChooseList from './ChooseList';
import ControlIcon from './ControlIcon';

const styles = StyleSheet.create({
  config: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'column',
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

function CusSwitch({ themeColor, defaultValue, onChange }) {
  const [visible, setVisible] = useState(defaultValue);
  return (
    <Switch
      value={visible}
      thumbColor="white"
      trackColor={{
        true: themeColor,
        false: 'white',
      }}
      onValueChange={(value) => {
        setVisible(value);
        onChange(value);
      }}
      style={{ marginLeft: 10 }}
    />
  );
}

const playRate = [
  { label: '1倍', value: 1.0 },
  { label: '1.5倍', value: 1.5 },
  { label: '2倍', value: 2.0 },
];

const playScaleMode = [
  { label: '默认', value: 0 },
  { label: '平铺', value: 1 },
  { label: '拉伸', value: 2 },
];

function ConfigView({ visible, config, themeColor, onChange, onClose }) {
  const { setSpeed, setScaleMode, setLoop, setMute } = config;
  if (!visible) {
    return null;
  }

  return (
    <SafeAreaView style={styles.config}>
      <View style={styles.content} onPress={onClose}>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.textWhite}>循环播放:</Text>
            <CusSwitch
              themeColor={themeColor}
              defaultValue={setLoop}
              onChange={(value) => {
                onChange({ setLoop: value });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textWhite}>静音播放:</Text>
            <CusSwitch
              themeColor={themeColor}
              defaultValue={setMute}
              onChange={(value) => {
                onChange({ setMute: value });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textWhite}>播放速度:</Text>
            <ChooseList
              data={playRate}
              defaultValue={setSpeed}
              themeColor={themeColor}
              onChange={({ value }) => {
                onChange({ setSpeed: value });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textWhite}>画面比例:</Text>
            <ChooseList
              data={playScaleMode}
              defaultValue={setScaleMode}
              themeColor={themeColor}
              onChange={({ value }) => {
                onChange({ setScaleMode: value });
              }}
            />
          </View>
          <View style={styles.close}>
            <ControlIcon name="closecircleo" onPress={onClose} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ConfigView;
