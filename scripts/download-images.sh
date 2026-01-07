#!/bin/bash

# Download game images from Wikipedia Commons and other sources
cd /home/halfgood/Desktop/boernespilguiden

BOARD_DIR="public/images/games/board"
DIGITAL_DIR="public/images/games/digital"

mkdir -p "$BOARD_DIR" "$DIGITAL_DIR"

echo "=== Downloading Game Images ==="

# Function to download image
download_image() {
  local slug="$1"
  local url="$2"
  local dir="$3"
  local ext="jpg"

  if [[ "$url" == *".png"* ]]; then ext="png"; fi
  if [[ "$url" == *".svg"* ]]; then ext="svg"; fi
  local filepath="${dir}/${slug}.${ext}"

  # Check if we already have a good image
  local size=0
  if [ -f "$filepath" ]; then
    size=$(stat -c%s "$filepath" 2>/dev/null || stat -f%z "$filepath" 2>/dev/null || echo 0)
  fi

  if [ "$size" -gt 5000 ]; then
    echo "✓ $slug (exists - ${size} bytes)"
    return 0
  fi

  echo -n "Downloading $slug... "
  if curl -s -L --connect-timeout 10 --max-time 30 -o "$filepath" "$url"; then
    size=$(stat -c%s "$filepath" 2>/dev/null || stat -f%z "$filepath" 2>/dev/null || echo 0)
    if [ "$size" -gt 2000 ]; then
      echo "✓ (${size} bytes)"
      return 0
    else
      echo "✗ (too small: ${size} bytes)"
      rm -f "$filepath"
      return 1
    fi
  else
    echo "✗ (curl failed)"
    rm -f "$filepath"
    return 1
  fi
}

echo ""
echo "=== Board Games ==="

