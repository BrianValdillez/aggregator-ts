import { exit } from 'process';
import { readConfig, setUser } from 'src/config.js';

type CommandHandler = (cmdName: string, ...args: string[]) => void;
type CommandsRegistry = Record<string, CommandHandler>;

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
  registry[cmdName] = handler;
}

function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  if (!(cmdName in registry)){
    throw Error(`Unrecognized command name: ${cmdName}`);
  }

  try{
    registry[cmdName](cmdName, ...args);
  }
  catch(error){
    if (error instanceof Error){
      console.log(`Error running command: ${error.message}`);
    }
    exit(1);
  }
}

function handlerLogin(cmdName: string, ...args: string[]){
  if (args.length === 0){
    throw Error("login expects a username arguement!");
  }

  const username = args[0];
  setUser(username);
  console.log(`User set: ${username}`)
}

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, 'login', handlerLogin);

  if (process.argv.length <= 2){
    console.log('No commands received!');
    exit(1);
  }

  runCommand(registry, process.argv[2], ...(process.argv.slice(3)));
}

main();
