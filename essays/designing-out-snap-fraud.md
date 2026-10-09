---
draft: false
title: "Designing Out SNAP Fraud"
description: "SNAP fraud is smaller and different from what public debate assumes. A taxonomy of trafficking, theft, and error, and a layered program and software architecture that designs fraud out."
date: 2026-10-09
authors:
  - "tieubao"
tags: []
redirect:
  - "/writers/truonghan.com/designing-out-snap-fraud"
guest: true
writer_id: "wr_01M4FD90NGV0ABHHSSDMG3829G"
canonical_url: "https://truonghan.com/designing-out-snap-fraud/"
original_domain: "truonghan.com"
guest_scope: "gn-designing-out-snap-fraud"
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

```guest-html
<figure class="fig" id="fig-01-program-actors">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 1</span><h4>Who does what in SNAP</h4><p class="g-dek">Federal funds, state eligibility, and private payment rails all meet at one place: the store's card terminal.</p></div>
  <div class="fig-body">
    <div class="g-pa-key" aria-hidden="true">
      <span><svg width="34" height="10" viewBox="0 0 34 10"><line x1="1" y1="5" x2="33" y2="5" class="g-s-defense" stroke-width="2.5"></line></svg>money or benefits</span>
      <span><svg width="34" height="10" viewBox="0 0 34 10"><line x1="1" y1="5" x2="33" y2="5" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4"></line></svg>data</span>
      <span><svg width="34" height="10" viewBox="0 0 34 10"><line x1="1" y1="5" x2="33" y2="5" class="g-s-caution" stroke-width="2" stroke-dasharray="5 4"></line></svg>data feed the report proposes</span>
    </div>
    <div class="g-pa-canvas">
      <svg viewBox="0 0 806 545" role="img" aria-label="SNAP actors and flows. FNS funds the states. States check income against outside records and load monthly benefits onto recipients' EBT cards. Recipients swipe at authorized retailers. The retailer's terminal sends an authorization message with no item list to the EBT processor, which reimburses the store and sends daily records to FNS. Wholesale purchase records would feed FNS under the proposal.">
        <defs>
          <marker id="fig-01-program-actors-m-money" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,1 L9,5 L0,9 Z" class="g-f-defense"></path></marker>
          <marker id="fig-01-program-actors-m-data" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,1 L9,5 L0,9 Z" class="g-f-muted"></path></marker>
          <marker id="fig-01-program-actors-m-prop" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,1 L9,5 L0,9 Z" class="g-f-caution"></path></marker>
        </defs>

        
        <g fill="none" stroke-linejoin="round">
          <path d="M594,70 H493" class="g-s-defense" stroke-width="2.5" marker-end="url(#fig-01-program-actors-m-money)"></path>
          <path d="M340,144 V200 H101 V251" class="g-s-defense" stroke-width="2.5" marker-end="url(#fig-01-program-actors-m-money)"></path>
          <path d="M196,330 H297" class="g-s-defense" stroke-width="2.5" marker-end="url(#fig-01-program-actors-m-money)"></path>
          <path d="M594,346 H493" class="g-s-defense" stroke-width="2.5" marker-end="url(#fig-01-program-actors-m-money)"></path>
          <path d="M196,84 H297" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-data)"></path>
          <path d="M630,144 V200 H440 V243" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-data)"></path>
          <path d="M490,316 H591" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-data)"></path>
          <path d="M690,254 V147" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-data)"></path>
          <path d="M395,446 V379" class="g-s-muted" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-data)"></path>
          <path d="M101,510 V532 H796 V84 H787" class="g-s-caution" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fig-01-program-actors-m-prop)"></path>
        </g>

        
        <g font-size="12" text-anchor="middle">
          <text x="543" y="62" class="g-f-ink" font-weight="600">federal funds</text>
          <text x="543" y="89" class="g-f-muted g-mono" font-size="11">&#36;99.8B, FY2024</text>
          <text x="248" y="76" class="g-f-ink" font-weight="600">income checks</text>
          <text x="220" y="192" class="g-f-ink" font-weight="600">monthly benefit load</text>
          <text x="535" y="192" class="g-f-ink" font-weight="600">authorizes stores</text>
          <text x="247" y="322" class="g-f-ink" font-weight="600">benefits</text>
          <text x="247" y="347" class="g-f-muted g-mono" font-size="11">card swipe</text>
          <text x="542" y="308" class="g-f-ink" font-weight="600">auth message</text>
          <text x="542" y="333" class="g-f-fraud g-mono" font-size="11" font-weight="600">no item list</text>
          <text x="543" y="364" class="g-f-ink" font-weight="600">&#36; reimbursement</text>
          <text x="543" y="379" class="g-f-muted" font-size="11">few banking days</text>
          <text x="560" y="524" class="g-f-caution" font-weight="600">purchase records (proposed)</text>
        </g>
        <g font-size="12">
          <text x="698" y="192" class="g-f-ink" font-weight="600">daily records</text>
          <text x="698" y="207" class="g-f-muted">to ALERT</text>
          <text x="698" y="222" class="g-f-muted g-mono" font-size="11">250M a month</text>
          <text x="404" y="416" class="g-f-ink" font-weight="600">builds sale message</text>
        </g>

        
        <g font-size="12">
          <rect x="6" y="34" width="190" height="100" rx="10" class="g-f-neutral-tint g-s-rule"></rect>
          <text x="20" y="55" class="g-f-muted g-mono" font-size="11" letter-spacing="0.06em">OUTSIDE DATA</text>
          <text x="20" y="76" class="g-f-ink" font-size="13.5" font-weight="700">Income records</text>
          <text x="20" y="96" class="g-f-muted">Payroll, wage records</text>
          <text x="20" y="114" class="g-f-muted">Tax data, bank checks</text>

          <rect x="300" y="24" width="190" height="120" rx="10" class="g-f-defense-tint g-s-defense" stroke-opacity="0.45"></rect>
          <text x="314" y="48" class="g-f-ink" font-size="13.5" font-weight="700">State agencies</text>
          <text x="314" y="70" class="g-f-muted">Decide eligibility</text>
          <text x="314" y="88" class="g-f-muted">Issue benefits on EBT</text>
          <text x="314" y="106" class="g-f-muted">Run integrity units</text>
          <text x="314" y="124" class="g-f-muted">Contract EBT processors</text>

          <rect x="594" y="24" width="190" height="120" rx="10" class="g-f-defense-tint g-s-defense" stroke-opacity="0.45"></rect>
          <text x="608" y="48" class="g-f-ink" font-size="13.5" font-weight="700">USDA FNS</text>
          <text x="608" y="66" class="g-f-defense g-mono" font-size="11">renamed FNA in 2026</text>
          <text x="608" y="86" class="g-f-muted">Funds benefits, sets rules</text>
          <text x="608" y="104" class="g-f-muted">Authorizes retailers</text>
          <text x="608" y="122" class="g-f-muted">ALERT scores every store</text>

          <rect x="6" y="254" width="190" height="108" rx="10" class="g-f-surface g-s-rule"></rect>
          <text x="20" y="278" class="g-f-ink" font-size="13.5" font-weight="700">Recipient household</text>
          <text x="20" y="298" class="g-f-muted">EBT card and PIN</text>
          <text x="20" y="322" class="g-f-ink g-mono" font-size="11.5" font-weight="600">41.7M people a month</text>
          <text x="20" y="339" class="g-f-muted" font-size="11">FY2024 average</text>

          <rect x="300" y="246" width="190" height="130" rx="10" class="g-f-surface g-s-rule"></rect>
          <text x="314" y="270" class="g-f-ink" font-size="13.5" font-weight="700">Authorized retailer</text>
          <text x="314" y="288" class="g-f-muted g-mono" font-size="11">about 260,000 stores</text>
          <rect x="314" y="300" width="162" height="62" rx="6" class="g-f-neutral-tint g-s-fraud" stroke-opacity="0.55"></rect>
          <text x="326" y="324" class="g-f-ink" font-weight="700">Card terminal</text>
          <text x="326" y="343" class="g-f-muted" font-size="11">every flow meets here</text>

          <rect x="594" y="254" width="190" height="108" rx="10" class="g-f-defense-tint g-s-defense" stroke-opacity="0.45"></rect>
          <text x="608" y="278" class="g-f-ink" font-size="13.5" font-weight="700">EBT processor</text>
          <text x="608" y="298" class="g-f-muted">Approves the sale</text>
          <text x="608" y="316" class="g-f-muted">Debits the EBT account</text>
          <text x="608" y="334" class="g-f-muted">Reports each sale to FNS</text>

          <rect x="300" y="446" width="190" height="64" rx="10" class="g-f-surface g-s-rule"></rect>
          <text x="314" y="471" class="g-f-ink" font-size="13.5" font-weight="700">POS vendors</text>
          <text x="314" y="491" class="g-f-muted">Terminals and registers</text>

          <rect x="6" y="446" width="190" height="64" rx="10" class="g-f-neutral-tint g-s-rule"></rect>
          <text x="20" y="464" class="g-f-muted g-mono" font-size="11" letter-spacing="0.06em">OUTSIDE DATA</text>
          <text x="20" y="482" class="g-f-ink" font-size="13.5" font-weight="700">Wholesale suppliers</text>
          <text x="20" y="500" class="g-f-muted">Invoices, shipments</text>
        </g>
      </svg>
    </div>
    <p class="g-pa-note"><span class="g-chip g-chip--fraud">weak point</span> The authorization message carries store, card, amount, date, and time. No item list reaches FNS, so every check infers fraud from amounts and timing.</p>
  </div>
  <figcaption><strong>Read it as:</strong> many actors touch each benefit dollar, yet the one record they all share holds an amount and no basket. The amber feed is the report's proposal: purchase records the store does not write.</figcaption>
</figure>
```

## 2\. A taxonomy of SNAP fraud

The Congressional Research Service groups SNAP integrity problems into trafficking, retailer application fraud, household errors and fraud, state agency errors and fraud, and external scams that steal benefits. This report uses a slightly finer grouping because each type calls for a different control (Figure 2).

```guest-html
<table>
<colgroup>
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
</colgroup>
<thead>
<tr>
<th>Type</th>
<th>Who commits it</th>
<th>Who loses</th>
<th>Mechanism</th>
<th>Main control today</th>
</tr>
</thead>
<tbody>
<tr>
<td>Trafficking</td>
<td>Recipient and store, together</td>
<td>Taxpayers</td>
<td>Card swiped for a sale that does not happen; store pays recipient
cash at a discount</td>
<td>ALERT transaction analytics, undercover buys, retailer
disqualification</td>
</tr>
<tr>
<td>Recipient eligibility fraud</td>
<td>Applicant</td>
<td>Taxpayers</td>
<td>Underreported income, invented household members, hidden assets,
enrollment in two states</td>
<td>State verification, data matching, quality control reviews,
intentional program violation hearings</td>
</tr>
<tr>
<td>Retailer ineligible sales and overcharging</td>
<td>Store, sometimes with shopper</td>
<td>Taxpayers or recipient</td>
<td>Benefits used for alcohol, tobacco, or household goods; prices
inflated for EBT shoppers</td>
<td>Undercover buys, complaints, term disqualification</td>
</tr>
<tr>
<td>Card skimming and cloning</td>
<td>Outside criminals</td>
<td>Recipient</td>
<td>Device copies magstripe data and PIN; clone drains the account soon
after the monthly load</td>
<td>Card replacement policies, chip cards (new), recipient card
locks</td>
</tr>
<tr>
<td>Insider fraud</td>
<td>Caseworker or state employee</td>
<td>Taxpayers</td>
<td>Fictitious cases, benefits issued to accomplices, data sold</td>
<td>Audits, separation of duties, access logs</td>
</tr>
<tr>
<td>Organized rings</td>
<td>Groups spanning stores, recruiters, and card holders</td>
<td>Taxpayers or recipients</td>
<td>Many cards trafficked through a few stores; mass skimming
operations</td>
<td>Joint federal and state investigations, network analysis</td>
</tr>
</tbody>
</table>
```

```guest-html
<figure class="fig" id="fig-02-fraud-taxonomy">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 2</span><h4>Six kinds of SNAP fraud: who commits it, who pays</h4><p class="g-dek">Most fraud drains taxpayer money; skimming steals the family's food money.</p></div>
  <div class="fig-body">
    <div class="g-tx" role="group" aria-label="Matrix of six SNAP fraud types by who commits each and who loses. Five types cost taxpayers. Card skimming, by outside criminals, takes the recipient family's benefits.">
      <div class="g-tx-lane g-tx-lane--tax" aria-hidden="true"></div>
      <div class="g-tx-lane g-tx-lane--rec" aria-hidden="true"></div>
      <div class="g-tx-corner g-eyebrow" aria-hidden="true">Who loses / who commits</div>
      <div class="g-tx-colhead g-eyebrow" style="--c: 2" aria-hidden="true">Recipient</div>
      <div class="g-tx-colhead g-eyebrow" style="--c: 3" aria-hidden="true">Store</div>
      <div class="g-tx-colhead g-eyebrow" style="--c: 4" aria-hidden="true">Outside criminal</div>
      <div class="g-tx-colhead g-eyebrow" style="--c: 5" aria-hidden="true">Caseworker</div>
      <div class="g-tx-colhead g-eyebrow" style="--c: 6" aria-hidden="true">Organized ring</div>
      <div class="g-tx-rowhead g-tx-rowhead--tax" aria-hidden="true"><strong>Taxpayers</strong><span>program money is lost</span></div>
      <div class="g-tx-rowhead g-tx-rowhead--rec" aria-hidden="true"><strong class="g-t-fraud">The family</strong><span>its food money is gone</span></div>

      <div class="g-node g-tx-card g-tx-traf">
        <h5>Trafficking</h5>
        <p>Card swiped for a sale that never happens; the store pays the recipient cash at a discount.</p>
        <p class="g-tx-tag"><span class="g-chip">recipient and store, together</span></p>
        <p class="g-tx-meta"><span class="g-chip">by: recipient + store</span><span class="g-chip">loses: taxpayers</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-elig">
        <h5>Eligibility fraud</h5>
        <p>Underreported income, invented members, two-state enrollment.</p>
        <p class="g-tx-meta"><span class="g-chip">by: applicant</span><span class="g-chip">loses: taxpayers</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-inel">
        <h5>Ineligible sales, overcharging</h5>
        <p><strong>Collusive:</strong> alcohol, tobacco, or paper goods paid with EBT.</p>
        <p class="g-tx-meta"><span class="g-chip">by: store</span><span class="g-chip">loses: taxpayers</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-cont g-tx-inel2">
        <h5>Overcharging, predatory form</h5>
        <p>EBT shoppers pay inflated prices and do not notice.</p>
        <p class="g-tx-meta"><span class="g-chip">by: store</span><span class="g-chip g-chip--fraud">loses: family</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-skim">
        <h5>Card skimming and cloning</h5>
        <p>A device copies stripe data and PIN; a clone drains the account soon after the monthly load.</p>
        <p class="g-tx-victim g-t-fraud">Victim: the family finds a zero balance</p>
        <p class="g-tx-meta"><span class="g-chip">by: outside criminal</span><span class="g-chip g-chip--fraud">loses: family</span></p>
      </div>
      
        <p>Federal replacement covered some skimming losses, until it ended in December 2024.</p>
      
      <div class="g-node g-tx-card g-tx-ins">
        <h5>Insider fraud</h5>
        <p>Fictitious cases, benefits to accomplices, data sold. Rare, and each case can be large.</p>
        <p class="g-tx-meta"><span class="g-chip">by: caseworker</span><span class="g-chip">loses: taxpayers</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-ring">
        <h5>Organized rings</h5>
        <p>Trafficking networks: many cards through a few stores under nominee owners.</p>
        <p class="g-tx-meta"><span class="g-chip">by: ring</span><span class="g-chip">loses: taxpayers</span></p>
      </div>
      <div class="g-node g-tx-card g-tx-cont g-tx-ring2">
        <h5>Rings, skimming crews</h5>
        <p>Mass card theft across states.</p>
        <p class="g-tx-meta"><span class="g-chip">by: ring</span><span class="g-chip g-chip--fraud">loses: family</span></p>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> five types sit in the taxpayer lane. Skimming sits only in the family's lane. Overcharging and rings reach the family in some variants (dashed cards).</figcaption>
</figure>
```

**Trafficking.** Trafficking is the exchange of benefits for cash or anything other than eligible food. The typical case involves a recipient who lets a store clerk swipe the card for an amount, say \$100, and receives a smaller amount of cash. Prosecutors in federal cases have reportedly described rates around 50 cents on the dollar, and some cases report higher or lower rates. Trafficking requires a retailer in almost every case, because only an authorized retailer can turn an EBT debit into a deposit. A recipient can also traffic by selling the card and PIN to a third party, who then shops with it.

**Recipient eligibility fraud.** An applicant may underreport earnings, omit a working household member, add a person who does not live in the home, or enroll in a second state. Honest mistakes produce the same outcomes, so eligibility problems show up in the error rate and only some of them are fraud.

**Retailer ineligible sales and overcharging.** A store may let EBT pay for items the law excludes, such as alcohol, tobacco, or paper goods. A store may also charge EBT shoppers more than cash shoppers, or inflate the price of real food items. The second practice can be collusive (the shopper accepts inflated prices in exchange for credit or cash) or predatory (the shopper does not notice).

**Card skimming and cloning.** Skimming is theft from recipients. A criminal attaches a device to a store’s card reader or PIN pad. The device records the magnetic stripe data and the PIN. The criminal writes the data onto a blank card and drains the account, often within hours of the monthly benefit load. The recipient arrives at the store to find a zero balance. Magnetic stripe cards are easy to clone because the stripe carries static data that works on every swipe. A chip card generates a one-time code for each purchase, so copied data does not work for a second purchase.

**Insider fraud.** State employees with system access can create fictitious cases or issue benefits to accomplices. Cases are rare, and each can be large because the insider controls the record.

**Organized rings.** Rings combine the other types, for example by running several trafficking stores under nominee owners or skimming crews across states. They leave patterns across many cards and stores that no single transaction shows.

### 2.1 Fraud versus improper payments

The claim that “11 percent of SNAP is fraud” comes from the national payment error rate. USDA computes that rate each year from a quality control sample of cases. Reviewers check whether each sampled household received the correct benefit. Any difference above a small tolerance counts as an error, in either direction.

```guest-html
<table>
<colgroup>
<col style="width:25%">
<col style="width:25%">
<col style="width:25%">
<col style="width:25%">
</colgroup>
<thead>
<tr>
<th>Fiscal year</th>
<th>National payment error rate</th>
<th>Overpayment rate</th>
<th>Underpayment rate</th>
</tr>
</thead>
<tbody>
<tr>
<td>2023</td>
<td>11.68%</td>
<td>10.03%</td>
<td>1.64%</td>
</tr>
<tr>
<td>2024</td>
<td>10.93%</td>
<td>9.26%</td>
<td>1.67%</td>
</tr>
<tr>
<td>2025</td>
<td>10.62%</td>
<td>9.28%</td>
<td>1.33%</td>
</tr>
</tbody>
</table>
```

Four facts separate this rate from fraud. First, it includes underpayments, which are money the program failed to pay to eligible families. Second, it counts errors regardless of cause, and the largest causes are mistakes in income and household data made by households or caseworkers. USDA’s own release for fiscal year 2024 stated that the rate is not a measure of fraud. Third, it measures eligibility and benefit amounts only. It does not measure trafficking at all, because a trafficked benefit was correctly issued to an eligible household before it was sold. Fourth, error rates move with administrative load. They fell to about 3.2 percent in FY2013, rose from FY2014 (6.3 percent in FY2017, 7.4 percent in FY2019), then jumped after the pandemic disrupted state operations and staffing (Figure 3).

```guest-html
<figure class="fig" id="fig-02-fraud-vs-errors">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 3</span><h4>The 11 percent is mostly error, not fraud</h4><p class="g-dek">The payment error rate counts mistakes in both directions; trafficking, the best fraud measure, is about 1.6 to 2.0 percent.</p></div>
  <div class="fig-body">
    <div class="g-fe">
      <div class="g-fe-context">
        <p class="g-fe-ctx-label">All SNAP benefits, about &#36;100 billion a year (FY2024) = 100%</p>
        <div class="g-fe-strip" role="img" aria-label="On a bar of all SNAP benefits, the 10.93 percent payment error rate is a thin slice at the left; that 0 to 12 percent slice is enlarged below.">
          <span class="g-fe-strip-err" style="width:10.93%"></span>
          <span class="g-fe-strip-win" style="width:12%"></span>
        </div>
        <p class="g-fe-ctx-note">Outlined: the 0 to 12% slice, enlarged below on one scale.</p>
      </div>

      <div class="g-fe-chart" role="img" aria-label="On one scale from 0 to 12 percent of benefits: the FY2024 payment error rate is 10.93 percent, 9.26 points overpayments and 1.67 underpayments. Trafficking, the fraud estimate for 2015 to 2017, is 1.6 to 2.0 percent.">
        <div class="g-fe-axis" aria-hidden="true">
          <span style="left:0%">0%</span><span style="left:16.6667%">2%</span><span style="left:33.3333%">4%</span><span style="left:50%">6%</span><span style="left:66.6667%">8%</span><span style="left:83.3333%">10%</span><span style="left:100%">12%</span>
        </div>
        <div class="g-fe-rowlabel">
          <strong>Payment error rate</strong>
          <span>FY2024, all causes, both directions</span>
          <span class="num g-fe-total">10.93% <span class="g-t-muted">about &#36;10B</span></span>
        </div>
        <div class="g-fe-track">
          <span class="g-fe-grid" aria-hidden="true"></span>
          <span class="g-fe-seg g-fe-seg--over" style="left:0;width:77.1667%"></span>
          <span class="g-fe-seg g-fe-seg--under" style="left:77.1667%;width:13.9167%"></span>
        </div>
        <ul class="g-fe-legend">
          <li><span class="g-fe-sw g-fe-sw--over"></span>Overpayments <span class="num">9.26%</span>: mostly income and household data mistakes</li>
          <li><span class="g-fe-sw g-fe-sw--under"></span>Underpayments <span class="num">1.67%</span>: money families were owed and not paid</li>
        </ul>

        <div class="g-fe-rowlabel">
          <strong class="g-t-fraud">Trafficking (fraud)</strong>
          <span>2015 to 2017 estimate</span>
          <span class="num g-fe-total g-t-fraud">1.6% to 2.0%</span>
        </div>
        <div class="g-fe-track">
          <span class="g-fe-grid" aria-hidden="true"></span>
          <span class="g-fe-seg g-fe-seg--traf" style="left:0;width:13.3333%"></span>
          <span class="g-fe-seg g-fe-seg--traf-old" style="left:13.3333%;width:3.3333%"></span>
        </div>
        <ul class="g-fe-legend">
          <li><span class="g-fe-sw g-fe-sw--traf"></span><span class="num">1.6%</span> updated definition, about &#36;1.0B a year</li>
          <li><span class="g-fe-sw g-fe-sw--traf-old"></span>to <span class="num">2.0%</span> older definition, about &#36;1.3B a year</li>
        </ul>

      </div>

      <div class="g-fe-notes">
        <div class="g-node g-node--muted">
          <h5>Errors, either direction</h5>
          <p>Any gap above a small tolerance counts, whatever the cause. USDA, FY2024: the rate is not a measure of fraud.</p>
        </div>
        <div class="g-node g-node--fraud">
          <h5>Trafficking is not in the 11%</h5>
          <p>A trafficked benefit was correctly issued to an eligible household, then sold for cash. The error rate never sees it.</p>
        </div>
        <div class="g-node g-node--caution">
          <h5>Read sizes, not sums</h5>
          <p>Different years, methods, and measures. GAO: true trafficking is uncertain, about &#36;960 million to &#36;4.7 billion a year.</p>
        </div>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> compare bar lengths. The grey bar is error, mostly honest mistakes; the red bar is the fraud estimate, under a fifth of its length. Controls aimed at one do little for the other.</figcaption>
</figure>
```

The error rate is still a serious problem. Improper payments of about \$10 billion a year are real money, and Congress has tied state cost sharing to error rates starting with fiscal year 2028\. The point is narrower: the error rate and the fraud rate measure different things, and controls aimed at one do little for the other. The best available national fraud measure is the trafficking estimate. FNS’s eighth study in that series, covering 2015 to 2017 and published in 2021, estimated that 1.6 percent of benefits were trafficked under its updated definition (about \$1.0 billion a year) and 2.0 percent under the older definition (about \$1.3 billion a year). The earlier 2012 to 2014 study put the rate near 1.5 percent. GAO’s 2018 analysis of the earlier 2012 to 2014 study warned that the true figure is uncertain and could range from about \$960 million to \$4.7 billion a year, because the estimate rests on untested assumptions about how much of a trafficking store’s volume is trafficked.

## 3\. Anatomy of trafficking

The money flow of a single trafficking transaction is simple (Figure 4).

