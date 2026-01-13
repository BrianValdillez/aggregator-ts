import { XMLParser } from "fast-xml-parser";
import { channel, Channel } from "node:diagnostics_channel";
import { exit, title } from "node:process";

export type RSSChannel = {
    title: string;
    link: string;
    description: string;

    items: RSSItem[];
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: Date;
};

function hasField(obj: any, field: string): boolean{
    return field in obj;
}

function hasFields(obj: any, fields: string[]): boolean{
    let hasAll = true;
    for (const field of fields){
        hasAll = hasAll && hasField(obj, field);
    }

    return hasAll;
}

function requireField(obj:any, field:string){
    if (!hasField(obj, field)){
        console.log(`ERR: Required field '${field}' not found.`);
        exit(1);
    }
}

export async function fetchFeed(feedURL: string): Promise<RSSChannel>{
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
        },
    });

    const xml = await response.text();
    const parser = new XMLParser();
    const xmlObj = parser.parse(xml).rss;
    
    if (!hasField(xmlObj, 'channel')){
        console.log('ERR: No channel found in XML.')
        exit(1);
    }

    const channelObj = xmlObj.channel;
    requireField(channelObj, 'title');
    requireField(channelObj, 'link');
    requireField(channelObj, 'description');
    
    const rssChannel:RSSChannel = {
        title: channelObj.title,
        link: channelObj.link,
        description: channelObj.description,

        items: [],
    };

    const items:RSSItem[] = [];
    if (hasField(channelObj, 'item')){
        if (!Array.isArray(channelObj.item))
        {
            channelObj.item = [channelObj.item];
        }
    }
    else{
        channelObj.item = [];
    }

    const fields = ['title', 'link', 'description', 'pubDate'];
    for (const item of channelObj.item){
        if (!hasFields(item, fields))
        {
            continue;
        }

        rssChannel.items.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    }

    return rssChannel;
}