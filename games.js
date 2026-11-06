/* The list on the landing page (index.html). One entry per folder in variants/.
   dir = folder in variants/, level = level id that "Play" starts, thumb = thumbs/<dir>.png.
   To add a game: tools/import-variant.sh <branch> [dir], make a thumbnail, add an entry here. */
const GAMES = {
  event: [
    { dir: "poke-ocean",       level: "poke",      title: "Poké Ocean",                      blurb: "Catch sea creatures with a cannon. Watch out for the shark!" },
    { dir: "rainbow-cats",     level: "cats",      title: "Rainbow Cats",                    blurb: "Kitties, snow leopards, rainbows and falling snow." },
    { dir: "animal-math",      level: "zoo",       title: "Animal Math",                     blurb: "Read animal words and add up animals." },
    { dir: "robots-space",     level: "robots",    title: "Level 3000: Robots in Space",     blurb: "Be a robot, with a space chicken and a banana buddy." },
    { dir: "dino-bunny",       level: "dino",      title: "Level 500: Dino Land",            blurb: "Be a bunny hopping past the dinosaurs." },
    { dir: "rainbow-princess", level: "princess",  title: "Rainbow Princess",                blurb: "Super hard words, and it rains keys at the end!" },
    { dir: "ninja-dojo",       level: "ninja",     title: "Ninja Dojo",                      blurb: "Tough words for 5th-grade ninjas." },
    { dir: "alien-space",      level: "alien",     title: "Level 1: Alien Space",            blurb: "Alien math with an astronaut, a worm and an alien friend." },
    { dir: "colorful-animals", level: "zoo2000",   title: "Level 500 Googol: Wild Colors",   blurb: "Be a chameleon. Random stuff flies out of the chest!" },
    { dir: "alien-level10",    level: "alien",     title: "Level 10: Alien Space",           blurb: "Stars and spaceships burst out of the treasure." },
    { dir: "ice-queen",        level: "icequeen",  title: "Level 20: Ice Cream World",       blurb: "The ice queen reads yummy words and does ice cream math." },
    { dir: "robo-dino",        level: "robodino",  title: "Level 100 Thousand: Hot Soccer",  blurb: "Soccer vs robot dinosaurs: hard words and math." },
    { dir: "fox-forest",       level: "fox",       title: "Level 67: Fox Forest",            blurb: "A fox and a possum do plus and minus puzzles." },
    { dir: "slime-capybara",   level: "slime",     title: "Level 110: Slime Swamp",          blurb: "Capybara sports math with slime, monsters and smiley poop." },
    { dir: "poop-space",       level: "poopman",   title: "Level 67: Poop Man in Space",     blurb: "Be Poop Man. Money rains out of the space bank!" },
    { dir: "bat-hero-67",      level: "bathero",   title: "Level 67: Bat Hero",              blurb: "Six seven! Every answer is 6, 7, 13 or 67." }
  ],
  practice: [
    { dir: "math",             level: "math",      title: "Math Game",                       blurb: "Add small numbers and pick the answer." },
    { dir: "timer",            level: "demo",      title: "Beat the Clock",                  blurb: "The demo level with a countdown on every question." },
    { dir: "two-teams",        level: "demo",      title: "Two Teams",                       blurb: "Red and blue teams take turns and score points." },
    { dir: "dinosaurs",        level: "dino",      title: "Dinosaur Level",                  blurb: "Bone, egg, volcano, fossil!" },
    { dir: "puppy",            level: "demo",      title: "Puppy Explorer",                  blurb: "A puppy hunts for a giant bone." },
    { dir: "space",            level: "space",     title: "Space Trip",                      blurb: "Moon, star, rocket, alien on a space map." },
    { dir: "missing-letter",   level: "spell",     title: "Spelling Game",                   blurb: "Look at the picture and find the missing letter." },
    { dir: "super-hard",       level: "super",     title: "Super Hard!",                     blurb: "4 pictures and 6 stops. Can you do it?" },
    { dir: "animal-sounds",    level: "animals",   title: "Animal Sounds",                   blurb: "Get it right and the animal talks!" },
    { dir: "dance-party",      level: "demo",      title: "Dance Party",                     blurb: "Open the chest and everything dances." }
  ]
};
