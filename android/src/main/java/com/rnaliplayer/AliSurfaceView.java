package com.rnaliplayer;

import android.content.Context;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import com.aliyun.player.AliPlayer;
import com.aliyun.player.AliPlayerFactory;

public class AliSurfaceView extends FrameLayout {
    public AliPlayer aliyunVodPlayer;

    public AliSurfaceView(Context context) {
        super(context);
        aliyunVodPlayer = AliPlayerFactory.createAliPlayer(context);
        SurfaceView surfaceView = new SurfaceView(context);
        addView(surfaceView);
        surfaceView.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                aliyunVodPlayer.setDisplay(holder);
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
                aliyunVodPlayer.redraw();
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                aliyunVodPlayer.setDisplay(null);
            }
        });
    }
}