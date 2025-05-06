import fs from "node:fs";
import path from "node:path";

import { BaseError } from "../errors/baseError";
import { CutSettings } from "../@types/cutSettings";
import { loadHomeDir } from "../lib/loadHomeDir";
import { projectFolderName, backupFolderName } from "../constants";

export function loadBackupCutSettings(
  dateBackupFolder: string,
  backupFilename: string
) {
  try {
    const loadCutSettingsPath = path.join(
      loadHomeDir(),
      projectFolderName,
      backupFolderName,
      dateBackupFolder,
      backupFilename
    );

    const cutSettingsRawData = fs.readFileSync(loadCutSettingsPath, "utf8");
    const jsonData = JSON.parse(cutSettingsRawData) as CutSettings;

    return jsonData;
  } catch (err) {
    if (err instanceof BaseError) {
      console.error({
        error: err.error,
        message: err.message,
      });
    } else if (err instanceof SyntaxError) {
      console.error("Error when parsing JSON:", err.message);
    } else {
      throw err;
    }
  }
}
