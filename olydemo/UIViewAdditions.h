//
//  UIViewAdditions.h
//  BBCMedals
//
//  Created by Julia Yu on 4/15/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UIView (UIViewAdditions)

- (UIView *) rootView;

- (CGFloat) x;
- (void) setX:(CGFloat)x;
- (CGFloat) y;
- (void) setY:(CGFloat)y;
- (CGFloat) width;
- (void) setWidth:(CGFloat)width;
- (CGFloat) height;
- (void) setHeight:(CGFloat)height;

@end
