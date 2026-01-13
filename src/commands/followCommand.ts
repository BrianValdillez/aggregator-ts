import { exit } from "process";
import { createFeedFollow, getFeedByURL, getFeedFollowsForUser } from "src/lib/db/queries/feeds.js";
import { getActiveUser } from "src/config.js";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]){
    if (args.length === 0){
        exit(1);
    }

    // Retrieve Feed by URL
    const url = args[0];
    const feed = await getFeedByURL(url);
    if (!feed?.id){
        console.log(`ERR: Could not find feed with URL: ${url}`);
        exit(1);
    }

    // Register new Feed Follow
    console.log(`Registering Feed Follow: ${user.name} => ${url}`);
    try{
        const feedFollowResult = await createFeedFollow(user.id, feed.id);
        console.log("Success!");
        console.log(feedFollowResult);
    } catch (error){
        console.log('Feed Follow Failed!');
        if (error instanceof Error){
            console.log(error.message);
        }
    }
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]){
    console.log(`Retrieving Feed Follows for user ${user.name}...`);
    const follows = await getFeedFollowsForUser(user.id);
    console.log(`${follows.length} follow(s) found!`);
    for (const follow of follows){
        console.log(`\t- ${follow.feedName}`);
    }
}