# Board games - Wikipedia URLs
download_image "catan" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Catan-2015-boxart.jpg/220px-Catan-2015-boxart.jpg" "$BOARD_DIR"
download_image "wingspan" "https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Wingspan_board_game_cover_art.png/220px-Wingspan_board_game_cover_art.png" "$BOARD_DIR"
download_image "pandemic" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Pandemic_game_box.jpg/220px-Pandemic_game_box.jpg" "$BOARD_DIR"
download_image "ticket-to-ride" "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Ticket_to_Ride_Board_Game_Box_EN.jpg/220px-Ticket_to_Ride_Board_Game_Box_EN.jpg" "$BOARD_DIR"
download_image "codenames" "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Codenames_board_game_cover.jpg/220px-Codenames_board_game_cover.jpg" "$BOARD_DIR"
download_image "azul" "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Azul_board_game_cover.jpg/220px-Azul_board_game_cover.jpg" "$BOARD_DIR"
download_image "7-wonders" "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/7_Wonders_board_game_cover.jpg/220px-7_Wonders_board_game_cover.jpg" "$BOARD_DIR"
download_image "splendor" "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Splendor_board_game_box.jpg/220px-Splendor_board_game_box.jpg" "$BOARD_DIR"
download_image "dixit" "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Dixit_board_game_box.jpg/220px-Dixit_board_game_box.jpg" "$BOARD_DIR"
download_image "kingdomino" "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Kingdomino_board_game_box.jpg/220px-Kingdomino_board_game_box.jpg" "$BOARD_DIR"
download_image "king-of-tokyo" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/King_of_Tokyo_components.png/220px-King_of_Tokyo_components.png" "$BOARD_DIR"
download_image "mysterium" "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Mysterium_board_game_cover.jpg/220px-Mysterium_board_game_cover.jpg" "$BOARD_DIR"
download_image "carcassonne" "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Carcassonne-game.jpg/220px-Carcassonne-game.jpg" "$BOARD_DIR"
download_image "dominion" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Dominion_game_cover.jpg/220px-Dominion_game_cover.jpg" "$BOARD_DIR"
download_image "scrabble" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Scrabble_logo.svg/300px-Scrabble_logo.svg.png" "$BOARD_DIR"
download_image "monopoly" "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Monopoly_pack_logo.png/220px-Monopoly_pack_logo.png" "$BOARD_DIR"
download_image "uno" "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/UNO_Logo.svg/300px-UNO_Logo.svg.png" "$BOARD_DIR"
download_image "connect-four" "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Connect_Four.jpg/220px-Connect_Four.jpg" "$BOARD_DIR"
download_image "jenga" "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jenga.JPG/220px-Jenga.JPG" "$BOARD_DIR"
download_image "chess" "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Chess_board_opening_staunton.jpg/220px-Chess_board_opening_staunton.jpg" "$BOARD_DIR"
download_image "checkers" "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Draughts.jpg/220px-Draughts.jpg" "$BOARD_DIR"
download_image "sorry" "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Sorry_game_by_Hasbro.jpg/220px-Sorry_game_by_Hasbro.jpg" "$BOARD_DIR"
download_image "clue" "https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Cluedo_logo.svg/220px-Cluedo_logo.svg.png" "$BOARD_DIR"
download_image "risk" "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Risk_logo.svg/300px-Risk_logo.svg.png" "$BOARD_DIR"
download_image "trivial-pursuit" "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Trivial_Pursuit_Logo.svg/220px-Trivial_Pursuit_Logo.svg.png" "$BOARD_DIR"
download_image "blokus" "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Blokus_board_game.jpg/220px-Blokus_board_game.jpg" "$BOARD_DIR"
download_image "labyrinth" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/TheaMAZEingLabyrinth.jpg/220px-TheaMAZEingLabyrinth.jpg" "$BOARD_DIR"
download_image "sequence" "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Sequence_%28card_game%29.jpg/220px-Sequence_%28card_game%29.jpg" "$BOARD_DIR"
download_image "sushi-go" "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Sushi_go_box_art.png/220px-Sushi_go_box_art.png" "$BOARD_DIR"
download_image "forbidden-island" "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Forbidden_Island_board_game_box.jpg/220px-Forbidden_Island_board_game_box.jpg" "$BOARD_DIR"
download_image "dobble" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Spot_it%21_%28card_game%29_cover.jpg/220px-Spot_it%21_%28card_game%29_cover.jpg" "$BOARD_DIR"
download_image "candy-land" "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Candy_land_cover.jpg/220px-Candy_land_cover.jpg" "$BOARD_DIR"
download_image "chutes-and-ladders" "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Chutes-and-ladders.jpg/220px-Chutes-and-ladders.jpg" "$BOARD_DIR"
download_image "operation" "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Operation_game_box.jpg/220px-Operation_game_box.jpg" "$BOARD_DIR"
download_image "trouble" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Pop-O-Matic_Trouble_Game.jpg/220px-Pop-O-Matic_Trouble_Game.jpg" "$BOARD_DIR"
download_image "guess-who" "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Guess_Who.png/220px-Guess_Who.png" "$BOARD_DIR"
download_image "battleship" "https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Battleship_game.jpg/220px-Battleship_game.jpg" "$BOARD_DIR"
download_image "mouse-trap" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Mouse_Trap_Board_and_Box.jpg/220px-Mouse_Trap_Board_and_Box.jpg" "$BOARD_DIR"
download_image "hi-ho-cherry-o" "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Hi_Ho%21_Cherry-O_game_logo.jpg/220px-Hi_Ho%21_Cherry-O_game_logo.jpg" "$BOARD_DIR"

