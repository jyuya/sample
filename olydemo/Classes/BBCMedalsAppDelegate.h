//
//  BBCMedalsAppDelegate.h
//  BBCMedals
//
//  Created by Julia Yu on 3/19/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface BBCMedalsAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
	UITabBarController *tabController;
    Boolean expandSubViews;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet UITabBarController *tabController;
@property Boolean expandSubViews;

@end

