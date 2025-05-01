import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { BaseError } from "../errors/baseError";

export function loadHomeDir() {
  const homeDir = os.homedir();
  const platform = process.platform;
  const availableOS = {
    windowsOrMac: ["win32", "darwin"],
    linux: true,
  };

  if (availableOS.windowsOrMac.includes(platform)) {
    return path.join(homeDir, "Documents");
  } else if (availableOS[platform.toString() as "linux"]) {
    const docsPath = path.join(homeDir, "Documents");
    const docsPathPtBr = path.join(homeDir, "Documentos");

    if (fs.existsSync(docsPath)) {
      return docsPath;
    } else if (fs.existsSync(docsPathPtBr)) {
      return docsPathPtBr;
    } else {
      throw new BaseError("not found error", "Documents folder don't exists.");
    }
  } else {
    throw new BaseError("unsupported error", "Your system is not supported.");
  }
}
