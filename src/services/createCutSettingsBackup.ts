import path from "node:path";
import fs from "node:fs";

import { CutSettings } from "../@types/cutSettings";
import { loadHomeDir } from "../lib/loadHomeDir";
import { backupFolderName, projectFolderName } from "../constants";
import { formatDate } from "../lib/formatDate";
import { generateShortHash } from "../lib/generateShortHash";
import { prisma } from "../lib/prisma";

export function createCutSettingsBackup(cutSettings: CutSettings) {
  const homeDir = loadHomeDir();
  const backupFolderPath = path.join(
    homeDir,
    projectFolderName,
    backupFolderName
  );
  const currentDate = new Date();

  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(path.join(backupFolderPath, formatDate(currentDate)), {
      recursive: true,
    });
  }

  const currentDateFolderPath = path.join(
    backupFolderPath,
    formatDate(currentDate)
  );

  if (!fs.existsSync(currentDateFolderPath)) {
    fs.mkdirSync(currentDateFolderPath);
  }

  const filename = cutSettings[0].filename;

  cutSettings[0].books.forEach(async (book) => {
    const cutSettings: CutSettings = [
      {
        filename,
        books: [book],
      },
    ];

    const fileHash = generateShortHash();

    const backupFilename = `${fileHash}-${book.title}-backup.json`;

    fs.writeFileSync(
      path.join(currentDateFolderPath, backupFilename),
      JSON.stringify(cutSettings)
    );

    await prisma.backupFiles.create({
      data: {
        id: fileHash,
        book: book.title,
        folder: path.basename(currentDateFolderPath),
      },
    });
  });
}
