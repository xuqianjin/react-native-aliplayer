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
RCT_EXPORT_VIEW_PROPERTY(configHeader, NSArray)
RCT_EXPORT_VIEW_PROPERTY(selectBitrateIndex, int)

//暴露方法（原生调用，js回调）
RCT_EXPORT_VIEW_PROPERTY(onAliCompletion, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliError, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliLoadingBegin, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliLoadingProgress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliLoadingEnd, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliPrepared, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliRenderingStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliSeekComplete, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliCurrentPositionUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliBufferedPositionUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliAutoPlayStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliLoopingStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliBitrateReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAliBitrateChange, RCTBubblingEventBlock)

//暴露方法（js调用，原生回调）
RCT_EXPORT_METHOD(startPlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
        [aliPlayer startPlay];
    }];
}
RCT_EXPORT_METHOD(pausePlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
        [aliPlayer pausePlay];
    }];
}
RCT_EXPORT_METHOD(stopPlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
         RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
         [aliPlayer stopPlay];
     }];
}
RCT_EXPORT_METHOD(reloadPlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
         RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
         [aliPlayer reloadPlay];
     }];
}
RCT_EXPORT_METHOD(restartPlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
         RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
         [aliPlayer restartPlay];
     }];
}
RCT_EXPORT_METHOD(destroyPlay:(nonnull NSNumber *) reactTag){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
         RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
         [aliPlayer destroyPlay];
     }];
}
RCT_EXPORT_METHOD(seekTo:(nonnull NSNumber *) reactTag andPosition:(nonnull NSNumber *) positon){
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
         RNAliplayer * aliPlayer  = (RNAliplayer *) viewRegistry[reactTag];
         [aliPlayer seekTo: [positon intValue]];
     }];
}

//重写这个方法，返回将要提供给RN使用的视图
- (UIView *)view {
    RNAliplayer * aliPlayer = [[RNAliplayer alloc] init];
    return aliPlayer;
}


@end
