import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, StatusBar, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import { useBackHandler, useAppState, useDimensions } from '@react-native-community/hooks';

import ALIViewPlayer from './ALIViewPlayer';
import ControlerView from './components/ControlerView';
import ConfigView from './components/ConfigView';
import QualityView from './components/QualityView';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: 'black',
  },
});

const defaultConfig = { enableHardwareDecoder: true, setSpeed: 1.0, setScaleMode: 0 };

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
      disableFullScreen,
      ...restProps
    },
    ref
  ) => {
    const playerRef = useRef();
    const [playSource, setPlaySource] = useState(source);
    const [configVisible, setConfigVisible] = useState(false);
    const [qualityVisible, setQualityVisible] = useState(false);
    const [error, setError] = useState(false);
    const [errorObj, setErrorObj] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFull, setIsFull] = useState(false);
    const [isComplate, setIsComplate] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingObj, setLoadingObj] = useState({});
    const [configObj, setConfigObj] = useState(defaultConfig);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const [posterVisible, setPosterVisible] = useState(Boolean(poster));
    const window = useDimensions().window;
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
    }));

    // 处理切换资源
    useEffect(() => {
      if (source) {
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

    const fullscreenStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: window.width,
      height: window.height,
      zIndex: 100,
    };

    return (
      <View style={[styles.base, isFull ? fullscreenStyle : style]}>
        <StatusBar hidden={isFull} />
        <ALIViewPlayer
          {...configObj}
          {...restProps}
          source={playSource}
          ref={playerRef}
          style={StyleSheet.absoluteFill}
          onAliPrepared={({ nativeEvent }) => {
            setTotal(nativeEvent.duration);
            if (isPlaying) {
              playerRef.current.startPlay();
            }
            if (isChangeQuality.current) {
              playerRef.current.seekTo(current);
            } else {
              setCurrent(0);
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
            setLoading(false);
            setIsComplate(false);
            setIsPlaying(true);
            setPosterVisible(false);
          }}
          onAliCurrentPositionUpdate={({ nativeEvent }) => {
            setCurrent(nativeEvent.position);
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
        />
        {posterVisible && (
          <Image source={poster} resizeMode="cover" style={StyleSheet.absoluteFill} />
        )}
        <ControlerView
          title={title}
          isFull={isFull}
          current={current}
          total={total}
          isError={error}
          isLoading={loading}
          errorObj={errorObj}
          isPlaying={isPlaying}
          loadingObj={loadingObj}
          themeColor={themeColor}
          onPressPlay={handlePlay}
          onPressReload={handleReload}
          onSlide={handleSlide}
          playSource={playSource}
          qualityList={qualityList}
          onPressPause={handlePause}
          onPressFullIn={handleFullScreenIn}
          onPressFullOut={handleFullScreenOut}
          onPressConfig={() => setConfigVisible(true)}
          onPressQuality={() => setQualityVisible(true)}
          disableFullScreen={disableFullScreen}
        />
        <ConfigView
          config={configObj}
          visible={configVisible}
          themeColor={themeColor}
          onClose={() => setConfigVisible(false)}
          onChange={(res) => {
            setConfigObj((o) => ({ ...o, ...res }));
          }}
        />
        <QualityView
          themeColor={themeColor}
          playSource={playSource}
          visible={qualityVisible}
          qualityList={qualityList}
          onChange={(res) => {
            isChangeQuality.current = true;
            changeSource(res.value);
            setQualityVisible(false);
          }}
          onClose={() => setQualityVisible(false)}
        />
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
  disableFullScreen: PropTypes.bool, // 禁止全屏
  themeColor: PropTypes.string, // 播放器主题
};

Player.defaultProps = {
  onFullScreen: () => {},
  onCompletion: () => {},
  themeColor: '#F85959',
};

export default Player;