```guest-html
<figure class="fig" id="fig-03-trafficking-flow">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 4</span><h4>How one trafficking swipe moves the money</h4><p class="g-dek">The recipient and the store split &#36;100 of food aid as cash; the program pays in full and no food changes hands.</p></div>
  <div class="fig-body">
    <svg class="g-tf-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <marker id="fig-03-trafficking-flow-ah-fraud" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="g-f-fraud"></path></marker>
        <marker id="fig-03-trafficking-flow-ah-defense" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="g-f-defense"></path></marker>
      </defs>
    </svg>
    <div class="g-tf">
      <div class="g-tf-row">
        <div class="g-node g-tf-party">
          <svg class="g-tf-icon g-t-muted" viewBox="0 0 24 24" role="img" aria-label="EBT card"><rect x="2.5" y="5.5" width="19" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"></rect><line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="currentColor" stroke-width="2.5"></line><line x1="5.5" y1="14.5" x2="10.5" y2="14.5" stroke="currentColor" stroke-width="1.5"></line></svg>
          <h5>Recipient</h5>
          <p>EBT card holds <span class="num">&#36;100</span> of benefits</p>
        </div>

        <div class="g-tf-legs">
          <span class="g-tf-zone g-eyebrow g-t-fraud">At the counter: the lie</span>
          <div class="g-tf-leg g-t-fraud">
            <span class="g-tf-lbl"><span class="g-tf-step">1</span><strong class="num">&#36;100 swipe</strong></span>
            <svg class="g-tf-arrow" viewBox="0 0 96 14" role="img" aria-label="Recipient to store: card swiped for 100 dollars"><line x1="2" y1="7" x2="92" y2="7" class="g-s-fraud" stroke-width="2" marker-end="url(#fig-03-trafficking-flow-ah-fraud)"></line></svg>
            <span class="g-tf-sub">card debited, no food handed over</span>
          </div>
          <div class="g-tf-leg g-t-fraud">
            <span class="g-tf-lbl"><span class="g-tf-step">2</span><strong class="num">&#36;50 cash</strong></span>
            <svg class="g-tf-arrow" viewBox="0 0 96 14" role="img" aria-label="Store to recipient: 50 dollars cash"><line x1="94" y1="7" x2="4" y2="7" class="g-s-fraud" stroke-width="2" marker-end="url(#fig-03-trafficking-flow-ah-fraud)"></line></svg>
            <span class="g-tf-sub">paid back over the counter</span>
          </div>
        </div>

        <div class="g-node g-node--fraud g-tf-party">
          <svg class="g-tf-icon g-t-fraud" viewBox="0 0 24 24" role="img" aria-label="Storefront"><path d="M3 9.5 L4.5 4.5 H19.5 L21 9.5 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M4.5 9.5 V19.5 H19.5 V9.5" fill="none" stroke="currentColor" stroke-width="1.5"></path><rect x="10" y="13" width="4" height="6.5" fill="none" stroke="currentColor" stroke-width="1.5"></rect></svg>
          <h5>Corrupt store</h5>
          <p>Small, owner-run shop</p>
        </div>

        <div class="g-tf-legs">
          <span class="g-tf-zone g-eyebrow">In the network: looks normal</span>
          <div class="g-tf-leg g-t-fraud">
            <span class="g-tf-lbl"><span class="g-tf-step">3</span><strong class="num">&#36;100 claim</strong></span>
            <svg class="g-tf-arrow" viewBox="0 0 96 14" role="img" aria-label="Store to USDA: a recorded 100 dollar sale"><line x1="2" y1="7" x2="92" y2="7" class="g-s-fraud" stroke-width="2" marker-end="url(#fig-03-trafficking-flow-ah-fraud)"></line></svg>
            <span class="g-tf-sub">store, card, amount, time: approved</span>
          </div>
          <div class="g-tf-leg g-t-defense">
            <span class="g-tf-lbl"><span class="g-tf-step">4</span><strong class="num">&#36;100 deposit</strong></span>
            <svg class="g-tf-arrow" viewBox="0 0 96 14" role="img" aria-label="USDA to store: 100 dollar deposit"><line x1="94" y1="7" x2="4" y2="7" class="g-s-defense" stroke-width="2" marker-end="url(#fig-03-trafficking-flow-ah-defense)"></line></svg>
            <span class="g-tf-sub">paid in full, in a few banking days</span>
          </div>
        </div>

        <div class="g-node g-node--defense g-tf-party">
          <svg class="g-tf-icon g-t-defense" viewBox="0 0 24 24" role="img" aria-label="Government building"><path d="M3 9 L12 4 L21 9 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M6 11 V17 M10 11 V17 M14 11 V17 M18 11 V17 M3.5 19.5 H20.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
          <h5>USDA (taxpayers)</h5>
          <p>Reimburses stores for EBT sales</p>
        </div>
      </div>

      <div class="g-tf-end">
        <p class="g-eyebrow">Where each party ends up</p>
        <div class="g-tf-end-grid">
          <div class="g-tf-out">
            <span class="num g-tf-amt g-t-fraud">+&#36;50</span>
            <h5>Recipient: cash</h5>
            <p>Gave up &#36;100 of food benefits for half as much spendable cash.</p>
          </div>
          <div class="g-tf-out">
            <span class="num g-tf-amt g-t-fraud">+&#36;50</span>
            <h5>Store: profit</h5>
            <p>Received &#36;100, paid out &#36;50, sold no food.</p>
          </div>
          <div class="g-tf-out g-tf-out--loss">
            <span class="num g-tf-amt g-t-fraud">−&#36;100</span>
            <h5>Taxpayers: food aid</h5>
            <p>Paid in full for a sale that bought no food.</p>
          </div>
        </div>
      </div>
      <p class="g-tf-note"><span class="g-chip g-chip--caution">Illustrative</span> Example amounts. Federal cases reportedly describe rates around 50 cents on the dollar; some report higher or lower.</p>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> both people at the counter gain, so neither complains. The full loss lands on the program, which sees only a normal approved sale.</figcaption>
</figure>
```

**The core weakness.** The EBT authorization message carries the store, the card, the amount, the date, and the time. It carries no list of items. FNS’s 2016 feasibility study on capturing purchases at the point of sale confirmed that only total transaction amounts reach FNS. A trafficking store therefore never has to invent products. It keys in an amount, the network approves it, and the deposit follows. Every downstream check has to infer the fraud from the shape of the amounts and timings, because the record contains nothing else (Figure 5).

```guest-html
<figure class="fig" id="fig-03-blind-record">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 5</span><h4>The blind record: an amount with no basket</h4><p class="g-dek">The EBT record says where, which card, how much, and when, but never what was bought.</p></div>
  <div class="fig-body">
    <div class="g-br">
      <div class="g-br-pair">
        
          <p class="g-eyebrow g-t-defense">What the record carries</p>
          <div class="g-br-slip">
            <div class="g-br-slip-head"><span>EBT AUTHORIZATION</span><span class="g-chip g-chip--defense">APPROVED</span></div>
            <dl class="g-br-fields">
              <div><dt>STORE</dt><dd>retailer 0418823</dd></div>
              <div><dt>CARD</dt><dd>•••• 5207</dd></div>
              <div class="g-br-amount"><dt>AMOUNT</dt><dd>&#36;87.43</dd></div>
              <div><dt>DATE</dt><dd>day of sale</dd></div>
              <div><dt>TIME</dt><dd>14:02</dd></div>
            </dl>
          </div>
          <p class="g-br-note">Sent to FNS daily, for every SNAP sale. <span class="g-chip g-chip--caution">Illustrative values</span></p>
        

        
          <p class="g-eyebrow g-t-fraud">What it lacks: the item list</p>
          <div class="g-br-missing">
            <div class="g-br-row g-br-row--head"><span>ITEM</span><span>QTY</span><span>PRICE</span></div>
            <div class="g-br-row"><span>?</span><span>?</span><span>?</span></div>
            <div class="g-br-row"><span>?</span><span>?</span><span>?</span></div>
            <div class="g-br-row"><span>?</span><span>?</span><span>?</span></div>
            <div class="g-br-row"><span>…</span><span></span><span></span></div>
            <span class="g-br-stamp">NOT SENT</span>
          </div>
          <p class="g-br-note">Only total amounts reach FNS (FNS 2016 feasibility study).</p>
        
      </div>

      <ol class="g-br-chain" aria-label="So a trafficking store never has to invent products">
        <li><strong>Store keys in an amount</strong><span>no basket behind it</span></li>
        <li><strong>Network approves</strong><span>valid card, enough balance</span></li>
        <li><strong>Deposit follows</strong><span>store paid in full</span></li>
      </ol>

      
        <h5>Variant: overcharging (partial trafficking)</h5>
        <p>Real groceries go home, but the register charges more than they cost.</p>
        <div class="g-br-bar" role="img" aria-label="Register charges 70 dollars: 40 dollars of real groceries, 15 dollars back to the shopper as cash or credit, 15 dollars kept by the store above its margin.">
          <span class="g-br-bar-food" style="width:57.1429%"><span class="num">&#36;40</span> real groceries</span>
          <span class="g-br-bar-cut" style="width:21.4286%"><span class="num">&#36;15</span> shopper</span>
          <span class="g-br-bar-cut g-br-bar-cut--store" style="width:21.4286%"><span class="num">&#36;15</span> store</span>
        </div>
        <div class="g-br-bar-total"><span>Register charges <span class="num">&#36;70</span></span><span class="g-chip g-chip--caution">Illustrative</span></div>
        <p>The basket looks normal in size and timing, so amount-based analytics struggle to catch it.</p>
      
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> a real &#36;87.43 basket and a trafficked &#36;87.43 swipe produce the same record. Every later check must guess from amounts and timing.</figcaption>
</figure>
```

**Both parties lie together.** In most fraud, a victim has an incentive to report. In trafficking, the shopper and the cashier both gain. The recipient converts restricted benefits into cash, which can pay rent or utilities, or in worse cases buy drugs. The store keeps the spread. Neither party will complain, and any data either party enters can be shaped to look normal. This collusion property drives most of the design choices later in this report.

**Why small stores dominate.** The 2015 to 2017 study found that small stores (small and medium groceries and convenience stores) handled about 15 percent of redemptions but accounted for over 95 percent of trafficked dollars, and 99 percent under the updated definition. Several factors explain the concentration. A small store is often owner-operated, so one person controls the register, the cash drawer, and the books. Large chains run centralized point-of-sale systems with item scanning, cashier logins, and loss-prevention audits, and a cashier who trafficked would be stealing from the employer. Small stores also have few transactions per day, so a trafficking swipe does not need to hide in a long queue of scanned baskets. FNS enforcement focuses on small stores, on the ground that large stores’ own controls deter trafficking.

**The overcharging variant.** A store can also traffic partially. The shopper buys real groceries worth \$40, the register charges \$70, and the shopper receives \$15 in cash or store credit. The store earns \$15 above its margin. This version leaves a basket that looks normal in size and timing, so it is harder for amount-based analytics to catch. It also has a predatory form, where the store inflates prices for EBT shoppers who do not check their receipts.

**The economics.** Any restricted currency trades at a discount to cash. A dollar of benefits that can only buy groceries is worth less than a dollar to a household that needs to pay rent. A household that already spends more than its benefit on food gains little from trafficking, because benefits replace cash food spending dollar for dollar. A household with an urgent cash need, or one whose benefit exceeds its food budget, may value a benefit dollar at well under a dollar. Trafficking monetizes that gap. A store that can offer cash at 50 to 70 cents per dollar captures the remainder. Enforcement leaves the gap in place and raises the price of crossing it, by adding the risk of disqualification and prosecution to the store’s side of the trade.

## 4\. Current detection and enforcement

### 4.1 Transaction analytics: ALERT

FNS’s main detection tool for retailer trafficking is the Anti-Fraud Locator using EBT Retailer Transactions (ALERT). State EBT processors send FNS daily records of every SNAP transaction. GAO reported in 2018 that ALERT scanned about 250 million transactions per month. The system assigns each store a numeric score for the likelihood of trafficking. Stores above a threshold join a watch list, and analysts prioritize them using factors such as average transaction size relative to store type. Analysts also compare a suspect store with similar stores in the same ZIP code. CRS (R45147, 2018) reported that over 80 percent of the retailer trafficking FNS detects is found mainly through EBT transaction analysis (Figure 6).

```guest-html
<figure class="fig" id="fig-04-detection-pipeline">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 6</span><h4>How SNAP catches trafficking today</h4><p class="g-dek">Transaction analytics find most cases, people confirm them, and sanctions fall mostly on stores, after the money is paid.</p></div>
  <div class="fig-body">
    <svg class="g-dp-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <marker id="fig-04-detection-pipeline-ah" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="g-f-defense"></path></marker>
      </defs>
    </svg>
    <div class="g-dp">
      <div class="g-dp-flow">
        <div class="g-node g-dp-stage">
          <span class="g-dp-n">1</span>
          <h5>EBT records</h5>
          <p>State processors send FNS every transaction, daily.</p>
          <span class="g-chip"><span class="num">~250M</span>/month (GAO 2018)</span>
        </div>
        <div class="g-dp-arrow"><span class="g-dp-arrow-lbl">daily records</span><svg viewBox="0 0 48 14" role="img" aria-label="EBT records flow into ALERT"><line x1="2" y1="7" x2="44" y2="7" class="g-s-defense" stroke-width="2" marker-end="url(#fig-04-detection-pipeline-ah)"></line></svg></div>
        <div class="g-node g-node--defense g-dp-stage g-dp-alert">
          <span class="g-dp-n">2</span>
          <h5>ALERT flags</h5>
          <p>Each store gets a trafficking score; stores above a threshold join a watch list.</p>
          <p class="g-dp-big"><span class="num g-t-defense">80%+</span> of detected retailer trafficking is found mainly through EBT data (CRS)</p>
        </div>
        <div class="g-dp-arrow"><span class="g-dp-arrow-lbl">watch list</span><svg viewBox="0 0 48 14" role="img" aria-label="ALERT watch list goes to analysts"><line x1="2" y1="7" x2="44" y2="7" class="g-s-defense" stroke-width="2" marker-end="url(#fig-04-detection-pipeline-ah)"></line></svg></div>
        <div class="g-node g-dp-stage">
          <span class="g-dp-n">3</span>
          <h5>Analyst review</h5>
          <p>Rank by sale size against store type; compare with similar stores in the same ZIP code.</p>
        </div>
        <div class="g-dp-arrow"><span class="g-dp-arrow-lbl">priority cases</span><svg viewBox="0 0 48 14" role="img" aria-label="Analysts pass priority cases to investigators"><line x1="2" y1="7" x2="44" y2="7" class="g-s-defense" stroke-width="2" marker-end="url(#fig-04-detection-pipeline-ah)"></line></svg></div>
        <div class="g-node g-dp-stage">
          <span class="g-dp-n">4</span>
          <h5>Undercover buy</h5>
          <p>FNS or USDA OIG agents offer to sell benefits; state police in 28 states by agreement (GAO 2018).</p>
        </div>
        <div class="g-dp-arrow"><span class="g-dp-arrow-lbl">evidence</span><svg viewBox="0 0 48 14" role="img" aria-label="Evidence leads to sanctions"><line x1="2" y1="7" x2="44" y2="7" class="g-s-defense" stroke-width="2" marker-end="url(#fig-04-detection-pipeline-ah)"></line></svg></div>
        <div class="g-dp-sanctions">
          <div class="g-node g-node--defense g-dp-stage">
            <span class="g-dp-n">5a</span>
            <h5>Retailer disqualified</h5>
            <p>Trafficking: permanent (7 CFR 278.6). Other violations: 6 months to 5 years; repeats double.</p>
            <span class="g-chip g-chip--defense">EBT data alone can support it</span>
          </div>
          <div class="g-node g-node--caution g-dp-stage">
            <span class="g-dp-n">5b</span>
            <h5>Recipient penalties</h5>
            <p>12 months, 24 months, then permanent (7 CFR 273.16). Trafficking conviction of &#36;500+: permanent.</p>
            <span class="g-chip g-chip--caution">often stalls: EBT data rarely enough</span>
          </div>
        </div>
      </div>

      <p class="g-dp-late"><strong>Every stage runs after the sale:</strong> the store has already been paid.</p>

      <div class="g-dp-lower">
        <div class="g-node g-node--muted">
          <h5>Patterns that drive cases</h5>
          <p>Each is a proxy for "no real basket behind this amount."</p>
          <ul class="g-dp-list">
            <li>Many sales in round or repeated amounts, such as totals ending in .00</li>
            <li>Several swipes from one household account in a short window</li>
            <li>Sales too large for the store's size and type</li>
            <li>Many households making similar sales in a short period</li>
            <li>Accounts drained in one or two swipes, sometimes by out-of-state cards</li>
          </ul>
        </div>
        <div class="g-node g-node--caution">
          <h5 class="g-t-caution">Five structural limits</h5>
          <ol class="g-dp-list g-dp-limits">
            <li><strong>Detects after the fact.</strong> The store is already paid; owners can reopen under a new name.</li>
            <li><strong>Sees only amounts.</strong> A real &#36;87.43 basket and a trafficked &#36;87.43 swipe look the same.</li>
            <li><strong>Targets stores, largely misses recipients.</strong> EBT data alone is generally not enough to disqualify a recipient.</li>
            <li><strong>Does not scale with investigators.</strong> GAO: all stores reauthorized on a five-year cycle, regardless of risk.</li>
            <li><strong>The card was weak.</strong> Magnetic stripes made skimming cheap.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> the pipeline is a strong detector of crude store fraud. It acts late, sees only amounts, and rarely reaches the recipient side of a case.</figcaption>
</figure>
```

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

```guest-html
<table>
<colgroup>
<col style="width:50%">
<col style="width:50%">
</colgroup>
<thead>
<tr>
<th>Violation</th>
<th>Retailer sanction</th>
</tr>
</thead>
<tbody>
<tr>
<td>Trafficking</td>
<td>Permanent disqualification (278.6(e)(1))</td>
</tr>
<tr>
<td>Trafficking, with an effective compliance program in place before
the violation and owners not involved</td>
<td>Trafficking civil money penalty in place of permanent
disqualification (278.6(i))</td>
</tr>
<tr>
<td>Selling ineligible items after a warning, as a practice (expensive
or conspicuous items, alcohol, tobacco)</td>
<td>5 years for a first sanction (278.6(e)(2))</td>
</tr>
<tr>
<td>Common nonfood items after a warning, or (e)(2) conduct without
warning</td>
<td>3 years (278.6(e)(3))</td>
</tr>
<tr>
<td>Ineligible sales by owners or managers without a warning, or credit
sales</td>
<td>1 year (278.6(e)(4))</td>
</tr>
<tr>
<td>Violations from carelessness or poor supervision</td>
<td>6 months (278.6(e)(5))</td>
</tr>
<tr>
<td>Repeat sanctions</td>
<td>The above periods double (278.6(e)(6))</td>
</tr>
</tbody>
</table>
```

The regulation lets FNS rely on “evidence obtained through a transaction report under an electronic benefit transfer system.” That clause is what lets ALERT data alone support a permanent disqualification.

For recipients, 7 CFR 273.16 sets disqualification periods for an intentional program violation: 12 months for a first violation, 24 months for a second, and permanent for a third. A court conviction for trafficking \$500 or more brings permanent disqualification on the first occasion. A fraudulent statement about identity or residence to receive benefits in more than one place brings a 10-year bar. Transactions involving firearms, ammunition, or explosives bring permanent disqualification. Transactions involving controlled substances bring 24 months, then permanent.

### 4.3 Eligibility and retailer standards

On the eligibility side, states verify income and identity using federal and state data sources. The 2018 Farm Bill required a National Accuracy Clearinghouse (NAC) to stop the same person from receiving benefits in two states at once. FNS issued an interim final rule in October 2022 requiring all state agencies to join the NAC and to act on its match results, with full compliance due by 2027\. Before the NAC, states relied on the slower Public Assistance Reporting Information System (PARIS) for interstate matching.

On the retailer side, FNS published a final rule in December 2016 to raise stocking standards. It required stores qualifying on inventory to carry at least seven varieties in each of four staple food categories, with perishable items in at least three categories and at least three units of each variety. The aim was partly integrity: a “store” with a few cans on a shelf and a busy EBT terminal is a classic trafficking front. Appropriations riders blocked enforcement of the variety and breadth provisions for years. USDA published a final rule on updated standards on May 8, 2026 (91 FR 25082), effective July 7, 2026\. Retailers must comply by November 4, 2026.

### 4.4 Skimming response

The Consolidated Appropriations Act, 2023 (P.L. 117-328, Division HH, section 501) gave states temporary authority to replace stolen benefits with federal funds, limited to the lesser of the amount stolen or two months of benefits. A later continuing resolution extended the window to cover thefts through December 20, 2024\. Congress did not extend it further. According to USDA figures cited by the Center on Budget and Policy Priorities, states replaced more than \$150 million in stolen benefits for over 315,000 households between January 2023 and September 2024\. The underlying fix is the card itself. California began issuing chip cards in early 2025, though most transactions still used the magstripe. Other states have started similar migrations (Figure 7).

```guest-html
<figure class="fig" id="fig-04-skimming-timeline">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 7</span><h4>Skimming: how a family's benefits vanish</h4><p class="g-dek">A copied magstripe card is drained soon after the monthly load, and since federal replacement ended in December 2024 the family bears the loss.</p></div>
  <div class="fig-body">
    <div class="g-sk">
      <p class="g-eyebrow g-sk-title">The attack, one benefit month (not to scale)</p>
      <ol class="g-sk-steps">
        <li class="g-node">
          <span class="g-sk-n">1</span>
          <h5>Skimmer installed</h5>
          <p>Device fitted on a store's card reader or PIN pad.</p>
          <span class="g-chip g-chip--fraud">criminal</span>
        </li>
        <li class="g-node">
          <span class="g-sk-n">2</span>
          <h5>Card data copied</h5>
          <p>At a normal purchase, the device records stripe data and PIN.</p>
          <span class="g-chip g-chip--fraud">magstripe, no chip</span>
        </li>
        <li class="g-node">
          <span class="g-sk-n">3</span>
          <h5>Clone made</h5>
          <p>Data written onto a blank card. Static stripe data works on every swipe.</p>
          <span class="g-chip g-chip--fraud">criminal</span>
        </li>
        <li class="g-node g-node--defense">
          <span class="g-sk-n">4</span>
          <h5>Benefits load</h5>
          <p>The state loads the monthly benefit onto the family's account.</p>
          <span class="g-chip g-chip--defense">state</span>
        </li>
        <li class="g-node g-node--fraud">
          <span class="g-sk-n">5</span>
          <h5>Card drained</h5>
          <p>The clone spends the whole balance.</p>
          <span class="g-chip g-chip--fraud">often within hours</span>
        </li>
        <li class="g-node g-sk-hit">
          <span class="g-sk-n">6</span>
          <h5>Family finds <span class="num">&#36;0</span></h5>
          <p>They arrive at the store to a zero balance. The month's food money is gone.</p>
          <span class="g-chip g-chip--fraud">victim: recipient</span>
        </li>
      </ol>
      <p class="g-sk-why"><strong class="g-t-defense">Why a chip fixes it:</strong> a magnetic stripe carries static data that works on every swipe. A chip card makes a one-time code per purchase, so copied data fails a second time.</p>

      <div class="g-sk-cover">
        <p class="g-eyebrow g-sk-title">Who covers the loss</p>
        <div class="g-sk-axis" aria-hidden="true">
          <span style="left:0%">2023</span><span style="left:25%">2024</span><span style="left:50%">2025</span><span style="left:75%">2026</span>
        </div>
        <div class="g-sk-track" role="img" aria-label="From January 2023 to December 20, 2024, federal funds replaced stolen benefits. After that window ended, families bear the loss.">
          <span class="g-sk-fed" style="width:49.26%">Federal funds replace stolen benefits</span>
          <span class="g-sk-fam" style="left:49.26%">Families bear the loss</span>
          <span class="g-sk-end" style="left:49.26%"></span>
        </div>
        <p class="g-sk-endlabel" style="padding-left:49.26%"><strong class="num g-t-fraud">Dec 20, 2024</strong> <span>window ends; Congress did not extend it</span></p>
        <div class="g-sk-notes">
          <div class="g-node g-node--defense">
            <h5>P.L. 117-328 replacement rules</h5>
            <p>Capped at the lesser of the amount stolen or two months of benefits.</p>
          </div>
          <div class="g-node">
            <h5><span class="num">&#36;150M+</span> replaced</h5>
            <p>Jan 2023 to Sep 2024: more than &#36;150 million for over 315,000 households (USDA, via CBPP).</p>
          </div>
          <div class="g-node g-node--defense">
            <h5>The lasting fix: chip cards</h5>
            <p>California began issuing chip cards in early 2025. Other states have started.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> the theft hits the family, not the store or the program. Since December 2024 no federal backstop covers it, so the card itself has to change.</figcaption>
</figure>
```

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

```guest-html
<figure class="fig" id="fig-05-collusion-resistance">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 8</span><h4>Collusion resistance: who writes the evidence?</h4><p class="g-dek">Build detection on evidence the colluders cannot write.</p></div>
  <div class="fig-body">
    <div class="g-cr-pair">
      <svg viewBox="0 0 380 122" role="img" aria-label="In trafficking the shopper and the cashier trade a benefit swipe for cash at a discount. Both gain, so neither reports.">
        <defs>
          <marker id="fig-05-collusion-resistance-m" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,1 L9,5 L0,9 Z" class="g-f-fraud"></path></marker>
        </defs>
        <g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="g-s-ink">
          <circle cx="46" cy="30" r="12"></circle>
          <path d="M20,76 C20,56 32,48 46,48 C60,48 72,56 72,76"></path>
          <path d="M308,40 H368 L362,26 H314 Z"></path>
          <path d="M314,40 V76 H362 V40"></path>
          <path d="M330,76 V58 H346 V76"></path>
        </g>
        <g fill="none" stroke-width="2.5" class="g-s-fraud">
          <path d="M90,42 H292" marker-end="url(#fig-05-collusion-resistance-m)"></path>
          <path d="M292,66 H90" marker-end="url(#fig-05-collusion-resistance-m)"></path>
        </g>
        <g font-size="14" text-anchor="middle">
          <text x="191" y="34" class="g-f-ink" font-weight="600">benefit swipe</text>
          <text x="191" y="84" class="g-f-ink" font-weight="600">cash at a discount</text>
          <text x="46" y="96" class="g-f-ink" font-size="15" font-weight="700">Shopper</text>
          <text x="338" y="96" class="g-f-ink" font-size="15" font-weight="700">Cashier</text>
          <text x="338" y="115" class="g-f-muted">or owner</text>
          <text x="191" y="114" class="g-f-fraud" font-weight="600">both gain, so neither reports</text>
        </g>
      </svg>
    </div>

    <div class="g-cr-cols">
      
        <span class="g-chip g-chip--fraud">fakeable</span><h5>The pair writes it</h5>
        <ul>
          <li><div class="g-cr-row"><b>Amount keyed at the terminal</b><span class="g-cr-writer">store</span></div><p>The store keys any total. The network approves it and the deposit follows.</p></li>
          <li><div class="g-cr-row"><b>Typed item lines</b><span class="g-cr-writer">store</span></div><p>"4 gallons of milk, 3 loaves of bread" can cover a &#36;50 trafficking swipe.</p></li>
          <li><div class="g-cr-row"><b>The receipt</b><span class="g-cr-writer">store, shopper</span></div><p>The shopper will confirm any receipt the store prints.</p></li>
          <li><div class="g-cr-row"><b>Cardholder app reports</b><span class="g-cr-writer">shopper</span></div><p>A trafficking shopper never presses "price looks wrong." Reports catch only predatory overcharging.</p></li>
        </ul>
      

      <div class="g-cr-wall" aria-hidden="true"><span>the pair's reach ends here</span></div>

      
        <span class="g-chip g-chip--defense">independent</span><h5>Neither party writes it</h5>
        <ul>
          <li><div class="g-cr-row"><b>Supplier invoices, distributor feeds</b><span class="g-cr-writer">supplier</span></div><p>For illustration, a store cannot sell 400 cartons of eggs if suppliers delivered 50.</p></li>
          <li><div class="g-cr-row"><b>Patterns across many cards and stores</b><span class="g-cr-writer">network</span></div><p>200 cards that spend nearly all benefits at three small related stores.</p></li>
          <li><div class="g-cr-row"><b>Field inspector's shelf check</b><span class="g-cr-writer">inspector</span></div><p>The stock an inspector sees on the shelf.</p></li>
          <li><div class="g-cr-row"><b>Outside income data</b><span class="g-cr-writer">employer, tax data</span></div><p>Payroll, wage, and tax records replace self-reported income.</p></li>
        </ul>
      
    </div>

    <p class="g-cr-limit g-node g-node--caution"><span><strong class="g-t-caution">Limit:</strong> a store can buy stock for cash at a wholesale club, which leaves no record in a distributor feed. <strong class="g-t-caution">Fix:</strong> make purchase records a condition of authorization, backed by random and targeted audits.</span></p>
  </div>
  <figcaption><strong>Read it as:</strong> every item on the left comes from the shopper or the store, so a colluding pair can make it look normal. Every item on the right comes from someone outside the deal.</figcaption>
</figure>
```

