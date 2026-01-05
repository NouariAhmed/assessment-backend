-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isInStock" BOOLEAN NOT NULL,
    "variants" TEXT NOT NULL
);
