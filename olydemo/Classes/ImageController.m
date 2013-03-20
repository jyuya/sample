//
//  ImageController.m
//  BBCMedals
//
//  Created by Julia Yu on 4/15/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "ImageController.h"


@implementation ImageController

@synthesize bgImage, myImageName;

- (id)initWithImageName:(NSString *)imageName {
	if (self = [super initWithNibName:@"ImageController" bundle:nil]) {
        self.myImageName = imageName;
    }
    return self;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	UIImage *theImage = [UIImage imageNamed:self.myImageName];
	[self.bgImage setImage:theImage];	
	
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
	[myImageName release];
	[bgImage release];
    [super dealloc];
}


@end
