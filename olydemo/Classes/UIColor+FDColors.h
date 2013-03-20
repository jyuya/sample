//
//  UIColor+FDColors.h
//  FreshDirect
//
//  Created by Jim Connell on 10/6/09.
//  Copyright 2009 Schematic, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UIColor (UIColor_FDColors)

- (id)initWithHex:(long)hexColor;

+ (UIColor *)colorWithHex:(long)hexColor;
+ (UIColor *)colorWithHex:(long)hexColor alpha:(float)opacity;
+ (UIColor *)colorWithFDGreen;
+ (UIColor *)colorWithFDOrange;
+ (UIColor *)colorWithFDRed;
+ (UIColor *)colorWithFDOtherBG;
+ (UIColor *)colorWithFDStroke;
+ (UIColor *)colorWithFDPageBG;
+ (UIColor *)colorWithFDPressedOverlay;
+ (UIColor *)colorWithFDPressedOrange;
+ (UIColor *)colorWithFDBlockText;

@end
