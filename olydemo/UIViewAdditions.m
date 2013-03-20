//
//  UIViewAdditions.m
//  BBCMedals
//
//  Created by Julia Yu on 4/15/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "UIViewAdditions.h"


@implementation UIView (UIViewAdditions)

- (UIView *) rootView
{
    if (self.superview) return [self.superview rootView];
    else return self;
}

#pragma mark -
#pragma mark POSITIONING
#pragma mark -

- (CGFloat) x 
{
	return [self frame].origin.x;
}
- (void) setX:(CGFloat)x
{
	CGRect rect = [self frame];
	rect.origin.x = x;
	[self setFrame:rect];
}
- (CGFloat) y 
{
	return [self frame].origin.y;
}
- (void) setY:(CGFloat)y 
{
	CGRect rect = [self frame];
	rect.origin.y = y;
	[self setFrame:rect];
}
- (CGFloat) width 
{
	return [self frame].size.width;
}
- (void) setWidth:(CGFloat)width
{
	CGRect rect = [self frame];
	rect.size.width = width;
	[self setFrame:rect];
}
- (CGFloat) height
{
	return [self frame].size.height;
}
- (void) setHeight:(CGFloat)height
{
	CGRect rect = [self frame];
	rect.size.height = height;
	[self setFrame:rect];
}

@end
