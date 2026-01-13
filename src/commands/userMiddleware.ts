import { type CommandHandler } from "./commands.js";
import { getActiveUser } from "src/config.js";
import { type User } from "src/lib/db/schema.js";
import { getUser } from "src/lib/db/queries/users.js";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

// Validate login
export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler{
    return async function (cmdName: string, ...args: string[]){
        // Retrieve current user
        const userName = getActiveUser();
        const user = await getUser(userName);
        if (!user){
            throw new Error(`User ${userName} not found!`);
        }

        return await handler(cmdName, user, ...args);
    };    
};