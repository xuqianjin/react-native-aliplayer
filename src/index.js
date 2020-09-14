import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, StatusBar, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import { useBackHandler, useAppState, useDimensions } from '@react-native-community/hooks';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';

import ALIViewPlayer from './ALIViewPlayer';
import ControlerView from './components/ControlerView';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: 'black',
  },
});

const Player = forwardRef(
  (
    {
      title,
      source,
      qualityList,
      poster,
      style,
      themeColor,
      onFullScreen,
      onCompletion,
      setAutoPlay,
      ...restProps
    },
    ref
  ) => {
    const playerRef = useRef();
    const [playSource, setPlaySource] = useState(source);
    const [error, setError] = useState(false);
    const [errorObj, setErrorObj] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFull, setIsFull] = useState(false);
    const [isComplate, setIsComplate] = useState(false);
    const [isStopPlay, setIsStopPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(setAutoPlay);
    const [loadingObj, setLoadingObj] = useState({});
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const [buffer, setBuffer] = useState(0);
    const [isStart, setIsStart] = useState(false);
    const { screen, window } = useDimensions();
    const currentAppState = useAppState();
    const isChangeQuality = useRef(false);

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
      stop: handleStop,
      seekTo: handleSlide,
    }));

    // 处理切换资源
    useEffect(() => {
      if (source) {
        isChangeQuality.current = false;
        changeSource(source);
      }
    }, [source]);

    useEffect(() => {
      if (currentAppState === 'background') {
        playerRef.current.pausePlay();
        setIsPlaying(false);
      }
    }, [currentAppState]);

    useBackHandler(() => {
      if (isFull) {
        handleFullScreenOut();
        return true;
      }
      return false;
    });

    const changeSource = (src) => {
      setPlaySource(src);
      setLoading(true);
      setLoadingObj({});
      setError(false);
    };

    const handlePlay = () => {
      if (isComplate) {
        playerRef.current.restartPlay();
        setIsComplate(false);
      } else if (isStopPlay) {
        playerRef.current.reloadPlay();
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

    const handleStop = () => {
      playerRef.current.stopPlay();
      setIsStopPlay(true);
      setIsPlaying(false);
      setIsStart(false);
    };

    const handleFullScreenIn = () => {
      setIsFull(true);
      onFullScreen(true);
      hideNavigationBar();
    };

    const handleFullScreenOut = () => {
      onFullScreen(false);
      setIsFull(false);
      showNavigationBar();
    };

    const handleChangeConfig = (config) => {
      playerRef.current.setNativeProps(config);
    };

    const handleChangeQuality = (newSource) => {
      isChangeQuality.current = true;
      changeSource(newSource);
    };

    const isOrientationLandscape = window.width > window.height;

    const fullscreenStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: isOrientationLandscape
        ? Math.max(screen.width, screen.height)
        : Math.min(screen.width, screen.height),
      height: isOrientationLandscape
        ? Math.min(screen.width, screen.height)
        : Math.max(screen.width, screen.height),
      zIndex: 100,
    };

    const fullwindowStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: isOrientationLandscape
        ? Math.max(window.width, window.height)
        : Math.min(window.width, window.height),
      height: isOrientationLandscape
        ? Math.min(window.width, window.height)
        : Math.max(window.width, window.height),
    };

    return (
      <View style={[styles.base, isFull ? fullscreenStyle : style]}>
        <ALIViewPlayer
          {...restProps}
          ref={playerRef}
          source={playSource}
          setAutoPlay={setAutoPlay}
          style={isFull ? fullwindowStyle : StyleSheet.absoluteFill}
          onAliPrepared={({ nativeEvent }) => {
            setTotal(nativeEvent.duration);
            if (isPlaying) {
              playerRef.current.startPlay();
            }
            if (isChangeQuality.current) {
              playerRef.current.seekTo(current);
            } else {
              setCurrent(0);
              setBuffer(0);
            }
          }}
          onAliLoadingBegin={() => {
            setLoading(true);
            setLoadingObj({});
          }}
          onAliLoadingProgress={({ nativeEvent }) => {
            setLoadingObj(nativeEvent);
          }}
          onAliLoadingEnd={() => {
            setLoading(false);
            setLoadingObj({});
          }}
          onAliRenderingStart={() => {
            setError(false);
            setLoading(false);
            setIsStopPlay(false);
            setIsPlaying(true);
            setIsStart(true);
          }}
          onAliCurrentPositionUpdate={({ nativeEvent }) => {
            setCurrent(nativeEvent.position);
          }}
          onAliBufferedPositionUpdate={({ nativeEvent }) => {
            setBuffer(nativeEvent.position);
          }}
          onAliCompletion={() => {
            setIsComplate(true);
            setIsPlaying(false);
            onCompletion();
          }}
          onAliError={({ nativeEvent }) => {
            setError(true);
            setErrorObj(nativeEvent);
          }}
        >
          <StatusBar hidden={isFull} />
          <ControlerView
            {...restProps}
            title={title}
            isFull={isFull}
            current={current}
            buffer={buffer}
            total={total}
            isError={error}
            poster={poster}
            isStart={isStart}
            isLoading={loading}
            errorObj={errorObj}
            isPlaying={isPlaying}
            loadingObj={loadingObj}
            themeColor={themeColor}
            playSource={playSource}
            qualityList={qualityList}
            onSlide={handleSlide}
            onPressPlay={handlePlay}
            onPressPause={handlePause}
            onPressReload={handleReload}
            onPressFullIn={handleFullScreenIn}
            onPressFullOut={handleFullScreenOut}
            onChangeConfig={handleChangeConfig}
            onChangeQuality={handleChangeQuality}
          />
        </ALIViewPlayer>
      </View>
    );
  }
);
Player.propTypes = {
  ...ALIViewPlayer.propTypes,
  source: PropTypes.string, // 播放地址
  qualityList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string, // 标清 高清
      value: PropTypes.string, // 对应播放地址
    }) // 播放列表
  ),
  poster: Image.propTypes.source, // 封面图
  onFullScreen: PropTypes.func, // 全屏回调事件
  onCompletion: PropTypes.func, // 播放完成事件
  enableFullScreen: PropTypes.bool, // 是否允许全屏
  themeColor: PropTypes.string, // 播放器主题
  enableCast: PropTypes.bool, // 是否显示投屏按钮
  onCastClick: PropTypes.func, // 投屏按钮点击事件
};

Player.defaultProps = {
  onFullScreen: () => {},
  onCompletion: () => {},
  onCastClick: () => {},
  themeColor: '#F85959',
  enableHardwareDecoder: false,
  setSpeed: 1.0,
  setScaleMode: 0,
};

export default React.memo(Player);
