//
//  Constants.h
//  BBCMedals Global Constants
//
//  Created by Julia Yu on 3/23/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#define PAGE_SPORT				@"Sports"
#define PAGE_COUNTRY_LIST		@"Country Set"
#define PAGE_COUNTRY			@"Countries"
#define PAGE_EVENT				@"Events"

#define PAGE_MEDAL				@"Medals"
#define PAGE_TIME				@"Timeline"

#define AS_DICTIONARY			@"dictionary"
#define AS_ARRAY				@"array"
#define	AS_STRING				@"string"

#define TAB_ICON_SPORT			@"sport_icon.png"
#define TAB_ICON_COUNTRY		@"country_icon.png"

#define PREFIX_COUNTRY			@"flag_"
#define PREFIX_SPORT			@"sport_"

#define kCOUNTRY_SET			@"country_set"
#define kCOUNTRY_SET_START		@"country_set_start"
#define kCOUNTRY_SET_LIMIT		@"country_set_limit"
#define kCOUNTRY_SET_INITIAL	@"country_set_initial"

#define kCOUNTRY_NAME			@"country_name"
#define kCOUNTRY_INITIAL		@"country_initial"
#define kEVENT_NAME				@"event_name"
#define kSPORT_NAME				@"sport_name"
#define kSPORT_INITIAL			@"sport_initial"

#define kSTEP					@"step"
#define kINITIAL				@"initial"
#define kSTART					@"start"
#define kLIMIT					@"limit"
#define kNAME					@"name"
#define kTITLE					@"title"

#define MEDAL_GOLD				@"gold"
#define MEDAL_SILVER			@"silver"
#define MEDAL_BRONZE			@"bronze"

#define MEDAL_MIN				40.0f
#define MEDAL_MAX				70.0f
#define MEDAL_RANGE				40.0f

#define kNumberOfPages			3

#define EasyCGContextSetRGBFillColor(ctx, red, green, blue, alpha) \
CGContextSetRGBFillColor(ctx, (float)red/255.0, (float)green/255.0, (float)blue/255.0, alpha)

