import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// TRANSLATION INTERFACES
// ============================================================================

interface GameTranslationData {
  title: string;
  shortDescription: string;
  description: string;
  pros: string[];
  cons: string[];
  parentTip?: string;
}

// ============================================================================
// ENGLISH TRANSLATIONS - ALL 60 DIGITAL GAMES
// ============================================================================

const digitalGameTranslationsEN: Record<string, GameTranslationData> = {
  // 0-3 YEARS
  'sago-mini-world': {
    title: 'Sago Mini World',
    shortDescription: 'Collection of 40+ award-winning games for the youngest ones',
    description: 'Sago Mini World is a fantastic collection of over 40 award-winning Sago Mini games in one app. Children can explore different worlds, from a cozy home to a busy city, and meet cute characters along the way. Each activity is designed to promote creativity, curiosity, and independent play without frustration or competition.',
    pros: ['No ads at all', 'Works offline', '40+ games in one app', 'Safe for young children'],
    cons: ['Requires subscription after trial period', 'Can become expensive over time'],
    parentTip: 'Perfect for long car trips - download content at home so it works without internet.',
  },
  'lego-duplo-world': {
    title: 'LEGO DUPLO World',
    shortDescription: 'Digital DUPLO bricks for the youngest ones',
    description: 'LEGO DUPLO World lets the youngest build and play with digital DUPLO bricks. The game contains interactive adventures with trains, animals and buildings, and children can explore at their own pace. Everything is designed for small fingers with large, colorful buttons and no text.',
    pros: ['No ads', 'Works offline', 'Promotes creativity', 'Well-known and beloved brand'],
    cons: ['In-app purchases for extra content', 'Limited free content'],
    parentTip: 'Start with free content and see if your child likes it before buying add-ons.',
  },
  'peek-a-zoo': {
    title: 'Peek-a-Zoo',
    shortDescription: 'Learn about animals and emotions through play',
    description: 'Peek-a-Zoo is a simple and cute game where children learn about animals and emotions. Through interactive animations, children learn to recognize different animals and understand feelings like happy, sad, and surprised. The game is designed by development specialists and is completely distraction-free.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Pedagogically designed'],
    cons: ['iOS only', 'Limited content'],
    parentTip: 'Perfect as a first app for the youngest - completely safe and without temptations.',
  },
  'pbs-kids-games': {
    title: 'PBS Kids Games',
    shortDescription: 'Free learning games from the PBS universe',
    description: 'PBS Kids Games gathers hundreds of free learning games based on popular PBS series like Curious George, Daniel Tiger and Wild Kratts. The game is regularly updated with new content and is developed in collaboration with educators to ensure age-appropriate challenges.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Regular new content'],
    cons: ['Requires internet', 'Primarily in English'],
    parentTip: 'One of the best completely free apps - supported by public service, so no commercial interests.',
  },
  'fisher-price-laugh-learn': {
    title: 'Fisher-Price: Laugh & Learn',
    shortDescription: 'Learning through singing and play for babies',
    description: 'Fisher-Price Laugh & Learn is designed for babies and toddlers with colorful animations, music and simple interactions. The game teaches letters, numbers, colors and shapes through song and play. Everything is designed to be safe even for the smallest fingers.',
    pros: ['No ads', 'Works offline', 'Designed for babies', 'Well-known brand'],
    cons: ['In-app purchases for extra content', 'May seem simple for older children'],
    parentTip: 'Good for short sessions - set a timer so screen time does not run away.',
  },
  'toca-hair-salon-4': {
    title: 'Toca Hair Salon 4',
    shortDescription: 'Creative hairdressing play without limits',
    description: 'In Toca Hair Salon 4, children can play hairdresser with creative tools like scissors, curling irons, dyes and much more. The game encourages creativity and imagination without rules or goals - just pure creative play. The characters react amusingly to the different hairstyles.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Unlimited creativity'],
    cons: ['One-time price', 'Can become repetitive over time'],
    parentTip: 'Toca Boca games are known for being completely safe - buy once and be secure.',
  },
  'toca-kitchen-2': {
    title: 'Toca Kitchen 2',
    shortDescription: 'Crazy and creative cooking for children',
    description: 'Toca Kitchen 2 lets children experiment with cooking in fun and wacky ways. Chop, bake, boil or blend ingredients - and see the guests\' reactions when they taste the food. There are no rules, so children can make the craziest creations they can imagine.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Fun and wacky'],
    cons: ['One-time price', 'Limited number of ingredients'],
    parentTip: 'Let the children experiment freely - there are no wrong answers in Toca Kitchen!',
  },
  'toca-life-town': {
    title: 'Toca Life: Town',
    shortDescription: 'Digital dollhouse with endless possibilities',
    description: 'Toca Life: Town is a digital dollhouse where children can create their own stories. Explore apartments, a restaurant, a police station and more. Move characters around, interact with objects, and make your own adventures. The game encourages creative storytelling.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Promotes imagination'],
    cons: ['One-time price', 'Older Toca Life game'],
    parentTip: 'Consider Toca Life World instead - it combines all Toca Life worlds in one game.',
  },
  'baby-shark-world': {
    title: 'Baby Shark World',
    shortDescription: 'Baby Shark adventure with songs and games',
    description: 'Baby Shark World brings the popular Baby Shark family to life with interactive games, songs and activities. Children can sing along, play hide and seek, and explore the ocean world. Perfect for fans of the Baby Shark song.',
    pros: ['Known from YouTube', 'Catchy music', 'Children love it'],
    cons: ['Contains ads', 'In-app purchases', 'Requires internet'],
    parentTip: 'Consider subscription to remove ads - or set airplane mode for shorter sessions.',
  },
  'tiny-hands-first-words': {
    title: 'Tiny Hands: First Words',
    shortDescription: 'Learn first words with interactive flashcards',
    description: 'Tiny Hands: First Words is designed to help the youngest learn their first words. With over 100 interactive cards, children learn words for animals, food, toys and much more. Each flashcard has clear pronunciation and charming illustrations.',
    pros: ['No ads', 'Works offline', 'Simple design for babies'],
    cons: ['In-app purchases for full version', 'Limited free content'],
    parentTip: 'Good app for language development - use it together with your child and repeat the words.',
  },
  'hey-duggee-big-badge-app': {
    title: 'Hey Duggee: The Big Badge App',
    shortDescription: 'Earn badges with Duggee and Squirrel Club',
    description: 'The Hey Duggee app brings the beloved CBeebies series to life with over 50 activities and games. Children can earn badges just like in the TV series by solving tasks, exploring and learning. Everything is designed with BBC\'s quality standards.',
    pros: ['No ads', 'Works offline', 'BBC quality', 'Popular character'],
    cons: ['In-app purchases for extra badges', 'Primarily in English'],
    parentTip: 'The free version has plenty of content - try it before buying add-ons.',
  },
  // 3-6 YEARS
  'khan-academy-kids': {
    title: 'Khan Academy Kids',
    shortDescription: '100% free learning without ads or purchases',
    description: 'Khan Academy Kids is one of the best free learning apps for children. It contains thousands of activities in reading, math, social-emotional learning and much more. Everything is 100% free, without ads and without in-app purchases. The app automatically adapts to the child\'s level.',
    pros: ['Completely free - no hidden costs', 'No ads', 'No in-app purchases', 'Works offline', 'Adapts to child\'s level', 'Non-profit organization'],
    cons: ['Primarily in English', 'Can seem overwhelming with so much content'],
    parentTip: 'HIGHLY RECOMMENDED! This is the gold standard for free children\'s apps. Download all content at home for offline use.',
  },
  'endless-alphabet': {
    title: 'Endless Alphabet',
    shortDescription: 'Learn the alphabet with fun monster animations',
    description: 'Endless Alphabet makes learning the alphabet and new words fun. Interactive puzzles with animated letters help children learn letter sounds and word meanings. Each word comes to life with funny animations that explain the meaning.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Award-winning design'],
    cons: ['One-time price is a bit high', 'Only in English'],
    parentTip: 'Invest in this one - it\'s worth every penny and will be used again and again.',
  },
  'duolingo-abc': {
    title: 'Duolingo ABC',
    shortDescription: 'Learn to read with the Duolingo method',
    description: 'From the creators of Duolingo comes Duolingo ABC, designed to teach children to read. With over 700 short lessons, children learn letters, phonics and reading skills. The app is completely free and uses the same engaging approach as Duolingo\'s language app.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Well-designed learning path'],
    cons: ['Requires internet', 'Only in English'],
    parentTip: 'Fantastic supplement for learning to read - use it together with physical books.',
  },
  'dr-panda-town': {
    title: 'Dr. Panda Town',
    shortDescription: 'Explore and play in Dr. Panda\'s town',
    description: 'Dr. Panda Town is an open play world where children can explore an entire city. Visit the supermarket, police station, fire station and much more. Interact with characters and objects to create your own stories. Perfect for creative role-playing.',
    pros: ['No ads', 'Works offline', 'Many activities', 'Well-known character'],
    cons: ['In-app purchases for extra areas', 'Can tempt into purchases'],
    parentTip: 'Disable in-app purchases in device settings to avoid accidental purchases.',
  },
  'toca-life-world': {
    title: 'Toca Life World',
    shortDescription: 'Create your own stories in an endless play world',
    description: 'Toca Life World is the ultimate digital play world that combines all Toca Life locations in one game. Children can create their own stories across 8 free locations with over 50 characters. Buy more locations or use Toca Life subscription for access to everything.',
    pros: ['No ads', 'Works offline', 'Endless creativity', 'Combines all Toca Life games'],
    cons: ['Many in-app purchases', 'Can be expensive to buy everything', 'Subscription can add up'],
    parentTip: 'Start with the free locations - there is plenty to play with before you need to buy more.',
  },
  'lego-builders-journey': {
    title: 'LEGO Builder\'s Journey',
    shortDescription: 'Poetic puzzle with authentic LEGO feel',
    description: 'LEGO Builder\'s Journey is a beautiful puzzle where you build with LEGO bricks to solve challenges. The game tells a touching story about a father and son through creative building. Graphically fantastic with realistic LEGO bricks.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Beautiful graphics', 'Touching story'],
    cons: ['One-time price', 'Short playtime', 'May be too difficult for the youngest'],
    parentTip: 'Play together with your child - it\'s an experience you can share.',
  },
  'pok-pok-playroom': {
    title: 'Pok Pok Playroom',
    shortDescription: 'Open digital play designed by educators',
    description: 'Pok Pok Playroom is designed by educators and offers open play activities without goals or points. Children can draw, build, sort and experiment at their own pace. Everything is created to promote creativity and independent exploration.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Pedagogically designed', 'No screens with violence'],
    cons: ['iOS only', 'Requires subscription', 'No free version'],
    parentTip: 'Try the free trial period - this app is often recommended by child psychologists.',
  },
  'montessori-preschool': {
    title: 'Montessori Preschool',
    shortDescription: 'Montessori learning with 850+ activities',
    description: 'Montessori Preschool is based on the recognized Montessori method and offers over 850 activities in reading, math, art, music and practical skills. The app follows the child\'s progress and adapts activities to their level.',
    pros: ['No ads', 'Works offline', 'Authentic Montessori method', 'Comprehensive curriculum'],
    cons: ['Requires subscription', 'Can be expensive over time'],
    parentTip: 'Fantastic for homeschooling or as a supplement to kindergarten.',
  },
  'teach-your-monster-to-read': {
    title: 'Teach Your Monster to Read',
    shortDescription: 'Award-winning reading game used in schools',
    description: 'Teach Your Monster to Read is an award-winning game that helps children learn to read. Through three adventurous worlds, children learn letters, sounds and whole words. Developed in collaboration with reading researchers and used in thousands of schools.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Used in schools', 'Free on web'],
    cons: ['Primarily in English', 'Can be difficult for Danish speakers'],
    parentTip: 'Free to play on their website - perfect for trying before buying the app.',
  },
  'thinkrolls-2': {
    title: 'Thinkrolls 2',
    shortDescription: 'Logic puzzle that teaches physics and thinking',
    description: 'Thinkrolls 2 is a logic puzzle with 235 levels that teach physics and logic. Children roll cute characters through maze-like courses and must think creatively to progress. Progressively harder with concepts like gravity, electricity and chemistry.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', '235 levels', 'Teaches physics'],
    cons: ['One-time price', 'Can become too difficult for the youngest'],
    parentTip: 'Start on easy difficulty and let the child find their own way - they learn most by experimenting.',
  },
  'moose-math': {
    title: 'Moose Math',
    shortDescription: 'Fun math with Moose and friends',
    description: 'Moose Math from Duck Duck Moose teaches basic math through five activities in Pet Bingo, Moose Juice and more. Children learn to count, add, subtract and recognize geometric shapes through engaging games.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Works offline'],
    cons: ['Older app', 'Limited content'],
    parentTip: 'From the same team as Khan Academy Kids - quality you can trust.',
  },
  'todo-math': {
    title: 'Todo Math',
    shortDescription: 'Daily math adapted to your child\'s level',
    description: 'Todo Math offers daily math exercises adapted to the child\'s level. With over 700 activities, it covers everything from counting to multiplication. The app keeps track of progress and motivates with rewards and daily goals.',
    pros: ['No ads', 'Works offline', 'Adapts to level', 'Daily goals'],
    cons: ['In-app purchases for full access', 'Subscription can be expensive'],
    parentTip: 'Good as a daily routine - 10-15 minutes of math a day makes a big difference.',
  },
  'busy-shapes-colors': {
    title: 'Busy Shapes & Colors',
    shortDescription: 'Learn shapes and colors with drag-and-drop',
    description: 'Busy Shapes & Colors teaches shapes and colors through interactive puzzles. Drag figures to the right holes and see them disappear with fun animations. Designed for the youngest with great attention to fine motor skills.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Designed for small fingers'],
    cons: ['One-time price', 'Limited content'],
    parentTip: 'Perfect for the youngest - simple concepts without frustration.',
  },
  'arties-world': {
    title: 'Artie\'s World',
    shortDescription: 'Learn to code through drawing',
    description: 'Artie\'s World teaches children to code through drawing. Children program the Artie robot to draw figures by giving simple commands. A fun introduction to programming and logical thinking.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Introduction to coding'],
    cons: ['iOS only', 'Short playtime'],
    parentTip: 'Good start for coding for the youngest - from drawing to programming.',
  },
  'daniel-tigers-neighborhood': {
    title: 'Daniel Tiger\'s Neighborhood',
    shortDescription: 'Social-emotional learning with Daniel Tiger',
    description: 'Daniel Tiger\'s Neighborhood teaches social-emotional learning through activities based on the popular PBS series. Children learn about emotions, friendship and everyday challenges with Daniel and his friends.',
    pros: ['No ads', 'Works offline', 'PBS quality', 'Teaches about emotions'],
    cons: ['In-app purchases for extra content', 'Primarily in English'],
    parentTip: 'Use the songs from the app in everyday life - \'When you feel so mad that you want to roar, take a deep breath and count to four!\'',
  },
  // 7-10 YEARS
  'minecraft': {
    title: 'Minecraft',
    shortDescription: 'Build your own world in blocks',
    description: 'Minecraft is the world\'s most popular sandbox game where players build, explore and survive in an endless block world. In creative mode, children can build whatever they want without limits. In survival mode, they must gather resources and survive the night.',
    pros: ['No ads', 'Works offline', 'Endless creativity', 'Promotes collaboration', 'Constantly updated'],
    cons: ['In-app purchases for skins and worlds', 'Multiplayer requires subscription', 'Can be addictive'],
    parentTip: 'Start in creative mode without monsters. Use family restrictions to control online gaming.',
  },
  'monument-valley-2': {
    title: 'Monument Valley 2',
    shortDescription: 'Beautiful perspective puzzle for the whole family',
    description: 'Monument Valley 2 is a visually stunning puzzle where you guide a mother and daughter through impossible architectural worlds. Manipulate perspective and geometry to find the way. The game is a work of art that stimulates both eyes and brain.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Visually fantastic', 'Relaxing'],
    cons: ['One-time price', 'Short playtime (2-3 hours)'],
    parentTip: 'Play together - it\'s an experience that sparks conversation about art and perspective.',
  },
  'human-resource-machine': {
    title: 'Human Resource Machine',
    shortDescription: 'Learn programming the office worker way',
    description: 'Human Resource Machine teaches programming through visual puzzles. You control an office worker who performs simple commands to solve problems. A fun and accessible introduction to programming thinking.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Real programming', 'Humorous style'],
    cons: ['One-time price', 'Can become difficult', 'Requires patience'],
    parentTip: 'Perfect for children interested in coding. Start together and let them gradually solve more on their own.',
  },
  'dragonbox-numbers': {
    title: 'DragonBox Numbers',
    shortDescription: 'Understand numbers through play and experimentation',
    description: 'DragonBox Numbers makes math tangible by letting children play with numbers as physical objects. Children learn what numbers actually mean and how they relate to each other. Developed by math teachers and researchers.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Research-based', 'Unique approach to numbers'],
    cons: ['One-time price', 'Requires some parent explanation at first'],
    parentTip: 'Let the child explore freely - the game is designed to learn through discovery.',
  },
  'dragonbox-algebra': {
    title: 'DragonBox Algebra',
    shortDescription: 'Learn algebra through play - without knowing it',
    description: 'DragonBox Algebra 12+ teaches algebra without it feeling like math. Through play, children learn the basic principles of solving equations. Used in schools worldwide as an effective tool for math education.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Used in schools', 'Effective learning'],
    cons: ['One-time price', 'Can feel abstract at first'],
    parentTip: 'Children learn algebra without knowing it - perfect for those who find math difficult.',
  },
  'stack-the-states': {
    title: 'Stack the States',
    shortDescription: 'Learn US geography through stacking',
    description: 'Stack the States teaches children about US geography through a puzzle stacking game. Answer questions correctly to get states, and stack them to reach the top. Contains facts about all 50 states.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Fun and educational'],
    cons: ['US focus', 'Less relevant for Danish children'],
    parentTip: 'Good for learning American geography - but Stack the Countries also exists for world geography.',
  },
  'prodigy-math': {
    title: 'Prodigy Math',
    shortDescription: 'RPG where math is magic',
    description: 'Prodigy Math is a free role-playing game where math problems are magical battles. Children solve math problems to fight monsters and collect rewards. Automatically adapts to the child\'s level and is used in many schools.',
    pros: ['Free math', 'No ads', 'Adapts to level', 'Used in schools', 'Motivating rewards'],
    cons: ['In-app purchases for cosmetic items', 'Requires internet', 'Can focus more on gaming than learning'],
    parentTip: 'Math is free - only cosmetic items cost money. Disable purchases to avoid temptations.',
  },
  'lightbot-code-hour': {
    title: 'Lightbot: Code Hour',
    shortDescription: 'Introduction to coding with light robot',
    description: 'Lightbot Code Hour introduces programming through puzzles where you control a robot to turn on lights. Learn basic concepts like sequencing, loops and procedures. Free and perfect as a first introduction to coding.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Works offline', 'Introduction to coding'],
    cons: ['Short playtime', 'Limited to basic concepts'],
    parentTip: 'Perfect as a first coding game - when the child is ready, try the full Lightbot app.',
  },
  'scratch-jr': {
    title: 'Scratch Jr',
    shortDescription: 'Program stories and games with blocks',
    description: 'Scratch Jr lets children program interactive stories and games by putting graphic blocks together. Designed by MIT Media Lab as a younger version of the popular Scratch. Perfect introduction to creative programming.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Works offline', 'MIT-developed', 'Open source'],
    cons: ['Requires a little help to get started', 'Interface can seem overwhelming'],
    parentTip: 'Watch the introduction videos together - then children can often figure it out themselves.',
  },
  'altos-odyssey': {
    title: 'Alto\'s Odyssey',
    shortDescription: 'Peaceful sandboarding adventure',
    description: 'Alto\'s Odyssey is a peaceful sandboarding adventure through beautiful desert landscapes. Jump, avalanches and canyons while collecting coins and exploring secrets. Simple controls with deep gameplay that fits all ages.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Beautiful and relaxing', 'Simple controls'],
    cons: ['One-time price', 'Can be repetitive'],
    parentTip: 'Great for relaxation after homework - meditative and stress-free.',
  },
  'osmo-coding': {
    title: 'Osmo Coding',
    shortDescription: 'Physical coding with blocks and app',
    description: 'Osmo Coding combines physical blocks with digital play to teach coding. Children place physical command blocks in front of the camera and see results on screen. Requires Osmo Base (sold separately).',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Physical manipulation', 'Engaging'],
    cons: ['Requires Osmo hardware', 'iOS and Amazon Fire only'],
    parentTip: 'The Osmo kit is a good investment - physical blocks make abstract coding concrete.',
  },
  'geoguessr': {
    title: 'GeoGuessr',
    shortDescription: 'Guess where in the world you are',
    description: 'GeoGuessr places you in a random location on Google Street View, and you must guess where in the world you are. Learn geography by looking for clues in the landscape, buildings, signs and vehicles. Addictive and educational.',
    pros: ['Teaches world geography', 'Sharpens observation', 'Fun for the whole family'],
    cons: ['Ads in free version', 'Subscription for full access', 'Requires internet'],
    parentTip: 'Play together as a family - it leads to great conversations about the world and cultures.',
  },
  'tynker': {
    title: 'Tynker',
    shortDescription: 'Learn to code from blocks to real code',
    description: 'Tynker teaches programming through games, puzzles and creative projects. From simple blocks to real JavaScript and Python. Used in over 100,000 schools and adapts to the child\'s level.',
    pros: ['No ads', 'Works offline', 'Used in schools', 'From beginner to advanced'],
    cons: ['Subscription for full access', 'Can become expensive'],
    parentTip: 'Start with free content - only buy subscription if the child is really interested.',
  },
  'hopscotch': {
    title: 'Hopscotch',
    shortDescription: 'Create your own games and share them',
    description: 'Hopscotch makes it easy for children to create their own games and animations with visual programming. Share creations with a global community of young programmers. From simple projects to advanced games.',
    pros: ['No ads', 'Works offline', 'Creative community', 'From beginner to expert'],
    cons: ['iOS only', 'Subscription for advanced features'],
    parentTip: 'Encourage the child to remix others\' projects - that\'s how programmers learn.',
  },
  'brainpop-jr': {
    title: 'BrainPOP Jr. Movie of the Week',
    shortDescription: 'Weekly learning videos about everything',
    description: 'BrainPOP Jr. offers weekly free animated videos explaining topics like science, math, reading and social studies. Each video comes with quizzes and activities. Used in many schools.',
    pros: ['Free weekly video', 'No ads', 'Used in schools', 'High quality'],
    cons: ['Only one free video per week', 'Subscription for full access', 'Primarily in English'],
    parentTip: 'Watch the free weekly video together - perfect for starting conversations about new topics.',
  },
  // 11-15 YEARS
  'civilization-vi': {
    title: 'Civilization VI',
    shortDescription: 'Build an empire through world history',
    description: 'Civilization VI is a turn-based strategy game where you build an empire from the Stone Age to the Space Age. Choose a civilization, build cities, research technologies, and wage war or diplomacy. A deep and educational game about world history and strategy.',
    pros: ['No ads', 'Works offline', 'Deep gameplay', 'Teaches history', 'Many hours of content'],
    cons: ['High price', 'DLC costs extra', 'Can be complex', 'Can take a long time'],
    parentTip: 'Perfect for children interested in history - they learn about civilizations while playing.',
  },
  'kerbal-space-program': {
    title: 'Kerbal Space Program',
    shortDescription: 'Build rockets and explore space with real physics',
    description: 'In Kerbal Space Program you build space rockets and send little green Kerbals into space. With realistic physics you learn about orbital mechanics, rocket science and space travel. A fantastic tool for STEM education.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Real physics', 'Used in education'],
    cons: ['High price', 'Steep learning curve', 'Not on mobile'],
    parentTip: 'NASA recommends this game! Perfect for space-interested children.',
  },
  'portal': {
    title: 'Portal',
    shortDescription: 'Solve puzzles with portals and physics',
    description: 'Portal is a clever puzzle where you use a portal gun to solve physics-based puzzles. Teleport yourself and objects between two portals while avoiding dangers. Humorous and deeply satisfying.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Brilliant design', 'Fun story'],
    cons: ['Relatively short', 'Can cause motion sickness for some'],
    parentTip: 'One of the best puzzles ever - stimulates spatial thinking and problem-solving.',
  },
  'stardew-valley': {
    title: 'Stardew Valley',
    shortDescription: 'Build your dream farm in this charming simulation',
    description: 'Stardew Valley is a charming farm game where you inherit an old farm and build it from scratch. Grow crops, raise animals, mine in caves, fish, and befriend the villagers. Relaxing and deeply satisfying.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Endless value', 'Relaxing'],
    cons: ['Can be addictive', 'Slow seasons'],
    parentTip: 'A fantastic alternative to fast action games - teaches patience and planning.',
  },
  'cities-skylines': {
    title: 'Cities: Skylines',
    shortDescription: 'Design and manage your own city',
    description: 'Cities: Skylines is a city-building simulation where you design and manage your own city. Plan roads, zones, public transport and services. Watch your city grow from a small village to a metropolis. Teaches city planning and economics.',
    pros: ['No ads', 'Works offline', 'Deep gameplay', 'Mod support', 'Creative freedom'],
    cons: ['DLC can be expensive', 'Requires powerful computer', 'Can be complex'],
    parentTip: 'Fantastic for children interested in city planning, architecture or economics.',
  },
  'duolingo': {
    title: 'Duolingo',
    shortDescription: 'Learn languages free with daily lessons',
    description: 'Duolingo is the world\'s most popular language app with over 40 languages to learn. Short daily lessons make language training a habit. Gamification with points, streaks and leagues motivates to continue.',
    pros: ['Free basic version', '40+ languages', 'Works offline', 'Effective gamification'],
    cons: ['Ads in free version', 'Super Duolingo is expensive', 'Hearts limit practice'],
    parentTip: 'Family subscription gives value if several in the family use it.',
  },
  'factorio': {
    title: 'Factorio',
    shortDescription: 'Build and optimize factories to perfection',
    description: 'Factorio is about building and optimizing factories on a foreign planet. Automate production from simple conveyor belts to complex logistics systems. Deeply satisfying for those who love systems and optimization.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Deep gameplay', 'Active development'],
    cons: ['High price', 'Very complex', 'Can be VERY addictive'],
    parentTip: 'Perfect for logical thinking children - but set limits, because this game can eat hours!',
  },
  'the-room': {
    title: 'The Room',
    shortDescription: 'Solve the mystery in the mysterious boxes',
    description: 'The Room is an atmospheric puzzle where you solve the secrets of mysterious boxes. Twist, push and explore intricate mechanisms. Beautiful graphics and captivating puzzles. First game in an award-winning series.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Beautiful atmosphere', 'Cheap'],
    cons: ['Short playtime', 'Can be too easy for some'],
    parentTip: 'Good value for money - and the sequels The Room 2, 3 and 4 are even better.',
  },
  'mini-metro': {
    title: 'Mini Metro',
    shortDescription: 'Design the perfect metro system',
    description: 'Mini Metro is a minimalist strategy game where you design and build a metro system. Connect stations with lines and keep passengers moving. Simple to learn, hard to master.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Elegant design', 'Easy to learn'],
    cons: ['Can become difficult', 'Limited variation'],
    parentTip: 'Perfect for short sessions - and teaches about city traffic and system thinking.',
  },
  'bloons-td-6': {
    title: 'Bloons TD 6',
    shortDescription: 'Tower defense with monkeys and balloons',
    description: 'Bloons TD 6 is a tower defense game where monkeys defend against balloons. Place towers strategically, upgrade them, and survive as many rounds as possible. Colorful, fun and surprisingly deeply strategic.',
    pros: ['No ads', 'Works offline', 'Many hours of content', 'Fun design'],
    cons: ['In-app purchases for power-ups', 'Can be addictive'],
    parentTip: 'In-app purchases are optional - the game is fully playable without buying anything.',
  },
  'abcmouse': {
    title: 'ABCmouse',
    shortDescription: 'Comprehensive learning platform for young children',
    description: 'ABCmouse is a comprehensive learning platform with thousands of activities for children ages 2-8. Covers reading, math, science, art and much more. A structured learning program that tracks the child\'s progress and adapts to their level.',
    pros: ['Comprehensive content', 'No ads', 'Structured learning', 'Works offline'],
    cons: ['Requires subscription', 'Can be overwhelming', 'Primarily in English'],
    parentTip: 'Try the free trial period first to see if the child likes it before subscribing.',
  },
  'lingokids': {
    title: 'Lingokids',
    shortDescription: 'Award-winning learning app used by 100+ million families',
    description: 'Lingokids is an award-winning app used by over 100 million families. Designed for children 2-8 years with thousands of learning games in literacy, math, science and social-emotional learning. Children learn at their own pace in a safe, ad-free environment.',
    pros: ['No ads', 'Works offline', '100+ million users', 'Many learning areas'],
    cons: ['Full access requires subscription', 'Limited free content'],
    parentTip: 'Good for English as a second language - but the free version is limited.',
  },
  'homer': {
    title: 'HOMER',
    shortDescription: 'Personalized reading program that adapts to the child',
    description: 'HOMER is a personalized learning app that adapts to each child\'s interests and level. Focuses on reading with over 1000 lessons, but also includes social skills and critical thinking. The app creates a unique learning path for each child.',
    pros: ['Personalized learning', 'No ads', 'Works offline', 'Research-based'],
    cons: ['Requires subscription after trial', 'Primarily in English'],
    parentTip: 'Use the free trial period and see how the app adapts to your child\'s interests.',
  },
  'splashlearn': {
    title: 'SplashLearn',
    shortDescription: 'Game-based math and reading for kindergarten to 5th grade',
    description: 'SplashLearn is a comprehensive math and reading platform for children in kindergarten to 5th grade. With game-based learning and adaptive technology, the program adapts to the child\'s level. Used by millions of students and teachers.',
    pros: ['No ads', 'Adaptive learning', 'Comprehensive curriculum', 'Good for school children'],
    cons: ['Full access requires subscription', 'Requires internet'],
    parentTip: 'Perfect supplement to school teaching - follows the curriculum closely.',
  },
  'kahoot': {
    title: 'Kahoot!',
    shortDescription: 'Interactive quiz platform that makes learning fun',
    description: 'Kahoot! makes learning a game! The interactive quiz platform lets children participate in live quizzes or play on their own. With millions of ready-made quizzes and the ability to create your own, it\'s fun learning for all ages.',
    pros: ['Fun learning', 'Millions of quizzes', 'Social competition', 'Free basic version'],
    cons: ['Requires internet', 'Premium for all features'],
    parentTip: 'Make a family competition with Kahoot - it\'s fun for all ages!',
  },
  'codemonkey': {
    title: 'CodeMonkey',
    shortDescription: 'Learn to program by helping the monkey with bananas',
    description: 'CodeMonkey teaches children programming through fun games and challenges. Children write real code to help a monkey collect bananas. With courses for all levels, it\'s a fantastic introduction to coding.',
    pros: ['Teaches real programming', 'Fun theme', 'Progression from beginner to advanced'],
    cons: ['Full access requires subscription', 'Requires internet'],
    parentTip: 'One of the best ways to introduce children to programming - starts simple and builds up.',
  },
  'adventure-academy': {
    title: 'Adventure Academy',
    shortDescription: 'Virtual learning world for tweens',
    description: 'From the creators of ABCmouse comes Adventure Academy - a virtual world for children 8-13 years. Explore, learn and play together with others in a safe online environment. Covers math, science, English and social studies.',
    pros: ['Comprehensive content', 'Safe social interaction', 'Many subject areas'],
    cons: ['Requires subscription', 'Requires internet', 'Can be distracting'],
    parentTip: 'Good for tweens who have outgrown ABCmouse - continues the learning journey.',
  },
  'thinkrolls': {
    title: 'Thinkrolls',
    shortDescription: 'Physics puzzle that trains logical thinking',
    description: 'An award-winning puzzle that trains logical thinking. Roll your characters through maze-like courses by solving physics-based puzzles. Children learn about gravity, motion and problem-solving without knowing it.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Award-winning'],
    cons: ['One-time price', 'Limited number of levels'],
    parentTip: 'Fantastic for training problem-solving - let children find solutions themselves!',
  },
  'wheres-my-water': {
    title: 'Where\'s My Water?',
    shortDescription: 'Dig channels and guide water in Disney\'s puzzle',
    description: 'Disney\'s popular puzzle where you dig channels to guide water to crocodile Swampy\'s shower. Creative physics-based problem-solving with hundreds of levels. Charming characters and progressive difficulty.',
    pros: ['Creative problem-solving', 'Many levels', 'Charming characters', 'Disney quality'],
    cons: ['Contains ads', 'In-app purchases', 'Some levels are hard'],
    parentTip: 'Buy the full version to remove ads - it\'s worth the money for the entertainment.',
  },
  // NEW GAMES 2025
  'bluey-lets-play': {
    title: 'Bluey: Let\'s Play!',
    shortDescription: 'Play with Bluey and family in interactive adventures',
    description: 'Bluey: Let\'s Play! brings the beloved Australian cartoon family to life in an interactive play app. Kids can explore the Heeler family\'s house and backyard, play games from the show, and create their own adventures with Bluey, Bingo, and the rest of the family.',
    pros: ['No ads', 'Works offline', 'Beloved character', 'Open play without pressure', 'Music from the show'],
    cons: ['Subscription for full access', 'Limited free content'],
    parentTip: 'Perfect for Bluey fans! The 2 free areas are great to start with.',
  },
  'paw-patrol-rescue-world': {
    title: 'PAW Patrol Rescue World',
    shortDescription: 'Join PAW Patrol and save Adventure Bay',
    description: 'PAW Patrol Rescue World lets kids explore Adventure Bay and save the day with the pups from PAW Patrol. Kids can choose their favorite pup, drive rescue vehicles, and solve problems in different areas.',
    pros: ['No ads', 'Works offline', 'Beloved character', 'Easy navigation'],
    cons: ['Subscription for all characters', 'Limited free content'],
    parentTip: 'Budge Studios makes safe apps - perfect for PAW Patrol fans!',
  },
  'peppa-pig-world-adventures': {
    title: 'Peppa Pig: World Adventures',
    shortDescription: 'Travel the world with Peppa Pig and family',
    description: 'Peppa Pig: World Adventures takes kids on a journey around the world with Peppa and her family. Visit iconic places like the Eiffel Tower, Statue of Liberty, and more.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Beloved character', 'Teaches about the world'],
    cons: ['One-time price', 'Limited playtime'],
    parentTip: 'Great for Peppa fans who want to learn about different countries and cultures.',
  },
  'peekaboo-barn': {
    title: 'Peekaboo Barn',
    shortDescription: 'Discover farm animals with peek-a-boo play',
    description: 'Peekaboo Barn is a simple and charming app where babies discover farm animals hiding behind barn doors. With cute animations and animal sounds, the little ones learn about animals and build anticipation and recognition.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Perfect for babies', 'Simple design'],
    cons: ['Very simple', 'Limited content'],
    parentTip: 'One of the best first apps - simple and safe for the youngest.',
  },
  'scratchjr': {
    title: 'ScratchJr',
    shortDescription: 'Learn to code with colorful blocks - completely free',
    description: 'ScratchJr is a free coding app designed for children aged 5-7 from MIT and the Scratch Foundation. Kids snap graphical programming blocks together to make characters move, jump, dance, and sing.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Works offline', 'Teaches coding', 'From MIT'],
    cons: ['Requires some help at first', 'Limited to simple projects'],
    parentTip: 'Fantastic introduction to coding! Sit with your child the first times and create stories together.',
  },
  'kodable': {
    title: 'Kodable',
    shortDescription: 'Coding for the youngest with cute fuzzy characters',
    description: 'Kodable teaches kids to code through colorful game levels where they guide cute fuzzy characters through mazes. The app is used in over 50% of American elementary schools.',
    pros: ['No ads', 'Used in schools', 'Teaches real JavaScript', 'Age-appropriate'],
    cons: ['Subscription for full access', 'Requires internet', 'iOS only'],
    parentTip: 'Used by over 50% of American schools - a well-designed coding learning path.',
  },
  'paw-patrol-academy': {
    title: 'PAW Patrol Academy',
    shortDescription: 'Learn letters, numbers, and shapes with PAW Patrol',
    description: 'PAW Patrol Academy combines learning with kids\' favorite pups. Practice letters with Rubble, dance Pup Pup Boogie with Skye, build words with Chase, learn numbers with Marshall, shapes with Rocky, and color with Zuma.',
    pros: ['No ads', 'Works offline', 'Beloved character', 'Learning through play'],
    cons: ['Subscription for full access', 'Limited free content'],
    parentTip: 'Perfect combination of learning and entertainment for PAW Patrol fans!',
  },
  'minecraft-education': {
    title: 'Minecraft Education',
    shortDescription: 'Learn through building - no ads or purchases',
    description: 'Minecraft Education is the educational version of Minecraft developed by Microsoft for school use. The game contains hundreds of lessons in coding, math, history, and science. No ads, no in-app purchases, and secure communication only within the school.',
    pros: ['Completely free', 'No ads', 'No in-app purchases', 'Secure chat', 'Hundreds of lessons', 'Teaches coding'],
    cons: ['Requires Microsoft account', 'Primarily for school use'],
    parentTip: 'Ask your child\'s school if they use Minecraft Education - many schools offer free access.',
  },
  'bluey-the-videogame': {
    title: 'Bluey: The Videogame',
    shortDescription: 'Four interactive Bluey episodes with family games',
    description: 'Bluey: The Videogame lets players explore four interactive episodes from the beloved cartoon series. Visit the Heeler house, playgrounds, creek, and more. Play mini-games from the show like Keepy Uppy, Magic Xylophone, and Shadowlands.',
    pros: ['No ads', 'No in-app purchases', 'Works offline', 'Local multiplayer', 'True to the series'],
    cons: ['One-time price', 'Limited content'],
    parentTip: 'Perfect for playing together as a family - up to 4 players on the same screen!',
  },
};

