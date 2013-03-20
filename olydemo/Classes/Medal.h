//
//  Medal.h
//  BBCMedals
//
//  Created by Julia Yu on 3/26/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface Medal : UIView {
	NSString *myMedalType;
	NSUInteger myScale;
	UILabel *myNumberLabel;
}

-(void)setParams:(NSString *)type number:(NSString *)aNumber myScale:(NSUInteger)aScale;

@property (nonatomic,retain) IBOutlet UILabel *myNumberLabel;

@end
