import { db } from "..";
import { exit } from "node:process";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { type User, users, type Feed, feeds } from "../schema";
import { RSSChannel } from "src/rss";

export async function createFeed(feedName: string, user: User, rssFeed: RSSChannel ): Promise<Feed>{
    const [feed] = await db.insert(feeds).values({ 
        name: feedName, 
        url: rssFeed.link, 
        user_id: user.id, 
    }).returning();

    return feed;
}