**Defense in depth.** No single control stops all fraud types. Chip cards stop cloning and do nothing about trafficking. Item data constrains overcharging and only raises the cost of trafficking. Each layer should assume the layers before it have failed, and each should produce data the analytics layer can use to catch what got through.

**Economic framing.** Integrity spending is worth doing only up to the point where the next dollar of control saves at least a dollar of loss, counting the costs that controls impose on honest participants. Trafficking of about \$1 billion a year is a large number in absolute terms and a small share of a \$100 billion program. For illustration, a control that costs \$600 million a year to prevent \$300 million in trafficking is a bad trade.

**Protect honest participants.** False positives cut food to families. A wrongly disqualified store can leave a neighborhood with no place to use EBT. A wrongly flagged recipient can lose benefits during an appeal. Error costs fall on people with little cushion. Every automated action needs a reversible design, a fast appeal, and human review before any benefit cutoff.

## 6\. A layered program and software architecture

The architecture has four transaction-path layers and one analytics layer that reads from all of them. Confirmed cases flow back into the analytics layer as labels (Figure 9).

```guest-html
<figure class="fig" id="fig-06-layered-architecture">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 9</span><h4>A layered program and software architecture</h4><p class="g-dek">Four layers act on each enrollment or sale; one analytics layer reads them all, because fraud is weak in one event and strong in a pattern.</p></div>
  <div class="fig-body">
    <div class="g-la" role="group" aria-label="Eligibility, credential, transaction, and merchant payout layers act in sequence. Each sends events to an analytics layer, which also reads third-party wholesale data. Analytics sends the top stores by expected loss to a budget-capped investigation queue and the rest above normal to automated actions. Closed cases return to analytics as labels.">
      <p class="g-la-band g-eyebrow">Transaction path: acts on each enrollment or sale</p>
      <div class="g-la-path">
        <div class="g-la-layer">
          <span class="g-la-n">1</span><h5>Eligibility</h5><svg class="g-la-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="16" height="12" rx="2"></rect><circle cx="7" cy="9" r="2"></circle><path d="M4.5 13.5c.6-1.3 1.4-2 2.5-2s1.9.7 2.5 2M12 8h4M12 11h3"></path></svg>
          <p class="g-la-role">Who gets benefits, and how much</p>
          <ul class="g-la-ctl">
            <li>Income match: payroll, wage, tax, bank</li>
            <li>National duplicate check (NAC) before first issuance, rechecked monthly</li>
            <li>Household composition cross-checks</li>
          </ul>
          <p class="g-la-stops"><span class="g-la-k">stops</span>Eligibility fraud, two-state enrollment</p>
          <p class="g-la-emit">sends analytics: match results</p>
        </div>
        <div class="g-la-step" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>approved case</span></div>
        <div class="g-la-layer">
          <span class="g-la-n">2</span><h5>Credential and card</h5><svg class="g-la-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="16" height="12" rx="2"></rect><rect x="5" y="7" width="4" height="3" rx="0.5"></rect><path d="M5 13h6"></path></svg>
          <p class="g-la-role">Who can spend a benefit</p>
          <ul class="g-la-ctl">
            <li>EMV chip and tap, phone wallet</li>
            <li>App lock, out-of-state and online blocks</li>
            <li>Per-swipe alerts, load-day step-up</li>
          </ul>
          <p class="g-la-stops"><span class="g-la-k">stops</span>Card skimming and cloning</p>
          <p class="g-la-emit">sends analytics: card events</p>
        </div>
        <div class="g-la-step" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>verified card</span></div>
        <div class="g-la-layer">
          <span class="g-la-n">3</span><h5>Transaction</h5><svg class="g-la-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2h10v16l-2-1.5-1.5 1.5-1.5-1.5L8.5 18 7 16.5 5 18z"></path><path d="M8 6h4M8 9h4M8 12h2"></path></svg>
          <p class="g-la-role">What each sale contains</p>
          <ul class="g-la-ctl">
            <li>Item-level basket: barcode, quantity, unit price</li>
            <li>Real-time reject of ineligible items</li>
            <li>Per-store product catalog</li>
          </ul>
          <p class="g-la-stops"><span class="g-la-k">stops</span>Ineligible sales; makes trafficking costlier</p>
          <p class="g-la-emit">sends analytics: baskets</p>
        </div>
        <div class="g-la-step" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>approved sale</span></div>
        <div class="g-la-layer">
          <span class="g-la-n">4</span><h5>Merchant payout</h5><svg class="g-la-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7l8-4 8 4z"></path><path d="M4.5 9v6M8.5 9v6M11.5 9v6M15.5 9v6M2 17.5h16"></path></svg>
          <p class="g-la-role">When and how the store gets paid</p>
          <ul class="g-la-ctl">
            <li>Probation for new stores</li>
            <li>Risk-tiered payout delays and volume caps</li>
            <li>Time-limited holds, rolling reserve</li>
          </ul>
          <p class="g-la-stops"><span class="g-la-k">stops</span>Hit-and-run trafficking; keeps money recoverable</p>
          <p class="g-la-emit">sends analytics: payouts</p>
        </div>
      </div>

      <div class="g-la-feeds" aria-hidden="true">
        <span class="g-la-feed"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg>match results</span>
        <span class="g-la-feed"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg>card events</span>
        <span class="g-la-feed"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg>baskets</span>
        <span class="g-la-feed"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg>payouts</span>
      </div>
      <div class="g-la-down g-la-tofive" aria-hidden="true"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg><span>all four layers send events</span></div>

      <div class="g-la-cycle">
        <div class="g-la-loop" aria-hidden="true"><span>labels: fraud or not fraud</span></div>

        
          <span class="g-la-n">5</span><h5>Analytics layer</h5><svg class="g-la-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v14h14"></path><path d="M6 13l3-4 3 2 4-6"></path></svg><p>Acts on aggregates over time. Scores stores, cards, and cases.</p>
          <div class="g-la-an-grid">
            <div class="g-la-method">
              <h6>Price anomaly score</h6>
              <p>Store-month prices against regional reference prices per barcode</p>
              <p class="g-la-stops"><span class="g-la-k">catches</span>Overcharging</p>
            </div>
            <div class="g-la-method">
              <h6>Inventory reconciliation</h6>
              <p>EBT sales per category against wholesale purchases</p>
              <p class="g-la-stops"><span class="g-la-k">catches</span>Fake baskets, trafficking</p>
            </div>
            <div class="g-la-method">
              <h6>Card-store graph</h6>
              <p>Clusters of cards at a few stores, shared owners, shared bank accounts</p>
              <p class="g-la-stops"><span class="g-la-k">catches</span>Organized rings</p>
            </div>
            <div class="g-la-in" aria-hidden="true"><svg viewBox="0 0 30 12" fill="currentColor"><path d="M8 5h22v2H8z"></path><path d="M9 1L0 6l9 5z"></path></svg></div>
            <div class="g-la-third">
              <span class="g-eyebrow">Third-party data</span>
              <b>Wholesale invoices</b>
              <b>Distributor feeds</b>
              <p>The stores do not write these.</p>
            </div>
          </div>
        

        <div class="g-la-out">
          <div class="g-la-out-col">
            <div class="g-la-down" aria-hidden="true"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg><span>top N by expected loss</span></div>
            <div class="g-node g-node--defense g-la-queue">
              <h5>Investigation queue <span class="g-chip g-chip--defense">people</span></h5>
              <p>Capped by budget: investigator hours set N.</p>
              <p>A case gets a review only if its expected benefit beats the review's cost.</p>
            </div>
            <div class="g-la-down" aria-hidden="true"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg><span>a person decides</span></div>
            <div class="g-node g-node--muted g-la-closed">
              <h5>Closed cases</h5>
              <p>Confirmed or cleared: both become labels. Cleared cases teach the models which patterns are benign.</p>
              <p class="g-la-back"><svg viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M5 5h2v9H5z"></path><path d="M1 6l5-6 5 6z"></path></svg>labels retrain the scores in layer 5</p>
            </div>
          </div>
          <div class="g-la-out-col">
            <div class="g-la-down" aria-hidden="true"><svg viewBox="0 0 12 30" fill="currentColor"><path d="M5 0h2v22H5z"></path><path d="M1 21l5 9 5-9z"></path></svg><span><span class="g-la-m">from layer 5: </span>above normal, below the cutoff</span></div>
            <div class="g-node g-la-auto">
              <h5>Automated actions <span class="g-chip">software</span></h5>
              <p>Warning letter, payout delay, volume cap.</p>
              <p>Reversible. No investigator time.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="g-node g-node--caution g-la-limits">
        <h5 class="g-t-caution">Limits built into the design</h5>
        <p>Item data raises the effort of trafficking, but a store can still key fake lines. Supplier data is what exposes them.</p>
        <p>Scores open cases and never cut benefits. A person decides, with notice and a hearing, and every automated action has a fast appeal.</p>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> each layer assumes the one before it failed, and each feeds the analytics that catch what got through. People see only the top of a ranked list, and every closed case makes the next ranking better.</figcaption>
</figure>
```

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

```guest-html
<figure class="fig" id="fig-06-credential-hardening">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 10</span><h4>Hardening the card: breaking the skimming path</h4><p class="g-dek">A skimming theft needs three steps to succeed, and each control breaks the chain at a different link.</p></div>
  <div class="fig-body">
    <div class="g-ch-grid" role="group" aria-label="Skimming attack path: skimmer copies the stripe and PIN, a clone card is made, the crew drains the account on load day, and the family finds a zero balance. Tap to pay and phone wallets break the copy. EMV chips and ending stripe fallback break the clone. Card locks, location and online blocks, varied load timing, and step-up checks break the drain. Per-swipe alerts shrink the loss.">
      <p class="g-ch-lane g-ch-lane--a g-eyebrow">Attack path</p>
      <p class="g-ch-lane g-ch-lane--c g-eyebrow">Controls, placed at the link they break</p>

      <div class="g-ch-atk g-ch-a1">
        <span class="g-ch-n">1</span><h5>Skimmer</h5><svg class="g-ch-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="10" height="16" rx="2"></rect><path d="M5 7h10M8 11h1M11 11h1M8 14h1M11 14h1"></path></svg>
        <p>A device on the card reader or PIN pad records the magnetic stripe and the PIN.</p>
      </div>
      <div class="g-ch-ctl g-ch-c1">
        <p class="g-ch-cut"><svg viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 2H6a4 4 0 0 0 0 8h4M16 2h4a4 4 0 0 1 0 8h-4"></path></svg>breaks the copy</p>
        <div class="g-ch-card"><h6>Tap to pay</h6><p>Fewer cards pass through a tampered slot.</p></div>
        <div class="g-ch-card"><h6>Phone wallet</h6><p>Device binding and biometric unlock. No stripe to copy. The 2018 Farm Bill authorized mobile pilots.</p></div>
      </div>
      <div class="g-ch-arrow g-ch-x1" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>stripe + PIN</span></div>

      <div class="g-ch-atk g-ch-a2">
        <span class="g-ch-n">2</span><h5>Clone</h5><svg class="g-ch-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="12" height="9" rx="1.5"></rect><rect x="6" y="8" width="12" height="9" rx="1.5"></rect><path d="M6 11.5h12"></path></svg>
        <p>The data goes onto a blank card. A stripe holds static data, so the copy works on every swipe.</p>
      </div>
      <div class="g-ch-ctl g-ch-c2">
        <p class="g-ch-cut"><svg viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 2H6a4 4 0 0 0 0 8h4M16 2h4a4 4 0 0 1 0 8h-4"></path></svg>breaks the clone</p>
        <div class="g-ch-card"><h6>EMV chip</h6><p>A one-time code for each purchase: copied data fails the second time.</p></div>
        <div class="g-ch-card"><h6>End stripe fallback</h6><p>Decline stripe sales after a set date, except at stores with an approved exception.</p></div>
      </div>
      <div class="g-ch-arrow g-ch-x2" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>working copy</span></div>

      <div class="g-ch-atk g-ch-a3">
        <span class="g-ch-n">3</span><h5>Drain on load day</h5><svg class="g-ch-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="16" height="13" rx="2"></rect><path d="M2 8h16M6 2v4M14 2v4M7 12l6 0"></path></svg>
        <p>The crew spends the balance within hours of the monthly load, when it is highest.</p>
      </div>
      <div class="g-ch-ctl g-ch-c3">
        <p class="g-ch-cut"><svg viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 2H6a4 4 0 0 0 0 8h4M16 2h4a4 4 0 0 1 0 8h-4"></path></svg>breaks the drain</p>
        <div class="g-ch-card"><h6>App card lock, location and online blocks</h6><p>Lock between uses. Out-of-state and online sales blocked by default. Stops most cloned-card drains.</p></div>
        <div class="g-ch-card"><h6>Varied load timing, step-up check</h6><p>Spread loads by case number. A big spend soon after a load, far from usual stores, needs confirmation in the app.</p></div>
      </div>
      <div class="g-ch-arrow g-ch-x3" aria-hidden="true"><svg viewBox="0 0 40 12" fill="currentColor"><path d="M0 5h32v2H0z"></path><path d="M31 1l9 5-9 5z"></path></svg><span>benefits</span></div>

      <div class="g-ch-atk g-ch-atk--end g-ch-a4">
        <h5>Family finds a zero balance</h5>
        <p>Federal replacement covered thefts only through Dec 20, 2024. Since then the family bears the loss.</p>
      </div>
      <div class="g-ch-ctl g-ch-c4">
        <p class="g-ch-cut"><svg viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 2H6a4 4 0 0 0 0 8h4M16 2h4a4 4 0 0 1 0 8h-4"></path></svg>shrinks the loss</p>
        <div class="g-ch-card"><h6>Per-swipe alerts</h6><p>An alert for every swipe. The household reports theft within minutes instead of at the checkout.</p></div>
      </div>
    </div>

    <p class="g-node g-node--caution g-ch-catch"><span><strong class="g-t-caution">Catch:</strong> in California's chip rollout, retailers had to upgrade terminals, and for a time most sales still fell back to the stripe. The step-up check must fail open for recipients without phones, or it cuts off the households least able to wait.</span></p>
  </div>
  <figcaption><strong>Read it as:</strong> the chip kills the clone at link 2, so it does the most work. Locks, blocks, and alerts catch whatever still gets through at link 3.</figcaption>
</figure>
```

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

```guest-html
<figure class="fig" id="fig-06-merchant-risk-tiers">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 11</span><h4>The merchant risk ladder</h4><p class="g-dek">Like a card processor, the program pays clean stores fast and slows, caps, or holds money as a store's risk score climbs.</p></div>
  <div class="fig-body">
    <div class="g-mr" role="group" aria-label="New stores start in probation and move to normal with a clean history or to elevated if the score spikes. Normal stores get standard settlement. Elevated stores get longer delays and volume caps. High-risk stores have part of their payouts held pending review. Disqualified stores, confirmed by investigation, are paid nothing and the reserve funds recovery. Stores move back down as scores fall or reviews clear.">
      
        <span class="g-eyebrow">Entry: new store or new owner</span>
        <div class="g-mr-rung g-mr-rung--prob">
          <div class="g-mr-tier"><h5>Probation</h5><span class="g-chip g-chip--caution">delayed and capped</span></div>
          <ul class="g-mr-what">
            <li>Longer payout delay</li>
            <li>Monthly volume cap set from stated size and stock</li>
            <li>Early field visit</li>
          </ul>
          <p class="g-mr-why">Trafficking stores often show high volume soon after authorization, so probation covers the riskiest period.</p>
        </div>
        <p class="g-mr-exit g-mr-exit--good"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 3h10L6 10z" class="g-f-defense"></path></svg>clean history: to Normal</p>
        <p class="g-mr-exit g-mr-exit--bad"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 3h10L6 10z" class="g-f-fraud"></path></svg>score spikes: to Elevated or High risk</p>
      

      <div class="g-mr-ladder">
        <div class="g-mr-scale" aria-hidden="true"><span>low risk</span><i></i><span>high risk</span></div>
        <ol>
          <li class="g-mr-rung g-mr-rung--1">
            <div class="g-mr-tier"><h5>Normal</h5><span class="g-chip g-chip--defense">standard settlement</span></div>
            <ul class="g-mr-what"><li>Standard settlement time</li><li>Score keeps updating every month</li></ul>
            <p class="g-mr-who"><span>who decides</span>Software: the monthly score</p>
          </li>
          <li class="g-mr-move"><span class="g-mr-dn"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 3h10L6 10z" class="g-f-fraud"></path></svg>score crosses tier threshold</span><span class="g-mr-up"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 9h10L6 2z" class="g-f-defense"></path></svg>score falls, history clean</span></li>
          <li class="g-mr-rung g-mr-rung--2">
            <div class="g-mr-tier"><h5>Elevated</h5><span class="g-chip g-chip--caution">delayed and capped</span></div>
            <ul class="g-mr-what"><li>Longer settlement delay and a volume cap</li><li>Warning letter: prices sit well above peers</li></ul>
            <p class="g-mr-who"><span>who decides</span>Software, no investigator time</p>
          </li>
          <li class="g-mr-move"><span class="g-mr-dn"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 3h10L6 10z" class="g-f-fraud"></path></svg>score crosses high threshold</span><span class="g-mr-up"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 9h10L6 2z" class="g-f-defense"></path></svg>review clears, hold released</span></li>
          <li class="g-mr-rung g-mr-rung--3">
            <div class="g-mr-tier"><h5>High risk</h5><span class="g-chip g-chip--fraud">partly held</span></div>
            <ul class="g-mr-what"><li>Part of payouts held pending review</li><li>Hold has a time limit; rolling reserve kept</li></ul>
            <p class="g-mr-who"><span>who decides</span>Software holds; a person reviews</p>
          </li>
          <li class="g-mr-move"><span class="g-mr-dn"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 3h10L6 10z" class="g-f-fraud"></path></svg>investigation confirms trafficking</span></li>
          <li class="g-mr-rung g-mr-rung--4">
            <div class="g-mr-tier"><h5>Disqualified</h5><span class="g-chip g-chip--fraud">stopped</span></div>
            <ul class="g-mr-what"><li>Permanent for trafficking, 7 CFR 278.6(e)(1)</li><li>Reserve funds recovery; a civil money penalty option exists</li></ul>
            <p class="g-mr-who"><span>who decides</span>Investigator, with notice and appeal</p>
          </li>
        </ol>
      </div>
    </div>

    <p class="g-node g-node--caution g-mr-guard"><span><strong class="g-t-caution">Guardrails:</strong> a hold without a time limit and a release path is a penalty without process. Publish appeal timelines, track reversals, and pay interest on wrongful holds. Before disqualifying the last authorized store in an area, run an access test, with a civil money penalty as the alternative.</span></p>
  </div>
  <figcaption><strong>Read it as:</strong> software moves a store up and down the first three rungs with no investigator time. Only a person can disqualify, and a week or two of delay leaves money to recover when a case opens.</figcaption>
</figure>
```

**Holds pending review.** When a store’s score crosses a high threshold, the program can hold part of its payouts until review. A hold of this kind must have a time limit and a clear path to release, or it becomes a penalty without process.

**Recovery reserve.** For high-tier stores, a rolling reserve (a share of payouts held for a period) gives the program a fund to recover from after a disqualification.

### 6.5 Analytics layer

The analytics layer reads from all four transaction-path layers and from third-party sources. It produces store, card, and case scores, and it feeds the investigation queue. Two methods matter most beyond price anomaly detection, which Section 7 covers.

**Inventory reconciliation.** Compare EBT sales per product category against the store’s wholesale purchases of that category. For illustration, a store cannot sell 400 cartons of eggs in a month if its suppliers delivered 50\. Purchase data can come from supplier invoices that the store submits and from data feeds provided by large distributors under agreement. Without item data, reconciliation works at the level of total food purchases against total EBT redemptions. With item data, it works per product. The limit is that a store can buy stock for cash at a wholesale club, which leaves no supplier record in a distributor feed. The program should make purchase records a condition of authorization: a store must keep invoices or receipts for food it sells and submit them on request. Random audits of a sample of stores each year, plus targeted audits of high scorers, keep the requirement credible. A store that cannot show purchases to support its sales has a problem regardless of what its baskets say (Figure 12).

```guest-html
<figure class="fig" id="fig-06-inventory-reconciliation">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 12</span><h4>Sales need supply</h4><p class="g-dek">EBT sales of a product cannot outrun what suppliers delivered, so a growing gap points to fake or inflated baskets.</p></div>
  <div class="fig-body">

    <div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:flex-start">
      <div style="flex:2 1 420px;min-width:0">
        <svg viewBox="0 0 700 310" role="img" aria-label="Illustrative store, eggs: EBT sales climb from 60 to 400 cartons a month while supplier deliveries stay at 50, so the unexplained gap grows to 350 cartons."><text x="30" y="22" class="g-f-muted" font-size="11">cartons of eggs per month</text><line x1="70" x2="580" y1="270" y2="270" class="g-s-rule" stroke-width="1"></line><text x="60" y="274" class="g-f-muted g-mono" font-size="11" text-anchor="end">0</text><line x1="70" x2="580" y1="212.5" y2="212.5" class="g-s-rule" stroke-width="1"></line><text x="60" y="216.5" class="g-f-muted g-mono" font-size="11" text-anchor="end">100</text><line x1="70" x2="580" y1="155" y2="155" class="g-s-rule" stroke-width="1"></line><text x="60" y="159" class="g-f-muted g-mono" font-size="11" text-anchor="end">200</text><line x1="70" x2="580" y1="97.5" y2="97.5" class="g-s-rule" stroke-width="1"></line><text x="60" y="101.5" class="g-f-muted g-mono" font-size="11" text-anchor="end">300</text><line x1="70" x2="580" y1="40.00000000000003" y2="40.00000000000003" class="g-s-rule" stroke-width="1"></line><text x="60" y="44" class="g-f-muted g-mono" font-size="11" text-anchor="end">400</text><polygon points="80,235.5 176,206.8 272,166.5 368,126.3 464,86 560,40 560,241.3 464,241.3 368,241.3 272,241.3 176,241.3 80,241.3" class="g-f-fraud-tint"></polygon><polyline points="80,241.3 176,241.3 272,241.3 368,241.3 464,241.3 560,241.3" fill="none" class="g-s-defense" stroke-width="2.5"></polyline><polyline points="80,235.5 176,206.8 272,166.5 368,126.3 464,86 560,40" fill="none" class="g-s-fraud" stroke-width="2.5"></polyline><circle cx="80" cy="241.3" r="3.5" class="g-f-defense"></circle><circle cx="80" cy="235.5" r="3.5" class="g-f-fraud"></circle><text x="80" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 1</text><circle cx="176" cy="241.3" r="3.5" class="g-f-defense"></circle><circle cx="176" cy="206.8" r="3.5" class="g-f-fraud"></circle><text x="176" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 2</text><circle cx="272" cy="241.3" r="3.5" class="g-f-defense"></circle><circle cx="272" cy="166.5" r="3.5" class="g-f-fraud"></circle><text x="272" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 3</text><circle cx="368" cy="241.3" r="3.5" class="g-f-defense"></circle><circle cx="368" cy="126.3" r="3.5" class="g-f-fraud"></circle><text x="368" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 4</text><circle cx="464" cy="241.3" r="3.5" class="g-f-defense"></circle><circle cx="464" cy="86" r="3.5" class="g-f-fraud"></circle><text x="464" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 5</text><circle cx="560" cy="241.3" r="5.5" class="g-f-defense"></circle><circle cx="560" cy="40" r="11" class="g-f-fraud" fill-opacity="0.18"></circle><circle cx="560" cy="40" r="5.5" class="g-f-fraud"></circle><text x="560" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">Month 6</text><text x="578" y="45" class="g-f-fraud g-mono" font-size="15" font-weight="600">400</text><text x="578" y="61" class="g-f-ink" font-size="11">EBT units sold</text><text x="578" y="238.3" class="g-f-defense g-mono" font-size="15" font-weight="600">50</text><text x="578" y="254.3" class="g-f-ink" font-size="11">delivered by</text><text x="578" y="268.3" class="g-f-ink" font-size="11">suppliers</text><line x1="580" x2="580" y1="70" y2="219.3" class="g-s-fraud" stroke-width="1.5" stroke-dasharray="3 3"></line><text x="468" y="190" class="g-f-fraud" font-size="13" font-weight="700" text-anchor="middle">Gap: 350 cartons</text><text x="468" y="206" class="g-f-fraud" font-size="11" text-anchor="middle">sold with no supply behind them</text></svg>
        <p style="margin:0.5rem 0 0;font-size:0.85rem;color:var(--muted)"><span class="g-chip g-chip--caution">Illustrative</span> Month 6 matches the report's example: 400 sold, 50 delivered. Months 1 to 5 are invented to show the trend.</p>
      </div>
      <div style="flex:1 1 240px;display:flex;flex-direction:column;gap:0.75rem">
        <div class="g-node g-node--defense"><h5 class="g-t-defense">The check</h5><p>EBT sales per product category against the store's wholesale purchases of that category, from supplier invoices and distributor feeds.</p></div>
        <div class="g-node g-node--caution"><h5 class="g-t-caution">Caveat: cash buys</h5><p>A store can buy stock for cash at a wholesale club. That leaves no record in a distributor feed. So authorization requires:</p>
          <p><span class="num g-t-caution">1</span> purchase records, kept and submitted on request<br><span class="num g-t-caution">2</span> random audits of a sample of stores each year<br><span class="num g-t-caution">3</span> targeted audits of high scorers</p></div>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> the red band is EBT sales with no recorded supply behind them. A store that cannot show purchases to support its sales has a problem, whatever its baskets look like.</figcaption>
</figure>
```

**Network and graph analysis.** Build a graph with cards and stores as nodes and transactions as edges. Trafficking rings leave clusters: groups of cards that all visit the same few suspicious stores, often traveling past closer and larger stores to do so. A single-transaction rule sees a normal-looking \$60 sale. The graph sees 200 cards that spend nearly all their benefits at three small stores owned by related parties. Community detection, shared-owner links from authorization records, and shared bank accounts on payout records together reveal rings that no store-level score would. The same graph helps on the recipient side: a card that appears in many confirmed trafficking cases is a candidate for a state investigation with evidence beyond a single transaction pattern (Figure 13).

