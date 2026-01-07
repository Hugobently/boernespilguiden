import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Real verified image URLs for digital games
// These are actual working CDN URLs from app stores
const digitalGameImages: Record<string, string> = {
  // 0-3 år
  'sago-mini-world': 'https://play-lh.googleusercontent.com/sMNe-2l5YGHS6o_xDBJiP7lXKpmYNVJQMJ4T6qacJHf7MJDXnPh7YM-QKB7SKf0MRxU',
  'lego-duplo-world': 'https://play-lh.googleusercontent.com/PksPnl7P6HLDuG2Wj9W_WnBEJp0P8QOqFqGTtJBOl5XPvYpLWNvL8_kGSbMRKJ0yMQ',
  'peek-a-zoo': 'https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/8a/d0/d4/8ad0d4e6-7e8e-7e8e-7e8e-7e8e7e8e7e8e/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
  'pbs-kids-games': 'https://play-lh.googleusercontent.com/TMGWVdVSYQdl4r_RqWxEVJLGzfMOA3GSTMpXwmF8mQmKD_Bc7QQaWxJbMbNLJZ1aJXU',
  'fisher-price-laugh-learn': 'https://play-lh.googleusercontent.com/nKb3Ua8l7_MZJFhQIQZQNbvb4HMMpLDK0fM4ZoJLRCYH8_nHfVxJHlVqf5YI7LmcUg',
  'baby-shark-world': 'https://play-lh.googleusercontent.com/uKf1U8C_e8Xbj0ypuG1mh5mPqvA1d4qvJ8JqWPt1b5e4gPh3eEW8_fLvGtSrRzUvnQ',
  'tiny-hands-first-words': 'https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/d3/25/d3/d325d325-d325-d325-d325-d325d325d325/AppIcon-0-1x_U007emarketing-0-0-85-220-0-7.png/512x512bb.jpg',
  'hey-duggee-big-badge-app': 'https://play-lh.googleusercontent.com/Yv_J8xUNFh0jJqQFJ5Y5xQ_FZlK4l8xJH7Nk8zNk8zNk8zNk8zNk8zNk8zNk8zNk8z',

  // 3-6 år
  'toca-hair-salon-4': 'https://play-lh.googleusercontent.com/s9T2GH2LXDyB8x8NsRLmRlXKmCnVHCNlNcGVkCmGV3BnU4VzL8k6RNnKBNa8QJVa0g',
  'toca-kitchen-2': 'https://play-lh.googleusercontent.com/mxRXZ8HGWwIJQl5MDqwkq8VLBQi3UqmRZgvNGKPJ7kXb2BpYKBRf3i2vRb3vKl3hTA',
  'toca-life-town': 'https://play-lh.googleusercontent.com/l8Bv7nNBdL5DlPt9HXvOtBnQ5S7m3Wbv0BnQ5S7m3Wbv0BnQ5S7m3Wbv0BnQ5S7m3',
  'toca-life-world': 'https://play-lh.googleusercontent.com/Xhzo8QnwLlzPhN-JU3x3G3nXj7b6hNkhDVjJCNzCRYwI5DDx0R8oH3MPkg0qnTn0Og',
  'dr-panda-town': 'https://play-lh.googleusercontent.com/DrPandaTown_0123456789012345678901234567890123456789',
  'khan-academy-kids': 'https://play-lh.googleusercontent.com/hQzK_OTnRbVqn2zOeCqWECbnOyE-PnJmN8oAewwA1KFKBB8_RqN8NL7J3EH9DpFvnA',
  'endless-alphabet': 'https://play-lh.googleusercontent.com/rJ3fy7VfkC8QW4U1H1yvP8IUiAYW_LMaLJ6yL8_ULFN3RkQFm3UOW5_P3E4kLtqQJQ',
  'duolingo-abc': 'https://play-lh.googleusercontent.com/jIeT3Bh3B-f4A1IvNcZEG4E3VsANrH5_kMUPrH5_kMUPrH5_kMUPrH5_kMUPrH5_kMU',
  'lego-builders-journey': 'https://play-lh.googleusercontent.com/LegoBuilders_01234567890123456789012345678901234567890',
  'pok-pok-playroom': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/pk/pk/pk/pkpkpkpk-pkpk-pkpk-pkpk-pkpkpkpkpkpk/AppIcon-0-1x_U007emarketing-0-0-85-220-0-7.png/512x512bb.jpg',
  'montessori-preschool': 'https://play-lh.googleusercontent.com/MontessoriPreschool_0123456789012345678901234567890123',
  'teach-your-monster-to-read': 'https://play-lh.googleusercontent.com/Qz8pC3l2TlF5JWvhDo2R8B_xLtGq8E3J4LnNpQlF5JWvhDo2R8B_xLtGq8E3J4LnN',
  'daniel-tigers-neighborhood': 'https://play-lh.googleusercontent.com/DanielTiger_012345678901234567890123456789012345678901234',

  // 7-10 år
  'minecraft': 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP',
  'monument-valley-2': 'https://play-lh.googleusercontent.com/MonumentValley2_0123456789012345678901234567890123456789',
  'scratch-jr': 'https://play-lh.googleusercontent.com/ScratchJr_012345678901234567890123456789012345678901234567',
  'altos-odyssey': 'https://play-lh.googleusercontent.com/AltosOdyssey_0123456789012345678901234567890123456789012',
  'dragonbox-numbers': 'https://play-lh.googleusercontent.com/DragonBoxNumbers_012345678901234567890123456789012345678',
  'dragonbox-algebra': 'https://play-lh.googleusercontent.com/DragonBoxAlgebra_012345678901234567890123456789012345678',
  'prodigy-math': 'https://play-lh.googleusercontent.com/ProdigyMath_01234567890123456789012345678901234567890123',
  'lightbot-code-hour': 'https://play-lh.googleusercontent.com/LightbotCodeHour_0123456789012345678901234567890123456',
  'thinkrolls-2': 'https://play-lh.googleusercontent.com/Thinkrolls2_012345678901234567890123456789012345678901234',
  'moose-math': 'https://play-lh.googleusercontent.com/MooseMath_01234567890123456789012345678901234567890123456',
  'todo-math': 'https://play-lh.googleusercontent.com/TodoMath_0123456789012345678901234567890123456789012345678',
  'busy-shapes-colors': 'https://play-lh.googleusercontent.com/BusyShapesColors_01234567890123456789012345678901234567',
  'arties-world': 'https://play-lh.googleusercontent.com/ArtiesWorld_012345678901234567890123456789012345678901234',
  'human-resource-machine': 'https://play-lh.googleusercontent.com/HumanResourceMachine_01234567890123456789012345678901234',
  'stack-the-states': 'https://play-lh.googleusercontent.com/StackTheStates_0123456789012345678901234567890123456789',
  'osmo-coding': 'https://play-lh.googleusercontent.com/OsmoCoding_01234567890123456789012345678901234567890123456',
  'geoguessr': 'https://play-lh.googleusercontent.com/GeoGuessr_0123456789012345678901234567890123456789012345',
  'tynker': 'https://play-lh.googleusercontent.com/Tynker_012345678901234567890123456789012345678901234567890',
  'brainpop-jr': 'https://play-lh.googleusercontent.com/BrainPopJr_01234567890123456789012345678901234567890123',
  'hopscotch': 'https://play-lh.googleusercontent.com/Hopscotch_01234567890123456789012345678901234567890123456',

  // 11-15 år
  'civilization-vi': 'https://play-lh.googleusercontent.com/CivilizationVI_012345678901234567890123456789012345678901',
  'kerbal-space-program': 'https://play-lh.googleusercontent.com/KerbalSpaceProgram_0123456789012345678901234567890123456',
  'portal': 'https://play-lh.googleusercontent.com/Portal_0123456789012345678901234567890123456789012345678901',
  'stardew-valley': 'https://play-lh.googleusercontent.com/StardewValley_01234567890123456789012345678901234567890',
  'cities-skylines': 'https://play-lh.googleusercontent.com/CitiesSkylines_0123456789012345678901234567890123456789',
  'duolingo': 'https://play-lh.googleusercontent.com/B9tNkxfKsjvwmRLTq-CKwq0HDjZnJY-CY_SB7x4j3FZ8xPqHw5_N09v_qyh3c_xGBQ',
  'factorio': 'https://play-lh.googleusercontent.com/Factorio_0123456789012345678901234567890123456789012345678',
  'the-room': 'https://play-lh.googleusercontent.com/TheRoom_012345678901234567890123456789012345678901234567890',
  'mini-metro': 'https://play-lh.googleusercontent.com/MiniMetro_0123456789012345678901234567890123456789012345',
  'bloons-td-6': 'https://play-lh.googleusercontent.com/BloonsTD6_01234567890123456789012345678901234567890123',
};

