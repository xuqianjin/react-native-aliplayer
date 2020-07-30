//
//  ALIViewPlayerManager.m
//  NewsApp
//
//  Created by 宋族运 on 2020/7/29.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNAliplayerManager.h"

@implementation RNAliplayerManager

RCT_EXPORT_MODULE()
//暴露属性
RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(setAutoPlay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(setLoop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(setMute, BOOL)
RCT_EXPORT_VIEW_PROPERTY(enableHardwareDecoder, BOOL)
RCT_EXPORT_VIEW_PROPERTY(setVolume, float)
RCT_EXPORT_VIEW_PROPERTY(setSpeed, float)
RCT_EXPORT_VIEW_PROPERTY(setReferer, NSString)
RCT_EXPORT_VIEW_PROPERTY(setUserAgent, NSString)
RCT_EXPORT_VIEW_PROPERTY(setMirrorMode, int)
RCT_EXPORT_VIEW_PROPERTY(setRotateMode, int)
RCT_EXPORT_VIEW_PROPERTY(setScaleMode, int)

//暴露方法（原生调用，js回调）
RCT_EXPORT_VIEW_PROPERTY(onCompletion, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingBegin, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingProgress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingEnd, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPrepared, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRenderingStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSeekComplete, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCurrentPositionUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBufferedPositionUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAutoPlayStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoopingStart, RCTBubblingEventBlock)

//暴露方法（js调用，原生回调）
RCT_EXPORT_METHOD(startPlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer startPlay];
}
RCT_EXPORT_METHOD(pausePlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer pausePlay];
}
RCT_EXPORT_METHOD(stopPlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer stopPlay];
}
RCT_EXPORT_METHOD(reloadPlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer reloadPlay];
}
RCT_EXPORT_METHOD(restartPlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer restartPlay];
}
RCT_EXPORT_METHOD(destroyPlay:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer destroyPlay];
}
RCT_EXPORT_METHOD(seekTo:(nonnull NSNumber *) reactTag){
  [self.aliViewPlayer seekTo:[reactTag intValue]];
}

//重写这个方法，返回将要提供给RN使用的视图
- (UIView *)view {
  RNAliplayer * aliPlayer = [[RNAliplayer alloc] init];
  self.aliViewPlayer = aliPlayer;
  return aliPlayer;
}


@end
