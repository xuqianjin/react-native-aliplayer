//
//  ALIViewPlayer.h
//  NewsApp
//
//  Created by 宋族运 on 2020/7/29.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import <AliyunPlayer/AliyunPlayer.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNAliplayer : UIView<AVPDelegate>

//播放器对象
@property(nonatomic,strong) AliPlayer * player;

//定义要暴露属性
@property(nonatomic,strong) NSString * source;
@property(nonatomic,assign) BOOL  setAutoPlay;
@property(nonatomic,assign) BOOL  setLoop;
@property(nonatomic,assign) BOOL  setMute;
@property(nonatomic,assign) BOOL  enableHardwareDecoder;
@property(nonatomic,assign) float  setVolume;
@property(nonatomic,assign) float  setSpeed;
@property(nonatomic,strong) NSString * setReferer;
@property(nonatomic,strong) NSString * setUserAgent;
@property(nonatomic,assign) int  setMirrorMode;
@property(nonatomic,assign) int  setRotateMode;
@property(nonatomic,assign) int  setScaleMode;

//定义要暴露的事件
@property (nonatomic, copy) RCTBubblingEventBlock onCompletion;
@property (nonatomic, copy) RCTBubblingEventBlock onError;
@property (nonatomic, copy) RCTBubblingEventBlock onLoadingBegin;
@property (nonatomic, copy) RCTBubblingEventBlock onLoadingProgress;
@property (nonatomic, copy) RCTBubblingEventBlock onLoadingEnd;
@property (nonatomic, copy) RCTBubblingEventBlock onPrepared;
@property (nonatomic, copy) RCTBubblingEventBlock onRenderingStart;
@property (nonatomic, copy) RCTBubblingEventBlock onSeekComplete;
@property (nonatomic, copy) RCTBubblingEventBlock onCurrentPositionUpdate;
@property (nonatomic, copy) RCTBubblingEventBlock onBufferedPositionUpdate;
@property (nonatomic, copy) RCTBubblingEventBlock onAutoPlayStart;
@property (nonatomic, copy) RCTBubblingEventBlock onLoopingStart;


-(void)startPlay;
-(void)pausePlay;
-(void)stopPlay;
-(void)reloadPlay;
-(void)restartPlay;
-(void)destroyPlay;
-(void)seekTo:(int) position;

@end

NS_ASSUME_NONNULL_END
