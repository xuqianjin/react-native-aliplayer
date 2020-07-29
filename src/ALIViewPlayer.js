import React, { PureComponent } from 'react';
import { UIManager, findNodeHandle, requireNativeComponent } from 'react-native';
import PropTypes from 'prop-types';

export default class ALIViewPlayer extends PureComponent {
  componentWillUnmount() {
    this.stopPlay();
    this.destroyPlay();
  }

  _assignRoot = (component) => {
    this._root = component;
  };

  _dispatchCommand = (command, params = []) => {
    if (this._root) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(this._root), command, params);
    }
  };

  setNativeProps = (props) => {
    if (this._root) {
      this._root.setNativeProps(props);
    }
  };

  // 开始播放。
  startPlay = () => {
    this._dispatchCommand('startPlay');
  };

  // 暂停播放
  pausePlay = () => {
    this._dispatchCommand('pausePlay');
  };

  // 停止播放
  stopPlay = () => {
    this._dispatchCommand('stopPlay');
  };

  // 重载播放
  reloadPlay = () => {
    this._dispatchCommand('reloadPlay');
  };

  // 重新播放
  restartPlay = () => {
    this._dispatchCommand('restartPlay');
  };

  // 释放。释放后播放器将不可再被使用
  destroyPlay = () => {
    this._dispatchCommand('destroyPlay');
  };

  // 跳转到指定位置,传入单位为秒
  seekTo = (position = 0) => {
    if (Number(position)) {
      this._dispatchCommand('seekTo', [Number(position)]);
    }
  };

  render() {
    return <RCTVideo ref={this._assignRoot} {...this.props} />;
  }
}

ALIViewPlayer.propTypes = {
  // 基础配置
  source: PropTypes.string, // 播放地址
  setAutoPlay: PropTypes.bool, // 设置自动播放
  setLoop: PropTypes.bool, // 设置循环播放
  setMute: PropTypes.bool, // 设置播放器静音
  enableHardwareDecoder: PropTypes.bool, // 开启硬解。默认开启
  setVolume: PropTypes.number, // 设置播放器音量,范围0~1.
  setSpeed: PropTypes.number, // 设置倍速播放:支持0.5~2倍速的播放
  setReferer: PropTypes.string, // 设置Referer
  setUserAgent: PropTypes.string, // 设置UserAgent
  setMirrorMode: PropTypes.oneOf([0, 1, 2]), // 0:无镜像;1:横向;2:竖向
  setRotateMode: PropTypes.oneOf([0, 1, 2, 3]), // 设置旋转 0:0度;1:90度;2:180度;3:270度;
  setScaleMode: PropTypes.oneOf([0, 1, 2]), // 设置画面缩放模式 0:宽高比适应;1:宽高比填充;2:拉伸填充;

  onCompletion: PropTypes.func, // 播放完成事件
  onError: PropTypes.func, // 出错事件
  onLoadingBegin: PropTypes.func, // 缓冲开始。
  onLoadingProgress: PropTypes.func, // 缓冲进度
  onLoadingEnd: PropTypes.func, // 缓冲结束
  onPrepared: PropTypes.func, // 准备成功事件
  onRenderingStart: PropTypes.func, // 首帧渲染显示事件
  onSeekComplete: PropTypes.func, // 拖动结束
  onCurrentPositionUpdate: PropTypes.func, // 播放进度
  onBufferedPositionUpdate: PropTypes.func, // 缓冲进度
  onAutoPlayStart: PropTypes.func, // 自动播放开始
  onLoopingStart: PropTypes.func, // 循环播放开始
};

ALIViewPlayer.defaultProps = {
  setAutoPlay: false,
  setScaleMode: 0,
};

const RCTVideo = requireNativeComponent('RNAliplayer');
