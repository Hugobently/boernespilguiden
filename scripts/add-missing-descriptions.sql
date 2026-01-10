-- SQL Script til at tilføje manuelle beskrivelser til TMDB serier uden beskrivelser
-- Kør dette mod produktionsdatabasen for at tilføje danske beskrivelser

-- 1. Rugrats (TMDB ID: 3022)
UPDATE "Media"
SET description = 'Rugrats følger en gruppe småbørn med vilde fantasier og store eventyr. Tommy, Chuckie, Phil og Lil oplever hverdagen fra et barns perspektiv, hvor selv simple ting bliver til store eventyr. Serien er fuld af humor og hjertevarme, og lærer børn om venskab og problemløsning.'
WHERE "tmdbId" = 3022 AND description IS NULL;

-- 2. Pingvinerne fra Madagaskar (TMDB ID: 7869)
UPDATE "Media"
SET description = 'Pingvinerne fra Madagaskar følger fire eventyrlyste pingviner - Skipper, Kowalski, Rico og Private - der bor i Central Park Zoo. Med militær præcision og masser af humor tackler de daglige udfordringer og mystiske missioner. En actionfyldt animeret serie med slapstick humor.'
WHERE "tmdbId" = 7869 AND description IS NULL;

-- 3. Star vs. the Forces of Evil (TMDB ID: 61923)
UPDATE "Media"
SET description = 'Star Butterfly er en magisk prinsesse fra en anden dimension, der sendes til Jorden for at lære at bruge sin magi ansvarligt. Sammen med sin bedste ven Marco kæmper hun mod onde kræfter, mens hun navigerer teenage-livet. En farverig fantasy-serie med stærke rollemodelller.'
WHERE "tmdbId" = 61923 AND description IS NULL;

-- 4. Grizzy og lemmingerne (TMDB ID: 74415)
UPDATE "Media"
SET description = 'Grizzy er en stor bjørn der elsker at slappe af i en hytte i skoven, men hans fred bliver konstant forstyrret af en flok små, energiske lemminger. De konkurrerer om de samme ressourcer og godbidder i denne sjove animerede serie uden dialog, der appellerer til alle aldre.'
WHERE "tmdbId" = 74415 AND description IS NULL;

-- 5. Totally Spies! (TMDB ID: 2808)
UPDATE "Media"
SET description = 'Tre teenagepiger - Sam, Clover og Alex - lever dobbeltliv som hemmelige agenter for organisationen WOOHP. De bekæmper skurke og redder verden, mens de navigerer udfordringerne ved at være teenager. En actionfyldt serie om venskab, teamwork og selvtillid.'
WHERE "tmdbId" = 2808 AND description IS NULL;

-- 6. OK K.O.! Let's Be Heroes (TMDB ID: 72468)
UPDATE "Media"
SET description = 'K.O. er en ung, optimistisk dreng der drømmer om at blive verdens bedste helt. Han arbejder i Lakewood Plaza og træner sammen med sine venner Radicles og Enid. Serien handler om venskab, mod og at forfølge sine drømme, med masser af action og humor.'
WHERE "tmdbId" = 72468 AND description IS NULL;

-- 7. Sesame Street (TMDB ID: 502)
UPDATE "Media"
SET description = 'Sesame Street er et klassisk amerikansk børneprogram der har underholdt og undervist børn siden 1969. Med ikoniske karakterer som Elmo, Big Bird og Cookie Monster lærer børn om tal, bogstaver, farver og sociale færdigheder gennem sjove sange, historier og interaktive segmenter.'
WHERE "tmdbId" = 502 AND description IS NULL;

-- 8. Adventure Time (TMDB ID: 15260)
UPDATE "Media"
SET description = 'Adventure Time følger Finn den menneskelige og hans bedste ven Jake, en magisk hund der kan ændre form. De oplever fantastiske eventyr i det post-apokalyptiske land Ooo, hvor de møder mærkelige væsner og kæmper mod onde kræfter. En fantasifuld serie om venskab og mod.'
WHERE "tmdbId" = 15260 AND description IS NULL;

-- 9. New Looney Tunes (TMDB ID: 65763)
UPDATE "Media"
SET description = 'New Looney Tunes bringer de klassiske karakterer som Bugs Bunny, Daffy And, Porky Pig og Tweety til live i nye, kortere historier. Med samme slapstick humor og vilde situationer som originalen, er serien fyldt med action, gags og tidløs underholdning for hele familien.'
WHERE "tmdbId" = 65763 AND description IS NULL;

-- 10. Teen Titans Go! (TMDB ID: 45140)
UPDATE "Media"
SET description = 'Teen Titans Go! følger fem unge superhelte - Robin, Starfire, Raven, Beast Boy og Cyborg - i deres dagligdag på Titans Tower. Mellem superhelte-missioner håndterer de teenage-problemer, venskab og sjov. En komisk take på superhelte-genren med masser af humor og action.'
WHERE "tmdbId" = 45140 AND description IS NULL;

-- 11. The Wacky World of Tex Avery (TMDB ID: 8123)
UPDATE "Media"
SET description = 'The Wacky World of Tex Avery er en animated comedy-serie inspireret af klassisk animation. Med vilde karakterer, overdreven slapstick og uforudsigelige situationer leverer serien masser af lattere. Hver episode indeholder korte segmenter med forskellige karakterer og historier.'
WHERE "tmdbId" = 8123 AND description IS NULL;

-- Verificer at opdateringerne er gennemført
SELECT title, description IS NOT NULL as has_description
FROM "Media"
WHERE "tmdbId" IN (3022, 7869, 61923, 74415, 2808, 72468, 502, 15260, 65763, 45140, 8123)
ORDER BY "tmdbId";
