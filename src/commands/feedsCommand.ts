import { getFeeds } from "src/lib/db/queries/feeds";

export async function handlerFeeds(cmdName: string, ...args: string[]){
    const feedsList = await getFeeds();

    console.log(`Feeds found: ${feedsList.length}`);
    for (const feed of feedsList){
        console.log(feed);
    }
}