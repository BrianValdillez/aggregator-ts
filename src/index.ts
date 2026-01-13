import { exit } from 'process';
import { type CommandsRegistry, registerCommand, runCommand } from './commands/commands.js';

import { handlerLogin } from './commands/loginCommand.js';
import { handlerRegister } from './commands/registerCommand.js';
import { handlerReset } from './commands/resetCommand.js';
import { handlerUsers } from './commands/usersCommand.js';
import { handlerAgg } from './commands/aggCommand.js';
import { handlerAddFeed } from './commands/addFeedCommand.js';

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, 'login', handlerLogin);
  registerCommand(registry, 'register', handlerRegister);
  registerCommand(registry, 'reset', handlerReset);
  registerCommand(registry, 'users', handlerUsers);
  registerCommand(registry, 'agg', handlerAgg);
  registerCommand(registry, 'addfeed', handlerAddFeed);

  if (process.argv.length <= 2){
    console.log('No commands received!');
    exit(1);
  }
  
  const cmd = process.argv[2];
  try {
    await runCommand(registry, cmd, ...(process.argv.slice(3)));
  } catch (error){
    console.log(`Command not found: ${cmd}`);
  }

  exit(0);
}

main();