// ============================================================================
// FRENCH TRANSLATIONS - DIGITAL GAMES
// ============================================================================

const digitalGameTranslationsFR: Record<string, GameTranslationData> = {
  'sago-mini-world': {
    title: 'Sago Mini World',
    shortDescription: 'Collection de 40+ jeux primés pour les plus petits',
    description: 'Sago Mini World est une fantastique collection de plus de 40 jeux Sago Mini primés dans une seule application.',
    pros: ['Aucune publicité', 'Fonctionne hors ligne', '40+ jeux en une app', 'Sûr pour les jeunes enfants'],
    cons: ['Abonnement requis après la période d\'essai', 'Peut devenir coûteux'],
    parentTip: 'Parfait pour les longs trajets - téléchargez le contenu à la maison.',
  },
  'lego-duplo-world': {
    title: 'LEGO DUPLO World',
    shortDescription: 'Briques DUPLO numériques pour les plus petits',
    description: 'LEGO DUPLO World permet aux plus jeunes de construire et jouer avec des briques DUPLO numériques.',
    pros: ['Pas de publicités', 'Fonctionne hors ligne', 'Favorise la créativité', 'Marque connue et aimée'],
    cons: ['Achats in-app pour contenu supplémentaire', 'Contenu gratuit limité'],
    parentTip: 'Commencez avec le contenu gratuit pour voir si votre enfant aime.',
  },
  'khan-academy-kids': {
    title: 'Khan Academy Kids',
    shortDescription: 'Apprentissage 100% gratuit sans publicités ni achats',
    description: 'Khan Academy Kids est l\'une des meilleures applications d\'apprentissage gratuites pour enfants.',
    pros: ['Totalement gratuit', 'Pas de publicités', 'Pas d\'achats in-app', 'Fonctionne hors ligne', 'S\'adapte au niveau'],
    cons: ['Principalement en anglais', 'Peut sembler écrasant'],
    parentTip: 'FORTEMENT RECOMMANDÉ! C\'est la référence pour les applications gratuites pour enfants.',
  },
  'minecraft': {
    title: 'Minecraft',
    shortDescription: 'Construisez votre propre monde en blocs',
    description: 'Minecraft est le jeu bac à sable le plus populaire au monde où les joueurs construisent, explorent et survivent.',
    pros: ['Pas de publicités', 'Fonctionne hors ligne', 'Créativité infinie', 'Favorise la collaboration'],
    cons: ['Achats in-app', 'Multijoueur nécessite abonnement', 'Peut être addictif'],
    parentTip: 'Commencez en mode créatif sans monstres. Utilisez le contrôle parental.',
  },
  'toca-life-world': {
    title: 'Toca Life World',
    shortDescription: 'Créez vos propres histoires dans un monde de jeu infini',
    description: 'Toca Life World est le monde de jeu numérique ultime qui combine tous les lieux Toca Life en un seul jeu.',
    pros: ['Pas de publicités', 'Fonctionne hors ligne', 'Créativité infinie', 'Combine tous les jeux Toca Life'],
    cons: ['Beaucoup d\'achats in-app', 'Peut être cher'],
    parentTip: 'Commencez avec les lieux gratuits - il y a beaucoup à explorer.',
  },
  'endless-alphabet': {
    title: 'Endless Alphabet',
    shortDescription: 'Apprenez l\'alphabet avec des animations de monstres amusantes',
    description: 'Endless Alphabet rend l\'apprentissage de l\'alphabet et des nouveaux mots amusant.',
    pros: ['Pas de publicités', 'Pas d\'achats in-app', 'Fonctionne hors ligne', 'Design primé'],
    cons: ['Prix unique un peu élevé', 'Uniquement en anglais'],
    parentTip: 'Investissez dans celui-ci - il en vaut chaque centime.',
  },
  'monument-valley-2': {
    title: 'Monument Valley 2',
    shortDescription: 'Beau puzzle de perspective pour toute la famille',
    description: 'Monument Valley 2 est un puzzle visuellement époustouflant où vous guidez une mère et sa fille à travers des mondes architecturaux impossibles.',
    pros: ['Pas de publicités', 'Pas d\'achats in-app', 'Fonctionne hors ligne', 'Visuellement fantastique'],
    cons: ['Prix unique', 'Courte durée de jeu'],
    parentTip: 'Jouez ensemble - c\'est une expérience qui suscite des conversations sur l\'art.',
  },
  'scratch-jr': {
    title: 'Scratch Jr',
    shortDescription: 'Programmez des histoires et des jeux avec des blocs',
    description: 'Scratch Jr permet aux enfants de programmer des histoires et des jeux interactifs en assemblant des blocs graphiques.',
    pros: ['Totalement gratuit', 'Pas de publicités', 'Pas d\'achats in-app', 'Fonctionne hors ligne', 'Développé par MIT'],
    cons: ['Nécessite un peu d\'aide pour commencer', 'L\'interface peut sembler écrasante'],
    parentTip: 'Regardez les vidéos d\'introduction ensemble.',
  },
  'pbs-kids-games': {
    title: 'PBS Kids Games',
    shortDescription: 'Jeux éducatifs gratuits de l\'univers PBS',
    description: 'PBS Kids Games rassemble des centaines de jeux éducatifs gratuits basés sur des séries PBS populaires.',
    pros: ['Totalement gratuit', 'Pas de publicités', 'Pas d\'achats in-app', 'Nouveau contenu régulier'],
    cons: ['Nécessite internet', 'Principalement en anglais'],
    parentTip: 'L\'une des meilleures applications gratuites - soutenue par le service public.',
  },
  'civilization-vi': {
    title: 'Civilization VI',
    shortDescription: 'Construisez un empire à travers l\'histoire mondiale',
    description: 'Civilization VI est un jeu de stratégie au tour par tour où vous construisez un empire de l\'âge de pierre à l\'ère spatiale.',
    pros: ['Pas de publicités', 'Fonctionne hors ligne', 'Gameplay profond', 'Enseigne l\'histoire'],
    cons: ['Prix élevé', 'DLC coûte extra', 'Peut être complexe'],
    parentTip: 'Parfait pour les enfants intéressés par l\'histoire - ils apprennent en jouant.',
  },
  'stardew-valley': {
    title: 'Stardew Valley',
    shortDescription: 'Construisez votre ferme de rêve dans cette simulation charmante',
    description: 'Stardew Valley est un jeu de ferme charmant où vous héritez d\'une vieille ferme et la construisez à partir de zéro.',
    pros: ['Pas de publicités', 'Pas d\'achats in-app', 'Fonctionne hors ligne', 'Valeur infinie', 'Relaxant'],
    cons: ['Peut être addictif', 'Saisons lentes'],
    parentTip: 'Une alternative fantastique aux jeux d\'action rapides - enseigne la patience.',
  },
  'duolingo': {
    title: 'Duolingo',
    shortDescription: 'Apprenez des langues gratuitement avec des leçons quotidiennes',
    description: 'Duolingo est l\'application de langues la plus populaire au monde avec plus de 40 langues à apprendre.',
    pros: ['Version de base gratuite', '40+ langues', 'Fonctionne hors ligne', 'Gamification efficace'],
    cons: ['Publicités dans la version gratuite', 'Super Duolingo est cher'],
    parentTip: 'L\'abonnement familial est rentable si plusieurs membres de la famille l\'utilisent.',
  },
};

