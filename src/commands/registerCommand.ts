import { integer } from 'drizzle-orm/gel-core';
import { createUser, getUser } from '../lib/db/queries/users.js';
import { exit } from 'node:process';


export async function handlerRegister(cmdName: string, ...args: string[]){
  if (args.length === 0){
    throw Error("Register expects a username to register!");
  }

  const username = args[0];

  const user = await getUser(username);
  if (user !== undefined){
    console.log(`User already exists: ${user.name}`);
    exit(1);
  }

  console.log(`Creating new user: ${username}`);
  const result = await createUser(username);

  if (result === undefined){
    console.log("Registration failed!");
    return;
  }

  console.log("Success!");
}