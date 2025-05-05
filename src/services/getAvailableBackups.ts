import { prisma } from "../lib/prisma";
import { BaseError } from "../errors/baseError";

type AvailableBackup = {
  [date: string]: {
    [book: string]: string;
  };
};

export async function getAvailableBackups(): Promise<AvailableBackup> {
  const backupFiles = await prisma.backupFiles.findMany();

  if (!backupFiles) throw new BaseError("Not found", "no backups available");

  const availableBackups: AvailableBackup = {};

  backupFiles.forEach((file) => {
    availableBackups[file.folder]
      ? (availableBackups[file.folder][file.book] = file.id)
      : (availableBackups[file.folder] = {
          [file.book]: file.id,
        });
  });

  return availableBackups;
}
