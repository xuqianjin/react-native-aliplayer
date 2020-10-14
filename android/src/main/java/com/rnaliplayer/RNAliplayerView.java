package com.rnaliplayer;

import android.graphics.Color;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.aliyun.player.AliPlayerFactory;
import com.aliyun.player.IPlayer;
import com.aliyun.player.bean.ErrorInfo;
import com.aliyun.player.bean.InfoBean;
import com.aliyun.player.bean.InfoCode;
import com.aliyun.player.nativeclass.PlayerConfig;
import com.aliyun.player.nativeclass.TrackInfo;
import com.aliyun.player.source.UrlSource;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.List;
import java.util.Map;

public class RNAliplayerView extends ViewGroupManager<AliSurfaceView> {
    private static final String REACT_CLASS = "RNAliplayer";
    private static final String TAG = REACT_CLASS;
    private RCTEventEmitter mEventEmitter;

    private enum Events {
        onCompletion("onAliCompletion"),
        onError("onAliError"),
        onLoadingBegin("onAliLoadingBegin"),
        onLoadingProgress("onAliLoadingProgress"),
        onLoadingEnd("onAliLoadingEnd"),
        onPrepared("onAliPrepared"),
        onRenderingStart("onAliRenderingStart"),
        onSeekComplete("onAliSeekComplete"),
        onCurrentPositionUpdate("onAliCurrentPositionUpdate"),
        onBufferedPositionUpdate("onAliBufferedPositionUpdate"),
        onAutoPlayStart("onAliAutoPlayStart"),
        onLoopingStart("onAliLoopingStart"),
        onBitrateChange("onAliBitrateChange"),
        onBitrateReady("onAliBitrateReady");

        private final String mName;

        Events(final String name) {
            mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }

    @Override
    public void addView(AliSurfaceView parent, View child, int index) {
        super.addView(parent, child, parent.getChildCount());
    }

    @Override
    public void addViews(AliSurfaceView parent, List<View> views) {
        super.addViews(parent, views);
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected AliSurfaceView createViewInstance(@NonNull ThemedReactContext reactContext) {
        mEventEmitter = reactContext.getJSModule(RCTEventEmitter.class);
        AliSurfaceView view = new AliSurfaceView(reactContext);
        this.initConfig(view);
        this.initListener(view);
        return view;
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder builder = MapBuilder.builder();
        for (Events event : Events.values()) {
            builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()));
        }
        return builder.build();
    }

    @Override
    public void onDropViewInstance(AliSurfaceView view) {
        super.onDropViewInstance(view);
        Log.i(TAG, "onDropViewInstance: ");
    }

    @Override
    public void receiveCommand(AliSurfaceView view, String command, @Nullable ReadableArray args) {
        // This will be called whenever a command is sent from react-native.
        Log.i(TAG, "receiveCommand: " + command);
        switch (command) {
            case "startPlay":
                view.aliyunVodPlayer.start();
                break;
            case "pausePlay":
                view.aliyunVodPlayer.pause();
                break;
            case "stopPlay":
                view.aliyunVodPlayer.stop();
                break;
            case "reloadPlay":
                view.aliyunVodPlayer.reload();
                break;
            case "restartPlay":
                view.aliyunVodPlayer.seekTo(0, IPlayer.SeekMode.Accurate);
                view.aliyunVodPlayer.start();
                break;
            case "destroyPlay":
                view.aliyunVodPlayer.release();
                break;
            case "seekTo":
                long position = args.getInt(0) * 1000;
                Log.i(TAG, "receiveCommand: " + position);
                view.aliyunVodPlayer.seekTo(position, IPlayer.SeekMode.Accurate);
                break;
        }
    }

    //设置播放源
    @ReactProp(name = "source")
    public void setSrc(AliSurfaceView view, String src) {
        Log.i(TAG, "setSrc: " + src);
        UrlSource source = new UrlSource();
        source.setUri(src);
        view.aliyunVodPlayer.setDataSource(source);
        view.aliyunVodPlayer.prepare();
    }

    //设置自动播放
    @ReactProp(name = "setAutoPlay")
    public void setAutoPlay(AliSurfaceView view, Boolean mode) {
        view.aliyunVodPlayer.setAutoPlay(mode);
    }

    //设置循环播放
    @ReactProp(name = "setLoop")
    public void setLoop(AliSurfaceView view, Boolean mode) {
        view.aliyunVodPlayer.setLoop(mode);
    }

    //设置播放器静音
    @ReactProp(name = "setMute")
    public void setMute(AliSurfaceView view, Boolean mode) {
        view.aliyunVodPlayer.setMute(mode);
    }

    //开启硬解。默认开启
    @ReactProp(name = "enableHardwareDecoder")
    public void enableHardwareDecoder(AliSurfaceView view, Boolean mode) {
        view.aliyunVodPlayer.enableHardwareDecoder(mode);
    }

