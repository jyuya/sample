//
//  Medal.m
//  BBCMedals
//
//  Created by Julia Yu on 3/26/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "Medal.h"
#import "Constants.h"

@implementation Medal

@synthesize myNumberLabel;

-(void)setParams:(NSString *)type number:(NSString *)aNumber myScale:(NSUInteger)aScale {
	myMedalType = [type retain];
	myNumberLabel.text = aNumber;
	myScale = aScale;
}

- (id)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
       // do stuff
		
    }
    return self;
}

- (void)drawRect:(CGRect)rect {
	CGContextRef ctx = UIGraphicsGetCurrentContext();
    CGContextClearRect(ctx, rect);
	
	if (myMedalType == MEDAL_GOLD) {
		//NSLog(@"is gold");
		EasyCGContextSetRGBFillColor(ctx, 255, 215, 15, 0.75);
	} 
	if (myMedalType == MEDAL_SILVER) {
		//NSLog(@"is silver");
		EasyCGContextSetRGBFillColor(ctx, 176, 173, 173, 0.75);
	}
	if (myMedalType == MEDAL_BRONZE) {
		//NSLog(@"is bronze");
		EasyCGContextSetRGBFillColor(ctx, 228, 113, 21, 0.75);
	}

    CGContextFillEllipseInRect(ctx, CGRectMake(0, 0, MEDAL_MIN, MEDAL_MIN));	
	
	float fromX = self.frame.origin.x;
	float fromY = self.frame.origin.y;
	float startWidth = self.frame.size.width;
	float startHeight = self.frame.size.height;
	float toX = fromX;
	float toY = fromY;
	
	if (myScale != (int)MEDAL_MIN) {
		// always getting bigger as scale form 1
		toX = self.frame.origin.x - startWidth/2;
		toY = self.frame.origin.y - startHeight/2;		
	}
	
	self.frame = CGRectMake(fromX, fromY, 0, 0);
	
	[UIView beginAnimations:nil context:nil];
	[UIView setAnimationDuration:1];
	[UIView setAnimationBeginsFromCurrentState:YES];
	self.frame = CGRectMake(toX, toY, myScale, myScale);
	[UIView commitAnimations];
	
}


- (void)dealloc {
    [super dealloc];
}


@end
