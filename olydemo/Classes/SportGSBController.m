//
//  SportGSBController.m
//  BBCMedals
//
//  Created by Julia Yu on 3/24/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "SportGSBController.h"
#import "Dao.h"
#import "Constants.h"

@implementation SportGSBController

@synthesize goldName, silverName, bronzeName, goldCountry, silverCountry, bronzeCountry, goldCountryName, silverCountryName, bronzeCountryName, myEventLabel;

- (id)initWithSport:(NSDictionary *)aFilters {
    if (self = [super initWithNibName:@"SportGSBController" bundle:nil]) {
		myFilters = [aFilters retain];

		NSString *query = [NSString stringWithFormat:@"SELECT athlete, country, type, name, two FROM medals, countries WHERE event=\"%@\" AND medals.country=countries.ioc ORDER BY display_order", [myFilters objectForKey:kEVENT_NAME]];
		const char *charQuery = [query UTF8String];
		
		myData = [[Dao sharedDao] query:charQuery resultType:AS_DICTIONARY];
		//NSLog(@"my data %@", myData);
    }
    return self;
}

/*
 // The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    if (self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil]) {
        // Custom initialization
    }
    return self;
}
*/


// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	
	myEventLabel.text = [NSString stringWithFormat:@"%@ - %@", [myFilters objectForKey:kSPORT_NAME], [myFilters objectForKey:kEVENT_NAME]];
	
	goldName.text = [[myData objectAtIndex:0] objectForKey:@"athlete"];
	silverName.text = [[myData objectAtIndex:1] objectForKey:@"athlete"];
	bronzeName.text = [[myData objectAtIndex:2] objectForKey:@"athlete"];
	
	goldCountryName.text = [[myData objectAtIndex:0] objectForKey:@"name"];
	silverCountryName.text = [[myData objectAtIndex:1] objectForKey:@"name"];
	bronzeCountryName.text = [[myData objectAtIndex:2] objectForKey:@"name"];
	
	NSString *goldPath = [NSString stringWithFormat:@"%@%@", PREFIX_COUNTRY, [[[myData objectAtIndex:0] objectForKey:@"two"] lowercaseString]];
	goldCountry.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:goldPath ofType:@"png"]];
	
	NSString *silverPath = [NSString stringWithFormat:@"%@%@", PREFIX_COUNTRY, [[[myData objectAtIndex:1] objectForKey:@"two"] lowercaseString]];
	silverCountry.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:silverPath ofType:@"png"]];

	NSString *bronzePath = [NSString stringWithFormat:@"%@%@", PREFIX_COUNTRY, [[[myData objectAtIndex:2] objectForKey:@"two"] lowercaseString]];
	bronzeCountry.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:bronzePath ofType:@"png"]];

    [super viewDidLoad];
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
	[myFilters release];
	
    [super dealloc];
}


@end
