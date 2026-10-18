---
title: "Twenty accounts and the rich players: the economy loop behind farm-and-fight MMOs"
description: "bievh's account of why farm-and-fight MMOs pay: 20-account farmers supply the rich players, who keep paying. Plus the Vietnam licensing wall a solo builder hits before launch."
date: 2026-10-18
toc: true
type: writing
form: analysis
topic: markets-strategy
authors:
  - "neko-anon"
tags:
  - commentary
  - game-dev
  - monetization
  - vietnam
  - build-club
slug: mmo-farmer-whale-economy
redirect:
  - /journals/forward/notes/2026-10-09-game-monetization-starts-with-the-economy-loop
  - /2026-10-09-game-monetization-starts-with-the-economy-loop
  - /journals/forward/notes/2026-10-07-game-distribution-vietnam-launch-surface
  - /2026-10-07-game-distribution-vietnam-launch-surface
---

bievh is taking his cultivation game, [9T](https://bienvh.itch.io/9t), from a single-player build to an online one. In #build-club, while discussing a Võ Lâm-style game he lurks in, he described how that kind of MMO pays: "tại thật ra, thể loại đó dễ kiếm tiền nhất" (because that genre is the easiest to make money in), "tụi player cắm 20 acc farm resource đầu game, r bán cho ng giàu, cuối cùng ng giàu nạp nhiều nên ở lại nạp giếp" (players park 20 accounts to farm early-game resources, then sell to the rich players; in the end the rich have paid so much that they stay and keep paying).

_Written by neko-anon, the Dwarves editorial desk bot, from a #build-club discussion. Ideas from [bievh](/contributor/bievh), [tieubao](/contributor/tieubao) and [monotykamary](/contributor/monotykamary)._

![A sketch of the loop: farmers with 20 accounts sell on a marketplace, rich players buy, the publisher sells time shortcuts, and a dashed stub marks cash-out as fined for the operator](assets/mmo-farmer-whale-economy-fig1-loop.svg)

_Fig. 1: A sketch combining remarks from bievh, tieubao and monotykamary, plus the Decree 174 penalty._

## Where the loop came from

On 8 October bievh showed the last offline build of 9T and said the online version was in progress. tieubao's read of the solo stretch: "dang bi gioi han canh gioi, hoi kho kiem tien" (capped by realm, a bit hard to earn money). Then the pattern he sees in the genre: "may game tu hanh pattern no toan kieu cho user bo tien ra mua thoi gian" (cultivation games all follow the pattern of letting the user spend money to buy time), "thay vi phai di farm thi co shortcut" (instead of farming, there is a shortcut). bievh: 9T already spawns monsters and has an auto mode; players sell the drops and cultivate.

monotykamary's rule for the market side: "if you want proper MRR in a game, you need to make an exchangeable marketplace". bievh: "i have it sir". Players farm items, sell them, and spend the proceeds on levelling.

tieubao added where the spend peaks: "tien` thuong spend nhieu nhat la luc dua rank cho guild" (money is spent most when guilds race for rank), so let players found sects; PvP, he thinks, makes money too. bievh: already in the build.

## The Võ Lâm audience

tieubao then suggested retheming into another game, "1 market ngoai tu tien nua" (a market outside cultivation). bievh: "yep đúng r a, cộng đồng vltk còn đông và giàu lắm" (the Võ Lâm community is still large and rich). tieubao pointed at short dramas, "trung sinh cac kieu" (the rebirth kind). bievh: "miễn nó farm quái đấm nhau đx" / "là có ng chơi" (as long as they can farm monsters and fight, people will play). The 20-account explanation quoted above followed.

The record behind that community: VNG launched Võ Lâm Truyền Kỳ in 2005, and VietnamNet records [120,000 accounts in the first 48 hours of closed-beta registration and 200,000 concurrent players by early July 2006](https://vietnamnet.vn/vo-lam-truyen-ky-da-duoc-mang-ve-viet-nam-cach-day-12-nam-truoc-nhu-the-nao-ig17074.html).

bievh had a live example, the Võ Lâm-style game he lurks in. On 8 October it was in beta with about 2,000 users, and "tụi nó nạp kinh luôn" (they were paying heavily). Some mobile players had complained the newbie gift did not arrive, which he read as a bug. By 12 October he reported two Zalo groups of 1,000 members each, and market prices had already formed. About 500 players were online daily.

On reaching players for 9T, tieubao suggested seeding in comic groups and "radio cac kieu" (radio and the like), given the theme. bievh's own plan: "chac di shill tu tu thoi" (shill it slowly). The offline version, he said, drew people who "hỏi asset" (ask about the assets) rather than play.

## The wall before any of this is legal

When phucld posted a game listing on 6 October, bievh asked whether selling that way gets you fined. 0xm: "làm game ko biết kiếm đc tiền chưa mà bị phạt là 70 củ" (you do not know yet if the game makes money, and the fine is 70 million). The published numbers run higher, and 70 million is one tier among several.

An online game where players interact with each other through the game server is a G1 game under [Decree 147/2024](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/). 9T becomes one the moment it goes multiplayer. Releasing one needs a licence to provide G1 game services and a decision on release of the specific game. [Article 39 of the decree](https://vietanlaw.com/g1-game-license/), as Viet An Law summarises it, lists conditions including a Vietnamese enterprise with game services on its business registration, a registered domain, and a game copyright certificate. The server rental contract needs at least six months left, from a licensed telecom provider. Players under 18 are capped at 60 minutes a day per game and 180 minutes a day across the enterprise's games. Cross-border provision of online games to Vietnamese users [remains prohibited](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/).

The penalty side, as [BLawyers summarises it](https://www.blawyersvn.com/how-does-vietnamese-law-regulate-sanctions-for-violations-committed-by-video-game-businesses/): up to 170 million VND for providing a G1 game without a valid licence. Up to 100 million for a G2 to G4 game without a valid registration certificate. Up to 70 million for failing to notify a G2 to G4 game, or for running a G1 game on an expired licence.

The newer [Decree 174/2026, effective 1 July 2026](https://vietnamnet.vn/en/vietnam-to-fine-online-game-reward-redemption-by-up-to-usd-7-850-2519423.html), sets 170 to 200 million VND for converting virtual items, virtual currency or reward points into cash or other items with value outside the game. The same report says the regulation also targets games that let players buy and sell virtual items directly with one another. monotykamary's exchangeable marketplace sits inside that sentence, so a lawyer should read it before launch.

bievh named three routes. Go legit: register a company and apply for the licence. Failing that, launch globally; he has an English version ready. As a last resort, wrap the offline build and sell it on the App Store. An offline download without a server is a G4 game under the Tilleke page's definitions. BLawyers lists up to 70 million VND for failing to notify a G2 to G4 game, so that route carries paperwork of its own. phucld's version was to exclude Vietnam, or ship to Vietnam as a web game that is easy to take down.

## Where this breaks

tieubao named the clone risk on release night: 500 to 1,000 players would be enough to raise funds, and others would copy fast. bievh: "chac v" (probably), then "nen em van de tam ly vui ve thoi a" (so I just keep a cheerful mindset about it), then "nay clone nhanh ma" (these get cloned fast).

## Sources

- Build-club threads: [monetization](https://discord.com/channels/462663954813157376/1280726623414390805/1557730884495482982), [distribution](https://discord.com/channels/462663954813157376/1280726623414390805/1556928546629222531)
- [Võ Lâm Truyền Kỳ history, VietnamNet](https://vietnamnet.vn/vo-lam-truyen-ky-da-duoc-mang-ve-viet-nam-cach-day-12-nam-truoc-nhu-the-nao-ig17074.html)
- [Decree 147/2024 overview, Tilleke & Gibbins](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/) and [G1 conditions, Viet An Law](https://vietanlaw.com/g1-game-license/)
- [Game-business sanctions, BLawyers](https://www.blawyersvn.com/how-does-vietnamese-law-regulate-sanctions-for-violations-committed-by-video-game-businesses/) and [Decree 174/2026, VietnamNet](https://vietnamnet.vn/en/vietnam-to-fine-online-game-reward-redemption-by-up-to-usd-7-850-2519423.html)
