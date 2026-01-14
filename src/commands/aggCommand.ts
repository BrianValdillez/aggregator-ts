import { exit } from "process";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds.js";
import { createPost } from "src/lib/db/queries/posts.js";
import { fetchFeed } from "src/rss.js";

async function scrapeNextFeed(){
    const feed = await getNextFeedToFetch();
    await markFeedFetched(feed.id);
    const channel = await fetchFeed(feed.url);

    console.log(`${feed.name} (${channel.title})`);
    for (const item of channel.items){
        //console.log(`\t- ${item.description}`);
        await createPost(feed.id, item);
    }
}

function parseDuration(intervalStr: string): number{
    let durationMs = 0;

    const regex = /(\d+)(ms|s|m|h)/ig;
    const matches = intervalStr.matchAll(regex);
    for (const match of matches){
        const value = Number(match[1]);

        switch(match[2]){
            case 'ms':
                durationMs += value;
                break;
            case 's':
                durationMs += (value * 1000);
                break;
            case 'm': 
                durationMs += (value * 1000 * 60);
                break;
            case 'h':
                durationMs += (value * 1000 * 60 * 60);
                break;
            default:
                console.log('Something weird going on in duration parsing');
                break;
        }
    }

    return durationMs;
}

export async function handlerAgg(cmdName: string, ...args: string[]){
    if (args.length < 1){
        console.log('ERR: Not enough parameters provided. Requires an interval.')
        exit(1);
    }

    const [intervalStr] = args;
    console.log(`Parsing interval from string: ${intervalStr}...`);
    const intervalMs = parseDuration(intervalStr);
    if (intervalMs <= 0){
        console.log(`Failed to parse interval. Exiting.`);
        exit(1);
    }
    
    function handleError(reason:any){
        console.log(`Error scraping feed: ${reason}`);
    }

    console.log(`Scraping feeds every ${intervalStr}(${intervalMs}ms)...`);
    scrapeNextFeed().catch(handleError);

    const interval = setInterval(() => {
       scrapeNextFeed().catch(handleError);
    }, intervalMs);

    
    // Stop loop when program is killed.
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
    })});
}