```guest-html
<figure class="fig" id="fig-06-ring-detection">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 13</span><h4>The graph sees what one sale hides</h4><p class="g-dek">With cards and stores as nodes and sales as edges, a ring shows up as a closed cluster of cards around a few stores.</p></div>
  <div class="fig-body">

    <svg viewBox="0 0 690 420" role="img" aria-label="Network of EBT cards and stores. Most cards spread their spending across many stores. One closed cluster of 13 cards spends only at the same three small stores, which share owners, while skipping a larger store nearby: a trafficking ring."><text x="20" y="22" class="g-f-ink" font-size="12" font-weight="700">Normal shopping: each card spreads across many stores</text><ellipse cx="563" cy="212" rx="112" ry="104" class="g-f-fraud-tint g-s-fraud" stroke-width="1.5" stroke-dasharray="5 4"></ellipse><text x="563" y="338" class="g-f-fraud" font-size="12" font-weight="700" text-anchor="middle">Ring cluster: 13 cards, 3 stores</text><text x="563" y="354" class="g-f-fraud" font-size="11" text-anchor="middle">no edge leaves the cluster</text><line x1="45" y1="60" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="45" y1="60" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="45" y1="60" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="150" y1="45" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="150" y1="45" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="150" y1="45" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="55" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="55" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="55" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="395" y1="60" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="395" y1="60" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="395" y1="60" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="60" y1="160" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="60" y1="160" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="60" y1="160" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="170" y1="140" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="170" y1="140" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="170" y1="140" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="290" y1="165" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="290" y1="165" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="290" y1="165" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="200" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="200" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="200" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="190" y1="300" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="190" y1="300" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="190" y1="300" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="330" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="330" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="330" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="100" y1="200" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="100" y1="200" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="100" y1="200" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="320" y1="350" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="320" y1="350" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="320" y1="350" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="230" y1="355" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="230" y1="355" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="230" y1="355" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="245" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="245" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="245" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="360" x2="360" y2="295" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="360" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="360" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="160" y1="230" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="160" y1="230" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="160" y1="230" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="260" x2="120" y2="255" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="260" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="50" y1="260" x2="250" y2="215" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="215" y1="115" x2="225" y2="70" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="215" y1="115" x2="90" y2="95" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="215" y1="115" x2="345" y2="120" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="395" y1="60" x2="440" y2="62" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="400" y1="200" x2="440" y2="62" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="300" y1="55" x2="440" y2="62" class="g-s-muted" stroke-opacity="0.35" stroke-width="1"></line><line x1="637.5" y1="233.2" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="637.5" y1="233.2" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="625.4" y1="269.1" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="625.4" y1="269.1" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="625.4" y1="269.1" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="592.3" y1="298" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="592.3" y1="298" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="592.3" y1="298" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="549.1" y1="282.6" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="549.1" y1="282.6" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="549.1" y1="282.6" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="508.9" y1="275.8" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="508.9" y1="275.8" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="473.7" y1="249.2" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="473.7" y1="249.2" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="473.7" y1="249.2" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="485.1" y1="207.8" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="485.1" y1="207.8" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="485.1" y1="207.8" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="487.6" y1="170.3" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="487.6" y1="170.3" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="487.6" y1="170.3" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="512.1" y1="134.9" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="512.1" y1="134.9" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="558.1" y1="140.4" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="558.1" y1="140.4" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="558.1" y1="140.4" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="598.9" y1="138.1" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="598.9" y1="138.1" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="598.9" y1="138.1" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="640" y1="156.2" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="640" y1="156.2" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="640" y1="156.2" x2="570" y2="262" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="639.7" y1="198.9" x2="525" y2="195" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><line x1="639.7" y1="198.9" x2="605" y2="178" class="g-s-fraud" stroke-opacity="0.45" stroke-width="1"></line><path d="M525,195 L605,178 L570,262 Z" fill="none" class="g-s-fraud" stroke-width="2" stroke-dasharray="4 3"></path><circle cx="45" cy="60" r="5" class="g-f-defense"></circle><circle cx="150" cy="45" r="5" class="g-f-defense"></circle><circle cx="300" cy="55" r="5" class="g-f-defense"></circle><circle cx="395" cy="60" r="5" class="g-f-defense"></circle><circle cx="60" cy="160" r="5" class="g-f-defense"></circle><circle cx="170" cy="140" r="5" class="g-f-defense"></circle><circle cx="290" cy="165" r="5" class="g-f-defense"></circle><circle cx="400" cy="200" r="5" class="g-f-defense"></circle><circle cx="190" cy="300" r="5" class="g-f-defense"></circle><circle cx="50" cy="330" r="5" class="g-f-defense"></circle><circle cx="100" cy="200" r="5" class="g-f-defense"></circle><circle cx="320" cy="350" r="5" class="g-f-defense"></circle><circle cx="230" cy="355" r="5" class="g-f-defense"></circle><circle cx="300" cy="245" r="5" class="g-f-defense"></circle><circle cx="400" cy="360" r="5" class="g-f-defense"></circle><circle cx="160" cy="230" r="5" class="g-f-defense"></circle><circle cx="50" cy="260" r="5" class="g-f-defense"></circle><circle cx="215" cy="115" r="5" class="g-f-defense"></circle><circle cx="637.5" cy="233.2" r="5" class="g-f-fraud"></circle><circle cx="625.4" cy="269.1" r="5" class="g-f-fraud"></circle><circle cx="592.3" cy="298" r="5" class="g-f-fraud"></circle><circle cx="549.1" cy="282.6" r="5" class="g-f-fraud"></circle><circle cx="508.9" cy="275.8" r="5" class="g-f-fraud"></circle><circle cx="473.7" cy="249.2" r="5" class="g-f-fraud"></circle><circle cx="485.1" cy="207.8" r="5" class="g-f-fraud"></circle><circle cx="487.6" cy="170.3" r="5" class="g-f-fraud"></circle><circle cx="512.1" cy="134.9" r="5" class="g-f-fraud"></circle><circle cx="558.1" cy="140.4" r="5" class="g-f-fraud"></circle><circle cx="598.9" cy="138.1" r="5" class="g-f-fraud"></circle><circle cx="640" cy="156.2" r="5" class="g-f-fraud"></circle><circle cx="639.7" cy="198.9" r="5" class="g-f-fraud"></circle><rect x="81" y="86" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="216" y="61" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="336" y="111" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="111" y="246" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="241" y="206" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="351" y="286" width="18" height="18" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><rect x="426" y="48" width="28" height="28" rx="3" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><text x="462" y="60" class="g-f-muted" font-size="11">larger store nearby,</text><text x="462" y="74" class="g-f-muted" font-size="11">ring cards skip it</text><rect x="517" y="187" width="16" height="16" rx="2" class="g-f-fraud"></rect><rect x="597" y="170" width="16" height="16" rx="2" class="g-f-fraud"></rect><rect x="562" y="254" width="16" height="16" rx="2" class="g-f-fraud"></rect><line x1="20" x2="676" y1="378" y2="378" class="g-s-rule" stroke-width="1"></line><circle cx="28" cy="396" r="5" class="g-f-defense"></circle><text x="40" y="400" class="g-f-muted" font-size="11">EBT card</text><rect x="108" y="388" width="14" height="14" rx="2" class="g-f-neutral-tint g-s-muted" stroke-width="1.5"></rect><text x="130" y="400" class="g-f-muted" font-size="11">store</text><line x1="176" x2="202" y1="396" y2="396" class="g-s-muted" stroke-width="1.5"></line><text x="208" y="400" class="g-f-muted" font-size="11">card shopped at store</text><circle cx="346" cy="396" r="5" class="g-f-fraud"></circle><rect x="356" y="389" width="13" height="13" rx="2" class="g-f-fraud"></rect><text x="376" y="400" class="g-f-muted" font-size="11">ring card, ring store</text><line x1="502" x2="528" y1="396" y2="396" class="g-s-fraud" stroke-width="2" stroke-dasharray="4 3"></line><text x="534" y="400" class="g-f-muted" font-size="11">shared owner or bank</text></svg>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:0.75rem;margin-top:1rem">
      <div class="g-node g-node--muted"><h5>Single-transaction rule</h5><p>Sees one <span class="num">&#36;60</span> sale at a licensed store. Normal amount, normal store. It passes.</p></div>
      <div class="g-node g-node--fraud"><h5 class="g-t-fraud">Graph view</h5><p>Report example: <span class="num">200</span> cards spend nearly all their benefits at three small stores owned by related parties, often passing closer and larger stores.</p></div>
      <div class="g-node g-node--defense"><h5 class="g-t-defense">Signals that expose a ring</h5><p style="display:flex;flex-wrap:wrap;gap:0.35rem"><span class="g-chip g-chip--defense">community detection</span><span class="g-chip g-chip--defense">shared owners</span><span class="g-chip g-chip--defense">shared bank accounts</span></p><p>Owners come from authorization records, bank accounts from payout records.</p></div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> each ring sale looks normal alone. The evidence is the shape: many cards that shop only at the same three linked stores. The graph shows a sample; the report's example ring has 200 cards.</figcaption>
</figure>
```

**Feedback.** Every closed case, whether confirmed or cleared, becomes a labeled example. The scoring models retrain on these labels. Cleared cases matter as much as confirmed ones, because they teach the models which patterns are benign, such as round prices at a store that prices in whole dollars.

## 7\. Price anomaly detection without human basket review

Item-level data creates a new problem: volume. Retailers process millions of SNAP transactions per day. No program can afford a person to look at baskets. The design question is how to turn that volume into a short list of stores worth a human’s time, so that operating cost grows with investigator headcount while transaction volume affects only computing cost. Figure A8 in Appendix A shows the monthly scoring run as a sequence.

### 7.1 Reference prices

The system builds a reference price for each barcode in each region from all stores’ basket data. For a given barcode and region in a given month, the reference is a robust central value of observed prices, such as the median, with a spread measure such as the interquartile range. Separate references for store classes (supermarket, convenience store, small grocery) reflect the fact that convenience stores charge more for the same item. Products with few observations borrow strength from related products in the same category and from neighboring regions (Figure 14).

```guest-html
<figure class="fig" id="fig-07-reference-price">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 14</span><h4>Score the store, not the basket</h4><p class="g-dek">Each barcode gets a regional reference price, and a store whose lines sit far above it month after month is the signal.</p></div>
  <div class="fig-body">

    <div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.75rem;margin-bottom:0.4rem"><span class="g-eyebrow">A. One barcode, one region</span><span style="font-size:0.85rem;color:var(--muted)">A gallon of milk, one month, one store class</span><span class="g-chip g-chip--caution">Illustrative</span></div>
    <svg viewBox="0 0 680 206" role="img" aria-label="Illustrative dot strip: 22 stores price a gallon of milk between &#36;3.62 and &#36;4.39 around a &#36;4.00 regional reference. Store X charges &#36;5.60, 40% above reference."><line x1="84.2" x2="84.2" y1="40" y2="160" class="g-s-rule" stroke-width="1"></line><text x="84.2" y="182" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;3.50</text><line x1="205" x2="205" y1="40" y2="160" class="g-s-rule" stroke-width="1"></line><text x="205" y="182" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;4.00</text><line x1="325.8" x2="325.8" y1="40" y2="160" class="g-s-rule" stroke-width="1"></line><text x="325.8" y="182" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;4.50</text><line x1="446.7" x2="446.7" y1="40" y2="160" class="g-s-rule" stroke-width="1"></line><text x="446.7" y="182" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;5.00</text><line x1="567.5" x2="567.5" y1="40" y2="160" class="g-s-rule" stroke-width="1"></line><text x="567.5" y="182" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;5.50</text><rect x="156.7" y="44" width="96.7" height="112" class="g-f-defense-tint"></rect><line x1="205" x2="205" y1="34" y2="160" class="g-s-defense" stroke-width="2"></line><text x="205" y="26" class="g-f-defense" font-size="12" font-weight="700" text-anchor="middle">reference &#36;4.00 (median)</text><line x1="60" x2="640" y1="160" y2="160" class="g-s-muted" stroke-width="1"></line><text x="150.7" y="152" class="g-f-defense" font-size="11" text-anchor="end">middle half</text><text x="150.7" y="140" class="g-f-defense g-mono" font-size="11" text-anchor="end">&#36;3.80 to &#36;4.20</text><circle cx="113.2" cy="96" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="134.9" cy="70" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="151.8" cy="112" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="161.5" cy="84" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="168.8" cy="128" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="176" cy="104" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="180.8" cy="66" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="188.1" cy="120" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="192.9" cy="90" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="197.8" cy="136" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="202.6" cy="76" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="205" cy="108" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="209.8" cy="128" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="214.7" cy="94" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="219.5" cy="70" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="226.8" cy="116" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="234" cy="84" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="241.3" cy="134" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="250.9" cy="100" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="263" cy="116" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="279.9" cy="128" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><circle cx="299.3" cy="106" r="5.5" class="g-f-defense" fill-opacity="0.7"></circle><line x1="253.3" x2="579.7" y1="80" y2="80" class="g-s-fraud" stroke-width="1.5" stroke-dasharray="4 3"></line><text x="442.5" y="72" class="g-f-fraud" font-size="12" text-anchor="middle">excess over range: &#36;1.40 per gallon</text><circle cx="591.7" cy="80" r="12" class="g-f-fraud" fill-opacity="0.18"></circle><circle cx="591.7" cy="80" r="6.5" class="g-f-fraud"></circle><text x="591.7" y="110" class="g-f-fraud" font-size="12" font-weight="700" text-anchor="middle">Store X: &#36;5.60</text><text x="591.7" y="126" class="g-f-fraud" font-size="11" text-anchor="middle">40% above reference</text><text x="350" y="198" class="g-f-muted" font-size="11" text-anchor="middle">price paid per gallon, one dot per store</text></svg>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:1.25rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--rule)">
      <div class="g-node g-node--muted"><span class="g-eyebrow">B1. Noise</span><h5>One odd basket means little</h5><svg viewBox="0 0 320 200" role="img" aria-label="Illustrative basket: five items sit near the reference price and one line sits 40% above it. One odd line is noise."><line x1="44" x2="308" y1="150" y2="150" class="g-s-rule" stroke-width="1"></line><text x="38" y="154" class="g-f-muted g-mono" font-size="11" text-anchor="end">-10%</text><line x1="44" x2="308" y1="130" y2="130" class="g-s-muted" stroke-width="1"></line><text x="38" y="134" class="g-f-muted g-mono" font-size="11" text-anchor="end">0%</text><line x1="44" x2="308" y1="90" y2="90" class="g-s-rule" stroke-width="1"></line><text x="38" y="94" class="g-f-muted g-mono" font-size="11" text-anchor="end">+20%</text><line x1="44" x2="308" y1="50" y2="50" class="g-s-rule" stroke-width="1"></line><text x="38" y="54" class="g-f-muted g-mono" font-size="11" text-anchor="end">+40%</text><rect x="56.7" y="124" width="26" height="6" rx="1.5" class="g-f-muted"></rect><text x="69.7" y="166" class="g-f-muted" font-size="11" text-anchor="middle">milk</text><rect x="100" y="130" width="26" height="8" rx="1.5" class="g-f-muted"></rect><text x="113" y="166" class="g-f-muted" font-size="11" text-anchor="middle">bread</text><rect x="143.3" y="126" width="26" height="4" rx="1.5" class="g-f-muted"></rect><text x="156.3" y="166" class="g-f-muted" font-size="11" text-anchor="middle">rice</text><rect x="186.7" y="50" width="26" height="80" rx="1.5" class="g-f-caution"></rect><text x="199.7" y="166" class="g-f-muted" font-size="11" text-anchor="middle">cereal</text><rect x="230" y="130" width="26" height="4" rx="1.5" class="g-f-muted"></rect><text x="243" y="166" class="g-f-muted" font-size="11" text-anchor="middle">beans</text><rect x="273.3" y="120" width="26" height="10" rx="1.5" class="g-f-muted"></rect><text x="286.3" y="166" class="g-f-muted" font-size="11" text-anchor="middle">eggs</text><text x="199.6" y="42" class="g-f-caution g-mono" font-size="12" font-weight="600" text-anchor="middle">+40%</text><text x="176" y="190" class="g-f-muted" font-size="11" text-anchor="middle">one odd line in one basket</text></svg><p>A promotion, a slow item priced high, or a mis-keyed price. Scoring each basket floods the system with noise.</p></div>
      <div class="g-node g-node--fraud"><span class="g-eyebrow g-t-fraud">B2. Signal</span><h5 class="g-t-fraud">A store-month pattern</h5><svg viewBox="0 0 320 200" role="img" aria-label="Illustrative store-month: 14 of 16 item lines sit about 40% above reference. A consistent pattern is the signal."><line x1="44" x2="308" y1="150" y2="150" class="g-s-rule" stroke-width="1"></line><text x="38" y="154" class="g-f-muted g-mono" font-size="11" text-anchor="end">-10%</text><line x1="44" x2="308" y1="130" y2="130" class="g-s-muted" stroke-width="1"></line><text x="38" y="134" class="g-f-muted g-mono" font-size="11" text-anchor="end">0%</text><line x1="44" x2="308" y1="90" y2="90" class="g-s-rule" stroke-width="1"></line><text x="38" y="94" class="g-f-muted g-mono" font-size="11" text-anchor="end">+20%</text><line x1="44" x2="308" y1="50" y2="50" class="g-s-rule" stroke-width="1"></line><text x="38" y="54" class="g-f-muted g-mono" font-size="11" text-anchor="end">+40%</text><line x1="44" x2="308" y1="50" y2="50" class="g-s-fraud" stroke-width="1.5" stroke-dasharray="4 3"></line><rect x="51.1" y="46" width="10.1" height="84" rx="1.5" class="g-f-fraud"></rect><rect x="67.3" y="54" width="10.1" height="76" rx="1.5" class="g-f-fraud"></rect><rect x="83.6" y="40" width="10.1" height="90" rx="1.5" class="g-f-fraud"></rect><rect x="99.8" y="50" width="10.1" height="80" rx="1.5" class="g-f-fraud"></rect><rect x="116.1" y="124" width="10.1" height="6" rx="1.5" class="g-f-fraud"></rect><rect x="132.3" y="48" width="10.1" height="82" rx="1.5" class="g-f-fraud"></rect><rect x="148.6" y="56" width="10.1" height="74" rx="1.5" class="g-f-fraud"></rect><rect x="164.8" y="42" width="10.1" height="88" rx="1.5" class="g-f-fraud"></rect><rect x="181.1" y="52" width="10.1" height="78" rx="1.5" class="g-f-fraud"></rect><rect x="197.3" y="44" width="10.1" height="86" rx="1.5" class="g-f-fraud"></rect><rect x="213.6" y="130" width="10.1" height="4" rx="1.5" class="g-f-fraud"></rect><rect x="229.8" y="50" width="10.1" height="80" rx="1.5" class="g-f-fraud"></rect><rect x="246.1" y="58" width="10.1" height="72" rx="1.5" class="g-f-fraud"></rect><rect x="262.3" y="38" width="10.1" height="92" rx="1.5" class="g-f-fraud"></rect><rect x="278.6" y="48" width="10.1" height="82" rx="1.5" class="g-f-fraud"></rect><rect x="294.8" y="54" width="10.1" height="76" rx="1.5" class="g-f-fraud"></rect><text x="308" y="24" class="g-f-fraud g-mono" font-size="12" font-weight="600" text-anchor="end">+40%</text><text x="176" y="166" class="g-f-muted" font-size="11" text-anchor="middle">16 item lines across the month</text><text x="176" y="190" class="g-f-fraud" font-size="11" text-anchor="middle">14 of 16 sit about 40% above</text></svg><p>Most of the store's lines sit about 40% above reference for a whole month. Shrinkage keeps small stores from extreme scores.</p></div>
    </div>
    <p style="margin:0.9rem 0 0;font-size:0.85rem;color:var(--muted)">Bars show price vs reference, where 0 is the reference price. The reference uses the median and the middle half of all stores' prices, set per store class; rare products borrow from related products and neighboring regions.</p>
  </div>
  <figcaption><strong>Read it as:</strong> Store X's single &#36;5.60 price is one dot. What matters is panel B2: the same store high on most lines all month.</figcaption>
</figure>
```

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

```guest-html
<figure class="fig" id="fig-07-review-funnel">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 15</span><h4>The review funnel</h4><p class="g-dek">Software shrinks millions of daily baskets to a short list, and people see only the top N stores the budget can cover.</p></div>
  <div class="fig-body">

    <div class="g-fn">
      <div class="g-fn-zone"><span class="g-chip g-chip--defense">software, no person</span></div>
      <ol class="g-fn-stages">
      <li class="g-fn-stage" style="--w:100%">
        <span class="g-fn-n num">01</span>
        <div class="g-fn-txt"><h5>Every basket</h5><p>Item-level EBT data from every store. Volume drives computing cost only.</p></div>
        <span class="g-chip g-chip--defense g-fn-vol">millions / day</span>
        <span class="g-fn-bar" style="--v:100%" aria-hidden="true"></span>
      </li>
      <li class="g-fn-stage" style="--w:90%">
        <span class="g-fn-n num">02</span>
        <div class="g-fn-txt"><h5>Item price vs reference price</h5><p>Each line checked against the regional reference for its barcode and store class.</p></div>
        <span class="g-chip g-chip--defense g-fn-vol">every line</span>
        <span class="g-fn-bar" style="--v:100%" aria-hidden="true"></span>
      </li>
      <li class="g-fn-stage" style="--w:78%">
        <span class="g-fn-n num">03</span>
        <div class="g-fn-txt"><h5>Store-month scores</h5><p>Excess price share, lines above range, basket plausibility, supply consistency.</p></div>
        <span class="g-chip g-chip--defense g-fn-vol">1 per store / month</span>
        <span class="g-fn-bar" style="--v:22%" aria-hidden="true"></span>
      </li>
      <li class="g-fn-stage" style="--w:66%">
        <span class="g-fn-n num">04</span>
        <div class="g-fn-txt"><h5>Ranked by expected loss</h5><p>Highest expected loss first, not highest sales.</p></div>
        <span class="g-chip g-chip--defense g-fn-vol">probability x excess &#36;</span>
        <span class="g-fn-bar" style="--v:22%" aria-hidden="true"></span>
      </li>
      </ol>
      <div class="g-fn-fork" aria-hidden="true">
        <svg viewBox="0 0 400 34" preserveAspectRatio="none"><path d="M200 0 V12 M200 12 H100 V34 M200 12 H300 V34" fill="none" class="g-s-muted" stroke-width="1.5" vector-effect="non-scaling-stroke"></path></svg>
      </div>
      <div class="g-fn-split">
        <div class="g-node g-node--defense g-fn-out">
          <span class="g-fn-n num">05a</span>
          <h5 class="g-t-defense">Automatic actions</h5>
          <p><span class="g-chip g-chip--defense">most stores above normal</span></p>
          <p class="g-fn-chips"><span class="g-chip">warning letter</span><span class="g-chip">payout delay</span><span class="g-chip">volume cap</span></p>
          <p>Reversible, no investigator time. Scores keep updating; a store that keeps rising enters the queue.</p>
        </div>
        <div class="g-node g-node--fraud g-fn-out">
          <span class="g-fn-n num">05b</span>
          <h5 class="g-t-fraud">Top N stores to investigators</h5>
          <p><span class="g-chip g-chip--fraud">N set by budget</span></p>
          <p class="g-fn-person">A person reviews a case only when its expected benefit tops the cost of one review.</p>
        </div>
      </div>
      <div class="g-fn-loop">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 17 V9 a4 4 0 0 1 4 -4 H19" fill="none" class="g-s-defense" stroke-width="2"></path><path d="M15 1.5 L19.5 5 L15 8.5" fill="none" class="g-s-defense" stroke-width="2"></path></svg>
        <p><strong>Feedback to step 03.</strong> Every closed case, confirmed or cleared, becomes a label. The scoring model retrains on both, so it learns which patterns are benign.</p>
      </div>
      <div class="g-fn-costs">
        <div><span class="g-eyebrow">Computing cost</span><p>grows with transaction volume, and stays small</p></div>
        <div><span class="g-eyebrow">Human cost</span><p>grows with investigator headcount, which the budget fixes first</p></div>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> every step above the fork runs in software, so more baskets cost only computing. People enter at one point, the top N, and the budget sets N.</figcaption>
</figure>
```

The automated tier handles most stores that score above normal. A warning letter tells a store its prices sit well above its peers and invites an explanation. A payout delay or volume cap limits exposure without accusing anyone. These actions are reversible and need no investigator time. They also deter: a store that knows the system watches its prices has less reason to inflate them.

### 7.4 Cost model

Human cost in this design scales with the number of investigators. Transaction volume drives only computing cost, which is small. That property follows from three rules.

First, set the investigator budget first. The program decides how many investigator hours it can fund in a period. That number fixes N, the count of cases the queue can absorb.

Second, review only what the budget covers. The queue takes the top N stores by expected loss. Stores below the cutoff stay in the automated tier, where their scores keep updating. A store that keeps rising will eventually enter the queue.

Third, review a case only when the expected benefit exceeds the review cost. Even within budget, a case with low expected loss should not consume a review. The test is:

expected loss x share prevented or recovered by action > cost of one review

The share prevented or recovered reflects that a review does not recover every dollar. It may end future losses through disqualification, recover part of past losses, and deter others.

**Worked example (illustrative numbers only).** These figures are invented to show the method. They are not estimates of real store behavior or real investigation costs. Assume a review costs \$6,000 in investigator time, and a confirmed case prevents or recovers half of the expected annual loss.

```guest-html
<table>
<colgroup>
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
<col style="width:12%">
</colgroup>
<thead>
<tr>
<th>Store</th>
<th>Monthly EBT sales</th>
<th>Estimated excess share</th>
<th>Excess dollars per year</th>
<th>Probability of fraud</th>
<th>Expected loss per year</th>
<th>Expected benefit of review (50%)</th>
<th>Review?</th>
</tr>
</thead>
<tbody>
<tr>
<td>A</td>
<td>&#36;60,000</td>
<td>30%</td>
<td>&#36;216,000</td>
<td>0.8</td>
<td>&#36;172,800</td>
<td>&#36;86,400</td>
<td>Yes, rank 1</td>
</tr>
<tr>
<td>B</td>
<td>&#36;25,000</td>
<td>40%</td>
<td>&#36;120,000</td>
<td>0.6</td>
<td>&#36;72,000</td>
<td>&#36;36,000</td>
<td>Yes, rank 2</td>
</tr>
<tr>
<td>C</td>
<td>&#36;120,000</td>
<td>5%</td>
<td>&#36;72,000</td>
<td>0.3</td>
<td>&#36;21,600</td>
<td>&#36;10,800</td>
<td>Passes threshold; budget decides</td>
</tr>
<tr>
<td>D</td>
<td>&#36;15,000</td>
<td>20%</td>
<td>&#36;36,000</td>
<td>0.4</td>
<td>&#36;14,400</td>
<td>&#36;7,200</td>
<td>Passes threshold; budget decides</td>
</tr>
<tr>
<td>E</td>
<td>&#36;8,000</td>
<td>10%</td>
<td>&#36;9,600</td>
<td>0.2</td>
<td>&#36;1,920</td>
<td>&#36;960</td>
<td>No; automated tier only</td>
</tr>
</tbody>
</table>
```

