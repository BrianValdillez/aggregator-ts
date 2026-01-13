import { db } from "..";
import { exit } from "node:process";
import { and, eq, lt, gte, ne } from 'drizzle-orm';
import { type User, users, type Feed, feeds, type FeedFollow, feed_follows } from "../schema";
import { RSSChannel } from "src/rss";

export type GetFeedsResult = {
    id: string,
    table_name: string,
    url: string,
    user_id: string | null;
    user_name: string;
};

export type FeedFollowResult = FeedFollow & {
    user_name: string;
    feed_name: string;
};

export type UserFeedFollowResult = {
    followId: string;
    feedName: string;
};

export async function createFeed(feedName: string, user: User, rssFeed: RSSChannel ): Promise<Feed>{
    const [feed] = await db.insert(feeds).values({ 
        name: feedName, 
        url: rssFeed.link, 
        user_id: user.id, 
    }).returning();

    return feed;
}

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

export async function getFeedByURL(url: string): Promise<Feed>{
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    return feed;
}

export async function createFeedFollow(userId: string, feedId: string): Promise<FeedFollowResult>{
    const [newFeedFollow] = await db.insert(feed_follows).values({
        user_id: userId,
        feed_id: feedId,
    }).returning();

    const [feedFollowResult] = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        user_id: feed_follows.user_id,
        feed_id: feed_follows.feed_id,
        user_name: users.name,
        feed_name: feeds.name,
    }).from(feed_follows).where(eq(feed_follows.id, newFeedFollow.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id));

    return feedFollowResult;
}

export async function unfollowFeed(userId: string, feedId: string): Promise<boolean> {
    try {
        await db.delete(feed_follows).where(and(
            eq(feed_follows.user_id, userId),
            eq(feed_follows.feed_id, feedId)));
    } catch (error){
        return false;
    }
    
    return true;
}

export async function getFeedFollowsForUser(userId:string): Promise<UserFeedFollowResult[]> {
    const feedFollows = await db.select({
        feedName: feeds.name,
        followId: feed_follows.id,
    })
        .from(feed_follows).where(eq(feed_follows.user_id, userId))
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id));


    return feedFollows;
}