import { exit } from 'process';
import { type User } from 'src/lib/db/schema.js';

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  if (!(cmdName in registry)){
    throw Error(`Unrecognized command name: ${cmdName}`);
  }

  try{
    await registry[cmdName](cmdName, ...args);
  }
  catch(error){
    if (error instanceof Error){
      console.log(`Error running command: ${error.message}`);
    }
    exit(1);
  }
}