Excess dollars per year equal monthly sales times excess share times 12\. For Store A: \$60,000 x 0.30 x 12 = \$216,000, and \$216,000 x 0.8 = \$172,800.

Store E fails the threshold: a \$6,000 review to protect \$960 is a loss. It receives a warning letter and stays under watch. Stores A through D all pass. If the budget covers two reviews this cycle, A and B go to investigators. C and D receive payout delays and volume caps, and they remain at the top of next month’s list. Note that Store C has the largest sales but a low excess share and a low probability. Ranking by sales volume alone, a common heuristic, would have sent the wrong store first (Figure 16).

```guest-html
<figure class="fig" id="fig-07-expected-loss-ranking">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 16</span><h4>Rank stores by expected loss</h4><p class="g-dek">Review cost sets the break-even line, and the budget sets how many stores above it get a person.</p></div>
  <div class="fig-body">

    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;margin-bottom:0.75rem;font-size:0.88rem"><span class="g-chip g-chip--caution">Illustrative, Section 7.3</span><span>Review if <span class="num">expected loss x 50% recovered &gt; &#36;6,000</span> per review, so expected loss must top <span class="num">&#36;12,000</span>.</span></div>
    <svg viewBox="0 0 680 320" role="img" aria-label="Illustrative stores ranked by expected loss: A &#36;172,800 and B &#36;72,000 go to human review; C &#36;21,600 and D &#36;14,400 pass the &#36;12,000 break-even but fall outside a budget of two reviews; E &#36;1,920 is below break-even."><rect x="0" y="38" width="680" height="88" rx="6" class="g-f-fraud-tint"></rect><text x="670" y="110" class="g-f-fraud" font-size="12" font-weight="700" text-anchor="end">human review</text><rect x="0" y="140" width="680" height="88" rx="6" class="g-f-defense-tint"></rect><text x="670" y="212" class="g-f-defense" font-size="12" font-weight="700" text-anchor="end">automatic actions</text><rect x="0" y="228" width="680" height="44" rx="6" class="g-f-neutral-tint"></rect><text x="670" y="256" class="g-f-muted" font-size="12" font-weight="700" text-anchor="end">no human review</text><line x1="170" x2="170" y1="34" y2="274" class="g-s-rule" stroke-width="1"></line><text x="170" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;0</text><line x1="292.2" x2="292.2" y1="34" y2="274" class="g-s-rule" stroke-width="1"></line><text x="292.2" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;50k</text><line x1="414.4" x2="414.4" y1="34" y2="274" class="g-s-rule" stroke-width="1"></line><text x="414.4" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;100k</text><line x1="536.7" x2="536.7" y1="34" y2="274" class="g-s-rule" stroke-width="1"></line><text x="536.7" y="292" class="g-f-muted g-mono" font-size="11" text-anchor="middle">&#36;150k</text><text x="12" y="66" class="g-f-ink" font-size="16" font-weight="800">A</text><text x="34" y="59" class="g-f-muted g-mono" font-size="11">&#36;60k x 30%</text><text x="34" y="73" class="g-f-muted g-mono" font-size="11">p = 0.8</text><rect x="170" y="49" width="422.4" height="22" rx="2" class="g-f-fraud"></rect><text x="598.4" y="65" class="g-f-ink g-mono" font-size="12" font-weight="600">&#36;172,800</text><text x="12" y="110" class="g-f-ink" font-size="16" font-weight="800">B</text><text x="34" y="103" class="g-f-muted g-mono" font-size="11">&#36;25k x 40%</text><text x="34" y="117" class="g-f-muted g-mono" font-size="11">p = 0.6</text><rect x="170" y="93" width="176" height="22" rx="2" class="g-f-fraud"></rect><text x="352" y="109" class="g-f-ink g-mono" font-size="12" font-weight="600">&#36;72,000</text><text x="12" y="168" class="g-f-ink" font-size="16" font-weight="800">C</text><text x="34" y="161" class="g-f-muted g-mono" font-size="11">&#36;120k x 5%</text><text x="34" y="175" class="g-f-muted g-mono" font-size="11">p = 0.3</text><rect x="170" y="151" width="52.8" height="22" rx="2" class="g-f-defense"></rect><text x="228.8" y="167" class="g-f-ink g-mono" font-size="12" font-weight="600">&#36;21,600</text><text x="12" y="212" class="g-f-ink" font-size="16" font-weight="800">D</text><text x="34" y="205" class="g-f-muted g-mono" font-size="11">&#36;15k x 20%</text><text x="34" y="219" class="g-f-muted g-mono" font-size="11">p = 0.4</text><rect x="170" y="195" width="35.2" height="22" rx="2" class="g-f-defense"></rect><text x="211.2" y="211" class="g-f-ink g-mono" font-size="12" font-weight="600">&#36;14,400</text><text x="12" y="256" class="g-f-ink" font-size="16" font-weight="800">E</text><text x="34" y="249" class="g-f-muted g-mono" font-size="11">&#36;8k x 10%</text><text x="34" y="263" class="g-f-muted g-mono" font-size="11">p = 0.2</text><rect x="170" y="239" width="4.7" height="22" rx="2" class="g-f-muted"></rect><text x="180.7" y="255" class="g-f-ink g-mono" font-size="12" font-weight="600">&#36;1,920</text><line x1="199.3" x2="199.3" y1="20" y2="274" class="g-s-ink" stroke-width="1.5" stroke-dasharray="5 3"></line><text x="204.3" y="18" class="g-f-ink" font-size="11" font-weight="700">break-even &#36;12,000</text><line x1="0" x2="680" y1="134" y2="134" class="g-s-fraud" stroke-width="1.5"></line><text x="670" y="129" class="g-f-fraud" font-size="11" font-weight="700" text-anchor="end">budget cutoff: N = 2 reviews</text><text x="390" y="310" class="g-f-muted" font-size="11" text-anchor="middle">expected loss per year = probability of fraud x excess dollars per year</text></svg>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:0.75rem;margin-top:1rem">
      <div class="g-node g-node--fraud"><h5 class="g-t-fraud">Human review: A, B</h5><p>Above break-even and inside a budget of two reviews.</p></div>
      <div class="g-node g-node--defense"><h5 class="g-t-defense">Automatic actions: C, D</h5><p>Pass the threshold, fall outside budget. Payout delays and volume caps; they top next month's list.</p></div>
      <div class="g-node g-node--muted"><h5>No human review: E</h5><p>A <span class="num">&#36;6,000</span> review to protect <span class="num">&#36;960</span> is a loss. Warning letter, stays under watch.</p></div>
      <div class="g-node g-node--caution"><h5 class="g-t-caution">Sales volume misleads</h5><p>Store C has the largest sales, <span class="num">&#36;120k</span> a month, but ranks third. Ranking by sales would send the wrong store first.</p></div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> bars left of the dashed line cost more to review than they could recover. Of the stores to its right, only the top N fit the budget; the rest get automatic, reversible actions.</figcaption>
</figure>
```

### 7.5 Recipient-side reporting

Recipients can supply a free signal against overcharging. The recipient app should show an itemized receipt for each EBT purchase, with a “price looks wrong” button on each line. Reports feed the store’s score as one more feature, weighted by the reporter’s history so that one angry customer cannot sink a store. Reports also help the household directly, by showing what each item cost.

This channel does nothing against trafficking. The trafficking shopper colludes with the store and will never press the button. Recipient reporting is a tool for the predatory form of overcharging, where the store cheats its customer. That distinction should shape how the program weights these reports: they are strong evidence of predatory pricing and no evidence about trafficking.

## 8\. Trade-offs and harms

Every control in this report imposes costs on honest participants. The table lists the main ones (Figure 17).

```guest-html
<table>
<colgroup>
<col style="width:25%">
<col style="width:25%">
<col style="width:25%">
<col style="width:25%">
</colgroup>
<thead>
<tr>
<th>Control</th>
<th>Fraud it targets</th>
<th>Cost or harm</th>
<th>Mitigation</th>
</tr>
</thead>
<tbody>
<tr>
<td>Item-level basket tracking</td>
<td>Overcharging, ineligible sales, fake baskets</td>
<td>Privacy: the state records what poor people eat. Data could be used
for purposes beyond integrity, such as food-choice policing</td>
<td>Data minimization, retention limits, statutory purpose limits,
aggregation for research</td>
</tr>
<tr>
<td>Strict store rules (stocking, scanning)</td>
<td>Front stores, trafficking</td>
<td>Food-desert access loss when small stores leave the program</td>
<td>Subsidized point-of-sale equipment, exceptions for underserved
areas, phased deadlines</td>
</tr>
<tr>
<td>Payout holds and delays</td>
<td>Hit-and-run trafficking, unrecoverable losses</td>
<td>Honest small stores face cash flow strain</td>
<td>Time limits on holds, partial holds, standard tier for clean
history</td>
</tr>
<tr>
<td>Aggressive scoring</td>
<td>All store-side fraud</td>
<td>False positives; slow appeals can close an honest store</td>
<td>Appeal deadlines with service levels, independent review,
publication of error rates</td>
</tr>
<tr>
<td>Heavier eligibility checks</td>
<td>Eligibility fraud, duplicates</td>
<td>Eligible people drop out because of paperwork and delays</td>
<td>Use data matches to reduce paperwork, request documents only on
mismatch</td>
</tr>
</tbody>
</table>
```

Step-up confirmation for large spends | Skimming drains | Delays for recipients without phones | Fail-open path, opt-in, store-based fallback |

```guest-html
<figure class="fig" id="fig-08-tradeoff-map">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 17</span><h4>Every control has a cost</h4><p class="g-dek">Each control stops some fraud and harms some honest participants, and the mitigation decides how much harm remains.</p></div>
  <div class="fig-body">

    <div style="display:flex;justify-content:center;margin-bottom:0.25rem"><span class="g-chip g-chip--caution">Qualitative placement: judgment, not measurement</span></div>
    <div style="max-width:620px;margin-inline:auto"><svg viewBox="0 0 520 380" role="img" aria-label="Qualitative map of six controls by fraud stopped and harm to honest participants. Item-level tracking, strict store rules, and aggressive scoring stop the most fraud but carry high harm; step-up confirmation carries the least harm."><rect x="70" y="30" width="215" height="155" class="g-f-fraud-tint" fill-opacity="0.6"></rect><rect x="285" y="185" width="215" height="155" class="g-f-defense-tint" fill-opacity="0.6"></rect><line x1="285" x2="285" y1="30" y2="340" class="g-s-rule" stroke-width="1"></line><line x1="70" x2="500" y1="185" y2="185" class="g-s-rule" stroke-width="1"></line><path d="M70 30 V340 H500" fill="none" class="g-s-muted" stroke-width="1.2"></path><text x="78" y="46" class="g-f-fraud" font-size="11" font-weight="700">much harm, little fraud stopped</text><text x="492" y="330" class="g-f-defense" font-size="11" font-weight="700" text-anchor="end">little harm, much fraud stopped</text><text x="70" y="356" class="g-f-muted" font-size="11">less</text><text x="500" y="356" class="g-f-muted" font-size="11" text-anchor="end">more</text><text x="285" y="374" class="g-f-ink" font-size="12" font-weight="700" text-anchor="middle">fraud stopped</text><text x="62" y="38" class="g-f-muted" font-size="11" text-anchor="end">more</text><text x="62" y="340" class="g-f-muted" font-size="11" text-anchor="end">less</text><text x="26" y="185" class="g-f-ink" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(-90 26 185)">harm to honest participants</text><text x="353.6" y="83.8" class="g-f-ink" font-size="12" font-weight="700" text-anchor="start">Item-level tracking</text><text x="353.6" y="97.8" class="g-f-fraud" font-size="11" text-anchor="start">privacy</text><circle cx="336.6" cy="85.8" r="12" class="g-f-defense"></circle><text x="336.6" y="89.8" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">1</text><text x="397" y="133.4" class="g-f-ink" font-size="12" font-weight="700" text-anchor="end">Strict store rules</text><text x="397" y="147.4" class="g-f-fraud" font-size="11" text-anchor="end">food-desert access loss</text><circle cx="414" cy="135.4" r="12" class="g-f-defense"></circle><text x="414" y="139.4" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">2</text><text x="293.4" y="214" class="g-f-ink" font-size="12" font-weight="700" text-anchor="start">Payout holds</text><text x="293.4" y="228" class="g-f-fraud" font-size="11" text-anchor="start">cash flow strain</text><circle cx="276.4" cy="216" r="12" class="g-f-defense"></circle><text x="276.4" y="220" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">3</text><text x="440" y="183" class="g-f-ink" font-size="12" font-weight="700" text-anchor="end">Aggressive scoring</text><text x="440" y="197" class="g-f-fraud" font-size="11" text-anchor="end">false positives</text><circle cx="457" cy="185" r="12" class="g-f-defense"></circle><text x="457" y="189" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">4</text><text x="182" y="108.6" class="g-f-ink" font-size="12" font-weight="700" text-anchor="end">Eligibility checks</text><text x="182" y="122.6" class="g-f-fraud" font-size="11" text-anchor="end">eligible people drop out</text><circle cx="199" cy="110.6" r="12" class="g-f-defense"></circle><text x="199" y="114.6" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">5</text><text x="259" y="276" class="g-f-ink" font-size="12" font-weight="700" text-anchor="start">Step-up confirmation</text><text x="259" y="290" class="g-f-fraud" font-size="11" text-anchor="start">delays without a phone</text><circle cx="242" cy="278" r="12" class="g-f-defense"></circle><text x="242" y="282" class="g-f-surface g-mono" font-size="12" font-weight="600" text-anchor="middle">6</text></svg></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:0.75rem;margin-top:1.25rem">
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">1</span>Item-level basket tracking</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> overcharging, ineligible sales, fake baskets</p>
        <p><strong class="g-t-fraud">Harm:</strong> privacy: the state records what poor people eat, and could use it for food-choice policing</p>
        <p><strong class="g-t-defense">Mitigation:</strong> data minimization, retention limits, statutory purpose limits, aggregation for research</p>
      </div>
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">2</span>Strict store rules</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> front stores, trafficking</p>
        <p><strong class="g-t-fraud">Harm:</strong> food-desert access loss when small stores leave the program</p>
        <p><strong class="g-t-defense">Mitigation:</strong> subsidized point-of-sale equipment, exceptions for underserved areas, phased deadlines</p>
      </div>
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">3</span>Payout holds and delays</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> hit-and-run trafficking, unrecoverable losses</p>
        <p><strong class="g-t-fraud">Harm:</strong> honest small stores face cash flow strain</p>
        <p><strong class="g-t-defense">Mitigation:</strong> time limits on holds, partial holds, standard tier for clean history</p>
      </div>
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">4</span>Aggressive scoring</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> all store-side fraud</p>
        <p><strong class="g-t-fraud">Harm:</strong> false positives; slow appeals can close an honest store</p>
        <p><strong class="g-t-defense">Mitigation:</strong> appeal deadlines with service levels, independent review, published error rates</p>
      </div>
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">5</span>Heavier eligibility checks</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> eligibility fraud, duplicates</p>
        <p><strong class="g-t-fraud">Harm:</strong> eligible people drop out because of paperwork and delays</p>
        <p><strong class="g-t-defense">Mitigation:</strong> data matches to cut paperwork, documents only on mismatch</p>
      </div>
      <div class="g-node">
        <h5><span class="num" style="display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:0.4em;border-radius:50%;background:var(--defense);color:var(--surface);font-size:0.8rem">6</span>Step-up confirmation for large spends</h5>
        <p><strong style="color:var(--ink)">Targets:</strong> skimming drains</p>
        <p><strong class="g-t-fraud">Harm:</strong> delays for recipients without phones</p>
        <p><strong class="g-t-defense">Mitigation:</strong> fail-open path, opt-in, store-based fallback</p>
      </div>
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> no control sits in the safe corner on its own. The strongest controls carry the most harm, so each one ships with its mitigation or honest households and stores pay for the fraud.</figcaption>
</figure>
```

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

```guest-html
<figure class="fig" id="fig-10-roadmap">
  <div class="g-fig-head"><span class="g-eyebrow">Figure 18</span><h4>Implementation roadmap: three phases, four parties</h4><p class="g-dek">Ship the cheap controls that need no new standard first, then item data, then analytics, and measure each phase.</p></div>
  <div class="fig-body">
    <div class="g-rm" role="group" aria-label="Three-phase roadmap. Phase 1, credentials and payout risk. Phase 2, an item-level data standard. Phase 3, analytics and the investigation queue. Each phase lists what retailers, point-of-sale vendors, states, and FNS must do, and what the phase measures.">
      <div class="g-rm-lanes" aria-hidden="true">
        <span class="g-rm-corner">Order set by cost, dependency, and loss size; no dates</span>
        <span>Retailers</span>
        <span>POS vendors</span>
        <span>States</span>
        <span>FNS<small>federal agency</small></span>
        <span class="g-rm-lane-m">Measure</span>
      </div>

      
        <span class="g-rm-ph">Phase 1</span><h5>Credentials and payout risk</h5><p>No new data standard needed. Attacks skimming and hit-and-run trafficking.</p>
        <div class="g-rm-cell"><b class="g-rm-who">Retailers</b><ul><li>Upgrade terminals for chip and tap</li><li>Accept payout tier rules</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">POS vendors</b><ul><li>Support EMV for EBT</li><li>End stripe fallback by the deadline</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">States</b><ul><li>Issue chip cards</li><li>Run the recipient app or approve third-party apps</li><li>Vary load timing</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">FNS</b><ul><li>Set chip standards and the fallback deadline</li><li>Implement payout tiers in settlement, using the existing ALERT score</li></ul></div>
        <div class="g-rm-cell g-rm-measure"><b class="g-rm-who">Measure</b><ul><li>Skimming claims per thousand cards, before and after the switch</li></ul></div>
      

      
        <span class="g-rm-ph">Phase 2</span><h5>Item-level data standard</h5><p>Basket standard, certified POS, ineligible items rejected, reference prices begun. Privacy rules come first.</p>
        <div class="g-rm-cell"><b class="g-rm-who">Retailers</b><ul><li>Install certified registers or the subsidized app</li><li>Keep product price lists current</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">POS vendors</b><ul><li>Implement the basket message standard</li><li>Pass certification</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">States</b><ul><li>Fund outreach to small stores</li><li>Update EBT processor contracts</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">FNS</b><ul><li>Publish the standard; certify vendors</li><li>Adopt privacy and retention rules</li></ul></div>
        <div class="g-rm-cell g-rm-measure"><b class="g-rm-who">Measure</b><ul><li>Share of EBT volume carrying item data</li><li>Count of small stores that left the program</li></ul></div>
      

      
        <span class="g-rm-ph">Phase 3</span><h5>Analytics and the investigation queue</h5><p>Reconciliation, card-store graph, store-month scoring, a budget-sized queue, case feedback.</p>
        <div class="g-rm-cell"><b class="g-rm-who">Retailers</b><ul><li>Keep purchase invoices</li><li>Submit them on request</li><li>Accept audits</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">POS vendors</b><ul><li>Provide data hooks for catalog updates</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">States</b><ul><li>Join graph-based recipient investigations</li><li>Resolve NAC and income matches quickly</li></ul></div>
        <div class="g-rm-cell"><b class="g-rm-who">FNS</b><ul><li>Contract distributor data feeds</li><li>Build scoring and the queue</li><li>Publish appeal metrics</li></ul></div>
        <div class="g-rm-cell g-rm-measure"><b class="g-rm-who">Measure</b><ul><li>Confirmation rate of reviewed cases</li><li>Reversal rates on appeal</li><li>Trafficking estimate from the next FNS study</li></ul></div>
      
    </div>
  </div>
  <figcaption><strong>Read it as:</strong> read across a row to see one party's work grow phase by phase, and down a column to see what one phase asks of everyone. Without the measure row, the program cannot tell whether controls pay for themselves.</figcaption>
</figure>
```

**Phase 1: credentials and payout risk.** Complete the national move to chip and contactless EBT cards. Launch a recipient app with card lock, geography and online blocks, and per-swipe alerts. Introduce merchant risk tiers using the existing ALERT score: probation for new stores, settlement delays and caps for high tiers. These steps need no new data standard and attack skimming and hit-and-run trafficking directly.

**Phase 2: item-level data standard.** Define and publish an item-level basket standard for EBT messages. Certify point-of-sale vendors against it. Fund a low-cost certified option for small stores. Turn on real-time rejection of ineligible items. Begin building reference prices and per-store product catalogs. Set privacy rules in regulation before data collection starts.

**Phase 3: analytics and the investigation queue.** Add inventory reconciliation with distributor feeds and purchase-record requirements. Build the card-store graph. Deploy store-month price scoring and expected-loss ranking. Size the investigation queue to the budget and run the feedback loop from closed cases.

```guest-html
<table>
<colgroup>
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
<col style="width:20%">
</colgroup>
<thead>
<tr>
<th>Phase</th>
<th>Retailers</th>
<th>Point-of-sale vendors</th>
<th>States</th>
<th>FNS</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Upgrade terminals for chip and tap; accept payout tier rules</td>
<td>Support EMV for EBT; end stripe fallback by deadline</td>
<td>Issue chip cards; run the recipient app or approve third-party apps;
vary load timing</td>
<td>Set chip standards and fallback deadline; implement payout tiers in
settlement</td>
</tr>
<tr>
<td>2</td>
<td>Install certified registers or the subsidized app; keep product
price lists current</td>
<td>Implement the basket message standard; pass certification</td>
<td>Fund outreach to small stores; update EBT processor contracts</td>
<td>Publish the standard; certify vendors; adopt privacy and retention
rules</td>
</tr>
<tr>
<td>3</td>
<td>Keep purchase invoices; submit them on request; accept audits</td>
<td>Provide data hooks for catalog updates</td>
<td>Join graph-based recipient investigations; resolve NAC and income
matches quickly</td>
<td>Contract distributor data feeds; build scoring and the queue;
publish appeal metrics</td>
</tr>
</tbody>
</table>
```

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

