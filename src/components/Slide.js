import React, { useRef, useEffect, useMemo } from 'react';
import Slider, { Ballon } from 'react-native-reanimated-slider';
import Animated from 'react-native-reanimated';
import { formatTime } from '../lib/utils';

const { Value } = Animated;

function VideoSlide({ style, progress, min, max, themeColor, cache, ...restProps }) {
  const ballonRef = useRef();

  const valueMin = useMemo(() => new Value(0), []);
  const valueMax = useMemo(() => new Value(0), []);
  const valueProgress = useMemo(() => new Value(0), []);
  const valueCache = useMemo(() => new Value(0), []);

  useEffect(() => {
    valueMin.setValue(min);
    valueMax.setValue(max);
    valueProgress.setValue(progress);
    valueCache.setValue(cache);
  }, [max, min, progress, cache, valueMin, valueMax, valueProgress, valueCache]);

  const renderBallon = () => {
    return <Ballon ref={ballonRef} color={themeColor} textStyle={{ color: 'white' }} />;
  };

  return (
    <Slider
      style={style}
      min={valueMin}
      max={valueMax}
      progress={valueProgress}
      cache={valueCache}
      minimumTrackTintColor={themeColor}
      cacheTrackTintColor="#bbb"
      thumbTintColor="white"
      maximumTrackTintColor="white"
      ballon={(value) => {
        const formatValue = formatTime(value);
        return `${formatValue.M}:${formatValue.S}`;
      }}
      renderBallon={renderBallon}
      renderThumbImage={() => {}}
      setBallonText={(text) => ballonRef.current.setText(text)}
      {...restProps}
    />
  );
}

VideoSlide.defaultProps = {
  onSlidingStart: () => {},
  onSlidingComplete: () => {},
};

export default VideoSlide;