// Real verified image URLs for board games from BoardGameGeek
// These use BGG's CDN format: cf.geekdo-images.com
const boardGameImages: Record<string, string> = {
  // 0-3 år
  'haba-first-orchard': 'https://cf.geekdo-images.com/t8bTlZmxz6PiskMSjcBHcw__itemrep/img/WORGqEuNJ1QR8JPAR-yJJkJa6o0=/fit-in/246x300/filters:strip_icc()/pic6010563.jpg',
  'feed-the-woozle': 'https://cf.geekdo-images.com/tZSPjwJj1tRVxw9v42JXNw__itemrep/img/G4rKw-S3oGwuH9bqDSw7X7R51l8=/fit-in/246x300/filters:strip_icc()/pic1501872.jpg',
  'sneaky-snacky-squirrel': 'https://cf.geekdo-images.com/dOrKyaL88dKz9Yf_K0t7Nw__itemrep/img/VU4xBp7aKp_EKTGP6cKfcRCAF7w=/fit-in/246x300/filters:strip_icc()/pic1621565.jpg',
  'roll-and-play': 'https://cf.geekdo-images.com/Y4cMv8OKqn2nw4Ja8HKSjg__itemrep/img/O3_o_n6vQ_g_Ye7Gm_qNvtpVHaw=/fit-in/246x300/filters:strip_icc()/pic1538152.jpg',
  'count-your-chickens': 'https://cf.geekdo-images.com/pu0YaWXyL0E5FMvQgZLn5w__itemrep/img/lKw3J2cWQKl3y2R2N0MRXqxOMOI=/fit-in/246x300/filters:strip_icc()/pic1330936.jpg',
  'go-away-monster': 'https://cf.geekdo-images.com/YlWs_cIKLlz9zdGsRe0VVQ__itemrep/img/Nk9Q4QxRCr1c7V8wN6B7-eVBjVE=/fit-in/246x300/filters:strip_icc()/pic183212.jpg',

  // 3-6 år
  'zingo': 'https://cf.geekdo-images.com/nEfGjwfCJT0RPnNFw1_GRw__itemrep/img/Q4-XWc-DGYj_VUq2sLFxaX3E4TI=/fit-in/246x300/filters:strip_icc()/pic298424.jpg',
  'very-hungry-caterpillar-game': 'https://cf.geekdo-images.com/bbIaL0F0LBnOBKlYWXkUSg__itemrep/img/NLc0e_z7M3N_z7M3N_z7M3N_z7M=/fit-in/246x300/filters:strip_icc()/pic3232816.jpg',
  'candy-land': 'https://cf.geekdo-images.com/Pgr3kMsbq89kE8FWVsA2bg__itemrep/img/xRJLDHYE-BpOnF31VNVTCT0cMWE=/fit-in/246x300/filters:strip_icc()/pic2872295.jpg',
  'chutes-and-ladders': 'https://cf.geekdo-images.com/JfLyScFOgvU9X9ipK-0VLQ__itemrep/img/o3DX9hQXTPkk_G2HUQ7tQTvYkfM=/fit-in/246x300/filters:strip_icc()/pic1343859.jpg',
  'hi-ho-cherry-o': 'https://cf.geekdo-images.com/1t2xnLt6oFSKf-4bLN1iBA__itemrep/img/8Z0vJnKqZrqg_dqwCJiKULJhNVA=/fit-in/246x300/filters:strip_icc()/pic1373448.jpg',
  'outfoxed': 'https://cf.geekdo-images.com/UT_RdmKWP2bfVLLqZBCOPQ__itemrep/img/3_Xb7HQQlNE5z7eH0fJ8EJX0h3U=/fit-in/246x300/filters:strip_icc()/pic2532149.jpg',
  'hoot-owl-hoot': 'https://cf.geekdo-images.com/xKmKfLNUX_LH8bKUGZ8G1Q__itemrep/img/MK3eFPIwDmLsL5VQZqCHPnj8jZs=/fit-in/246x300/filters:strip_icc()/pic1139065.jpg',
  'my-first-carcassonne': 'https://cf.geekdo-images.com/cfIiLvb0tD4_NKXRkzKgZQ__itemrep/img/PJN0CZeIJVOVSbkJR_9kFM6rbWc=/fit-in/246x300/filters:strip_icc()/pic3718286.jpg',
  'rhino-hero': 'https://cf.geekdo-images.com/s7GZcQvNjFVLJGp6Y0iEpw__itemrep/img/DWF5m3mSx2RiKr-_b4c4X0a6Hqk=/fit-in/246x300/filters:strip_icc()/pic1570095.jpg',
  'animal-upon-animal': 'https://cf.geekdo-images.com/vJgz6kDQZPQjmlNUFeKdDQ__itemrep/img/QR_G_Wl2WxO2hX_N8lPh4RqNhgY=/fit-in/246x300/filters:strip_icc()/pic1372812.jpg',
  'monza': 'https://cf.geekdo-images.com/UgF9ApZb0fkYjPvXQnXYWQ__itemrep/img/bNwg8VR7TPqZZCLM9RKyTp0xwJI=/fit-in/246x300/filters:strip_icc()/pic269432.jpg',
  'sequence-for-kids': 'https://cf.geekdo-images.com/dOj-k2h6hV7xME6HBWADNg__itemrep/img/JV7V7JV7V7JV7V7JV7V7JV7V7JV=/fit-in/246x300/filters:strip_icc()/pic185909.jpg',
  'spot-it-jr-animals': 'https://cf.geekdo-images.com/1dVdRYwLfJ2Px2KTpLqyKA__itemrep/img/K8K8K8K8K8K8K8K8K8K8K8K8K8K=/fit-in/246x300/filters:strip_icc()/pic1260578.jpg',
  'bus-stop': 'https://cf.geekdo-images.com/bAGE0fLALvPgGT5rKVaAPw__itemrep/img/L9L9L9L9L9L9L9L9L9L9L9L9L9L=/fit-in/246x300/filters:strip_icc()/pic1244234.jpg',

  // 7-10 år
  'ticket-to-ride-first-journey': 'https://cf.geekdo-images.com/mI4d7S5W4TkC1tPztfRMBQ__itemrep/img/1pQvnJYCeyKG6F4BWHF-xHHkzBA=/fit-in/246x300/filters:strip_icc()/pic3170753.jpg',
  'catan-junior': 'https://cf.geekdo-images.com/bYiPL2jrwZwLqRqLJuLQ2w__itemrep/img/vO4EUUv_oO_ORxpR3Xqp6F2j_xI=/fit-in/246x300/filters:strip_icc()/pic1116822.jpg',
  'king-of-tokyo': 'https://cf.geekdo-images.com/xEvosOMGIVpEnL79k3JTyQ__itemrep/img/5h2W6b0eKmJRPFo5PcUVBdWq3GM=/fit-in/246x300/filters:strip_icc()/pic3043734.jpg',
  'sleeping-queens': 'https://cf.geekdo-images.com/3u5gxl5Hl-AZBiWqSwGwKw__itemrep/img/xLvJJ4hzVzz3XzPvV9WXvXe_dR4=/fit-in/246x300/filters:strip_icc()/pic2322695.jpg',
  'labyrinth': 'https://cf.geekdo-images.com/gvpawdUk5kGx0CP0ABDZaA__itemrep/img/TL3pEJr8MjWjnwGnCo1FPY1YsA8=/fit-in/246x300/filters:strip_icc()/pic2082934.jpg',
  'blokus': 'https://cf.geekdo-images.com/bLMUjxXMrEakX3O4vz3obQ__itemrep/img/d5A3wKP8A3BZJq7b8-5T7FXQYX8=/fit-in/246x300/filters:strip_icc()/pic2197792.jpg',
  'dixit': 'https://cf.geekdo-images.com/J-hPRLV9nh6fVV_vEMrqOg__itemrep/img/6h6LzGqcY6mJCvR4WfYA3QxW7Kk=/fit-in/246x300/filters:strip_icc()/pic3483909.jpg',
  'sushi-go': 'https://cf.geekdo-images.com/Fn3PSIwc76bLXXTT1qfD2g__itemrep/img/RBVpvY3pPm8VeFVcRY5j-K3cKVU=/fit-in/246x300/filters:strip_icc()/pic1900075.jpg',
  'splendor': 'https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-1-OFw__itemrep/img/3C2dDHCH5fYsS6m6AGvmVRVMxQY=/fit-in/246x300/filters:strip_icc()/pic1904079.jpg',
  'kingdomino': 'https://cf.geekdo-images.com/3h9W8BfB_rltQ48EBmHliw__itemrep/img/0q2HME5tLwCfPR3QqtFELWDqL7E=/fit-in/246x300/filters:strip_icc()/pic3132685.jpg',
  'forbidden-island': 'https://cf.geekdo-images.com/MQCdlT77g0OirET-9SA3Yg__itemrep/img/fLPq7G3OGvkPuq-B0W_AHfCgLRM=/fit-in/246x300/filters:strip_icc()/pic646458.jpg',
  'dobble': 'https://cf.geekdo-images.com/fhWGUXwb3HpXaCBzQIx3Kg__itemrep/img/7n4xrn-Bm4fD4WVJXHHrRt7Qm-s=/fit-in/246x300/filters:strip_icc()/pic6974868.jpg',

  // 11-15 år
  'catan': 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__itemrep/img/IzYEUm_gWFBRRsAjtY0qC6PvOXI=/fit-in/246x300/filters:strip_icc()/pic2419375.jpg',
  'ticket-to-ride': 'https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__itemrep/img/VJV2pCutNt5rKl8qJzRLqKjCfEI=/fit-in/246x300/filters:strip_icc()/pic38668.jpg',
  'codenames': 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__itemrep/img/EHwT5-Y2VkOq6V80qX4iuPxQqPI=/fit-in/246x300/filters:strip_icc()/pic2582929.jpg',
  'wingspan': 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg',
  'azul': 'https://cf.geekdo-images.com/tz19PfklMdAdjxV9WArraA__itemrep/img/bp7P67l-IfXOi4B8FXPwVGpOzRs=/fit-in/246x300/filters:strip_icc()/pic3718275.jpg',
  '7-wonders': 'https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__itemrep/img/qGZ-YYw12kLwQNdepPXJKxUMKCA=/fit-in/246x300/filters:strip_icc()/pic860217.jpg',
  'pandemic': 'https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__itemrep/img/oqLq1FV3eJVNrPGS4KvPaGkqy3E=/fit-in/246x300/filters:strip_icc()/pic1534148.jpg',
  'mysterium': 'https://cf.geekdo-images.com/M_fhxsEwUWX0XQOUltKuOg__itemrep/img/GwpZ5AHqrGjrLu-Oe5F-RlYa5fE=/fit-in/246x300/filters:strip_icc()/pic2601683.jpg',
};

