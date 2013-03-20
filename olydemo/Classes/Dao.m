//
//  Dao.m
//  BBCMedals
//
//  Created by Julia Yu on 3/19/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "Dao.h"
#import "Constants.h"

// private constants
@interface Dao (Private) 
	static Dao *_sharedDao = nil;
	static NSString *databasePath;
	NSString *const DATABASE_NAME = @"bbcwo.db";
	sqlite3 *dbLink;
@end

@implementation Dao

// create the Dao as a singleton
//
+ (Dao *)sharedDao {
	@synchronized([Dao class]) {
		if (!_sharedDao) {
			[[self alloc] init];
		}
		return _sharedDao;
	}
	return nil;
}

// over ride the alloc to not create another instance of the singleton
//
+ (id)alloc {
	@synchronized([Dao class]) {
		NSAssert(_sharedDao == nil, @"attempted to allocate a second instance of a singleton.");
		_sharedDao = [super alloc];
		return _sharedDao;
	}
	return nil;
}

// initialize the database 
//
- (void)initDatabase {
	if (databasePath == nil) {
		[self getDatabasePath];
	}
	
	[self copyDatabase];
	dbLink = [self createDatabaseLink];
}

// prepare the query with the right type of handler
// this always returns an array of the datatypes specified
//
- (NSArray *)query:(const char *)myQuery resultType:(NSString *)myResultType {
	
	//NSLog(@" dao is called trying to show %s", myQuery);
	
	if (myResultType == AS_DICTIONARY) {
		return [self executeQuery:myQuery target:self action:@selector(getAsDictionary:)];
	}
	if (myResultType == AS_STRING) {
		return [self executeQuery:myQuery target:self action:@selector(getAsString:)];
	}
	if (myResultType == AS_ARRAY) {
		return [self executeQuery:myQuery target:self action:@selector(getAsArray:)];
	}
	return nil;	
}

// return a string
//
- (NSString *)getAsString:(sqlite3_stmt *)statement {
	NSString *aValue = [NSString stringWithUTF8String:(char *)sqlite3_column_text(statement, 0)];
	
	return aValue;
}

// return an array of arrays
// this is used for a query which returns n columns of data where the relation is not a dictionary
//
- (NSArray *)getAsArray:(sqlite3_stmt *)statement {
	unsigned int columnCount = sqlite3_data_count(statement);
	unsigned int n;
	NSMutableArray *results = [NSMutableArray array];

	for (n = 0; n < columnCount; ++n){
		NSString *aValue = [NSString stringWithUTF8String:(char *)sqlite3_column_text(statement, n)];
		[results addObject:aValue];
	}

	return results;
}

// return a dictionary
// for queries which needs data in key-value pairs
//
- (NSDictionary *)getAsDictionary:(sqlite3_stmt *)statement {
	NSMutableDictionary *results = [NSMutableDictionary dictionary];
	unsigned int columnCount = sqlite3_data_count(statement);
	unsigned int j;
	
	for (j = 0; j < columnCount; ++j){
		NSString *aValue = [NSString stringWithUTF8String:(char *)sqlite3_column_text(statement, j)];
		NSString *aName = [NSString stringWithUTF8String:(char *)sqlite3_column_name(statement, j)];
		
		[results setObject:aValue forKey:aName];
	}
	
	return results;
}

// execute query
//
-(NSArray *)executeQuery:(const char *)myQuery target:(id) myTarget action:(SEL) myAction {
	
	NSMutableArray *results = [NSMutableArray array];
	sqlite3_stmt *statement = nil;
	
	if (sqlite3_prepare_v2(dbLink, myQuery, -1, &statement, NULL)!=SQLITE_OK) {
		NSAssert1(0, @"Error preparing statement", sqlite3_errmsg(dbLink));
	} else {
		while(sqlite3_step(statement) == SQLITE_ROW) {			
			id row = [myTarget performSelector:myAction withObject:(id)statement];
			[results addObject:row];
		}
	}
	sqlite3_finalize(statement);	
	
	return results;
}

// set the database path
//
- (void)getDatabasePath {
	NSArray *documentPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentDir = [documentPaths objectAtIndex:0];
	databasePath = [documentDir stringByAppendingPathComponent:DATABASE_NAME];
}

// copy the existing database
//
- (void)copyDatabase {
	NSFileManager *fileManager = [NSFileManager defaultManager];
	BOOL exists = [fileManager fileExistsAtPath:databasePath];
	BOOL success;
	NSError *error;
	
	// writable db does not exist, copy default to path
	if( !exists) {
		NSString *databaseResourcePath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:DATABASE_NAME];
		success = [fileManager copyItemAtPath:databaseResourcePath toPath:databasePath error:&error];
		if (!success){
			NSAssert1(0, @"Failed to create writable database file with message '%@'.", [error localizedDescription]);
		}
	}	 
}

// create a connection to the database
//
- (sqlite3 *)createDatabaseLink {
	sqlite3 *newDBConnection;
	BOOL databaseOpen = sqlite3_open([databasePath UTF8String], &newDBConnection) == SQLITE_OK;
	if (!databaseOpen) {
		NSLog(@"Unable to create database connection");
	}
	
	return newDBConnection; 
}

- (void)dealloc {
	[super dealloc];
}

@end