// ============================================================================
// SPANISH TRANSLATIONS - DIGITAL GAMES
// ============================================================================

const digitalGameTranslationsES: Record<string, GameTranslationData> = {
  'sago-mini-world': {
    title: 'Sago Mini World',
    shortDescription: 'Colección de 40+ juegos premiados para los más pequeños',
    description: 'Sago Mini World es una fantástica colección de más de 40 juegos premiados de Sago Mini en una sola aplicación.',
    pros: ['Sin anuncios', 'Funciona sin conexión', '40+ juegos en una app', 'Seguro para niños pequeños'],
    cons: ['Requiere suscripción después del período de prueba', 'Puede volverse costoso'],
    parentTip: 'Perfecto para viajes largos - descarga el contenido en casa.',
  },
  'lego-duplo-world': {
    title: 'LEGO DUPLO World',
    shortDescription: 'Bloques DUPLO digitales para los más pequeños',
    description: 'LEGO DUPLO World permite a los más pequeños construir y jugar con bloques DUPLO digitales.',
    pros: ['Sin anuncios', 'Funciona sin conexión', 'Promueve la creatividad', 'Marca conocida y querida'],
    cons: ['Compras in-app para contenido adicional', 'Contenido gratuito limitado'],
    parentTip: 'Comienza con el contenido gratuito para ver si a tu hijo le gusta.',
  },
  'khan-academy-kids': {
    title: 'Khan Academy Kids',
    shortDescription: 'Aprendizaje 100% gratis sin anuncios ni compras',
    description: 'Khan Academy Kids es una de las mejores aplicaciones de aprendizaje gratuitas para niños.',
    pros: ['Completamente gratis', 'Sin anuncios', 'Sin compras in-app', 'Funciona sin conexión', 'Se adapta al nivel'],
    cons: ['Principalmente en inglés', 'Puede parecer abrumador'],
    parentTip: 'MUY RECOMENDADO! Es el estándar de oro para aplicaciones gratuitas para niños.',
  },
  'minecraft': {
    title: 'Minecraft',
    shortDescription: 'Construye tu propio mundo en bloques',
    description: 'Minecraft es el juego sandbox más popular del mundo donde los jugadores construyen, exploran y sobreviven.',
    pros: ['Sin anuncios', 'Funciona sin conexión', 'Creatividad infinita', 'Promueve la colaboración'],
    cons: ['Compras in-app', 'Multijugador requiere suscripción', 'Puede ser adictivo'],
    parentTip: 'Comienza en modo creativo sin monstruos. Usa controles parentales.',
  },
  'toca-life-world': {
    title: 'Toca Life World',
    shortDescription: 'Crea tus propias historias en un mundo de juego infinito',
    description: 'Toca Life World es el mundo de juego digital definitivo que combina todas las ubicaciones de Toca Life en un solo juego.',
    pros: ['Sin anuncios', 'Funciona sin conexión', 'Creatividad infinita', 'Combina todos los juegos Toca Life'],
    cons: ['Muchas compras in-app', 'Puede ser caro'],
    parentTip: 'Comienza con las ubicaciones gratuitas - hay mucho para explorar.',
  },
  'endless-alphabet': {
    title: 'Endless Alphabet',
    shortDescription: 'Aprende el alfabeto con divertidas animaciones de monstruos',
    description: 'Endless Alphabet hace que aprender el alfabeto y nuevas palabras sea divertido.',
    pros: ['Sin anuncios', 'Sin compras in-app', 'Funciona sin conexión', 'Diseño premiado'],
    cons: ['Precio único algo alto', 'Solo en inglés'],
    parentTip: 'Invierte en este - vale cada centavo.',
  },
  'monument-valley-2': {
    title: 'Monument Valley 2',
    shortDescription: 'Hermoso rompecabezas de perspectiva para toda la familia',
    description: 'Monument Valley 2 es un rompecabezas visualmente impresionante donde guías a una madre y su hija.',
    pros: ['Sin anuncios', 'Sin compras in-app', 'Funciona sin conexión', 'Visualmente fantástico'],
    cons: ['Precio único', 'Tiempo de juego corto'],
    parentTip: 'Juega junto - es una experiencia que genera conversaciones sobre arte.',
  },
  'scratch-jr': {
    title: 'Scratch Jr',
    shortDescription: 'Programa historias y juegos con bloques',
    description: 'Scratch Jr permite a los niños programar historias y juegos interactivos ensamblando bloques gráficos.',
    pros: ['Totalmente gratis', 'Sin anuncios', 'Sin compras in-app', 'Funciona sin conexión', 'Desarrollado por MIT'],
    cons: ['Requiere algo de ayuda para empezar', 'La interfaz puede parecer abrumadora'],
    parentTip: 'Ve los videos de introducción juntos.',
  },
  'pbs-kids-games': {
    title: 'PBS Kids Games',
    shortDescription: 'Juegos educativos gratuitos del universo PBS',
    description: 'PBS Kids Games reúne cientos de juegos educativos gratuitos basados en series populares de PBS.',
    pros: ['Completamente gratis', 'Sin anuncios', 'Sin compras in-app', 'Nuevo contenido regular'],
    cons: ['Requiere internet', 'Principalmente en inglés'],
    parentTip: 'Una de las mejores apps gratuitas - apoyada por el servicio público.',
  },
  'civilization-vi': {
    title: 'Civilization VI',
    shortDescription: 'Construye un imperio a través de la historia mundial',
    description: 'Civilization VI es un juego de estrategia por turnos donde construyes un imperio desde la Edad de Piedra.',
    pros: ['Sin anuncios', 'Funciona sin conexión', 'Gameplay profundo', 'Enseña historia'],
    cons: ['Precio alto', 'DLC cuesta extra', 'Puede ser complejo'],
    parentTip: 'Perfecto para niños interesados en historia - aprenden mientras juegan.',
  },
  'stardew-valley': {
    title: 'Stardew Valley',
    shortDescription: 'Construye tu granja de ensueño en esta encantadora simulación',
    description: 'Stardew Valley es un encantador juego de granja donde heredas una vieja granja y la construyes desde cero.',
    pros: ['Sin anuncios', 'Sin compras in-app', 'Funciona sin conexión', 'Valor infinito', 'Relajante'],
    cons: ['Puede ser adictivo', 'Estaciones lentas'],
    parentTip: 'Una alternativa fantástica a los juegos de acción rápidos - enseña paciencia.',
  },
  'duolingo': {
    title: 'Duolingo',
    shortDescription: 'Aprende idiomas gratis con lecciones diarias',
    description: 'Duolingo es la aplicación de idiomas más popular del mundo con más de 40 idiomas para aprender.',
    pros: ['Versión básica gratuita', '40+ idiomas', 'Funciona sin conexión', 'Gamificación efectiva'],
    cons: ['Anuncios en versión gratuita', 'Super Duolingo es caro'],
    parentTip: 'La suscripción familiar da valor si varios en la familia lo usan.',
  },
};

