#!/bin/bash

# Comprehensive game image downloader
# Uses multiple sources: iTunes API, Google Play, Wikipedia, Wikimedia Commons

cd /home/halfgood/Desktop/boernespilguiden

DIGITAL_DIR="public/images/games/digital"
BOARD_DIR="public/images/games/board"

mkdir -p "$DIGITAL_DIR" "$BOARD_DIR"

# User agent for web requests
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

echo "=========================================="
echo "  Game Image Downloader"
echo "=========================================="

# Function to download and validate image
download_image() {
  local slug="$1"
  local url="$2"
  local dir="$3"
  local ext="${4:-jpg}"

  local filepath="${dir}/${slug}.${ext}"

  # Check if we already have a valid image
  if [ -f "$filepath" ]; then
    local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
    if [ "$size" -gt 10000 ]; then
      echo "  ✓ $slug (exists - ${size} bytes)"
      return 0
    fi
  fi

  echo -n "  ⬇ $slug... "

  if curl -s -L -A "$UA" --connect-timeout 15 --max-time 60 -o "$filepath" "$url"; then
    local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
    local magic=$(head -c 4 "$filepath" 2>/dev/null | xxd -p)

    # Check for valid image magic bytes
    if [ "$size" -gt 5000 ]; then
      # PNG: 89504e47, JPEG: ffd8ff, WEBP: 52494646
      if [[ "$magic" == "89504e47"* ]] || [[ "$magic" == "ffd8ff"* ]] || [[ "$magic" == "52494646"* ]]; then
        echo "✓ (${size} bytes)"
        return 0
      fi
    fi

    echo "✗ (invalid: ${size} bytes)"
    rm -f "$filepath"
    return 1
  else
    echo "✗ (download failed)"
    rm -f "$filepath"
    return 1
  fi
}

# Function to search iTunes and download app icon
download_from_itunes() {
  local slug="$1"
  local search_term="$2"
  local dir="$3"

  local filepath="${dir}/${slug}.jpg"

  # Check if we already have a valid image
  if [ -f "$filepath" ]; then
    local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
    if [ "$size" -gt 10000 ]; then
      echo "  ✓ $slug (exists - ${size} bytes)"
      return 0
    fi
  fi

  echo -n "  ⬇ $slug (iTunes: $search_term)... "

  # Search iTunes
  local search_url="https://itunes.apple.com/search?term=${search_term// /+}&entity=software&limit=1"
  local icon_url=$(curl -s "$search_url" | grep -oP '"artworkUrl512":"[^"]*"' | cut -d'"' -f4 | head -1)

  if [ -n "$icon_url" ]; then
    if curl -s -L --connect-timeout 15 --max-time 60 -o "$filepath" "$icon_url"; then
      local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
      if [ "$size" -gt 10000 ]; then
        echo "✓ (${size} bytes)"
        return 0
      fi
    fi
  fi

  echo "✗"
  rm -f "$filepath" 2>/dev/null
  return 1
}

