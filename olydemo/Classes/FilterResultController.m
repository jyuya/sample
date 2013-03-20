//
//  FilterResultController.m
//  BBCMedals
//
//  Created by Julia Yu on 3/23/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "FilterResultController.h"
#import "SportGSBController.h"
#import "MedalsController.h"
#import "Constants.h"

@implementation FilterResultController

- (id)initWithfilter:(NSDictionary *) aFilters {
    if (self = [super initWithNibName:@"FilterResultController" bundle:nil]) {
		myFilter = [aFilters retain];
    }
    return self;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	
	self.title = @"Medals";
	
	// display the medals
	MedalsController *myMedals = [[MedalsController alloc] initWithFilter:(NSDictionary *)myFilter];
	[myMedals.view setY:3]; // move it down a tad
	[self.view addSubview:myMedals.view];

	// display the GSB medals won for that sport after moving it down
	SportGSBController *mySportView = [[SportGSBController alloc] initWithSport:myFilter];
	[mySportView.view setY:[mySportView.view y] + 175];
	
	[self.view addSubview:mySportView.view];
	
    [super viewDidLoad];
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
	[myFilter release];
    [super dealloc];
}


@end
