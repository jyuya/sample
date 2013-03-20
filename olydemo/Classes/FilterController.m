//
//  FilterController.m
//  BBCMedals
//
//  Created by Julia Yu on 3/22/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "Dao.h"
#import "FilterController.h"
#import "UIColor+FDColors.h"
#import "FilterResultController.h"
#import "MedalsController.h"
#import "SportGSBController.h"
#import "MoreInfoController.h"
#import "ImageController.h"
#import "Constants.h"
#import "BBCMedalsAppDelegate.h"

@implementation FilterController

@synthesize myList, myTable, myFilter, myTitle, identityRect, topViewController, topIdentityRect, arrowButton, delegate;

// initialize this controller with the list of filters
//
- (id)initWithTitle:(NSString *)aTitle filters:(NSDictionary *)aFilters {
    if (self = [super initWithNibName:@"FilterController" bundle:nil]) {
		delegate = (BBCMedalsAppDelegate *)[[UIApplication sharedApplication] delegate];
		self.title = aTitle;							// set this table view's title
		myFilter = [aFilters retain];					// saved the passed in filters
		myTitle =[aTitle retain];
		
		NSArray *queryResult = [NSArray array];			// database query result array
        
		//NSLog(@" making table %@", aTitle);
		//NSLog(@"filter filter filter %@", myFilter);
		
		// get the list of sports
		if ([aTitle isEqualToString:PAGE_SPORT]) {
			[self makeTabIcon:TAB_ICON_SPORT];
			queryResult = [[Dao sharedDao] query:"SELECT name AS name, code AS initial FROM disciplines ORDER BY name" resultType:AS_DICTIONARY];
		}
		
		// create the country set manually - ZOMG hard coded limits of country
		if ([aTitle isEqualToString:PAGE_COUNTRY_LIST]) {
			[self makeTabIcon:TAB_ICON_COUNTRY];
			queryResult = [NSArray arrayWithObjects:
                           [NSDictionary dictionaryWithObjectsAndKeys: @"Albania - Czech Republic", kNAME, @"A - C", kINITIAL, @"0", kSTART, @"23", kLIMIT, nil], 
                           [NSDictionary dictionaryWithObjectsAndKeys: @"Denmark - Japan", kNAME, @"D - J", kINITIAL, @"23", kSTART, @"21", kLIMIT, nil],
                           [NSDictionary dictionaryWithObjectsAndKeys: @"Kazakhstan - Morocco", kNAME, @"K - M", kINITIAL, @"44", kSTART, @"15", kLIMIT, nil],
                           [NSDictionary dictionaryWithObjectsAndKeys: @"Nepal - Russian Federation", kNAME, @"N - R", kINITIAL, @"59", kSTART, @"10", kLIMIT, nil],
                           [NSDictionary dictionaryWithObjectsAndKeys: @"San Marino - Venezuela", kNAME, @"S - Z", kINITIAL, @"69", kSTART, @"17", kLIMIT, nil],
                           nil
                           ];
		}
		
		// get the countries in a country set
		if ([aTitle isEqualToString:PAGE_COUNTRY]) {
			self.title = [NSString stringWithFormat:@"%@ %@", myTitle, [myFilter objectForKey:kCOUNTRY_SET_INITIAL]];
            
			NSString *query = @"SELECT name AS name, two AS initial FROM countries ORDER BY name LIMIT ";
			if ([[myFilter objectForKey:kCOUNTRY_SET_START] isEqualToString: @"0"]){
				query = [NSString stringWithFormat:@"%@ %@", query, [myFilter objectForKey:kCOUNTRY_SET_LIMIT]];
			} else {
				query = [NSString stringWithFormat:@"%@ %@, %@", query, [myFilter objectForKey:kCOUNTRY_SET_START], [myFilter objectForKey:kCOUNTRY_SET_LIMIT]];
			}
			const char *charQuery = [query UTF8String];
			
			queryResult = [[Dao sharedDao] query:charQuery resultType:AS_DICTIONARY];
		}
		
		// get the events in a sport
		if ([aTitle isEqualToString:PAGE_EVENT]) {
			NSString *query = [NSString stringWithFormat:@"SELECT name AS %@, discipline AS %@ FROM medal_events WHERE discipline ='%@' ORDER BY name", kNAME, kINITIAL, [myFilter objectForKey:kSPORT_INITIAL]];
			const char *charQuery = [query UTF8String];
			
			queryResult = [[Dao sharedDao] query:charQuery resultType:AS_DICTIONARY];
		}
		
		myList = [queryResult retain];
    }
	
    return self;
}