# Function to get image from Wikipedia API
download_from_wikipedia() {
  local slug="$1"
  local article="$2"
  local dir="$3"

  local filepath="${dir}/${slug}.jpg"

  # Check if we already have a valid image
  if [ -f "$filepath" ]; then
    local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
    if [ "$size" -gt 10000 ]; then
      echo "  ✓ $slug (exists - ${size} bytes)"
      return 0
    fi
  fi

  echo -n "  ⬇ $slug (Wikipedia: $article)... "

  # Get image URL from Wikipedia API
  local api_url="https://en.wikipedia.org/api/rest_v1/page/summary/${article// /_}"
  local image_url=$(curl -s "$api_url" | grep -oP '"source":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [ -n "$image_url" ]; then
    if curl -s -L --connect-timeout 15 --max-time 60 -o "$filepath" "$image_url"; then
      local size=$(stat -c%s "$filepath" 2>/dev/null || echo 0)
      if [ "$size" -gt 5000 ]; then
        echo "✓ (${size} bytes)"
        return 0
      fi
    fi
  fi

  echo "✗"
  rm -f "$filepath" 2>/dev/null
  return 1
}

echo ""
echo "=== DIGITAL GAMES ==="
echo ""

# Digital games with iTunes search terms
download_from_itunes "minecraft" "minecraft" "$DIGITAL_DIR"
download_from_itunes "sago-mini-world" "sago mini world" "$DIGITAL_DIR"
download_from_itunes "lego-duplo-world" "lego duplo world" "$DIGITAL_DIR"
download_from_itunes "peek-a-zoo" "peek a zoo" "$DIGITAL_DIR"
download_from_itunes "pbs-kids-games" "pbs kids games" "$DIGITAL_DIR"
download_from_itunes "fisher-price-laugh-learn" "fisher price laugh learn" "$DIGITAL_DIR"
download_from_itunes "toca-hair-salon-4" "toca hair salon 4" "$DIGITAL_DIR"
download_from_itunes "toca-kitchen-2" "toca kitchen 2" "$DIGITAL_DIR"
download_from_itunes "toca-life-town" "toca life town" "$DIGITAL_DIR"
download_from_itunes "baby-shark-world" "baby shark world" "$DIGITAL_DIR"
download_from_itunes "tiny-hands-first-words" "tiny hands first words" "$DIGITAL_DIR"
download_from_itunes "hey-duggee-big-badge-app" "hey duggee" "$DIGITAL_DIR"
download_from_itunes "khan-academy-kids" "khan academy kids" "$DIGITAL_DIR"
download_from_itunes "endless-alphabet" "endless alphabet" "$DIGITAL_DIR"
download_from_itunes "duolingo-abc" "duolingo abc" "$DIGITAL_DIR"
download_from_itunes "dr-panda-town" "dr panda town" "$DIGITAL_DIR"
download_from_itunes "toca-life-world" "toca life world" "$DIGITAL_DIR"
download_from_itunes "lego-builders-journey" "lego builders journey" "$DIGITAL_DIR"
download_from_itunes "pok-pok-playroom" "pok pok playroom" "$DIGITAL_DIR"
download_from_itunes "montessori-preschool" "montessori preschool" "$DIGITAL_DIR"
download_from_itunes "teach-your-monster-to-read" "teach your monster to read" "$DIGITAL_DIR"
download_from_itunes "thinkrolls-2" "thinkrolls 2" "$DIGITAL_DIR"
download_from_itunes "moose-math" "moose math" "$DIGITAL_DIR"
download_from_itunes "todo-math" "todo math" "$DIGITAL_DIR"
download_from_itunes "busy-shapes-colors" "busy shapes colors" "$DIGITAL_DIR"
download_from_itunes "arties-world" "artie world" "$DIGITAL_DIR"
download_from_itunes "daniel-tigers-neighborhood" "daniel tiger neighborhood" "$DIGITAL_DIR"
download_from_itunes "monument-valley-2" "monument valley 2" "$DIGITAL_DIR"
download_from_itunes "human-resource-machine" "human resource machine" "$DIGITAL_DIR"
download_from_itunes "dragonbox-numbers" "dragonbox numbers" "$DIGITAL_DIR"
download_from_itunes "dragonbox-algebra" "dragonbox algebra" "$DIGITAL_DIR"
download_from_itunes "stack-the-states" "stack the states" "$DIGITAL_DIR"
download_from_itunes "prodigy-math" "prodigy math game" "$DIGITAL_DIR"
download_from_itunes "lightbot-code-hour" "lightbot" "$DIGITAL_DIR"
download_from_itunes "scratch-jr" "scratchjr" "$DIGITAL_DIR"
download_from_itunes "altos-odyssey" "altos odyssey" "$DIGITAL_DIR"
download_from_itunes "osmo-coding" "osmo coding" "$DIGITAL_DIR"
download_from_itunes "geoguessr" "geoguessr" "$DIGITAL_DIR"
download_from_itunes "tynker" "tynker" "$DIGITAL_DIR"
download_from_itunes "hopscotch" "hopscotch programming" "$DIGITAL_DIR"
download_from_itunes "brainpop-jr" "brainpop jr" "$DIGITAL_DIR"
download_from_itunes "the-room" "the room game" "$DIGITAL_DIR"
download_from_itunes "mini-metro" "mini metro" "$DIGITAL_DIR"
download_from_itunes "bloons-td-6" "bloons td 6" "$DIGITAL_DIR"
download_from_itunes "abcmouse" "abcmouse" "$DIGITAL_DIR"
download_from_itunes "lingokids" "lingokids" "$DIGITAL_DIR"
download_from_itunes "homer" "homer learn read" "$DIGITAL_DIR"
download_from_itunes "splashlearn" "splashlearn" "$DIGITAL_DIR"
download_from_itunes "kahoot" "kahoot" "$DIGITAL_DIR"
download_from_itunes "codemonkey" "codemonkey" "$DIGITAL_DIR"
download_from_itunes "adventure-academy" "adventure academy" "$DIGITAL_DIR"
download_from_itunes "thinkrolls" "thinkrolls" "$DIGITAL_DIR"
download_from_itunes "wheres-my-water" "wheres my water" "$DIGITAL_DIR"
download_from_itunes "duolingo" "duolingo" "$DIGITAL_DIR"
download_from_itunes "stardew-valley" "stardew valley" "$DIGITAL_DIR"
download_from_itunes "civilization-vi" "civilization vi" "$DIGITAL_DIR"
download_from_itunes "factorio" "factorio" "$DIGITAL_DIR"
download_from_itunes "cities-skylines" "cities skylines" "$DIGITAL_DIR"
download_from_itunes "kerbal-space-program" "kerbal space program" "$DIGITAL_DIR"
download_from_itunes "portal" "bridge constructor portal" "$DIGITAL_DIR"

echo ""
echo "=== BOARD GAMES ==="
echo ""

# Board games from Wikipedia
download_from_wikipedia "catan" "Catan_(board_game)" "$BOARD_DIR"
download_from_wikipedia "pandemic" "Pandemic_(board_game)" "$BOARD_DIR"
download_from_wikipedia "ticket-to-ride" "Ticket_to_Ride_(board_game)" "$BOARD_DIR"
download_from_wikipedia "wingspan" "Wingspan_(board_game)" "$BOARD_DIR"
download_from_wikipedia "azul" "Azul_(board_game)" "$BOARD_DIR"
download_from_wikipedia "codenames" "Codenames_(board_game)" "$BOARD_DIR"
download_from_wikipedia "7-wonders" "7_Wonders_(board_game)" "$BOARD_DIR"
download_from_wikipedia "splendor" "Splendor_(game)" "$BOARD_DIR"
download_from_wikipedia "dixit" "Dixit_(board_game)" "$BOARD_DIR"
download_from_wikipedia "kingdomino" "Kingdomino" "$BOARD_DIR"
download_from_wikipedia "king-of-tokyo" "King_of_Tokyo" "$BOARD_DIR"
download_from_wikipedia "mysterium" "Mysterium_(board_game)" "$BOARD_DIR"
download_from_wikipedia "carcassonne" "Carcassonne_(board_game)" "$BOARD_DIR"
download_from_wikipedia "forbidden-island" "Forbidden_Island" "$BOARD_DIR"
download_from_wikipedia "labyrinth" "Labyrinth_(board_game)" "$BOARD_DIR"
download_from_wikipedia "blokus" "Blokus" "$BOARD_DIR"
download_from_wikipedia "candy-land" "Candy_Land" "$BOARD_DIR"
download_from_wikipedia "chutes-and-ladders" "Snakes_and_ladders" "$BOARD_DIR"

# Direct Wikipedia/Wikimedia URLs for games with known images
download_image "dobble" "https://upload.wikimedia.org/wikipedia/en/b/b3/Spot_it%21_%28card_game%29_cover.jpg" "$BOARD_DIR" "jpg"
download_image "sushi-go" "https://upload.wikimedia.org/wikipedia/en/d/df/Sushi_go_box_art.png" "$BOARD_DIR" "png"
download_image "uno" "https://upload.wikimedia.org/wikipedia/commons/f/f9/UNO_Logo.svg" "$BOARD_DIR" "svg"

# Additional board games - try Wikipedia API
download_from_wikipedia "monopoly" "Monopoly_(game)" "$BOARD_DIR"
download_from_wikipedia "scrabble" "Scrabble" "$BOARD_DIR"
download_from_wikipedia "risk" "Risk_(game)" "$BOARD_DIR"
download_from_wikipedia "clue" "Cluedo" "$BOARD_DIR"
download_from_wikipedia "chess" "Chess" "$BOARD_DIR"
download_from_wikipedia "checkers" "Checkers" "$BOARD_DIR"
download_from_wikipedia "connect-four" "Connect_Four" "$BOARD_DIR"
download_from_wikipedia "jenga" "Jenga" "$BOARD_DIR"
download_from_wikipedia "operation" "Operation_(game)" "$BOARD_DIR"
download_from_wikipedia "battleship" "Battleship_(game)" "$BOARD_DIR"
download_from_wikipedia "guess-who" "Guess_Who%3F" "$BOARD_DIR"
download_from_wikipedia "trivial-pursuit" "Trivial_Pursuit" "$BOARD_DIR"
download_from_wikipedia "sequence" "Sequence_(game)" "$BOARD_DIR"
download_from_wikipedia "sorry" "Sorry!_(game)" "$BOARD_DIR"
download_from_wikipedia "trouble" "Trouble_(board_game)" "$BOARD_DIR"

# Children's games
download_from_wikipedia "hi-ho-cherry-o" "Hi_Ho!_Cherry-O" "$BOARD_DIR"
download_from_wikipedia "mouse-trap" "Mouse_Trap_(board_game)" "$BOARD_DIR"

echo ""
echo "=========================================="
echo "  Download Complete!"
echo "=========================================="
echo ""
echo "Digital game images: $(find $DIGITAL_DIR -type f \( -name '*.jpg' -o -name '*.png' \) -size +10k 2>/dev/null | wc -l)"
echo "Board game images: $(find $BOARD_DIR -type f \( -name '*.jpg' -o -name '*.png' \) -size +5k 2>/dev/null | wc -l)"
echo ""
