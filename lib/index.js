import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { Icon, Slider, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import { useDeviceOrientation, useBackHandler, useAppState } from '@react-native-community/hooks';

import ALIViewPlayer from './ALIViewPlayer';
import useTimeout from './useTimeout';
import useUpdateEffect from './useUpdateEffect';

const GradientWhite = 'rgba(0,0,0,0)';
const GradientBlack = 'rgba(0,0,0,0.3)';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const controlerHeight = 40;

const AnimateLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  controler: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateview: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    color: 'white',
  },
  textTime: {
    color: 'white',
  },
  stateViewLoading: {},
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
  fullscreen: {
    ...StyleSheet.absoluteFill,
    width: screenHeight,
    height: screenWidth,
    zIndex: 99999,
  },
  retryButton: {
    width: 100,
    height: 50,
  },
});

const formatTime = (time) => {
  const S = ('00' + (time % 60)).slice(-2);
  const M = ('00' + parseInt(time / 60)).slice(-2);
  return { M, S };
};

function PressView({ children, ...props }) {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      {children}
    </TouchableOpacity>
  );
}

function ContorIcon({ ...props }) {
  return <Icon type="antdesign" color="white" size={20} {...props} />;
}

function StateView({
  title,
  isPlaying,
  isLoding,
  isError,
  loadingObj = {},
  errorObj = {},
  onPressPlay,
  onPressReload,
}) {
  const { percent } = loadingObj;
  const { message } = errorObj;
  let view = null;
  if (isLoding) {
    view = (
      <View style={styles.stateViewLoading}>
        <ActivityIndicator size="large" />
        {!!title && <Text style={styles.textLoadingTitle}>{`当前播放:${title}`}</Text>}
        <Text style={styles.textLoading}>
          <Text>缓冲中...</Text>
          {!!percent && <Text>{`${percent}%`}</Text>}
        </Text>
      </View>
    );
  }
  if (!isPlaying) {
    view = (
      <PressView onPress={onPressPlay}>
        <ContorIcon size={40} name="playcircleo" />
      </PressView>
    );
  }
  if (isError) {
    view = (
      <View style={styles.stateViewError}>
        <Text style={styles.textError}>播放错误:{message}</Text>
        <Button
          icon={{
            name: 'reload1',
            size: 12,
            color: 'white',
            type: 'antdesign',
          }}
          title="重试"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={{ width: 80, height: 30 }}
          onPress={onPressReload}
        />
      </View>
    );
  }
  return <View style={styles.stateview}>{view}</View>;
}

const animateValue = new Animated.Value(0);
const bottomAnimate = animateValue.interpolate({
  inputRange: [0, 1],
  outputRange: [controlerHeight, 0],
});
const headerAnimate = animateValue.interpolate({
  inputRange: [0, 1],
  outputRange: [-controlerHeight, 0],
});
function ControlerView({
  title = '',
  visible = true,
  isFull = false,
  current = 0,
  total = 0,
  isPlaying = false,
  disableFullScreen = false,
  onPressPause,
  onPressFull,
  onPressBack,
  onSlide,
}) {
  const [value, setValue] = useState(current);
  const isSliding = useRef(false);
  const valueFormat = formatTime(value);
  const totalFormat = formatTime(total);

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
  }, [visible]);

  return (
    <View style={styles.controler}>
      <AnimateLinearGradient
        colors={[GradientBlack, GradientWhite]}
        style={[styles.header, { transform: [{ translateY: headerAnimate }] }]}
      >
        {isFull && (
          <PressView onPress={onPressBack}>
            <ContorIcon name="left" />
          </PressView>
        )}
        <Text style={styles.textTitle}>{title}</Text>
      </AnimateLinearGradient>
      <AnimateLinearGradient
        colors={[GradientWhite, GradientBlack]}
        style={[styles.bottom, { transform: [{ translateY: bottomAnimate }] }]}
      >
        <PressView onPress={onPressPause}>
          <ContorIcon name={isPlaying ? 'pausecircleo' : 'playcircleo'} />
        </PressView>
        <Text style={styles.textTime}>{`${valueFormat.M}:${valueFormat.S}`}</Text>
        <Slider
          step={1}
          value={value}
          minimumValue={0}
          maximumValue={total}
          style={styles.bottomSlide}
          minimumTrackTintColor="#F85959"
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
          <PressView onPress={onPressFull}>
            <ContorIcon name={isFull ? 'shrink' : 'arrowsalt'} />
          </PressView>
        )}
      </AnimateLinearGradient>
    </View>
  );
}

