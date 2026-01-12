import { readConfig } from "src/config";
import { getUsers } from "src/lib/db/queries/users";


export async function handlerUsers(cmdName: string, ...args: string[]){
    const users = await getUsers();
    
    // Process + print

    if (users.length === 0){
        console.log('No registered users.');
        return;
    }

    const config = readConfig();

    for (const user of users){
        if (user.name === config.currentUserName){
            console.log(`* ${user.name} (current)`);
        }
        else{
            console.log(`* ${user.name}`);
        }
    }
}