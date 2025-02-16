-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedPassword" BOOLEAN NOT NULL DEFAULT false,
    "matchedSantaId" INTEGER,
    "Accepted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_matchedSantaId_fkey" FOREIGN KEY ("matchedSantaId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isAdmin", "matchedSantaId", "password", "updatedAt", "updatedPassword") SELECT "createdAt", "email", "id", "isAdmin", "matchedSantaId", "password", "updatedAt", "updatedPassword" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_matchedSantaId_key" ON "User"("matchedSantaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