# New board games 2025
download_image "gardlings" "https://cf.geekdo-images.com/GU3vNH-lXtXD7sUoQTr2Mg__original/img/default-board.png" "$BOARD_DIR"
download_image "quacks-of-quedlinburg" "https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Quacks_cover_art.jpg/220px-Quacks_cover_art.jpg" "$BOARD_DIR"
download_image "haba-first-orchard" "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/First_Orchard_%28HABA%29.jpg/220px-First_Orchard_%28HABA%29.jpg" "$BOARD_DIR"
download_image "outfoxed" "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Outfoxed_board_game.jpg/220px-Outfoxed_board_game.jpg" "$BOARD_DIR"
download_image "rhino-hero" "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Rhino_Hero_board_game.jpg/220px-Rhino_Hero_board_game.jpg" "$BOARD_DIR"
download_image "sleeping-queens" "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Sleeping_Queens_Game.jpg/220px-Sleeping_Queens_Game.jpg" "$BOARD_DIR"
download_image "catan-junior" "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Catan_Junior_box.jpg/220px-Catan_Junior_box.jpg" "$BOARD_DIR"
download_image "ticket-to-ride-first-journey" "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Ticket_to_Ride_First_Journey.jpg/220px-Ticket_to_Ride_First_Journey.jpg" "$BOARD_DIR"
download_image "animal-upon-animal" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Animal_Upon_Animal.jpg/220px-Animal_Upon_Animal.jpg" "$BOARD_DIR"
download_image "castle-panic" "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Castle_Panic_board_game.jpg/220px-Castle_Panic_board_game.jpg" "$BOARD_DIR"

echo ""
echo "=== Digital Games ==="