// ============================================================================
// ENGLISH TRANSLATIONS - ALL 49 BOARD GAMES
// ============================================================================

const boardGameTranslationsEN: Record<string, GameTranslationData> = {
  'haba-first-orchard': {
    title: 'First Orchard',
    shortDescription: 'The perfect first board game for the youngest ones',
    description: 'First Orchard is the perfect first board game for the very youngest. Players work together to harvest fruit from the trees before the raven reaches the orchard.',
    pros: ['Perfect from 2 years', 'Cooperative game - no losers', 'Large wooden pieces', 'HABA quality'],
    cons: ['Very simple for children over 4', 'Based on luck'],
    parentTip: 'The absolute best first board game! Children love collecting the large wooden fruits.',
  },
  'feed-the-woozle': {
    title: 'Feed the Woozle',
    shortDescription: 'Balance game where you feed the cute Woozle monster',
    description: 'Feed the Woozle is a fun cooperative game where children must balance snacks on a spoon and feed them to the cute Woozle monster.',
    pros: ['Trains motor skills', 'Cooperation over competition', 'Cute monster', 'Varying difficulty'],
    cons: ['Snack pieces can be hard to balance', 'Limited replay value'],
    parentTip: 'Children cheer each other on instead of competing - great for building social skills.',
  },
  'sneaky-snacky-squirrel': {
    title: 'Sneaky, Snacky Squirrel Game',
    shortDescription: 'Color matching with squirrel tweezers',
    description: 'Help the squirrels collect acorns with special squirrel tweezers! Spin the spinner and use the tweezers to pick up the matching colored acorn.',
    pros: ['Develops fine motor skills', 'Cute theme', 'Teaches colors', 'Durable pieces'],
    cons: ['Based on luck', 'Tweezers may be hard for youngest'],
    parentTip: 'Great for developing pincer grip needed for writing.',
  },
  'zingo': {
    title: 'Zingo',
    shortDescription: 'Bingo with a twist for pre-readers',
    description: 'Zingo is a fast-paced matching game where players race to fill their cards first. The Zinger device dispenses tiles and adds excitement.',
    pros: ['Pre-reading skills', 'Fast and exciting', 'Multiple difficulty levels', 'Durable Zinger'],
    cons: ['Can be loud', 'Tiles may get lost'],
    parentTip: 'Start with picture-only mode, then progress to picture-and-word.',
  },
  'very-hungry-caterpillar-game': {
    title: 'The Very Hungry Caterpillar Game',
    shortDescription: 'Help the hungry caterpillar become a butterfly',
    description: 'Based on the beloved children\'s book! Players help the caterpillar eat through fruit and candy to become a beautiful butterfly.',
    pros: ['Beloved character', 'Teaches counting', 'Beautiful design', 'Simple rules'],
    cons: ['Mainly for fans of the book', 'Simple gameplay'],
    parentTip: 'Read the book before playing - it makes the game much more meaningful!',
  },
  'candy-land': {
    title: 'Candy Land',
    shortDescription: 'Classic color game for the very youngest',
    description: 'Candy Land is one of the world\'s oldest and most loved children\'s board games. Players journey through a candy-themed world by drawing color cards.',
    pros: ['No reading required', 'Simple rules', 'Colorful and appealing', 'Classic game'],
    cons: ['No strategy', 'Based entirely on luck'],
    parentTip: 'Perfect for teaching turn-taking and being a good sport.',
  },
  'roll-and-play': {
    title: 'Roll & Play',
    shortDescription: 'Activity game with large soft die for the youngest',
    description: 'Roll & Play is designed specifically for the very youngest. Roll the large soft die, find a card in the same color, and perform the simple activity.',
    pros: ['Perfect from 18 months', 'No losers', 'Large soft die safe for babies', 'Learns through movement'],
    cons: ['Not a traditional board game', 'Children outgrow it quickly'],
    parentTip: 'Fantastic as the very first \'game\' - introduces the concept of following rules.',
  },
  'count-your-chickens': {
    title: 'Count Your Chickens',
    shortDescription: 'Cooperate to collect the chickens home',
    description: 'A cooperative game where all players work together to collect the chickens and get them safely back to the henhouse.',
    pros: ['Cooperative - everyone wins together', 'Teaches counting', 'Cute figures', 'Quality'],
    cons: ['Simple for older children', 'Luck-based'],
    parentTip: 'From Peaceable Kingdom who make fantastic cooperative games.',
  },
  'chutes-and-ladders': {
    title: 'Chutes and Ladders',
    shortDescription: 'Classic with ladders up and slides down',
    description: 'The classic game with ladders and slides! Land on a ladder to climb up, or a slide to slide down.',
    pros: ['Teaches counting to 100', 'Classic everyone knows', 'Teaches about consequences', 'Cheap'],
    cons: ['Pure luck', 'Can drag on', 'Can be frustrating'],
    parentTip: 'Use the game to talk about good and bad choices.',
  },
  'hi-ho-cherry-o': {
    title: 'Hi Ho! Cherry-O',
    shortDescription: 'Counting game with fruit picking',
    description: 'Spin the arrow and collect cherries from your tree to your bucket. The game teaches basic counting, addition and subtraction.',
    pros: ['Teaches counting', 'Simple math concepts', 'Classic game', 'Cute pieces'],
    cons: ['Small pieces', 'Based on luck'],
    parentTip: 'Count aloud together to reinforce number concepts.',
  },
  'outfoxed': {
    title: 'Outfoxed!',
    shortDescription: 'Cooperative mystery solving for young detectives',
    description: 'Who stole Mrs. Plumpert\'s pot pie? Players work together to gather clues and eliminate suspects before the fox escapes.',
    pros: ['Mystery theme', 'Cooperative', 'Deductive reasoning', 'Replayable'],
    cons: ['Some reading helpful', 'Can be confusing at first'],
    parentTip: 'Talk through the clue-gathering process together.',
  },
  'hoot-owl-hoot': {
    title: 'Hoot Owl Hoot!',
    shortDescription: 'Cooperative color game with owls',
    description: 'Help the owls fly home before the sun rises! This cooperative game teaches strategy and color matching.',
    pros: ['Cooperative', 'Strategy elements', 'Beautiful design', 'No reading required'],
    cons: ['Can be too easy for older kids', 'Limited pieces'],
    parentTip: 'Great for teaching teamwork and discussing strategy.',
  },
  'my-first-carcassonne': {
    title: 'My First Carcassonne',
    shortDescription: 'Tile-laying for little builders',
    description: 'My First Carcassonne simplifies tile-laying for young players. Place tiles to build roads and complete features.',
    pros: ['Beautiful tiles', 'Simplified rules', 'Spatial skills', 'Award-winning series'],
    cons: ['Less strategic than original', 'Quick games'],
    parentTip: 'Graduate to regular Carcassonne when ready for more strategy.',
  },
  'rhino-hero': {
    title: 'Rhino Hero',
    shortDescription: 'Build a card house that Rhino Hero must climb',
    description: 'A fantastic balance game where players build a high-rise from cards that Rhino Hero must climb!',
    pros: ['Fantastic tension', 'Fun for whole family', 'Cheap', 'Compact', 'HABA quality'],
    cons: ['Short play time', 'Can be frustrating if it falls'],
    parentTip: 'One of the best games for the price!',
  },
  'animal-upon-animal': {
    title: 'Animal Upon Animal',
    shortDescription: 'Stack animals in a balance tower',
    description: 'Stack animals on top of each other without the tower falling! HABA\'s classic dexterity game.',
    pros: ['Beautiful wooden figures', 'Fun for all ages', 'HABA quality', 'Simple to understand'],
    cons: ['Some animals easier to stack', 'Can be frustrating'],
    parentTip: 'The figures are so beautiful that children also play with them outside the game.',
  },
  'monza': {
    title: 'Monza',
    shortDescription: 'Colorful racing game with tactical choices',
    description: 'A colorful racing game where the dice determine which colors you can drive on!',
    pros: ['Introduces tactical thinking', 'Exciting racing theme', 'HABA quality', 'Quick rounds'],
    cons: ['Luck with dice can frustrate', 'Limited depth'],
    parentTip: 'Good for teaching children to think one step ahead.',
  },
  'go-away-monster': {
    title: 'Go Away Monster!',
    shortDescription: 'Feel-game that makes monsters less scary',
    description: 'A calming game for children nervous about monsters! Reach into the bag and find your room items by feel.',
    pros: ['Helps with fear of monsters', 'Tactilely engaging', 'Calming', 'Simple and effective'],
    cons: ['Very simple', 'Limited replay value'],
    parentTip: 'Fantastic for children with monster fears!',
  },
  'sequence-for-kids': {
    title: 'Sequence for Kids',
    shortDescription: 'Strategy game simplified for children',
    description: 'Sequence for Kids introduces strategy through animal matching. Play a card and place a chip on the matching animal.',
    pros: ['Teaches strategy', 'Nice animal theme', 'Two ways to win', 'Good for different ages'],
    cons: ['Can be frustrating', 'Requires some reading'],
    parentTip: 'Help younger children by discussing moves together.',
  },
  'spot-it-jr-animals': {
    title: 'Spot It! Jr. Animals',
    shortDescription: 'Fast visual matching for children',
    description: 'Spot It! Junior tests visual perception and quick thinking. Find the one matching symbol between any two cards.',
    pros: ['Quick games', 'Portable', 'Develops visual skills', 'Multiple game modes'],
    cons: ['Can be too fast for some', 'Competitive'],
    parentTip: 'Start with cooperative play before introducing competition.',
  },
  'bus-stop': {
    title: 'Bus Stop',
    shortDescription: 'Collect passengers and learn to count',
    description: 'Drive around the board in your bus and collect/drop off passengers at stops. A fun game that teaches addition and subtraction.',
    pros: ['Teaches math through play', 'Realistic theme', 'Fun to be bus driver', 'Quality'],
    cons: ['Limited to simple math', 'Can become repetitive'],
    parentTip: 'Perfect for children learning addition and subtraction!',
  },
  'ticket-to-ride-first-journey': {
    title: 'Ticket to Ride: First Journey',
    shortDescription: 'Introduction to the popular train game',
    description: 'First Journey simplifies the award-winning Ticket to Ride for younger players. Collect train cards, claim routes, and complete tickets.',
    pros: ['Teaches strategy', 'Beautiful design', 'Based on award-winning game', 'Good for family game night'],
    cons: ['Can be frustrating if blocked', 'Needs patience to learn'],
    parentTip: 'Play a practice round with open cards to teach strategy.',
  },
  'catan-junior': {
    title: 'Catan Junior',
    shortDescription: 'Resource trading for young strategists',
    description: 'Catan Junior introduces younger players to the world of Catan. Build pirate lairs and ships by collecting and trading resources.',
    pros: ['Introduces trading', 'Beloved franchise', 'Strategic depth', 'Pirate theme'],
    cons: ['Some negotiation needed', 'Can be long'],
    parentTip: 'Model fair trading behavior for children to learn from.',
  },
  'king-of-tokyo': {
    title: 'King of Tokyo',
    shortDescription: 'Monster battle to become king of Tokyo',
    description: 'Become the king of Tokyo! Choose your monster, roll dice to attack, heal, collect energy and score points.',
    pros: ['Fast, exciting rounds', 'Easy rules, deep gameplay', 'Monsters are super cool', 'Many can play'],
    cons: ['Can be too aggressive for some', 'Luck with dice decides a lot'],
    parentTip: 'Perfect \'gateway\' game to more complex strategy games.',
  },
  'sleeping-queens': {
    title: 'Sleeping Queens',
    shortDescription: 'Wake the queens with strategy and luck',
    description: 'Sleeping Queens mixes strategy with silly fun. Wake queens, defend against knights, and use special cards.',
    pros: ['Invented by child', 'Math elements', 'Strategy and luck', 'Quick games'],
    cons: ['Some reading needed', 'Can feel unfair'],
    parentTip: 'The math equations for waking queens reinforce addition.',
  },
  'labyrinth': {
    title: 'Labyrinth',
    shortDescription: 'Push corridors and find the way to treasure',
    description: 'The classic maze game from Ravensburger! Push tiles to open new paths and find your way to treasures.',
    pros: ['Timeless classic', 'Trains spatial thinking', 'Ravensburger quality', 'Exciting every time'],
    cons: ['Can be confusing to see new paths', '4 players maximum'],
    parentTip: 'Teach children to think \'if I push here, what happens?\'',
  },
  'blokus': {
    title: 'Blokus',
    shortDescription: 'Tetris-like territory game',
    description: 'Blokus has players placing Tetris-like pieces, touching only at corners. Simple rules with deep strategy.',
    pros: ['Spatial thinking', 'Strategic', 'Simple rules', 'Four players'],
    cons: ['Competitive', 'Can be frustrating'],
    parentTip: 'Start with smaller pieces and work up to larger ones.',
  },
  'dixit': {
    title: 'Dixit',
    shortDescription: 'Storytelling with beautiful surreal art',
    description: 'Dixit sparks imagination through dreamlike illustrations. Give clues about your card that are not too obvious or too vague.',
    pros: ['Stunning artwork', 'Creative', 'Language development', 'Expandable'],
    cons: ['Needs 3+ players', 'Abstract for younger kids'],
    parentTip: 'Accept all clue attempts - creativity matters more than winning.',
  },
  'sushi-go': {
    title: 'Sushi Go!',
    shortDescription: 'Adorable sushi-drafting card game',
    description: 'An adorable drafting card game where you collect the best sushi combination!',
    pros: ['Adorable design', 'Easy rules', 'Quick rounds', 'Cheap'],
    cons: ['Scoring can be confusing', 'Cards can get worn'],
    parentTip: 'Perfect gateway to the drafting mechanic.',
  },
  'splendor': {
    title: 'Splendor',
    shortDescription: 'Gem trading and engine building',
    description: 'Splendor has players collecting gems to buy cards that give permanent bonuses. Build an engine to attract nobles.',
    pros: ['Strategic', 'Quality components', 'Multiple strategies', 'Quiet gameplay'],
    cons: ['Abstract theme', 'Limited interaction'],
    parentTip: 'Explain the value of building an engine over time.',
  },
  'kingdomino': {
    title: 'Kingdomino',
    shortDescription: 'Domino kingdom building',
    description: 'Kingdomino has players building kingdoms by matching terrain types like dominoes. Game of the Year winner 2017.',
    pros: ['Award-winning', 'Quick games', 'Strategic choices', 'Beautiful tiles'],
    cons: ['Scoring needs practice', 'Space needed to build'],
    parentTip: 'Focus on matching first, scoring optimization comes with practice.',
  },
  'forbidden-island': {
    title: 'Forbidden Island',
    shortDescription: 'Cooperative treasure rescue',
    description: 'Forbidden Island challenges players to collect treasures before the island sinks. Work together and use special powers.',
    pros: ['Cooperative', 'Variable difficulty', 'Strategic', 'Beautiful components'],
    cons: ['Can be tense', 'Reading required'],
    parentTip: 'Discuss plans together and let children lead decisions.',
  },
  'dobble': {
    title: 'Dobble',
    shortDescription: 'Visual speed matching with animals',
    description: 'Dobble challenges players to find matching symbols between cards. Fast reflexes and observation skills are key.',
    pros: ['Quick games', 'Portable', 'Multiple game modes', 'Visual skills'],
    cons: ['Very competitive', 'Can be frustrating for slow players'],
    parentTip: 'Try cooperative variations for less competitive play.',
  },
  'catan': {
    title: 'Catan',
    shortDescription: 'Classic resource trading and settlement building',
    description: 'The legendary Catan is one of the most important board games ever. Trade resources, build settlements and roads.',
    pros: ['Classic', 'Trading and negotiation', 'Variable board', 'Social'],
    cons: ['Can take long', 'Dice luck can frustrate'],
    parentTip: 'One of the best gateway games to hobby board gaming.',
  },
  'ticket-to-ride': {
    title: 'Ticket to Ride',
    shortDescription: 'Train route building classic',
    description: 'Ticket to Ride has players collecting cards and claiming train routes. Complete tickets for bonus points.',
    pros: ['Classic', 'Easy to learn', 'Strategic depth', 'Beautiful design'],
    cons: ['Can block others', 'Game length'],
    parentTip: 'Start with USA map for simpler game.',
  },
  'codenames': {
    title: 'Codenames',
    shortDescription: 'Team word association',
    description: 'Codenames has teams giving one-word clues to identify words. Balance being specific enough but not too obvious.',
    pros: ['Team play', 'Creative thinking', 'Many players', 'Party favorite'],
    cons: ['Needs 4+ players', 'Can be long'],
    parentTip: 'Pair younger children with adults for team play.',
  },
  'wingspan': {
    title: 'Wingspan',
    shortDescription: 'Bird-collecting engine builder',
    description: 'Wingspan has players attracting birds to wildlife preserves. Build combos of bird powers. Beautiful components.',
    pros: ['Beautiful', 'Educational', 'Engine building', 'Solo mode'],
    cons: ['Complex', 'Expensive'],
    parentTip: 'Use the bird facts to teach about real species.',
  },
  'azul': {
    title: 'Azul',
    shortDescription: 'Beautiful tile pattern building',
    description: 'Azul has players drafting colorful tiles to build patterns. Stunning components and elegant rules. Game of the Year winner.',
    pros: ['Beautiful design', 'Award-winning', 'Strategic depth', 'Pattern building'],
    cons: ['Scoring complex', 'Abstract'],
    parentTip: 'Focus on pattern building first, optimization comes later.',
  },
  '7-wonders': {
    title: '7 Wonders',
    shortDescription: 'Civilization building through card drafting',
    description: '7 Wonders has players building ancient civilizations through card drafting. Balance resources, military, and science.',
    pros: ['Scales well', 'Strategic', 'Historical theme', 'Quick for player count'],
    cons: ['Complex icons', 'Scoring involved'],
    parentTip: 'Use cheat sheets for icon meanings.',
  },
  'pandemic': {
    title: 'Pandemic',
    shortDescription: 'Cooperative disease fighting',
    description: 'Pandemic challenges players to save the world from spreading diseases. Work together and use special roles.',
    pros: ['Cooperative', 'Challenging', 'Teamwork', 'Thematic'],
    cons: ['Can be stressful', 'Complex rules'],
    parentTip: 'Adult should manage disease cubes while children focus on strategy.',
  },
  'mysterium': {
    title: 'Mysterium',
    shortDescription: 'Cooperative ghost mystery with beautiful illustrations',
    description: 'In Mysterium, one player is a ghost sending visions to mediums trying to solve their murder.',
    pros: ['Unique theme', 'Beautiful art', 'Cooperative', 'Imaginative'],
    cons: ['Can be frustrating', 'Long play time', 'One player has different role'],
    parentTip: 'The ghost role is best for adults who can stay silent and patient.',
  },
  'castle-panic': {
    title: 'Castle Panic',
    shortDescription: 'Cooperative tower defense board game',
    description: 'Castle Panic has players defending their castle from hordes of monsters. Play cards together to slay orcs, goblins and trolls.',
    pros: ['Cooperative', 'Tower defense theme', 'Family friendly', 'Exciting'],
    cons: ['Can feel random', 'Limited strategy'],
    parentTip: 'Great introduction to cooperative gaming.',
  },
  'bluey-board-game': {
    title: 'Bluey Board Game',
    shortDescription: 'Fun games with Bluey and her family',
    description: 'Join Bluey, Bingo, Bandit and Chilli in this fun board game collection.',
    pros: ['Popular characters', 'Simple rules', 'Multiple games in one', 'Good for young fans'],
    cons: ['Only for Bluey fans', 'Simple gameplay'],
    parentTip: 'Perfect if your children love the Bluey TV show.',
  },
  'shopping-list': {
    title: 'Shopping List',
    shortDescription: 'Memory game for children learning to shop',
    description: 'Shopping List is a memory game where children must find all items on their list.',
    pros: ['Teaches practical skills', 'Good memory training', 'Nice illustrations', 'Multiple ways to play'],
    cons: ['Cards can wear out', 'Limited items'],
    parentTip: 'Great preparation for real shopping trips.',
  },
  'duck-and-cover': {
    title: 'Duck and Cover',
    shortDescription: 'Quick card game with ducks',
    description: 'A fast-paced card game where ducks try to avoid the fox.',
    pros: ['Quick games', 'Easy rules', 'Cute theme', 'Portable'],
    cons: ['Light gameplay', 'Can feel random'],
    parentTip: 'Good for travel or waiting rooms.',
  },
  'micromacro-kids': {
    title: 'MicroMacro: Kids',
    shortDescription: 'Detective game on a giant city map',
    description: 'MicroMacro Kids has players solving mysteries by examining a giant detailed city map.',
    pros: ['Unique concept', 'Cooperative', 'Develops observation', 'Replayable'],
    cons: ['Map takes space', 'Can be hard to see details'],
    parentTip: 'Use a magnifying glass for extra fun!',
  },
  'flip-7': {
    title: 'Flip 7',
    shortDescription: 'Quick number card game',
    description: 'Flip 7 is a push-your-luck card game where you try to get closest to 7 without going over.',
    pros: ['Quick to learn', 'Exciting', 'Math practice', 'Portable'],
    cons: ['Pure luck', 'Very simple'],
    parentTip: 'Good for practicing number recognition.',
  },
  'jungo': {
    title: 'Jungo',
    shortDescription: 'Animal matching game',
    description: 'Jungo has players matching animals in a fun jungle theme.',
    pros: ['Simple rules', 'Cute animals', 'Good for youngest', 'Durable'],
    cons: ['Very simple', 'Limited depth'],
    parentTip: 'Good first game for toddlers.',
  },
  'disney-hidden-realms': {
    title: 'Disney Hidden Realms',
    shortDescription: 'Discover Disney worlds together',
    description: 'Disney Hidden Realms has players exploring magical Disney worlds together.',
    pros: ['Disney characters', 'Cooperative', 'Beautiful art', 'Family friendly'],
    cons: ['Only for Disney fans', 'Can be simple'],
    parentTip: 'Perfect for Disney-loving families.',
  },
  'star-wars-super-teams': {
    title: 'Star Wars: Super Teams',
    shortDescription: 'Star Wars team battle game',
    description: 'Star Wars Super Teams pits iconic characters against each other in team battles.',
    pros: ['Star Wars theme', 'Quick games', 'Team play', 'Cool characters'],
    cons: ['Only for Star Wars fans', 'Light strategy'],
    parentTip: 'Great for young Star Wars fans.',
  },
  // NEW BOARD GAMES 2025
  'snug-as-a-bug-in-a-rug': {
    title: 'Snug as a Bug in a Rug',
    shortDescription: 'Hide the bugs under the rug before the stink bugs come',
    description: 'Snug as a Bug in a Rug is an adjustable cooperative game for the youngest. The goal is to get the colorful bugs snug under the rug before the stink bugs reach the top of the board. With three difficulty levels, the game grows with your child.',
    pros: ['Three difficulty levels', 'Cooperative game', 'Cute bugs kids love', 'Teaches colors and counting'],
    cons: ['Can become too easy', 'Limited strategic depth'],
    parentTip: 'Start on easy mode and work your way up - the game grows with your child.',
  },
  'pete-the-cat-missing-cupcakes': {
    title: 'Pete the Cat: The Missing Cupcakes Game',
    shortDescription: 'Help Pete find the missing cupcakes',
    description: 'Pete the Cat: The Missing Cupcakes Game is based on the popular children\'s book series. It\'s a cooperative game where everyone works together to get cupcakes back from the grumpy toad.',
    pros: ['Popular character from books', 'Cooperative game', 'Includes movement', 'No reading required'],
    cons: ['Primarily for book fans', 'Simple gameplay'],
    parentTip: 'Read the Pete the Cat books first - it makes the game much more fun!',
  },
  'richard-scarry-busytown': {
    title: 'Richard Scarry\'s Busytown Eye Found It!',
    shortDescription: '6-foot board game where everyone searches together',
    description: 'Richard Scarry\'s Busytown Eye Found It! has an impressive 6-foot long game board filled with Richard Scarry\'s famous illustrations. Players work as a team to reach the ferry before the pigs eat all the food.',
    pros: ['Huge game board is impressive', 'Cooperation - everyone wins or loses', 'Fantastic illustrations', 'No losers'],
    cons: ['Requires lots of space', 'Pieces can get lost'],
    parentTip: 'The gold standard for cooperative games for young children - the big board makes it an experience!',
  },
  'race-to-the-treasure': {
    title: 'Race to the Treasure!',
    shortDescription: 'Build the path to treasure before the ogre arrives',
    description: 'Race to the Treasure is a cooperative game where players build a path to the treasure before the ogre catches it. Kids learn to plan ahead and work together to find the best route.',
    pros: ['Cooperative game', 'Teaches planning', 'Peaceable Kingdom quality', 'Good for mixed ages'],
    cons: ['Card luck affects outcomes', 'Can become repetitive'],
    parentTip: 'One of the best games for teaching strategic thinking - "if we place this here, what happens?"',
  },
  'gardlings': {
    title: 'Gardlings',
    shortDescription: 'Build your garden in this charming family strategy game',
    description: 'Gardlings combines the satisfying bag-building of Quacks with the tile-placement charm of Carcassonne. Each round becomes a lively race to collect points before anyone else.',
    pros: ['2025\'s surprise hit', 'Beautiful aesthetics', 'Easy to learn', 'Good depth'],
    cons: ['New game - limited availability', 'Can be hard to find'],
    parentTip: 'One of 2025\'s best new family games - keep an eye out for it in stores!',
  },
  'french-toast': {
    title: 'French Toast',
    shortDescription: 'Simple guessing game with electric tension',
    description: 'French Toast is a simple but addictive game filled with exciting guesses and tempting "one more time" moments. Rules are learned in minutes and work equally well with experienced players as with families with kids.',
    pros: ['Super easy to learn', 'Quick rounds', 'Addictive', 'Great for parties'],
    cons: ['Simple for strategy lovers', 'Luck-based'],
    parentTip: 'Perfect for family parties or when fun is needed quickly.',
  },
  'fate-of-the-fellowship': {
    title: 'Fate of the Fellowship',
    shortDescription: 'Lord of the Rings cooperative game from the Pandemic creator',
    description: 'Fate of the Fellowship is designed by Matt Leacock (creator of Pandemic) and lets players relive the Lord of the Rings story. As a cooperative game, 1-5 players guide the Fellowship toward Mount Doom.',
    pros: ['From Pandemic creator', 'Epic storytelling', 'Fantastic cooperation', 'High production value'],
    cons: ['Longer play time', 'Complex for younger kids'],
    parentTip: 'Perfect for families who love Lord of the Rings - an epic game night!',
  },
  'the-old-kings-crown': {
    title: 'The Old King\'s Crown',
    shortDescription: '2025\'s most captivating strategy game',
    description: 'The Old King\'s Crown is a surprising success that has taken the board game world by storm. It has been called "the most captivating board game I\'ve ever played." It combines smart pacing and beautifully balanced strategic gameplay with a fantastic fantasy theme.',
    pros: ['Fantastic gameplay', 'Beautiful design', 'Deep strategy', 'High replayability'],
    cons: ['Higher price', 'Complex for new players'],
    parentTip: 'One of the best strategy games in recent times - perfect for families wanting more challenge.',
  },
  'quacks-of-quedlinburg': {
    title: 'Quacks of Quedlinburg',
    shortDescription: 'Bag-building potion game with explosive potential',
    description: 'Quacks of Quedlinburg is an addictive bag-building game where you brew potions as a quack doctor. Draw ingredients from your bag and push-your-luck - but watch out for the white cherry bombs that can make your cauldron explode! Winner of Kennerspiel des Jahres 2018.',
    pros: ['Kennerspiel winner', 'Addictive gameplay', 'Everyone plays simultaneously', 'New 2025 edition available'],
    cons: ['Luck can frustrate', 'Setup takes time'],
    parentTip: 'One of the best "gateway plus" games - perfect when the family is ready for more than Ticket to Ride.',
  },
  'sandcastles-of-burgundy': {
    title: 'The Sandcastles of Burgundy',
    shortDescription: 'Kid-friendly version of the beloved classic',
    description: 'The Sandcastles of Burgundy is a kid-friendly version of the iconic Castles of Burgundy. It\'s a fantastic way to introduce kids to board games with inviting design and straightforward gameplay.',
    pros: ['Kid-friendly classic', 'Inviting design', 'Good introduction to strategy', 'Short rounds'],
    cons: ['Upcoming release', 'May be hard to find'],
    parentTip: 'Coming in 2026 - watch for it as the next step up from simple family games!',
  },
};

