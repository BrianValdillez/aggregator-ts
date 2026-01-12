import { db } from "src/lib/db";
import { resetUsers } from "src/lib/db/queries/users";


export async function handlerReset(cmdName: string, ...args: string[]){
    await resetUsers();
    console.log('Reset the database!');
}