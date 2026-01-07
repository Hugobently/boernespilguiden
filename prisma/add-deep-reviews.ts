import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// DIGITAL GAME REVIEWS
// =============================================================================

const digitalGameReviews = [
  // 0-3 ÅR
  {
    slug: 'peekaboo-barn',
    description: `Peekaboo Barn er en af de mest elskede apps til de allermindste børn. Konceptet er enkelt og genkendeligt: Barn trykker på en lade, og ud kommer et dyr med en sjov lyd. Det er klassisk "tit-tit-bøh" i digital form, og det virker fantastisk for babyer og småbørn.

Det geniale ved Peekaboo Barn er, hvordan det udnytter børns naturlige fascination af dyr og overraskelser. Hver gang et dyr dukker op, siges dyrets navn højt, hvilket støtter sprogudvikling. Grafikken er varm og indbydende med blide farver, der ikke overstimulerer.

Appen er udviklet af Night & Day Studios, som er kendt for deres børnevenlige design uden reklamer eller forstyrrende elementer. Der er ingen tekst at læse, ingen komplekse menuer – bare ren, enkel interaktion perfekt til små fingre.

En særlig bonus er, at man kan tilføje egne stemmer, så forældre kan indtale dyrenavne. Dette gør appen mere personlig og kan hjælpe børn med at genkende forældrenes stemmer selv når de ikke er til stede.`,
    parentInfo: `Peekaboo Barn er designet specifikt til de mindste med stor fokus på sikkerhed. Der er ingen reklamer, ingen links til sociale medier, og ingen mulighed for at forlade appen ved et uheld. Alle køb er låst bag forældrekontrol. Appen kræver ingen læsefærdigheder og kan bruges selvstændigt af børn fra ca. 6 måneder.`,
    parentTip: `Brug appen sammen med dit barn og gentag dyrenavnene. Peg på skærmen og lav dyrelyde sammen – det styrker både sprogudvikling og jeres fælles oplevelse.`,
  },
  {
    slug: 'sago-mini-friends',
    description: `Sago Mini Friends inviterer de mindste børn ind i en verden af sød venskab og udforskende leg. I denne app besøger dit barn forskellige Sago Mini-karakterer i deres hjem og hjælper dem med dagligdags aktiviteter som at lave mad, plante blomster eller tage bad.

Det pædagogiske fokus ligger på social-emotionel læring. Børn lærer om venskab, omsorg og at hjælpe andre gennem legende interaktioner. Der er ingen rigtige eller forkerte svar – bare åben leg hvor barnets nysgerrighed fører vejen.

Grafikken er kendetegnende for Sago Mini: Blød, rund og fuld af glade farver. Lyddesignet er gennemtænkt med beroligende musik og morsomme lydeffekter der belønner interaktion uden at overstimulere.

Som del af Sago Mini-universet kan Friends også fungere som indgang til de andre apps i serien. Karaktererne går igen på tværs af apps, hvilket skaber genkendelighed og tryghed for barnet.`,
    parentInfo: `Sago Mini Friends er helt fri for reklamer, in-app køb og ekstern kommunikation. Appen indsamler ikke persondata og kræver ikke internetforbindelse efter download. Designet er skabt til at være trygt for selvstændig leg.`,
    parentTip: `Lad barnet vise dig, hvad de har lavet i appen. Stil åbne spørgsmål som "Hvad lavede du sammen med Harvey?" for at styrke fortælleevner.`,
  },

  // 3-6 ÅR
  {
    slug: 'thinkrolls',
    description: `Thinkrolls er en fremragende puslespil-app der træner logisk tænkning hos børnehavebørn. Spillet præsenterer en række kugleformede karakterer, der skal guides gennem baner fyldt med forhindringer. For at komme videre skal barnet forstå simple fysiske koncepter som tyngdekraft, elasticitet og bevægelse.

Det smarte ved Thinkrolls er den gradvise sværhedsgrad. De første baner introducerer ét koncept ad gangen – måske bare at skubbe en kasse. Senere kombineres koncepter, så barnet skal tænke flere skridt frem. Dette progressive design sikrer, at børn oplever mestring uden frustration.

Spillet har over 100 baner fordelt på kapitler, der hver introducerer nye elementer som trampoliner, balloner, dynamit og teleportere. Den visuelle stil er farverig og tiltalende, og karaktererne har charmerende personligheder.

Thinkrolls kræver ingen læsning og har intuitive kontroller, hvilket gør det tilgængeligt for børn der endnu ikke kan læse. Det er et af de bedste eksempler på "stealth learning" – børn lærer fysik og logik mens de bare tror, de leger.`,
    parentInfo: `Thinkrolls er komplet reklamefri og har ingen in-app køb i børnenes del af appen. Der er mulighed for at købe ekstra baner, men dette er adskilt fra barnets spiloplevelse. Appen fungerer offline og indsamler ikke data.`,
    parentTip: `Modstå fristelsen til at hjælpe for hurtigt. Lad barnet eksperimentere og fejle – det er sådan de lærer at tænke logisk. Ros processen ("Du prøvede noget nyt!") frem for resultatet.`,
  },
  {
    slug: 'pok-pok-playroom',
    description: `Pok Pok Playroom er en prisbelønnet samling af digitale legetøj skabt af designere fra Highlights Magazine. Appen tilbyder åben, ustruktureret leg i en æstetisk smuk ramme. Her er ingen point, ingen niveauer, ingen "færdig" – bare ren kreativ udfoldelse.

Legetøjene i Playroom spænder bredt: Der er en lyd-mixer hvor børn kan skabe musik, et tegneværktøj med unikke pensler, en byggeklods-simulator og meget mere. Hvert legetøj er designet til at inspirere kreativitet uden at diktere, hvad barnet skal gøre.

Det visuelle design er bemærkelsesværdigt. Pok Pok har valgt en kunstnerisk stil der føles håndlavet og varm, langt fra typiske spilgrænseflader. Farverne er dæmpede men indbydende, og animationerne er bløde og tilfredsstillende.

Filosofien bag Pok Pok er, at børn lærer bedst gennem fri leg. Der er ingen belønningssystemer eller fremskridt at låse op – bare legetøj at udforske i eget tempo. Dette gør appen ideel til forældre der ønsker skærmtid med substans.`,
    parentInfo: `Pok Pok er abonnementsbaseret, men tilbyder en gratis prøveperiode. Der er absolut ingen reklamer eller separate køb. Appen er designet til at være tryg for selvstændig brug og indeholder ingen eksterne links eller social funktionalitet.`,
    parentTip: `Sæt jer sammen og leg med legetøjet. Spørg "Hvad sker der hvis...?" og lad barnet udforske. Det handler ikke om at lave noget pænt, men om at eksperimentere.`,
  },
  {
    slug: 'dr-ramasjang-laer',
    description: `DR Ramasjang LÆR kombinerer velkendte karakterer fra dansk børne-tv med målrettede læringsaktiviteter. Appen dækker kernefærdigheder som bogstaver, tal, former og farver – alt sammen præsenteret af Onkel Ransen, Kaj og Andrea, og andre populære figurer.

Styrken ved DR Ramasjang LÆR er genkendeligheden. Danske børn kender allerede karaktererne og føler sig trygge i universet. Dette sænker barrieren for læring og gør det nemmere for børn at engagere sig med det faglige indhold.

Aktiviteterne er varierede og veldesignede. Der er interaktive minispil, videoklip, sange og puslespil. Alt er tilpasset danske børn med fokus på det danske alfabet og danske ord – noget der ofte mangler i internationale apps.

Som public service-app er DR Ramasjang LÆR gratis og helt fri for reklamer. Dette gør den til et trygt valg for forældre der vil give deres børn skærmtid med læringspotentiale uden bekymringer om kommercielle interesser.`,
    parentInfo: `DR Ramasjang LÆR er gratis, reklamefri og lavet specifikt til danske børn. Appen kræver ikke login og indsamler minimal data. Den opdateres løbende med nyt indhold baseret på aktuelle DR-programmer.`,
    parentTip: `Forbind appens indhold med det virkelige liv. Hvis barnet lærer om bogstavet A, peg på A'er i bøger og på skilte når I er ude.`,
  },
  {
    slug: 'dr-ramasjang-leg',
    description: `DR Ramasjang LEG er lillesøsteren til DR Ramasjang LÆR og fokuserer på fri leg og kreativitet frem for struktureret læring. Her kan børn udklæde sig, bygge, tegne og udforske – alt sammen med de elskede DR-karakterer.

Appens styrke er dens åbne design. Der er ingen mål eller scorer – bare en legeplads hvor barnet selv bestemmer. Dette understøtter kreativ tænkning og selvstændig leg, hvor barnets fantasi er grænsen.

Aktiviteterne varierer fra digitalt tøjskift med Kaj og Andrea til byggeprojekter og musikalske eksperimenter. Alt er præsenteret i den velkendte DR-æstetik med farverige baggrunde og glade animationer.

For forældre der bekymrer sig om skærmtid, tilbyder DR Ramasjang LEG en type digital leg der minder mere om traditionel leg med dukker eller byggeklodser end om passivt medieforbrug.`,
    parentInfo: `Ligesom andre DR-apps er Ramasjang LEG gratis og reklamefri. Appen er designet til selvstændig brug og har ingen eksterne links eller kommunikationsfunktioner. Fungerer delvist offline efter initial download.`,
    parentTip: `Brug appen som samtalestart: "Hvem klædte du Kaj ud som?" Dette styrker sprogudvikling og giver indblik i barnets kreative valg.`,
  },
  {
    slug: 'endless-alphabet',
    description: `Endless Alphabet er en af de mest velanmeldte læse-apps til førskolebørn. Konceptet er enkelt men effektivt: Små monstre introducerer ord, og barnet trækker bogstaver på plads mens de siger deres lyd. Til sidst afspilles en morsom animation der viser ordets betydning.

Det geniale ved Endless Alphabet er fokusset på fonemer frem for bogstavnavne. Når barnet trækker et "S" på plads, siger appen "sssss" – ikke "ess". Dette fonologiske fundament er afgørende for senere læseindlæring.

Animationerne der afslutter hvert ord er fantastiske. De er sjove, overraskende og hjælper børn med at huske ordenes betydning. Ordet "cooperate" viser for eksempel monstre der arbejder sammen – visuelt ordforråd på sit bedste.

Ordvalget er overraskende avanceret. Her er ikke kun "cat" og "dog", men ord som "gargantuan", "famished" og "cooperate". Dette giver ældre førskolebørn udfordring og udvider ordforrådet markant.`,
    parentInfo: `Endless Alphabet er en engangskøb-app uden reklamer eller yderligere køb. Den fungerer offline og er sikker for selvstændig brug. Bemærk at appen er på engelsk, hvilket kan være en fordel for tidlig tosproget eksponering.`,
    parentTip: `Gentag ordene og bogstavlydene sammen med barnet. Prøv at finde ting i huset der starter med samme lyd som det ord, I lige har lært.`,
  },
  {
    slug: 'scratchjr',
    description: `ScratchJr introducerer de allerførste programmeringskoncepter for børn fra 5 år. Udviklet af MIT Media Lab er det en forenklet version af det populære Scratch, tilpasset børn der endnu ikke kan læse.

I ScratchJr bygger børn simple programmer ved at sætte farverige blokke sammen. Disse blokke repræsenterer handlinger som "gå fremad", "hop" eller "sig hej". Ved at kombinere blokke kan børn skabe interaktive historier og animationer.

Det pædagogiske fundament er computational thinking – evnen til at nedbryde problemer i mindre dele og tænke sekventielt. Disse færdigheder er værdifulde langt ud over programmering og styrker generel problemløsning.

ScratchJr er gratis og open source, uden reklamer eller datahøstning. Interfacet er helt visuelt uden behov for læsning, og der er masser af eksempelprojekter til inspiration. Det er en af de bedste introduktioner til kodning for de yngste.`,
    parentInfo: `ScratchJr er helt gratis uden reklamer eller køb. Appen indsamler ikke data og fungerer offline. Der er ingen social funktionalitet eller eksterne links. Projekter gemmes lokalt på enheden.`,
    parentTip: `Start med at lave noget sammen. Hjælp barnet med at skabe en simpel animation – måske deres yndlingsdyr der går hen over skærmen. Når de forstår grundprincipperne, lad dem eksperimentere selv.`,
  },

  // 7+ ÅR
  {
    slug: 'stardew-valley',
    description: `Stardew Valley er et charmerende landbrugssimulationsspil der har vundet hjerter hos spillere i alle aldre. Du arver en nedslidt gård og skal bygge den op fra bunden – plante afgrøder, passe dyr, fiske og blive venner med landsbyens beboere.

Det der gør Stardew Valley særligt velegnet til børn er dets afslappede tempo og fravær af stress. Der er ingen game overs, ingen tidspres (ud over årstiderne), og ingen fjender at bekæmpe (medmindre man vælger at udforske minerne). Spillet belønner tålmodighed, planlægning og omsorg.

Pædagogisk styrker Stardew Valley færdigheder som ressourcestyring, planlægning og konsekvenstænkning. Børn lærer at en afgrøde skal plantes i den rigtige sæson, at dyr skal fodres dagligt, og at relationer kræver vedligeholdelse.

Den pixelart-stil er nostalgisk og tiltalende uden at være grafisk krævende. Spillet kører på næsten alt hardware og er tilgængeligt på de fleste platforme. Det er et spil hele familien kan nyde – alene eller sammen i multiplayer.`,
    parentInfo: `Stardew Valley er PEGI 7 og indeholder mild tegneserievold i minerne. Der er ingen reklamer eller mikrotransaktioner. Spillet har ingen online-funktioner ud over lokal/online co-op med folk du inviterer. Spilletid kan nemt strække sig, så overvej at sætte tidsgrænser.`,
    parentTip: `Spil sammen! Stardew Valley har co-op multiplayer hvor I kan drive gården sammen. Det er en fantastisk måde at tilbringe kvalitetstid og snakke om planlægning og samarbejde.`,
  },
  {
    slug: 'monument-valley-2',
    description: `Monument Valley 2 er et visuelt betagende puslespil hvor du guider en mor og datter gennem umulige arkitektoniske konstruktioner inspireret af M.C. Eschers værker. Spillet leger med perspektiv på måder der udfordrer og fascinerer.

Hvert niveau er et kunstværk. De geometriske former, de dæmpede farver og den drømmende atmosfære skaber en meditativ oplevelse sjælden i spil. Monument Valley 2 er lige så meget et stykke interaktiv kunst som det er et spil.

Puslespillene er baseret på optiske illusioner og umulig geometri. En trappe der ser ud til at gå opad kan faktisk føre nedad når perspektivet skiftes. Dette tvinger spilleren til at tænke anderledes og slippe forudindtagelser om rum og retning.

Historien om mor og datter giver spillet en emotionel dybde. Uden ord fortælles en historie om forandring, vækst og at give slip – temaer der kan resonere med børn og voksne på forskellige niveauer.`,
    parentInfo: `Monument Valley 2 er et engangskøb uden reklamer eller yderligere køb. Spillet er kort (ca. 2-3 timer) men af høj kvalitet. Det indeholder ingen tekst og er tilgængeligt for børn der ikke kan læse engelsk.`,
    parentTip: `Lad barnet styre mens du ser med. Tal om, hvad I ser: "Hvordan kan trappen gå både op og ned?" Det kan føre til interessante samtaler om perspektiv og perception.`,
  },
  {
    slug: 'dragonbox-algebra',
    description: `DragonBox Algebra gør noget tilsyneladende umuligt: Det lærer børn algebra gennem leg – uden at de ved, de lærer algebra. Spillet starter med at manipulere mystiske ikoner, men disse ikoner repræsenterer faktisk algebraiske begreber.

Genistregen er den gradvise introduktion. I starten isolerer børn en boks ved at fjerne andre elementer fra skærmen. Langsomt bliver ikonerne til tal og bogstaver, og pludselig løser barnet ligninger som 3x + 5 = 17 uden at blinke.

Spillet er udviklet af norske WeWantToKnow i samarbejde med matematiklærere. Det er baseret på solid pædagogisk forskning og har dokumenteret effekt – børn der spiller DragonBox scorer højere i algebraprøver.

DragonBox findes i flere versioner til forskellige aldersgrupper. "5+" introducerer basale koncepter, mens "12+" tackler mere avanceret algebra. Det er et sjældent eksempel på edutainment der faktisk virker.`,
    parentInfo: `DragonBox er et engangskøb uden reklamer. Spillet sporer fremskridt men deler ikke data eksternt. Det fungerer offline og er designet til selvstændig brug.`,
    parentTip: `Modstå fristelsen til at forklare matematikken bag. Lad barnet opdage mønstrene selv – det er hele pointen. Du kan senere forbinde spillet til skole-matematik når barnet møder algebra.`,
  },
  {
    slug: 'human-resource-machine',
    description: `Human Resource Machine er et puslespil der forklæder programmering som kontorarbejde. Du styrer en lille kontormedarbejder der skal flytte kasser mellem indbakke og udbakke – men instruktionerne du giver er faktisk programmeringskode.

Spillet introducerer ægte programmeringskoncepter: loops, conditionals, variabler og mere. Men i stedet for abstrakt kode ser du din lille medarbejder fysisk udføre instruktionerne. Dette gør abstrakte koncepter konkrete og forståelige.

Udviklet af Tomorrow Corporation (kendt for World of Goo) er spillet fyldt med sort humor og charmerende animation. Den dystre kontorstemning er sjov for voksne men kan gå hen over hovedet på yngre spillere – hvilket er helt fint.

Sværhedsgraden stiger markant gennem spillet. De første niveauer er simple, men senere udfordringer kræver ægte algoritmisk tænkning. Det er et spil hvor forældre og børn kan sidde sammen og løse problemer.`,
    parentInfo: `Human Resource Machine er et engangskøb uden reklamer. Spillet er udfordrende og kræver tålmodighed. Det er bedst egnet til børn 10+ med interesse for logiske puslespil.`,
    parentTip: `Hvis barnet går i stå, så hjælp med at nedbryde problemet i mindre dele. "Hvad skal der ske først? Og så?" Dette er præcis den tankegang programmering kræver.`,
  },
  {
    slug: 'minecraft-education',
    description: `Minecraft Education er den skolerettede version af verdens mest populære spil. Det tager Minecrafts kreative sandbox og tilføjer værktøjer specifikt designet til læring – fra kemi-laboratorier til kodning med blokke.

Styrken ved Minecraft Education er, at det bygger på noget børn allerede elsker. Millioner af børn kender Minecraft, så der er ingen indlæringskurve for selve spillet. Læringsværktøjerne integreres naturligt i den velkendte verden.

Appen inkluderer hundredvis af færdige lektioner lavet af lærere verden over. Der er verdener der udforsker mayaernes civilisation, lektioner i programmering med Code Builder, og laboratorier hvor børn kan eksperimentere med kemiske forbindelser.

For hjemmebrug tilbyder Minecraft Education en struktureret ramme for den åbne leg Minecraft er kendt for. Det er særligt værdifuldt for forældre der gerne vil give Minecraft-tid mere retning og læringsindhold.`,
    parentInfo: `Minecraft Education kræver en licens, men der tilbydes ofte gratis prøveperioder. Multiplayer er begrænset til andre Education-brugere, hvilket gør det mere kontrolleret end standard Minecraft. Chat kan slås fra.`,
    parentTip: `Udforsk lektionerne sammen og find emner der interesserer barnet. Hvis de elsker dinosaurer, er der verdener med palæontologi. Interesseret i rummet? Der er Mars-kolonier at udforske.`,
  },
  {
    slug: 'civilization-vi',
    description: `Civilization VI er det seneste kapitel i en af historiens mest anerkendte strategispilserier. Spilleren guider en civilisation fra stenalderen til rumfart, træffer beslutninger om forskning, diplomati, kultur og militær.

For ældre børn (10+) tilbyder Civilization VI en unik måde at lære verdenshistorie. Spillet inkluderer historiske ledere, vidundere og teknologier – alt præsenteret med korte, informative tekster der vækker nysgerrighed.

Det der gør Civ særligt er dybden. Der er ingen "rigtig" måde at vinde på – man kan fokusere på videnskab, kultur, religion eller militær dominans. Dette lærer børn at der findes flere veje til succes, og at beslutninger har konsekvenser.

Sværhedsgraden kan justeres, så yngre spillere kan lære spillets systemer på lavere niveauer før de tager udfordringen op. Turbaseret gameplay betyder ingen tidspres – man kan tænke sig om før hvert træk.`,
    parentInfo: `Civilization VI har PEGI 12 primært på grund af militære konflikter præsenteret strategisk (ikke grafisk). Spillet kræver god læseevne på engelsk. Spilletid kan blive lang – et helt spil kan tage mange timer.`,
    parentTip: `Brug spillet som springbræt for historieinteresse. "Du spillede som Cleopatra – vil du læse om det virkelige Egypten?" Forbind spillets indhold med bøger og dokumentarer.`,
  },
];

