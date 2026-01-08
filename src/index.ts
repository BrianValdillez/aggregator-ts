import { readConfig, setUser } from 'src/config.js';

function main() {
  setUser("RD");

  const cfg = readConfig();
  console.log(cfg);
}

main();
