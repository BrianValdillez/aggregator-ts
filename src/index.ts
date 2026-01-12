import { exit } from 'process';
import { type CommandsRegistry, registerCommand, runCommand } from './commands/commands.js';

import { handlerLogin } from './commands/loginCommand.js';
import { handlerRegister } from './commands/registerCommand.js';

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, 'login', handlerLogin);
  registerCommand(registry, 'register', handlerRegister);

  if (process.argv.length <= 2){
    console.log('No commands received!');
    exit(1);
  }
 
  await runCommand(registry, process.argv[2], ...(process.argv.slice(3)));

  exit(0);
}

main();
