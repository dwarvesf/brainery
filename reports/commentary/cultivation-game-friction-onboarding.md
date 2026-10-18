---
title: "Onboarding without flattening: what 9T keeps hard on purpose"
description: "A cultivation game prototype that refuses to simplify its genre, a tester who understood none of it, and a prologue idea that teaches the destination before the grind. When friction is the product, and where it stops being one."
date: 2026-10-18
toc: true
authors:
  - bievh
  - tuanddd
  - phucld
tags:
  - commentary
  - game-design
  - onboarding
  - indie-games
  - build-club
slug: cultivation-game-friction-onboarding
---

![](assets/cultivation-game-friction-onboarding-fig1-paths.svg)

_Fig. 1: Two ways to onboard a niche game. Flattening makes the first hour easy and the genre generic. 9T keeps the friction and makes only the first loop legible, then adds a prologue that shows where the grind leads._

## A tester who understood nothing

Bien dropped [9T](https://bienvh.itch.io/9t), a cultivation game in the xianxia tradition, into #build-club at eleven at night. The first request was for a cheat code to skip straight to the good sword technique. The second, from a different tester the next morning, was blunter: "I went in and understood nothing. I'd have to read a few cultivation novels first." He also said the map looked great.

Bien's answer was not to add a tutorial. It was: read the guide in the character menu, there are a lot of hidden mechanics, and if you're into the genre you'll dig; if not, bye. The in-game guide had already been cut from fifteen tabs to four. The loop you need to know fits in a sentence: cultivate to level one, fight monsters, sell the drops, buy rice, cultivate again, and after level three you need spirit stones. Sit by the rock, you cultivate faster; there's a spirit vein underneath.

Everything else stays hidden on purpose. Alchemy done with firewood produces low-grade pills, and the game never tells you. Spiritual roots are rolled at random and each one carries a different aura; a bad roll means a longer game, and that is treated as a feature. Once you outlevel a monster it runs instead of fighting. There are no quests. Bien's estimate was twenty to thirty hours of play without cheats, with one admitted risk: players might get bored before they find the fun. His own phrase for the design was that there are many easter eggs from cultivation fiction, play slowly and it's fun, hack and it's over.

That is a position. Onboarding is not the same as simplification, and for a niche genre the harder path is also the signal that you are in the right place.

## Where this has worked

The counterexamples to "flatten everything" are well known, and so are their numbers.

Dark Souls is the one everyone names. Its designers chose not to gate difficult areas and to [leave out explicit directions on where to go or how to use things](https://www.gamedeveloper.com/design/on-the-design-of-dark-souls), and Miyazaki has said he is [not a fan of spontaneously explaining the world to players](https://medium.com/@Jamesroha/world-design-lessons-from-fromsoftware-78cadc8982df). A recent essay puts the stance plainly: most games treat player uncertainty as a flaw to extinguish, while [Dark Souls treats uncertainty as the entire point](https://videogame.town/2026/06/25/when-games-refuse-to-explain-themselves/). Rain World went further; its two-person team wanted the player to feel [like a rat on subway tracks, surviving an environment without comprehending its higher-level function](https://en.wikipedia.org/wiki/Rain_World), and it took mixed reviews for the difficulty while building a cult.

Closer to 9T's genre, Tale of Immortal (鬼谷八荒) launched on Steam in January 2021 in Simplified Chinese only, with no hand-holding, and [sold 1.8 million copies in its first five weeks with a peak of 184,171 concurrent players](https://www.pcgamesn.com/tale-of-immortal/sales). The audience that already reads cultivation novels did not need the mechanics explained; it needed them to be there. Dwarf Fortress is the inverse data point: twenty years of free releases, then a Steam version that added a tutorial and a real interface and [sold close to 500,000 copies in its first month](https://gamerant.com/dwarf-fortress-500000-sold-steam-december-2022/). The underlying simulation stayed as deep as ever. What changed was that the first hour became legible.

There is even a small study behind the instinct. A paper on intentional friction in games cites a 2019 experiment in which [67 percent of users reported higher satisfaction and clearer understanding of an app's purpose when more friction was present](https://axelftv.github.io/content/university/Rory-Lyons-Intentional-Friction.pdf). Friction is not noise. It is where the player learns what the thing is for.

The pattern across these is the same as Bien's: keep the depth, keep the obscurity, and make exactly one path visible. Dwarf Fortress added the path. Dark Souls has the Undead Burg. 9T has rice and the rock.

## The prologue that teaches the destination

Two weeks later, on a thread about 9T's graphics update, Vincent added the second half of the onboarding answer. Open with the player as a great immortal in the heavens, full gear, full spells, wrecking everything. Then get cast down and reborn as an ordinary mortal, reset to level one. Bien's reply was one word, legit, and that he would try it.

The trope has a name, [A Taste of Power](https://tvtropes.org/pmwiki/pmwiki.php/Main/ATasteOfPower), and two of the best-loved games in the genre adjacent to 9T are built on it. Castlevania: Symphony of the Night opens with Alucard carrying his full signature kit, every enemy dying in one hit, until [Death confiscates the lot at the end of the first corridor](https://castlevania.fandom.com/wiki/Alucard/Symphony_of_the_Night), and getting it back becomes a quest that spans both castles. Metroid Prime does the same with a fully suited Samus for one short level before [the real game begins with her abilities stripped](https://tvtropes.org/pmwiki/pmwiki.php/Main/ATasteOfPower).

What the prologue does for a friction-heavy game is specific. It shows the fantasy at full strength before the grind starts, so the player knows what the rice and the rock are for. It gives the level-one reset a narrative cause instead of an arbitrary one. And in cultivation fiction specifically, the fall-and-rebirth is one of the genre's own stock openings, so it reads as native rather than as a tutorial device. Vincent's instinct was to borrow the genre's own story shape to do the onboarding the tutorial refuses to do.

## A playbook for a niche game that wants to stay strange

- Decide what the first session is for. If the answer is discovery, measure how many players find the core loop without the guide. If it is retention, you are building a different game.
- Make exactly one loop legible. 9T's is rice, rock, spirit stones. Everything else can stay hidden, but that one has to be findable in the first ten minutes.
- Keep the guide a map, not a checklist. Fifteen tabs to four was the right cut. A guide that explains every mechanic is a tutorial wearing a disguise.
- Let the prologue carry the fantasy. A playable taste of power, then the fall. Keep one thread across the reset, a visual effect or a single relic, so the two states feel connected.
- Test the fall two ways. A playable prologue against a cutscene-only one, with the same question: did players read the reset as the start of progression or as punishment?
- Watch the boredom point, not the confusion point. Confusion in hour one is the genre filter working. Boredom at hour fifteen is the real churn.
- Treat the clone risk as a design brief. If the mechanics copy easily, the moat is feel, hidden content and the community that forms around the first server.

## Where this breaks

The tester who understood nothing is also a real player who left. A genre filter at the door keeps the audience small, and 9T is betting that the small audience spends and stays, which is a monetization bet as much as a design one. The prologue trick also has a failure mode: a reset that feels like loss instead of beginning, which is why the rejection test above matters more than the idea. And friction only works when it is consistent. One accidental difficulty spike reads as a bug; a deliberate one reads as the world. The player can only tell the difference if the rest of the game earns the trust.

## Sources

- Build-club threads: [9T release and design](https://discord.com/channels/462663954813157376/1280726623414390805/1555251288785158357), [tester confusion and the guide](https://discord.com/channels/462663954813157376/1280726623414390805/1555420689949925387), [the overpowered prologue](https://discord.com/channels/462663954813157376/1280726623414390805/1560530413175312536)
- [On the design of Dark Souls, Game Developer](https://www.gamedeveloper.com/design/on-the-design-of-dark-souls); [When games refuse to explain themselves](https://videogame.town/2026/06/25/when-games-refuse-to-explain-themselves/)
- [Rain World, Wikipedia](https://en.wikipedia.org/wiki/Rain_World)
- [Tale of Immortal sales, PCGamesN](https://www.pcgamesn.com/tale-of-immortal/sales)
- [Dwarf Fortress first-month sales, Game Rant](https://gamerant.com/dwarf-fortress-500000-sold-steam-december-2022/)
- [Intentional friction research paper, Rory Lyons](https://axelftv.github.io/content/university/Rory-Lyons-Intentional-Friction.pdf)
- [A Taste of Power, TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/ATasteOfPower); [Alucard in Symphony of the Night](https://castlevania.fandom.com/wiki/Alucard/Symphony_of_the_Night)
