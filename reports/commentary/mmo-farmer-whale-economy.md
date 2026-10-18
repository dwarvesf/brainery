---
title: "Twenty accounts and one whale: the economy loop that makes cultivation MMOs pay"
description: "bievh's account of why cultivation MMOs pay: 20-account farmers supply the rich players, who keep paying. Plus the Vietnam licensing wall a solo builder hits before launch."
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

bievh is taking his cultivation game, [9T](https://bienvh.itch.io/9t), from a single-player build to an online one. In #build-club he described how the genre pays: "tụi player cắm 20 acc farm resource đầu game, r bán cho ng giàu, cuối cùng ng giàu nạp nhiều nên ở lại nạp giếp" (players park 20 accounts to farm early-game resources, then sell to the rich players; in the end the rich have paid so much that they stay and keep paying). His verdict: "thể loại đó dễ kiếm tiền nhất" (that genre is the easiest to make money in). tieubao asked whether he meant cultivation games; bievh: "yep a".

_Written by neko-anon, the Dwarves editorial desk bot, from a #build-club discussion. Ideas from [bievh](/contributor/bievh), [tieubao](/contributor/tieubao) and [monotykamary](/contributor/monotykamary)._

![The farmer-whale loop: farmers sell on an exchangeable marketplace, whales buy from it, and the publisher sells time shortcuts; a dashed line marks cash-out as fined](assets/mmo-farmer-whale-economy-fig1-loop.svg)

_Fig. 1: The loop as the thread described it. Farmers sell, whales buy, and the publisher sells time in between._

## Where the loop came from

On 8 October bievh showed the last offline build and said the online version was in progress. tieubao's read of the solo version: "dang bi gioi han canh gioi, hoi kho kiem tien" (it is capped by realm and a bit hard to make money from). Then the pattern he sees across the genre: "may game tu hanh pattern no toan kieu cho user bo tien ra mua thoi gian" (cultivation games all follow the pattern of making the user pay to buy time), "thay vi phai di farm thi co shortcut" (instead of farming, there is a shortcut).

monotykamary's rule for the market side: "if you want proper MRR in a game, you need to make an exchangeable marketplace". bievh: "i have it sir". Players farm items, sell them, and spend the proceeds on levelling.

tieubao added where the spend peaks: "tien thuong spend nhieu nhat la luc dua rank cho guild" (money is spent most when guilds race for rank), so let players found sects; PvP makes money too. bievh: already in the build. The 20-account explanation quoted above came ten minutes later.

## Four roles, one bridge

| Role        | Has                 | Wants                    | Gives the game                              |
| ----------- | ------------------- | ------------------------ | ------------------------------------------- |
| Farmer      | Time, many accounts | Progress, a small income | Supply of items and currency                |
| Whale       | Money               | Status, rank, speed      | Most of the revenue                         |
| Marketplace | Rules, fees         | Liquidity                | The reason farmers and whales both stay     |
| Publisher   | Time shortcuts      | Recurring revenue        | The paid alternative to farming             |

bievh's reason the whales stay is sunk cost: having paid a lot, they keep paying. The farmers keep the shelves full for them.

## What this looks like in Vietnam

The genre has a long record here. VNG launched Võ Lâm Truyền Kỳ in 2005, with [120,000 accounts registering in the first 48 hours of closed beta](https://vietnamnet.vn/vo-lam-truyen-ky-da-duoc-mang-ve-viet-nam-cach-day-12-nam-truoc-nhu-the-nao-ig17074.html), [nearly 800 million VND of revenue on the first day hourly fees went live](https://thanhnien.vn/vo-lam-truyen-ky-va-cau-chuyen-khai-nguyen-lang-game-viet-1851021593.htm), and [100,000 concurrent players by Tết 2006, then 200,000 by early July](https://vietnamnet.vn/vo-lam-truyen-ky-da-duoc-mang-ve-viet-nam-cach-day-12-nam-truoc-nhu-the-nao-ig17074.html). bievh's view of that audience today: "cộng đồng vltk còn đông và giàu lắm" (the Võ Lâm community is still large and rich). And: "miễn nó farm quái đấm nhau đx" / "là có ng chơi" (as long as they can farm monsters and fight, people will play).

He had a live example, a Võ Lâm-style web game he lurks in. On 8 October it was in beta with about 2,000 users, and "tụi nó nạp kinh luôn" (they were paying heavily). Some mobile players had complained the newbie gift did not arrive, which he read as a bug. By 12 October he reported two Zalo groups of 1,000 members each, a community price list for items already formed, and about 500 players online daily.

On reaching players, tieubao suggested seeding in comic groups and "radio cac kieu" (radio and the like), given the theme. He also floated retheming the loop for another market, with short dramas about rebirth as the pointer. bievh's own plan: "chac di shill tu tu thoi" (shill it slowly). The offline version, he said, drew people asking about the art rather than playing.

## The wall before any of this is legal

When phucld posted a game listing on 6 October, bievh asked whether selling that way gets you fined. 0xm: "làm game ko biết kiếm đc tiền chưa mà bị phạt là 70 củ" (you do not know yet if the game makes money, and the fine is 70 million). The published numbers run higher, and 70 million is one tier among several.

An online game with a server in the middle, which is what 9T becomes the moment it goes multiplayer, is a G1 game under [Decree 147/2024](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/). Releasing one needs a licence to provide G1 game services and a decision on release of the specific game. [Article 39 of the decree](https://vietanlaw.com/g1-game-license/), as Viet An Law summarises it, lists the conditions: an enterprise established under Vietnamese law with game services on its business registration, a registered domain, a game copyright certificate, a server rental contract with at least six months left from a licensed telecom provider, and a playtime system for players under 18 capped at 60 minutes a day per game and 180 minutes a day across the enterprise's games. Cross-border provision of online games to Vietnamese users [remains prohibited](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/).

The penalty side, as [BLawyers summarises it](https://www.blawyersvn.com/how-does-vietnamese-law-regulate-sanctions-for-violations-committed-by-video-game-businesses/): a fine of up to 170 million VND for providing a G1 game without a valid licence, up to 100 million for a G2 to G4 game without a valid registration certificate, and up to 70 million for failing to notify a G2 to G4 game or for running a G1 game on an expired licence. The newer [Decree 174/2026, effective 1 July 2026](https://vietnamnet.vn/en/vietnam-to-fine-online-game-reward-redemption-by-up-to-usd-7-850-2519423.html), sets 170 to 200 million VND for converting virtual items, virtual currency or reward points into cash, prepaid cards, vouchers or other items with value outside the game. The same VietnamNet report says the regulation also targets games that let players buy and sell virtual items, virtual currencies or reward points directly with one another. monotykamary's exchangeable marketplace sits inside that sentence. What form of trading the loop can keep is a question for a lawyer before launch.

bievh named three routes. Go legit: register a company and apply for the licence. If that fails, launch globally; he has an English version ready. If that fails too, wrap the offline build and sell it on the App Store. An offline download without a server is a G4 game under the decree's definitions on the Tilleke page, and BLawyers lists up to 70 million VND for failing to notify a G2 to G4 game, so that route carries paperwork of its own. phucld's version was to exclude Vietnam, or ship to Vietnam as a web game that is easy to take down.

## Where this breaks

tieubao named the clone risk on release night: 500 to 1,000 players would be enough to raise funds, and others would copy fast. bievh agreed, "nay clone nhanh ma" (these get cloned fast), and added: "nen em van de tam ly vui ve thoi a" (so I just keep a cheerful mindset about it).

## Sources

- Build-club threads: [monetization](https://discord.com/channels/462663954813157376/1280726623414390805/1557730884495482982), [distribution](https://discord.com/channels/462663954813157376/1280726623414390805/1556928546629222531)
- [Võ Lâm Truyền Kỳ history, Thanh Niên](https://thanhnien.vn/vo-lam-truyen-ky-va-cau-chuyen-khai-nguyen-lang-game-viet-1851021593.htm) and [VietnamNet](https://vietnamnet.vn/vo-lam-truyen-ky-da-duoc-mang-ve-viet-nam-cach-day-12-nam-truoc-nhu-the-nao-ig17074.html)
- [Decree 147/2024 overview, Tilleke & Gibbins](https://www.tilleke.com/insights/a-closer-look-at-vietnams-decree-147-on-internet-services-and-online-information/) and [G1 conditions, Viet An Law](https://vietanlaw.com/g1-game-license/)
- [Game-business sanctions, BLawyers](https://www.blawyersvn.com/how-does-vietnamese-law-regulate-sanctions-for-violations-committed-by-video-game-businesses/) and [Decree 174/2026, VietnamNet](https://vietnamnet.vn/en/vietnam-to-fine-online-game-reward-redemption-by-up-to-usd-7-850-2519423.html)
