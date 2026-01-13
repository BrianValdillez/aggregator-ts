import fs from "fs";
import os from "os";
import path from "path";
import { config } from "process";

const CFG_FILENAME = ".gatorconfig.json";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string){
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function getActiveUser(): string {
    const cfg = readConfig();
    return cfg.currentUserName;
}

export function readConfig(): Config {
    const cfgPath = getConfigFilePath();
    try {
        
        const cfgString = fs.readFileSync(cfgPath, { encoding: 'utf-8' });
        return validateConfig(JSON.parse(cfgString));
    }
    catch(error){
        console.log(`Could not load config: ${cfgPath}`);
        if (error instanceof Error){
            console.log(`Error: ${error.message}`);
        }
    }

    return {
        dbUrl: "",
        currentUserName: "",
    };
}

function getConfigFilePath(): string{
    return path.join(os.homedir(), CFG_FILENAME);
}

function writeConfig(cfg: Config){
    const cfgPath = getConfigFilePath();
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, undefined, '\t'));
}

function validateConfig(rawCfg: any): Config {
    // TODO: What are we trying to validate, exactly? Just that we can typecast it?
    return rawCfg as Config;
}