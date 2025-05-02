import dayjs from "dayjs";
import fs from "node:fs/promises";
import path from "node:path";

import { prisma } from "../lib/prisma";
import { loadHomeDir } from "../lib/loadHomeDir";
import { backupFolderName, projectFolderName } from "../constants";

type BackupFolders = {
  [book: string]: {
    expiredFiles: string[];
    length: number;
  };
};

export async function validateBackupExpiry() {
  const backupFiles = await prisma.backupFiles.findMany();
  const backupFolders: BackupFolders = {};

  const backupFolderPath = path.join(
    loadHomeDir(),
    projectFolderName,
    backupFolderName
  );

  for await (const backupFile of backupFiles) {
    const backupFileIsExpired = dayjs().isAfter(
      dayjs(backupFile.createdAt).add(1, "month")
    );

    const folderLength = await fs
      .readdir(path.join(backupFolderPath, backupFile.folder))
      .then((data) => data.length);

    if (backupFileIsExpired) {
      backupFolders[backupFile.folder]
        ? backupFolders[backupFile.folder].expiredFiles.push(
            `${backupFile.id}-${backupFile.book}`
          )
        : (backupFolders[backupFile.folder] = {
            expiredFiles: [`${backupFile.id}-${backupFile.book}`],
            length: folderLength,
          });
    }
  }

  if (Object.keys(backupFolders).length === 0) {
    console.log("Its ok!");
    return;
  }

  for (let folder in backupFolders) {
    if (
      backupFolders[folder].length === backupFolders[folder].expiredFiles.length
    ) {
      await fs.rm(path.join(backupFolderPath, folder), {
        recursive: true,
        force: true,
      });

      await prisma.backupFiles.deleteMany({
        where: {
          id: {
            in: backupFolders[folder].expiredFiles.map((file) =>
              file.substring(0, 8)
            ),
          },
        },
      });
    } else {
      for (let file of backupFolders[folder].expiredFiles) {
        const fileId = file.substring(0, 8);
        const fileName = `${file}-backup.json`;

        await fs.unlink(path.join(backupFolderPath, folder, fileName));

        await prisma.backupFiles.delete({
          where: {
            id: fileId,
          },
        });
      }
    }
  }
}
