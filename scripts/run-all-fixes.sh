#!/bin/bash

# Automated script to run all fixes for boernespilguiden
# This script runs tasks #4, #5, and #6 from boernespilguiden-fixes-v2.md

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Børnespilguiden - Automated Fixes Runner                ║${NC}"
echo -e "${BLUE}║   Tasks #4, #5, #6 from boernespilguiden-fixes-v2.md      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "Please create a .env file with DATABASE_URL and TMDB_API_KEY"
    exit 1
fi

# Check for required environment variables
source .env

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not set in .env${NC}"
    exit 1
fi

if [ -z "$TMDB_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: TMDB_API_KEY not set${NC}"
    echo -e "Tasks #4 and #6 require TMDB API key"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Parse command line arguments
DRY_RUN=""
SKIP_MEDIA_IMAGES=false
SKIP_GAME_IMAGES=false
SKIP_STREAMING=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN="--dry-run"
            echo -e "${YELLOW}🔍 Running in DRY RUN mode${NC}"
            echo ""
            shift
            ;;
        --skip-media-images)
            SKIP_MEDIA_IMAGES=true
            shift
            ;;
        --skip-game-images)
            SKIP_GAME_IMAGES=true
            shift
            ;;
        --skip-streaming)
            SKIP_STREAMING=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --dry-run              Run without making changes"
            echo "  --skip-media-images    Skip task #4 (DR Ramasjang images)"
            echo "  --skip-game-images     Skip task #5 (game images)"
            echo "  --skip-streaming       Skip task #6 (streaming content)"
            echo "  --help                 Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Task #4: Fix missing media images (DR Ramasjang, etc.)
if [ "$SKIP_MEDIA_IMAGES" = false ]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}📺 Task #4: Fixing missing images on DR Ramasjang programs${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    if npx tsx scripts/fix-media-images.ts $DRY_RUN; then
        echo ""
        echo -e "${GREEN}✅ Task #4 completed successfully${NC}"
    else
        echo ""
        echo -e "${RED}❌ Task #4 failed${NC}"
        exit 1
    fi
    echo ""
else
    echo -e "${YELLOW}⏭️  Skipping Task #4: Media images${NC}"
    echo ""
fi

# Task #5: Fix missing game images (Khan Academy, Minecraft, etc.)
if [ "$SKIP_GAME_IMAGES" = false ]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎮 Task #5: Fixing missing game images${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    if npx tsx scripts/fix-game-images.ts $DRY_RUN; then
        echo ""
        echo -e "${GREEN}✅ Task #5 completed successfully${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Task #5 completed with warnings${NC}"
        echo -e "Some games may require manual image addition"
    fi
    echo ""
else
    echo -e "${YELLOW}⏭️  Skipping Task #5: Game images${NC}"
    echo ""
fi

# Task #6: Add streaming content
if [ "$SKIP_STREAMING" = false ]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎬 Task #6: Adding streaming content${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    # Filmstriben (free via libraries)
    echo -e "${YELLOW}Fetching Filmstriben content (100 items)...${NC}"
    if npx tsx scripts/fetch-streaming-content.ts filmstriben 100 $DRY_RUN; then
        echo -e "${GREEN}✅ Filmstriben completed${NC}"
    else
        echo -e "${RED}❌ Filmstriben failed${NC}"
    fi
    echo ""

    # Apple TV+
    echo -e "${YELLOW}Fetching Apple TV+ content (100 items)...${NC}"
    if npx tsx scripts/fetch-streaming-content.ts apple 100 $DRY_RUN; then
        echo -e "${GREEN}✅ Apple TV+ completed${NC}"
    else
        echo -e "${RED}❌ Apple TV+ failed${NC}"
    fi
    echo ""

    # TV 2 Play
    echo -e "${YELLOW}Fetching TV 2 Play content (100 items)...${NC}"
    if npx tsx scripts/fetch-streaming-content.ts tv2 100 $DRY_RUN; then
        echo -e "${GREEN}✅ TV 2 Play completed${NC}"
    else
        echo -e "${RED}❌ TV 2 Play failed${NC}"
    fi
    echo ""

    echo -e "${GREEN}✅ Task #6 completed${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  Skipping Task #6: Streaming content${NC}"
    echo ""
fi

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   All Tasks Completed!                                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -n "$DRY_RUN" ]; then
    echo -e "${YELLOW}💡 This was a dry run. Run without --dry-run to apply changes.${NC}"
    echo ""
fi

echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Review the changes in the database"
echo -e "  2. Test the website to verify everything works"
echo -e "  3. Deploy to production if not already there"
echo ""