// ============================================================================
// FRENCH TRANSLATIONS - BOARD GAMES
// ============================================================================

const boardGameTranslationsFR: Record<string, GameTranslationData> = {
  'haba-first-orchard': {
    title: 'Mon Premier Verger',
    shortDescription: 'Le premier jeu parfait pour les plus petits',
    description: 'Mon Premier Verger est le jeu parfait pour les tout-petits. Les joueurs travaillent ensemble pour récolter les fruits.',
    pros: ['Parfait dès 2 ans', 'Jeu coopératif', 'Grandes pièces en bois', 'Qualité HABA'],
    cons: ['Très simple pour les plus de 4 ans', 'Basé sur la chance'],
    parentTip: 'Le meilleur premier jeu de société!',
  },
  'ticket-to-ride-first-journey': {
    title: 'Les Aventuriers du Rail: Mon Premier Voyage',
    shortDescription: 'Introduction au jeu de train populaire',
    description: 'Mon Premier Voyage simplifie Les Aventuriers du Rail pour les plus jeunes.',
    pros: ['Enseigne la stratégie', 'Beau design', 'Basé sur un jeu primé'],
    cons: ['Peut être frustrant si bloqué', 'Nécessite de la patience'],
    parentTip: 'Jouez une partie d\'entraînement avec des cartes ouvertes.',
  },
  'catan-junior': {
    title: 'Catan Junior',
    shortDescription: 'Commerce de ressources pour jeunes stratèges',
    description: 'Catan Junior introduit les plus jeunes au monde de Catan.',
    pros: ['Introduction au commerce', 'Franchise bien-aimée', 'Thème pirate'],
    cons: ['Négociation nécessaire', 'Peut être long'],
    parentTip: 'Montrez un comportement commercial équitable.',
  },
  'dixit': {
    title: 'Dixit',
    shortDescription: 'Narration avec de belles illustrations surréalistes',
    description: 'Dixit stimule l\'imagination à travers des illustrations oniriques.',
    pros: ['Magnifiques illustrations', 'Créatif', 'Développe le langage'],
    cons: ['Nécessite 3+ joueurs', 'Abstrait pour les plus jeunes'],
    parentTip: 'Acceptez toutes les tentatives - la créativité compte plus que la victoire.',
  },
  'kingdomino': {
    title: 'Kingdomino',
    shortDescription: 'Construction de royaume en dominos',
    description: 'Kingdomino permet de construire des royaumes en faisant correspondre les terrains. Jeu de l\'Année 2017.',
    pros: ['Primé', 'Parties rapides', 'Choix stratégiques', 'Belles tuiles'],
    cons: ['Le calcul des points nécessite de la pratique'],
    parentTip: 'Concentrez-vous d\'abord sur la correspondance.',
  },
  'pandemic': {
    title: 'Pandemic',
    shortDescription: 'Combat coopératif contre les maladies',
    description: 'Pandemic défie les joueurs de sauver le monde des maladies qui se propagent.',
    pros: ['Coopératif', 'Stimulant', 'Travail d\'équipe', 'Thématique'],
    cons: ['Peut être stressant', 'Règles complexes'],
    parentTip: 'L\'adulte devrait gérer les cubes de maladie.',
  },
  'ticket-to-ride': {
    title: 'Les Aventuriers du Rail',
    shortDescription: 'Classique de construction de routes ferroviaires',
    description: 'Les Aventuriers du Rail fait collecter des cartes et réclamer des routes.',
    pros: ['Classique', 'Facile à apprendre', 'Profondeur stratégique', 'Beau design'],
    cons: ['Peut bloquer les autres', 'Durée de jeu'],
    parentTip: 'Commencez avec la carte USA.',
  },
  'azul': {
    title: 'Azul',
    shortDescription: 'Belle construction de motifs en tuiles',
    description: 'Azul fait drafting de tuiles colorées pour construire des motifs. Jeu de l\'Année.',
    pros: ['Beau design', 'Primé', 'Profondeur stratégique'],
    cons: ['Scoring complexe', 'Abstrait'],
    parentTip: 'Concentrez-vous d\'abord sur la construction de motifs.',
  },
  'forbidden-island': {
    title: 'L\'Île Interdite',
    shortDescription: 'Sauvetage coopératif de trésors',
    description: 'L\'Île Interdite défie les joueurs de collecter des trésors avant que l\'île ne coule.',
    pros: ['Coopératif', 'Difficulté variable', 'Stratégique', 'Beaux composants'],
    cons: ['Peut être tendu', 'Lecture requise'],
    parentTip: 'Discutez des plans ensemble.',
  },
  'blokus': {
    title: 'Blokus',
    shortDescription: 'Jeu de territoire style Tetris',
    description: 'Blokus fait placer des pièces style Tetris, se touchant uniquement aux coins.',
    pros: ['Pensée spatiale', 'Stratégique', 'Règles simples', 'Quatre joueurs'],
    cons: ['Compétitif', 'Peut être frustrant'],
    parentTip: 'Commencez avec les petites pièces.',
  },
};