// update the tab item with an icon image for certain pages
//
- (void)makeTabIcon:(NSString *)aImageName {
	UIImage * sportImage = [UIImage imageNamed:aImageName];
	UITabBarItem  * barItem = [[UITabBarItem alloc] initWithTitle:nil image: sportImage tag:0];
	self.tabBarItem = barItem;
	
	[barItem release];
}

// Customize the number of rows in the table view.
//
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.myList count];
}

// alternate row colors
//
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.row == 0 || indexPath.row%2 == 0) {
        //UIColor *altCellColor = [UIColor colorWithHex:0x222222];
        cell.backgroundColor = [UIColor colorWithHex:0x1a1a1a];
    } else {
		cell.backgroundColor = [UIColor colorWithHex:0x111111];
	}
}

// Customize the appearance of table view cells
//
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
	
    static NSString *CellIdentifier = @"Cell";
	NSString *imageSource = @"";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier] autorelease];
    }
	
	NSMutableDictionary *listItem = [self.myList objectAtIndex:indexPath.row];
	
	// Configure the cell.	
	cell.textLabel.font = [UIFont boldSystemFontOfSize:14];
	cell.textLabel.textColor = [UIColor whiteColor];
	cell.textLabel.backgroundColor = [UIColor blueColor];
	cell.selectionStyle = UITableViewCellSelectionStyleGray;
	cell.textLabel.highlightedTextColor = [UIColor blackColor];
	cell.textLabel.text = [listItem objectForKey:kNAME];
	
	if ([myTitle isEqualToString:PAGE_SPORT]) {
		imageSource = [NSString stringWithFormat:@"%@%@%@", PREFIX_SPORT, [[listItem objectForKey:kINITIAL] lowercaseString], @".png"];
	}
	if ([myTitle isEqualToString:PAGE_COUNTRY]) {
		imageSource = [NSString stringWithFormat:@"%@%@%@", PREFIX_COUNTRY, [[listItem objectForKey:kINITIAL]  lowercaseString], @".png"];
	}
	
	UIImage *theImage = [UIImage imageNamed:imageSource];
    cell.imageView.image = theImage;
	
    return cell;
}


// Override to support row selection in the table view.
//
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
	
	NSDictionary *currentItem = [myList objectAtIndex:indexPath.row];								// selected item info
	NSMutableDictionary *someFilter = [[NSMutableDictionary alloc] initWithDictionary:myFilter];	// create a temp myFilter for passing into next subview
	
	// on step 4/4 of filter
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"3"]) {		
		[someFilter setObject:@"4" forKey:kSTEP];
		[self createNextView:currentItem someFilter:someFilter viewPair:@"last"];
	}
	
	// on step 3/4 of filter
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"2"]) {
		[someFilter setObject:@"3" forKey:kSTEP];
		[self createNextView:currentItem someFilter:someFilter viewPair:@"first"];
        
	} 
	
	// on step 2/4 of filter
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"1"]) {
		[someFilter setObject:@"2" forKey:kSTEP];
		[self createNextView:currentItem someFilter:someFilter viewPair:@"second"];
	} 
    
	// on step 1/4 of filter
	if (![myFilter objectForKey:kSTEP]) {
		[someFilter setObject:@"1" forKey:kSTEP];
		[self createNextView:currentItem someFilter:someFilter viewPair:@"first"];
	}
	
	[someFilter release]; 
}

