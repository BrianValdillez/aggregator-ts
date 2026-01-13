import { exit } from "node:process";
import { readConfig } from "src/config";
import { createFeed, createFeedFollow } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { type Feed, type User } from "src/lib/db/schema.js";
import { fetchFeed } from "src/rss";

function printFeed(feed: Feed, user: User){
    console.log('User:');
    console.log(JSON.stringify(user));
    console.log('\nFeed:');
    console.log(JSON.stringify(feed));
}

export async function handlerAddFeed(cmdName: string, user: User,...args: string[]){
    if (args.length < 2){
        console.log('ERR: Not enough parameters provided. Requires name and URL.')
        exit(1);
    }

    const [feedName, feedURL] = args;
    const rssChannel = await fetchFeed(feedURL);
    const feed = await createFeed(feedName, user, rssChannel);

    if (!feed){
        console.log(`Could not create feed: ${feedURL}`);
    }

    console.log('Following feed...')
    await createFeedFollow(user.id, feed.id);
    console.log('Success!');

    printFeed(feed, user);
}