```guest-html
<figure class="fig" id="uml-ops-use-cases">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A1</span><h4>Who does what in the integrity program</h4><p class="g-dek">Recipients and retailers use the program; caseworkers, analysts, and investigators police it. A person decides every sanction.</p></div>
  <div class="fig-body">
    <svg viewBox="0 0 1000 910" role="img" aria-label="UML use case diagram of the SNAP integrity program. Recipients apply, buy groceries, lock cards, and report wrong prices. Retailers sell, receive payouts, submit purchase records, and appeal. Caseworkers verify eligibility and replace stolen benefits. Federal analysts review flagged stores and impose sanctions; investigators run undercover buys. A person decides every sanction." xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="uml-ops-use-cases-a" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-ink" stroke-width="1.5"></path></marker><marker id="uml-ops-use-cases-am" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-muted" stroke-width="1.5"></path></marker></defs>
      <rect x="196" y="40" width="608" height="740" rx="6" fill="none" class="g-s-ink" stroke-width="1.4"></rect>
      <text x="212" y="63" font-size="13" text-anchor="start" class="g-f-ink" font-weight="700">SNAP integrity program</text>
      <ellipse cx="300" cy="110" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="300" y="114.2" font-size="12" text-anchor="middle" class="g-f-ink">Apply for benefits</text>
      <ellipse cx="700" cy="110" rx="92" ry="27" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></ellipse>
      <text x="700" y="107.2" font-size="12" text-anchor="middle" class="g-f-ink">Verify eligibility</text>
      <text x="700" y="121.2" font-size="12" text-anchor="middle" class="g-f-ink">(data match)</text>
      <ellipse cx="300" cy="195" rx="92" ry="27" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></ellipse>
      <text x="300" y="192.2" font-size="12" text-anchor="middle" class="g-f-ink">Lock card /</text>
      <text x="300" y="206.2" font-size="12" text-anchor="middle" class="g-f-ink">report skimming</text>
      <ellipse cx="700" cy="195" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="700" y="192.2" font-size="12" text-anchor="middle" class="g-f-ink">Replace stolen</text>
      <text x="700" y="206.2" font-size="12" text-anchor="middle" class="g-f-ink">benefits</text>
      <ellipse cx="300" cy="280" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="300" y="277.2" font-size="12" text-anchor="middle" class="g-f-ink">Report a</text>
      <text x="300" y="291.2" font-size="12" text-anchor="middle" class="g-f-ink">wrong price</text>
      <ellipse cx="700" cy="280" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="700" y="277.2" font-size="12" text-anchor="middle" class="g-f-ink">Certify POS</text>
      <text x="700" y="291.2" font-size="12" text-anchor="middle" class="g-f-ink">system</text>
      <ellipse cx="700" cy="365" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="700" y="369.2" font-size="12" text-anchor="middle" class="g-f-ink">Buy groceries</text>
      <ellipse cx="500" cy="465" rx="92" ry="27" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></ellipse>
      <text x="500" y="469.2" font-size="12" text-anchor="middle" class="g-f-ink">Validate basket</text>
      <ellipse cx="700" cy="465" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="700" y="469.2" font-size="12" text-anchor="middle" class="g-f-ink">Receive payout</text>
      <ellipse cx="500" cy="555" rx="92" ry="27" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></ellipse>
      <text x="500" y="552.2" font-size="12" text-anchor="middle" class="g-f-ink">Review</text>
      <text x="500" y="566.2" font-size="12" text-anchor="middle" class="g-f-ink">flagged store</text>
      <ellipse cx="700" cy="555" rx="92" ry="27" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></ellipse>
      <text x="700" y="559.2" font-size="12" text-anchor="middle" class="g-f-ink">Hold payout</text>
      <ellipse cx="300" cy="645" rx="92" ry="27" class="g-f-fraud-tint g-s-fraud" stroke-width="1.4"></ellipse>
      <text x="300" y="649.2" font-size="12" text-anchor="middle" class="g-f-ink">Impose sanction</text>
      <ellipse cx="700" cy="645" rx="92" ry="27" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></ellipse>
      <text x="700" y="649.2" font-size="12" text-anchor="middle" class="g-f-ink">Appeal a decision</text>
      <ellipse cx="500" cy="735" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="500" y="732.2" font-size="12" text-anchor="middle" class="g-f-ink">Run undercover</text>
      <text x="500" y="746.2" font-size="12" text-anchor="middle" class="g-f-ink">buy</text>
      <ellipse cx="700" cy="735" rx="92" ry="27" class="g-f-surface g-s-ink" stroke-width="1.4"></ellipse>
      <text x="700" y="732.2" font-size="12" text-anchor="middle" class="g-f-ink">Submit purchase</text>
      <text x="700" y="746.2" font-size="12" text-anchor="middle" class="g-f-ink">records</text>
      <circle cx="100" cy="270" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M100,278 V302 M86,288 H114 M100,302 L89,320 M100,302 L111,320" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="100" y="337" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Recipient</text>
      <path d="M118,290 L235.6,128.9" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M118,290 L227.1,211.2" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M118,290 L208.7,283.1" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M118,290 L610.9,359.6" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="100" cy="570" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M100,578 V602 M86,588 H114 M100,602 L89,620 M100,602 L111,620" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="100" y="637" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Federal retailer</text>
      <text x="100" y="651" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">analyst</text>
      <path d="M118,590 L409.6,559.2" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M118,590 L219.2,632.4" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="900" cy="115" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M900,123 V147 M886,133 H914 M900,147 L889,165 M900,147 L911,165" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="900" y="182" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">State</text>
      <text x="900" y="196" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">caseworker</text>
      <path d="M882,135 L788.4,117.2" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M882,135 L779.8,181.7" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="900" cy="260" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M900,268 V292 M886,278 H914 M900,292 L889,310 M900,292 L911,310" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="900" y="327" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">POS vendor</text>
      <path d="M882,280 L792,280" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="900" cy="570" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M900,578 V602 M886,588 H914 M900,602 L889,620 M900,602 L911,620" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="900" y="637" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Retailer</text>
      <path d="M882,590 L762.1,384.7" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M882,590 L769,482.5" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M882,590 L780.8,632.4" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M882,590 L767,716.9" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="900" cy="760" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M900,768 V792 M886,778 H914 M900,792 L889,810 M900,792 L911,810" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="900" y="827" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Supplier</text>
      <text x="900" y="841" font-size="12" text-anchor="middle" class="g-f-muted">(secondary)</text>
      <path d="M882,780 L783.5,746.2" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <circle cx="500" cy="815" r="8" class="g-f-surface g-s-ink" stroke-width="1.5"></circle>
      <path d="M500,823 V847 M486,833 H514 M500,847 L489,865 M500,847 L511,865" fill="none" class="g-s-ink" stroke-width="1.5"></path>
      <text x="500" y="882" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Investigator</text>
      <path d="M500,807 L500,762" fill="none" class="g-s-ink" stroke-width="1.2"></path>
      <path d="M392,110 L608,110" fill="none" class="g-s-muted" stroke-width="1.4" stroke-dasharray="6 4" marker-end="url(#uml-ops-use-cases-am)"></path>
      <text x="500" y="102" font-size="11" text-anchor="middle" class="g-f-muted g-mono">«include»</text>
      <path d="M608,195 L392,195" fill="none" class="g-s-muted" stroke-width="1.4" stroke-dasharray="6 4" marker-end="url(#uml-ops-use-cases-am)"></path>
      <text x="500" y="187" font-size="11" text-anchor="middle" class="g-f-muted g-mono">«extend»</text>
      <text x="500" y="211" font-size="11" text-anchor="middle" class="g-f-caution g-mono">[replacement available]</text>
      <path d="M653.4,388.3 L546.6,441.7" fill="none" class="g-s-muted" stroke-width="1.4" stroke-dasharray="6 4" marker-end="url(#uml-ops-use-cases-am)"></path>
      <text x="560" y="401" font-size="11" text-anchor="middle" class="g-f-muted g-mono">«include»</text>
      <path d="M700,528 L700,492" fill="none" class="g-s-muted" stroke-width="1.4" stroke-dasharray="6 4" marker-end="url(#uml-ops-use-cases-am)"></path>
      <text x="692" y="506" font-size="11" text-anchor="end" class="g-f-muted g-mono">«extend»</text>
      <text x="692" y="520" font-size="11" text-anchor="end" class="g-f-fraud g-mono">[high risk score]</text>
      <path d="M500,708 L500,582" fill="none" class="g-s-muted" stroke-width="1.4" stroke-dasharray="6 4" marker-end="url(#uml-ops-use-cases-am)"></path>
      <text x="508" y="641" font-size="11" text-anchor="start" class="g-f-muted g-mono">«extend»</text>
      <text x="508" y="655" font-size="11" text-anchor="start" class="g-f-caution g-mono">[case opened]</text>
      <path d="M212,700 H380 L392,712 V764 H212 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
      <path d="M380,700 V712 H392" fill="none" class="g-s-muted" stroke-width="1.2"></path>
      <text x="222" y="721" font-size="12" text-anchor="start" class="g-f-ink">A score can open a case.</text>
      <text x="222" y="736" font-size="12" text-anchor="start" class="g-f-ink">A person decides it, with</text>
      <text x="222" y="751" font-size="12" text-anchor="start" class="g-f-ink">notice and a hearing.</text>
      <path d="M300,700 L300,672" fill="none" class="g-s-muted" stroke-width="1.2" stroke-dasharray="6 4"></path>
    </svg>
  </div>
  <figcaption><strong>Read it as:</strong> stick figures are actors outside the system, and ovals are use cases inside it. A solid line means the actor takes part. A dashed «include» arrow points to a step its base case always runs. A dashed «extend» arrow points back to the base case it sometimes adds to, under the condition in brackets.</figcaption>
</figure>
```

An activity diagram shows how one case moves between parties. It starts in software. The analytics system scores every store each month, and only stores in the top N reach a federal analyst; the rest get an automated warning letter, payout delay, or volume cap. Once a case opens, three lines of evidence run at the same time: supplier records, an undercover buy, and the store's own purchase records.

The case file joins them before anyone decides. A sanction can go to independent review, and every outcome, closed, upheld, or reversed, becomes a label for next month's scores.

```guest-html
<figure class="fig" id="uml-ops-investigation-activity">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A2</span><h4>From flagged store to final decision</h4><p class="g-dek">Software picks the store, three lines of evidence run in parallel, and every closed case returns to scoring as a label.</p></div>
  <div class="fig-body">
    <svg viewBox="0 0 1000 1120" role="img" aria-label="UML activity diagram of a store investigation across five swimlanes. Analytics scores and ranks stores; stores in the top N go to a federal analyst, the rest get an automated warning, delay, or cap. Supplier records, an undercover buy, and the store's purchase records run in parallel into a case file. The analyst closes the case or imposes a sanction, the retailer may appeal to independent review, and every outcome feeds back to scoring." xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="uml-ops-investigation-activity-a" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-ink" stroke-width="1.5"></path></marker><marker id="uml-ops-investigation-activity-am" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-muted" stroke-width="1.5"></path></marker></defs>
      <rect x="20" y="20" width="960" height="1090" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <rect x="20" y="20" width="960" height="36" class="g-f-neutral-tint g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Analytics system</text>
      <path d="M200,20 V1110" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="280" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Investigator</text>
      <path d="M360,20 V1110" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="510" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Federal analyst</text>
      <path d="M660,20 V1110" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="740" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Retailer</text>
      <path d="M820,20 V1110" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="900" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Appeals</text>
      <circle cx="110" cy="86" r="8" class="g-f-ink"></circle>
      <path d="M110,94 L110,116" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="35" y="116" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="110" y="132.2" font-size="12" text-anchor="middle" class="g-f-ink">Score every</text>
      <text x="110" y="146.2" font-size="12" text-anchor="middle" class="g-f-ink">store-month</text>
      <path d="M110,154 L110,181" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="35" y="181" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="110" y="197.2" font-size="12" text-anchor="middle" class="g-f-ink">Rank stores by</text>
      <text x="110" y="211.2" font-size="12" text-anchor="middle" class="g-f-ink">expected loss</text>
      <path d="M110,219 L110,249" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M110,249 L126,265 L110,281 L94,265 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M126,265 L425,265" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="210" y="257" font-size="11" text-anchor="start" class="g-f-ink g-mono">[in top N]</text>
      <rect x="425" y="246" width="170" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="510" y="262.2" font-size="12" text-anchor="middle" class="g-f-ink">Triage the</text>
      <text x="510" y="276.2" font-size="12" text-anchor="middle" class="g-f-ink">flagged store</text>
      <path d="M110,281 L110,316" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="118" y="303" font-size="11" text-anchor="start" class="g-f-ink g-mono">[else]</text>
      <rect x="35" y="316" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="110" y="332.2" font-size="12" text-anchor="middle" class="g-f-ink">Warning letter,</text>
      <text x="110" y="346.2" font-size="12" text-anchor="middle" class="g-f-ink">payout delay, or cap</text>
      <path d="M110,354 L110,380" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <circle cx="110" cy="391" r="9" class="g-f-surface g-s-ink" stroke-width="1.4"></circle>
      <path d="M103.6,384.6 L116.4,397.4 M116.4,384.6 L103.6,397.4" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="110" y="418" font-size="11" text-anchor="middle" class="g-f-muted">stays in the automated tier</text>
      <path d="M510,284 L510,436" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="40" y="437" width="560" height="6" rx="1" class="g-f-ink"></rect>
      <path d="M110,443 L110,480" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M280,443 L280,480" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M510,443 L510,480" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="35" y="481" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="110" y="497.2" font-size="12" text-anchor="middle" class="g-f-ink">Pull supplier</text>
      <text x="110" y="511.2" font-size="12" text-anchor="middle" class="g-f-ink">records</text>
      <rect x="210" y="481" width="140" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="280" y="497.2" font-size="12" text-anchor="middle" class="g-f-ink">Run undercover</text>
      <text x="280" y="511.2" font-size="12" text-anchor="middle" class="g-f-ink">buy</text>
      <rect x="425" y="481" width="170" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="510" y="497.2" font-size="12" text-anchor="middle" class="g-f-ink">Request purchase</text>
      <text x="510" y="511.2" font-size="12" text-anchor="middle" class="g-f-ink">records</text>
      <path d="M595,500 L670,500" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="670" y="481" width="140" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="740" y="497.2" font-size="12" text-anchor="middle" class="g-f-ink">Submit invoices</text>
      <text x="740" y="511.2" font-size="12" text-anchor="middle" class="g-f-ink">and receipts</text>
      <path d="M740,519 L740,575 L595,575" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="425" y="556" width="170" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="510" y="572.2" font-size="12" text-anchor="middle" class="g-f-ink">Reconcile sales</text>
      <text x="510" y="586.2" font-size="12" text-anchor="middle" class="g-f-ink">vs purchases</text>
      <path d="M110,519 L110,646" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M280,519 L280,646" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M510,594 L510,646" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="40" y="647" width="560" height="6" rx="1" class="g-f-ink"></rect>
      <path d="M510,653 L510,682" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="450" y="683" width="120" height="34" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="510" y="704.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="600">Case file</text>
      <path d="M510,717 L510,753" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M510,754 L526,770 L510,786 L494,770 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M494,770 L435,770 L435,822" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="488" y="761" font-size="11" text-anchor="end" class="g-f-ink g-mono">[no finding]</text>
      <path d="M526,770 L585,770 L585,822" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="532" y="761" font-size="11" text-anchor="start" class="g-f-ink g-mono">[substantiated]</text>
      <rect x="370" y="823" width="130" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="435" y="839.2" font-size="12" text-anchor="middle" class="g-f-ink">Close case,</text>
      <text x="435" y="853.2" font-size="12" text-anchor="middle" class="g-f-ink">no finding</text>
      <rect x="520" y="823" width="130" height="38" rx="12" class="g-f-fraud-tint g-s-fraud" stroke-width="1.4"></rect>
      <text x="585" y="839.2" font-size="12" text-anchor="middle" class="g-f-ink">Impose sanction</text>
      <text x="585" y="853.2" font-size="12" text-anchor="middle" class="g-f-ink">(disqualify or fine)</text>
      <path d="M650,842 L723,842" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M740,826 L756,842 L740,858 L724,842 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M756,842 L829,842" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="761" y="834" font-size="11" text-anchor="start" class="g-f-ink g-mono">[appeal]</text>
      <rect x="830" y="823" width="140" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="900" y="839.2" font-size="12" text-anchor="middle" class="g-f-ink">Independent</text>
      <text x="900" y="853.2" font-size="12" text-anchor="middle" class="g-f-ink">review</text>
      <path d="M900,861 L900,891" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="830" y="891" width="140" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="900" y="907.2" font-size="12" text-anchor="middle" class="g-f-ink">Final decision:</text>
      <text x="900" y="921.2" font-size="12" text-anchor="middle" class="g-f-ink">uphold or reverse</text>
      <path d="M740,858 L740,943" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <text x="746" y="905" font-size="11" text-anchor="start" class="g-f-ink g-mono">[no appeal]</text>
      <path d="M900,929 L900,960 L757,960" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M435,861 L435,960 L723,960" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <path d="M740,944 L756,960 L740,976 L724,960 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M740,976 L740,1015 L186,1015" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <rect x="35" y="996" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="110" y="1012.2" font-size="12" text-anchor="middle" class="g-f-ink">Label the outcome,</text>
      <text x="110" y="1026.2" font-size="12" text-anchor="middle" class="g-f-ink">retrain scoring</text>
      <path d="M110,1034 L110,1072" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-investigation-activity-a)"></path>
      <circle cx="110" cy="1084" r="11" fill="none" class="g-s-ink" stroke-width="1.6"></circle>
      <circle cx="110" cy="1084" r="6" class="g-f-ink"></circle>
    </svg>
  </div>
  <figcaption><strong>Read it as:</strong> each column is one party. The black dot starts the flow, and the bullseye ends it. Bars split work into parallel branches and join it again. Diamonds pick one branch by the guard in brackets, or merge branches back into one. The circled X marks where a store below the top N leaves the flow without reaching a person.</figcaption>
</figure>
```

The same process, seen from the case record, is a state machine. Each box is a status the case can hold, and each arrow names the event, guard, and action that move it. The design rules from sections 6 to 8 become guards here.

A case opens only when its expected loss beats the review cost within budget. A payout hold starts when the case enters the queue and lifts if the evidence shows no violation. Every sanction can go to appeal before the case becomes final.

```guest-html
<figure class="fig" id="uml-ops-case-states">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A3</span><h4>The life of an integrity case</h4><p class="g-dek">A score can open a case and hold some payouts. Only evidence moves it to a sanction, and every sanction can go to appeal.</p></div>
  <div class="fig-body">
    <svg viewBox="0 0 1000 760" role="img" aria-label="UML state machine for an integrity case. A monthly score flags a store. Below the review cutoff it gets an automated warning, delay, or cap; above it, a case opens and payouts are partly held. Under investigation, evidence is requested, reconciled, and checked by undercover buy. The case closes with no finding or is substantiated and sanctioned; a sanction can be appealed before the case becomes final, and the outcome feeds back to scoring." xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="uml-ops-case-states-a" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-ink" stroke-width="1.5"></path></marker><marker id="uml-ops-case-states-am" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-muted" stroke-width="1.5"></path></marker></defs>
      <circle cx="135" cy="40" r="8" class="g-f-ink"></circle>
      <path d="M135,48 L135,89" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="143" y="60" font-size="11" text-anchor="start" class="g-f-ink g-mono">monthly score</text>
      <text x="143" y="73" font-size="11" text-anchor="start" class="g-f-ink g-mono">[above normal]</text>
      <rect x="70" y="90" width="130" height="40" rx="10" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="135" y="114.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Flagged</text>
      <path d="M200,110 L389,110" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="295" y="88" font-size="11" text-anchor="middle" class="g-f-ink g-mono">[loss &gt; review cost</text>
      <text x="295" y="101" font-size="11" text-anchor="middle" class="g-f-ink g-mono">and within budget]</text>
      <text x="295" y="126" font-size="11" text-anchor="middle" class="g-f-ink g-mono">/ open case</text>
      <rect x="390" y="75" width="180" height="70" rx="10" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="480" y="94" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Queued for review</text>
      <path d="M390,103 H570" fill="none" class="g-s-defense" stroke-width="1"></path>
      <text x="399" y="119" font-size="11" text-anchor="start" class="g-f-ink g-mono">entry / hold part</text>
      <text x="399" y="132" font-size="11" text-anchor="start" class="g-f-ink g-mono">of payouts</text>
      <path d="M135,130 L135,209" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="143" y="172" font-size="11" text-anchor="start" class="g-f-ink g-mono">[else]</text>
      <rect x="60" y="210" width="170" height="64" rx="10" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="145" y="229" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Auto-actioned</text>
      <path d="M60,238 H230" fill="none" class="g-s-defense" stroke-width="1"></path>
      <text x="69" y="254" font-size="11" text-anchor="start" class="g-f-ink g-mono">entry / warning letter,</text>
      <text x="69" y="267" font-size="11" text-anchor="start" class="g-f-ink g-mono">payout delay, or cap</text>
      <path d="M230,242 L460,242 L460,146" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="345" y="218" font-size="11" text-anchor="middle" class="g-f-ink g-mono">monthly score [rises</text>
      <text x="345" y="231" font-size="11" text-anchor="middle" class="g-f-ink g-mono">into top N] / open case</text>
      <path d="M145,274 L145,696" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="153" y="478" font-size="11" text-anchor="start" class="g-f-ink g-mono">monthly score</text>
      <text x="153" y="491" font-size="11" text-anchor="start" class="g-f-ink g-mono">[back to normal]</text>
      <text x="153" y="504" font-size="11" text-anchor="start" class="g-f-ink g-mono">/ lift action</text>
      <rect x="690" y="50" width="295" height="250" rx="14" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="706" y="73" font-size="12" text-anchor="start" class="g-f-ink" font-weight="700">Under investigation</text>
      <path d="M570,110 L689,110" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="630" y="88" font-size="11" text-anchor="middle" class="g-f-ink g-mono">case assigned /</text>
      <text x="630" y="101" font-size="11" text-anchor="middle" class="g-f-ink g-mono">request records</text>
      <circle cx="722" cy="110" r="8" class="g-f-ink"></circle>
      <path d="M730,110 L759,110" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <rect x="760" y="95" width="180" height="30" rx="8" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="850" y="114.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Evidence requested</text>
      <path d="M850,125 L850,164" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="858" y="149" font-size="11" text-anchor="start" class="g-f-ink g-mono">records received</text>
      <rect x="760" y="165" width="180" height="30" rx="8" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="850" y="184.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Reconciliation review</text>
      <path d="M850,195 L850,234" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="858" y="219" font-size="11" text-anchor="start" class="g-f-ink g-mono">[gap unexplained]</text>
      <rect x="760" y="235" width="180" height="30" rx="8" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="850" y="254.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Undercover buy</text>
      <path d="M840,300 L840,369" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="848" y="328" font-size="11" text-anchor="start" class="g-f-ink g-mono">evidence reviewed</text>
      <text x="848" y="341" font-size="11" text-anchor="start" class="g-f-ink g-mono">[violation shown]</text>
      <rect x="760" y="370" width="160" height="36" rx="10" class="g-f-fraud-tint g-s-fraud" stroke-width="1.4"></rect>
      <text x="840" y="392.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Substantiated</text>
      <path d="M720,300 L720,340 L600,340 L600,369" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="652" y="318" font-size="11" text-anchor="middle" class="g-f-ink g-mono">evidence reviewed</text>
      <text x="652" y="331" font-size="11" text-anchor="middle" class="g-f-ink g-mono">[no violation]</text>
      <rect x="520" y="370" width="160" height="36" rx="10" class="g-f-neutral-tint g-s-muted" stroke-width="1.4"></rect>
      <text x="600" y="392.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Closed, no finding</text>
      <path d="M840,406 L840,479" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="848" y="438" font-size="11" text-anchor="start" class="g-f-ink g-mono">response reviewed</text>
      <text x="848" y="451" font-size="11" text-anchor="start" class="g-f-ink g-mono">/ disqualify or fine</text>
      <rect x="760" y="480" width="160" height="36" rx="10" class="g-f-fraud-tint g-s-fraud" stroke-width="1.4"></rect>
      <text x="840" y="502.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Sanctioned</text>
      <path d="M840,516 L840,589" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="848" y="556" font-size="11" text-anchor="start" class="g-f-ink g-mono">appeal filed</text>
      <rect x="750" y="590" width="180" height="56" rx="10" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="840" y="609" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Under appeal</text>
      <path d="M750,618 H930" fill="none" class="g-s-caution" stroke-width="1"></path>
      <text x="759" y="634" font-size="11" text-anchor="start" class="g-f-ink g-mono">do / independent review</text>
      <path d="M760,498 L640,498 L640,689" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="700" y="490" font-size="11" text-anchor="middle" class="g-f-ink g-mono">no appeal filed</text>
      <path d="M600,406 L600,689" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="592" y="550" font-size="11" text-anchor="end" class="g-f-ink g-mono">/ release any hold</text>
      <rect x="520" y="690" width="160" height="36" rx="10" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="600" y="712.2" font-size="12" text-anchor="middle" class="g-f-ink" font-weight="700">Final</text>
      <path d="M840,646 L840,708 L681,708" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="760" y="688" font-size="11" text-anchor="middle" class="g-f-ink g-mono">decision issued /</text>
      <text x="760" y="701" font-size="11" text-anchor="middle" class="g-f-ink g-mono">uphold or reverse</text>
      <path d="M520,708 L157,708" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-case-states-a)"></path>
      <text x="340" y="700" font-size="11" text-anchor="middle" class="g-f-ink g-mono">/ feed label to scoring</text>
      <circle cx="145" cy="708" r="11" fill="none" class="g-s-ink" stroke-width="1.6"></circle>
      <circle cx="145" cy="708" r="6" class="g-f-ink"></circle>
    </svg>
  </div>
  <figcaption><strong>Read it as:</strong> rounded boxes are states, and arrows are transitions labeled event [guard] / action. The large box groups three investigation substates, and its two exits fire from any of them. An entry line runs when the case enters that state; a do line runs while it stays there.</figcaption>
</figure>
```

The last diagram turns to the recipient side, where the loss is theft from families. Section 6.2 proposes a recipient app with per-swipe alerts and a card lock, and section 4.4 describes how benefit replacement worked. The activity diagram joins the two.

A family can stop a drain within minutes of the first unknown swipe. The response then splits: the state reissues the card and decides whether the stolen benefits come back. Under the facts in section 4.4, federal replacement covered thefts only through December 20, 2024.

```guest-html
<figure class="fig" id="uml-ops-skimming-response">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A4</span><h4>When a skimmed card gets drained</h4><p class="g-dek">The app lets a family stop a drain within minutes. Whether the stolen money comes back depends on when the theft happened.</p></div>
  <div class="fig-body">
    <svg viewBox="0 0 1020 800" role="img" aria-label="UML activity diagram of the response to a skimmed EBT card across four swimlanes. A copied card is swiped, the app sends a per-swipe alert, and the recipient locks the card so new swipes are declined. The recipient files a report and the state opens a claim. In parallel, a replacement card is issued, chip-and-tap where available, and the state either replaces stolen benefits or tells the household no replacement exists. Federal replacement covered thefts through December 20, 2024 and was not extended." xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="uml-ops-skimming-response-a" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-ink" stroke-width="1.5"></path></marker><marker id="uml-ops-skimming-response-am" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.5 L11,6 L1,10.5" fill="none" class="g-s-muted" stroke-width="1.5"></path></marker></defs>
      <rect x="20" y="20" width="980" height="770" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <rect x="20" y="20" width="980" height="36" class="g-f-neutral-tint g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Recipient</text>
      <path d="M200,20 V790" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="290" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Recipient app</text>
      <path d="M380,20 V790" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="530" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">Card and credential service</text>
      <path d="M680,20 V790" fill="none" class="g-s-ink" stroke-width="1.4"></path>
      <text x="840" y="43" font-size="12.5" text-anchor="middle" class="g-f-ink" font-weight="700">State agency</text>
      <circle cx="530" cy="88" r="8" class="g-f-ink"></circle>
      <path d="M530,96 L530,120" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="455" y="121" width="150" height="38" rx="12" class="g-f-fraud-tint g-s-fraud" stroke-width="1.4"></rect>
      <text x="530" y="137.2" font-size="12" text-anchor="middle" class="g-f-ink">Approve swipe on</text>
      <text x="530" y="151.2" font-size="12" text-anchor="middle" class="g-f-ink">copied card</text>
      <path d="M455,140 L361,140" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="220" y="121" width="140" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="290" y="137.2" font-size="12" text-anchor="middle" class="g-f-ink">Send per-swipe</text>
      <text x="290" y="151.2" font-size="12" text-anchor="middle" class="g-f-ink">alert</text>
      <path d="M220,140 L181,140" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="40" y="121" width="140" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="137.2" font-size="12" text-anchor="middle" class="g-f-ink">See unknown</text>
      <text x="110" y="151.2" font-size="12" text-anchor="middle" class="g-f-ink">transaction</text>
      <path d="M110,159 L110,195" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="40" y="196" width="140" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="212.2" font-size="12" text-anchor="middle" class="g-f-ink">Lock card</text>
      <text x="110" y="226.2" font-size="12" text-anchor="middle" class="g-f-ink">in app</text>
      <path d="M180,215 L219,215" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="220" y="196" width="140" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="290" y="219.2" font-size="12" text-anchor="middle" class="g-f-ink">Lock card</text>
      <path d="M360,215 L454,215" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="455" y="196" width="150" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="530" y="212.2" font-size="12" text-anchor="middle" class="g-f-ink">Decline new</text>
      <text x="530" y="226.2" font-size="12" text-anchor="middle" class="g-f-ink">swipes</text>
      <path d="M530,234 L530,256 L110,256 L110,280" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="40" y="281" width="140" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="297.2" font-size="12" text-anchor="middle" class="g-f-ink">File skimming</text>
      <text x="110" y="311.2" font-size="12" text-anchor="middle" class="g-f-ink">report in app</text>
      <path d="M180,300 L764,300" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="765" y="281" width="150" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="840" y="297.2" font-size="12" text-anchor="middle" class="g-f-ink">Open a</text>
      <text x="840" y="311.2" font-size="12" text-anchor="middle" class="g-f-ink">theft claim</text>
      <path d="M840,319 L840,361" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="420" y="362" width="480" height="6" rx="1" class="g-f-ink"></rect>
      <path d="M530,368 L530,408" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M530,409 L546,425 L530,441 L514,425 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M514,425 L455,425 L455,490" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <text x="508" y="416" font-size="11" text-anchor="end" class="g-f-ink g-mono">[chip-capable]</text>
      <path d="M546,425 L605,425 L605,490" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <text x="552" y="416" font-size="11" text-anchor="start" class="g-f-ink g-mono">[stripe only]</text>
      <rect x="385" y="491" width="140" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="455" y="507.2" font-size="12" text-anchor="middle" class="g-f-ink">Issue chip-and-</text>
      <text x="455" y="521.2" font-size="12" text-anchor="middle" class="g-f-ink">tap card</text>
      <rect x="535" y="491" width="140" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="605" y="507.2" font-size="12" text-anchor="middle" class="g-f-ink">Issue new</text>
      <text x="605" y="521.2" font-size="12" text-anchor="middle" class="g-f-ink">stripe card</text>
      <path d="M455,529 L455,585 L513,585" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M605,529 L605,585 L547,585" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M530,569 L546,585 L530,601 L514,585 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M840,368 L840,408" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M840,409 L856,425 L840,441 L824,425 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M824,425 L760,425 L760,490" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <text x="818" y="403" font-size="11" text-anchor="end" class="g-f-ink g-mono">[replacement</text>
      <text x="818" y="416" font-size="11" text-anchor="end" class="g-f-ink g-mono">available]</text>
      <path d="M856,425 L920,425 L920,490" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <text x="862" y="416" font-size="11" text-anchor="start" class="g-f-caution g-mono">[no replacement]</text>
      <rect x="690" y="491" width="140" height="38" rx="12" class="g-f-defense-tint g-s-defense" stroke-width="1.4"></rect>
      <text x="760" y="507.2" font-size="12" text-anchor="middle" class="g-f-ink">Replace stolen</text>
      <text x="760" y="521.2" font-size="12" text-anchor="middle" class="g-f-ink">benefits</text>
      <rect x="850" y="491" width="140" height="38" rx="12" class="g-f-caution-tint g-s-caution" stroke-width="1.4"></rect>
      <text x="920" y="507.2" font-size="12" text-anchor="middle" class="g-f-ink">Tell household no</text>
      <text x="920" y="521.2" font-size="12" text-anchor="middle" class="g-f-ink">replacement exists</text>
      <path d="M760,529 L760,585 L823,585" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M920,529 L920,585 L857,585" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M840,569 L856,585 L840,601 L824,585 Z" class="g-f-surface g-s-ink" stroke-width="1.4"></path>
      <path d="M530,601 L530,636" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <path d="M840,601 L840,636" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="420" y="637" width="480" height="6" rx="1" class="g-f-ink"></rect>
      <path d="M530,643 L530,705 L181,705" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <rect x="40" y="686" width="140" height="38" rx="12" class="g-f-surface g-s-ink" stroke-width="1.4"></rect>
      <text x="110" y="709.2" font-size="12" text-anchor="middle" class="g-f-ink">Use the new card</text>
      <path d="M110,724 L110,761" fill="none" class="g-s-ink" stroke-width="1.4" marker-end="url(#uml-ops-skimming-response-a)"></path>
      <circle cx="110" cy="773" r="11" fill="none" class="g-s-ink" stroke-width="1.6"></circle>
      <circle cx="110" cy="773" r="6" class="g-f-ink"></circle>
      <path d="M700,676 H978 L990,688 V758 H700 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
      <path d="M978,676 V688 H990" fill="none" class="g-s-muted" stroke-width="1.2"></path>
      <text x="710" y="697" font-size="12" text-anchor="start" class="g-f-ink">Federal replacement covered thefts through</text>
      <text x="710" y="712" font-size="12" text-anchor="start" class="g-f-ink">Dec 20, 2024, up to two months of benefits.</text>
      <text x="710" y="727" font-size="12" text-anchor="start" class="g-f-ink">Congress did not extend it, so the family</text>
      <text x="710" y="742" font-size="12" text-anchor="start" class="g-f-ink">now bears the loss.</text>
      <path d="M975,676 L975,529" fill="none" class="g-s-muted" stroke-width="1.2" stroke-dasharray="6 4"></path>
    </svg>
  </div>
  <figcaption><strong>Read it as:</strong> each column is one party. After the claim opens, two branches run in parallel: a new card, and the question of the stolen benefits. A chip card blocks the next copy; a new stripe card can be copied again. The note gives the report's facts on federal replacement.</figcaption>
</figure>
```