    //设置播放器音量,范围0~1.
    @ReactProp(name = "setVolume")
    public void setVolume(AliSurfaceView view, float mode) {
        view.aliyunVodPlayer.setVolume(mode);
    }

    //设置倍速播放:支持0.5~2倍速的播放
    @ReactProp(name = "setSpeed")
    public void setSpeed(AliSurfaceView view, float mode) {
        view.aliyunVodPlayer.setSpeed(mode);
    }

    //设置Referer
    @ReactProp(name = "setReferer")
    public void setReferer(AliSurfaceView view, String referrer) {
        //先获取配置
        PlayerConfig config = view.aliyunVodPlayer.getConfig();
        //设置referer
        config.mReferrer = referrer;
        //设置配置给播放器
        updateAliConfig(view, config);
    }

    //设置UserAgent
    @ReactProp(name = "setUserAgent")
    public void setUserAgent(AliSurfaceView view, String UserAgent) {
        //先获取配置
        PlayerConfig config = view.aliyunVodPlayer.getConfig();
        //设置UA
        config.mUserAgent = UserAgent;
        //设置配置给播放器
        updateAliConfig(view, config);
    }

    //设置画面的镜像模式：水平镜像，垂直镜像，无镜像。
    @ReactProp(name = "setMirrorMode")
    public void setMirrorMode(AliSurfaceView view, int mode) {
        switch (mode) {
            case 0:
                view.aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_NONE);
                break;
            case 1:
                view.aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_HORIZONTAL);
                break;
            case 2:
                view.aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_VERTICAL);
                break;
        }
    }

    //设置画面旋转模式：旋转0度，90度，180度，270度
    @ReactProp(name = "setRotateMode")
    public void setRotateMode(AliSurfaceView view, int mode) {
        switch (mode) {
            case 0:
                view.aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_0);
                break;
            case 1:
                view.aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_90);
                break;
            case 2:
                view.aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_180);
                break;
            case 3:
                view.aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_270);
                break;
        }
    }

    //设置画面缩放模式：宽高比填充，宽高比适应，拉伸填充
    @ReactProp(name = "setScaleMode")
    public void setScaleMode(AliSurfaceView view, int mode) {
        switch (mode) {
            case 0:
                view.aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_ASPECT_FIT);
                break;
            case 1:
                view.aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_ASPECT_FILL);
                break;
            case 2:
                view.aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_TO_FILL);
                break;
        }
    }

    @ReactProp(name = "configHeader")
    public void configHeader(AliSurfaceView view, ReadableArray headerArray) {
        if (headerArray == null) {
            return;
        }
        PlayerConfig config = view.aliyunVodPlayer.getConfig();
        String[] headers = new String[headerArray.size()];
        for (int i = 0; i < headerArray.size(); i++) {
            headers[i] = headerArray.getString(i);
        }
        config.setCustomHeaders(headers);
        updateAliConfig(view, config);
    }

    @ReactProp(name = "selectBitrateIndex")
    public void selectBitrateIndex(AliSurfaceView view, int bitrateIndex) {
        if (bitrateIndex == -1) {
            view.aliyunVodPlayer.selectTrack(TrackInfo.AUTO_SELECT_INDEX);
        } else {
            view.aliyunVodPlayer.selectTrack(bitrateIndex);
        }
    }

    private void updateAliConfig(AliSurfaceView view, PlayerConfig config) {
        view.aliyunVodPlayer.setConfig(config);
        view.aliyunVodPlayer.prepare();
    }

    private void initConfig(AliSurfaceView view) {
        view.aliyunVodPlayer.setVideoBackgroundColor(Color.TRANSPARENT);
        view.setBackgroundColor(Color.TRANSPARENT);
    }

    private void initListener(final AliSurfaceView view) {
        view.aliyunVodPlayer.setOnInfoListener(new IPlayer.OnInfoListener() {
            @Override
            public void onInfo(InfoBean infoBean) {
                WritableMap event = Arguments.createMap();
                if (infoBean.getCode() == InfoCode.CurrentPosition) {
                    event.putInt("position", (int) (infoBean.getExtraValue() / 1000));//转换成秒
                    mEventEmitter.receiveEvent(view.getId(), Events.onCurrentPositionUpdate.toString(), event);
                } else if (infoBean.getCode() == InfoCode.BufferedPosition) {
                    event.putInt("position", (int) (infoBean.getExtraValue() / 1000));//转换成秒
                    mEventEmitter.receiveEvent(view.getId(), Events.onBufferedPositionUpdate.toString(), event);
                } else if (infoBean.getCode() == InfoCode.AutoPlayStart) {
                    mEventEmitter.receiveEvent(view.getId(), Events.onAutoPlayStart.toString(), event);
                } else if (infoBean.getCode() == InfoCode.LoopingStart) {
                    mEventEmitter.receiveEvent(view.getId(), Events.onLoopingStart.toString(), event);
                }
            }
        });
        view.aliyunVodPlayer.setOnPreparedListener(new IPlayer.OnPreparedListener() {
            @Override
            public void onPrepared() {
                Log.i(TAG, "onPrepared: " + view.aliyunVodPlayer.getDuration() / 1000);
                
                WritableArray bitratesArray = new WritableNativeArray();
                WritableMap prepareEvent = Arguments.createMap();
                int duration = (int) (view.aliyunVodPlayer.getDuration() / 1000);//转换成秒
                prepareEvent.putInt("duration", duration);
                mEventEmitter.receiveEvent(view.getId(), Events.onPrepared.toString(), prepareEvent);

                WritableMap bitrateEvent = Arguments.createMap();
                List<TrackInfo> trackInfos = view.aliyunVodPlayer.getMediaInfo().getTrackInfos();
                for (TrackInfo item : trackInfos) {
                    if (item.getVideoBitrate() > 0) {
                        WritableMap map = new WritableNativeMap();
                        map.putInt("index", item.getIndex());
                        map.putInt("width", item.getVideoWidth());
                        map.putInt("height", item.getVideoHeight());
                        map.putInt("bitrate", item.getVideoBitrate());
                        bitratesArray.pushMap(map);
                    }
                }
                bitrateEvent.putArray("bitrates", bitratesArray);
                mEventEmitter.receiveEvent(view.getId(), Events.onBitrateReady.toString(), bitrateEvent);
            }
        });
        view.aliyunVodPlayer.setOnCompletionListener(new IPlayer.OnCompletionListener() {
            @Override
            public void onCompletion() {
                Log.i(TAG, "onCompletion: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onCompletion.toString(), event);
            }
        });
        view.aliyunVodPlayer.setOnErrorListener(new IPlayer.OnErrorListener() {
            @Override
            public void onError(ErrorInfo errorInfo) {
                Log.i(TAG, "onError: " + errorInfo.getExtra());
                Log.i(TAG, "onError: " + errorInfo.getMsg());
                Log.i(TAG, "onError: " + errorInfo.getCode().toString());

                WritableMap event = Arguments.createMap();
                event.putString("code", errorInfo.getCode().toString());
                event.putString("message", errorInfo.getMsg());
                mEventEmitter.receiveEvent(view.getId(), Events.onError.toString(), event);
            }
        });
        view.aliyunVodPlayer.setOnRenderingStartListener(new IPlayer.OnRenderingStartListener() {
            @Override
            public void onRenderingStart() {
                Log.i(TAG, "onRenderingStart: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onRenderingStart.toString(), event);
            }
        });
        view.aliyunVodPlayer.setOnSeekCompleteListener(new IPlayer.OnSeekCompleteListener() {
            @Override
            public void onSeekComplete() {
                Log.i(TAG, "onSeekComplete: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onSeekComplete.toString(), event);
            }
        });

        view.aliyunVodPlayer.setOnLoadingStatusListener(new IPlayer.OnLoadingStatusListener() {
            @Override
            public void onLoadingBegin() {
                Log.i(TAG, "onLoadingBegin: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onLoadingBegin.toString(), event);
            }

            @Override
            public void onLoadingProgress(int percent, float kbps) {
                Log.i(TAG, "onLoadingProgress: " + percent);

                WritableMap event = Arguments.createMap();
                event.putInt("percent", percent);
                mEventEmitter.receiveEvent(view.getId(), Events.onLoadingProgress.toString(), event);
            }

            @Override
            public void onLoadingEnd() {
                Log.i(TAG, "onLoadingEnd: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onLoadingEnd.toString(), event);
            }
        });

        view.aliyunVodPlayer.setOnTrackChangedListener(new IPlayer.OnTrackChangedListener() {
            @Override
            public void onChangedSuccess(TrackInfo trackInfo) {
                //切换成功
                Log.i(TAG, "onChangedSuccess: " + trackInfo.getIndex());

                WritableMap event = Arguments.createMap();
                event.putInt("index", trackInfo.getIndex());
                event.putInt("width", trackInfo.getVideoWidth());
                event.putInt("height", trackInfo.getVideoHeight());
                mEventEmitter.receiveEvent(view.getId(), Events.onBitrateChange.toString(), event);
            }

            @Override
            public void onChangedFail(TrackInfo trackInfo, ErrorInfo errorInfo) {
                //切换失败。失败原因通过errorInfo.getMsg()获取
                Log.i(TAG, "onChangedFail: " + errorInfo.getMsg());
            }
        });
    }
}
