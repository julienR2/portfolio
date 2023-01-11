/*
  Warnings:

  - You are about to alter the column `latitude` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `longitude` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Album" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_MediaToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MediaToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MediaToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AlbumToMedia" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlbumToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Album" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlbumToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    CONSTRAINT "Media_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("creationDate", "extension", "id", "latitude", "longitude", "name", "ownerId", "path") SELECT "creationDate", "extension", "id", "latitude", "longitude", "name", "ownerId", "path" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE UNIQUE INDEX "Media_path_key" ON "Media"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToTag_AB_unique" ON "_MediaToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToTag_B_index" ON "_MediaToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToMedia_AB_unique" ON "_AlbumToMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToMedia_B_index" ON "_AlbumToMedia"("B");
