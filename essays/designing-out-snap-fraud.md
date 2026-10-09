---
draft: false
title: "Designing Out SNAP Fraud"
description: "SNAP fraud is smaller and different from what public debate assumes. A taxonomy of trafficking, theft, and error, and a layered program and software architecture that designs fraud out."
date: 2026-10-09
authors:
  - "han-ngo"
tags: []
redirect:
  - "/writers/truonghan.com/designing-out-snap-fraud"
guest: true
writer_id: "wr_01M4FD90NGV0ABHHSSDMG3829G"
canonical_url: "https://truonghan.com/designing-out-snap-fraud/"
original_domain: "truonghan.com"
mirrored_at: 2026-10-09
last_checked: 2026-10-09
rights: "Republished with the writer's consent; the original is the source of truth."
---

[](https://truonghan.com/cdn-cgi/content?id=Jjq3AeKCRdjOoTkDebBCth220KAbkLZXWtTp31H32yw-1791524370.321421-1.2.1.1-LMrxWqwIJstVx8I9xRtchcK5u06M123KrnAocQbG8taDMvmjaip25i6xpyDa3uEl) 

Policy and systems report, October 2026

# Designing Out SNAP Fraud

The Supplemental Nutrition Assistance Program (SNAP) cost about \$100 billion in federal funds in fiscal year 2024 and served an average of 41.7 million people each month. Public debate often treats the program's payment error rate, near 11 percent in recent years, as a fraud rate. That reading is wrong.

By [Han Ngo](https://truonghan.com/) · 8,360 words · 26 figures

## Contents

1. [Abstract](https://truonghan.com/designing-out-snap-fraud/#abstract)
2. [1\. Introduction](https://truonghan.com/designing-out-snap-fraud/#introduction)
3. [2\. A taxonomy of SNAP fraud](https://truonghan.com/designing-out-snap-fraud/#a-taxonomy-of-snap-fraud)
4. [3\. Anatomy of trafficking](https://truonghan.com/designing-out-snap-fraud/#anatomy-of-trafficking)
5. [4\. Current detection and enforcement](https://truonghan.com/designing-out-snap-fraud/#current-detection-and-enforcement)
6. [5\. Design principles](https://truonghan.com/designing-out-snap-fraud/#design-principles)
7. [6\. A layered program and software architecture](https://truonghan.com/designing-out-snap-fraud/#a-layered-program-and-software-architecture)
8. [7\. Price anomaly detection without human basket review](https://truonghan.com/designing-out-snap-fraud/#price-anomaly-detection-without-human-basket-review)
9. [8\. Trade-offs and harms](https://truonghan.com/designing-out-snap-fraud/#trade-offs-and-harms)
10. [9\. The policy alternative](https://truonghan.com/designing-out-snap-fraud/#the-policy-alternative)
11. [10\. Implementation roadmap](https://truonghan.com/designing-out-snap-fraud/#implementation-roadmap)
12. [11\. Conclusion](https://truonghan.com/designing-out-snap-fraud/#conclusion)
13. [Appendix A. UML models](https://truonghan.com/designing-out-snap-fraud/#appendix-a-uml-models)
14. [References](https://truonghan.com/designing-out-snap-fraud/#references)

## Abstract

The Supplemental Nutrition Assistance Program (SNAP) cost about \$100 billion in federal funds in fiscal year 2024 and served an average of 41.7 million people each month. Public debate often treats the program’s payment error rate, near 11 percent in recent years, as a fraud rate. That reading is wrong. The error rate counts overpayments and underpayments from all causes, and most of it reflects mistakes by households and state agencies. The most studied fraud, trafficking (selling benefits for cash), diverted an estimated 1.6 to 2.0 percent of benefits from 2015 to 2017, almost all of it through small stores. Card skimming, a newer threat, steals from recipients. This report builds a taxonomy of SNAP fraud and explains why trafficking persists: the payment record carries no item list, and the shopper and the cashier both profit from the lie. It proposes a layered architecture covering eligibility, credentials, transactions, merchant payouts, and analytics. Its central problem is finding price anomalies across millions of daily transactions without human basket review. The answer is store-level scoring, automated graduated responses, and an investigation queue capped by budget. The report closes with harms, a policy alternative, and a phased roadmap.

## 1\. Introduction

SNAP is the largest food assistance program in the United States. The US Department of Agriculture (USDA) funds the benefits and sets the rules. States determine eligibility, issue benefits, and run their own integrity units. USDA’s Food and Nutrition Service (FNS) authorizes and polices the retailers that accept benefits. In 2026 USDA renamed FNS the Food and Nutrition Administration (FNA), effective June 1, 2026\. This report keeps the name FNS because the studies and regulations it cites use that name.

Households receive benefits on an Electronic Benefit Transfer (EBT) card. The card works like a debit card restricted to a closed network of authorized retailers. A state loads the monthly benefit onto the household’s account. The household buys eligible food at an authorized store, and the store’s EBT processor debits the account. Within a few banking days the store receives the same amount in its bank account. Most EBT cards issued until recently used a magnetic stripe and a PIN. They carried no chip.

The scale is large on both sides of the transaction. USDA’s Economic Research Service reports that SNAP served a monthly average of 41.7 million people in fiscal year 2024, about 12 percent of the US population, at a federal cost of \$99.8 billion. Federal spending rose to about \$102 billion in fiscal year 2025\. Retailers number roughly 260,000\. Superstores and supermarkets make up a small share of those stores but redeem most of the benefits. Convenience stores, small groceries, and specialty shops make up most of the authorized locations but redeem a small share of the dollars.

Fraud matters for two reasons. The first is budgetary. A benefit dollar that becomes 50 cents of cash for a recipient and 50 cents of profit for a store buys no food. The second is legitimacy. SNAP depends on public support, and that support erodes when voters believe the program leaks. Inflated claims about fraud do their own damage. They lead to controls that cost more than they save and that push eligible families out of the program. A sound design starts from accurate numbers (Figure 1).

Figure 1

#### Who does what in SNAP

Federal funds, state eligibility, and private payment rails all meet at one place: the store's card terminal.

money or benefits data data feed the report proposes 

weak point The authorization message carries store, card, amount, date, and time. No item list reaches FNS, so every check infers fraud from amounts and timing.

**Read it as:** many actors touch each benefit dollar, yet the one record they all share holds an amount and no basket. The amber feed is the report's proposal: purchase records the store does not write.

## 2\. A taxonomy of SNAP fraud

The Congressional Research Service groups SNAP integrity problems into trafficking, retailer application fraud, household errors and fraud, state agency errors and fraud, and external scams that steal benefits. This report uses a slightly finer grouping because each type calls for a different control (Figure 2).

| Type                                       | Who commits it                                       | Who loses               | Mechanism                                                                                  | Main control today                                                                                 |
| ------------------------------------------ | ---------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Trafficking                                | Recipient and store, together                        | Taxpayers               | Card swiped for a sale that does not happen; store pays recipient cash at a discount       | ALERT transaction analytics, undercover buys, retailer disqualification                            |
| Recipient eligibility fraud                | Applicant                                            | Taxpayers               | Underreported income, invented household members, hidden assets, enrollment in two states  | State verification, data matching, quality control reviews, intentional program violation hearings |
| Retailer ineligible sales and overcharging | Store, sometimes with shopper                        | Taxpayers or recipient  | Benefits used for alcohol, tobacco, or household goods; prices inflated for EBT shoppers   | Undercover buys, complaints, term disqualification                                                 |
| Card skimming and cloning                  | Outside criminals                                    | Recipient               | Device copies magstripe data and PIN; clone drains the account soon after the monthly load | Card replacement policies, chip cards (new), recipient card locks                                  |
| Insider fraud                              | Caseworker or state employee                         | Taxpayers               | Fictitious cases, benefits issued to accomplices, data sold                                | Audits, separation of duties, access logs                                                          |
| Organized rings                            | Groups spanning stores, recruiters, and card holders | Taxpayers or recipients | Many cards trafficked through a few stores; mass skimming operations                       | Joint federal and state investigations, network analysis                                           |

Figure 2

#### Six kinds of SNAP fraud: who commits it, who pays

Most fraud drains taxpayer money; skimming steals the family's food money.

Who loses / who commits

Recipient

Store

Outside criminal

Caseworker

Organized ring

**Taxpayers**program money is lost

**The family**its food money is gone

##### Trafficking

Card swiped for a sale that never happens; the store pays the recipient cash at a discount.

recipient and store, together

by: recipient + storeloses: taxpayers

##### Eligibility fraud

Underreported income, invented members, two-state enrollment.

by: applicantloses: taxpayers

##### Ineligible sales, overcharging

**Collusive:** alcohol, tobacco, or paper goods paid with EBT.

by: storeloses: taxpayers

##### Overcharging, predatory form

EBT shoppers pay inflated prices and do not notice.

by: storeloses: family

##### Card skimming and cloning

A device copies stripe data and PIN; a clone drains the account soon after the monthly load.

Victim: the family finds a zero balance

by: outside criminalloses: family

Federal replacement covered some skimming losses, until it ended in December 2024.

##### Insider fraud

Fictitious cases, benefits to accomplices, data sold. Rare, and each case can be large.

by: caseworkerloses: taxpayers

##### Organized rings

Trafficking networks: many cards through a few stores under nominee owners.

by: ringloses: taxpayers

##### Rings, skimming crews

Mass card theft across states.

by: ringloses: family

**Read it as:** five types sit in the taxpayer lane. Skimming sits only in the family's lane. Overcharging and rings reach the family in some variants (dashed cards).

**Trafficking.** Trafficking is the exchange of benefits for cash or anything other than eligible food. The typical case involves a recipient who lets a store clerk swipe the card for an amount, say \$100, and receives a smaller amount of cash. Prosecutors in federal cases have reportedly described rates around 50 cents on the dollar, and some cases report higher or lower rates. Trafficking requires a retailer in almost every case, because only an authorized retailer can turn an EBT debit into a deposit. A recipient can also traffic by selling the card and PIN to a third party, who then shops with it.

**Recipient eligibility fraud.** An applicant may underreport earnings, omit a working household member, add a person who does not live in the home, or enroll in a second state. Honest mistakes produce the same outcomes, so eligibility problems show up in the error rate and only some of them are fraud.

**Retailer ineligible sales and overcharging.** A store may let EBT pay for items the law excludes, such as alcohol, tobacco, or paper goods. A store may also charge EBT shoppers more than cash shoppers, or inflate the price of real food items. The second practice can be collusive (the shopper accepts inflated prices in exchange for credit or cash) or predatory (the shopper does not notice).

**Card skimming and cloning.** Skimming is theft from recipients. A criminal attaches a device to a store’s card reader or PIN pad. The device records the magnetic stripe data and the PIN. The criminal writes the data onto a blank card and drains the account, often within hours of the monthly benefit load. The recipient arrives at the store to find a zero balance. Magnetic stripe cards are easy to clone because the stripe carries static data that works on every swipe. A chip card generates a one-time code for each purchase, so copied data does not work for a second purchase.

**Insider fraud.** State employees with system access can create fictitious cases or issue benefits to accomplices. Cases are rare, and each can be large because the insider controls the record.

**Organized rings.** Rings combine the other types, for example by running several trafficking stores under nominee owners or skimming crews across states. They leave patterns across many cards and stores that no single transaction shows.

### 2.1 Fraud versus improper payments

The claim that “11 percent of SNAP is fraud” comes from the national payment error rate. USDA computes that rate each year from a quality control sample of cases. Reviewers check whether each sampled household received the correct benefit. Any difference above a small tolerance counts as an error, in either direction.

| Fiscal year | National payment error rate | Overpayment rate | Underpayment rate |
| ----------- | --------------------------- | ---------------- | ----------------- |
| 2023        | 11.68%                      | 10.03%           | 1.64%             |
| 2024        | 10.93%                      | 9.26%            | 1.67%             |
| 2025        | 10.62%                      | 9.28%            | 1.33%             |

Four facts separate this rate from fraud. First, it includes underpayments, which are money the program failed to pay to eligible families. Second, it counts errors regardless of cause, and the largest causes are mistakes in income and household data made by households or caseworkers. USDA’s own release for fiscal year 2024 stated that the rate is not a measure of fraud. Third, it measures eligibility and benefit amounts only. It does not measure trafficking at all, because a trafficked benefit was correctly issued to an eligible household before it was sold. Fourth, error rates move with administrative load. They fell to about 3.2 percent in FY2013, rose from FY2014 (6.3 percent in FY2017, 7.4 percent in FY2019), then jumped after the pandemic disrupted state operations and staffing (Figure 3).

Figure 3

#### The 11 percent is mostly error, not fraud

The payment error rate counts mistakes in both directions; trafficking, the best fraud measure, is about 1.6 to 2.0 percent.

All SNAP benefits, about \$100 billion a year (FY2024) = 100%

Outlined: the 0 to 12% slice, enlarged below on one scale.

0%2%4%6%8%10%12% 

**Payment error rate** FY2024, all causes, both directions 10.93% about \$10B 

* Overpayments 9.26%: mostly income and household data mistakes
* Underpayments 1.67%: money families were owed and not paid

**Trafficking (fraud)** 2015 to 2017 estimate 1.6% to 2.0% 

* 1.6% updated definition, about \$1.0B a year
* to 2.0% older definition, about \$1.3B a year

##### Errors, either direction

Any gap above a small tolerance counts, whatever the cause. USDA, FY2024: the rate is not a measure of fraud.

##### Trafficking is not in the 11%

A trafficked benefit was correctly issued to an eligible household, then sold for cash. The error rate never sees it.

##### Read sizes, not sums

Different years, methods, and measures. GAO: true trafficking is uncertain, about \$960 million to \$4.7 billion a year.

**Read it as:** compare bar lengths. The grey bar is error, mostly honest mistakes; the red bar is the fraud estimate, under a fifth of its length. Controls aimed at one do little for the other.

The error rate is still a serious problem. Improper payments of about \$10 billion a year are real money, and Congress has tied state cost sharing to error rates starting with fiscal year 2028\. The point is narrower: the error rate and the fraud rate measure different things, and controls aimed at one do little for the other. The best available national fraud measure is the trafficking estimate. FNS’s eighth study in that series, covering 2015 to 2017 and published in 2021, estimated that 1.6 percent of benefits were trafficked under its updated definition (about \$1.0 billion a year) and 2.0 percent under the older definition (about \$1.3 billion a year). The earlier 2012 to 2014 study put the rate near 1.5 percent. GAO’s 2018 analysis of the earlier 2012 to 2014 study warned that the true figure is uncertain and could range from about \$960 million to \$4.7 billion a year, because the estimate rests on untested assumptions about how much of a trafficking store’s volume is trafficked.

## 3\. Anatomy of trafficking

The money flow of a single trafficking transaction is simple (Figure 4).

Figure 4

#### How one trafficking swipe moves the money

The recipient and the store split \$100 of food aid as cash; the program pays in full and no food changes hands.

##### Recipient

EBT card holds \$100 of benefits

At the counter: the lie 

1**\$100 swipe** card debited, no food handed over 

2**\$50 cash** paid back over the counter 

##### Corrupt store

Small, owner-run shop

In the network: looks normal 

3**\$100 claim** store, card, amount, time: approved 

4**\$100 deposit** paid in full, in a few banking days 

##### USDA (taxpayers)

Reimburses stores for EBT sales

Where each party ends up

+\$50 

##### Recipient: cash

Gave up \$100 of food benefits for half as much spendable cash.

+\$50 

##### Store: profit

Received \$100, paid out \$50, sold no food.

−\$100 

##### Taxpayers: food aid

Paid in full for a sale that bought no food.

Illustrative Example amounts. Federal cases reportedly describe rates around 50 cents on the dollar; some report higher or lower.

**Read it as:** both people at the counter gain, so neither complains. The full loss lands on the program, which sees only a normal approved sale.

**The core weakness.** The EBT authorization message carries the store, the card, the amount, the date, and the time. It carries no list of items. FNS’s 2016 feasibility study on capturing purchases at the point of sale confirmed that only total transaction amounts reach FNS. A trafficking store therefore never has to invent products. It keys in an amount, the network approves it, and the deposit follows. Every downstream check has to infer the fraud from the shape of the amounts and timings, because the record contains nothing else (Figure 5).

Figure 5

#### The blind record: an amount with no basket

The EBT record says where, which card, how much, and when, but never what was bought.

What the record carries

EBT AUTHORIZATIONAPPROVED

STORE

retailer 0418823

CARD

•••• 5207

AMOUNT

\$87.43

DATE

day of sale

TIME

14:02

Sent to FNS daily, for every SNAP sale. Illustrative values

What it lacks: the item list

ITEMQTYPRICE

???

???

???

…

NOT SENT 

Only total amounts reach FNS (FNS 2016 feasibility study).

1. **Store keys in an amount**no basket behind it
2. **Network approves**valid card, enough balance
3. **Deposit follows**store paid in full

##### Variant: overcharging (partial trafficking)

Real groceries go home, but the register charges more than they cost.

\$40 real groceries \$15 shopper \$15 store 

Register charges \$70Illustrative

The basket looks normal in size and timing, so amount-based analytics struggle to catch it.

**Read it as:** a real \$87.43 basket and a trafficked \$87.43 swipe produce the same record. Every later check must guess from amounts and timing.

**Both parties lie together.** In most fraud, a victim has an incentive to report. In trafficking, the shopper and the cashier both gain. The recipient converts restricted benefits into cash, which can pay rent or utilities, or in worse cases buy drugs. The store keeps the spread. Neither party will complain, and any data either party enters can be shaped to look normal. This collusion property drives most of the design choices later in this report.

**Why small stores dominate.** The 2015 to 2017 study found that small stores (small and medium groceries and convenience stores) handled about 15 percent of redemptions but accounted for over 95 percent of trafficked dollars, and 99 percent under the updated definition. Several factors explain the concentration. A small store is often owner-operated, so one person controls the register, the cash drawer, and the books. Large chains run centralized point-of-sale systems with item scanning, cashier logins, and loss-prevention audits, and a cashier who trafficked would be stealing from the employer. Small stores also have few transactions per day, so a trafficking swipe does not need to hide in a long queue of scanned baskets. FNS enforcement focuses on small stores, on the ground that large stores’ own controls deter trafficking.

**The overcharging variant.** A store can also traffic partially. The shopper buys real groceries worth \$40, the register charges \$70, and the shopper receives \$15 in cash or store credit. The store earns \$15 above its margin. This version leaves a basket that looks normal in size and timing, so it is harder for amount-based analytics to catch. It also has a predatory form, where the store inflates prices for EBT shoppers who do not check their receipts.

**The economics.** Any restricted currency trades at a discount to cash. A dollar of benefits that can only buy groceries is worth less than a dollar to a household that needs to pay rent. A household that already spends more than its benefit on food gains little from trafficking, because benefits replace cash food spending dollar for dollar. A household with an urgent cash need, or one whose benefit exceeds its food budget, may value a benefit dollar at well under a dollar. Trafficking monetizes that gap. A store that can offer cash at 50 to 70 cents per dollar captures the remainder. Enforcement leaves the gap in place and raises the price of crossing it, by adding the risk of disqualification and prosecution to the store’s side of the trade.

## 4\. Current detection and enforcement

### 4.1 Transaction analytics: ALERT

FNS’s main detection tool for retailer trafficking is the Anti-Fraud Locator using EBT Retailer Transactions (ALERT). State EBT processors send FNS daily records of every SNAP transaction. GAO reported in 2018 that ALERT scanned about 250 million transactions per month. The system assigns each store a numeric score for the likelihood of trafficking. Stores above a threshold join a watch list, and analysts prioritize them using factors such as average transaction size relative to store type. Analysts also compare a suspect store with similar stores in the same ZIP code. CRS (R45147, 2018) reported that over 80 percent of the retailer trafficking FNS detects is found mainly through EBT transaction analysis (Figure 6).

Figure 6

#### How SNAP catches trafficking today

Transaction analytics find most cases, people confirm them, and sanctions fall mostly on stores, after the money is paid.

1 

##### EBT records

State processors send FNS every transaction, daily.

\~250M/month (GAO 2018) 

daily records

2 

##### ALERT flags

Each store gets a trafficking score; stores above a threshold join a watch list.

80%+ of detected retailer trafficking is found mainly through EBT data (CRS)

watch list

3 

##### Analyst review

Rank by sale size against store type; compare with similar stores in the same ZIP code.

priority cases

4 

##### Undercover buy

FNS or USDA OIG agents offer to sell benefits; state police in 28 states by agreement (GAO 2018).

evidence

5a 

##### Retailer disqualified

Trafficking: permanent (7 CFR 278.6). Other violations: 6 months to 5 years; repeats double.

EBT data alone can support it 

5b 

##### Recipient penalties

12 months, 24 months, then permanent (7 CFR 273.16). Trafficking conviction of \$500+: permanent.

often stalls: EBT data rarely enough 

**Every stage runs after the sale:** the store has already been paid.

##### Patterns that drive cases

Each is a proxy for "no real basket behind this amount."

* Many sales in round or repeated amounts, such as totals ending in .00
* Several swipes from one household account in a short window
* Sales too large for the store's size and type
* Many households making similar sales in a short period
* Accounts drained in one or two swipes, sometimes by out-of-state cards

##### Five structural limits

1. **Detects after the fact.** The store is already paid; owners can reopen under a new name.
2. **Sees only amounts.** A real \$87.43 basket and a trafficked \$87.43 swipe look the same.
3. **Targets stores, largely misses recipients.** EBT data alone is generally not enough to disqualify a recipient.
4. **Does not scale with investigators.** GAO: all stores reauthorized on a five-year cycle, regardless of risk.
5. **The card was weak.** Magnetic stripes made skimming cheap.

**Read it as:** the pipeline is a strong detector of crude store fraud. It acts late, sees only amounts, and rarely reaches the recipient side of a case.

FNS charge letters and agency decisions describe the patterns that drive these cases:

* A large number of transactions in repeated or round dollar values, such as many sales ending in .00.
* Multiple transactions from one household account within a short window, a pattern unusual for a small store with limited stock.
* Transactions that are excessively large for the store’s size and type.
* Multiple households making similar transactions within a short period.
* Accounts drained in one or two swipes, sometimes by out-of-state cards.

Each pattern is a proxy for “no real basket behind this amount.” Round totals are rare when real prices are summed. Repeat swipes from one card suggest the store is splitting a large trafficking amount to avoid a size flag. Large totals at a store with a few shelves of stock suggest the store sells more food than it holds.

### 4.2 Undercover investigations and penalties

FNS investigators and USDA’s Office of Inspector General conduct undercover buys, in which an investigator with a test card offers to sell benefits or to buy ineligible items. Under state law enforcement bureau agreements, which GAO counted in 28 states in 2018, state and local police also run their own undercover cases with SNAP cards.

Penalties are set by regulation. For retailers, 7 CFR 278.6 provides:

| Violation                                                                                                  | Retailer sanction                                                                 |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Trafficking                                                                                                | Permanent disqualification (278.6(e)(1))                                          |
| Trafficking, with an effective compliance program in place before the violation and owners not involved    | Trafficking civil money penalty in place of permanent disqualification (278.6(i)) |
| Selling ineligible items after a warning, as a practice (expensive or conspicuous items, alcohol, tobacco) | 5 years for a first sanction (278.6(e)(2))                                        |
| Common nonfood items after a warning, or (e)(2) conduct without warning                                    | 3 years (278.6(e)(3))                                                             |
| Ineligible sales by owners or managers without a warning, or credit sales                                  | 1 year (278.6(e)(4))                                                              |
| Violations from carelessness or poor supervision                                                           | 6 months (278.6(e)(5))                                                            |
| Repeat sanctions                                                                                           | The above periods double (278.6(e)(6))                                            |

The regulation lets FNS rely on “evidence obtained through a transaction report under an electronic benefit transfer system.” That clause is what lets ALERT data alone support a permanent disqualification.

For recipients, 7 CFR 273.16 sets disqualification periods for an intentional program violation: 12 months for a first violation, 24 months for a second, and permanent for a third. A court conviction for trafficking \$500 or more brings permanent disqualification on the first occasion. A fraudulent statement about identity or residence to receive benefits in more than one place brings a 10-year bar. Transactions involving firearms, ammunition, or explosives bring permanent disqualification. Transactions involving controlled substances bring 24 months, then permanent.

### 4.3 Eligibility and retailer standards

On the eligibility side, states verify income and identity using federal and state data sources. The 2018 Farm Bill required a National Accuracy Clearinghouse (NAC) to stop the same person from receiving benefits in two states at once. FNS issued an interim final rule in October 2022 requiring all state agencies to join the NAC and to act on its match results, with full compliance due by 2027\. Before the NAC, states relied on the slower Public Assistance Reporting Information System (PARIS) for interstate matching.

On the retailer side, FNS published a final rule in December 2016 to raise stocking standards. It required stores qualifying on inventory to carry at least seven varieties in each of four staple food categories, with perishable items in at least three categories and at least three units of each variety. The aim was partly integrity: a “store” with a few cans on a shelf and a busy EBT terminal is a classic trafficking front. Appropriations riders blocked enforcement of the variety and breadth provisions for years. USDA published a final rule on updated standards on May 8, 2026 (91 FR 25082), effective July 7, 2026\. Retailers must comply by November 4, 2026.

### 4.4 Skimming response

The Consolidated Appropriations Act, 2023 (P.L. 117-328, Division HH, section 501) gave states temporary authority to replace stolen benefits with federal funds, limited to the lesser of the amount stolen or two months of benefits. A later continuing resolution extended the window to cover thefts through December 20, 2024\. Congress did not extend it further. According to USDA figures cited by the Center on Budget and Policy Priorities, states replaced more than \$150 million in stolen benefits for over 315,000 households between January 2023 and September 2024\. The underlying fix is the card itself. California began issuing chip cards in early 2025, though most transactions still used the magstripe. Other states have started similar migrations (Figure 7).

Figure 7

#### Skimming: how a family's benefits vanish

A copied magstripe card is drained soon after the monthly load, and since federal replacement ended in December 2024 the family bears the loss.

The attack, one benefit month (not to scale)

1. 1  
##### Skimmer installed  
Device fitted on a store's card reader or PIN pad.  
criminal
2. 2  
##### Card data copied  
At a normal purchase, the device records stripe data and PIN.  
magstripe, no chip
3. 3  
##### Clone made  
Data written onto a blank card. Static stripe data works on every swipe.  
criminal
4. 4  
##### Benefits load  
The state loads the monthly benefit onto the family's account.  
state
5. 5  
##### Card drained  
The clone spends the whole balance.  
often within hours
6. 6  
##### Family finds \$0  
They arrive at the store to a zero balance. The month's food money is gone.  
victim: recipient

**Why a chip fixes it:** a magnetic stripe carries static data that works on every swipe. A chip card makes a one-time code per purchase, so copied data fails a second time.

Who covers the loss

2023202420252026 

Federal funds replace stolen benefits Families bear the loss 

**Dec 20, 2024** window ends; Congress did not extend it

##### P.L. 117-328 replacement rules

Capped at the lesser of the amount stolen or two months of benefits.

##### \$150M+ replaced

Jan 2023 to Sep 2024: more than \$150 million for over 315,000 households (USDA, via CBPP).

##### The lasting fix: chip cards

California began issuing chip cards in early 2025\. Other states have started.

**Read it as:** the theft hits the family, not the store or the program. Since December 2024 no federal backstop covers it, so the card itself has to change.

### 4.5 Limits of the current approach

The current model has five structural limits.

First, it detects after the fact. ALERT reads completed transactions, and the store has already been paid. By the time a store is disqualified, it may have trafficked for months, and the owners can reopen under a new name.

Second, it sees only amounts. Without items, ALERT cannot tell a real \$87.43 basket from a trafficked \$87.43 swipe. Smart traffickers learn the flags and stop using round amounts.

Third, it targets stores and largely misses recipients. EBT data alone is generally not enough to disqualify a recipient, so states struggle to act on the cardholder side of ALERT cases.

Fourth, it does not scale with investigator capacity. GAO found that FNS reauthorized all stores on a five-year cycle regardless of risk, and that its trafficking estimate rested on assumptions it had not tested.

Fifth, the card was weak. Magnetic stripe cards made skimming cheap. The program bore part of the loss through replacement, and recipients bore the rest after the replacement authority ended. Figures A1 to A4 in Appendix A model this response as UML operations diagrams.

## 5\. Design principles

Four principles shape the architecture in the next section.

**Collusion resistance.** When the shopper and the cashier both cheat, any data they enter can be faked. A store can key fake item lines, and a shopper will confirm any receipt. The system therefore needs evidence that neither party controls. Examples include wholesale invoices from suppliers, distributor shipment records, the stock a field inspector sees on the shelf, and the behavior of the same cards at other stores. Third-party evidence is the only class of data that a colluding pair cannot shape (Figure 8).

Figure 8

#### Collusion resistance: who writes the evidence?

Build detection on evidence the colluders cannot write.

fakeable

##### The pair writes it

* **Amount keyed at the terminal**store  
The store keys any total. The network approves it and the deposit follows.
* **Typed item lines**store  
"4 gallons of milk, 3 loaves of bread" can cover a \$50 trafficking swipe.
* **The receipt**store, shopper  
The shopper will confirm any receipt the store prints.
* **Cardholder app reports**shopper  
A trafficking shopper never presses "price looks wrong." Reports catch only predatory overcharging.

the pair's reach ends here

independent

##### Neither party writes it

* **Supplier invoices, distributor feeds**supplier  
For illustration, a store cannot sell 400 cartons of eggs if suppliers delivered 50.
* **Patterns across many cards and stores**network  
200 cards that spend nearly all benefits at three small related stores.
* **Field inspector's shelf check**inspector  
The stock an inspector sees on the shelf.
* **Outside income data**employer, tax data  
Payroll, wage, and tax records replace self-reported income.

**Limit:** a store can buy stock for cash at a wholesale club, which leaves no record in a distributor feed. **Fix:** make purchase records a condition of authorization, backed by random and targeted audits.

**Read it as:** every item on the left comes from the shopper or the store, so a colluding pair can make it look normal. Every item on the right comes from someone outside the deal.

**Defense in depth.** No single control stops all fraud types. Chip cards stop cloning and do nothing about trafficking. Item data constrains overcharging and only raises the cost of trafficking. Each layer should assume the layers before it have failed, and each should produce data the analytics layer can use to catch what got through.

**Economic framing.** Integrity spending is worth doing only up to the point where the next dollar of control saves at least a dollar of loss, counting the costs that controls impose on honest participants. Trafficking of about \$1 billion a year is a large number in absolute terms and a small share of a \$100 billion program. For illustration, a control that costs \$600 million a year to prevent \$300 million in trafficking is a bad trade.

**Protect honest participants.** False positives cut food to families. A wrongly disqualified store can leave a neighborhood with no place to use EBT. A wrongly flagged recipient can lose benefits during an appeal. Error costs fall on people with little cushion. Every automated action needs a reversible design, a fast appeal, and human review before any benefit cutoff.

## 6\. A layered program and software architecture

The architecture has four transaction-path layers and one analytics layer that reads from all of them. Confirmed cases flow back into the analytics layer as labels (Figure 9).

Figure 9

#### A layered program and software architecture

Four layers act on each enrollment or sale; one analytics layer reads them all, because fraud is weak in one event and strong in a pattern.

Transaction path: acts on each enrollment or sale

1

##### Eligibility

Who gets benefits, and how much

* Income match: payroll, wage, tax, bank
* National duplicate check (NAC) before first issuance, rechecked monthly
* Household composition cross-checks

stopsEligibility fraud, two-state enrollment

sends analytics: match results

approved case

2

##### Credential and card

Who can spend a benefit

* EMV chip and tap, phone wallet
* App lock, out-of-state and online blocks
* Per-swipe alerts, load-day step-up

stopsCard skimming and cloning

sends analytics: card events

verified card

3

##### Transaction

What each sale contains

* Item-level basket: barcode, quantity, unit price
* Real-time reject of ineligible items
* Per-store product catalog

stopsIneligible sales; makes trafficking costlier

sends analytics: baskets

approved sale

4

##### Merchant payout

When and how the store gets paid

* Probation for new stores
* Risk-tiered payout delays and volume caps
* Time-limited holds, rolling reserve

stopsHit-and-run trafficking; keeps money recoverable

sends analytics: payouts

match results card events baskets payouts 

all four layers send events

labels: fraud or not fraud

5

##### Analytics layer

Acts on aggregates over time. Scores stores, cards, and cases.

###### Price anomaly score

Store-month prices against regional reference prices per barcode

catchesOvercharging

###### Inventory reconciliation

EBT sales per category against wholesale purchases

catchesFake baskets, trafficking

###### Card-store graph

Clusters of cards at a few stores, shared owners, shared bank accounts

catchesOrganized rings

Third-party data **Wholesale invoices** **Distributor feeds** 

The stores do not write these.

top N by expected loss

##### Investigation queue people

Capped by budget: investigator hours set N.

A case gets a review only if its expected benefit beats the review's cost.

a person decides

##### Closed cases

Confirmed or cleared: both become labels. Cleared cases teach the models which patterns are benign.

labels retrain the scores in layer 5

from layer 5: above normal, below the cutoff

##### Automated actions software

Warning letter, payout delay, volume cap.

Reversible. No investigator time.

##### Limits built into the design

Item data raises the effort of trafficking, but a store can still key fake lines. Supplier data is what exposes them.

Scores open cases and never cut benefits. A person decides, with notice and a hearing, and every automated action has a fast appeal.

**Read it as:** each layer assumes the one before it failed, and each feeds the analytics that catch what got through. People see only the top of a ranked list, and every closed case makes the next ranking better.

The transaction-path layers act on each enrollment or sale. The analytics layer acts on aggregates over time, because most fraud signals are weak in a single event and strong in a pattern. Figures A5 to A7 in Appendix A model this architecture as UML software diagrams.

### 6.1 Eligibility layer

The eligibility layer decides who receives benefits and how much. Its job is to stop overpayments before the first payment, which is cheaper than recovering them later.

**Automated income matching.** At application and at recertification, the system should query payroll data (such as commercial employment verification services and state new-hire registries), state wage records, federal tax data where the law allows, and bank account verification. A discrepancy above a tolerance triggers a request for documents instead of a denial. The goal is to replace self-reported income with verified income where a source exists, and to save caseworker time for cases where no source exists, such as informal or gig work.

**National duplicate-enrollment check.** Every new application should check the NAC before the first issuance, and every active case should be rechecked on a schedule, such as monthly. A match pauses the second state’s issuance and opens a resolution task with notice to the household. Many matches are benign, such as a family that moved and has not closed the old case. The software should treat a match as a question to resolve quickly, and it should close the old case when the household confirms the move.

**Household composition checks.** Cross-checks against other benefit programs and state records can flag a member listed in two households. These checks catch fraud and honest error alike, so the response should be a request for clarification.

### 6.2 Credential layer

The credential layer controls who can spend a benefit. Its main target is theft from recipients.

**Chip and contactless cards.** EMV chip cards defeat magnetic stripe skimming, because a cloned stripe or a captured one-time code cannot authorize a second purchase. Tap-to-pay reduces exposure to tampered card slots. California’s rollout shows the main obstacle: retailers must upgrade terminals, and for a time most transactions still fell back to the stripe. The program should set a date after which stripe fallback is declined except at stores with an approved exception.

**Phone wallets.** Mobile wallet credentials add device binding and biometric unlock. The 2018 Farm Bill authorized mobile payment pilots for SNAP. A wallet also gives the program a direct channel to the recipient.

**Recipient app controls.** A recipient app should let the household lock the card between uses, block out-of-state and online transactions by default, and receive an alert for every swipe. Locks and geography blocks stop most cloned-card drains. Per-swipe alerts let a household report theft within minutes.

**Countering load-day drains.** Skimming crews strike when the monthly benefit lands, because that is when the balance is highest. Two controls help. The first is to vary the load time within the day or to spread loads across days by case number, so a crew cannot predict the exact moment. The second is a step-up check for large spending soon after a load: if more than a set share of the balance is spent within a short window, at a store far from the recipient’s usual stores, the system asks for confirmation in the app before approving. The check must fail open for recipients without phones, or it will cut off the households least able to absorb a delay (Figure 10).

Figure 10

#### Hardening the card: breaking the skimming path

A skimming theft needs three steps to succeed, and each control breaks the chain at a different link.

Attack path

Controls, placed at the link they break

1

##### Skimmer

A device on the card reader or PIN pad records the magnetic stripe and the PIN.

breaks the copy

###### Tap to pay

Fewer cards pass through a tampered slot.

###### Phone wallet

Device binding and biometric unlock. No stripe to copy. The 2018 Farm Bill authorized mobile pilots.

stripe + PIN

2

##### Clone

The data goes onto a blank card. A stripe holds static data, so the copy works on every swipe.

breaks the clone

###### EMV chip

A one-time code for each purchase: copied data fails the second time.

###### End stripe fallback

Decline stripe sales after a set date, except at stores with an approved exception.

working copy

3

##### Drain on load day

The crew spends the balance within hours of the monthly load, when it is highest.

breaks the drain

###### App card lock, location and online blocks

Lock between uses. Out-of-state and online sales blocked by default. Stops most cloned-card drains.

###### Varied load timing, step-up check

Spread loads by case number. A big spend soon after a load, far from usual stores, needs confirmation in the app.

benefits

##### Family finds a zero balance

Federal replacement covered thefts only through Dec 20, 2024\. Since then the family bears the loss.

shrinks the loss

###### Per-swipe alerts

An alert for every swipe. The household reports theft within minutes instead of at the checkout.

**Catch:** in California's chip rollout, retailers had to upgrade terminals, and for a time most sales still fell back to the stripe. The step-up check must fail open for recipients without phones, or it cuts off the households least able to wait.

**Read it as:** the chip kills the clone at link 2, so it does the most work. Locks, blocks, and alerts catch whatever still gets through at link 3.

### 6.3 Transaction layer

The transaction layer is where the program can close the core weakness: the payment record with no item list.

**Mandatory item-level basket data.** Each EBT sale should carry a line for each item: the barcode (UPC or PLU), quantity, unit price, and SNAP-eligible flag. FNS’s 2016 feasibility study showed that item-level data can be captured from integrated electronic cash registers and matched to EBT transaction records at above 99 percent accuracy using card number, date, store, and amount. The new standard would carry the basket in the authorization message itself or in a linked message sent within seconds.

**Real-time rules.** With item data in the message, the processor can reject a sale that includes ineligible items before it completes. It can also reject or flag lines for products the store is not known to stock. The program would maintain a per-store product catalog, seeded from the store’s own price list at authorization and from wholesale records over time. For illustration, a convenience store that suddenly sells 30 pounds of beef in one basket, a product it has never bought from a supplier, would see the line flagged.

**The limit.** A corrupt store can type fake item lines. It can key “4 gallons of milk, 3 loaves of bread, 2 pounds of chicken” to cover a \$50 trafficking swipe. Item data therefore raises the effort of trafficking and gives analytics more to work with. It does not end the scheme on its own. Its value is that fake baskets must be consistent with the store’s purchases from its suppliers, which the store does not control. That link is what the analytics layer exploits.

**Small-store capacity.** Many small stores do not run integrated scanning registers. The standard needs a low-cost path, such as a subsidized, certified tablet point-of-sale app, or the rollout will drive stores out of the program.

### 6.4 Merchant payout layer

Card networks and payment processors face the same problem SNAP faces: some merchants are fronts for fraud. Processors such as Stripe and PayPal manage that risk at payout time. The SNAP payout layer should adopt the same tools.

**Probation for new stores.** A newly authorized store, or a store under new ownership, starts in a probation tier. It receives payouts on a longer delay, faces a monthly volume cap set from its stated size and stock, and gets an early field visit. Trafficking stores often show high volume soon after authorization, so probation targets the riskiest period.

**Risk-tiered delays and caps.** Every store sits in a tier set by its analytics score. Low-risk stores get the standard settlement time. Higher tiers get longer settlement delays and volume caps. A delay of a week or two does not stop an honest store from operating. It does let the program withhold funds when a case opens, which makes recovery possible (Figure 11).

Figure 11

#### The merchant risk ladder

Like a card processor, the program pays clean stores fast and slows, caps, or holds money as a store's risk score climbs.

Entry: new store or new owner 

##### Probation

delayed and capped

* Longer payout delay
* Monthly volume cap set from stated size and stock
* Early field visit

Trafficking stores often show high volume soon after authorization, so probation covers the riskiest period.

clean history: to Normal

score spikes: to Elevated or High risk

low riskhigh risk

1. ##### Normal  
standard settlement  
   * Standard settlement time  
   * Score keeps updating every month  
who decidesSoftware: the monthly score
2. score crosses tier thresholdscore falls, history clean
3. ##### Elevated  
delayed and capped  
   * Longer settlement delay and a volume cap  
   * Warning letter: prices sit well above peers  
who decidesSoftware, no investigator time
4. score crosses high thresholdreview clears, hold released
5. ##### High risk  
partly held  
   * Part of payouts held pending review  
   * Hold has a time limit; rolling reserve kept  
who decidesSoftware holds; a person reviews
6. investigation confirms trafficking
7. ##### Disqualified  
stopped  
   * Permanent for trafficking, 7 CFR 278.6(e)(1)  
   * Reserve funds recovery; a civil money penalty option exists  
who decidesInvestigator, with notice and appeal

**Guardrails:** a hold without a time limit and a release path is a penalty without process. Publish appeal timelines, track reversals, and pay interest on wrongful holds. Before disqualifying the last authorized store in an area, run an access test, with a civil money penalty as the alternative.

**Read it as:** software moves a store up and down the first three rungs with no investigator time. Only a person can disqualify, and a week or two of delay leaves money to recover when a case opens.

**Holds pending review.** When a store’s score crosses a high threshold, the program can hold part of its payouts until review. A hold of this kind must have a time limit and a clear path to release, or it becomes a penalty without process.

**Recovery reserve.** For high-tier stores, a rolling reserve (a share of payouts held for a period) gives the program a fund to recover from after a disqualification.

### 6.5 Analytics layer

The analytics layer reads from all four transaction-path layers and from third-party sources. It produces store, card, and case scores, and it feeds the investigation queue. Two methods matter most beyond price anomaly detection, which Section 7 covers.

**Inventory reconciliation.** Compare EBT sales per product category against the store’s wholesale purchases of that category. For illustration, a store cannot sell 400 cartons of eggs in a month if its suppliers delivered 50\. Purchase data can come from supplier invoices that the store submits and from data feeds provided by large distributors under agreement. Without item data, reconciliation works at the level of total food purchases against total EBT redemptions. With item data, it works per product. The limit is that a store can buy stock for cash at a wholesale club, which leaves no supplier record in a distributor feed. The program should make purchase records a condition of authorization: a store must keep invoices or receipts for food it sells and submit them on request. Random audits of a sample of stores each year, plus targeted audits of high scorers, keep the requirement credible. A store that cannot show purchases to support its sales has a problem regardless of what its baskets say (Figure 12).

Figure 12

#### Sales need supply

EBT sales of a product cannot outrun what suppliers delivered, so a growing gap points to fake or inflated baskets.

Illustrative Month 6 matches the report's example: 400 sold, 50 delivered. Months 1 to 5 are invented to show the trend.

##### The check

EBT sales per product category against the store's wholesale purchases of that category, from supplier invoices and distributor feeds.

##### Caveat: cash buys

A store can buy stock for cash at a wholesale club. That leaves no record in a distributor feed. So authorization requires:

1 purchase records, kept and submitted on request  
2 random audits of a sample of stores each year  
3 targeted audits of high scorers

**Read it as:** the red band is EBT sales with no recorded supply behind them. A store that cannot show purchases to support its sales has a problem, whatever its baskets look like.

**Network and graph analysis.** Build a graph with cards and stores as nodes and transactions as edges. Trafficking rings leave clusters: groups of cards that all visit the same few suspicious stores, often traveling past closer and larger stores to do so. A single-transaction rule sees a normal-looking \$60 sale. The graph sees 200 cards that spend nearly all their benefits at three small stores owned by related parties. Community detection, shared-owner links from authorization records, and shared bank accounts on payout records together reveal rings that no store-level score would. The same graph helps on the recipient side: a card that appears in many confirmed trafficking cases is a candidate for a state investigation with evidence beyond a single transaction pattern (Figure 13).

Figure 13

#### The graph sees what one sale hides

With cards and stores as nodes and sales as edges, a ring shows up as a closed cluster of cards around a few stores.

##### Single-transaction rule

Sees one \$60 sale at a licensed store. Normal amount, normal store. It passes.

##### Graph view

Report example: 200 cards spend nearly all their benefits at three small stores owned by related parties, often passing closer and larger stores.

##### Signals that expose a ring

community detectionshared ownersshared bank accounts

Owners come from authorization records, bank accounts from payout records.

**Read it as:** each ring sale looks normal alone. The evidence is the shape: many cards that shop only at the same three linked stores. The graph shows a sample; the report's example ring has 200 cards.

**Feedback.** Every closed case, whether confirmed or cleared, becomes a labeled example. The scoring models retrain on these labels. Cleared cases matter as much as confirmed ones, because they teach the models which patterns are benign, such as round prices at a store that prices in whole dollars.

## 7\. Price anomaly detection without human basket review

Item-level data creates a new problem: volume. Retailers process millions of SNAP transactions per day. No program can afford a person to look at baskets. The design question is how to turn that volume into a short list of stores worth a human’s time, so that operating cost grows with investigator headcount while transaction volume affects only computing cost. Figure A8 in Appendix A shows the monthly scoring run as a sequence.

### 7.1 Reference prices

The system builds a reference price for each barcode in each region from all stores’ basket data. For a given barcode and region in a given month, the reference is a robust central value of observed prices, such as the median, with a spread measure such as the interquartile range. Separate references for store classes (supermarket, convenience store, small grocery) reflect the fact that convenience stores charge more for the same item. Products with few observations borrow strength from related products in the same category and from neighboring regions (Figure 14).

Figure 14

#### Score the store, not the basket

Each barcode gets a regional reference price, and a store whose lines sit far above it month after month is the signal.

A. One barcode, one regionA gallon of milk, one month, one store classIllustrative

B1\. Noise

##### One odd basket means little

A promotion, a slow item priced high, or a mis-keyed price. Scoring each basket floods the system with noise.

B2\. Signal

##### A store-month pattern

Most of the store's lines sit about 40% above reference for a whole month. Shrinkage keeps small stores from extreme scores.

Bars show price vs reference, where 0 is the reference price. The reference uses the median and the middle half of all stores' prices, set per store class; rare products borrow from related products and neighboring regions.

**Read it as:** Store X's single \$5.60 price is one dot. What matters is panel B2: the same store high on most lines all month.

### 7.2 Score stores, not baskets

One odd price means little. A store may run a promotion, price a slow item high, or key a price wrong. Independent stores set their own prices, and small stores pay more at wholesale than chains. Scoring each basket would flood the system with noise.

The unit of scoring is the store-month. For each store and month, the system computes:

* The excess price share: the sum over lines of (price paid minus the upper bound of the reference range, when positive), divided by total EBT sales.
* The share of lines priced above the reference range.
* Basket plausibility: how far the mix of items departs from what EBT shoppers buy at similar stores (for example, baskets made of a few high-priced items that recur in round-total combinations).
* Supply consistency: EBT sales per category divided by known purchases per category, from the inventory reconciliation.

These features feed a model trained on labels from past cases. Before scoring, the system applies statistical shrinkage so that a store with few transactions does not get an extreme score from a handful of odd lines.

### 7.3 Rank by expected loss

The output of scoring is a ranked list of stores by expected loss:

expected loss = probability of fraud x estimated excess dollars per year

The probability comes from the model. The excess dollars come from the excess price share and the supply gap, multiplied by the store’s EBT volume. The program then acts on the list through a funnel (Figure 15).

Figure 15

#### The review funnel

Software shrinks millions of daily baskets to a short list, and people see only the top N stores the budget can cover.

software, no person

1. 01  
##### Every basket  
Item-level EBT data from every store. Volume drives computing cost only.  
millions / day
2. 02  
##### Item price vs reference price  
Each line checked against the regional reference for its barcode and store class.  
every line
3. 03  
##### Store-month scores  
Excess price share, lines above range, basket plausibility, supply consistency.  
1 per store / month
4. 04  
##### Ranked by expected loss  
Highest expected loss first, not highest sales.  
probability x excess \$

05a 

##### Automatic actions

most stores above normal

warning letterpayout delayvolume cap

Reversible, no investigator time. Scores keep updating; a store that keeps rising enters the queue.

05b 

##### Top N stores to investigators

N set by budget

A person reviews a case only when its expected benefit tops the cost of one review.

**Feedback to step 03.** Every closed case, confirmed or cleared, becomes a label. The scoring model retrains on both, so it learns which patterns are benign.

Computing cost

grows with transaction volume, and stays small

Human cost

grows with investigator headcount, which the budget fixes first

**Read it as:** every step above the fork runs in software, so more baskets cost only computing. People enter at one point, the top N, and the budget sets N.

The automated tier handles most stores that score above normal. A warning letter tells a store its prices sit well above its peers and invites an explanation. A payout delay or volume cap limits exposure without accusing anyone. These actions are reversible and need no investigator time. They also deter: a store that knows the system watches its prices has less reason to inflate them.

### 7.4 Cost model

Human cost in this design scales with the number of investigators. Transaction volume drives only computing cost, which is small. That property follows from three rules.

First, set the investigator budget first. The program decides how many investigator hours it can fund in a period. That number fixes N, the count of cases the queue can absorb.

Second, review only what the budget covers. The queue takes the top N stores by expected loss. Stores below the cutoff stay in the automated tier, where their scores keep updating. A store that keeps rising will eventually enter the queue.

Third, review a case only when the expected benefit exceeds the review cost. Even within budget, a case with low expected loss should not consume a review. The test is:

expected loss x share prevented or recovered by action > cost of one review

The share prevented or recovered reflects that a review does not recover every dollar. It may end future losses through disqualification, recover part of past losses, and deter others.

**Worked example (illustrative numbers only).** These figures are invented to show the method. They are not estimates of real store behavior or real investigation costs. Assume a review costs \$6,000 in investigator time, and a confirmed case prevents or recovers half of the expected annual loss.

| Store | Monthly EBT sales | Estimated excess share | Excess dollars per year | Probability of fraud | Expected loss per year | Expected benefit of review (50%) | Review?                          |
| ----- | ----------------- | ---------------------- | ----------------------- | -------------------- | ---------------------- | -------------------------------- | -------------------------------- |
| A     | \$60,000           | 30%                    | \$216,000                | 0.8                  | \$172,800               | \$86,400                          | Yes, rank 1                      |
| B     | \$25,000           | 40%                    | \$120,000                | 0.6                  | \$72,000                | \$36,000                          | Yes, rank 2                      |
| C     | \$120,000          | 5%                     | \$72,000                 | 0.3                  | \$21,600                | \$10,800                          | Passes threshold; budget decides |
| D     | \$15,000           | 20%                    | \$36,000                 | 0.4                  | \$14,400                | \$7,200                           | Passes threshold; budget decides |
| E     | \$8,000            | 10%                    | \$9,600                  | 0.2                  | \$1,920                 | \$960                             | No; automated tier only          |

Excess dollars per year equal monthly sales times excess share times 12\. For Store A: \$60,000 x 0.30 x 12 = \$216,000, and \$216,000 x 0.8 = \$172,800.

Store E fails the threshold: a \$6,000 review to protect \$960 is a loss. It receives a warning letter and stays under watch. Stores A through D all pass. If the budget covers two reviews this cycle, A and B go to investigators. C and D receive payout delays and volume caps, and they remain at the top of next month’s list. Note that Store C has the largest sales but a low excess share and a low probability. Ranking by sales volume alone, a common heuristic, would have sent the wrong store first (Figure 16).

Figure 16

#### Rank stores by expected loss

Review cost sets the break-even line, and the budget sets how many stores above it get a person.

Illustrative, Section 7.3Review if expected loss x 50% recovered > \$6,000 per review, so expected loss must top \$12,000.

##### Human review: A, B

Above break-even and inside a budget of two reviews.

##### Automatic actions: C, D

Pass the threshold, fall outside budget. Payout delays and volume caps; they top next month's list.

##### No human review: E

A \$6,000 review to protect \$960 is a loss. Warning letter, stays under watch.

##### Sales volume misleads

Store C has the largest sales, \$120k a month, but ranks third. Ranking by sales would send the wrong store first.

**Read it as:** bars left of the dashed line cost more to review than they could recover. Of the stores to its right, only the top N fit the budget; the rest get automatic, reversible actions.

### 7.5 Recipient-side reporting

Recipients can supply a free signal against overcharging. The recipient app should show an itemized receipt for each EBT purchase, with a “price looks wrong” button on each line. Reports feed the store’s score as one more feature, weighted by the reporter’s history so that one angry customer cannot sink a store. Reports also help the household directly, by showing what each item cost.

This channel does nothing against trafficking. The trafficking shopper colludes with the store and will never press the button. Recipient reporting is a tool for the predatory form of overcharging, where the store cheats its customer. That distinction should shape how the program weights these reports: they are strong evidence of predatory pricing and no evidence about trafficking.

## 8\. Trade-offs and harms

Every control in this report imposes costs on honest participants. The table lists the main ones (Figure 17).

| Control                                 | Fraud it targets                              | Cost or harm                                                                                                                    | Mitigation                                                                              |
| --------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Item-level basket tracking              | Overcharging, ineligible sales, fake baskets  | Privacy: the state records what poor people eat. Data could be used for purposes beyond integrity, such as food-choice policing | Data minimization, retention limits, statutory purpose limits, aggregation for research |
| Strict store rules (stocking, scanning) | Front stores, trafficking                     | Food-desert access loss when small stores leave the program                                                                     | Subsidized point-of-sale equipment, exceptions for underserved areas, phased deadlines  |
| Payout holds and delays                 | Hit-and-run trafficking, unrecoverable losses | Honest small stores face cash flow strain                                                                                       | Time limits on holds, partial holds, standard tier for clean history                    |
| Aggressive scoring                      | All store-side fraud                          | False positives; slow appeals can close an honest store                                                                         | Appeal deadlines with service levels, independent review, publication of error rates    |
| Heavier eligibility checks              | Eligibility fraud, duplicates                 | Eligible people drop out because of paperwork and delays                                                                        | Use data matches to reduce paperwork, request documents only on mismatch                |

Step-up confirmation for large spends | Skimming drains | Delays for recipients without phones | Fail-open path, opt-in, store-based fallback |

Figure 17

#### Every control has a cost

Each control stops some fraud and harms some honest participants, and the mitigation decides how much harm remains.

Qualitative placement: judgment, not measurement

##### 1Item-level basket tracking

**Targets:** overcharging, ineligible sales, fake baskets

**Harm:** privacy: the state records what poor people eat, and could use it for food-choice policing

**Mitigation:** data minimization, retention limits, statutory purpose limits, aggregation for research

##### 2Strict store rules

**Targets:** front stores, trafficking

**Harm:** food-desert access loss when small stores leave the program

**Mitigation:** subsidized point-of-sale equipment, exceptions for underserved areas, phased deadlines

##### 3Payout holds and delays

**Targets:** hit-and-run trafficking, unrecoverable losses

**Harm:** honest small stores face cash flow strain

**Mitigation:** time limits on holds, partial holds, standard tier for clean history

##### 4Aggressive scoring

**Targets:** all store-side fraud

**Harm:** false positives; slow appeals can close an honest store

**Mitigation:** appeal deadlines with service levels, independent review, published error rates

##### 5Heavier eligibility checks

**Targets:** eligibility fraud, duplicates

**Harm:** eligible people drop out because of paperwork and delays

**Mitigation:** data matches to cut paperwork, documents only on mismatch

##### 6Step-up confirmation for large spends

**Targets:** skimming drains

**Harm:** delays for recipients without phones

**Mitigation:** fail-open path, opt-in, store-based fallback

**Read it as:** no control sits in the safe corner on its own. The strongest controls carry the most harm, so each one ships with its mitigation or honest households and stores pay for the fraud.

**Privacy.** Item-level data is the most sensitive control. Once the state holds a record of every item every SNAP household buys, pressure will follow to use it for diet policing, immigration enforcement, or commercial sale. The data design should limit use by statute to program integrity and approved research. It should keep raw baskets for a short period (for illustration, 13 months), then retain only store-level aggregates. It should separate identity from basket data so that analysts work with tokenized card numbers, and only a case opened by an investigator can resolve a token to a household.

**Access.** Small stores are often the only food retailers in poor urban and rural areas. They also carry most trafficking. A rule that removes trafficking stores also removes some honest ones, and each loss can strand households far from a supermarket. Mitigation requires subsidy for equipment and an explicit access test before disqualifying the last authorized store in an area, with a path to a civil money penalty instead.

**Due process.** ALERT cases already rest mostly on transaction data, and stores have ten days to respond to a charge letter. Adding automated holds and caps raises the stakes of a wrong score. The program should publish appeal timelines, track how often automated actions reverse on appeal, and pay interest on wrongful holds.

**Human review before cutoff.** No household should lose benefits because of an automated score. Scores can open a case. A person decides it, with notice and a hearing, as 7 CFR 273.16 already requires for intentional program violations.

## 9\. The policy alternative

Trafficking exists because SNAP benefits are restricted to food at authorized stores while cash is unrestricted. If the program paid benefits as unrestricted cash, trafficking would end by definition, because there would be no discount between a benefit dollar and a cash dollar for anyone to capture. The retailer authorization system, ALERT, undercover buys, and most of the merchant-side architecture in this report would become unnecessary.

That is a policy choice, and it carries its own debates. Supporters point to lower administrative cost, more dignity and flexibility for households, and economic research finding that, for most households, SNAP affects food spending much as an equal amount of cash would. Opponents argue that restricting benefits to food is the program’s purpose and the basis of its political support, that cash could shift spending away from food for some households, and that the change would remove an effect that supports grocery retailers. A middle path, such as a partial cash-out, would shrink the trafficking discount without ending it.

This report takes no position on that question. The point for designers is that the software architecture addresses a problem the policy creates. If policy changes, the integrity problem changes with it: eligibility fraud and payment theft remain, and trafficking disappears.

## 10\. Implementation roadmap

The architecture is too large to deploy at once, and some parts depend on others. A three-phase rollout orders the work by cost, dependency, and the size of the loss each step addresses (Figure 18).

Figure 18

#### Implementation roadmap: three phases, four parties

Ship the cheap controls that need no new standard first, then item data, then analytics, and measure each phase.

Order set by cost, dependency, and loss size; no dates Retailers POS vendors States FNSfederal agency Measure 

Phase 1

##### Credentials and payout risk

No new data standard needed. Attacks skimming and hit-and-run trafficking.

**Retailers**
* Upgrade terminals for chip and tap
* Accept payout tier rules

**POS vendors**
* Support EMV for EBT
* End stripe fallback by the deadline

**States**
* Issue chip cards
* Run the recipient app or approve third-party apps
* Vary load timing

**FNS**
* Set chip standards and the fallback deadline
* Implement payout tiers in settlement, using the existing ALERT score

**Measure**
* Skimming claims per thousand cards, before and after the switch

Phase 2

##### Item-level data standard

Basket standard, certified POS, ineligible items rejected, reference prices begun. Privacy rules come first.

**Retailers**
* Install certified registers or the subsidized app
* Keep product price lists current

**POS vendors**
* Implement the basket message standard
* Pass certification

**States**
* Fund outreach to small stores
* Update EBT processor contracts

**FNS**
* Publish the standard; certify vendors
* Adopt privacy and retention rules

**Measure**
* Share of EBT volume carrying item data
* Count of small stores that left the program

Phase 3

##### Analytics and the investigation queue

Reconciliation, card-store graph, store-month scoring, a budget-sized queue, case feedback.

**Retailers**
* Keep purchase invoices
* Submit them on request
* Accept audits

**POS vendors**
* Provide data hooks for catalog updates

**States**
* Join graph-based recipient investigations
* Resolve NAC and income matches quickly

**FNS**
* Contract distributor data feeds
* Build scoring and the queue
* Publish appeal metrics

**Measure**
* Confirmation rate of reviewed cases
* Reversal rates on appeal
* Trafficking estimate from the next FNS study

**Read it as:** read across a row to see one party's work grow phase by phase, and down a column to see what one phase asks of everyone. Without the measure row, the program cannot tell whether controls pay for themselves.

**Phase 1: credentials and payout risk.** Complete the national move to chip and contactless EBT cards. Launch a recipient app with card lock, geography and online blocks, and per-swipe alerts. Introduce merchant risk tiers using the existing ALERT score: probation for new stores, settlement delays and caps for high tiers. These steps need no new data standard and attack skimming and hit-and-run trafficking directly.

**Phase 2: item-level data standard.** Define and publish an item-level basket standard for EBT messages. Certify point-of-sale vendors against it. Fund a low-cost certified option for small stores. Turn on real-time rejection of ineligible items. Begin building reference prices and per-store product catalogs. Set privacy rules in regulation before data collection starts.

**Phase 3: analytics and the investigation queue.** Add inventory reconciliation with distributor feeds and purchase-record requirements. Build the card-store graph. Deploy store-month price scoring and expected-loss ranking. Size the investigation queue to the budget and run the feedback loop from closed cases.

| Phase | Retailers                                                                           | Point-of-sale vendors                                     | States                                                                                | FNS                                                                                  |
| ----- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1     | Upgrade terminals for chip and tap; accept payout tier rules                        | Support EMV for EBT; end stripe fallback by deadline      | Issue chip cards; run the recipient app or approve third-party apps; vary load timing | Set chip standards and fallback deadline; implement payout tiers in settlement       |
| 2     | Install certified registers or the subsidized app; keep product price lists current | Implement the basket message standard; pass certification | Fund outreach to small stores; update EBT processor contracts                         | Publish the standard; certify vendors; adopt privacy and retention rules             |
| 3     | Keep purchase invoices; submit them on request; accept audits                       | Provide data hooks for catalog updates                    | Join graph-based recipient investigations; resolve NAC and income matches quickly     | Contract distributor data feeds; build scoring and the queue; publish appeal metrics |

Each phase should ship with measurement. Phase 1 should report skimming claims per thousand cards before and after the switch. Phase 2 should report the share of EBT volume carrying item data and the count of small stores that left the program. Phase 3 should report the confirmation rate of reviewed cases, reversal rates on appeal, and estimated trafficking from the next FNS study. Without measurement, the program cannot tell whether controls pay for themselves.

## 11\. Conclusion

SNAP fraud is smaller and more specific than public debate suggests. The headline error rate near 11 percent measures payment accuracy, and it counts mistakes in both directions. The best estimate of trafficking, the program’s signature fraud, is about 1.6 to 2.0 percent of benefits, concentrated in small stores. Skimming is a separate problem whose victims are recipients.

Trafficking persists because the EBT record carries amounts without items and because both parties to the lie gain from it. Controls that rely on data the shopper or the store enters cannot fully solve it. The architecture in this report responds in layers: verify eligibility from outside sources before the first payment, harden the card, carry items in the transaction, manage payouts the way processors manage risky merchants, and reconcile what stores sell against what their suppliers delivered. Price anomaly detection runs at the store-month level, ranks stores by expected loss, and sends only what the budget covers to people, so that oversight cost tracks investigator headcount.

Each control harms some honest participants, through lost privacy, lost store access, delayed payouts, or wrongful flags. Those costs belong in the same calculation as the fraud the controls stop. A program that counts them, publishes its error and reversal rates, and keeps a person between any score and a family’s food will protect both the budget and the trust that the program depends on.

## Appendix A. UML models

These models turn the design into operations and software specifications. The operations models come first.

### A.1 Operations

The figures so far follow the money and the fraud. The next four show the operations side in UML, the notation software teams use to specify systems. The first is a use case diagram. It names each party that touches the integrity program and what each one does there, from the household and the store to the federal retailer analyst at FNS (renamed FNA in 2026).

Two points stand out. Recipients and retailers run controls themselves: a household locks its own card, and a store submits its own purchase records. And every sanction rests with a person, as section 8 requires.

Figure A1

#### Who does what in the integrity program

Recipients and retailers use the program; caseworkers, analysts, and investigators police it. A person decides every sanction.

**Read it as:** stick figures are actors outside the system, and ovals are use cases inside it. A solid line means the actor takes part. A dashed «include» arrow points to a step its base case always runs. A dashed «extend» arrow points back to the base case it sometimes adds to, under the condition in brackets.

An activity diagram shows how one case moves between parties. It starts in software. The analytics system scores every store each month, and only stores in the top N reach a federal analyst; the rest get an automated warning letter, payout delay, or volume cap. Once a case opens, three lines of evidence run at the same time: supplier records, an undercover buy, and the store's own purchase records.

The case file joins them before anyone decides. A sanction can go to independent review, and every outcome, closed, upheld, or reversed, becomes a label for next month's scores.

Figure A2

#### From flagged store to final decision

Software picks the store, three lines of evidence run in parallel, and every closed case returns to scoring as a label.

**Read it as:** each column is one party. The black dot starts the flow, and the bullseye ends it. Bars split work into parallel branches and join it again. Diamonds pick one branch by the guard in brackets, or merge branches back into one. The circled X marks where a store below the top N leaves the flow without reaching a person.

The same process, seen from the case record, is a state machine. Each box is a status the case can hold, and each arrow names the event, guard, and action that move it. The design rules from sections 6 to 8 become guards here.

A case opens only when its expected loss beats the review cost within budget. A payout hold starts when the case enters the queue and lifts if the evidence shows no violation. Every sanction can go to appeal before the case becomes final.

Figure A3

#### The life of an integrity case

A score can open a case and hold some payouts. Only evidence moves it to a sanction, and every sanction can go to appeal.

**Read it as:** rounded boxes are states, and arrows are transitions labeled event \[guard\] / action. The large box groups three investigation substates, and its two exits fire from any of them. An entry line runs when the case enters that state; a do line runs while it stays there.

The last diagram turns to the recipient side, where the loss is theft from families. Section 6.2 proposes a recipient app with per-swipe alerts and a card lock, and section 4.4 describes how benefit replacement worked. The activity diagram joins the two.

A family can stop a drain within minutes of the first unknown swipe. The response then splits: the state reissues the card and decides whether the stolen benefits come back. Under the facts in section 4.4, federal replacement covered thefts only through December 20, 2024.

Figure A4

#### When a skimmed card gets drained

The app lets a family stop a drain within minutes. Whether the stolen money comes back depends on when the theft happened.

**Read it as:** each column is one party. After the claim opens, two branches run in parallel: a new card, and the question of the stolen benefits. A chip card blocks the next copy; a new stripe card can be copied again. The note gives the report's facts on federal replacement.

### A.2 Software

The component diagram recasts the layered design as software. Each box is a deployable component. A ball marks an interface the component offers, and a cup marks one it needs. The real-time path answers inside a sale: the gateway calls the eligibility, credential, and basket checks, then settles through the payout risk service.

Batch analytics reads the stream of sales once a month. Three evidence services feed one scoring engine. External sources sit outside the packages, because the program reads them and cannot change them.

Figure A5

#### The platform as components

Real-time services guard each sale, batch analytics scores stores each month, and case outcomes flow back as labels.

**Read it as:** a ball is an interface a component provides, and a cup is one it requires. The gateway calls three checks on every sale and settles through payout risk. Only two outputs leave the scoring engine: a risk tier for payouts and scores for the ranker. People see only the ranked list, and their outcomes retrain the engine.

The sequence diagram follows one EBT purchase once the basket travels with the authorization. The processor checks every line against SNAP eligibility and the store catalog before it touches the balance. A valid basket then passes a risk check. Only a large spend soon after the monthly load triggers a step-up confirmation in the recipient app, and a recipient without a phone fails open.

An invalid basket is declined at the register. The processor still reports the line, because a store that keeps keying items it never stocks is a signal for the monthly score.

Figure A6

#### One purchase, line by line

The processor checks every basket line before it touches the balance, and asks the recipient only when a spend looks like a load-day drain.

**Read it as:** solid arrows with filled heads are calls, dashed arrows are replies, and the open-headed arrow is a one-way signal. The alt frame runs exactly one branch; the opt frame runs only when its guard holds. A rejected line ends the sale before any money moves, and the risk service still hears about it.

The class diagram names the records the software keeps. Two structures mirror each other: a transaction owns its basket lines, and a supplier invoice owns its invoice lines. Both kinds of line point at the same product barcode. That shared key makes reconciliation possible, because the store writes one side and its suppliers write the other.

Scores attach to a retailer and a month, never to a single basket. A score can open a case or trigger an automatic action, and every action carries an expiry and an appeal.

Figure A7

#### The domain model

Thirteen classes carry the design: sales with their lines, purchases with theirs, and scores that open cases.

**Read it as:** a filled diamond marks a part that lives and dies with its whole, so a basket line exists only inside its transaction. Numbers at each end are multiplicities. Product is the hub: basket lines, invoice lines, and reference prices all point at one barcode, and that shared key lets sales be reconciled against purchases.

The second sequence diagram shows the batch side. A scheduler starts the run once a month. For each store, the scoring engine gathers three kinds of evidence: excess prices against the regional reference, sales against supplier purchases, and the store's place in the card-store graph. It scores the store-month with shrinkage, so a small store with a few odd lines does not jump the queue.

The ranker sorts stores by expected loss. The investigator budget fixes N before the run starts, so transaction volume never changes how many cases people see.

Figure A8

#### The monthly scoring run

Each month the engine scores every store, the ranker sorts them by expected loss, and the budget decides who gets a person.

**Read it as:** the loop frames repeat once per store, and the alt frame picks one branch per store. Only the top N within budget reach case management. The rest get a reversible automatic action or nothing. Closed cases come back weeks later as labels, and the next run trains on them.

## References

1. Center on Budget and Policy Priorities. “Congress Must Extend Protections for SNAP Households Who Are Victims of Benefit Theft.” Blog post, 2024\. [https://www.cbpp.org/blog/congress-must-extend-protections-for-snap-households-who-are-victims-of-benefit-theft](https://www.cbpp.org/blog/congress-must-extend-protections-for-snap-households-who-are-victims-of-benefit-theft)
2. Code of Federal Regulations. 7 CFR 273.16, Disqualification for intentional Program violation. Accessed via Legal Information Institute, Cornell Law School. [https://www.law.cornell.edu/cfr/text/7/273.16](https://www.law.cornell.edu/cfr/text/7/273.16)
3. Code of Federal Regulations. 7 CFR 278.6, Disqualification of retail food stores and wholesale food concerns and imposition of civil money penalties in lieu of disqualifications. Accessed via Legal Information Institute, Cornell Law School. [https://www.law.cornell.edu/cfr/text/7/278.6](https://www.law.cornell.edu/cfr/text/7/278.6)
4. Congressional Research Service. _Supplemental Nutrition Assistance Program: Errors and Fraud_ (IF10860). Updated April 7, 2025\. [https://www.everycrsreport.com/files/2025-04-07%5FIF10860%5F5ae77126bb0274ff50854578e32b6633ca81d923.html](https://www.everycrsreport.com/files/2025-04-07%5FIF10860%5F5ae77126bb0274ff50854578e32b6633ca81d923.html)
5. Congressional Research Service. _Errors and Fraud in the Supplemental Nutrition Assistance Program (SNAP)_ (R45147). Updated September 28, 2018\. [https://www.everycrsreport.com/reports/R45147.html](https://www.everycrsreport.com/reports/R45147.html)
6. Congressional Research Service. _Supplemental Nutrition Assistance Program (SNAP): Benefit Theft Through Electronic Benefit Card Skimming_ (IN12419). [https://www.congress.gov/crs-product/IN12419](https://www.congress.gov/crs-product/IN12419)
7. Consolidated Appropriations Act, 2023\. Public Law 117-328, Division HH, section 501.
8. Federal Register. “Enhancing Retailer Standards in the Supplemental Nutrition Assistance Program (SNAP).” Final rule, 81 FR 90675, December 15, 2016\. [https://www.federalregister.gov/documents/2016/12/15/2016-29837/enhancing-retailer-standards-in-the-supplemental-nutrition-assistance-program-snap](https://www.federalregister.gov/documents/2016/12/15/2016-29837/enhancing-retailer-standards-in-the-supplemental-nutrition-assistance-program-snap)
9. Federal Register. “Supplemental Nutrition Assistance Program: Requirement for Interstate Data Matching To Prevent Duplicate Issuances.” Interim final rule, October 3, 2022\. [https://www.federalregister.gov/documents/2022/10/03/2022-21011/supplemental-nutrition-assistance-program-requirement-for-interstate-data-matching-to-prevent](https://www.federalregister.gov/documents/2022/10/03/2022-21011/supplemental-nutrition-assistance-program-requirement-for-interstate-data-matching-to-prevent)
10. US Department of Agriculture, Economic Research Service. “Supplemental Nutrition Assistance Program (SNAP) average monthly participation and inflation-adjusted annual program spending, fiscal years 2000-24.” Chart. [https://www.ers.usda.gov/data-products/chart-gallery/chart-detail?chartId=54637](https://www.ers.usda.gov/data-products/chart-gallery/chart-detail?chartId=54637)
11. US Department of Agriculture, Food and Nutrition Service._Feasibility Study of Capturing Supplemental Nutrition Assistance Program (SNAP) Purchases at the Point of Sale_. Prepared by IMPAQ International. Final report February 2016, posted November 2016.
12. US Department of Agriculture, Food and Nutrition Service. _Fiscal Year 2024 SNAP Quality Control Payment Error Rates_. 2025\. [https://fns-prod.azureedge.us/sites/default/files/resource-files/snap-fy24QC-PER.pdf](https://fns-prod.azureedge.us/sites/default/files/resource-files/snap-fy24QC-PER.pdf)
13. US Department of Agriculture, Food and Nutrition Service. “USDA Releases Annual SNAP Payment Error Rates for FY 2024.” Press release, June 27, 2025.
14. US Department of Agriculture. “USDA Announces FY 2025 State Payment Error Rates in SNAP.” Press release, June 24, 2026\. [https://www.usda.gov/about-usda/news/press-releases/2026/06/24/usda-announces-fy-2025-state-payment-error-rates-snap](https://www.usda.gov/about-usda/news/press-releases/2026/06/24/usda-announces-fy-2025-state-payment-error-rates-snap)
15. US Department of Agriculture. “USDA Announces Actions to Better Serve States, Nutrition Program Recipients, and the American Taxpayer.” Press release on the Food and Nutrition Administration, April 30, 2026\. [https://www.usda.gov/about-usda/news/press-releases/2026/04/30/usda-announces-actions-better-serve-states-nutrition-program-recipients-and-american-taxpayer](https://www.usda.gov/about-usda/news/press-releases/2026/04/30/usda-announces-actions-better-serve-states-nutrition-program-recipients-and-american-taxpayer)
16. US Government Accountability Office. _Supplemental Nutrition Assistance Program: Actions Needed to Better Measure and Address Retailer Trafficking_ (GAO-19-167). December 2018\. [https://www.gao.gov/products/gao-19-167](https://www.gao.gov/products/gao-19-167)
17. Wilson, Hoke (Manhattan Strategy Group). _The Extent of Trafficking in the Supplemental Nutrition Assistance Program: 2015-2017_. USDA Food and Nutrition Service, Office of Policy Support, September 2021\. [https://fns-prod.azureedge.us/sites/default/files/resource-files/Trafficking2015-2017-3.pdf](https://fns-prod.azureedge.us/sites/default/files/resource-files/Trafficking2015-2017-3.pdf)
18. Contra Costa County Employment and Human Services Department. “New EBT Card Security & Technology Upgrade.” February 2025\. [https://ehsd.org/2025/02/18/new-ebt-card-security-technology-upgrade/](https://ehsd.org/2025/02/18/new-ebt-card-security-technology-upgrade/)
