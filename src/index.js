import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  Image,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { Icon, Slider, Button } from 'react-native-elements';
import { useBackHandler, useAppState, useDimensions } from '@react-native-community/hooks';

import ALIViewPlayer from './ALIViewPlayer';
import useTimeout from './useTimeout';
import useUpdateEffect from './useUpdateEffect';

const GradientWhite = 'rgba(0,0,0,0)';
const GradientBlack = 'rgba(0,0,0,0.3)';
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
  retryButton: {
    width: 100,
    height: 50,
  },
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

function StateView({
  title,
  isPlaying,
  isLoading,
  isError,
  loadingObj = {},
  errorObj = {},
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
        {!!title && (
          <Text
            style={styles.textLoadingTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >{`当前播放:${title}`}</Text>
        )}
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
        {!!title && (
          <Text
            style={styles.textLoadingTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >{`${title}`}</Text>
        )}
      </PressView>
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
  return (
    <View style={styles.stateview} pointerEvents="box-none">
      {view}
    </View>
  );
}

function ControlerView({
  title = '',
  visible = true,
  isFull = false,
  current = 0,
  total = 0,
  isPlaying = false,
  disableFullScreen = false,
  onPressPlay,
  onPressPause,
  onPressFullIn,
  onPressFullOut,
  onSlide,
  themeColor,
}) {
  const [value, setValue] = useState(current);
  const isSliding = useRef(false);
  const valueFormat = formatTime(value);
  const totalFormat = formatTime(total);
  const { animateValue, bottomAnimate, headerAnimate } = useMemo(() => {
    const animateValue = new Animated.Value(0);
    const bottomAnimate = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [controlerHeight * 2, 0],
    });
    const headerAnimate = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-controlerHeight * 2, 0],
    });
    return {
      animateValue,
      bottomAnimate,
      headerAnimate,
    };
  }, []);

  useEffect(() => {
    if (!isSliding.current) {
      setValue(current);
    }
  }, [current]);

  useEffect(() => {
    Animated.timing(animateValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [visible, animateValue]);

  return (
    <SafeAreaView style={styles.controler}>
      <AnimateLinearGradient
        colors={[GradientBlack, GradientWhite]}
        style={[styles.header, { transform: [{ translateY: headerAnimate }] }]}
      >
        {isFull && (
          <PressView onPress={onPressFullOut}>
            <ContorIcon name="left" />
          </PressView>
        )}
        <Text style={styles.textTitle}>{title}</Text>
      </AnimateLinearGradient>
      <AnimateLinearGradient
        colors={[GradientWhite, GradientBlack]}
        style={[styles.bottom, { transform: [{ translateY: bottomAnimate }] }]}
      >
        <PressView onPress={isPlaying ? onPressPause : onPressPlay}>
          <ContorIcon name={isPlaying ? 'pausecircleo' : 'playcircleo'} />
        </PressView>
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
          <PressView onPress={isFull ? onPressFullOut : onPressFullIn}>
            <ContorIcon name={isFull ? 'shrink' : 'arrowsalt'} />
          </PressView>
        )}
      </AnimateLinearGradient>
      <Progress disable={visible} value={value} maxValue={total} themeColor={themeColor} />
    </SafeAreaView>
  );
}

const Player = forwardRef(
  (
    {
      title,
      source,
      poster,
      style,
      themeColor,
      onFullScreen,
      onCompletion,
      disableFullScreen,
      ...restProps
    },
    ref
  ) => {
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
    const window = useDimensions().window;
    const currentAppState = useAppState();
    useImperativeHandle(ref, () => ({
      play: (play) => {
        if (play) {
          handlePlay();
        } else {
          handlePause();
        }
      },
      fullscreen: (full) => {
        if (full) {
          handleFullScreenIn();
        } else {
          handleFullScreenOut();
        }
      },
    }));
    const [_, clear, set] = useTimeout(() => {
      setControlerVisible(false);
    }, 5000);

    // 处理切换资源
    useUpdateEffect(() => {
      if (!source || !isPlaying) {
        return;
      }
      setLoading(true);
      setLoadingObj({});
      setError(false);
      setIsPlaying(true);
      playerRef.current.startPlay();
    }, [source]);

    useEffect(() => {
      if (currentAppState === 'background') {
        playerRef.current.pausePlay();
        setIsPlaying(false);
      }
    }, [currentAppState]);

    useBackHandler(() => {
      if (isFull) {
        setIsFull(false);
        return true;
      }
      return false;
    });

    const handlePlay = () => {
      if (isComplate) {
        playerRef.current.restartPlay();
      } else {
        playerRef.current.startPlay();
      }
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

    const handleFullScreenIn = () => {
      setIsFull(true);
      onFullScreen(true);
    };

    const handleFullScreenOut = () => {
      onFullScreen(false);
      setIsFull(false);
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

    const fullscreenStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: window.width,
      height: window.height,
      zIndex: 100,
    };

    return (
      <PressView
        activeOpacity={1}
        onPress={handlePressPlayer}
        style={[styles.base, isFull ? fullscreenStyle : style]}
      >
        <StatusBar hidden={isFull} />
        <ALIViewPlayer
          {...restProps}
          source={source}
          ref={playerRef}
          style={StyleSheet.absoluteFill}
          onPrepared={({ nativeEvent }) => {
            setCurrent(0);
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
          themeColor={themeColor}
          onPressPlay={handlePlay}
          onPressPause={handlePause}
          onPressFullIn={handleFullScreenIn}
          onPressFullOut={handleFullScreenOut}
          disableFullScreen={disableFullScreen}
        />
        <StateView
          title={title}
          isError={error}
          isLoading={loading}
          errorObj={errorObj}
          isPlaying={isPlaying}
          loadingObj={loadingObj}
          themeColor={themeColor}
          onPressPlay={handlePlay}
          onPressReload={handleReload}
        />
      </PressView>
    );
  }
);
Player.propTypes = {
  ...ALIViewPlayer.propTypes,
  source: PropTypes.string, // 播放地址
  poster: Image.propTypes.source, // 封面图
  onFullScreen: PropTypes.func, // 全屏回调事件
  onCompletion: PropTypes.func, // 播放完成事件
  disableFullScreen: PropTypes.bool, // 禁止全屏
  themeColor: PropTypes.string, // 播放器主题
};

Player.defaultProps = {
  onFullScreen: () => {},
  onCompletion: () => {},
  themeColor: '#F85959',
};

export default Player;