// ============================================================================
// SPANISH TRANSLATIONS - BOARD GAMES
// ============================================================================

const boardGameTranslationsES: Record<string, GameTranslationData> = {
  'haba-first-orchard': {
    title: 'Mi Primer Huerto',
    shortDescription: 'El primer juego perfecto para los más pequeños',
    description: 'Mi Primer Huerto es el juego perfecto para los más pequeños. Los jugadores trabajan juntos para cosechar frutas.',
    pros: ['Perfecto desde 2 años', 'Juego cooperativo', 'Piezas grandes de madera', 'Calidad HABA'],
    cons: ['Muy simple para mayores de 4', 'Basado en suerte'],
    parentTip: 'El mejor primer juego de mesa!',
  },
  'ticket-to-ride-first-journey': {
    title: 'Aventureros al Tren: Mi Primer Viaje',
    shortDescription: 'Introducción al popular juego de trenes',
    description: 'Mi Primer Viaje simplifica Aventureros al Tren para jugadores más jóvenes.',
    pros: ['Enseña estrategia', 'Diseño hermoso', 'Basado en juego premiado'],
    cons: ['Puede ser frustrante si te bloquean', 'Requiere paciencia'],
    parentTip: 'Juega una ronda de práctica con cartas abiertas.',
  },
  'catan-junior': {
    title: 'Catan Junior',
    shortDescription: 'Comercio de recursos para jóvenes estrategas',
    description: 'Catan Junior introduce a los jugadores más jóvenes al mundo de Catan.',
    pros: ['Introduce el comercio', 'Franquicia querida', 'Tema pirata'],
    cons: ['Se necesita negociación', 'Puede ser largo'],
    parentTip: 'Modela comportamiento comercial justo.',
  },
  'dixit': {
    title: 'Dixit',
    shortDescription: 'Narración con hermosas ilustraciones surrealistas',
    description: 'Dixit estimula la imaginación a través de ilustraciones oníricas.',
    pros: ['Ilustraciones impresionantes', 'Creativo', 'Desarrollo del lenguaje'],
    cons: ['Necesita 3+ jugadores', 'Abstracto para los más jóvenes'],
    parentTip: 'Acepta todos los intentos - la creatividad importa más que ganar.',
  },
  'kingdomino': {
    title: 'Kingdomino',
    shortDescription: 'Construcción de reinos con dominós',
    description: 'Kingdomino tiene jugadores construyendo reinos haciendo coincidir tipos de terreno. Juego del Año 2017.',
    pros: ['Premiado', 'Partidas rápidas', 'Elecciones estratégicas', 'Fichas hermosas'],
    cons: ['Puntuación requiere práctica'],
    parentTip: 'Enfócate primero en hacer coincidir.',
  },
  'pandemic': {
    title: 'Pandemic',
    shortDescription: 'Combate cooperativo contra enfermedades',
    description: 'Pandemic desafía a los jugadores a salvar el mundo de enfermedades que se propagan.',
    pros: ['Cooperativo', 'Desafiante', 'Trabajo en equipo', 'Temático'],
    cons: ['Puede ser estresante', 'Reglas complejas'],
    parentTip: 'El adulto debería manejar los cubos de enfermedad.',
  },
  'ticket-to-ride': {
    title: 'Aventureros al Tren',
    shortDescription: 'Clásico de construcción de rutas ferroviarias',
    description: 'Aventureros al Tren hace coleccionar cartas y reclamar rutas.',
    pros: ['Clásico', 'Fácil de aprender', 'Profundidad estratégica', 'Diseño hermoso'],
    cons: ['Puede bloquear a otros', 'Duración del juego'],
    parentTip: 'Comienza con el mapa de USA.',
  },
  'azul': {
    title: 'Azul',
    shortDescription: 'Hermosa construcción de patrones con azulejos',
    description: 'Azul hace drafting de azulejos coloridos para construir patrones. Juego del Año.',
    pros: ['Diseño hermoso', 'Premiado', 'Profundidad estratégica'],
    cons: ['Puntuación compleja', 'Abstracto'],
    parentTip: 'Enfócate primero en construir patrones.',
  },
  'forbidden-island': {
    title: 'La Isla Prohibida',
    shortDescription: 'Rescate cooperativo de tesoros',
    description: 'La Isla Prohibida desafía a los jugadores a recolectar tesoros antes de que la isla se hunda.',
    pros: ['Cooperativo', 'Dificultad variable', 'Estratégico', 'Componentes hermosos'],
    cons: ['Puede ser tenso', 'Se requiere lectura'],
    parentTip: 'Discutan planes juntos.',
  },
  'blokus': {
    title: 'Blokus',
    shortDescription: 'Juego de territorio estilo Tetris',
    description: 'Blokus hace colocar piezas estilo Tetris, tocándose solo en las esquinas.',
    pros: ['Pensamiento espacial', 'Estratégico', 'Reglas simples', 'Cuatro jugadores'],
    cons: ['Competitivo', 'Puede ser frustrante'],
    parentTip: 'Comienza con las piezas pequeñas.',
  },
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌍 Seeding ALL translations...');

  // Get all games from database
  const games = await prisma.game.findMany();
  const boardGames = await prisma.boardGame.findMany();

  console.log(`📱 Found ${games.length} digital games`);
  console.log(`🎲 Found ${boardGames.length} board games`);

  // Clear existing translations
  await prisma.gameTranslation.deleteMany();
  await prisma.boardGameTranslation.deleteMany();
  console.log('🗑️  Cleared existing translations');

  let gameTranslationCount = 0;
  let boardGameTranslationCount = 0;

  // Create translations for digital games
  for (const game of games) {
    // English
    const enTranslation = digitalGameTranslationsEN[game.slug];
    if (enTranslation) {
      await prisma.gameTranslation.create({
        data: {
          gameId: game.id,
          locale: 'en',
          title: enTranslation.title,
          description: enTranslation.description,
          shortDescription: enTranslation.shortDescription,
          pros: JSON.stringify(enTranslation.pros),
          cons: JSON.stringify(enTranslation.cons),
          parentTip: enTranslation.parentTip,
        },
      });
      gameTranslationCount++;
    }

    // French
    const frTranslation = digitalGameTranslationsFR[game.slug];
    if (frTranslation) {
      await prisma.gameTranslation.create({
        data: {
          gameId: game.id,
          locale: 'fr',
          title: frTranslation.title,
          description: frTranslation.description,
          shortDescription: frTranslation.shortDescription,
          pros: JSON.stringify(frTranslation.pros),
          cons: JSON.stringify(frTranslation.cons),
          parentTip: frTranslation.parentTip,
        },
      });
      gameTranslationCount++;
    }

    // Spanish
    const esTranslation = digitalGameTranslationsES[game.slug];
    if (esTranslation) {
      await prisma.gameTranslation.create({
        data: {
          gameId: game.id,
          locale: 'es',
          title: esTranslation.title,
          description: esTranslation.description,
          shortDescription: esTranslation.shortDescription,
          pros: JSON.stringify(esTranslation.pros),
          cons: JSON.stringify(esTranslation.cons),
          parentTip: esTranslation.parentTip,
        },
      });
      gameTranslationCount++;
    }
  }

  // Create translations for board games
  for (const game of boardGames) {
    // English
    const enTranslation = boardGameTranslationsEN[game.slug];
    if (enTranslation) {
      await prisma.boardGameTranslation.create({
        data: {
          boardGameId: game.id,
          locale: 'en',
          title: enTranslation.title,
          description: enTranslation.description,
          shortDescription: enTranslation.shortDescription,
          pros: JSON.stringify(enTranslation.pros),
          cons: JSON.stringify(enTranslation.cons),
          parentTip: enTranslation.parentTip,
        },
      });
      boardGameTranslationCount++;
    }

    // French
    const frTranslation = boardGameTranslationsFR[game.slug];
    if (frTranslation) {
      await prisma.boardGameTranslation.create({
        data: {
          boardGameId: game.id,
          locale: 'fr',
          title: frTranslation.title,
          description: frTranslation.description,
          shortDescription: frTranslation.shortDescription,
          pros: JSON.stringify(frTranslation.pros),
          cons: JSON.stringify(frTranslation.cons),
          parentTip: frTranslation.parentTip,
        },
      });
      boardGameTranslationCount++;
    }

    // Spanish
    const esTranslation = boardGameTranslationsES[game.slug];
    if (esTranslation) {
      await prisma.boardGameTranslation.create({
        data: {
          boardGameId: game.id,
          locale: 'es',
          title: esTranslation.title,
          description: esTranslation.description,
          shortDescription: esTranslation.shortDescription,
          pros: JSON.stringify(esTranslation.pros),
          cons: JSON.stringify(esTranslation.cons),
          parentTip: esTranslation.parentTip,
        },
      });
      boardGameTranslationCount++;
    }
  }

  console.log('');
  console.log('✅ Translations created:');
  console.log(`   Digital games: ${gameTranslationCount} translations`);
  console.log(`   Board games: ${boardGameTranslationCount} translations`);
  console.log('');
  console.log('🎉 Translation seeding complete!');
  console.log('');
  console.log('💡 Note: Games without translations will fall back to Danish content.');
}

main()
  .catch((e) => {
    console.error('❌ Translation seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