// =============================================================================
// BOARD GAME REVIEWS
// =============================================================================

const boardGameReviews = [
  // 0-3 ÅR
  {
    slug: 'roll-play',
    description: `Roll & Play er ofte det allerførste brætspil for de yngste børn. Konceptet er enkelt: Rul den store, bløde terning og træk et kort der matcher farven. Kortene viser simple aktiviteter som "Gør som en abe" eller "Find noget blåt".

Det geniale ved Roll & Play er, at der ikke er nogen regler at forstå. Der er ingen vindere eller tabere, ingen komplekse mekanikker – bare sjov aktivitet styret af terningens tilfældighed. Dette gør spillet tilgængeligt for børn helt ned til 18 måneder.

Aktiviteterne dækker flere udviklingsområder: motorik (hop, klap), sprog (dyrelyde, tæl), kreativitet (dans, syng) og kognition (farver, former). Det er leg forklædt som spil – eller omvendt.

ThinkFun har designet spillet med små børns behov i centrum. Terningen er blød og sikker, kortene er tykke og holdbare, og alt kan tåle lidt savl. For familier der vil introducere brætspilskonceptet tidligt, er Roll & Play et perfekt udgangspunkt.`,
    parentTip: `Tilpas aktiviteterne til barnets niveau. Hvis "hop på ét ben" er for svært, så hop bare sammen. Det vigtigste er at have det sjovt og skabe positive associationer med brætspilstid.`,
  },
  {
    slug: 'haba-first-orchard',
    description: `HABA First Orchard (Første Frugthave) er et samarbejdsspil designet specifikt til de allermindste spillere. Sammen skal spillerne høste frugter fra træerne før ravnen når frem til frugthaven. Det enkle koncept lærer børn det mest grundlæggende i brætspil.

Som samarbejdsspil er First Orchard perfekt til små børn. Der er ingen konkurrence, ingen tabere – kun fælles sejr eller nederlag. Dette eliminerer frustrationen ved at tabe og fokuserer på den sociale oplevelse.

Spillets komponenter er gennemtænkte til små hænder og mundende. Frugterne er store og solide, farverne er klare, og ravnen er charmerende snarere end skræmmende. Alt kan tåle hård behandling fra ivrige toddlere.

Reglerne er enkle nok til, at 2-årige kan deltage meningsfuldt. Terningen viser farver (ikke tal), og opgaven er simpel: Tag frugt der matcher farven. Hvis ravnen rulles, rykker den et felt fremad. Det er intuitivt og visuelt tydeligt.`,
    parentTip: `Lad barnet styre så meget som muligt – rulle terningen, vælge frugt, flytte ravnen. Din rolle er at guide forsigtigt, ikke at spille for dem. Fejr sejre sammen og snak om, at I prøver igen ved nederlag.`,
  },

  // 3-6 ÅR
  {
    slug: 'rhino-hero',
    description: `Rhino Hero er Jenga møder superhelte i en pakke der begejstrer børn og voksne lige meget. Spillerne bygger et højhus af kort mens Super Rhino (en lille trænæsehorn i kappe) klatrer opad. Den der får tårnet til at vælte, taber.

Det fysiske element gør Rhino Hero utroligt engagerende. Børn elsker spændingen når tårnet vakler, jublen når det holder, og latteren når det kollapser. Det er et spil der skaber øjeblikke og minder.

Ud over sjov træner Rhino Hero finmotorik og rumlig forståelse. Børn lærer at placere kort præcist, vurdere balance og forudse konsekvenser. Disse færdigheder overføres til andre områder af udviklingen.

HABA har lavet et spil der skalerer naturligt. Små børn kan bygge simple tårne, mens ældre spillere og voksne kan inkludere alle de avancerede regler. Det er et af de sjældne spil der virkelig fungerer for hele familien.`,
    parentTip: `Start med de enkle regler og tilføj specialkort gradvist. Vær en god taber – vis barnet at det er okay når tårnet vælter, og at det sjove er at bygge det op igen.`,
  },
  {
    slug: 'outfoxed',
    description: `Outfoxed er et samarbejds-detektivspil hvor spillerne sammen skal finde ud af, hvilken ræv der stjal tærten. Det kombinerer terningkast, deduktion og en smart "bevis-dekoder" der afslører ledetråde.

Spillet introducerer deduktiv tænkning for små børn. Ved at finde ledetråde (briller, halstørklæde, paraplyer) og bruge dekoderen kan spillerne udelukke mistænkte. Det er Cluedo for børnehaven – forenklet men stadig udfordrende.

Det kooperative element er vigtigt. Børn diskuterer, deler information og træffer beslutninger sammen. Dette styrker sociale færdigheder og samarbejdsevner på en naturlig måde.

Produktionsværdien er høj med charmerende illustrationer, solide komponenter og den ikoniske bevisdekoder der får børn til at føle sig som ægte detektiver. Det er et spil der inviterer til indlevelse og fantasi.`,
    parentTip: `Lad børnene føre efterforskningen. Stil ledende spørgsmål ("Hvad ved vi om tyven?") i stedet for at give svar. Detektivarbejdet er sjovere når børnene selv opdager løsningen.`,
  },

  // 7+ ÅR
  {
    slug: 'ticket-to-ride',
    description: `Ticket to Ride er en moderne klassiker der har introduceret millioner til brætspilshobby. Spillere samler togkort og bruger dem til at lægge ruter på et kort over USA (eller Europa, eller mange andre versioner). Simple regler, dyb strategi.

Det der gør Ticket to Ride tidløst er balancen mellem tilgængelighed og dybde. Reglerne kan forklares på fem minutter, men de strategiske muligheder udfolder sig over mange spil. Det er let at lære, svært at mestre.

For familier tilbyder spillet meningsfuld interaktion på tværs af aldre. Et barn på 8 kan sagtens konkurrere med voksne – måske endda vinde. Denne mulighed for ægte konkurrence på lige fod er sjælden og værdifuld.

Geografilæring kommer nærmest som bieffekt. Børn lærer bynavne og deres placeringer gennem gentagen spilning. "Atlanta til Miami" bliver mere end en rute – det bliver viden om det amerikanske kort.`,
    parentTip: `Start med kortere ruter og arbejd op til de lange. Undgå at blokere børnenes ruter for aggressivt i starten – lad dem opleve at gennemføre planer. Konkurrencen kan skærpes efterhånden.`,
  },
  {
    slug: 'ticket-to-ride-first-journey',
    description: `Ticket to Ride: First Journey er specifikt designet som introduktion for yngre spillere. Det beholder kernekonceptet fra originalen men forenkler kort, regler og spillængde til et niveau perfekt for 6-årige.

Kortets ruter er kortere og mere overskuelige. Der er færre byer at huske, og ruterne kræver færre kort at gennemføre. Dette reducerer frustrationen markant for yngre spillere.

Spiltiden er også reduceret – typisk 15-20 minutter mod originalens 45-60. Dette passer bedre til yngre børns koncentrationsevne og gør det nemmere at få et spil på bordet i en travl hverdag.

First Journey fungerer som bro til det fulde Ticket to Ride. Børn der elsker First Journey kan naturligt graduere til originalen når de er klar, med koncepterne allerede på plads.`,
    parentTip: `Når barnet mestrer First Journey, prøv at introducere den originale version med hjælp. De overførbare færdigheder vil overraske jer begge.`,
  },
  {
    slug: 'wingspan',
    description: `Wingspan er et smukt engine-building spil om at tiltrække fugle til din naturpark. Med over 170 unikt illustrerede fuglekort, hver med virkelige fakta, er det lige dele spil og ornitologisk uddannelse.

Spillet vandt den prestigefyldte Kennerspiel des Jahres i 2019 og har siden solgt millioner. Det kombinerer elegant design, høj produktionsværdi og et tema der appellerer bredt – også til folk der normalt ikke spiller brætspil.

For børn tilbyder Wingspan en introduktion til strategispil af højere kompleksitet. Der er mange muligheder, mange beslutninger, og handlinger nu påvirker muligheder senere. Det er et skridt op fra simplere familiespil.

Fugle-temaet gør spillet tilgængeligt og lærerigt. Børn (og voksne) lærer om reelle fuglearter, deres æg, føde og levesteder. Den viden der kommer fra gentagen spilning er overraskende.`,
    parentTip: `De første par spil kan være overvældende. Brug den medfølgende automat-modstander til at lære spillet i eget tempo, eller spil åbent med synlige kort mens I alle lærer.`,
  },
  {
    slug: 'kingdomino',
    description: `Kingdomino er et elegant dominospil hvor spillere bygger deres eget lille kongerige af landskaber. Reglerne er enkle – match terræn som i domino – men strategien i at vælge og placere brikker giver dybde.

Spillet vandt Spiel des Jahres (årets spil) i 2017, en udmærkelse der signalerer exceptionel kvalitet og tilgængelighed. Kingdomino fortjener prisen – det er elegant, hurtigt og utroligt genspilbart.

Det centrale dilemma er simpelt men fængende: Jo bedre en brik er, jo senere vælger du næste runde. Vil du have den perfekte brik nu og risikere dårlige valg senere? Denne afvejning lærer risiko-vurdering på intuitiv vis.

Spiltiden på 15-20 minutter gør Kingdomino perfekt til hverdagsaftener. Det er hurtigt at sætte op, hurtigt at spille, og hurtigt at pakke sammen – men stadig meningsfuldt og sjovt.`,
    parentTip: `Fokuser på at bygge et pænt 5x5 gitter i starten. Pointoptimering kan komme senere. Det vigtigste er at forstå matching-mekanikken og nyde byggeprocessen.`,
  },
  {
    slug: 'azul',
    description: `Azul er et abstrakt strategispil inspireret af portugisiske azulejo-fliser. Spillere drafter farverige fliser og placerer dem på deres spilleplade for at skabe mønstre og score point.

Spillets komponenter er exceptionelle. De tunge bakelitfliser føles luksuriøse, og de visuelle mønstre der opstår er æstetisk tilfredsstillende. Azul er et spil der er smukt at se på selv midt i et spil.

Strategisk tilbyder Azul dybde i simplicitet. Der er kun to handlinger at vælge mellem, men konsekvenserne af hvert valg bølger fremad. At tage fliser fra fabriksdisplays påvirker hvad modstandere kan tage – og hvad du selv kan tage senere.

Azul vandt Spiel des Jahres i 2018 og har siden fået flere udvidelser og spin-offs. Originalspillet forbliver det mest tilgængelige og er perfekt som introduktion til moderne brætspil for hele familien.`,
    parentTip: `Spil de første par runder med åbne kort så børn kan se konsekvenser af valg. Fokuser på at undgå negative point (fra mistede fliser) før I optimerer scoring.`,
  },
  {
    slug: 'dixit',
    description: `Dixit er et fortællende billedspil hvor en spiller giver et hint baseret på et drømmende kunstværk, og andre spillere forsøger at gætte hvilket kort det er – blandt både det rigtige og andre spilleres lokkekort.

Det unikke ved Dixit er scoringssystemet. Hvis alle gætter rigtigt, eller ingen gætter rigtigt, får fortælleren ingen point. Hintet skal altså være kryptisk nok til at forvirre nogle, men tydeligt nok til at guide andre.

Kunstværkerne er fantastiske – surrealistiske, drømmende illustrationer der kan tolkes på utallige måder. De inspirerer kreativitet og giver indblik i, hvordan forskellige mennesker tænker.

Dixit er et socialt spil der skaber samtale og latter. Det handler mindre om at vinde og mere om at dele associationer, historier og perspektiver. Det er et spil der bringer mennesker sammen på en meningsfuld måde.`,
    parentTip: `Hjælp yngre børn med at formulere hints. "Hvad får det her billede dig til at tænke på?" Accepter alle svar – der er ingen forkerte associationer i Dixit.`,
  },
];

async function addReviews() {
  console.log('📝 Adding deep reviews to games...\n');

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

  // Final count
  const gamesWithReviews = await prisma.game.count({
    where: { description: { not: null } },
  });
  const boardGamesWithReviews = await prisma.boardGame.count({
    where: { description: { not: null } },
  });

  console.log(`\n📊 Total: ${gamesWithReviews} digitale spil og ${boardGamesWithReviews} brætspil har nu anmeldelser`);
}

addReviews()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
