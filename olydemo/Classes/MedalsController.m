//
//  MedalsController.m
//  BBCMedals
//
//  Created by Julia Yu on 3/26/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "MedalsController.h"
#import "Medal.h"
#import "Dao.h"
#import "Constants.h"

@implementation MedalsController

@synthesize myTotal, myBackground, myGoldMedal, mySilverMedal, myBronzeMedal, sportsLabel, sportsIcon, countryLabel, countryIcon;


 - (id)initWithFilter:(NSDictionary *)aFilter {
	 if (self = [super initWithNibName:@"MedalsController" bundle:nil]) {
		 myFilter = [aFilter retain];
		 gold = 0.0f;
		 silver = 0.0f;
		 bronze = 0.0f;
		 medalCount = 0.0f;
		 NSString *query = @"";

		// country only
		if ([myFilter objectForKey:kCOUNTRY_INITIAL] && ![myFilter objectForKey:kSPORT_INITIAL]) {
			 query = @"SELECT COUNT(*), type FROM medals, countries WHERE medals.country=countries.ioc ";
			 query = [NSString stringWithFormat:@"%@ AND countries.two=\"%@\" ", query, [myFilter objectForKey:kCOUNTRY_INITIAL]];
		 }
		 
		 // sports only
		 if (![myFilter objectForKey:kCOUNTRY_INITIAL] && [myFilter objectForKey:kSPORT_INITIAL]) {
			 query = @"SELECT COUNT(*), type FROM medals WHERE ";
			 query = [NSString stringWithFormat:@"%@ discipline=\"%@\" ", query, [myFilter objectForKey:kSPORT_INITIAL]];
		 }
		 
		 // sports and country
		 if ([myFilter objectForKey:kCOUNTRY_INITIAL] && [myFilter objectForKey:kSPORT_INITIAL]) {
			query = @"SELECT COUNT(*), type FROM medals, countries WHERE medals.country=countries.ioc ";
			query = [NSString stringWithFormat:@"%@ AND countries.two=\"%@\" ", query, [myFilter objectForKey:kCOUNTRY_INITIAL]];
			query = [NSString stringWithFormat:@"%@ AND discipline=\"%@\" ", query, [myFilter objectForKey:kSPORT_INITIAL]];
		 }
		 
		 // sports, country, and event
		 if ([myFilter objectForKey:kEVENT_NAME]) {
			 query = [NSString stringWithFormat:@"%@ AND event=\"%@\" ", query, [myFilter objectForKey:kEVENT_NAME]];
		 } 
		 
		 query = [NSString stringWithFormat:@"%@ GROUP BY type ", query];
		 //NSLog(@"my query %@", query);
		 const char *charQuery = [query UTF8String];
		 NSArray *myData = [[Dao sharedDao] query:charQuery resultType:AS_ARRAY];
		 
		 unsigned int dataCount = [myData count];
		 unsigned int i;
		 for (i = 0; i < dataCount; ++i){
			 if ([[[myData objectAtIndex:i] objectAtIndex:1] isEqualToString:@"G"]) {
				 gold = [[[myData objectAtIndex:i] objectAtIndex:0] floatValue];
			 }
			 if ([[[myData objectAtIndex:i] objectAtIndex:1] isEqualToString:@"S"]) {
				 silver = [[[myData objectAtIndex:i] objectAtIndex:0] floatValue];
			 }
			 if ([[[myData objectAtIndex:i] objectAtIndex:1] isEqualToString:@"B"]) {
				 bronze = [[[myData objectAtIndex:i] objectAtIndex:0] floatValue];
			 }
			 medalCount = medalCount +[[[myData objectAtIndex:i] objectAtIndex:0] floatValue];
		 }

	 }
	 return self;
}
                                                                                                                                                                                                                                                                                                                      
// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	myTotal.text = [NSString stringWithFormat:@"%u", (int)medalCount];
	
	// sport but no country or event
	if ([myFilter objectForKey:kSPORT_INITIAL] && ![myFilter objectForKey:kCOUNTRY_INITIAL]) {
		NSString *sportPath = [NSString stringWithFormat:@"%@%@", PREFIX_SPORT, [[myFilter objectForKey:kSPORT_INITIAL] lowercaseString]];
		sportsLabel.text = [myFilter objectForKey:kSPORT_NAME];
		sportsIcon.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:sportPath ofType:@"png"]];
		[self setBackground:@"bg_data"];
	}
	
	// country and sport, not sure about event
	if ([myFilter objectForKey:kCOUNTRY_INITIAL] && [myFilter objectForKey:kSPORT_INITIAL]){
		NSString *countryPath = [NSString stringWithFormat:@"%@%@", PREFIX_COUNTRY, [[myFilter objectForKey:kCOUNTRY_INITIAL] lowercaseString]];
		countryLabel.text = [myFilter objectForKey:kCOUNTRY_NAME];
		countryIcon.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:countryPath ofType:@"png"]];
		sportsLabel.text = [NSString stringWithFormat:@"%@", [myFilter objectForKey:kSPORT_NAME]];
		[self setBackground:@"bg_data"];
	}

	// country but no sport or event
	if ([myFilter objectForKey:kCOUNTRY_INITIAL] && ![myFilter objectForKey:kSPORT_INITIAL]) {
		NSString *countryPath = [NSString stringWithFormat:@"%@%@", PREFIX_COUNTRY, [[myFilter objectForKey:kCOUNTRY_INITIAL] lowercaseString]];
		countryLabel.text = [myFilter objectForKey:kCOUNTRY_NAME];
		countryIcon.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:countryPath ofType:@"png"]];
		sportsLabel.text = [NSString stringWithFormat:@"All Medals for %@", [myFilter objectForKey:kCOUNTRY_NAME]];
		[self setBackground:@"bg_world"]; 
	}
	
	// have a event so must have a sport, not sure about country
	if ([myFilter objectForKey:kEVENT_NAME]) {
		sportsLabel.text = [NSString stringWithFormat:@"%@ - %@", [myFilter objectForKey:kSPORT_NAME], [myFilter objectForKey:kEVENT_NAME]];
		[self setBackground:@"bg_olympics"];
	}

	[self scaleMedals];
    [super viewDidLoad];
}

// set the background image
//
- (void)setBackground:(NSString *)imageName {
	NSString *imageSource = [NSString stringWithFormat:@"%@%@", imageName, @".png"];
	UIImage *theImage = [UIImage imageNamed:imageSource];
	[self.myBackground setImage:theImage];	
//	NSLog(@"setting bg %@", imageName);
}

//	figure out our scale animation
//
- (void)scaleMedals {
	float goldScale = MEDAL_MIN;
	float silverScale = MEDAL_MIN;
	float bronzeScale = MEDAL_MIN;
	
	// we actually have some medals
	if (medalCount != 0.0f) {
		if (gold != 0.0f) {
			goldScale =  MEDAL_MIN + ((gold/medalCount) * MEDAL_RANGE);
		}
		if (silver != 0.0f) {
			silverScale =  MEDAL_MIN + ((silver/medalCount) * MEDAL_RANGE);
		}
		if (bronze != 0.0f) {
			bronzeScale =  MEDAL_MIN + ((bronze/medalCount) * MEDAL_RANGE);
		}
	}
	
	[myGoldMedal setParams:MEDAL_GOLD number:[NSString stringWithFormat:@"%u", (int)gold] myScale:(int)goldScale];
	[mySilverMedal setParams:MEDAL_SILVER number:[NSString stringWithFormat:@"%u", (int)silver]  myScale:(int)silverScale];
	[myBronzeMedal setParams:MEDAL_BRONZE number:[NSString stringWithFormat:@"%u", (int)bronze]  myScale:(int)bronzeScale];
}



// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    // Return YES for supported orientations
    //return (interfaceOrientation == UIInterfaceOrientationPortrait);
	return YES;
}

- (void)didReceiveMemoryWarning {
	// Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
	
	// Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
	// Release any retained subviews of the main view.
	// e.g. self.myOutlet = nil;
}


- (void)dealloc {
    [super dealloc];
}


@end
