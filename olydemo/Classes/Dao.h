//
//  Dao.h
//  BBCMedals
//
//  Created by Julia Yu on 3/19/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <sqlite3.h>

@interface Dao : NSObject {
	
}

+ (Dao *)sharedDao;
- (void)initDatabase;
- (void)getDatabasePath;
- (void)copyDatabase;
- (sqlite3 *)createDatabaseLink;

- (NSArray *)query:(const char *)myQuery resultType:(NSString *)myResultType;
- (NSArray *)executeQuery:(const char *)myQuery target:(id) myTarget action:(SEL) myAction;
- (NSString *)getAsString:(sqlite3_stmt *)statement;
- (NSArray *)getAsArray:(sqlite3_stmt *)statement;
- (NSDictionary *)getAsDictionary:(sqlite3_stmt *)statement;


@end