### A.2 Software

The component diagram recasts the layered design as software. Each box is a deployable component. A ball marks an interface the component offers, and a cup marks one it needs. The real-time path answers inside a sale: the gateway calls the eligibility, credential, and basket checks, then settles through the payout risk service.

Batch analytics reads the stream of sales once a month. Three evidence services feed one scoring engine. External sources sit outside the packages, because the program reads them and cannot change them.

```guest-html
<figure class="fig" id="uml-sw-components">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A5</span><h4>The platform as components</h4><p class="g-dek">Real-time services guard each sale, batch analytics scores stores each month, and case outcomes flow back as labels.</p></div>
  <div class="fig-body">
<svg viewBox="0 0 900 800" role="img" aria-label="UML component diagram of the fraud-prevention platform. In the real-time path, the authorization gateway requires eligibility, credential, basket check, and settlement interfaces. Batch analytics reads sale events: reference prices, ring analysis, and inventory reconciliation against supplier invoices feed a store-month scoring engine, which gives risk tiers to the payout risk service and scores to an expected-loss ranker. The ranker feeds case management, and case outcomes return to scoring as labels.">
<defs><marker id="uml-sw-components-tri-ink" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-ink"></path></marker><marker id="uml-sw-components-open-ink" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-ink" stroke-width="1.3"></path></marker><marker id="uml-sw-components-tri-muted" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-muted"></path></marker><marker id="uml-sw-components-open-muted" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-muted" stroke-width="1.3"></path></marker><marker id="uml-sw-components-tri-fraud" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-fraud"></path></marker><marker id="uml-sw-components-open-fraud" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-fraud" stroke-width="1.3"></path></marker><marker id="uml-sw-components-tri-caution" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-caution"></path></marker><marker id="uml-sw-components-open-caution" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-caution" stroke-width="1.3"></path></marker><marker id="uml-sw-components-tri-defense" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-defense"></path></marker><marker id="uml-sw-components-open-defense" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-defense" stroke-width="1.3"></path></marker></defs>
<rect x="10" y="10" width="109.3" height="18" class="g-f-neutral-tint g-s-muted" stroke-width="1"></rect>
<rect x="10" y="28" width="655" height="312" class="g-s-muted" fill="none" stroke-width="1"></rect>
<rect x="10" y="370" width="115.7" height="18" class="g-f-neutral-tint g-s-muted" stroke-width="1"></rect>
<rect x="10" y="388" width="655" height="262" class="g-s-muted" fill="none" stroke-width="1"></rect>
<rect x="10" y="670" width="83.8" height="18" class="g-f-neutral-tint g-s-muted" stroke-width="1"></rect>
<rect x="10" y="688" width="655" height="102" class="g-s-muted" fill="none" stroke-width="1"></rect>
<path d="M110 108 L66 108" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M150 146 L150 170" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M150 388 L150 183" class="g-s-muted" fill="none" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#uml-sw-components-open-muted)"></path>
<path d="M470 76 L422 76" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M416 86 A10 10 0 0 1 416 66" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M300 76 L406 76" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M470 140 L422 140" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M416 150 A10 10 0 0 1 416 130" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M300 100 L370 100 L370 140 L406 140" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M470 204 L422 204" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M416 214 A10 10 0 0 1 416 194" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M300 120 L350 120 L350 204 L406 204" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M250 264 L250 246" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M240 240 A10 10 0 0 1 260 240" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M250 146 L250 230" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M740 76 L712 76" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M706 86 A10 10 0 0 1 706 66" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M650 76 L696 76" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M740 140 L712 140" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M706 150 A10 10 0 0 1 706 130" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M650 92 L658 92 L658 140 L696 140" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M740 456 L712 456" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M706 466 A10 10 0 0 1 706 446" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M650 456 L696 456" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M115 488 L115 500" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M125 506 A10 10 0 0 1 105 506" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M115 560 L115 516" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M345 488 L345 500" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M355 506 A10 10 0 0 1 335 506" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M270 560 L270 526 L345 526 L345 516" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M565 488 L565 500" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M575 506 A10 10 0 0 1 555 506" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M285 560 L285 540 L565 540 L565 516" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M225 560 L225 542" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M215 536 A10 10 0 0 1 235 536" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M225 316 L225 526" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M300 588 L344 588" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M350 578 A10 10 0 0 1 350 598" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M400 588 L360 588" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M490 616 L490 628" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M500 634 A10 10 0 0 1 480 634" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M490 712 L490 644" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M400 740 L356 740" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M350 750 A10 10 0 0 1 350 730" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M200 616 L200 740 L340 740" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<rect x="110" y="70" width="190" height="76" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="283" y="77" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="280" y="80" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="280" y="85" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="60" cy="108" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="150" cy="176" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="470" y="50" width="180" height="52" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="633" y="57" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="60" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="65" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="416" cy="76" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="470" y="114" width="180" height="52" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="633" y="121" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="124" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="129" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="416" cy="140" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="470" y="172" width="180" height="64" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="633" y="179" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="182" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="187" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="416" cy="204" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="165" y="264" width="170" height="52" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="318" y="271" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="315" y="274" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="315" y="279" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="250" cy="240" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="740" y="47" width="150" height="58" class="g-f-neutral-tint g-s-muted" rx="3" stroke-width="1.2" stroke-dasharray="5 3"></rect>
<rect x="873" y="54" width="11" height="14" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="57" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="62" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<circle cx="706" cy="76" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="740" y="111" width="150" height="58" class="g-f-neutral-tint g-s-muted" rx="3" stroke-width="1.2" stroke-dasharray="5 3"></rect>
<rect x="873" y="118" width="11" height="14" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="121" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="126" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<circle cx="706" cy="140" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="740" y="427" width="150" height="58" class="g-f-neutral-tint g-s-muted" rx="3" stroke-width="1.2" stroke-dasharray="5 3"></rect>
<rect x="873" y="434" width="11" height="14" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="437" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<rect x="870" y="442" width="7" height="3" class="g-f-surface g-s-muted" stroke-width="1"></rect>
<circle cx="706" cy="456" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="30" y="424" width="170" height="64" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="183" y="431" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="180" y="434" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="180" y="439" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="260" y="424" width="170" height="64" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="413" y="431" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="410" y="434" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="410" y="439" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="480" y="424" width="170" height="64" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="633" y="431" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="434" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="630" y="439" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="100" y="560" width="200" height="56" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="283" y="567" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="280" y="570" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="280" y="575" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="400" y="560" width="180" height="56" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="563" y="567" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="560" y="570" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="560" y="575" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="115" cy="506" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="345" cy="506" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="565" cy="506" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="225" cy="536" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="350" cy="588" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<rect x="400" y="712" width="180" height="56" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="563" y="719" width="11" height="14" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="560" y="722" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<rect x="560" y="727" width="7" height="3" class="g-f-surface g-s-defense" stroke-width="1"></rect>
<circle cx="490" cy="634" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<circle cx="350" cy="740" r="6" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<text x="18" y="23" class="g-f-ink" font-size="11" font-weight="700">Real-time path</text>
<text x="18" y="383" class="g-f-ink" font-size="11" font-weight="700">Batch analytics</text>
<text x="18" y="683" class="g-f-ink" font-size="11" font-weight="700">Operations</text>
<text x="740" y="36" class="g-f-muted" font-size="11" font-style="italic">Outside the program</text>
<text x="120" y="92" class="g-f-ink" font-size="12" font-weight="700">Authorization gateway</text>
<text x="120" y="108" class="g-f-muted" font-size="11">EBT processor, each sale</text>
<text x="60" y="94" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IAuthorize</text>
<text x="60" y="128" class="g-f-muted" font-size="11" text-anchor="middle">POS terminals</text>
<text x="140" y="180" class="g-f-ink g-mono" font-size="11" text-anchor="end">ISaleEvents</text>
<text x="158" y="362" class="g-f-muted" font-size="11">«use»</text>
<text x="480" y="72" class="g-f-ink" font-size="12" font-weight="700">Eligibility service</text>
<text x="480" y="88" class="g-f-muted" font-size="11">income, NAC, household</text>
<text x="416" y="62" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IEligibility</text>
<text x="480" y="136" class="g-f-ink" font-size="12" font-weight="700">Card and credential</text>
<text x="480" y="152" class="g-f-muted" font-size="11">lock, blocks, step-up</text>
<text x="416" y="126" class="g-f-ink g-mono" font-size="11" text-anchor="middle">ICredential</text>
<text x="480" y="194" class="g-f-ink" font-size="12" font-weight="700">Basket validation</text>
<text x="480" y="210" class="g-f-muted" font-size="11">eligible items,</text>
<text x="480" y="224" class="g-f-muted" font-size="11">store catalog</text>
<text x="416" y="190" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IBasketCheck</text>
<text x="175" y="286" class="g-f-ink" font-size="12" font-weight="700">Payout risk service</text>
<text x="175" y="302" class="g-f-muted" font-size="11">tiers, delays, caps</text>
<text x="264" y="244" class="g-f-ink g-mono" font-size="11">ISettlement</text>
<text x="750" y="64" class="g-f-muted" font-size="11" font-style="italic">«external»</text>
<text x="750" y="80" class="g-f-ink" font-size="12" font-weight="700">Income match</text>
<text x="750" y="96" class="g-f-muted" font-size="11">payroll, tax, bank</text>
<text x="706" y="62" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IIncome</text>
<text x="750" y="128" class="g-f-muted" font-size="11" font-style="italic">«external»</text>
<text x="750" y="144" class="g-f-ink" font-size="12" font-weight="700">Duplicate check</text>
<text x="750" y="160" class="g-f-muted" font-size="11">national (NAC)</text>
<text x="706" y="126" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IDupCheck</text>
<text x="750" y="444" class="g-f-muted" font-size="11" font-style="italic">«external»</text>
<text x="750" y="460" class="g-f-ink" font-size="12" font-weight="700">Supplier invoices</text>
<text x="750" y="476" class="g-f-muted" font-size="11">distributor feeds</text>
<text x="706" y="442" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IInvoices</text>
<text x="40" y="446" class="g-f-ink" font-size="12" font-weight="700">Reference price</text>
<text x="40" y="461" class="g-f-ink" font-size="12" font-weight="700">service</text>
<text x="40" y="477" class="g-f-muted" font-size="11">UPC, region, month</text>
<text x="270" y="446" class="g-f-ink" font-size="12" font-weight="700">Graph and ring</text>
<text x="270" y="461" class="g-f-ink" font-size="12" font-weight="700">analysis</text>
<text x="270" y="477" class="g-f-muted" font-size="11">card-store graph</text>
<text x="490" y="446" class="g-f-ink" font-size="12" font-weight="700">Inventory</text>
<text x="490" y="461" class="g-f-ink" font-size="12" font-weight="700">reconciliation</text>
<text x="490" y="477" class="g-f-muted" font-size="11">sales vs purchases</text>
<text x="110" y="582" class="g-f-ink" font-size="12" font-weight="700">Scoring engine</text>
<text x="110" y="598" class="g-f-muted" font-size="11">store-month scores</text>
<text x="410" y="582" class="g-f-ink" font-size="12" font-weight="700">Expected-loss ranker</text>
<text x="410" y="598" class="g-f-muted" font-size="11">budget-capped top N</text>
<text x="127" y="510" class="g-f-ink g-mono" font-size="11">IRefPrice</text>
<text x="357" y="510" class="g-f-ink g-mono" font-size="11">IRingSignal</text>
<text x="577" y="510" class="g-f-ink g-mono" font-size="11">ISupplyGap</text>
<text x="213" y="540" class="g-f-ink g-mono" font-size="11" text-anchor="end">IRiskTier</text>
<text x="350" y="574" class="g-f-ink g-mono" font-size="11" text-anchor="middle">IStoreScore</text>
<text x="410" y="734" class="g-f-ink" font-size="12" font-weight="700">Case management</text>
<text x="410" y="750" class="g-f-muted" font-size="11">investigation queue</text>
<text x="504" y="638" class="g-f-ink g-mono" font-size="11">IRankedStores</text>
<text x="350" y="726" class="g-f-ink g-mono" font-size="11" text-anchor="middle">ILabels</text>
<text x="210" y="758" class="g-f-muted" font-size="11">confirmed and cleared outcomes</text>
</svg>
  </div>
  <figcaption><strong>Read it as:</strong> a ball is an interface a component provides, and a cup is one it requires. The gateway calls three checks on every sale and settles through payout risk. Only two outputs leave the scoring engine: a risk tier for payouts and scores for the ranker. People see only the ranked list, and their outcomes retrain the engine.</figcaption>
</figure>
```

The sequence diagram follows one EBT purchase once the basket travels with the authorization. The processor checks every line against SNAP eligibility and the store catalog before it touches the balance. A valid basket then passes a risk check. Only a large spend soon after the monthly load triggers a step-up confirmation in the recipient app, and a recipient without a phone fails open.

An invalid basket is declined at the register. The processor still reports the line, because a store that keeps keying items it never stocks is a signal for the monthly score.

```guest-html
<figure class="fig" id="uml-sw-auth-sequence">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A6</span><h4>One purchase, line by line</h4><p class="g-dek">The processor checks every basket line before it touches the balance, and asks the recipient only when a spend looks like a load-day drain.</p></div>
  <div class="fig-body">
<svg viewBox="0 0 900 694" role="img" aria-label="UML sequence diagram of one EBT purchase with item-level basket data. The POS terminal sends the sale with its item lines to the EBT processor, which asks the basket validator to check every line. If every line is eligible and in the store catalog, the processor asks the risk service, may ask the recipient to confirm a large spend soon after the benefit load, debits the benefit ledger, and returns an itemized receipt. Otherwise the sale is declined at the register and the flagged line goes to the risk service.">
<defs><marker id="uml-sw-auth-sequence-tri-ink" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-ink"></path></marker><marker id="uml-sw-auth-sequence-open-ink" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-ink" stroke-width="1.3"></path></marker><marker id="uml-sw-auth-sequence-tri-muted" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-muted"></path></marker><marker id="uml-sw-auth-sequence-open-muted" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-muted" stroke-width="1.3"></path></marker><marker id="uml-sw-auth-sequence-tri-fraud" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-fraud"></path></marker><marker id="uml-sw-auth-sequence-open-fraud" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-fraud" stroke-width="1.3"></path></marker><marker id="uml-sw-auth-sequence-tri-caution" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-caution"></path></marker><marker id="uml-sw-auth-sequence-open-caution" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-caution" stroke-width="1.3"></path></marker><marker id="uml-sw-auth-sequence-tri-defense" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-defense"></path></marker><marker id="uml-sw-auth-sequence-open-defense" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-defense" stroke-width="1.3"></path></marker></defs>
<rect x="32" y="328" width="370" height="88" class="g-s-caution" fill="none" stroke-width="1.2"></rect>
<path d="M32 328 H65.1 V339 L58.1 346 H32 Z" class="g-f-caution-tint g-s-caution" stroke-width="1.2"></path>
<rect x="22" y="238" width="860" height="432" class="g-s-muted" fill="none" stroke-width="1.2"></rect>
<path d="M22 238 H55.1 V249 L48.1 256 H22 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
<path d="M22 550 L882 550" class="g-s-muted" fill="none" stroke-width="1.1" stroke-dasharray="6 4"></path>
<path d="M70 76 L70 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M220 58 L220 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M370 58 L370 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M520 58 L520 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M670 58 L670 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M820 58 L820 686" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<rect x="515" y="192" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="815" y="282" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="65" y="372" width="10" height="30" class="g-f-caution-tint g-s-caution" stroke-width="1.1"></rect>
<rect x="665" y="446" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="815" y="596" width="10" height="14" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="215" y="106" width="10" height="556" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="365" y="149" width="10" height="483" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<path d="M70 106 L215 106" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-ink)"></path>
<path d="M225 149 L365 149" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-ink)"></path>
<path d="M375 192 L515 192" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-ink)"></path>
<path d="M515 222 L375 222" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M375 282 L815 282" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-ink)"></path>
<path d="M815 312 L375 312" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M365 372 L75 372" class="g-s-caution" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-caution)"></path>
<path d="M75 402 L365 402" class="g-s-caution" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-caution)"></path>
<path d="M402 368 L430 368" class="g-s-caution" fill="none" stroke-width="1" stroke-dasharray="3 3"></path>
<path d="M375 446 L665 446" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-tri-ink)"></path>
<path d="M665 476 L375 476" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M365 506 L225 506" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M215 536 L70 536" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M375 596 L815 596" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-auth-sequence-open-ink)"></path>
<path d="M365 626 L225 626" class="g-s-fraud" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-fraud)"></path>
<path d="M215 656 L70 656" class="g-s-fraud" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-auth-sequence-open-fraud)"></path>
<circle cx="70" cy="18" r="7" class="g-f-surface g-s-ink" stroke-width="1.2"></circle>
<path d="M70 25 L70 40" class="g-s-ink" fill="none" stroke-width="1.4"></path>
<path d="M58 31 L82 31" class="g-s-ink" fill="none" stroke-width="1.4"></path>
<path d="M60 53 L70 40 L80 53" class="g-s-ink" fill="none" stroke-width="1.4"></path>
<rect x="155" y="14" width="130" height="44" class="g-f-neutral-tint g-s-muted" rx="3" stroke-width="1.2"></rect>
<rect x="305" y="14" width="130" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="455" y="14" width="130" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="605" y="14" width="130" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="755" y="14" width="130" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<path d="M430 348 H598 L608 358 V388 H430 Z" class="g-f-caution-tint g-s-caution" stroke-width="1.1"></path>
<path d="M598 348 V358 H608" class="g-s-caution" fill="none" stroke-width="1.1"></path>
<rect x="86.7" y="90" width="111.6" height="15" class="g-f-surface"></rect>
<rect x="232.6" y="120" width="124.8" height="15" class="g-f-surface"></rect>
<rect x="222.4" y="133" width="145.2" height="15" class="g-f-surface"></rect>
<rect x="379.3" y="163" width="131.4" height="15" class="g-f-surface"></rect>
<rect x="378.5" y="176" width="133.1" height="15" class="g-f-surface"></rect>
<rect x="412.3" y="206" width="65.4" height="15" class="g-f-surface"></rect>
<rect x="496.3" y="266" width="197.4" height="15" class="g-f-surface"></rect>
<rect x="549.1" y="296" width="91.8" height="15" class="g-f-surface"></rect>
<rect x="160.9" y="356" width="118.2" height="15" class="g-f-surface"></rect>
<rect x="177.4" y="386" width="85.2" height="15" class="g-f-surface"></rect>
<rect x="70.1" y="331" width="320.6" height="15" class="g-f-surface"></rect>
<rect x="447.7" y="430" width="144.6" height="15" class="g-f-surface"></rect>
<rect x="467.5" y="460" width="105" height="15" class="g-f-surface"></rect>
<rect x="222.7" y="490" width="144.6" height="15" class="g-f-surface"></rect>
<rect x="73.5" y="520" width="138" height="15" class="g-f-surface"></rect>
<rect x="512.8" y="580" width="164.4" height="15" class="g-f-surface"></rect>
<rect x="226" y="610" width="138" height="15" class="g-f-surface"></rect>
<rect x="76.8" y="640" width="131.4" height="15" class="g-f-surface"></rect>
<rect x="60.1" y="241" width="284.3" height="15" class="g-f-surface"></rect>
<rect x="27" y="554" width="326.7" height="15" class="g-f-surface"></rect>
<text x="70" y="70" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Recipient</text>
<text x="220" y="40" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">POS terminal</text>
<text x="370" y="40" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">EBT processor</text>
<text x="520" y="40" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Basket validator</text>
<text x="670" y="33" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Benefit ledger</text>
<text x="670" y="47" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">(state)</text>
<text x="820" y="40" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Risk service</text>
<text x="142.5" y="100" class="g-f-ink g-mono" font-size="11" text-anchor="middle">1: tap card, PIN</text>
<text x="295" y="130" class="g-f-ink g-mono" font-size="11" text-anchor="middle">2: authorize(sale)</text>
<text x="295" y="143" class="g-f-muted" font-size="11" text-anchor="middle">card, total, item lines</text>
<text x="445" y="173" class="g-f-ink g-mono" font-size="11" text-anchor="middle">3: validate(basket)</text>
<text x="445" y="186" class="g-f-muted" font-size="11" text-anchor="middle">eligible? in catalog?</text>
<text x="445" y="216" class="g-f-ink g-mono" font-size="11" text-anchor="middle">4: result</text>
<text x="595" y="276" class="g-f-ink g-mono" font-size="11" text-anchor="middle">5: assess(card, store, total)</text>
<text x="595" y="306" class="g-f-ink g-mono" font-size="11" text-anchor="middle">6: risk flags</text>
<text x="220" y="366" class="g-f-caution g-mono" font-size="11" text-anchor="middle">7: confirm in app</text>
<text x="220" y="396" class="g-f-caution g-mono" font-size="11" text-anchor="middle">8: confirmed</text>
<text x="38" y="341" class="g-f-caution" font-size="11" font-weight="700">opt</text>
<text x="73.1" y="341" class="g-f-caution" font-size="11">[large spend soon after load, far from usual stores]</text>
<text x="438" y="365" class="g-f-caution" font-size="11" font-weight="700">No phone: fail open</text>
<text x="438" y="379" class="g-f-ink" font-size="11">approve without the app</text>
<text x="520" y="440" class="g-f-ink g-mono" font-size="11" text-anchor="middle">9: debit(card, total)</text>
<text x="520" y="470" class="g-f-ink g-mono" font-size="11" text-anchor="middle">10: new balance</text>
<text x="295" y="500" class="g-f-ink g-mono" font-size="11" text-anchor="middle">11: approved, balance</text>
<text x="142.5" y="530" class="g-f-ink g-mono" font-size="11" text-anchor="middle">12: itemized receipt</text>
<text x="595" y="590" class="g-f-ink g-mono" font-size="11" text-anchor="middle">13: flagLine(store, UPC)</text>
<text x="295" y="620" class="g-f-fraud g-mono" font-size="11" text-anchor="middle">14: declined: line n</text>
<text x="142.5" y="650" class="g-f-fraud g-mono" font-size="11" text-anchor="middle">15: declined, retry</text>
<text x="28" y="251" class="g-f-ink" font-size="11" font-weight="700">alt</text>
<text x="63.1" y="251" class="g-f-ink" font-size="11">[every line eligible and in the store catalog]</text>
<text x="30" y="564" class="g-f-ink" font-size="11">[else: ineligible item, or item not in store catalog]</text>
</svg>
  </div>
  <figcaption><strong>Read it as:</strong> solid arrows with filled heads are calls, dashed arrows are replies, and the open-headed arrow is a one-way signal. The alt frame runs exactly one branch; the opt frame runs only when its guard holds. A rejected line ends the sale before any money moves, and the risk service still hears about it.</figcaption>
</figure>
```

The class diagram names the records the software keeps. Two structures mirror each other: a transaction owns its basket lines, and a supplier invoice owns its invoice lines. Both kinds of line point at the same product barcode. That shared key makes reconciliation possible, because the store writes one side and its suppliers write the other.

Scores attach to a retailer and a month, never to a single basket. A score can open a case or trigger an automatic action, and every action carries an expiry and an appeal.

