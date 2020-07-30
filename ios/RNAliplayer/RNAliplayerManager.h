//
//  ALIViewPlayerManager.h
//  NewsApp
//
//  Created by 宋族运 on 2020/7/29.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import "RNAliplayer.h"
NS_ASSUME_NONNULL_BEGIN

@interface RNAliplayerManager : RCTViewManager

@property(nonatomic,strong)RNAliplayer * aliViewPlayer;

@end

NS_ASSUME_NONNULL_END
