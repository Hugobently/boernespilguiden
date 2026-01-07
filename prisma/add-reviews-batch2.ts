import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// DIGITAL GAME REVIEWS - BATCH 2
// =============================================================================

const digitalGameReviews = [
  // 0-3 ÅR
  {
    slug: 'toca-hair-salon-4',
    description: `Toca Hair Salon 4 er kreativ leg i sin reneste form. Børn bliver frisører for farverige karakterer og kan klippe, farve, krølle og style hår uden begrænsninger. Der er ingen forkerte valg – kun fantasi og eksperimenteren.

Det fysiske aspekt er vellavet. Saksen klipper realistisk, hårfarven løber ned gennem håret, og krøllejernet skaber faktiske krøller. Disse tilfredsstillende interaktioner holder børn engageret langt længere end simple tap-spil.

Toca Boca har skabt et sikkert rum for kreativ udfoldelse. Karaktererne er mangfoldige og sjove, og der er masser af tilbehør at udforske. Børn kan gemme deres kreationer og vise dem til familie.

For de allermindste er Toca Hair Salon 4 en introduktion til åben leg i digital form. Der er ingen mål, ingen tidspres – bare ren kreativ frihed med sakse og farver.`,
    parentInfo: `Toca Hair Salon 4 er en engangskøb-app uden reklamer eller yderligere køb. Den fungerer offline og er designet til selvstændig brug. Der er ingen tekst, så børn der ikke kan læse kan sagtens bruge appen.`,
    parentTip: `Lad barnet style dit hår i appen og fortæl derefter, hvad de har lavet. Det styrker sprogudvikling og giver dem stolthed over deres kreationer.`,
  },
  {
    slug: 'bluey-lets-play',
    description: `Bluey: Let's Play bringer den elskede australske tegnefilmsserie til liv som interaktiv app. Børn kan udforske Heeler-familiens hus og baghave og spille de samme fantasilege som Bluey og Bingo gør i serien.

Appen fanger seriens ånd perfekt. Her er "Keepy Uppy" med ballonen, "Magic Xylophone" der fryser tid, og mange andre aktiviteter fans vil genkende. Det føles som at træde ind i Blueys verden.

For børn der elsker Bluey, er dette drømmeopfyldelse. De kan interagere med karaktererne, udforske velkendte omgivelser og opleve den samme varme og humor som serien er kendt for.

Aktiviteterne er simple men charmerende, perfekt tilpasset de mindste fans. Der er ingen komplekse regler – bare åben leg i et velkendt univers fyldt med kærlighed og fantasi.`,
    parentInfo: `Bluey: Let's Play er gratis at downloade med køb for at låse op for alle aktiviteter. Der er ingen reklamer. Appen er baseret på ABC Kids' serie og holder samme familievenlige standard.`,
    parentTip: `Se Bluey-afsnit sammen og spil derefter de samme lege i appen. Det forbinder skærmtid med fælles oplevelser og samtaler om venskab og fantasi.`,
  },
  {
    slug: 'lego-duplo-world',
    description: `LEGO DUPLO World overfører den taktile glæde ved DUPLO-klodser til en digital oplevelse. Børn bygger, leger og udforsker i farverige verdener fyldt med tog, dyr og eventyr – alt sammen med de velkendte DUPLO-figurer.

Appen er opdelt i tematiske verdener: En togstation hvor børn styrer lokomotiver, en bondegård med dyr der skal fodres, og meget mere. Hver verden tilbyder forskellige aktiviteter der kombinerer byggeri med rollespil.

Det digitale format tillader ting fysiske klodser ikke kan. Tog kører på skinnerne børn bygger, dyr reagerer på interaktion, og bygninger kommer til live med animationer. Det er DUPLO med ekstra magi.

For familier der allerede har DUPLO derhjemme, fungerer appen som supplement – ikke erstatning. Den kan inspirere til fysisk leg og omvendt. Det er to måder at opleve det samme kreative univers.`,
    parentInfo: `LEGO DUPLO World er gratis med abonnement for fuld adgang. Der er ingen reklamer. Appen indsamler minimal data og er designet til børn 2-5 år.`,
    parentTip: `Byg det samme i appen og med fysiske DUPLO-klodser. Sammenlign og tal om, hvad der er anderledes. Det styrker forståelsen af digital vs. fysisk leg.`,
  },
  {
    slug: 'toca-kitchen-2',
    description: `Toca Kitchen 2 sætter børn bag komfuret med total frihed til at eksperimentere. Skær, blend, kog, steg og server mad til sultne gæster – og se deres ofte morsomme reaktioner på dine kulinariske kreationer.

Det geniale er fraværet af regler. Vil du servere rå fisk med ketchup? Gæsten reagerer. Perfekt tilberedt pasta? Anden reaktion. Børn lærer gennem eksperimenteren, og gæsternes ansigtsudtryk giver umiddelbar feedback.

Toca Boca har skabt et legende køkken hvor intet kan gå galt. Knive er sikre, ovne brænder ikke, og der er ingen tidspres. Det er et trygt rum at udforske madlavningens verden.

For picky eaters kan Toca Kitchen 2 faktisk hjælpe. Ved at lege med mad i digital form bliver ingredienser mindre skræmmende. Mange forældre rapporterer at børn bliver mere nysgerrige på rigtig mad efter at have spillet.`,
    parentInfo: `Toca Kitchen 2 er en engangskøb-app uden reklamer eller yderligere køb. Den fungerer helt offline og indeholder ingen tekst, så den er tilgængelig for alle aldre.`,
    parentTip: `Lav mad sammen i det rigtige køkken efter at have spillet. Lad barnet vælge ingredienser de prøvede i appen. Det bygger bro mellem digital og virkelig oplevelse.`,
  },
  {
    slug: 'peek-a-zoo',
    description: `Peek-a-Zoo er en simpel men effektiv app til de allermindste. Dyr gemmer sig bag objekter, og børn skal finde dem ved at lytte til hints: "Hvem er glad? Hvem har hat på? Hvem er søvnig?"

Spillet træner lytteforståelse og ordforråd på en legende måde. Børn lærer følelser (glad, trist, søvnig), begreber (stor, lille) og objekter (hat, briller) gennem gentagelse og positive forstærkninger.

Duck Duck Moose, udviklerne bag appen, har skabt en æstetisk tiltalende oplevelse. Dyrene er charmerende, animationerne er bløde, og stemmerne er venlige. Det er en app der føles tryg og varm.

For forældre der søger skærmtid med læringspotentiale til de mindste, er Peek-a-Zoo et udmærket valg. Den korte sessionslængde passer til små børns koncentrationsevne, og der er ingen fristelser til uendelig scrolling.`,
    parentInfo: `Peek-a-Zoo er gratis med Khan Academy Kids-abonnement eller som separat køb. Ingen reklamer eller datahøstning. Designet til børn 1-4 år.`,
    parentTip: `Gentag ordene fra appen i hverdagen. "Hvem er glad? Er du glad?" Det forbinder digital læring med virkelige samtaler og følelser.`,
  },
  {
    slug: 'dr-minisjang',
    description: `DR Minisjang er DRs app til de allermindste seere. Her kan børn gense yndlingsklip fra Minisjang-programmerne, lege simple spil og udforske et trygt, reklamefrit univers skabt specifikt til danske småbørn.

Indholdet er nøje udvalgt til aldersgruppen. Korte videoklip, simple interaktioner og velkendte karakterer fra dansk børne-tv. Der er ingen overraskelser eller skræmmende elementer – bare tryghed og genkendelse.

Som public service-app er DR Minisjang helt gratis og reklamefri. Dette er sjældent i app-verdenen og giver forældre ro i maven. DR tager ansvar for det yngste publikum.

Appen fungerer som supplement til tv-kanalens indhold. Børn kan gense det de så på tv, eller opdage nyt indhold i eget tempo. Det er on-demand børne-tv i lommeformat.`,
    parentInfo: `DR Minisjang er gratis, reklamefri og lavet af DR til danske børn 0-3 år. Ingen login krævet, minimal dataindsamling. Indholdet opdateres løbende.`,
    parentTip: `Brug appen til korte stunder – i køen hos lægen eller på lange bilture. Den er designet til små doser, ikke timevis forbrug.`,
  },
  {
    slug: 'peppa-pig-world-adventures',
    description: `Peppa Pig: World Adventures tager Peppa og hendes familie på jordomrejse. Børn besøger ikoniske steder som Eiffeltårnet, pyramiderne og Frihedsgudinden – alt sammen i Peppa Pigs charmerende tegneseriestil.

Hvert rejsemål tilbyder minispil og aktiviteter. I Paris bager børn croissanter, i Egypten graver de efter skatte. Aktiviteterne er simple og tilpasset de mindste fans, med fokus på glæde frem for udfordring.

For børn der elsker Peppa Pig-serien, er dette en drøm. De genkender karaktererne, humoren og den varme familiestemning. Det føles som et nyt afsnit de selv styrer.

Geografilæring sniger sig ind næsten ubemærket. Børn lærer om lande, monumenter og kulturer gennem leg. Det er edutainment der faktisk fungerer for de yngste.`,
    parentInfo: `Peppa Pig: World Adventures er et engangskøb med mulighed for ekstra destinationer. Ingen reklamer. Baseret på det populære tv-program med samme familievenlige standard.`,
    parentTip: `Udforsk verden sammen i appen og find derefter landene på et rigtigt verdenskort. Det gør læringen håndgribelig og skaber nysgerrighed om verden.`,
  },
  {
    slug: 'hey-duggee-big-badge-app',
    description: `Hey Duggee: The Big Badge App lader børn tjene badges ligesom Squirrel Club i den populære BBC-serie. Aktiviteterne dækker alt fra madlavning til musik, og hver afsluttet aktivitet belønnes med et badge.

Badge-systemet er genialt motiverende for små børn. De forstår konceptet fra serien og stræber efter at samle dem alle. Det giver struktur uden at skabe pres – man kan altid prøve igen.

Aktiviteterne er varierede og veldesignede. Der er puslespil, kreative værktøjer, rytmespil og meget mere. Alt er præsenteret i seriens farverige, glade æstetik.

For fans af Hey Duggee er appen et must. Den udvider universet på en meningsfuld måde og holder børnene engagerede langt ud over episodens længde.`,
    parentInfo: `Hey Duggee: The Big Badge App er et engangskøb uden reklamer. BBC har skabt en tryg oplevelse uden eksterne links eller skjulte køb.`,
    parentTip: `Fejr badges sammen! Lav en fysisk badge-samling der matcher appens. Det giver barnet stolthed og forbinder digital og fysisk oplevelse.`,
  },

  // 3-6 ÅR
  {
    slug: 'thinkrolls-2',
    description: `Thinkrolls 2 bygger videre på originalens succes med nye koncepter og udfordringer. Stadig med de rullende kugle-karakterer, men nu med elektricitet, teleportere, anti-gravity og andre spændende elementer.

Puslespillene er igen progressive. Nye koncepter introduceres én ad gangen, mestres, og kombineres så med tidligere lærte færdigheder. Denne spiralende læringskurve sikrer konstant udfordring uden frustration.

Grafikken og lyden er opdateret men bevarer den charmerende stil. Karaktererne har nu endnu mere personlighed, og de fysiske interaktioner føles mere tilfredsstillende.

For børn der elskede det første Thinkrolls, er fortsættelsen et oplagt valg. For nye spillere fungerer det også fint – koncepterne forklares fra bunden, ingen forudgående erfaring nødvendig.`,
    parentInfo: `Thinkrolls 2 er et engangskøb uden reklamer. Ligesom originalen er der mulighed for separate baner for yngre og ældre børn, så søskende kan spille på passende niveau.`,
    parentTip: `Hvis barnet mestrer begge Thinkrolls-spil, prøv andre puslespil-apps fra Avokiddo. De har samme kvalitet og filosofi om læring gennem leg.`,
  },
  {
    slug: 'teach-your-monster-to-read',
    description: `Teach Your Monster to Read er et prisbelønnet læsespil udviklet af Usborne Foundation. Børn skaber deres eget monster og tager det med på en rejse hvor bogstaver og ord er nøglen til at redde verden.

Spillet dækker tre stadier af læseudvikling: Bogstavlyde (fonemer), blanding af lyde, og læsning af hele ord. Progressionen er baseret på systematisk syntetisk fonetik – den mest evidensbaserede metode til læseindlæring.

Eventyr-narrativet holder motivationen oppe. Børn samler stjerner, låser nye områder op, og tilpasser deres monster med tøj og tilbehør. Læring føles som en del af et større eventyr.

Teach Your Monster er gratis på web og billig som app. Det er et sjældent eksempel på nonprofit-edutainment der faktisk virker. Mange skoler bruger det som supplement til læseundervisning.`,
    parentInfo: `Teach Your Monster to Read er gratis på web (teachyourmonstertoread.com) og et engangskøb som app. Ingen reklamer. Spillet er på engelsk og egnet til engelsksprogede børn eller tidlig engelskindlæring.`,
    parentTip: `Spil sammen og lav lydene højt. Fonetisk læsning handler om at høre og sige lydene – ikke bare se dem. Din involvering forstærker læringen.`,
  },
  {
    slug: 'kodable',
    description: `Kodable introducerer programmering for børnehavebørn gennem farverige kugle-karakterer kaldet "fuzzies". Uden tekst eller tal lærer børn sekvenser, løkker og betingelser ved at guide fuzzies gennem labyrinter.

Det visuelle kodesprog er intuitivt. Pile peger retning, farver matcher platforme, og gentagelser vises som tal over blokke. Børn bygger programmer ved at arrangere ikoner – ingen skrivning nødvendig.

Progressionen er veldesignet. De første niveauer er simple retningsøvelser. Senere introduceres betingelser ("hvis grøn, gå op") og løkker. Børn lærer computational thinking uden at vide de lærer det.

Kodable bruges i tusindvis af skoler worldwide. Det er et af de mest anerkendte kodningsprogrammer til de yngste og har dokumenteret effekt på problemløsningsevner.`,
    parentInfo: `Kodable tilbyder gratis indhold og et abonnement for fuld adgang. Ingen reklamer. Der er også en forældresektion med rapporter om barnets fremskridt.`,
    parentTip: `Tal om sekvenser i hverdagen: "Først tager vi sko på, så jakke, så går vi ud." Det er programmering i det virkelige liv og forstærker appens koncepter.`,
  },
  {
    slug: 'lingokids',
    description: `Lingokids er en omfattende engelsklærings-app for børn 2-8 år. Med over 1.200 aktiviteter dækker den ordforråd, fonetik, samtale og kultur – alt sammen gennem spil, sange og videoer.

Indholdet er udviklet af Oxford University Press og bruger evidensbaserede metoder. Børn lærer gennem immersion, hvor engelsk bruges naturligt i kontekst frem for isoleret glosetræning.

Appen tilpasser sig barnets niveau automatisk. Algoritmer sporer fremskridt og justerer sværhedsgrad. Dette sikrer at indholdet altid er udfordrende men ikke frustrerende.

For danske familier er Lingokids en fremragende måde at introducere engelsk tidligt. Forskning viser at tidlig sprogeksponering giver fordele – og hvad er bedre end at lære gennem leg?`,
    parentInfo: `Lingokids tilbyder begrænset gratis adgang og fuld adgang med abonnement. Ingen reklamer. Forældrerapporter viser fremskridt og foreslår aktiviteter.`,
    parentTip: `Brug engelske ord fra appen i hverdagen. "Can you find the apple?" Denne blanding af sprog styrker læringen og gør den praktisk.`,
  },
  {
    slug: 'moose-math',
    description: `Moose Math fra Duck Duck Moose tager børn med til Moose Juice-butikken hvor matematik er nøglen til succes. Gennem sjove aktiviteter lærer børn tælling, addition, subtraktion, sortering og geometri.

Hver aktivitet er forklædt som arbejde i butikken. Tæl jordbær til smoothies, sorter ingredienser efter form, mål mængder til opskrifter. Matematikken føles relevant og anvendelig.

Grafikken er farverig og indbydende med elgkarakteren som guide. Lyddesignet er muntert uden at være forstyrrende. Det er en æstetisk tiltalende oplevelse for øjne og ører.

Moose Math er nu del af Khan Academy Kids og gratis tilgængelig. Det er et af de bedste matematik-apps for førskolebørn – og prisen (gratis) gør det tilgængeligt for alle.`,
    parentInfo: `Moose Math er gratis via Khan Academy Kids. Ingen reklamer, ingen køb. Appen sporer fremskridt og tilpasser sværhedsgrad automatisk.`,
    parentTip: `Lav smoothies sammen i det rigtige køkken og tæl ingredienserne som i spillet. "Hvor mange bananer skal vi bruge? Lad os tælle sammen!"`,
  },
  {
    slug: 'dr-ramasjang-krea',
    description: `DR Ramasjang KREA er kreativitetsværkstedet i DR-app-familien. Her kan børn tegne, male, klippe og klistre digitalt – alt sammen med velkendte DR-karakterer som guides.

Værktøjerne er velegnede til små fingre. Pensler, stempler, klistermærker og rammer gør det nemt at skabe noget flot, selv for børn der kæmper med finmotorik. Succesoplevelser er nærmest garanterede.

Det danske fokus er en klar fordel. Karakterer og temaer er genkendelige fra tv, og alt er på dansk. For børn der endnu ikke mestrer engelsk, er det en kreativ app de faktisk kan navigere.

Som del af DR-økosystemet er KREA gratis og reklamefri. Det er et trygt kreativt rum uden kommercielle interesser eller skjulte fælder.`,
    parentInfo: `DR Ramasjang KREA er gratis og reklamefri. Kreationer kan gemmes og deles. Fungerer delvist offline efter download.`,
    parentTip: `Print børnenes digitale kunstværker og hæng dem op. Det validerer deres kreativitet og viser at digital kunst er "rigtig" kunst.`,
  },
  {
    slug: 'wheres-my-water',
    description: `Where's My Water? er et puslespil hvor spillere graver kanaler for at lede vand til alligatoren Swampys brusebad. Simple mekanikker kombineret med gradvist sværere baner skaber et vanedannende spil.

Fysik-motoren er kernen. Vand opfører sig realistisk – det løber nedad, fylder hulrum, og kan omdannes til damp eller is. Børn lærer intuitivt om væskers egenskaber gennem leg.

Disney har skabt charmerende karakterer og en sammenhængende verden. Swampys ønske om at være ren i en verden af beskidte alligatorer er en sjov præmis der driver narrativet.

Spillet har hundredvis af baner plus udvidelser. Der er masser af indhold, og sværhedsgraden skalerer fra simpel til genuint udfordrende. Det er et spil der vokser med barnet.`,
    parentInfo: `Where's My Water? er et engangskøb med mulighed for ekstra baner. Der er reklamer i gratisversionen. Velegnet til børn 4+ på grund af puslespilskompleksiteten.`,
    parentTip: `Eksperimenter med vand i virkeligheden. Hæld vand i sandkassen og observer hvordan det løber. Forbind spillets fysik med den virkelige verden.`,
  },
  {
    slug: 'busy-shapes-colors',
    description: `Busy Shapes & Colors er designet specifikt til at lære de mindste om former, farver og rumlig tænkning. Børn trækker former til matchende huller – et simpelt koncept med overraskende dybde.

Det fysik-baserede gameplay gør interaktionen tilfredsstillende. Former ruller, bouncer og glider realistisk. Børn lærer ikke bare at matche, men også at forudsige bevægelse.

Appen tilpasser sværhedsgraden dynamisk. Hvis barnet mestrer cirkler, introduceres trekanter. Hvis de kæmper, bliver opgaverne lettere. Denne adaptive vanskelighed holder alle børn i deres zone of proximal development.

SimpliCITY, udviklerne, har fokuseret på ren design uden distraktioner. Ingen menuer, ingen tekst, ingen overflødige elementer. Bare formen, hullet og barnets finger.`,
    parentInfo: `Busy Shapes & Colors er et engangskøb uden reklamer eller køb. Fungerer offline. Designet til børn 2-5 år.`,
    parentTip: `Leg med fysiske former derhjemme. Sorteringsspil med træklodser bygger på de samme færdigheder og giver taktil variation.`,
  },

  // 7+ ÅR
  {
    slug: 'portal',
    description: `Portal er et førstepersons puslespil hvor spillere bruger en "portal gun" til at skabe forbundne indgange og udgange. Gå ind i en portal, kom ud af den anden – simple regler, komplekse implikationer.

Spillet er en masterclass i spillæring. Uden tutorials lærer spillere mekanikkerne gennem veldesignede baner der gradvist introducerer nye koncepter. Det er learning by doing på højeste niveau.

GLaDOS, spillets AI-modstander, leverer noget af spilhistoriens bedste dialog. Hendes passiv-aggressive kommentarer og løfter om kage har opnået kultklassiker-status. Humoren er tilgængelig for børn men med lag voksne sætter pris på.

For børn interesserede i fysik og logik er Portal uvurderligt. Det tvinger spillere til at tænke i tre dimensioner og forstå momentum. Mange undervisere bruger det til at illustrere fysiske koncepter.`,
    parentInfo: `Portal er PEGI 12 for mild science fiction-vold. Tekst og tale er på engelsk. Spillet kræver rumlig tænkning og kan være udfordrende for yngre børn. Ca. 3-4 timers spilletid.`,
    parentTip: `Spil sammen og tal om løsninger. "Hvad tror du der sker hvis vi sætter portalen dér?" Portal er et fantastisk samarbejdsspil selvom det teknisk set er singleplayer.`,
  },
  {
    slug: 'kerbal-space-program',
    description: `Kerbal Space Program lader spillere bygge rumraketter og udforske et solsystem med de grønne Kerbal-astronauter. Under den sjove overflade ligger realistisk fysik der har inspireret fremtidige raketforskere.

Spillet belønner eksperimenteren. Raketter eksploderer, missioner fejler, Kerbals strander i rummet – men hvert fejlslag lærer spilleren noget om aerodynamik, tyngdekraft og baneberegning. Fejl er ikke straf, det er læring.

NASA har anerkendt spillets uddannelsesmæssige værdi. Det bruges i STEM-undervisning worldwide og har dokumenteret effekt på interesse for rumfart og fysik.

For børn fascineret af rummet er KSP en game-changer. Det går fra "rummet er sejt" til "jeg forstår hvordan raketter faktisk virker". Den dybde er sjælden i børnerettede spil.`,
    parentInfo: `Kerbal Space Program er PEGI 3 men kræver god læseevne (engelsk) og tålmodighed. Indlæringskurven er stejl. Career mode giver struktur, Sandbox mode giver frihed.`,
    parentTip: `Lær sammen! KSP er komplekst nok til at udfordre voksne. Se YouTube-tutorials sammen og fejr successer – den første stabile kredsløbsbane er en milepæl.`,
  },
  {
    slug: 'mini-metro',
    description: `Mini Metro er et minimalistisk strategispil hvor spillere designer metro-systemer til voksende byer. Forbind stationer med linjer, alloker tog og vogne, og prøv at undgå overbelastning.

Designet er elegant i sin enkelhed. Stationer er geometriske former, linjer er farver, passagerer er små ikoner. Alt information formidles visuelt uden tekst eller tal.

Under den rolige overflade ligger dyb strategi. Hvilke stationer skal forbindes? Hvornår skal en linje udvides? Hvordan fordeles begrænsede ressourcer? Disse beslutninger kræver fremadrettet tænkning.

Mini Metro fungerer som afslappet tidskrævende spil og som intenst optimerings-puslespil. Denne fleksibilitet gør det tilgængeligt for forskellige spillertyper og humør.`,
    parentInfo: `Mini Metro er PEGI 3 og egnet til alle aldre der kan forstå simple relationer. Ingen tekst, ingen vold, ingen tidspres (i normal mode).`,
    parentTip: `Brug spillet som introduktion til offentlig transport. Næste gang I tager metroen, tal om hvordan systemet er designet. "Hvorfor mon denne linje går her?"`,
  },
  {
    slug: 'duolingo',
    description: `Duolingo har revolutioneret sprogindlæring med sin gratis, gamificerede tilgang. Korte lektioner, streaks, XP og leagues gør sprogpraksis til et spil millioner spiller dagligt.

For børn tilbyder Duolingo en struktureret vej ind i nye sprog. Dansk børn kan lære engelsk, tysk, fransk eller et af de mange andre sprog – alt sammen med umiddelbar feedback og belønninger.

Det adaptive system sikrer passende udfordring. Algoritmer sporer hvad barnet kan og hvad der kræver mere øvelse. Svage områder gentages automatisk indtil de sidder fast.

Kritikere påpeger at Duolingo alene ikke gør dig flydende. Det er korrekt – men som supplement til anden sprogeksponering (film, musik, samtale) er det et effektivt værktøj.`,
    parentInfo: `Duolingo er gratis med reklamer eller reklamefri med Super Duolingo-abonnement. Der er sociale features som leagues – overvej om barnet skal deltage i disse.`,
    parentTip: `Gør Duolingo til en familieaktivitet. Lær det samme sprog og konkurrer om streaks. Social motivation forstærker læringen enormt.`,
  },
  {
    slug: 'geoguessr',
    description: `GeoGuessr dropper spillere et tilfældigt sted på Google Street View og udfordrer dem til at gætte lokationen. Det er et spil der belønner observation, viden og deduktiv tænkning.

Spillere lærer at læse landskaber: Hvilken side kører biler på? Hvordan ser skilte ud? Hvad fortæller vegetationen om klimaet? Disse observationsevner overføres til virkelig geografi.

For børn er GeoGuessr en portal til verdens mangfoldighed. De ser gader i Japan, landeveje i Argentina, landsbyer i Afrika. Det udvider horisonten på en måde bøger ikke kan matche.

Battle Royale-modes og multiplayer gør spillet socialt. Familier kan konkurrere mod hinanden eller samarbejde om at finde de sværeste lokationer.`,
    parentInfo: `GeoGuessr er gratis med begrænsninger eller fuld adgang med abonnement. Spillet bruger Google Street View og viser den virkelige verden – inklusive sporadisk voksenindhold.`,
    parentTip: `Spil sammen og lav det til en quiz. "Hvad fortæller sproget på skiltet os?" "Hvilken side kører bilerne på her?" Det bliver en geografilektion i forklædning.`,
  },
  {
    slug: 'cities-skylines',
    description: `Cities: Skylines er en bybyggersimulator hvor spillere designer og administrerer moderne byer. Fra vejnet til kloaksystemer, fra zonering til budgetter – alt er under spillerens kontrol.

Kompleksiteten er overvældende men tilgængelig. Spillet introducerer systemer gradvist og tillader fejl uden katastrofe. Byer kan vokse organisk mens spilleren lærer.

For børn interesserede i arkitektur, urban planning eller bare byggeri er Cities: Skylines et sandkasse-paradis. Der er ingen "rigtig" måde at bygge en by – kun spillerens vision og kreativitet.

Mods og Steam Workshop udvider spillet enormt. Tusindvis af spillerskabte bygninger, køretøjer og mekanikker gør hver by unik.`,
    parentInfo: `Cities: Skylines er PEGI 3. Tekst er på engelsk, og økonomistyring kræver matematik. Spiltiden kan strække sig – timer forsvinder nemt.`,
    parentTip: `Byg en by sammen og diskuter byplanlægning. "Hvor skal hospitalerne ligge?" "Hvorfor placerer vi fabrikker væk fra boliger?" Det er samfundsfag i praksis.`,
  },
  {
    slug: 'altos-odyssey',
    description: `Alto's Odyssey er et endless runner-spil i en smuk ørkenverden. Spillere sandboarder over klipper, gennem canyon'er og forbi gamle templer – alt sammen akkompagneret af en beroligende lydside.

Spillets æstetik er exceptionel. Dag-nat cyklusser, vejrændringer og dynamisk belysning skaber stemningsfulde øjeblikke. Det er lige så meget en audiovisuel oplevelse som et spil.

Gameplayet er simpelt men tilfredsstillende. Et tryk får Alto til at hoppe, hold for backflips. Kombo-systemet belønner elegante runs uden at straffe fejl hårdt.

Zen Mode fjerner alle mål og lader spillere bare nyde landskabet. Det er meditativ gaming – en sjælden og værdifuld ting i en verden fuld af dopamin-optimerede skærme.`,
    parentInfo: `Alto's Odyssey er et engangskøb uden reklamer eller køb. Det er PEGI 3 og egnet for alle aldre. Zen Mode er særligt velegnet til afstressende skærmtid.`,
    parentTip: `Prøv Zen Mode sammen før sengetid. Den rolige musik og ufarlige gameplay kan hjælpe børn med at slappe af uden den stimulering typiske spil giver.`,
  },
  {
    slug: 'lightbot-code-hour',
    description: `Lightbot introducerer programmering gennem et lysende robot-puslespil. Spillere programmerer robotten til at gå hen til alle blå fliser og lyse dem op – uden tekst, kun visuelle kommandoer.

Koncepter som sekvenser, procedurer (funktioner) og løkker introduceres naturligt gennem baner. Spillere opdager selv at gentagne kommandoer kan pakkes ind i genanvendelige funktioner.

Lightbot Code Hour er den gratis introduktion, mens det fulde Lightbot: Programming Puzzles går dybere. Begge versioner bruges i skoler worldwide som introduktion til computational thinking.

For forældre der vil introducere kodning uden skærme fyldt med tekst, er Lightbot ideelt. Den visuelle tilgang gør det tilgængeligt for børn der endnu ikke læser flydende.`,
    parentInfo: `Lightbot: Code Hour er gratis. Det fulde spil er et engangskøb. Ingen reklamer, ingen køb, ingen online-features.`,
    parentTip: `Efter Lightbot, prøv fysisk robot-programmering med Cubetto eller lignende. Overgangen fra skærm til håndgribelig robot forstærker koncepterne.`,
  },
  {
    slug: 'dragonbox-numbers',
    description: `DragonBox Numbers lærer talforståelse gennem leg med Nooms – søde karakterer der repræsenterer tal fra 1 til 10. Børn manipulerer, kombinerer og opdeler Nooms for at løse puslespil.

Det fysiske talkonceptet er genialt. En "5 Noom" er fysisk større end en "2 Noom". At kombinere 2 + 3 betyder bogstaveligt at slå to karakterer sammen til en femmer. Tal bliver konkrete.

Spillet dækker addition, subtraktion og tidlige brøkkoncepter. Alt uden symbolsk notation – børn lærer at tænke matematik før de lærer at skrive det.

Som del af DragonBox-serien (fra WeWantToKnow) deler Numbers den samme pædagogiske kvalitet som de prisbelønnede algebra-spil. Det er fundamentet for senere matematisk tænkning.`,
    parentInfo: `DragonBox Numbers er et engangskøb uden reklamer. Designet til børn 4-8 år. Ingen tekst nødvendig, fuldt visuelt interface.`,
    parentTip: `Brug fysiske objekter til at spejle spillet. Byg tal med LEGO-klodser – "Se, 3 klodser plus 2 klodser giver 5 klodser, ligesom i spillet!"`,
  },
  {
    slug: 'kahoot',
    description: `Kahoot! er en quiz-platform der gør læring til en konkurrence. Lærere, forældre eller børn selv kan oprette quizzer om ethvert emne, og deltagere svarer på tid via deres enheder.

Den sociale dimension er Kahoots styrke. Når hele klassen (eller familien) konkurrerer om at svare hurtigst og korrekt, bliver selv kedelige emner engagerende. Gamification virker.

Biblioteket af færdige quizzer er enormt. Der er quizzer om alt fra dansk grammatik til Minecraft. Børn kan også lave deres egne – en lærerig aktivitet i sig selv.

Kahoot bruges i millioner af klasseværelser globally. Det er blevet synonymt med interaktiv læring og har demonstreret effekt på engagement og retention.`,
    parentInfo: `Kahoot! er gratis at deltage i. Oprette quizzer kræver konto, og premium-features kræver abonnement. Multiplayer kræver at alle deltagere har enheder.`,
    parentTip: `Lav familie-quiz-aftener med Kahoot. Lad børnene skabe quizzer om ting de ved meget om – Pokemon, Minecraft, deres yndlingsserier. Det vender ekspert-rollen.`,
  },
];

