import { readConfig, setUser } from '../config.js';
import { getUser } from '../lib/db/queries/users.js';

export async function handlerLogin(cmdName: string, ...args: string[]){
  if (args.length === 0){
    throw Error("login expects a username arguement!");
  }

  const username = args[0];
  console.log(`Checking for user: ${username}...`);
  try{
    const user = await getUser(username);
    if (user === undefined || user.name !== username){
      throw new Error;
    }
  }catch(error){
    console.log(`Failed to login with user: ${username}`);
    return;
  }
  
  setUser(username);
  console.log(`User set: ${username}`)
}