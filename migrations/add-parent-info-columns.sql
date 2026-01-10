-- Migration: Add Parent Info columns to Media table
-- Safe to run multiple times (uses IF NOT EXISTS)

-- Add parent information columns
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentInfo" TEXT;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentTip" TEXT;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "pros" TEXT[] DEFAULT '{}';
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "cons" TEXT[] DEFAULT '{}';

-- Add content feature flags
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasViolence" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasScaryContent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasLanguage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasEducational" BOOLEAN NOT NULL DEFAULT false;