// Figure out which view to create depending on our steps
//
- (void)createNextView:(NSDictionary *)aCurrentItem someFilter:(NSMutableDictionary *)aSomeFilter viewPair:(NSString *)aViewPair {
    
	NSString *myKey = [aCurrentItem objectForKey:kINITIAL];												// whatever we queried as the initial
	NSString *myValue = [aCurrentItem objectForKey:kNAME];												// whatever we queried as the name
	NSMutableDictionary *currentFilter = [[NSMutableDictionary alloc] initWithDictionary:aSomeFilter];	// create a temp myFilter for passing into next subview
	NSString *nextTitle = @"";																			// title of the next subview
	
	if ([aViewPair isEqualToString:@"first"]) {
		if ([myTitle isEqualToString:PAGE_SPORT]) {
			nextTitle = PAGE_EVENT;
			[currentFilter setObject:myValue forKey:kSPORT_NAME];
			[currentFilter setObject:myKey forKey:kSPORT_INITIAL];
		}
		
		if ([myTitle isEqualToString:PAGE_COUNTRY_LIST]) {
			nextTitle = PAGE_COUNTRY;
			[currentFilter setObject:myValue forKey:kCOUNTRY_SET];
			[currentFilter setObject:myKey forKey:kCOUNTRY_SET_INITIAL];
			[currentFilter setObject:[aCurrentItem objectForKey:kLIMIT] forKey:kCOUNTRY_SET_LIMIT];
			[currentFilter setObject:[aCurrentItem objectForKey:kSTART] forKey:kCOUNTRY_SET_START];
		}		
	} 
	
	if ([aViewPair isEqualToString:@"second"] || [aViewPair isEqualToString:@"last"]) {
		if ([myTitle isEqualToString:PAGE_EVENT]) {
			nextTitle = PAGE_COUNTRY_LIST;
			[currentFilter setObject:myValue forKey:kEVENT_NAME];
		}
		
		if ([myTitle isEqualToString:PAGE_COUNTRY]) {
			nextTitle = PAGE_SPORT;
			[currentFilter setObject:myValue forKey:kCOUNTRY_NAME];
			[currentFilter setObject:myKey forKey:kCOUNTRY_INITIAL];
		}
	} 
	
	if ([aViewPair isEqualToString:@"last"]) {
		FilterResultController *finalResult = [[FilterResultController alloc] initWithfilter:currentFilter];
		[self.navigationController pushViewController:finalResult animated:YES];
		[finalResult release];
		
	} else {
		FilterController *myView = [[FilterController alloc] initWithTitle:nextTitle filters:currentFilter];
		[self.navigationController pushViewController:myView animated:YES];
		[myView release];
	}
	
	[currentFilter release]; 
}

