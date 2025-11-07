-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FRONT_OF_HOUSE', 'BACK_OF_HOUSE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedPassword" BOOLEAN NOT NULL DEFAULT false,
    "matchedSantaId" INTEGER,
    "Accepted" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'FRONT_OF_HOUSE',
    "profilePicture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pendingAccept" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" SERIAL NOT NULL,
    "wishlistId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCode" (
    "id" SERIAL NOT NULL,
    "eventDate" TIMESTAMP(3),
    "matchSantaDate" TIMESTAMP(3),
    "overview" TEXT,
    "code" TEXT NOT NULL,

    CONSTRAINT "AdminCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "askerId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "wishlistItemId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_matchedSantaId_key" ON "User"("matchedSantaId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_key" ON "Wishlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCode_code_key" ON "AdminCode"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_matchedSantaId_fkey" FOREIGN KEY ("matchedSantaId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_askerId_fkey" FOREIGN KEY ("askerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_wishlistItemId_fkey" FOREIGN KEY ("wishlistItemId") REFERENCES "WishlistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
