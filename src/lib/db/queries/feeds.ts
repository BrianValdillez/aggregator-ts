import { db } from "..";
import { exit } from "node:process";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { type User, users, type Feed, feeds } from "../schema";
import { RSSChannel } from "src/rss";

//export type RegisteredFeed = Feed & {
//    user_name: string,
//};

export async function createFeed(feedName: string, user: User, rssFeed: RSSChannel ): Promise<Feed>{
    const [feed] = await db.insert(feeds).values({ 
        name: feedName, 
        url: rssFeed.link, 
        user_id: user.id, 
    }).returning();

    return feed;
}

type GetFeedsResult = {
    id: string,
    table_name: string,
    url: string,
    user_id: string | null;
    user_name: string;
};

export async function getFeeds(): Promise<GetFeedsResult[]> {
    const results = await db.select({
        id: feeds.id,
        table_name: feeds.name,
        url: feeds.url,
        user_id: feeds.user_id,
        user_name: users.name,
    }).from(feeds).innerJoin(users, eq(feeds.user_id, users.id));

    return results;
}