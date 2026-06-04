-- AlterTable: add ordered image gallery (array of {url, thumbUrl, mediaId, alt}) to stations
ALTER TABLE "stations" ADD COLUMN "images" JSONB NOT NULL DEFAULT '[]';