// =============================================================================
// BOARD GAME REVIEWS - BATCH 2
// =============================================================================

const boardGameReviews = [
  // 0-3 ÅR
  {
    slug: 'roll-and-play',
    description: `Roll & Play fra ThinkFun er designet som det perfekte første brætspil. En stor, blød terning og simple aktivitetskort er alt hvad der skal til for at introducere de mindste til struktureret leg.

Konceptet er enkelt: Rul terningen, find et kort der matcher farven, og udfør aktiviteten. "Muh som en ko!", "Find noget rødt!", "Klap i dine hænder!" Simple opgaver der får små kroppe i bevægelse og små hjerner i gang.

Der er ingen konkurrence, ingen point, ingen måde at tabe på. Det er ren positiv interaktion mellem barn og voksen, struktureret af terningens tilfældighed. Perfekt for børn der endnu ikke forstår regler.

ThinkFun har skabt et produkt der er fysisk tilpasset målgruppen. Terningen er stor og blød, kortene er tykke og slidstærke. Det kan tåle den behandling en toddler giver det.`,
    parentTip: `Tilpas aktiviteterne til barnets alder og evner. Spring over svære kort, gentag favoritter. Det handler om sjov, ikke om at følge reglerne perfekt.`,
  },
  {
    slug: 'zingo',
    description: `Zingo er Bingo for børn – med et twist. Den ikoniske Zingo-maskine skyder to billedfliser ud ad gangen, og spillere kappes om at matche dem med deres spilleplade.

Tempoet gør Zingo spændende. Børn skal hurtigt genkende billeder og reagere. Det træner visuel processing og reaktionsevne i en sjov, konkurrencepræget ramme.

ThinkFun har lavet mange varianter: Zingo med tal, Zingo med ord på forskellige sprog, Zingo med tid. Kernemekanikken er så solid at den fungerer på tværs af temaer.

For familier er Zingo et fantastisk valg til blandet aldersgrupper. Yngre børn kan spille med billederne, ældre kan bruge ordversioner. Alle ved samme bord, samme spil, tilpassede udfordringer.`,
    parentTip: `Start med færre fliser på spillepladen for yngre børn. Det giver flere succesoplevelser og holder frustrationsniveauet lavt.`,
  },
  {
    slug: 'count-your-chickens',
    description: `Count Your Chickens er et samarbejdsspil hvor spillere sammen hjælper Mor Høne med at samle sine kyllinger før hun når laden. Terningens symboler bestemmer, hvor mange kyllinger der samles.

Samarbejdselementet fjerner konkurrencens stress. Alle vinder eller taber sammen, hvilket gør spillet velegnet til børn der reagerer dårligt på at tabe. Fokus er på fælles glæde.

Tælning er integreret naturligt. Spinner lander på hund – "hvor mange kyllinger kan du se mellem høne og hund? Lad os tælle sammen!" Matematik føles relevant og anvendeligt.

Peaceable Kingdom specialiserer sig i samarbejdsspil for små børn, og Count Your Chickens er et af deres bedste. Sød tematik, simpel mekanik, meningsfuld læring.`,
    parentTip: `Lad barnet tælle selv, også hvis de tæller forkert i starten. Rettelser kan komme forsigtigt – "skal vi tælle sammen?" Det vigtige er øvelsen, ikke præcisionen.`,
  },
  {
    slug: 'sneaky-snacky-squirrel',
    description: `The Sneaky, Snacky Squirrel Game kombinerer farvelæring med finmotorik-træning. Spillere bruger egern-pincetter til at samle farvede agern og fylde deres træstub – et simpelt mål med motorisk udfordring.

Pincetterne er geniale. De kræver den samme gribe-bevægelse som skriveredskaber, så børn træner skriveforberedende motorik uden at vide det. Leg der forbereder til læring.

Spillet introducerer også turtagning og farve-matching. Spinneren viser en farve, barnet finder et matchende agern. Simple regler der føles retfærdige og forståelige.

Komponenter er høj kvalitet – træstubber, plastik-agern, det ikoniske egern. Det er et spil der både ser godt ud og holder til mange gennemspilninger.`,
    parentTip: `Brug pincetterne til andre aktiviteter – sorter pompomer, flyt perler. Jo mere øvelse med gribeværktøjer, jo bedre forberedt er barnet til at skrive.`,
  },
  {
    slug: 'candy-land',
    description: `Candy Land er en amerikansk klassiker der har introduceret børn til brætspil siden 1949. Træk et kort, flyt til den viste farve – ingen beslutninger, ren held, men en perfekt første brætspilsoplevelse.

Fraværet af strategi er faktisk en fordel for de mindste. De behøver ikke forstå taktik, bare farver og turtagning. Det er brætspillets ABC før børn er klar til mere.

Den farverige slikverden er visuelt tiltalende. Gumdrop Mountains, Peppermint Forest, Candy Castle – det er en verden børn vil udforske igen og igen.

Ja, Candy Land er dateret og helt luck-baseret. Men generationer af børn har lært brætspilskonventioner her. Der er en grund til det har overlevet i 75+ år.`,
    parentTip: `Brug Candy Land som springbræt. Når barnet mestrer det, introducer spil med simple valg. Candy Land er begyndelsen, ikke målet.`,
  },

  // 3-6 ÅR
  {
    slug: 'spot-it-jr-animals',
    description: `Spot It! Jr. Animals er den børnevenlige version af det populære reaktionsspil. To kort deler altid præcis ét matchende dyr – find det først og vind kortet!

Spillets genialitet ligger i matematikken bag. Uanset hvilke to kort du sammenligner, er der altid ét – og kun ét – match. Dette skaber konstant spænding og garanterede fund.

For små børn træner Spot It! visuel scanning, mønstergenkendelse og hurtig reaktion. Alt sammen forklædt som en sjov konkurrence om at råbe dyrenavne højest.

Junior-versionen har færre og større symboler end den originale, tilpasset yngre øjne og langsommere processing. Det er den perfekte introduktion til Spot It!-familien.`,
    parentTip: `Spil roligt i starten. Yngre børn har brug for tid til at scanne kortene. Efterhånden som de mestrer det, øges tempoet naturligt.`,
  },
  {
    slug: 'hoot-owl-hoot',
    description: `Hoot Owl Hoot! er endnu et fremragende samarbejdsspil fra Peaceable Kingdom. Spillere arbejder sammen om at flytte ugler tilbage til reden før solen står op – en enkel men engagerende præmis.

Farve-matching driver gameplayet. Spil et kort, flyt en ugle til den farve. Solkort rykker solen fremad, så tiden er begrænset. Det skaber naturlig spænding uden voksen-indblanding.

Strategien er tilgængelig for børn: "Hvis jeg spiller blå, lander uglen her. Men hvis jeg spiller grøn..." Beslutninger har konsekvenser, men kompleksiteten er håndterbar.

Spillet kan justeres i sværhedsgrad ved at tilføje flere ugler. Start med to, arbejd op til seks. Det holder spillet relevant i længere tid.`,
    parentTip: `Lad børnene diskutere strategien. "Hvilken ugle skal vi flytte?" At tale beslutninger igennem træner både sprog og logisk tænkning.`,
  },
  {
    slug: 'animal-upon-animal',
    description: `Animal Upon Animal (Dyr på dyr) er et stablingsspil hvor spillere bygger et vaklende dyretårn. Terningen bestemmer, hvordan dit dyr skal placeres – ovenpå, ved siden af eller på krokodillens snude.

Den fysiske udfordring er universel. Alle aldre forstår spændingen ved et vaklende tårn og lettelsen når dyret bliver siddende. Det er Jenga-spænding med charmerende træfigurer.

HABA er kendt for kvalitetslegetøj, og Animal Upon Animal lever op til standarden. Trædyrene er solide, farverige og rare at røre ved. De bliver favoritter ud over spillet.

Spillet fungerer på mange niveauer. Små børn stables bare efter evne, ældre følger reglerne, voksne planlægger strategiske placeringer. Alle spiller sammen, alle har det sjovt.`,
    parentTip: `Når tårnet vælter, gør det til en fejring snarere end et nederlag. "Wauw, se hvor højt vi byggede!" Fokus på processen, ikke resultatet.`,
  },
  {
    slug: 'my-first-carcassonne',
    description: `My First Carcassonne introducerer den klassiske flise-placeringsmekanik i en forenklet form. Børn matcher veje for at skabe et landskab hvor deres figurer kan placeres.

Det visuelle er tilpasset børn. Farverige huse, glade børnefigurer, og fliser der altid passer sammen (ingen ugyldige placeringer). Frustrationen fra det voksne Carcassonne er elimineret.

Scoring er simpelt: Placer alle dine figurer først og vind. Ingen kompleks point-optælling, bare et klart mål børn kan forstå og forfølge.

Som introduktion til det bredere Carcassonne-univers er dette perfekt. Børn lærer flise-matching og rumlighed, og kan senere graduere til det fulde spil.`,
    parentTip: `Når barnet mestrer My First Carcassonne, prøv det originale med simplificerede scorer-regler. Mange familier skaber deres egen overgang mellem versionerne.`,
  },
  {
    slug: 'bluey-board-game',
    description: `Bluey: The Videogame's brætspilsversion (og andre officielle Bluey-brætspil) bringer den elskede serie til bordet. Spillere genoplever episodernes lege i struktureret brætspilsform.

For Bluey-fans er genkendeligheden en kæmpe fordel. Karaktererne, aktiviteterne og humoren er intakt. Det føles som at træde ind i et afsnit – bare med terninger og brikker.

Gameplayet er simpelt og familievenligt. Typisk handler det om at samle ting, undgå forhindringer eller samarbejde om mål. Intet revolutionerende, men solidt og tematisk passende.

Bluey-universet handler om fantasileg og familiesamvær. Brætspillet forstærker disse værdier ved at samle familien om bordet til fælles oplevelser.`,
    parentTip: `Kombiner brætspil med afsnit. Spil brætspillet og se derefter et relateret Bluey-afsnit. Det skaber en hel aftens underholdning med tema.`,
  },

  // 7+ ÅR
  {
    slug: 'catan',
    description: `Catan (tidligere Settlers of Catan) er spillet der startede det moderne brætspilsboom. Siden 1995 har det introduceret millioner til ressourcehøstning, handel og strategisk tænkning.

Kernen er ressource-management. Terningkast afgør hvilke landskaber der producerer, og spillere handler indbyrdes for at samle det de mangler. Social interaktion er ikke bare tilladt, det er nødvendigt.

For familier tilbyder Catan meningsfulde beslutninger for alle aldre. Et barn på 8 kan forhandle lige så effektivt som en voksen – måske bedre, med de rette charme-evner.

Genspilbarheden er enorm. Det modulære kort er forskelligt hver gang, ressource-fordeling varierer, og sociale dynamikker skifter. Tusindvis af spil og det føles stadig friskt.`,
    parentTip: `De første par spil, hjælp børn med handelsforhandlinger. "Du har brug for uld, Maria har uld. Hvad kan du tilbyde?" Stil spørgsmål frem for at give svar.`,
  },
  {
    slug: 'codenames',
    description: `Codenames er et ordassociationsspil hvor to hold konkurrerer om at finde deres agenter først. Spymasters giver et-ords hints der skal forbinde flere ord på bordet.

Mekanikken er elegant simpel. Hint-giveren siger et ord og et tal, gættere peger på kort. Men dybden i at finde det perfekte hint der forbinder "hospital" og "æble" uden at ramme "kniv" er enorm.

For familier fungerer Codenames på tværs af generationer. Børn overrasker ofte med laterale associationer voksne ikke ser. Forskellige hjerner tænker forskelligt – det er hele pointen.

Codenames har spawnet talrige varianter: Pictures (med billeder), Duet (kooperativt for to), Disney, Marvel. Kernekonceptet er stærkt nok til uendelige temaer.`,
    parentTip: `Par børn med voksne på hold i starten. Efterhånden som de forstår spillet, lad dem give hints selv. Det er en progression fra gætter til spymaster.`,
  },
  {
    slug: 'pandemic',
    description: `Pandemic satte samarbejdsspil på kortet (bogstaveligt). Spillere er et hold af specialister der bekæmper fire sygdomme truende verdensbefolkningen. Kommunikation og koordination er nøglen.

Spillet er berømt for sin svaghed: Det er svært. Sygdommene spreder sig hurtigt, og uden tight samarbejde kollapser situationen. Men sejre føles fortjente netop fordi de er sjældne.

For familier lærer Pandemic værdien af specialisering og kommunikation. Lægen kurerer anderledes end forskeren – begge er nødvendige. Det er en metafor for teamwork i den virkelige verden.

Efter COVID-19 har Pandemic fået ny relevans. Børn der har levet gennem en pandemi forstår konteksten på en måde tidligere generationer ikke gjorde.`,
    parentTip: `Undgå "alpha gamer"-syndromet hvor én spiller dikterer alle træk. Sørg for at alle har stemme. Det er et samarbejdsspil, ikke et soloprojekt med tilskuere.`,
  },
  {
    slug: 'sushi-go',
    description: `Sushi Go! er et hurtigt drafting-spil med japansk mad-tema. Spillere vælger kort fra hånden, afslører samtidigt, og sender resten videre. Kombinationer giver point – nigiri, maki, dumplings, tempura.

Drafting-mekanikken skaber interessante beslutninger. Tager du det du har brug for, eller hader du det modstanderen mangler? Simpel regel, dyb taktik.

Den adorable sushi-kunst gør spillet visuelt tiltalende. Børn elsker de smilende nigirier og blinkende puddinger. Det er kawaii-æstetik der inviterer til leg.

Spiltiden på 15 minutter gør Sushi Go! perfekt til aftensmad-ventetid eller som starter til brætspilsaftener. Hurtigt nok til at alle siger "én gang til!"`,
    parentTip: `Første spil, lad pointoptimering vente. Fokuser på at forstå flowet – vælg, vis, send videre. Strategi kommer naturligt med erfaring.`,
  },
  {
    slug: 'forbidden-island',
    description: `Forbidden Island er Matt Leacocks "Pandemic lite" – samme designer, lignende samarbejdsmekanik, men tilgængeligt for yngre spillere. Red skattene fra en synkende ø før alt forsvinder i havet.

Temaet er mindre dystert end sygdomsbekæmpelse. Eventyr-stemningen med skatte og synkende ruiner appellerer bredt. Det føles som at spille et Indiana Jones-eventyr.

Sværhedsgraden kan justeres med vandstandsmåleren. Start på Novice, arbejd jer op til Legendary. Samme spil, vidt forskellige udfordringer.

For familier der vil prøve Pandemic men finder det for komplekst, er Forbidden Island den perfekte trædesten. Samme tilfredsstillelse, lavere indgangsbarriere.`,
    parentTip: `Diskuter strategi åbent. "Hvem skal hente den skat?" "Hvor skal vi shore up?" Forbidden Island belønner kommunikation – øv det fra starten.`,
  },
  {
    slug: 'blokus',
    description: `Blokus er et abstrakt strategispil hvor spillere placerer Tetris-lignende brikker på et gitter. Reglen er simpel: Dine brikker må kun røre ved hjørner, ikke sider. Placer flest brikker og vind.

Den rumlige tænkning er intens. Spillere skal visualisere flere træk frem, blokere modstandere og beskytte egne muligheder. Det er skak-agtigt i sin dybde men med farverige brikker.

Blokus fungerer perfekt med fire spillere, men to-spiller varianten (Blokus Duo) er lige så stærk. Det er alsidigt nok til forskellige gruppestørrelser.

Ingen tekst, ingen tema – bare ren strategi. Det gør Blokus tilgængeligt på tværs af sprog og alder. Et barn på 7 kan udfordre voksne seriøst.`,
    parentTip: `Start med at fokusere på egne brikker. Blocking-strategi kan komme senere. Det vigtige først er at forstå hjørne-reglen og rumlig planlægning.`,
  },
  {
    slug: 'king-of-tokyo',
    description: `King of Tokyo er et terningspil hvor gigantiske monstre kæmper om at erobre Tokyo. Kast terninger, saml energi, køb power-ups, og smadre dine modstandere – sidst monster stående vinder.

Temaet er perfekt til børn. Store monstre der slår hinanden? En kæmpe robot mod en mutant-abe? Det er ren barnlig fantasi med voksne mekanikker underneden.

Yahtzee-mekanismen (kast, behold, genkast) er intuitiv. Beslutninger er meningsfulde: Angriber du Tokyo for point eller holder du dig ude for at overleve? Risk-reward i monster-form.

Richard Garfield (Magic: The Gathering's skaber) har designet et spil der balancerer held og strategi perfekt. Terningerne giver uforudsigelighed, power-ups giver kontrol.`,
    parentTip: `Første par spil, ignorer de avancerede power-up kort. Basisspillet er nok til at have det sjovt. Tilføj kompleksitet gradvist når basisspillet er mestret.`,
  },
  {
    slug: 'labyrinth',
    description: `Labyrinth (Das verrückte Labyrinth) har fascineret familier siden 1986. Spillere skubber fliser for at skabe veje til deres skatte – men hvad du bygger, kan andre ødelægge på deres tur.

Mekanikken er unik. Et skubbe-træk påvirker hele kolonner eller rækker af fliser. Det skaber en labyrint der konstant transformeres – og tvinger spillere til at tænke fleksibelt.

Visuel-rumlig tænkning trænes intenst. Børn lærer at forestille sig, hvordan skub påvirker hele brættet. Denne evne til mental rotation er værdifuld langt ud over spillet.

Ravensburger har udgivet mange versioner: Junior, 3D, elektronisk. Original Labyrinth forbliver den mest elegante – et perfekt eksempel på tidløst spildesign.`,
    parentTip: `Hjælp børn med at visualisere skub-effekter. "Hvis du skubber her, hvad sker der med din vej?" Tænk højt sammen indtil visualiseringen bliver naturlig.`,
  },
  {
    slug: 'splendor',
    description: `Splendor er et ædelstensspil hvor spillere samler chips og køber kort der genererer permanente ressourcer. Engine-building i sin reneste form – start med ingenting, byg et selvforstærkende system.

Reglerne passer på ét A4-ark. Tag chips eller køb kort. Det er alt. Men lagene af strategi der udfolder sig – hvilke kort, hvilken rækkefølge, hvornår at skifte gear – er overraskende dybe.

Poker-agtige chips giver taktil tilfredsstillelse. Der er noget nærmest meditativt ved at stable ædelstens-chips mens du planlægger næste træk.

Splendor fungerer fremragende med to spillere og op til fire. Spilletiden på 30 minutter gør det ideelt til hverdagsaftener hvor tid er begrænset.`,
    parentTip: `Fokuser på at forstå engine-building konceptet. "Hvis du køber det kort, hvad får du så hver runde fremover?" At se langsigtede fordele er spillets kerne.`,
  },
  {
    slug: 'mysterium',
    description: `Mysterium er et kooperativt gættespil hvor en spiller er et spøgelse der kommunikerer gennem abstrakte visions-kort. De andre er medier der skal tolke visionerne for at løse et mord.

Kommunikationen er udfordrende og sjov. Spøgelset må ikke tale, kun dele drømmende billeder. Medierne diskuterer, tolker, gætter – og fejler ofte glorværdigt. Det skaber uforglemmelige øjeblikke.

Kunstværkerne på visions-kortene er fantastiske. Surrealistiske, detaljerede illustrationer der kan tolkes på utallige måder. Hvert spil afslører nye detaljer i billederne.

Mysterium kombinerer Dixit's associationsleg med Cluedo's mysterium. Det er et unikt produkt der skaber dybe samtaler og megen latter.`,
    parentTip: `Lad børn prøve spøgelserollen. At vælge det "rigtige" visionskort er kreativt udfordrende og giver indsigt i, hvordan de tænker.`,
  },
];

async function addReviews() {
  console.log('📝 Adding deep reviews - Batch 2...\n');

  // Update digital games
  console.log('=== DIGITALE SPIL ===');
  for (const review of digitalGameReviews) {
    try {
      const result = await prisma.game.update({
        where: { slug: review.slug },
        data: {
          description: review.description,
          parentInfo: review.parentInfo || null,
          parentTip: review.parentTip || null,
        },
      });
      console.log(`✅ ${result.title}`);
    } catch (error) {
      console.log(`❌ ${review.slug} - not found`);
    }
  }

  // Update board games
  console.log('\n=== BRÆTSPIL ===');
  for (const review of boardGameReviews) {
    try {
      const result = await prisma.boardGame.update({
        where: { slug: review.slug },
        data: {
          description: review.description,
          parentTip: review.parentTip || null,
        },
      });
      console.log(`✅ ${result.title}`);
    } catch (error) {
      console.log(`❌ ${review.slug} - not found`);
    }
  }

  console.log('\n✨ Batch 2 complete!');
}

addReviews()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