```guest-html
<figure class="fig" id="uml-sw-domain-model">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A7</span><h4>The domain model</h4><p class="g-dek">Thirteen classes carry the design: sales with their lines, purchases with theirs, and scores that open cases.</p></div>
  <div class="fig-body">
<svg viewBox="0 0 900 850" role="img" aria-label="UML class diagram of the core domain. A household aggregates recipients, who hold cards that pay for transactions at retailers. A transaction is composed of basket lines and a supplier invoice is composed of invoice lines; both kinds of line point at one product barcode, which also carries regional reference prices. A retailer has store-month scores; a score can open a case or trigger automatic actions, and a case orders actions.">
<defs><marker id="uml-sw-domain-model-tri-ink" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-ink"></path></marker><marker id="uml-sw-domain-model-open-ink" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-ink" stroke-width="1.3"></path></marker><marker id="uml-sw-domain-model-tri-muted" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-muted"></path></marker><marker id="uml-sw-domain-model-open-muted" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-muted" stroke-width="1.3"></path></marker><marker id="uml-sw-domain-model-tri-fraud" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-fraud"></path></marker><marker id="uml-sw-domain-model-open-fraud" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-fraud" stroke-width="1.3"></path></marker><marker id="uml-sw-domain-model-tri-caution" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-caution"></path></marker><marker id="uml-sw-domain-model-open-caution" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-caution" stroke-width="1.3"></path></marker><marker id="uml-sw-domain-model-tri-defense" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-defense"></path></marker><marker id="uml-sw-domain-model-open-defense" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-defense" stroke-width="1.3"></path></marker></defs>
<path d="M97.5 146 L97.5 186" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M97.5 264 L97.5 365" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M332.5 506 L332.5 546" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M802.5 474 L802.5 546" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M567.5 639 L567.5 695" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M567.5 309 L567.5 365" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M567.5 130 L567.5 186" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M185 410 L245 410" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M420 410 L480 410" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M655 410 L715 410" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M420 591 L480 591" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M655 591 L715 591" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M655 65 L715 65" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<path d="M655 250 L802.5 250 L802.5 130" class="g-s-ink" fill="none" stroke-width="1.2"></path>
<rect x="10" y="20" width="175" height="110" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="10" y="20" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M10 103 L185 103" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="480" y="20" width="175" height="110" class="g-f-surface g-s-caution" stroke-width="1.2"></rect>
<rect x="480" y="20" width="175" height="26" class="g-f-caution-tint g-s-caution" stroke-width="1.2"></rect>
<path d="M480 103 L655 103" class="g-s-caution" fill="none" stroke-width="1.2"></path>
<rect x="715" y="20" width="175" height="110" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="715" y="20" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M715 103 L890 103" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="10" y="186" width="175" height="78" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="10" y="186" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M10 254 L185 254" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="480" y="186" width="175" height="123" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="480" y="186" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M480 299 L655 299" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="10" y="365" width="175" height="110" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="10" y="365" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M10 448 L185 448" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="245" y="365" width="175" height="125" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="245" y="365" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M245 463 L420 463" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="480" y="365" width="175" height="110" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="480" y="365" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M480 448 L655 448" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="715" y="365" width="175" height="93" class="g-f-surface g-s-muted" stroke-width="1.2"></rect>
<rect x="715" y="365" width="175" height="26" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></rect>
<path d="M715 448 L890 448" class="g-s-muted" fill="none" stroke-width="1.2"></path>
<rect x="245" y="546" width="175" height="93" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="245" y="546" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M245 629 L420 629" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="480" y="546" width="175" height="93" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="480" y="546" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M480 629 L655 629" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<rect x="715" y="546" width="175" height="78" class="g-f-surface g-s-muted" stroke-width="1.2"></rect>
<rect x="715" y="546" width="175" height="26" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></rect>
<path d="M715 614 L890 614" class="g-s-muted" fill="none" stroke-width="1.2"></path>
<rect x="480" y="695" width="175" height="140" class="g-f-surface g-s-defense" stroke-width="1.2"></rect>
<rect x="480" y="695" width="175" height="26" class="g-f-defense-tint g-s-defense" stroke-width="1.2"></rect>
<path d="M480 808 L655 808" class="g-s-defense" fill="none" stroke-width="1.2"></path>
<path d="M97.5 130 L92.5 138 L97.5 146 L102.5 138 Z" class="g-f-surface g-s-ink" stroke-width="1.2"></path>
<path d="M332.5 490 L327.5 498 L332.5 506 L337.5 498 Z" class="g-f-ink g-s-ink" stroke-width="1.2"></path>
<path d="M802.5 458 L797.5 466 L802.5 474 L807.5 466 Z" class="g-f-ink g-s-ink" stroke-width="1.2"></path>
<rect x="12" y="562" width="16" height="11" class="g-f-defense-tint g-s-defense" stroke-width="1"></rect>
<rect x="12" y="582" width="16" height="11" class="g-f-neutral-tint g-s-muted" stroke-width="1"></rect>
<rect x="12" y="602" width="16" height="11" class="g-f-caution-tint g-s-caution" stroke-width="1"></rect>
<text x="97.5" y="37" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Household</text>
<text x="18" y="63" class="g-f-ink g-mono" font-size="11">- caseId: String</text>
<text x="18" y="78" class="g-f-ink g-mono" font-size="11">- state: StateCode</text>
<text x="18" y="93" class="g-f-ink g-mono" font-size="11">- benefit: Money</text>
<text x="18" y="120" class="g-f-ink g-mono" font-size="11">+ recertify(): Result</text>
<text x="567.5" y="37" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Case</text>
<text x="488" y="63" class="g-f-ink g-mono" font-size="11">- caseId: String</text>
<text x="488" y="78" class="g-f-ink g-mono" font-size="11">- opened: Date</text>
<text x="488" y="93" class="g-f-ink g-mono" font-size="11">- outcome: Outcome</text>
<text x="488" y="120" class="g-f-ink g-mono" font-size="11">+ close(o: Outcome)</text>
<text x="802.5" y="37" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Action</text>
<text x="723" y="63" class="g-f-ink g-mono" font-size="11">- kind: ActionKind</text>
<text x="723" y="78" class="g-f-ink g-mono" font-size="11">- reversible: Boolean</text>
<text x="723" y="93" class="g-f-ink g-mono" font-size="11">- expires: Date</text>
<text x="723" y="120" class="g-f-ink g-mono" font-size="11">+ appeal(): Result</text>
<text x="97.5" y="203" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Recipient</text>
<text x="18" y="229" class="g-f-ink g-mono" font-size="11">- token: PersonToken</text>
<text x="18" y="244" class="g-f-ink g-mono" font-size="11">- hasPhone: Boolean</text>
<text x="567.5" y="203" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">StoreMonthScore</text>
<text x="488" y="229" class="g-f-ink g-mono" font-size="11">- month: YearMonth</text>
<text x="488" y="244" class="g-f-ink g-mono" font-size="11">- excessShare: Decimal</text>
<text x="488" y="259" class="g-f-ink g-mono" font-size="11">- supplyRatio: Decimal</text>
<text x="488" y="274" class="g-f-ink g-mono" font-size="11">- pFraud: Decimal</text>
<text x="488" y="289" class="g-f-ink g-mono" font-size="11">- /expectedLoss: Money</text>
<text x="97.5" y="382" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Card</text>
<text x="18" y="408" class="g-f-ink g-mono" font-size="11">- cardToken: Token</text>
<text x="18" y="423" class="g-f-ink g-mono" font-size="11">- chip: Boolean</text>
<text x="18" y="438" class="g-f-ink g-mono" font-size="11">- locked: Boolean</text>
<text x="18" y="465" class="g-f-ink g-mono" font-size="11">+ lock(): void</text>
<text x="332.5" y="382" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Transaction</text>
<text x="253" y="408" class="g-f-ink g-mono" font-size="11">- txnId: String</text>
<text x="253" y="423" class="g-f-ink g-mono" font-size="11">- time: DateTime</text>
<text x="253" y="438" class="g-f-ink g-mono" font-size="11">- total: Money</text>
<text x="253" y="453" class="g-f-ink g-mono" font-size="11">- status: AuthStatus</text>
<text x="253" y="480" class="g-f-ink g-mono" font-size="11">+ validate(): Result</text>
<text x="567.5" y="382" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Retailer</text>
<text x="488" y="408" class="g-f-ink g-mono" font-size="11">- storeId: String</text>
<text x="488" y="423" class="g-f-ink g-mono" font-size="11">- storeClass: StoreClass</text>
<text x="488" y="438" class="g-f-ink g-mono" font-size="11">- tier: RiskTier</text>
<text x="488" y="465" class="g-f-ink g-mono" font-size="11">+ setTier(t: RiskTier)</text>
<text x="802.5" y="382" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">SupplierInvoice</text>
<text x="723" y="408" class="g-f-ink g-mono" font-size="11">- invoiceId: String</text>
<text x="723" y="423" class="g-f-ink g-mono" font-size="11">- supplier: String</text>
<text x="723" y="438" class="g-f-ink g-mono" font-size="11">- date: Date</text>
<text x="332.5" y="563" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">BasketLine</text>
<text x="253" y="589" class="g-f-ink g-mono" font-size="11">- qty: Integer</text>
<text x="253" y="604" class="g-f-ink g-mono" font-size="11">- unitPrice: Money</text>
<text x="253" y="619" class="g-f-ink g-mono" font-size="11">- eligible: Boolean</text>
<text x="567.5" y="563" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">Product</text>
<text x="488" y="589" class="g-f-ink g-mono" font-size="11">- upc: UPC</text>
<text x="488" y="604" class="g-f-ink g-mono" font-size="11">- category: Category</text>
<text x="488" y="619" class="g-f-ink g-mono" font-size="11">- snapEligible: Boolean</text>
<text x="802.5" y="563" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">InvoiceLine</text>
<text x="723" y="589" class="g-f-ink g-mono" font-size="11">- qty: Integer</text>
<text x="723" y="604" class="g-f-ink g-mono" font-size="11">- unitCost: Money</text>
<text x="567.5" y="712" class="g-f-ink" font-size="12" text-anchor="middle" font-weight="700">ReferencePrice</text>
<text x="488" y="738" class="g-f-ink g-mono" font-size="11">- region: Region</text>
<text x="488" y="753" class="g-f-ink g-mono" font-size="11">- month: YearMonth</text>
<text x="488" y="768" class="g-f-ink g-mono" font-size="11">- storeClass: StoreClass</text>
<text x="488" y="783" class="g-f-ink g-mono" font-size="11">- median: Money</text>
<text x="488" y="798" class="g-f-ink g-mono" font-size="11">- iqr: Money</text>
<text x="488" y="825" class="g-f-ink g-mono" font-size="11">+ upperBound(): Money</text>
<text x="104.5" y="148" class="g-f-ink g-mono" font-size="11">1</text>
<text x="104.5" y="181" class="g-f-ink g-mono" font-size="11">1..*</text>
<text x="90.5" y="181" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">members</text>
<text x="104.5" y="278" class="g-f-ink g-mono" font-size="11">1</text>
<text x="104.5" y="360" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="90.5" y="360" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">cards</text>
<text x="339.5" y="508" class="g-f-ink g-mono" font-size="11">1</text>
<text x="339.5" y="541" class="g-f-ink g-mono" font-size="11">1..*</text>
<text x="325.5" y="541" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">lines</text>
<text x="809.5" y="476" class="g-f-ink g-mono" font-size="11">1</text>
<text x="809.5" y="541" class="g-f-ink g-mono" font-size="11">1..*</text>
<text x="795.5" y="541" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">lines</text>
<text x="574.5" y="653" class="g-f-ink g-mono" font-size="11">1</text>
<text x="574.5" y="690" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="560.5" y="690" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">prices</text>
<text x="574.5" y="323" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="574.5" y="360" class="g-f-ink g-mono" font-size="11">1</text>
<text x="560.5" y="323" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">scores</text>
<text x="574.5" y="144" class="g-f-ink g-mono" font-size="11">0..1</text>
<text x="574.5" y="181" class="g-f-ink g-mono" font-size="11">1</text>
<text x="560.5" y="144" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">case</text>
<text x="190" y="405" class="g-f-ink g-mono" font-size="11">1</text>
<text x="240" y="405" class="g-f-ink g-mono" font-size="11" text-anchor="end">0..*</text>
<text x="425" y="405" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="475" y="405" class="g-f-ink g-mono" font-size="11" text-anchor="end">1</text>
<text x="477" y="424" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">store</text>
<text x="660" y="405" class="g-f-ink g-mono" font-size="11">1</text>
<text x="710" y="405" class="g-f-ink g-mono" font-size="11" text-anchor="end">0..*</text>
<text x="712" y="424" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">invoices</text>
<text x="425" y="586" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="475" y="586" class="g-f-ink g-mono" font-size="11" text-anchor="end">1</text>
<text x="477" y="605" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">item</text>
<text x="660" y="586" class="g-f-ink g-mono" font-size="11">1</text>
<text x="710" y="586" class="g-f-ink g-mono" font-size="11" text-anchor="end">0..*</text>
<text x="660" y="605" class="g-f-muted" font-size="11" font-style="italic">item</text>
<text x="660" y="59" class="g-f-ink g-mono" font-size="11">0..1</text>
<text x="710" y="79" class="g-f-ink g-mono" font-size="11" text-anchor="end">0..*</text>
<text x="660" y="244" class="g-f-ink g-mono" font-size="11">0..1</text>
<text x="809.5" y="144" class="g-f-ink g-mono" font-size="11">0..*</text>
<text x="795.5" y="144" class="g-f-muted" font-size="11" text-anchor="end" font-style="italic">autoActions</text>
<text x="36" y="572" class="g-f-muted" font-size="11">program record</text>
<text x="36" y="592" class="g-f-muted" font-size="11">third-party evidence</text>
<text x="36" y="612" class="g-f-muted" font-size="11">decided by a person</text>
</svg>
  </div>
  <figcaption><strong>Read it as:</strong> a filled diamond marks a part that lives and dies with its whole, so a basket line exists only inside its transaction. Numbers at each end are multiplicities. Product is the hub: basket lines, invoice lines, and reference prices all point at one barcode, and that shared key lets sales be reconciled against purchases.</figcaption>
</figure>
```

The second sequence diagram shows the batch side. A scheduler starts the run once a month. For each store, the scoring engine gathers three kinds of evidence: excess prices against the regional reference, sales against supplier purchases, and the store's place in the card-store graph. It scores the store-month with shrinkage, so a small store with a few odd lines does not jump the queue.

The ranker sorts stores by expected loss. The investigator budget fixes N before the run starts, so transaction volume never changes how many cases people see.

```guest-html
<figure class="fig" id="uml-sw-scoring-sequence">
  <div class="g-fig-head"><span class="g-eyebrow">Figure A8</span><h4>The monthly scoring run</h4><p class="g-dek">Each month the engine scores every store, the ranker sorts them by expected loss, and the budget decides who gets a person.</p></div>
  <div class="fig-body">
<svg viewBox="0 0 900 998" role="img" aria-label="UML sequence diagram of the monthly scoring run. A scheduler starts the scoring engine. For each store, the engine gets excess prices from the reference price service, the supply ratio from inventory reconciliation, and a ring signal from graph analysis, then scores the store-month. The ranker sorts stores by expected loss. Per store, stores below review cost get no action, stores above cost but outside the budget get a payout delay or volume cap, and the top N within budget get a case. Later, case management sends confirmed and cleared outcomes back to the scoring engine as labels for retraining.">
<defs><marker id="uml-sw-scoring-sequence-tri-ink" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-ink"></path></marker><marker id="uml-sw-scoring-sequence-open-ink" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-ink" stroke-width="1.3"></path></marker><marker id="uml-sw-scoring-sequence-tri-muted" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-muted"></path></marker><marker id="uml-sw-scoring-sequence-open-muted" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-muted" stroke-width="1.3"></path></marker><marker id="uml-sw-scoring-sequence-tri-fraud" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-fraud"></path></marker><marker id="uml-sw-scoring-sequence-open-fraud" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-fraud" stroke-width="1.3"></path></marker><marker id="uml-sw-scoring-sequence-tri-caution" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-caution"></path></marker><marker id="uml-sw-scoring-sequence-open-caution" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-caution" stroke-width="1.3"></path></marker><marker id="uml-sw-scoring-sequence-tri-defense" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="g-f-defense"></path></marker><marker id="uml-sw-scoring-sequence-open-defense" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L9.5 5 L0.5 9.2" fill="none" class="g-s-defense" stroke-width="1.3"></path></marker></defs>
<rect x="125" y="104" width="435" height="264" class="g-s-muted" fill="none" stroke-width="1.2"></rect>
<path d="M125 104 H164.5 V115 L157.5 122 H125 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
<rect x="574" y="507" width="312" height="258" class="g-s-muted" fill="none" stroke-width="1.2"></rect>
<path d="M574 507 H607.1 V518 L600.1 525 H574 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
<path d="M574 559 L886 559" class="g-s-muted" fill="none" stroke-width="1.1" stroke-dasharray="6 4"></path>
<path d="M574 662 L886 662" class="g-s-muted" fill="none" stroke-width="1.1" stroke-dasharray="6 4"></path>
<rect x="566" y="477" width="328" height="302" class="g-s-muted" fill="none" stroke-width="1.2"></rect>
<path d="M566 477 H605.5 V488 L598.5 495 H566 Z" class="g-f-neutral-tint g-s-muted" stroke-width="1.2"></path>
<path d="M60 58 L60 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M171 58 L171 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M283 58 L283 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M394 58 L394 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M506 58 L506 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M617 58 L617 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M729 58 L729 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<path d="M840 58 L840 990" class="g-s-muted" fill="none" stroke-width="1" stroke-dasharray="4 4"></path>
<rect x="278" y="148" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="389" y="208" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="501" y="268" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="171" y="332" width="10" height="16" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="617" y="445" width="10" height="16" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="724" y="618" width="10" height="30" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="835" y="721" width="10" height="30" class="g-f-caution-tint g-s-caution" stroke-width="1.1"></rect>
<rect x="612" y="411" width="10" height="398" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="166" y="88" width="10" height="751" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="55" y="80" width="10" height="765" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="835" y="912" width="10" height="16" class="g-f-caution-tint g-s-caution" stroke-width="1.1"></rect>
<rect x="171" y="956" width="10" height="16" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<rect x="166" y="922" width="10" height="56" class="g-f-defense-tint g-s-defense" stroke-width="1.1"></rect>
<path d="M65 88 L166 88" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M176 148 L278 148" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M278 178 L176 178" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M176 208 L389 208" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M389 238 L176 238" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M176 268 L501 268" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M501 298 L176 298" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M176 322 L203 322 L203 338 L181 338" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M176 411 L612 411" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M622 435 L649 435 L649 451 L627 451" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M622 618 L724 618" class="g-s-ink" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-ink)"></path>
<path d="M724 648 L622 648" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M622 721 L835 721" class="g-s-caution" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-caution)"></path>
<path d="M835 751 L622 751" class="g-s-caution" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-caution)"></path>
<path d="M612 809 L176 809" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M166 839 L65 839" class="g-s-ink" fill="none" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uml-sw-scoring-sequence-open-ink)"></path>
<path d="M835 922 L176 922" class="g-s-defense" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-open-defense)"></path>
<path d="M176 946 L203 946 L203 962 L181 962" class="g-s-defense" fill="none" stroke-width="1.3" marker-end="url(#uml-sw-scoring-sequence-tri-defense)"></path>
<rect x="8" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="119" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="231" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="342" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="454" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="565" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="677" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="788" y="14" width="104" height="44" class="g-f-defense-tint g-s-defense" rx="3" stroke-width="1.2"></rect>
<rect x="66.3" y="72" width="98.4" height="15" class="g-f-surface"></rect>
<rect x="174.5" y="132" width="105" height="15" class="g-f-surface"></rect>
<rect x="177.8" y="162" width="98.4" height="15" class="g-f-surface"></rect>
<rect x="213.5" y="192" width="138" height="15" class="g-f-surface"></rect>
<rect x="253.1" y="222" width="58.8" height="15" class="g-f-surface"></rect>
<rect x="282.7" y="252" width="111.6" height="15" class="g-f-surface"></rect>
<rect x="292.6" y="282" width="91.8" height="15" class="g-f-surface"></rect>
<rect x="208" y="316" width="78.6" height="15" class="g-f-surface"></rect>
<rect x="208" y="330" width="133.1" height="15" class="g-f-surface"></rect>
<rect x="169.5" y="107" width="114.9" height="15" class="g-f-surface"></rect>
<rect x="331.6" y="382" width="124.8" height="15" class="g-f-surface"></rect>
<rect x="309.3" y="395" width="169.4" height="15" class="g-f-surface"></rect>
<rect x="654" y="429" width="164.4" height="15" class="g-f-surface"></rect>
<rect x="587" y="535" width="217.8" height="15" class="g-f-surface"></rect>
<rect x="623.8" y="589" width="98.4" height="15" class="g-f-surface"></rect>
<rect x="639.8" y="602" width="66.5" height="15" class="g-f-surface"></rect>
<rect x="630.4" y="632" width="85.2" height="15" class="g-f-surface"></rect>
<rect x="643" y="692" width="171" height="15" class="g-f-surface"></rect>
<rect x="655.9" y="705" width="145.2" height="15" class="g-f-surface"></rect>
<rect x="692.5" y="735" width="72" height="15" class="g-f-surface"></rect>
<rect x="612.1" y="510" width="145.2" height="15" class="g-f-surface"></rect>
<rect x="579" y="563" width="229.9" height="15" class="g-f-surface"></rect>
<rect x="579" y="666" width="139.1" height="15" class="g-f-surface"></rect>
<rect x="610.5" y="480" width="205.7" height="15" class="g-f-surface"></rect>
<rect x="341.5" y="793" width="105" height="15" class="g-f-surface"></rect>
<rect x="86.1" y="823" width="58.8" height="15" class="g-f-surface"></rect>
<rect x="350.2" y="859" width="199.6" height="15" class="g-f-surface"></rect>
<rect x="396.9" y="893" width="217.2" height="15" class="g-f-surface"></rect>
<rect x="432.9" y="906" width="145.2" height="15" class="g-f-surface"></rect>
<rect x="208" y="940" width="131.4" height="15" class="g-f-surface"></rect>
<text x="60" y="40" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Scheduler</text>
<text x="171" y="40" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Scoring engine</text>
<text x="283" y="33" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Reference price</text>
<text x="283" y="47" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">service</text>
<text x="394" y="33" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Inventory</text>
<text x="394" y="47" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">reconciliation</text>
<text x="506" y="40" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Graph analysis</text>
<text x="617" y="40" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Ranker</text>
<text x="729" y="33" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Payout risk</text>
<text x="729" y="47" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">service</text>
<text x="840" y="33" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">Case</text>
<text x="840" y="47" class="g-f-ink" font-size="11" text-anchor="middle" font-weight="700">management</text>
<text x="115.5" y="82" class="g-f-ink g-mono" font-size="11" text-anchor="middle">1: runMonth(m)</text>
<text x="227" y="142" class="g-f-ink g-mono" font-size="11" text-anchor="middle">2: excess(s, m)</text>
<text x="227" y="172" class="g-f-ink g-mono" font-size="11" text-anchor="middle">3: excessShare</text>
<text x="282.5" y="202" class="g-f-ink g-mono" font-size="11" text-anchor="middle">4: supplyRatio(s, m)</text>
<text x="282.5" y="232" class="g-f-ink g-mono" font-size="11" text-anchor="middle">5: ratio</text>
<text x="338.5" y="262" class="g-f-ink g-mono" font-size="11" text-anchor="middle">6: ringSignal(s)</text>
<text x="338.5" y="292" class="g-f-ink g-mono" font-size="11" text-anchor="middle">7: ring score</text>
<text x="211" y="326" class="g-f-ink g-mono" font-size="11">8: score(s)</text>
<text x="211" y="340" class="g-f-muted" font-size="11">shrinkage, then model</text>
<text x="131" y="117" class="g-f-ink" font-size="11" font-weight="700">loop</text>
<text x="172.5" y="117" class="g-f-ink" font-size="11">[for each store s]</text>
<text x="394" y="392" class="g-f-ink g-mono" font-size="11" text-anchor="middle">9: rank(scores, N)</text>
<text x="394" y="405" class="g-f-muted" font-size="11" text-anchor="middle">N: reviews the budget funds</text>
<text x="657" y="439" class="g-f-ink g-mono" font-size="11">10: sortByExpectedLoss()</text>
<text x="590" y="545" class="g-f-muted" font-size="11" font-style="italic">no action: score updates next month</text>
<text x="673" y="599" class="g-f-ink g-mono" font-size="11" text-anchor="middle">11: setTier(s)</text>
<text x="673" y="612" class="g-f-muted" font-size="11" text-anchor="middle">delay, cap</text>
<text x="673" y="642" class="g-f-ink g-mono" font-size="11" text-anchor="middle">12: tier set</text>
<text x="728.5" y="702" class="g-f-caution g-mono" font-size="11" text-anchor="middle">13: openCase(s, evidence)</text>
<text x="728.5" y="715" class="g-f-muted" font-size="11" text-anchor="middle">an investigator decides</text>
<text x="728.5" y="745" class="g-f-caution g-mono" font-size="11" text-anchor="middle">14: caseId</text>
<text x="580" y="520" class="g-f-ink" font-size="11" font-weight="700">alt</text>
<text x="615.1" y="520" class="g-f-ink" font-size="11">[benefit &lt; review cost]</text>
<text x="582" y="573" class="g-f-ink" font-size="11">[above review cost, outside budget N]</text>
<text x="582" y="676" class="g-f-ink" font-size="11">[top N, within budget]</text>
<text x="572" y="490" class="g-f-ink" font-size="11" font-weight="700">loop</text>
<text x="613.5" y="490" class="g-f-ink" font-size="11">[for each store s, in rank order]</text>
<text x="394" y="803" class="g-f-ink g-mono" font-size="11" text-anchor="middle">15: ranked list</text>
<text x="115.5" y="833" class="g-f-ink g-mono" font-size="11" text-anchor="middle">16: done</text>
<text x="450" y="869" class="g-f-muted" font-size="11" text-anchor="middle" font-style="italic">later: investigators close cases</text>
<text x="505.5" y="903" class="g-f-defense g-mono" font-size="11" text-anchor="middle">17: outcomes(confirmed, cleared)</text>
<text x="505.5" y="916" class="g-f-muted" font-size="11" text-anchor="middle">labels for the next run</text>
<text x="211" y="950" class="g-f-defense g-mono" font-size="11">18: retrain(labels)</text>
</svg>
  </div>
  <figcaption><strong>Read it as:</strong> the loop frames repeat once per store, and the alt frame picks one branch per store. Only the top N within budget reach case management. The rest get a reversible automatic action or nothing. Closed cases come back weeks later as labels, and the next run trains on them.</figcaption>
</figure>
```

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