export default function Player({
  title,
  source,
  poster,
  style,
  onFullScreen,
  onCompletion,
  disableFullScreen,
  ...restProps
}) {
  const playerRef = useRef();
  const [error, setError] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isComplate, setIsComplate] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingObj, setLoadingObj] = useState({});
  const [controlerVisible, setControlerVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [posterVisible, setPosterVisible] = useState(Boolean(poster));
  const { portrait, landscape } = useDeviceOrientation();
  const currentAppState = useAppState();

  const [_, clear, set] = useTimeout(() => {
    setControlerVisible(false);
  }, 5000);

  // 处理切换资源,直接播放
  useUpdateEffect(() => {
    if (!source) {
      return;
    }
    setLoading(true);
    setLoadingObj({});
    setError(false);
    playerRef.current.startPlay();
  }, [source]);

  useEffect(() => {
    if (currentAppState === 'background') {
      playerRef.current.pausePlay();
      setIsPlaying(false);
    }
  }, [currentAppState]);

  useEffect(() => {
    if (isFull) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    onFullScreen(isFull);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFull]);

  useBackHandler(() => {
    if (isFull) {
      setIsFull(false);
      return true;
    }
    return false;
  });

  const handlePlay = () => {
    playerRef.current.startPlay();
    setIsPlaying(true);
  };

  const handlePause = () => {
    playerRef.current.pausePlay();
    setIsPlaying(false);
  };

  const handleReload = () => {
    setError(false);
    playerRef.current.reloadPlay();
  };

  const handleSlide = (value) => {
    playerRef.current.seekTo(value);
  };

  const handlePressPlayer = () => {
    if (controlerVisible) {
      setControlerVisible(false);
      clear();
    } else {
      setControlerVisible(true);
      set();
    }
  };

  const handlePressPlay = () => {
    if (isComplate) {
      playerRef.current.restartPlay();
    } else {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    }
  };

  const handleFullScreen = () => {
    setIsFull((o) => !o);
  };

  const handleBackFullScreen = () => {
    setIsFull(false);
  };

  return (
    <PressView
      style={[styles.base, portrait && style, landscape && styles.fullscreen]}
      activeOpacity={1}
      onPress={handlePressPlayer}
    >
      <StatusBar hidden={isFull} />
      <ALIViewPlayer
        {...restProps}
        source={source}
        ref={playerRef}
        style={StyleSheet.absoluteFill}
        onPrepared={({ nativeEvent }) => {
          setTotal(nativeEvent.duration);
        }}
        onLoadingBegin={() => {
          setLoading(true);
          setLoadingObj({});
        }}
        onLoadingProgress={({ nativeEvent }) => {
          setLoadingObj(nativeEvent);
        }}
        onLoadingEnd={() => {
          setLoading(false);
          setLoadingObj({});
        }}
        onRenderingStart={() => {
          setLoading(false);
          setIsComplate(false);
          setIsPlaying(true);
          setPosterVisible(false);
        }}
        onCurrentPositionUpdate={({ nativeEvent }) => {
          setCurrent(nativeEvent.position);
        }}
        onCompletion={() => {
          setIsComplate(true);
          setIsPlaying(false);
          onCompletion();
        }}
        onError={({ nativeEvent }) => {
          setError(true);
          setErrorObj(nativeEvent);
        }}
      />
      {posterVisible && (
        <Image source={poster} resizeMode="cover" style={StyleSheet.absoluteFill} />
      )}
      <ControlerView
        title={title}
        isFull={isFull}
        visible={controlerVisible}
        current={current}
        total={total}
        onSlide={handleSlide}
        isPlaying={isPlaying}
        onPressPause={handlePressPlay}
        onPressFull={handleFullScreen}
        onPressBack={handleBackFullScreen}
        disableFullScreen={disableFullScreen}
      />
      <StateView
        title={title}
        isPlaying={isPlaying}
        isLoding={loading}
        isError={error}
        loadingObj={loadingObj}
        errorObj={errorObj}
        onPressPlay={handlePressPlay}
        onPressReload={handleReload}
      />
    </PressView>
  );
}

Player.propTypes = {
  source: PropTypes.string, // 播放地址
  poster: Image.propTypes.source, // 封面图
  onFullScreen: PropTypes.func, // 全屏回调事件
  onCompletion: PropTypes.func, // 播放完成事件
  disableFullScreen: PropTypes.bool, // 禁止全屏
};

Player.defaultProps = {
  onFullScreen: () => {},
  onCompletion: () => {},
  disableFullScreen: true,
};
