package com.reactlibrary;

import android.graphics.Color;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.aliyun.player.AliPlayer;
import com.aliyun.player.AliPlayerFactory;
import com.aliyun.player.IPlayer;
import com.aliyun.player.bean.ErrorInfo;
import com.aliyun.player.bean.InfoBean;
import com.aliyun.player.bean.InfoCode;
import com.aliyun.player.nativeclass.PlayerConfig;
import com.aliyun.player.source.UrlSource;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

public class RNAliplayerView extends SimpleViewManager<SurfaceView> {
    private static final String REACT_CLASS = "RNAliplayer";
    private static final String TAG = REACT_CLASS;
    private AliPlayer aliyunVodPlayer;
    private RCTEventEmitter mEventEmitter;

    private enum Events {
        onCompletion("onCompletion"),
        onError("onError"),
        onLoadingBegin("onLoadingBegin"),
        onLoadingProgress("onLoadingProgress"),
        onLoadingEnd("onLoadingEnd"),
        onPrepared("onPrepared"),
        onRenderingStart("onRenderingStart"),
        onSeekComplete("onSeekComplete"),
        onCurrentPositionUpdate("onCurrentPositionUpdate"),
        onBufferedPositionUpdate("onBufferedPositionUpdate"),
        onAutoPlayStart("onAutoPlayStart"),
        onLoopingStart("onLoopingStart");

        private final String mName;

        Events(final String name) {
            mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected SurfaceView createViewInstance(@NonNull ThemedReactContext reactContext) {
        aliyunVodPlayer = AliPlayerFactory.createAliPlayer(reactContext);
        mEventEmitter = reactContext.getJSModule(RCTEventEmitter.class);
        SurfaceView view = this.initView(reactContext);
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
    public void onDropViewInstance(SurfaceView view) {
        super.onDropViewInstance(view);
        Log.i(TAG, "onDropViewInstance: ");
    }

    @Override
    public void receiveCommand(SurfaceView view, String command, @Nullable ReadableArray args) {
        // This will be called whenever a command is sent from react-native.
        Log.i(TAG, "receiveCommand: " + command);
        switch (command) {
            case "startPlay":
                aliyunVodPlayer.start();
                break;
            case "pausePlay":
                aliyunVodPlayer.pause();
                break;
            case "stopPlay":
                aliyunVodPlayer.stop();
                break;
            case "reloadPlay":
                aliyunVodPlayer.reload();
                break;
            case "restartPlay":
                aliyunVodPlayer.reset();
                aliyunVodPlayer.prepare();
                aliyunVodPlayer.start();
                break;
            case "destroyPlay":
                aliyunVodPlayer.release();
                break;
            case "seekTo":
                long position = args.getInt(0) * 1000;
                aliyunVodPlayer.seekTo(position, IPlayer.SeekMode.Accurate);
                break;
        }
    }

    //设置播放源
    @ReactProp(name = "source")
    public void setSrc(SurfaceView view, String src) {
        Log.i(TAG, "setSrc: " + src);
        UrlSource source = new UrlSource();
        source.setUri(src);
        aliyunVodPlayer.reset();
        aliyunVodPlayer.setDataSource(source);
        aliyunVodPlayer.prepare();
    }

    //设置自动播放
    @ReactProp(name = "setAutoPlay")
    public void setAutoPlay(SurfaceView view, Boolean mode) {
        aliyunVodPlayer.setAutoPlay(mode);
    }

    //设置循环播放
    @ReactProp(name = "setLoop")
    public void setLoop(SurfaceView view, Boolean mode) {
        aliyunVodPlayer.setLoop(mode);
    }

    //设置播放器静音
    @ReactProp(name = "setMute")
    public void setMute(SurfaceView view, Boolean mode) {
        aliyunVodPlayer.setMute(mode);
    }

    //开启硬解。默认开启
    @ReactProp(name = "enableHardwareDecoder")
    public void enableHardwareDecoder(SurfaceView view, Boolean mode) {
        aliyunVodPlayer.enableHardwareDecoder(mode);
    }

    //设置播放器音量,范围0~1.
    @ReactProp(name = "setVolume")
    public void setVolume(SurfaceView view, float mode) {
        aliyunVodPlayer.setVolume(mode);
    }

    //设置倍速播放:支持0.5~2倍速的播放
    @ReactProp(name = "setSpeed")
    public void setSpeed(SurfaceView view, float mode) {
        aliyunVodPlayer.setSpeed(mode);
    }

    //设置Referer
    @ReactProp(name = "setReferer")
    public void setReferer(SurfaceView view, String referrer) {
        //先获取配置
        PlayerConfig config = aliyunVodPlayer.getConfig();
        //设置referer
        config.mReferrer = referrer;
        //设置配置给播放器
        aliyunVodPlayer.setConfig(config);
    }

    //设置UserAgent
    @ReactProp(name = "setUserAgent")
    public void setUserAgent(SurfaceView view, String UserAgent) {
        //先获取配置
        PlayerConfig config = aliyunVodPlayer.getConfig();
        //设置UA
        config.mUserAgent = UserAgent;
        //设置配置给播放器
        aliyunVodPlayer.setConfig(config);
    }

    //设置画面的镜像模式：水平镜像，垂直镜像，无镜像。
    @ReactProp(name = "setMirrorMode")
    public void setMirrorMode(SurfaceView view, int mode) {
        switch (mode) {
            case 0:
                aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_NONE);
                break;
            case 1:
                aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_HORIZONTAL);
                break;
            case 2:
                aliyunVodPlayer.setMirrorMode(IPlayer.MirrorMode.MIRROR_MODE_VERTICAL);
                break;
        }
    }

