-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "skills" TEXT NOT NULL DEFAULT '[]',
    "themes" TEXT NOT NULL DEFAULT '[]',
    "targetGender" TEXT NOT NULL DEFAULT 'alle',
    "platforms" TEXT NOT NULL DEFAULT '[]',
    "appStoreUrl" TEXT,
    "playStoreUrl" TEXT,
    "websiteUrl" TEXT,
    "hasAds" BOOLEAN NOT NULL DEFAULT false,
    "hasInAppPurchases" BOOLEAN NOT NULL DEFAULT false,
    "isOfflineCapable" BOOLEAN NOT NULL DEFAULT false,
    "requiresInternet" BOOLEAN NOT NULL DEFAULT false,
    "dataCollection" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "priceModel" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "pros" TEXT NOT NULL DEFAULT '[]',
    "cons" TEXT NOT NULL DEFAULT '[]',
    "parentTip" TEXT,
    "iconUrl" TEXT,
    "screenshots" TEXT NOT NULL DEFAULT '[]',
    "videoUrl" TEXT,
    "developerName" TEXT,
    "affiliateUrl" TEXT,
    "affiliateProvider" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "editorChoice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BoardGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "playTimeMinutes" INTEGER NOT NULL,
    "complexity" INTEGER NOT NULL,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "skills" TEXT NOT NULL DEFAULT '[]',
    "themes" TEXT NOT NULL DEFAULT '[]',
    "targetGender" TEXT NOT NULL DEFAULT 'alle',
    "price" REAL,
    "affiliateUrl" TEXT,
    "amazonUrl" TEXT,
    "rating" REAL NOT NULL,
    "pros" TEXT NOT NULL DEFAULT '[]',
    "cons" TEXT NOT NULL DEFAULT '[]',
    "parentTip" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "editorChoice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BoardGame_slug_key" ON "BoardGame"("slug");
