#!/bin/bash

# Board game images download script using curl
# Uses BoardGameGeek itemrep URLs (246x300 thumbnails which are high enough quality)

BOARD_DIR="/home/halfgood/Desktop/boernespilguiden/public/images/games/board"
DIGITAL_DIR="/home/halfgood/Desktop/boernespilguiden/public/images/games/digital"

mkdir -p "$BOARD_DIR" "$DIGITAL_DIR"

echo "🎲 Downloading board game images..."

# Function to download image
download_image() {
    local slug="$1"
    local url="$2"
    local dir="$3"
    local ext="$4"
    local filepath="$dir/$slug.$ext"

    if [ -f "$filepath" ]; then
        echo "⏭ Exists: $slug"
        return 0
    fi

    echo "⬇ Downloading: $slug..."
    curl -L -s -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
         -H "Referer: https://boardgamegeek.com/" \
         -o "$filepath" "$url"

    if [ -f "$filepath" ] && [ $(stat -c%s "$filepath") -gt 1000 ]; then
        echo "  ✓ Success: $slug ($(du -h "$filepath" | cut -f1))"
        return 0
    else
        rm -f "$filepath"
        echo "  ✗ Failed: $slug"
        return 1
    fi
}

# Board games - BGG URLs (itemrep format for reliable downloads)
# Animal Upon Animal
download_image "animal-upon-animal" "https://cf.geekdo-images.com/5RHnNYBqmNXYvDtIeJw3pA__itemrep/img/xPYFpZOamVphr3P3sMet3Zu8EGI=/fit-in/246x300/filters:strip_icc()/pic403502.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Bluey Board Game
download_image "bluey-board-game" "https://cf.geekdo-images.com/nHw-3YYQ3b6oYh3X9HqCvw__itemrep/img/placeholder=/fit-in/246x300/filters:strip_icc()/pic5963908.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Bus Stop
download_image "bus-stop" "https://cf.geekdo-images.com/m2bxEEzGhKbTSPXlyPXq6w__itemrep/img/z9tNrwBxCHYjEZLV2dJGE6nKwc0=/fit-in/246x300/filters:strip_icc()/pic94284.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Castle Panic
download_image "castle-panic" "https://cf.geekdo-images.com/I-hJ-Vc7taYo2RPMVuOE9g__itemrep/img/qD2WXcj3eVaVN4vQhdBHGR_y2K4=/fit-in/246x300/filters:strip_icc()/pic753498.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Catan Junior
download_image "catan-junior" "https://cf.geekdo-images.com/t2L_dlodn04yyS7CmwnREQ__itemrep/img/QphSyFLAPYuyogVc2tmhzucw2h0=/fit-in/246x300/filters:strip_icc()/pic4741220.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Count Your Chickens
download_image "count-your-chickens" "https://cf.geekdo-images.com/ldVO4Au6YvPFrMk2h0V7rA__itemrep/img/vIQ7F6L4JlQR1PGy_L4b6YzxKvc=/fit-in/246x300/filters:strip_icc()/pic964069.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Feed the Woozle
download_image "feed-the-woozle" "https://cf.geekdo-images.com/tZSPjwJj1tRVxw9v42JXNw__itemrep/img/v2xNbW7sObmWNdVj-rRSoOY8rC8=/fit-in/246x300/filters:strip_icc()/pic1501872.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Go Away Monster
download_image "go-away-monster" "https://cf.geekdo-images.com/KnS6v1ZLpD4zCElng5i2Rw__itemrep/img/L2CkJDFVKs3O6fF_JEhM6wLbH4E=/fit-in/246x300/filters:strip_icc()/pic3048467.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# HABA First Orchard
download_image "haba-first-orchard" "https://cf.geekdo-images.com/8RKRha_bOXUtAXZ-lQdjsA__itemrep/img/9rqQei_-qHBPrxAQC37LzG1Ttx8=/fit-in/246x300/filters:strip_icc()/pic7811919.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Hoot Owl Hoot
download_image "hoot-owl-hoot" "https://cf.geekdo-images.com/WSJUJlQJ-YpdAijJ5NswAQ__itemrep/img/ib67T-XbsE5HfYq9Cy7lbJH1rEA=/fit-in/246x300/filters:strip_icc()/pic957777.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Monza
download_image "monza" "https://cf.geekdo-images.com/Avm_weldy7Gz0Haq4tLceQ__itemrep/img/t6nH6tQ1n2P3Bvl1mDqg3_3RBto=/fit-in/246x300/filters:strip_icc()/pic8894429.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# My First Carcassonne
download_image "my-first-carcassonne" "https://cf.geekdo-images.com/cj1OiLMQ1tXF1VfuNXqDdA__itemrep/img/x-yD-3F3bL9k3dVy4y2t9lT1QvY=/fit-in/246x300/filters:strip_icc()/pic5606668.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Outfoxed
download_image "outfoxed" "https://cf.geekdo-images.com/v0FCI-wY8YlPn39XKd3F8w__itemrep/img/KGnNOM0FA8nwFXtKFsamxkx5v2E=/fit-in/246x300/filters:strip_icc()/pic2401324.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Rhino Hero
download_image "rhino-hero" "https://cf.geekdo-images.com/UO37-aWZkmCl_Aj2M53OtA__itemrep/img/T8K5Y7bKUqIHj8yQ1Bny2FYpM3E=/fit-in/246x300/filters:strip_icc()/pic9267030.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Roll and Play
download_image "roll-and-play" "https://cf.geekdo-images.com/Isz36LR_IwR8LX_lQyaBrw__itemrep/img/V6G9K_rH-rGF7G_0Z3z3B-n3Y5U=/fit-in/246x300/filters:strip_icc()/pic2047447.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Sequence for Kids
download_image "sequence-for-kids" "https://cf.geekdo-images.com/k3DHTM6He726DhUqdlfWpQ__itemrep/img/zL1_3TfLW2kS7l8gqZBCKUPTphg=/fit-in/246x300/filters:strip_icc()/pic5828420.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Sleeping Queens
download_image "sleeping-queens" "https://cf.geekdo-images.com/hkJWvm7VJD4yqrbjCHmLFA__itemrep/img/fH8gKJMvBXVkM3lzP0bKV8-xjJk=/fit-in/246x300/filters:strip_icc()/pic2401336.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Sneaky Snacky Squirrel
download_image "sneaky-snacky-squirrel" "https://cf.geekdo-images.com/qvqjv4CjRL9RoX0aeHLX8g__itemrep/img/oOLRcfVW3C7J7hvhj5HrV3Bl7sI=/fit-in/246x300/filters:strip_icc()/pic2388611.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Spot It Jr Animals
download_image "spot-it-jr-animals" "https://cf.geekdo-images.com/rmKMQqyr5xuPaVE6l0Ny-Q__itemrep/img/yE_JVwybpZjQbNF3wTtI0GfLXm4=/fit-in/246x300/filters:strip_icc()/pic4681526.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Sushi Go
download_image "sushi-go" "https://cf.geekdo-images.com/Fn3PSPZVxa3YurlorITQ1Q__itemrep/img/eR7Z5VvQfGp0byHnYqOoMHfSUYY=/fit-in/246x300/filters:strip_icc()/pic1900075.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Ticket to Ride First Journey
download_image "ticket-to-ride-first-journey" "https://cf.geekdo-images.com/bGvfrC4pLxR-xkK_nN31DA__itemrep/img/6Q0QE-sWGMX_BEXrMvq4IHfJAFg=/fit-in/246x300/filters:strip_icc()/pic3116341.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Very Hungry Caterpillar Game
download_image "very-hungry-caterpillar-game" "https://cf.geekdo-images.com/1yTpgwzb3wZUyWv1ASi4RA__itemrep/img/R-zD0e3RB0dz8T3jJQ1cKR-pqCQ=/fit-in/246x300/filters:strip_icc()/pic178419.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Zingo
download_image "zingo" "https://cf.geekdo-images.com/T_b9KBR-89HCZyBtwi8n4Q__itemrep/img/yDpFJm0_9E8K-9wFf3xFsEdCeGQ=/fit-in/246x300/filters:strip_icc()/pic2047477.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Disney Hidden Realms - try Amazon product image
download_image "disney-hidden-realms" "https://m.media-amazon.com/images/I/91NjXJsLqGL._AC_SL1500_.jpg" "$BOARD_DIR" "jpg"
sleep 0.3

# Star Wars Super Teams - try Amazon product image
download_image "star-wars-super-teams" "https://m.media-amazon.com/images/I/81jqQP+r2YL._AC_SL1500_.jpg" "$BOARD_DIR" "jpg"

echo ""
echo "🎮 Downloading digital game images..."

# Candy Crush - from Wikipedia/official
download_image "candy-crush" "https://upload.wikimedia.org/wikipedia/en/d/d7/Candy_Crush_Saga_app_icon.png" "$DIGITAL_DIR" "png"

echo ""
echo "✅ Done!"
echo ""
echo "Checking results..."
echo "Board games with real images:"
ls -1 "$BOARD_DIR"/*.jpg 2>/dev/null | wc -l
echo "Digital games with real images:"
ls -1 "$DIGITAL_DIR"/*.jpg "$DIGITAL_DIR"/*.png 2>/dev/null | wc -l