# Digital games - Wikipedia URLs
download_image "minecraft" "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Minecraft_cover.png/220px-Minecraft_cover.png" "$DIGITAL_DIR"
download_image "roblox" "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/220px-Roblox_player_icon_black.svg.png" "$DIGITAL_DIR"
download_image "fortnite" "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Fortnite_%28Chapter_2%29_logo.svg/220px-Fortnite_%28Chapter_2%29_logo.svg.png" "$DIGITAL_DIR"
download_image "among-us" "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Among_Us_cover_art.jpg/220px-Among_Us_cover_art.jpg" "$DIGITAL_DIR"
download_image "duolingo" "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Duolingo_logo.svg/220px-Duolingo_logo.svg.png" "$DIGITAL_DIR"
download_image "khan-academy-kids" "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Khan_Academy_Kids_Logo.png/220px-Khan_Academy_Kids_Logo.png" "$DIGITAL_DIR"
download_image "scratch" "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Scratch_cat.svg/220px-Scratch_cat.svg.png" "$DIGITAL_DIR"
download_image "mario-kart" "https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Mario_Kart_8_Deluxe.jpg/220px-Mario_Kart_8_Deluxe.jpg" "$DIGITAL_DIR"
download_image "animal-crossing" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Animal_Crossing_New_Horizons.jpg/220px-Animal_Crossing_New_Horizons.jpg" "$DIGITAL_DIR"
download_image "pokemon-go" "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Pok%C3%A9mon_GO_logo.svg/220px-Pok%C3%A9mon_GO_logo.svg.png" "$DIGITAL_DIR"
download_image "lego-games" "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/220px-LEGO_logo.svg.png" "$DIGITAL_DIR"
download_image "pbs-kids" "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/PBS_Kids_Logo.svg/220px-PBS_Kids_Logo.svg.png" "$DIGITAL_DIR"
download_image "toca-boca" "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Toca_Boca_logo.svg/220px-Toca_Boca_logo.svg.png" "$DIGITAL_DIR"
download_image "sago-mini" "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Sago_Mini_Logo.png/220px-Sago_Mini_Logo.png" "$DIGITAL_DIR"
download_image "endless-alphabet" "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Endless_Alphabet_icon.png/220px-Endless_Alphabet_icon.png" "$DIGITAL_DIR"
download_image "thinkrolls" "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Thinkrolls_app_icon.png/220px-Thinkrolls_app_icon.png" "$DIGITAL_DIR"
download_image "dr-panda" "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dr._Panda_logo.png/220px-Dr._Panda_logo.png" "$DIGITAL_DIR"
download_image "geoguessr" "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/GeoGuessr_logo.svg/220px-GeoGuessr_logo.svg.png" "$DIGITAL_DIR"
download_image "kahoot" "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Kahoot%21_logo.svg/220px-Kahoot%21_logo.svg.png" "$DIGITAL_DIR"
download_image "prodigy-math" "https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Prodigy_Game_Logo.png/220px-Prodigy_Game_Logo.png" "$DIGITAL_DIR"
download_image "tetris" "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Emojione_1F579.svg/220px-Emojione_1F579.svg.png" "$DIGITAL_DIR"
download_image "angry-birds" "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Angry_Birds_promotional_art.png/220px-Angry_Birds_promotional_art.png" "$DIGITAL_DIR"
download_image "plants-vs-zombies" "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/PlantsVsZombiesCover.jpg/220px-PlantsVsZombiesCover.jpg" "$DIGITAL_DIR"
download_image "cut-the-rope" "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Cut_the_Rope_icon.png/220px-Cut_the_Rope_icon.png" "$DIGITAL_DIR"
download_image "candy-crush" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Candy_Crush_Saga_application_logo.svg/220px-Candy_Crush_Saga_application_logo.svg.png" "$DIGITAL_DIR"
download_image "fruit-ninja" "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Fruit_Ninja_Logo.jpg/220px-Fruit_Ninja_Logo.jpg" "$DIGITAL_DIR"
download_image "temple-run" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Temple_run_icon.png/220px-Temple_run_icon.png" "$DIGITAL_DIR"
download_image "subway-surfers" "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Subway_surfers_ios_logo.png/220px-Subway_surfers_ios_logo.png" "$DIGITAL_DIR"
download_image "terraria" "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Terraria_Steam_artwork.jpg/220px-Terraria_Steam_artwork.jpg" "$DIGITAL_DIR"
download_image "stardew-valley" "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Logo_of_Stardew_Valley.png/220px-Logo_of_Stardew_Valley.png" "$DIGITAL_DIR"
download_image "human-fall-flat" "https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Human_Fall_Flat_cover.png/220px-Human_Fall_Flat_cover.png" "$DIGITAL_DIR"
download_image "fall-guys" "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Fall_Guys_cover.jpg/220px-Fall_Guys_cover.jpg" "$DIGITAL_DIR"
download_image "rocket-league" "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/220px-Rocket_League_coverart.jpg" "$DIGITAL_DIR"
download_image "overcooked" "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Overcooked_cover.jpg/220px-Overcooked_cover.jpg" "$DIGITAL_DIR"
download_image "super-mario-bros" "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/NES_Super_Mario_Bros.png/220px-NES_Super_Mario_Bros.png" "$DIGITAL_DIR"
download_image "zelda" "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg/220px-The_Legend_of_Zelda_Breath_of_the_Wild.jpg" "$DIGITAL_DIR"
download_image "super-smash-bros" "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Super_Smash_Bros._Ultimate.jpg/220px-Super_Smash_Bros._Ultimate.jpg" "$DIGITAL_DIR"
download_image "kirby" "https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Kirby_and_the_Forgotten_Land_box_art.jpg/220px-Kirby_and_the_Forgotten_Land_box_art.jpg" "$DIGITAL_DIR"
download_image "splatoon" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Splatoon_3_box_art.jpg/220px-Splatoon_3_box_art.jpg" "$DIGITAL_DIR"
download_image "luigis-mansion" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Luigi%27s_Mansion_3_cover_art.jpg/220px-Luigi%27s_Mansion_3_cover_art.jpg" "$DIGITAL_DIR"
download_image "pokémon-sword" "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Pok%C3%A9mon_Sword_logo.png/220px-Pok%C3%A9mon_Sword_logo.png" "$DIGITAL_DIR"
download_image "just-dance" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/Just_Dance_2024_cover.jpg/220px-Just_Dance_2024_cover.jpg" "$DIGITAL_DIR"
download_image "lego-star-wars" "https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Lego_Star_Wars_The_Skywalker_Saga_cover.jpg/220px-Lego_Star_Wars_The_Skywalker_Saga_cover.jpg" "$DIGITAL_DIR"
download_image "lego-marvel" "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Lego_Marvel_Super_Heroes_box_art.jpg/220px-Lego_Marvel_Super_Heroes_box_art.jpg" "$DIGITAL_DIR"
download_image "crash-bandicoot" "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Crash_Bandicoot_N._Sane_Trilogy_cover_art.jpg/220px-Crash_Bandicoot_N._Sane_Trilogy_cover_art.jpg" "$DIGITAL_DIR"
download_image "spyro" "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Spyro_Reignited_Trilogy.jpg/220px-Spyro_Reignited_Trilogy.jpg" "$DIGITAL_DIR"
download_image "rayman" "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Rayman_Legends_Box_Art.jpg/220px-Rayman_Legends_Box_Art.jpg" "$DIGITAL_DIR"
download_image "little-big-planet" "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Littlebigplanet_coverart.jpg/220px-Littlebigplanet_coverart.jpg" "$DIGITAL_DIR"
download_image "sackboy" "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Sackboy_A_Big_Adventure_cover.jpg/220px-Sackboy_A_Big_Adventure_cover.jpg" "$DIGITAL_DIR"
download_image "knack" "https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Knack_cover.jpg/220px-Knack_cover.jpg" "$DIGITAL_DIR"
download_image "ratchet-clank" "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Ratchet_and_Clank_Rift_Apart_cover_art.jpg/220px-Ratchet_and_Clank_Rift_Apart_cover_art.jpg" "$DIGITAL_DIR"
download_image "astro-bot" "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Astro_Bot_Rescue_Mission_box_art.jpg/220px-Astro_Bot_Rescue_Mission_box_art.jpg" "$DIGITAL_DIR"
download_image "unravel" "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Unravel_video_game_cover.jpg/220px-Unravel_video_game_cover.jpg" "$DIGITAL_DIR"
download_image "ori" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b2/Ori_and_the_Blind_Forest_artwork.jpg/220px-Ori_and_the_Blind_Forest_artwork.jpg" "$DIGITAL_DIR"
download_image "hollow-knight" "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Hollow_Knight_cover.jpg/220px-Hollow_Knight_cover.jpg" "$DIGITAL_DIR"
download_image "celeste" "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Celeste_box_art_full.png/220px-Celeste_box_art_full.png" "$DIGITAL_DIR"
download_image "cuphead" "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Cuphead_artwork.jpg/220px-Cuphead_artwork.jpg" "$DIGITAL_DIR"
download_image "undertale" "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Undertale_cover.jpg/220px-Undertale_cover.jpg" "$DIGITAL_DIR"
download_image "deltarune" "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Deltarune_Chapter_2_cover_art.jpg/220px-Deltarune_Chapter_2_cover_art.jpg" "$DIGITAL_DIR"
download_image "omori" "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Omori_game_cover.jpg/220px-Omori_game_cover.jpg" "$DIGITAL_DIR"

