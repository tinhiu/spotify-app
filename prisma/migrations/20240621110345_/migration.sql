-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "user_id" TEXT,
    "image_url" TEXT,
    "external_urls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackPin" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "track_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "external_urls" TEXT NOT NULL,
    "preview_url" TEXT,
    "image_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackOnCollection" (
    "track_id" TEXT NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackOnCollection_pkey" PRIMARY KEY ("track_id","collection_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_track_id_key" ON "Track"("track_id");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_userId_key" ON "Collection"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_trackPin_fkey" FOREIGN KEY ("trackPin") REFERENCES "Track"("track_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackOnCollection" ADD CONSTRAINT "TrackOnCollection_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackOnCollection" ADD CONSTRAINT "TrackOnCollection_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("track_id") ON DELETE RESTRICT ON UPDATE CASCADE;
