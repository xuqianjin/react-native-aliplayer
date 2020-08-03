import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Text, Animated, Easing, SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Slider } from 'react-native-elements';

import { formatTime } from '../lib/utils';
import PressView from './PressView';
import ControlIcon from './ControlIcon';
import Progress from './Progress';
import useTimeout from '../lib/useTimeout';

const GradientWhite = 'rgba(0,0,0,0)';
const GradientBlack = 'rgba(0,0,0,0.3)';
const controlerHeight = 40;
const controlerDismissTime = 5000;
const AnimateLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const styles = StyleSheet.create({
  controler: {
    ...StyleSheet.absoluteFill,
  },
  textTitle: {
    color: 'white',
    flex: 1,
    fontSize: 16,
  },
  textQuality: {
    color: 'white',
    marginRight: 10,
    fontSize: 16,
  },
  textTime: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: controlerHeight,
    width: '100%',
    paddingHorizontal: 10,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    height: controlerHeight,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  bottomSlide: {
    flex: 0.8,
    marginHorizontal: 5,
  },
});

function ControlerView({
  title = '',
  isFull = false,
  current = 0,
  total = 0,
  isPlaying = false,
  disableFullScreen = false,
  playSource,
  qualityList = [],
  onPressPlay,
  onPressPause,
  onPressFullIn,
  onPressFullOut,
  onPressConfig,
  onPressQuality,
  onSlide,
  themeColor,
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(current);
  const isSliding = useRef(false);
  const valueFormat = formatTime(value);
  const totalFormat = formatTime(total);
  const hasQuality = Array.isArray(qualityList) && qualityList.length;
  const quality = qualityList.find((o) => o.value === playSource);
  const { label: qualityLabel } = quality || { label: '画质' };

  const { animateValue, bottomAnimate, headerAnimate, opacityAnimate } = useMemo(() => {
    const animateValue = new Animated.Value(0);
    const bottomAnimate = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [controlerHeight, 0],
    });
    const headerAnimate = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-controlerHeight, 0],
    });
    const opacityAnimate = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return {
      animateValue,
      bottomAnimate,
      headerAnimate,
      opacityAnimate,
    };
  }, []);

  const [_, clear, set] = useTimeout(() => {
    setVisible(false);
  }, controlerDismissTime);

  useEffect(() => {
    if (!isSliding.current) {
      setValue(current);
    }
  }, [current]);

  useEffect(() => {
    Animated.timing(animateValue, {
      toValue: visible ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [visible, animateValue]);

  const handlePressPlayer = () => {
    if (visible) {
      setVisible(false);
      clear();
    } else {
      setVisible(true);
      set();
    }
  };

  return (
    <SafeAreaView style={styles.controler}>
      <AnimateLinearGradient
        colors={[GradientBlack, GradientWhite]}
        style={[
          styles.header,
          { opacity: opacityAnimate, transform: [{ translateY: headerAnimate }] },
        ]}
      >
        {isFull && <ControlIcon onPress={onPressFullOut} name="left" />}
        <Text style={styles.textTitle}>{title}</Text>
        {Boolean(hasQuality && isFull) && (
          <Text style={styles.textQuality} onPress={onPressQuality}>
            {qualityLabel}
          </Text>
        )}
        {isFull && <ControlIcon name="setting" onPress={onPressConfig} />}
      </AnimateLinearGradient>
      <PressView style={{ flex: 1 }} onPress={handlePressPlayer}></PressView>
      <AnimateLinearGradient
        colors={[GradientWhite, GradientBlack]}
        style={[
          styles.bottom,
          { opacity: opacityAnimate, transform: [{ translateY: bottomAnimate }] },
        ]}
      >
        <ControlIcon
          onPress={isPlaying ? onPressPause : onPressPlay}
          name={isPlaying ? 'pausecircleo' : 'playcircleo'}
        />
        <Text style={styles.textTime}>{`${valueFormat.M}:${valueFormat.S}`}</Text>
        <Slider
          step={1}
          value={value}
          minimumValue={0}
          maximumValue={total}
          style={styles.bottomSlide}
          minimumTrackTintColor={themeColor}
          thumbTintColor="white"
          maximumTrackTintColor="white"
          trackStyle={{ height: 2 }}
          thumbStyle={{ height: 10, width: 10 }}
          onSlidingStart={() => {
            isSliding.current = true;
          }}
          onSlidingComplete={() => {
            isSliding.current = false;
            onSlide(value);
          }}
          onValueChange={(data) => {
            setValue(data);
          }}
        />
        <Text style={styles.textTime}>{`${totalFormat.M}:${totalFormat.S}`}</Text>
        {!disableFullScreen && (
          <ControlIcon
            onPress={isFull ? onPressFullOut : onPressFullIn}
            name={isFull ? 'shrink' : 'arrowsalt'}
          />
        )}
      </AnimateLinearGradient>
      <Progress disable={visible} value={value} maxValue={total} themeColor={themeColor} />
    </SafeAreaView>
  );
}
export default ControlerView;
