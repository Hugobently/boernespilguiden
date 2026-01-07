const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Deep reviews for Apple Arcade games (600-900 characters each)
const appleArcadeUpdates = [
  {
    slug: 'sneaky-sasquatch',
    description: 'Sneaky Sasquatch er et af Apple Arcades absolutte highlights og en sand perle for børn og voksne. Du spiller som en nysgerrig Sasquatch der bor i en nationalpark og må snige sig rundt blandt campister for at stjæle mad fra picnickurve. Men spillet udvikler sig hurtigt til meget mere - snart kan du køre bil, arbejde som golfspiller, taxachauffør eller endda pilot, fiske i søen, deltage i racerløb og udforske en overraskende stor åben verden. Humoren er mild og charmerende, og kontrollen er perfekt til touchskærme. Det bedste er at spillet konstant får gratis opdateringer med nyt indhold - nye jobs, nye områder, nye eventyr. Grafikken er simpel men fuld af personlighed, og lyddesignet er hyggeligt og stemningsfuldt. Et must-have for alle Apple Arcade-abonnenter - dette er et spil hele familien kan nyde sammen.',
    iconUrl: '/images/games/digital/sneaky-sasquatch.webp'
  },
  {
    slug: 'tangle-tower',
    description: 'Tangle Tower er et smukt håndtegnet point-and-click eventyrspil hvor du som detektiv skal løse et tilsyneladende umuligt mord i et mystisk tårn. Grafikken er fantastisk med detaljerede baggrunde og charmerende karakteranimationer, og det engelske stemmeskuespil er i topklasse. Du udforsker tårnet, samler beviser, og interviewer en excentrisk familie hvor alle synes at have noget at skjule. Gåderne er veldesignede - udfordrende nok til at føles tilfredsstillende, men aldrig så svære at man sidder fast. Historien er engagerende med overraskende twists, og humoren er intelligent uden at være over hovedet på børn. Spillet tager 4-6 timer at gennemføre, hvilket er perfekt til en weekend. Anbefales til børn der elsker mysterier, og som bonus er det et fantastisk spil at løse sammen som familie. Et af Apple Arcades mest roste spil med god grund.',
    iconUrl: '/images/games/digital/tangle-tower.webp'
  },
  {
    slug: 'lego-brawls',
    description: 'LEGO Brawls lader dig skabe din helt egen LEGO-minifigur fra bunden med tusindvis af kombinationsmuligheder - vælg hoved, krop, ben, hat, tilbehør og våben. Derefter kæmper du mod andre spillere i farverige arenaer inspireret af populære LEGO-temaer som Ninjago, Jurassic World, LEGO Movie og klassiske LEGO-verdener. Gameplayet er simpelt men sjovt - saml power-ups, undgå farer og slå modstanderne ud af arenaen. Der er både online multiplayer mod andre Apple Arcade-spillere og lokal multiplayer hvor op til 4 spillere kan spille på samme skærm via Apple TV - perfekt til familieaftener. Baner er varierede med unikke mekanikker, og nye temaer tilføjes løbende. Stilen er ægte LEGO med farverig grafik og humoristisk lyd. Et tilgængeligt brawler-spil der fungerer godt for både børn og voksne LEGO-fans.',
    iconUrl: '/images/games/digital/lego-brawls.webp'
  },
  {
    slug: 'patterned',
    description: 'Patterned er et roligt og meditativt puslespil hvor du samler smukke mønstre inspireret af kunst, natur og kulturer fra hele verden. Der er ingen tidspres, ingen point og ingen måder at fejle på - bare smukke billeder der langsomt bliver til under dine fingre. Interfacet er elegant og minimalistisk med bløde farver og rolig musik der skaber en næsten terapeutisk atmosfære. Mønstrene spænder fra japanske kimonobroderi over marokkanske fliser til skandinaviske tekstiler, og hvert puslespil lærer børn om forskellige kulturelle udtryk. Puslespillene varierer i sværhedsgrad, så både små og store kan finde udfordringer der passer. Nye puslespil tilføjes løbende, så der altid er nyt at opdage. Perfekt som en beroligende aktivitet før sengetid eller som en rolig pause i en travl dag. Appen fungerer fint offline efter download og er helt uden forstyrrende elementer.',
    iconUrl: '/images/games/digital/patterned.webp'
  },
  {
    slug: 'cut-the-rope-3',
    description: 'Cut the Rope 3 bringer det klassiske gameplay tilbage med helt nye mekanikker og verdener. Den søde lille grønne Om Nom vil stadig have sine slik, og du skal stadig klippe reb for at få det til ham - men nu er der nye karakterer at møde, nye udfordringer at løse og nye måder at tænke kreativt på. Spillet introducerer gradvist nye elementer som balloner, bobler, teleportere og tyngdekraftfelter, så hjernen hele tiden får nye udfordringer. Grafikken er opdateret og smuk med levende animationer, og Om Noms udtryk er mere charmerende end nogensinde. Apple Arcade-versionen er helt uden reklamer og ventetider - bare ren puslespil-sjov fra start til slut. Der er hundredvis af levels at gennemføre, og stjerne-systemet belønner kreative løsninger. Gåderne lærer grundlæggende fysik-koncepter på en sjov måde, og sværhedsgraden stiger gradvist så alle kan følge med.',
    iconUrl: '/images/games/digital/cut-the-rope-3.webp'
  },
  {
    slug: 'altos-odyssey-lost-city',
    description: 'Alto\'s Odyssey: The Lost City er en udvidet version af det prisbelønnede sandboarding-spil, nu med eksklusivt Apple Arcade-indhold. Du glider ned ad endeløse sanddyner, springer over kløfter, lander tricks og udforsker en mystisk ørkenverden fyldt med gamle ruiner og skjulte hemmeligheder. Grafikken er betagende smuk med dynamiske dag/nat-cyklusser, dramatiske solnedgange og vejrskift fra sandstorme til stille nætter med stjernehimmel. Musikken er atmosfærisk og beroligende og skaber en næsten meditativ oplevelse. Kontrollen er enkel - tryk for at hoppe, hold for at lave backflip - men at mestre spillet tager tid. The Lost City-udvidelsen tilføjer nye områder og mysterier at opdage. Spillet har også en Zen Mode helt uden mål eller point, bare ren afslappende sandboarding. Perfekt til korte pauser eller længere rolige stunder.',
    iconUrl: '/images/games/digital/altos-odyssey.webp'
  },
  {
    slug: 'crossy-road-castle',
    description: 'Crossy Road Castle tager de elskede karakterer fra det originale Crossy Road og sætter dem i et helt nyt kooperativt platformspil. Op til 4 spillere hopper sammen gennem procedurelt genererede slotniveauer der bliver sværere og sværere jo højere op I kommer. Hver karakter har sin egen unikke evne, og samarbejde er nøglen til succes - hjælp hinanden over farlige huller og del power-ups for at komme længst muligt. Der er hundredvis af figurer at låse op fra klassiske Crossy Road-karakterer til helt nye designs. Grafikken har den velkendte voxel-stil, og kontrollen er simpel nok til at små børn kan være med. Spillet har også online multiplayer, men det bedste er den lokale multiplayer på Apple TV hvor hele familien kan sidde i sofaen og spille sammen. Humoristisk, farverigt og overraskende vanedannende.',
    iconUrl: '/images/games/digital/crossy-road-castle.webp'
  },
  {
    slug: 'sonic-racing',
    description: 'Sonic Racing bringer den blå pindsvin og hans venner til Apple Arcade i et teambaseret racerspil med fuld fart. Vælg mellem 15 ikoniske karakterer fra Sonic-universet - Sonic, Tails, Knuckles, Amy, Dr. Eggman og mange flere - og kør gennem farverige baner inspireret af klassiske Sonic-spil. Det unikke ved dette racerspil er team-mekanikken: du kører som et hold af tre, og kan dele power-ups, booste hinanden og koordinere angreb på modstandere. Kontrollen er tilpasset touchskærme med tilt-styring eller virtuelle knapper, men spillet understøtter også controllers for en mere traditionel oplevelse. Banerne er varierede med loops, genveje og mange power-ups at samle. Grafik og musik er ægte Sonic-kvalitet med fart og farver. Der er både single-player kampagne og online multiplayer mod andre Apple Arcade-spillere.',
    iconUrl: '/images/games/digital/sonic-racing.webp'
  },
  {
    slug: 'spire-blast',
    description: 'Spire Blast kombinerer match-3 mekanikker med tilfredsstillende fysik-baseret destruktion. Du skyder farveblokke mod høje tårne og matcher tre eller flere af samme farve for at få dem til at forsvinde. Målet er at vælte hele tårnet og redde de søde små væsner fanget indeni. Det lyder simpelt, men der er overraskende dybde - du skal tænke strategisk over hvilke blokke du rammer først for at få tårnet til at kollapse på den rigtige måde. Fysikken er tilfredsstillende realistisk, og det er utroligt tilfredsstillende at se et stort tårn vælte efter det perfekte skud. Med over 200 håndlavede niveauer og daglige udfordringer er der masser af indhold. Sværhedsgraden stiger gradvist, og der er ingen tidspres på de fleste baner så børn kan tænke sig om. Søde karakterer, farverig grafik og enkelt gameplay gør dette til et perfekt casual-spil.',
    iconUrl: '/images/games/digital/spire-blast.webp'
  },
  {
    slug: 'sago-mini-friends',
    description: 'Sago Mini Friends er designet med kærlighed til de allermindste. Besøg fem forskellige venners huse og deltag i hverdagsaktiviteter som at lave mad i køkkenet, plante blomster i haven, bade i badeværelset, lege med legetøj og meget mere. Der er ingen regler, ingen mål og ingen måder at fejle på - bare fri leg og udforskning i trygge rammer. De runde, farverige karakterer er designet af pædagoger til at være beroligende og venlige, og interfacet er perfekt til små fingre med store knapper og ingen komplicerede menuer. Lydeffekterne er bløde og behagelige, og der er ingen tale så sproget er ingen barriere. Appen kan bruges helt offline efter download, og der er selvfølgelig ingen reklamer, køb eller links ud af appen. Sago Mini er kendt for deres højkvalitets småbørnsapps, og denne er ingen undtagelse.',
    iconUrl: '/images/games/digital/sago-mini-friends.webp'
  },
  {
    slug: 'my-talking-tom-friends',
    description: 'My Talking Tom Friends samler hele banden - Tom, Angela, Hank, Ginger og Ben - i ét stort hus hvor du skal passe på dem alle sammen. Giv dem mad når de er sultne, put dem i seng når de er trætte, giv dem bad når de er beskidte, og leg med dem når de keder sig. Apple Arcade-versionen er den premium-oplevelse som det gratis spil burde have været - ingen irriterende reklamer der afbryder hvert andet minut, ingen ventetider og ingen manipulerende købs-prompts. Karaktererne reagerer på berøring med sjove animationer og gentager hvad du siger med morsomme stemmer. Der er masser af minispil at spille, tøj at samle og dekorationer til huset. Simpelt gameplay der holder små børn beskæftiget, og forældrene kan slappe af uden at bekymre sig om at barnet klikker på reklamer eller køb.',
    iconUrl: '/images/games/digital/my-talking-tom-friends.webp'
  },
  {
    slug: 'the-get-out-kids',
    description: 'The Get Out Kids er et charmerende eventyrspil hvor en gruppe modige børn udforsker mystiske steder og løser gåder sammen. Tænk Stranger Things eller Goonies for børn - men helt uden de skræmmende elementer. Hvert barn i gruppen har unikke evner der skal bruges til at komme videre: én kan klatre, én er stærk, én er klog. Du skifter mellem karaktererne for at løse puslespil der kræver samarbejde og kreativ tænkning. Grafikken er håndtegnet med en varm, nostalgisk stil der minder om børnebøger, og atmosfæren er spændende uden at være uhyggelig. Historien udfolder sig gennem kapitler med nye mysterier at løse og hemmeligheder at opdage. Kontrollen er enkel og intuitiv, og hints er tilgængelige hvis man sidder fast. Perfekt til børn der elsker mysterier og eventyr, og et godt spil at spille sammen med forældre.',
    iconUrl: '/images/games/digital/the-get-out-kids.webp'
  },
  {
    slug: 'transformers-tactical-arena',
    description: 'Transformers Tactical Arena er et turbaseret strategispil hvor du bygger dit hold af legendariske Transformers og kæmper mod AI eller andre spillere. Saml ikoniske karakterer som Optimus Prime, Bumblebee, Megatron, Starscream og mange flere fra både Autobots og Decepticons. Kampene foregår på et taktisk gitter hvor placering, timing og brug af specielle evner er afgørende for sejr. Hver Transformer har unikke angreb og kan selvfølgelig transformere mellem robot- og køretøjsform med forskellige fordele. Spillet lærer strategisk tænkning og planlægning uden at være for komplekst for børn. Transformations-animationerne er flotte, og lyden er ægte Transformers-kvalitet med ikoniske transformationslyde. Der er en single-player kampagne at gennemføre og online kampe mod andre spillere. Perfekt til Transformers-fans der vil have mere end bare action.',
    iconUrl: '/images/games/digital/transformers-tactical-arena.webp'
  },
  {
    slug: 'wylde-flowers',
    description: 'Wylde Flowers er en overraskende dyb farm-simulator med et magisk twist - du arver din bedstemors gård og opdager langsomt at landsbyen har en hemmelig hekse-kreds. Dyrk afgrøder, pas dyr, fisk, lav mad og sælg varer som i klassiske farm-spil, men lær også at brygge trylledrikke, kaste besværgelser og flyve på kosteskaft. Historien er varm og inkluderende med diverse karakterer og relationer at opbygge. Stemmeskuespillet er fremragende med fuldt indtalte dialoger. Grafikken er farverig og hyggelig, og der er overraskende meget indhold - kampagnen kan tage 40+ timer at gennemføre. Hekse-temaet er venligt og Sabrina-agtigt uden skræmmende elementer. Spillet har et roligt tempo uden tidspres, så børn kan nyde det i deres eget tempo. Et af Apple Arcades mest omfattende og elskede spil.',
    iconUrl: '/images/games/digital/wylde-flowers.webp'
  },
  {
    slug: 'cooking-mama-cuisine',
    description: 'Cooking Mama er tilbage på Apple Arcade med Cooking Mama: Cuisine! Følg opskrifter trin-for-trin og lav retter fra hele verden med Mamas vejledning. Skær grøntsager med swipe-bevægelser, rør i gryden ved at dreje fingeren, bag i ovnen med præcis timing - alt styres med intuitive touch-bevægelser der føles naturlige. Mama guider dig med sin karakteristiske entusiasme og opmuntring, og selv når du laver fejl er hun altid venlig. Apple Arcade-versionen er fri for de irriterende energi-systemer og ventetider der plager gratis Cooking Mama-spil - du kan bare spille og lave mad så meget du vil. Der er hundredvis af opskrifter at mestre fra simple snacks til avancerede retter, og nye opskrifter tilføjes løbende. Spillet lærer om mad og køkkenteknikker på en sjov måde og kan inspirere børn til at hjælpe til i det rigtige køkken.',
    iconUrl: '/images/games/digital/cooking-mama-cuisine.webp'
  },
  {
    slug: 'mineko-night-market',
    description: 'Mineko\'s Night Market er et hyggeligt og charmerende spil hvor du hjælper Mineko med at finde sin plads i en lille japansk landsby og drive en bod på det lokale natmarked. Saml materialer i skoven, lav håndværk og kunsthåndværk, dyrk afgrøder i din have, og sælg dine varer på markedet hver weekend. Landsbyen er fyldt med venlige karakterer at møde og katte at finde - inklusiv den mystiske legendariske kæmpekat Abe der har en vigtig rolle i historien. Kunststilen er smuk og japansk-inspireret med bløde farver og detaljerede pixel-baggrunde. Stemningen er afslappet og venlig uden stress eller tidspres. Spillet introducerer japansk kultur på en respektfuld og tilgængelig måde gennem mad, traditioner og festivaler. Perfekt til dem der elsker kreative spil som Animal Crossing og Stardew Valley.',
    iconUrl: '/images/games/digital/mineko-night-market.webp'
  },
  {
    slug: 'stitch',
    description: 'Stitch. lader dig skabe smukke broderier på din skærm sting for sting. Vælg mellem hundredvis af mønstre - fra simple blomster og dyr til komplekse kunstværker og berømte malerier - og sy dem langsomt til live. Det lyder simpelt, men det er overraskende meditativt og tilfredsstillende at se mønstret tage form under dine fingre. Lyddesignet er ASMR-agtigt med bløde klik fra nålen, og den rolige musik skaber en afslappende atmosfære. Der er ingen tidspres, ingen point, ingen konkurrence - bare rolig kreativitet. Nye mønstre tilføjes løbende med temaer fra årstider til popkultur. Spillet kan også inspirere til ægte broderi som hobby - det viser de grundlæggende teknikker på en visuel måde. Perfekt som en beroligende aktivitet før sengetid eller som en rolig pause i en travl dag. Fungerer fint offline.',
    iconUrl: '/images/games/digital/stitch.webp'
  },
  {
    slug: 'peppa-pig-party-time',
    description: 'Peppa Pig: Party Time lader de små planlægge og afholde fester med Peppa og alle hendes venner fra tv-serien. Vælg tema for festen, dekorer lokalet med balloner og bannere, vælg mad og kage, og spil sjove minispil som stoledans, piñata og gemmesteder. Alt er præsenteret i den velkendte Peppa Pig-stil med den karakteristiske britiske humor og de genkendelige stemmer. Hvis dit barn elsker Peppa Pig-serien, vil de elske at bruge tid med Peppa, George, Suzy Sheep, Danny Dog og resten af banden. Interfacet er perfekt til små hænder med store knapper og simpel navigation. Der er ingen tekst at læse, så selv de mindste kan lege selvstændigt. Selvfølgelig ingen reklamer eller køb i Apple Arcade-versionen. Et trygt og velkendt univers for Peppa-fans.',
    iconUrl: '/images/games/digital/peppa-pig-party-time.webp'
  },
  {
    slug: 'taiko-no-tatsujin-pop-tap-beat',
    description: 'Taiko no Tatsujin er Japans mest elskede rytmespil, og Pop Tap Beat bringer det til Apple Arcade med stil. Tryk på de farverige trommer i takt til musikken mens noter flyver hen over skærmen. Med over 50 sange fra forskellige genrer - J-pop, anime-temaer, klassisk musik, spilmusik og originale kompositioner - er der noget for enhver musiksmag. Sværhedsgraden kan justeres fra Easy (perfekt til små børn) til Extreme (udfordrende selv for voksne). De søde Don-chan tromme-maskotter guider dig gennem spillet med entusiasme og opmuntring. Grafikkens farverige japanske stil er en fest for øjnene, og lyden er selvfølgelig i top. Rytmespil er fantastiske til at træne timing, koordination og musikalitet. Op til 4 spillere kan spille sammen lokalt, hvilket gør det til et perfekt familiespil. En unik oplevelse du ikke finder andre steder.',
    iconUrl: '/images/games/digital/taiko-no-tatsujin.webp'
  },
  {
    slug: 'hello-kitty-island-adventure',
    description: 'Hello Kitty Island Adventure er langt mere end et simpelt Hello Kitty-spil - det er et overraskende dybt og omfattende eventyrspil. Udforsk en stor tropisk ø sammen med Hello Kitty, My Melody, Cinnamoroll, Kuromi og resten af Sanrio-karaktererne. Løs gåder for at åbne nye områder, saml materialer, dekorer din hytte, lav mad, og hjælp øens beboere med deres problemer. Der er rigtige eventyr og mysterier at opdage, ikke bare simple mini-aktiviteter. Grafikken er smuk og farverig med masser af detaljer at opdage, og karaktererne er fulde af personlighed. Spillet får løbende gratis opdateringer med nye begivenheder og indhold. Perfekt for fans af Sanrio-universet, men også for alle der elsker hyggelige eventyrspil som Animal Crossing. Et af Apple Arcades mest populære spil med god grund.',
    iconUrl: '/images/games/digital/hello-kitty-island-adventure.webp'
  }
];

async function updateAppleArcadeGames() {
  console.log('Updating Apple Arcade games with deep reviews and images...\n');

  for (const update of appleArcadeUpdates) {
    try {
      const result = await prisma.game.update({
        where: { slug: update.slug },
        data: {
          description: update.description,
          iconUrl: update.iconUrl
        }
      });
      console.log(`✓ Updated: ${result.title} (${update.description.length} chars)`);
    } catch (e: any) {
      console.log(`✗ Error updating ${update.slug}: ${e.message}`);
    }
  }

  console.log('\nDone!');
  await prisma.$disconnect();
}

updateAppleArcadeGames();
