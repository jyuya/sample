//
//  TimelineView.m
//  BBCMedals
//
//  Created by Seth Lemoine on 4/14/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "TimelineView.h"
#import "UIColor+FDColors.h"

@implementation TimelineView

struct day {
	int dayNumber;
	BOOL isWeekend;
};



- (id)initWithFrame:(CGRect)frame {
    if ((self = [super initWithFrame:frame])) {
        // Initialization code
		
    }
    return self;
}

// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.

- (void)drawRect:(CGRect)rect {
    // Drawing code

	
	UILabel *myLabel = [[UILabel alloc] initWithFrame:CGRectMake(15,15,350,100)];
	myLabel.text = @"13 Feb";
	myLabel.textAlignment = UITextAlignmentLeft;
	myLabel.font = [UIFont boldSystemFontOfSize:(40.0)];
	myLabel.backgroundColor = [UIColor clearColor];
	myLabel.textColor = [UIColor whiteColor];
	[self addSubview:myLabel];
	[myLabel release];	
	
	struct date {
		int day;
		BOOL isWeekend;
	} dates[17];

	UIColor *weekdayColor = [[UIColor alloc] initWithHex:0xE1E1D8];
	UIColor *weekendColor = [[UIColor alloc] initWithHex:0xCCCCCC];
	UIColor *sportColor = [[UIColor alloc] initWithHex:0x2C2B2B];	

	dates[0].day = 12;
	dates[0].isWeekend = NO;

	dates[1].day = 13;
	dates[1].isWeekend = YES;

	dates[2].day = 14;
	dates[2].isWeekend = YES;

	dates[3].day = 15;
	dates[3].isWeekend = NO;

	dates[4].day = 16;
	dates[4].isWeekend = NO;

	dates[5].day = 17;
	dates[5].isWeekend = NO;

	dates[6].day = 18;
	dates[6].isWeekend = NO;

	dates[7].day = 19;
	dates[7].isWeekend = NO;

	dates[8].day = 20;
	dates[8].isWeekend = YES;

	dates[9].day = 21;
	dates[9].isWeekend = YES;
	
	dates[10].day = 22;
	dates[10].isWeekend = NO;
	
	dates[11].day = 23;
	dates[11].isWeekend = NO;
	
	dates[12].day = 24;
	dates[12].isWeekend = NO;
	
	dates[13].day = 25;
	dates[13].isWeekend = NO;
	
	dates[14].day = 26;
	dates[14].isWeekend = NO;
	
	dates[15].day = 27;
	dates[15].isWeekend = YES;
	
	dates[16].day = 28;
	dates[16].isWeekend = YES;
	
	int columnStart_x = 8;
	int columnStart_y = 96;
	
	int columnWidth = 16;
	int columnHeight = 271;
	
	int gutterWidth = 2;
	
	UIImage *img = [UIImage imageNamed: @"bg_data.jpg"];
	[img drawInRect:CGRectMake(0, 0, img.size.width, img.size.height)];
	
	UIRectFill(CGRectMake(0, img.size.height, self.frame.size.width, self.frame.size.height-img.size.height));
	
	[sportColor set];
	UIRectFill(CGRectMake(0, columnStart_y, self.frame.size.width, columnHeight));
	
	// Draw background for table of timeline
	[weekdayColor set];
	UIRectFill(CGRectMake(columnStart_x - 1, columnStart_y, 306, columnHeight));
	
	// Draw background for header row with day numbers
	[[UIColor whiteColor] set];
	UIRectFill(CGRectMake(columnStart_x -1 , columnStart_y, 306, 15));
	
	// Add Labels for columns
	for (int n=0; n<17; n++) {
		if (dates[n].isWeekend) {
			[weekendColor set];
		} else {
			[weekdayColor set];
		}
		UIRectFill(CGRectMake(columnStart_x + ((columnWidth+gutterWidth)*n), columnStart_y, columnWidth, columnHeight));
		
		UILabel *myLabel = [[UILabel alloc] initWithFrame:CGRectMake(columnStart_x + ((columnWidth+gutterWidth)*n), columnStart_y, columnWidth, 15)];
		myLabel.text = [NSString stringWithFormat:@"%i", dates[n].day];
		myLabel.textAlignment = UITextAlignmentCenter;
		myLabel.font = [UIFont boldSystemFontOfSize:(10.0)];
		[self addSubview:myLabel];
		[myLabel release];		
	}

	int sportsStart_x = 8;
	int sportsStart_y = 113;
//	int sportsRowHeight = 15;
	
	struct sport {
		int startDay;
		int duration;
		NSString *name;
	} sports[15];
	
	sports[0].startDay = 23;
	sports[0].duration = 4;
	sports[0].name = @" Alpine Skiing";

	sports[1].startDay = 19;
	sports[1].duration = 6;
	sports[1].name = @" Biathlon";

	sports[2].startDay = 14;
	sports[2].duration = 4;
	sports[2].name = @" Bobsleigh";

	sports[3].startDay = 15;
	sports[3].duration = 7;
	sports[3].name = @" Cross-country skiing";
	
	sports[4].startDay = 26;
	sports[4].duration = 3;
	sports[4].name = @" Curling";

	sports[5].startDay = 22;
	sports[5].duration = 4;
	sports[5].name = @" Figure Skating";	
	
	sports[6].startDay = 17;
	sports[6].duration = 6;
	sports[6].name = @" Freestyle Skiing";

	sports[7].startDay = 14;
	sports[7].duration = 13;
	sports[7].name = @" Ice hockey";	
	
	sports[8].startDay = 25;
	sports[8].duration = 3;
	sports[8].name = @" Luge";
	
	sports[9].startDay = 12;
	sports[9].duration = 6;
	sports[9].name = @" Nordic combined";	

	sports[10].startDay = 19;
	sports[10].duration = 6;
	sports[10].name = @" Short track";
	
	sports[11].startDay = 12;
	sports[11].duration = 3;
	sports[11].name = @" Skeleton";	

	sports[12].startDay = 22;
	sports[12].duration = 7;
	sports[12].name = @" Ski jumping";
	
	sports[13].startDay = 15;
	sports[13].duration = 4;
	sports[13].name = @" Snowboarding";

	sports[14].startDay = 12;
	sports[14].duration = 6;
	sports[14].name = @" Speed skating";
		
	for (int n=0; n<15; n++) {

//		UIRectFill(CGRectMake(columnStart_x + ((columnWidth+gutterWidth)*n), columnStart_y, columnWidth, columnStart_y + columnHeight));
		
		UILabel *myLabel = [[UILabel alloc] initWithFrame:CGRectMake(sportsStart_x + (18 * (sports[n].startDay-12)), sportsStart_y + (n * 17), 18 * sports[n].duration - 2, 15)];
		myLabel.text = sports[n].name;
		myLabel.textAlignment = UITextAlignmentLeft;
		myLabel.font = [UIFont systemFontOfSize:(10.0)];
		myLabel.backgroundColor = sportColor;
		myLabel.textColor = [UIColor whiteColor];
		[self addSubview:myLabel];
		[myLabel release];	
	}
	
	
	

}

- (void)drawCalendarColumn:(float)x: (float) y: (float)width: (float)height {
	
	
	CGContextRef context = UIGraphicsGetCurrentContext();
	[[UIColor lightGrayColor] set];
	
	CGContextBeginPath(context);
	CGContextMoveToPoint(context, x, y);
	CGContextAddLineToPoint(context, x, y+height);
	CGContextAddLineToPoint(context, x+width, y+height);
	CGContextAddLineToPoint(context, x+width, y);
	CGContextClosePath(context);
	
	CGContextDrawPath(context, kCGPathFill);
}

- (void)dealloc {
    [super dealloc];
}


@end
