# react-native-aliplayer

阿里云点播播放器 RN 封装,支持多种播放格式,支持 android 和 ios

## Getting started

`$ npm install react-native-aliplayer --save`

### Mostly automatic installation

`$ react-native link react-native-aliplayer`

### Manual installation

## Usage

```javascript
import RNAliplayer from 'react-native-aliplayer';

const source='http://200024424.vod.myqcloud.com/200024424_709ae516bdf811e6ad39991f76a4df69.f20.mp4'

<RNAliplayer source={source} style={{ width: screenWidth, height: 200 }} />;
```

## Props

| name             | description  |
| ---------------- | ------------ |
| source           | 播放资源     |
| qualityList      | 可切换资源   |
| poster           | 封面图       |
| enableFullScreen | 是否允许全屏 |
| onFullScreen     | 全屏事件     |
| themeColor       | 主题色       |
| onCompletion     | 播放完毕事件 |

## Method

| name       | parmas     | description   |
| ---------- | ---------- | ------------- |
| play       | true/false | 开始/暂停播放 |
| fullscreen | true/false | 控制是否全屏  |

```js
this.RNAliplayerRef.play();
this.RNAliplayerRef.fullscreen();
```

## Custom ui

自定义控制层 UI

```javascript
import ALIViewPlayer from 'react-native-aliplayer/ALIViewPlayer';

// ALIViewPlayer 支持参数可见源码 ALIViewPlayer.propTypes
<ALIViewPlayer>
  <CustomUi />
</ALIViewPlayer>;
```
