import { exit } from "process";
import { type DisplayPost, getPostsForUser } from "src/lib/db/queries/posts";
import { type User } from "src/lib/db/schema.js";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]){
    let limit = 2;

    if (args.length > 0){
        limit = Number(args[0]);
    }

    console.log(`Retrieving the ${limit} most recent posts for user ${user.name}`);
    const userPosts = await getPostsForUser(user.id, limit);

    if (userPosts.length === 0){
        console.log('No posts found!')
        exit(0);
    }

    for (const post of userPosts){
        console.log(`** ${post.title} **`);
        console.log(`\t- Source Feed: ${post.feedName}`);
        console.log(`\t- Read More: ${post.url}`);
    }
}