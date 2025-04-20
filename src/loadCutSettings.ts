import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { BaseError } from "./errors/baseError";
import { CutSettings } from "./@types/cutSettings";

export function loadCutSettings() {
  try {
    const loadCutSettingsPath = path.join(loadHomeDir(), "cutBook", "cutSettings.json");
    const cutSettingsRawData = fs.readFileSync(loadCutSettingsPath, "utf8");
    const jsonData = JSON.parse(cutSettingsRawData) as CutSettings;
    
    return jsonData;
  } 
  catch (err) {
    if (err instanceof BaseError) {
      console.error({
        error: err.error,
        message: err.message
      })
    } 
    else if (err instanceof SyntaxError) {
      console.error('Error when parsing JSON:', err.message);
    }
    else {
      throw err;
    }
  }
}

export function loadHomeDir() {
  const homeDir = os.homedir();
  const platform = process.platform;
  const availableOS = {
    "windowsOrMac": ["win32", "darwin"],
    "linux": true
  };
  
  if(availableOS.windowsOrMac.includes(platform)) {
    return path.join(homeDir, "Documents")
  } 
  else if (availableOS[platform.toString() as "linux"]) {
    const docsPath = path.join(homeDir, 'Documents');
    const docsPathPtBr = path.join(homeDir, 'Documentos');

    if (fs.existsSync(docsPath)) {
      return docsPath;
    } 
    else if (fs.existsSync(docsPathPtBr)) {
      return docsPathPtBr;
    } 
    else {
      throw new BaseError("not found error", "Documents folder don't exists.");
    }
  }
  else {
    throw new BaseError("unsupported error", "Your system is not supported.")
  }
}