    //设置画面旋转模式：旋转0度，90度，180度，270度
    @ReactProp(name = "setRotateMode")
    public void setRotateMode(SurfaceView view, int mode) {
        switch (mode) {
            case 0:
                aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_0);
                break;
            case 1:
                aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_90);
                break;
            case 2:
                aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_180);
                break;
            case 3:
                aliyunVodPlayer.setRotateMode(IPlayer.RotateMode.ROTATE_270);
                break;
        }
    }

    //设置画面缩放模式：宽高比填充，宽高比适应，拉伸填充
    @ReactProp(name = "setScaleMode")
    public void setScaleMode(SurfaceView view, int mode) {
        switch (mode) {
            case 0:
                aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_ASPECT_FIT);
                break;
            case 1:
                aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_ASPECT_FILL);
                break;
            case 2:
                aliyunVodPlayer.setScaleMode(IPlayer.ScaleMode.SCALE_TO_FILL);
                break;
        }
        view.requestLayout();
    }


    private SurfaceView initView(ThemedReactContext reactContext) {
        SurfaceView view = new SurfaceView(reactContext);
        view.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                aliyunVodPlayer.setDisplay(holder);
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
                aliyunVodPlayer.redraw();
                Log.i(TAG, "surfaceChanged: ");
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                aliyunVodPlayer.setDisplay(null);
                Log.i(TAG, "surfaceDestroyed: ");
            }
        });
        return view;
    }

    private void initConfig(SurfaceView view) {
        aliyunVodPlayer.setVideoBackgroundColor(Color.TRANSPARENT);
    }

    private void initListener(final SurfaceView view) {
        aliyunVodPlayer.setOnInfoListener(new IPlayer.OnInfoListener() {
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
        aliyunVodPlayer.setOnPreparedListener(new IPlayer.OnPreparedListener() {
            @Override
            public void onPrepared() {
                Log.i(TAG, "onPrepared: " + aliyunVodPlayer.getDuration() / 1000);

                WritableMap event = Arguments.createMap();
                int duration = (int) (aliyunVodPlayer.getDuration() / 1000);//转换成秒
                event.putInt("duration", duration);
                mEventEmitter.receiveEvent(view.getId(), Events.onPrepared.toString(), event);
            }
        });
        aliyunVodPlayer.setOnCompletionListener(new IPlayer.OnCompletionListener() {
            @Override
            public void onCompletion() {
                Log.i(TAG, "onCompletion: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onCompletion.toString(), event);
            }
        });
        aliyunVodPlayer.setOnErrorListener(new IPlayer.OnErrorListener() {
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
        aliyunVodPlayer.setOnRenderingStartListener(new IPlayer.OnRenderingStartListener() {
            @Override
            public void onRenderingStart() {
                Log.i(TAG, "onRenderingStart: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onRenderingStart.toString(), event);
            }
        });
        aliyunVodPlayer.setOnSeekCompleteListener(new IPlayer.OnSeekCompleteListener() {
            @Override
            public void onSeekComplete() {
                Log.i(TAG, "onSeekComplete: ");

                WritableMap event = Arguments.createMap();
                mEventEmitter.receiveEvent(view.getId(), Events.onSeekComplete.toString(), event);
            }
        });

        aliyunVodPlayer.setOnLoadingStatusListener(new IPlayer.OnLoadingStatusListener() {
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
    }

}
