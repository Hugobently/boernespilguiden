import { Prisma } from '@prisma/client';

/**
 * Topic landing pages for the site's most searched-for parent intents
 * ("spil uden reklamer", "gratis spil til børn") and categories
 * ("læringsspil", "puslespil"). Each page gets its own crawlable URL,
 * unique intro copy and a filtered game grid.
 */
export interface TopicConfig {
  /** URL segment - curated topics live at /spil/<slug>, categories at /spil/emne/<slug> */
  slug: string;
  /** Full site-relative path, used for canonical, links and sitemap */
  path: string;
  icon: string;
  h1: string;
  /** Meta title - the root layout template appends "| Børnespilguiden" */
  title: string;
  metaDescription: string;
  /** 2-3 unique intro paragraphs rendered above the grid */
  intro: string[];
  where: Prisma.GameWhereInput;
  /** Seed categories that should link to this topic from game detail badges */
  matchesCategories?: string[];
}

export const CURATED_TOPICS: TopicConfig[] = [
  {
    slug: 'uden-reklamer',
    path: '/spil/uden-reklamer',
    icon: 'shield',
    h1: 'Spil uden reklamer',
    title: 'Spil uden reklamer til børn - reklamefri apps og spil',
    metaDescription:
      'Alle spil her er 100% fri for reklamer. Find reklamefri apps og spil til børn i alle aldre - anmeldt af forældre med fokus på sikkerhed.',
    intro: [
      'Reklamer i børnespil er mere end bare irriterende. De afbryder legen, lokker med køb og fører i værste fald barnet videre til indhold, der slet ikke er beregnet til børn. Derfor er "ingen reklamer" et af de første krav, vi tjekker, når vi anmelder spil.',
      'Alle spil på denne side er helt fri for reklamer. Nogle er gratis, andre koster et engangsbeløb eller kræver abonnement - men fælles for dem er, at dit barn kan spille uden at blive afbrudt eller lokket videre. I hver anmeldelse kan du desuden se, om spillet har køb i appen, og om det kan bruges offline.',
    ],
    where: { hasAds: false },
  },
  {
    slug: 'gratis',
    path: '/spil/gratis',
    icon: 'check',
    h1: 'Gratis spil til børn',
    title: 'Gratis spil til børn - helt gratis apps uden skjulte køb',
    metaDescription:
      'Spil der er helt gratis - ikke freemium, ingen skjulte køb. Se de bedste gratis apps og spil til børn, anmeldt med fokus på sikkerhed og læring.',
    intro: [
      '"Gratis" betyder desværre sjældent gratis i app-butikkerne. De fleste gratis børnespil lever af reklamer eller køb i appen, og det kan blive en dyr fornøjelse, hvis barnet trykker forkert. Spillene på denne side er anderledes: De er helt gratis at hente og bruge.',
      'Flere af dem er lavet af nonprofitorganisationer eller offentlige udbydere, som hverken viser reklamer eller sælger noget - for eksempel er nogle af de bedste læringsapps på markedet 100% gratis. Tjek den enkelte anmeldelse for detaljer om reklamer, dataindsamling og offline-brug, så du ved præcis, hvad du henter.',
    ],
    where: { priceModel: 'gratis' },
  },
  {
    slug: 'offline',
    path: '/spil/offline',
    icon: 'gamepad',
    h1: 'Offline spil til børn',
    title: 'Offline spil til børn - spil uden internet til bilen og flyet',
    metaDescription:
      'Spil der virker uden internet - til bilturen, flyveturen og sommerhuset. Find de bedste offline apps og spil til børn her.',
    intro: [
      'Lange bilture, flyrejser og sommerhuse uden wi-fi - der er mange situationer, hvor et spil skal kunne køre uden internetforbindelse. Samtidig har offline-spil en anden fordel: Uden forbindelse er der hverken reklamer, notifikationer eller adgang til noget, du ikke har godkendt.',
      'Spillene på denne side fungerer helt eller i det væsentlige uden internet. Husk at åbne appen og hente eventuelt indhold, mens du stadig har forbindelse - flere af spillene downloader deres materiale første gang, de startes. Detaljerne står i den enkelte anmeldelse.',
    ],
    where: { isOfflineCapable: true },
  },
  {
    slug: 'paa-dansk',
    path: '/spil/paa-dansk',
    icon: 'world',
    h1: 'Spil på dansk',
    title: 'Spil på dansk til børn - apps med dansk tale og tekst',
    metaDescription:
      'Børnespil og apps der understøtter dansk sprog - med dansk tale, tekst eller vejledning. Se hele listen med ærlige anmeldelser.',
    intro: [
      'For de mindste betyder sproget alt. Et spil med dansk tale kan bruges af børn, der endnu ikke kan læse eller forstå engelsk, og for lidt større børn støtter det både ordforråd og læselyst, når spillet foregår på deres eget sprog.',
      'Spillene her understøtter dansk - enten med dansk tale, dansk tekst eller en dansk vejledning. Udvalget af dansksprogede kvalitetsspil er desværre ikke stort, så vi tilføjer løbende nye, når de dukker op. Har du fundet et godt dansk børnespil, vi mangler, så skriv endelig til os via kontaktsiden.',
    ],
    where: { supportsDanish: true },
  },
];

