-- CreateTable
CREATE TABLE "BackupFiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "book" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