# New digital games 2025
download_image "bluey-lets-play" "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Bluey_%28TV_series%29.png/220px-Bluey_%28TV_series%29.png" "$DIGITAL_DIR"
download_image "paw-patrol-rescue-world" "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/PAW_Patrol_logo.svg/220px-PAW_Patrol_logo.svg.png" "$DIGITAL_DIR"
download_image "peppa-pig-world-adventures" "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Peppa_Pig_character.png/220px-Peppa_Pig_character.png" "$DIGITAL_DIR"
download_image "peekaboo-barn" "https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/Peekaboo_Barn_icon.png/220px-Peekaboo_Barn_icon.png" "$DIGITAL_DIR"
download_image "scratchjr" "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/ScratchJr_Logo.png/220px-ScratchJr_Logo.png" "$DIGITAL_DIR"
download_image "kodable" "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Kodable_logo.png/220px-Kodable_logo.png" "$DIGITAL_DIR"
download_image "lingokids" "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Lingokids_logo.png/220px-Lingokids_logo.png" "$DIGITAL_DIR"
download_image "minecraft-education" "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Minecraft_Education_Logo.svg/220px-Minecraft_Education_Logo.svg.png" "$DIGITAL_DIR"
download_image "bluey-the-videogame" "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Bluey_%28TV_series%29.png/220px-Bluey_%28TV_series%29.png" "$DIGITAL_DIR"

echo ""
echo "=== Summary ==="
echo "Valid board game images: $(find $BOARD_DIR -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.svg' \) -size +2k | wc -l)"
echo "Valid digital game images: $(find $DIGITAL_DIR -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.svg' \) -size +2k | wc -l)"

echo ""
echo "Done!"