export const CATEGORY_TOPICS: TopicConfig[] = [
  {
    slug: 'laeringsspil',
    path: '/spil/emne/laeringsspil',
    icon: 'book',
    h1: 'Læringsspil til børn',
    title: 'Læringsspil til børn - de bedste lære-apps efter alder',
    metaDescription:
      'De bedste læringsspil til børn fra 2 til 15 år. Matematik, læsning, logik og kreativitet - anmeldt af forældre med fokus på reel læring.',
    intro: [
      'Gode læringsspil får ikke barnet til at føle, at det sidder med lektier. De pakker tal, bogstaver og logik ind i leg, så motivationen kommer af sig selv - og de bedste af dem tilpasser sværhedsgraden automatisk, så barnet hverken keder sig eller giver op.',
      'Her finder du de læringsspil, vi har anmeldt og kan stå inde for. Vi lægger vægt på, at spillene faktisk lærer barnet noget - ikke bare påstår det - og at læringen ikke drukner i belønningsskærme og købepres. Brug aldersfiltrene, eller læs anmeldelserne for at se, hvilke færdigheder det enkelte spil træner.',
    ],
    where: { categories: { contains: '"læring"' } },
    matchesCategories: ['læring'],
  },
  {
    slug: 'matematikspil',
    path: '/spil/emne/matematikspil',
    icon: 'blocks',
    h1: 'Matematikspil til børn',
    title: 'Matematikspil til børn - lær tal og regning gennem leg',
    metaDescription:
      'Spil der træner matematik - fra de første tal til brøker og algebra. Se de bedste matematikspil og -apps til børn, anmeldt af forældre.',
    intro: [
      'Matematik deler ofte vandene derhjemme, men de rigtige spil kan vende pligt til leg. Når regnestykkerne er en del af et eventyr eller en konkurrence mod en sjov figur, øver barnet sig frivilligt - og ofte langt mere, end et opgaveark ville få det til.',
      'Spillene her træner alt fra de første tal og former hos de mindste til multiplikation, brøker og problemløsning hos de større børn. I hver anmeldelse kan du se, hvilket niveau spillet passer til, og om det tilpasser sig barnets udvikling undervejs.',
    ],
    where: {
      OR: [
        { categories: { contains: '"matematik"' } },
        { skills: { contains: '"matematik"' } },
      ],
    },
    matchesCategories: ['matematik'],
  },
  {
    slug: 'puslespil',
    path: '/spil/emne/puslespil',
    icon: 'sparkle',
    h1: 'Puslespil og tænkespil til børn',
    title: 'Puslespil til børn - de bedste tænke- og logikspil',
    metaDescription:
      'Digitale puslespil og tænkespil der træner logik, tålmodighed og problemløsning. Se de bedste puslespil til børn her.',
    intro: [
      'Puslespil er noget af det mest skærmvenlige, et barn kan lave på en tablet. Tempoet er roligt, der er ingen tidspres eller nederlag, og hjernen arbejder hele tiden - med former, mønstre, logik og tålmodighed.',
      'Udvalget her spænder fra klassiske puslespil for de mindste til fysik-gåder og logikbaner, der kan udfordre en hel familie. Fælles for dem er, at de belønner eftertanke frem for hurtige fingre. Se anmeldelserne for aldersanbefalinger og sværhedsgrad.',
    ],
    where: { categories: { contains: '"puslespil"' } },
    matchesCategories: ['puslespil'],
  },
  {
    slug: 'eventyrspil',
    path: '/spil/emne/eventyrspil',
    icon: 'rocket',
    h1: 'Eventyrspil til børn',
    title: 'Eventyrspil til børn - historier og verdener der skal udforskes',
    metaDescription:
      'Eventyrspil hvor børn udforsker verdener, løser gåder og følger en historie. Se de bedste eventyrspil til børn, anmeldt af forældre.',
    intro: [
      'Eventyrspil giver barnet en historie at træde ind i - en verden der skal udforskes, gåder der skal løses, og karakterer man kommer til at holde af. Det er spiltypen, der oftest skaber de samtaler ved aftensmaden, hvor barnet ivrigt fortæller, hvad der skete i dag.',
      'Vi har samlet eventyrspillene her og lagt vægt på gode historier uden skræmmende indhold i de mindste aldersgrupper. I anmeldelserne kan du se, om spillet kræver læsefærdigheder, og om der er elementer, sarte børn skal skånes for.',
    ],
    where: { categories: { contains: '"eventyr"' } },
    matchesCategories: ['eventyr'],
  },
  {
    slug: 'kreative-spil',
    path: '/spil/emne/kreative-spil',
    icon: 'heart',
    h1: 'Kreative spil til børn',
    title: 'Kreative spil til børn - tegn, byg og skab på skærmen',
    metaDescription:
      'Spil hvor barnet skaber selv - tegning, musik, byggeri og fri leg uden regler og point. Se de bedste kreative apps til børn.',
    intro: [
      'I kreative spil er der ingen baner, point eller rigtige svar - barnet skaber selv. Det kan være tegning og maling, musik, byggeprojekter eller frie legeverdener, hvor fantasien bestemmer. Netop friheden gør denne spiltype til en af de mest værdifulde på en skærm.',
      'Spillene her har det til fælles, at barnet producerer noget frem for bare at forbruge. Mange af dem fungerer fint uden internet og uden tidspres, og flere er oplagte at bruge sammen - lad barnet vise, hvad det har bygget eller tegnet, og byg videre sammen.',
    ],
    where: {
      OR: [
        { categories: { contains: '"kreativ' } },
        { categories: { contains: '"kunst"' } },
        { categories: { contains: '"tegning"' } },
      ],
    },
    matchesCategories: ['kreativitet', 'kreativ', 'kunst', 'tegning'],
  },
  {
    slug: 'kodningsspil',
    path: '/spil/emne/kodningsspil',
    icon: 'gamepad',
    h1: 'Kodningsspil til børn',
    title: 'Kodning for børn - spil der lærer børn at programmere',
    metaDescription:
      'Spil der lærer børn at kode - fra visuelle blokke for begyndere til rigtig programmering. Se de bedste kodningsspil og -apps her.',
    intro: [
      'Kodning handler mindre om computere og mere om at tænke i trin: Hvad skal ske først, hvad sker der hvis, og hvorfor virkede det ikke? De færdigheder kan børn øve længe før, de kan skrive en linje kode - og spillene her gør det legende.',
      'Udvalget spænder fra visuelle puslespil, hvor de mindste programmerer med blokke og pile, til spil hvor større børn skriver rigtig kode. I anmeldelserne kan du se, hvilket niveau spillet starter på, og om det kræver læsefærdigheder eller engelskkundskaber.',
    ],
    where: {
      OR: [
        { categories: { contains: '"kodning"' } },
        { skills: { contains: '"programmering"' } },
      ],
    },
    matchesCategories: ['kodning'],
  },
];

export const ALL_TOPICS: TopicConfig[] = [...CURATED_TOPICS, ...CATEGORY_TOPICS];

export function getCuratedTopic(slug: string): TopicConfig | undefined {
  return CURATED_TOPICS.find((t) => t.slug === slug);
}

export function getCategoryTopic(slug: string): TopicConfig | undefined {
  return CATEGORY_TOPICS.find((t) => t.slug === slug);
}

/** Maps a seed category (e.g. "læring") to its topic page, if one exists */
export function getTopicForCategory(category: string): TopicConfig | undefined {
  return ALL_TOPICS.find((t) => t.matchesCategories?.includes(category.toLowerCase()));
}