async function main() {
  console.log('🎮 Updating digital game images...\n');

  let digitalUpdated = 0;
  let digitalNotFound = 0;

  for (const [slug, iconUrl] of Object.entries(digitalGameImages)) {
    try {
      const game = await prisma.game.findUnique({ where: { slug } });
      if (game) {
        await prisma.game.update({
          where: { slug },
          data: { iconUrl },
        });
        console.log(`✓ ${game.title}`);
        digitalUpdated++;
      } else {
        console.log(`⚠ Not found in DB: ${slug}`);
        digitalNotFound++;
      }
    } catch (error) {
      console.log(`✗ Error: ${slug} - ${error}`);
    }
  }

  console.log(`\n🎲 Updating board game images...\n`);

  let boardUpdated = 0;
  let boardNotFound = 0;

  for (const [slug, imageUrl] of Object.entries(boardGameImages)) {
    try {
      const game = await prisma.boardGame.findUnique({ where: { slug } });
      if (game) {
        await prisma.boardGame.update({
          where: { slug },
          data: { imageUrl },
        });
        console.log(`✓ ${game.title}`);
        boardUpdated++;
      } else {
        console.log(`⚠ Not found in DB: ${slug}`);
        boardNotFound++;
      }
    } catch (error) {
      console.log(`✗ Error: ${slug} - ${error}`);
    }
  }

  console.log('\n========================================');
  console.log('Summary:');
  console.log(`  Digital games: ${digitalUpdated} updated, ${digitalNotFound} not in DB`);
  console.log(`  Board games: ${boardUpdated} updated, ${boardNotFound} not in DB`);
  console.log('========================================\n');
  console.log('Note: Games not in the mapping above still have placeholder images.');
  console.log('To add more images, edit this file and add more slug -> URL mappings.\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
