//
//  UIColor+FDColors.m
//  FreshDirect
//
//  Created by Jim Connell on 10/6/09.
//  Copyright 2009 Schematic, Inc. All rights reserved.
//

#import "UIColor+FDColors.h"

@implementation UIColor (UIColor_FDColors)

- (id)initWithHex:(long)hexColor
{
    float red = ((float)((hexColor & 0xFF0000) >> 16))/255.0;
    float green = ((float)((hexColor & 0xFF00) >> 8))/255.0;
    float blue = ((float)(hexColor & 0xFF))/255.0;
    return [self initWithRed:red green:green blue:blue alpha:1.0]; 
}

+ (UIColor *)colorWithHex:(long)hexColor
{
    float red = ((float)((hexColor & 0xFF0000) >> 16))/255.0;
    float green = ((float)((hexColor & 0xFF00) >> 8))/255.0;
    float blue = ((float)(hexColor & 0xFF))/255.0;
    return [UIColor colorWithRed:red green:green blue:blue alpha:1.0];  
}

+ (UIColor *)colorWithHex:(long)hexColor alpha:(float)opacity
{
    float red = ((float)((hexColor & 0xFF0000) >> 16))/255.0;
    float green = ((float)((hexColor & 0xFF00) >> 8))/255.0;
    float blue = ((float)(hexColor & 0xFF))/255.0;
    return [UIColor colorWithRed:red green:green blue:blue alpha:opacity];  
}


/*
 UIColor * const FDColorOrange = [UIColor colorWithHex:0xff9933];
 UIColor * const FDColorBrown = [UIColor colorWithHex:0x999966];
 UIColor * const FDColorPurple = [UIColor colorWithHex:0x996699];
 UIColor * const FDColorBlue = [UIColor colorWithHex:0x6699cc];
 */

+ (UIColor *)colorWithFDGreen
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0x669933] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDOrange
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xff9933] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDBlockText
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0x2a2a2a] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDRed
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xc12121] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDOtherBG
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xe9ebed] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDStroke
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xd6d6d6] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDPageBG
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xf3eee6] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDPressedOverlay
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xfdf7e0] retain ];
    }
    return color;
}

+ (UIColor *)colorWithFDPressedOrange
{
    static UIColor *color = nil;
    if (!color) {
        color = [ [UIColor colorWithHex:0xe16307] retain ];
    }
    return color;
}

@end
