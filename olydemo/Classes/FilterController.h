//
//  FilterController.h
//  BBCMedals
//
//  Created by Julia Yu on 3/22/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
@class BBCMedalsAppDelegate;

@interface FilterController : UIViewController {
	UITableView *myTable;
	NSMutableArray *myList;
	NSDictionary *myFilter;
	NSString *myTitle;
    UIViewController *topViewController;
    UIButton *arrowButton;
    BBCMedalsAppDelegate *delegate;
    CGRect topIdentityRect;
    CGRect identityRect;
}

@property (nonatomic, retain) IBOutlet UITableView *myTable;
@property (nonatomic, retain) NSMutableArray *myList;
@property (nonatomic, retain) NSDictionary *myFilter;
@property (nonatomic, retain) NSString *myTitle;
@property (nonatomic, retain) UIViewController *topViewController;
@property (nonatomic, retain) IBOutlet UIButton *arrowButton;
@property (nonatomic, retain) BBCMedalsAppDelegate *delegate;
@property CGRect identityRect;
@property CGRect topIdentityRect;

- (id)initWithTitle:(NSString *)aTitle filters:(NSDictionary *)aFilters;
- (void)makeTabIcon:(NSString *)aImageName;
- (void)createNextView:(NSDictionary *)aCurrentItem someFilter:(NSMutableDictionary *)aSomeFilter viewPair:(NSString *)aViewPair;
- (IBAction)animateSize;
	
@end
