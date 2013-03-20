//
//  SportGSBController.h
//  BBCMedals
//
//  Created by Julia Yu on 3/24/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface SportGSBController : UIViewController {
	
	NSDictionary *myFilters;
	NSArray *myData;

	UILabel *goldName;
	UILabel *silverName;
	UILabel *bronzeName;
	UILabel *goldCountryName;
	UILabel *silverCountryName;
	UILabel *bronzeCountryName;
	UILabel *myEventLabel;

	UIImageView *goldCountry;
	UIImageView *silverCountry;
	UIImageView *bronzeCountry;
}

@property (nonatomic,retain) IBOutlet UILabel *goldName;
@property (nonatomic,retain) IBOutlet UILabel *silverName;
@property (nonatomic,retain) IBOutlet UILabel *bronzeName;
@property (nonatomic,retain) IBOutlet UILabel *goldCountryName;
@property (nonatomic,retain) IBOutlet UILabel *silverCountryName;
@property (nonatomic,retain) IBOutlet UILabel *bronzeCountryName;
@property (nonatomic,retain) IBOutlet UILabel *myEventLabel;


@property (nonatomic,retain) IBOutlet UIImageView *goldCountry;
@property (nonatomic,retain) IBOutlet UIImageView *silverCountry;
@property (nonatomic,retain) IBOutlet UIImageView *bronzeCountry;

- (id)initWithSport:(NSDictionary *)aFilters;

@end