// expand or contract the table depending on the 'expandSubView' flag in the app delegate
- (void)animateSize {
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.15];
    [UIView setAnimationDelegate:self];
    if (delegate.expandSubViews == YES) {
        [myTable setFrame:identityRect];
        if (topViewController != nil) {
            [topViewController.view setClipsToBounds:YES];
            [topViewController.view setFrame:topIdentityRect];
        }
        delegate.expandSubViews = NO;
    } else {
        [myTable setFrame:CGRectMake(0, 27, 320, 340)];
        if (topViewController != nil) {
            [topViewController.view setClipsToBounds:YES];
            [topViewController.view setFrame:CGRectMake(topIdentityRect.origin.x, topIdentityRect.origin.y, topIdentityRect.size.width, 0)];
        }
        
        delegate.expandSubViews = YES;
    }    
    [UIView commitAnimations];
    CGAffineTransform transform = arrowButton.transform;
    if (delegate.expandSubViews) {
        transform = CGAffineTransformRotate(transform, 3.14);
    } else {
        transform = CGAffineTransformRotate(transform, -3.14);
    }
    
    
    arrowButton.transform = transform;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	identityRect = myTable.frame;
    
	int flag;
	
	// we have a sport
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"1"] && [myFilter objectForKey:kSPORT_INITIAL]) {
		flag = 4;
	}
	// we have a country set
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"1"] && [myFilter objectForKey:kCOUNTRY_SET]) {
		flag = 3;
	}
	// we have a country set and country initial
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"2"] && [myFilter objectForKey:kCOUNTRY_SET] && [myFilter objectForKey:kCOUNTRY_INITIAL]) {
		flag = 1;
	}
	// we have a sport and a event
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"2"] && [myFilter objectForKey:kSPORT_INITIAL] && [myFilter objectForKey:kEVENT_NAME]) {
		flag = 2;
	}
	// we have a country set and country initial, and a sport
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"3"] && [myFilter objectForKey:kCOUNTRY_SET] && [myFilter objectForKey:kCOUNTRY_INITIAL] && [myFilter objectForKey:kSPORT_INITIAL]) {
		flag = 1;
	}
	// we have a sport and a event, and a country set
	if ([[myFilter objectForKey:kSTEP] isEqualToString:@"3"] && [myFilter objectForKey:kSPORT_INITIAL] && [myFilter objectForKey:kEVENT_NAME] && [myFilter objectForKey:kCOUNTRY_SET]) {
		flag = 3;
	}
	
	//NSLog(@"filter is %@", myFilter);
	
	switch (flag) {
		case 0: {
			NSLog(@"first time do nothing");
            topViewController = nil;
			break;
        }
		case 1: {
			MedalsController *myMedals = [[MedalsController alloc] initWithFilter:(NSDictionary *)myFilter];
            topViewController = myMedals;
            topIdentityRect = myMedals.view.frame;
            topIdentityRect.size.height += 25;
			[self.view addSubview:myMedals.view];
			break;
		}
		case 2: {
			SportGSBController *mySportView = [[SportGSBController alloc] initWithSport:myFilter];
            topViewController = mySportView;
            topIdentityRect = mySportView.view.frame;
            topIdentityRect.size.height += 25;
			[self.view addSubview:mySportView.view];	
			break;
		}
		case 3: {
			ImageController *myWorldImage = [[ImageController alloc] initWithImageName:@"bg_map.jpg"];
			[myWorldImage.view setY:28];
			[myWorldImage.view setHeight:165];
            topIdentityRect = myWorldImage.view.frame;
            topViewController = myWorldImage;
			[self.view addSubview:myWorldImage.view];
			break;
		}
		case 4: {
			MoreInfoController *myMoreInfo = [[MoreInfoController alloc] init];
			CGRect r = myMoreInfo.view.frame;
            topViewController = myMoreInfo;
			r.size.height = 165;
			myMoreInfo.view.frame = r;
			[myMoreInfo.view setHeight:165];
            topIdentityRect = r;
            topIdentityRect.size.height += 25;
			[self.view addSubview:myMoreInfo.view];
			break;
		}
		default: {
			break;
		} 
	}
    
	
    [super viewDidLoad];
}

// make sure that the view conforms to the current state of 'expandSubView' when it is loaded
- (void)viewWillAppear:(BOOL)animated {
    
    if(delegate.expandSubViews){
        [myTable setFrame:CGRectMake(0, 27, 320, 340)];
        if (topViewController != nil) {
            [topViewController.view setClipsToBounds:YES];
            topIdentityRect = topViewController.view.frame;
            [topViewController.view setFrame:CGRectMake(topIdentityRect.origin.x, topIdentityRect.origin.y, topIdentityRect.size.width, 0)];
        }
    } else {
        [myTable setFrame:identityRect];
        if (topViewController != nil) {
            [topViewController.view setClipsToBounds:YES];
            [topViewController.view setFrame:topIdentityRect];
        }
    }
    
    [super viewWillAppear:animated];
}

/*
 // Override to allow orientations other than the default portrait orientation.
 - (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
 // Return YES for supported orientations
 return (interfaceOrientation == UIInterfaceOrientationPortrait);
 }
 */

- (void)didReceiveMemoryWarning {
	// Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
	
	// Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
	// Release any retained subviews of the main view.
	// e.g. self.myOutlet = nil;
	self.myList = nil;
	self.myFilter = nil;
}


- (void)dealloc {
	[myTitle release];
	[myFilter release];
	[myTable release];
	[myList release];
    [topViewController release];
    [arrowButton release];
    
    [super dealloc];
}


@end
