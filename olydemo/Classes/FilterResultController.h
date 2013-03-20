//
//  FilterResultController.h
//  BBCMedals
//
//  Created by Julia Yu on 3/23/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface FilterResultController : UIViewController {
	NSDictionary *myFilter;
}

- (id)initWithfilter:(NSDictionary *) aFilters;

@end
