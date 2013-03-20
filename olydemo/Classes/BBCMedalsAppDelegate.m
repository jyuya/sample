//
//  BBCMedalsAppDelegate.m
//  BBCMedals
//
//  Created by Julia Yu on 3/19/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import "BBCMedalsAppDelegate.h"
#import "Dao.h"
#import "FilterController.h"
#import "TimelineController.h"
#import "Constants.h"

@implementation BBCMedalsAppDelegate

@synthesize window, tabController, expandSubViews;

- (void)applicationDidFinishLaunching:(UIApplication *)application {    
    expandSubViews = NO;
	[[Dao sharedDao] initDatabase];

	// create navigation controllers for each tab
	UINavigationController *sportNavController = [[UINavigationController alloc] init];
	UINavigationController *countryNavController = [[UINavigationController alloc] init];
	UINavigationController *timelineNavController = [[UINavigationController alloc] init];

	sportNavController.navigationBar.tintColor = [UIColor blackColor];
	countryNavController.navigationBar.tintColor = [UIColor blackColor];
	timelineNavController.navigationBar.tintColor = [UIColor blackColor];

	FilterController *sportViewController = [[FilterController alloc] initWithTitle:PAGE_SPORT filters:[NSDictionary dictionary]];
	FilterController *countryViewController = [[FilterController alloc] initWithTitle:PAGE_COUNTRY_LIST filters:[NSDictionary dictionary]];
	TimelineController *timelineViewController = [[TimelineController alloc] initWithNibName:nil bundle:nil];
	
	// add these to the nav view controllers
	[sportNavController pushViewController:sportViewController animated:YES];
	[countryNavController pushViewController:countryViewController animated:YES];
	[timelineNavController pushViewController:timelineViewController animated:YES];
	
	// set up the tab view controller
	NSArray *tabViewControllers = [NSArray arrayWithObjects: sportNavController, countryNavController, timelineNavController, nil];
	tabController.viewControllers = tabViewControllers;
	tabController.selectedIndex = 0;
	
	[window addSubview:tabController.view];
    [window makeKeyAndVisible];
	
	// CLEANUP
	[sportNavController release];
	[countryNavController release];
	[tabViewControllers release];
    
}


- (void)dealloc {
	[tabController release];
    [window release];
    [super dealloc];
}


@end
