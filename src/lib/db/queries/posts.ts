import { db } from "..";
import { exit } from "node:process";
import { and, eq, lt, gte, ne, sql, desc } from 'drizzle-orm';
import { PgTimestamp, timestamp } from "drizzle-orm/pg-core";
import { users, feeds, feed_follows, type Post, posts } from "../schema";
import { type RSSItem } from "src/rss";

export type DisplayPost = {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    publishedAt: Date | null;
    feedName: string;
};

export async function createPost(feedID: string, post: RSSItem ): Promise<Post | undefined>{
    try{
        //console.log(`Creating post for ${post.link}`);
        const [newPost] = await db.insert(posts).values({
            title: post.title,
            url: post.link,
            description: post.description,
            publishedAt: post.pubDate,
            feedID: feedID,
        }).returning();

        return newPost;
    } catch (error){
        //if (error instanceof Error)
        //    console.log(error.message);
        return undefined;
    }
}

export async function getPostsForUser(userID: string, numPosts:number): Promise<DisplayPost[]>{
    const postList = await db.select({
        id: posts.id,
        url: posts.url,
        title: posts.title,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedName: feeds.name
    }).from(users).where(eq(users.id, userID))
        .innerJoin(feed_follows, eq(feed_follows.user_id, users.id))
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
        .innerJoin(posts, eq(posts.feedID, feed_follows.feed_id))
        .orderBy(desc(posts.publishedAt))
        .limit(numPosts);

    return postList;
}