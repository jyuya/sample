//
//  MedalsController.h
//  BBCMedals
//
//  Created by Julia Yu on 3/26/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@class Medal;

@interface MedalsController : UIViewController {
	UILabel *myTotal;
	UILabel	*sportsLabel;
	UILabel *countryLabel;
	
	UIImageView *sportsIcon;
	UIImageView *countryIcon;
	UIImageView *myBackground;
	
	Medal *myGoldMedal;
	Medal *mySilverMedal;
	Medal *myBronzeMedal;
	
	NSDictionary *myFilter;
	
	float gold;
	float silver;
	float bronze;
	float medalCount;
}

@property (nonatomic,retain) IBOutlet UILabel *sportsLabel;
@property (nonatomic,retain) IBOutlet UILabel *countryLabel;
@property (nonatomic,retain) IBOutlet UILabel *myTotal;

@property (nonatomic,retain) IBOutlet UIImageView *myBackground;
@property (nonatomic,retain) IBOutlet UIImageView *sportsIcon;
@property (nonatomic,retain) IBOutlet UIImageView *countryIcon;

@property (nonatomic,retain) IBOutlet Medal *myGoldMedal;
@property (nonatomic,retain) IBOutlet Medal *mySilverMedal;
@property (nonatomic,retain) IBOutlet Medal *myBronzeMedal;

- (id)initWithFilter:(NSDictionary *)aFilter;
- (void)scaleMedals;
- (void)setBackground:(NSString *)imageName;

@end
