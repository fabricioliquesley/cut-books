import fs from "node:fs";
import path from "node:path";
import { loadHomeDir } from "../lib/loadHomeDir";
import { normalizeFolderName } from "../lib/normalizeFolderName";

/**
 * 
 * @param folderName string 
 * @returns {void}
 */
export function createBookFolder(folderName: string) {
  const normalizedFolderName = normalizeFolderName(folderName);
  const folderPath = path.join(
    loadHomeDir(), "cutBook", "books", normalizedFolderName 
  );

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    else {
      console.log(`A folder with the name ${path.basename(folderName)} already exists.`);
      return;
    }
  } catch (err) {
    console.error(err);
  }
}
