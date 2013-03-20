//
//  ImageController.h
//  BBCMedals
//
//  Created by Julia Yu on 4/15/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface ImageController : UIViewController {
	UIImageView *bgImage;
	NSString *myImageName;
}

@property (nonatomic,retain) IBOutlet UIImageView *bgImage;
@property (nonatomic,retain) NSString *myImageName;

- (id)initWithImageName:(NSString *)imageName;

@end
