---
draft: false
title: Dwarves research
short_title: § Dwarves Research 🧪
description: This is our Labs team homepage, where we list out the latest advances in our engineering team, our publications, events & workshops, as well as frequently asked questions on who and what team labs are.
date: 2023-11-30
authors:
  - monotykamary
tags:
  - dwarves
  - home
  - labs
redirect:
  - /XnEouw
  - /research/notes/advice-should-be-unique-to-the-problem
  - /UlLAEg
  - /research/notes/maslows-hierarchy-of-needs
  - /eeOaKA
  - /research/notes/nerds-arent-fierce
  - /GxzNNw
  - /research/notes/seven-deadly-sins
  - /8AavRQ
  - /research/notes/skandhas-the-five-aggregates
  - /QwUtbw
  - /research/notes/software-101/software-engineering/software-engineering
  - /gsTsSDI
  - /research/notes/software-101/software-syllabus/business-intelligence
  - /GmV8QQ
  - /research/notes/software-101/software-syllabus/machine-learning
  - /RMWkGw
  - /research/notes/software-101/software-syllabus/syllabus
  - /W2D1IQ
  - /research/notes/technology-trend/technology-trend
  - /jQOINg
  - /research/notes/value-chain
  - /t3kYUA
  - /research/notes/why-does-git-use-a-cryptographic-hash-function
  - /tttXDg
  - /research/notes/hr/mbti/calculate-function-stack
  - /zPoczQ
  - /research/notes/hr/mbti/how-to-work-with-all-the-mbti-types
  - /qP3rlQ
  - /research/notes/social-capital
  - /3vfQag
  - /research/topics/communication/metamodernism
  - /ShlBfQ
  - /research/topics/design/understanding-an-application-design
  - /9z8Abg
  - /research/topics/design/understanding-saving-investing-and-speculating-key-differences-and-strategies
  - /mxK8aQ
  - /research/topics/frontend/recursively-export-file-pattern-in-javascript-es6-application
  - /2fjm8w
  - /research/topics/frontend/remove-unused-css-styles-from-bootstrap-using-purgecss
  - /nUoqeQ
  - /research/topics/liquidity/an-overview-of-micro-investment-in-real-estate
  - /0xevvQ
  - /research/topics/llm/how-to-talk-to-chatgpt-effectively
  - /MmO8dw
  - /research/topics/wealth/choose-a-trade-network
  - /research/topics/wealth/pass-down-why-and-how
  - /research/topics/wealth/sg-political-challenges
  - /research/topics/wealth/sgd-pegged-to-usd
  - /topics/communication/metamodernism
  - /topics/design/understanding-an-application-design
  - /topics/design/understanding-saving-investing-and-speculating-key-differences-and-strategies
  - /topics/frontend/recursively-export-file-pattern-in-javascript-es6-application
  - /topics/frontend/remove-unused-css-styles-from-bootstrap-using-purgecss
  - /liquidity/an-overview-of-micro-investment-in-real-estate
  - /llm/how-to-talk-to-chatgpt-effectively
  - /wealth/choose-a-trade-network
  - /wealth/pass-down-why-and-how
  - /wealth/sg-political-challenges
  - /wealth/sgd-pegged-to-usd
---

<p>
    <a href="https://github.com/dwarvesf">
        <img src="https://img.shields.io/badge/-made%20by%20dwarves-%23e13f5e?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAAD1BMVEUAAAD///////////////+PQt5oAAAABXRSTlMAQL//gOnhmfMAAAAJcEhZcwAAHsIAAB7CAW7QdT4AAACYSURBVHicndLRDYJAEIThMbGAI1qAYAO6bAGXYP81uSGBk+O/h3Mev4dhWJCkYZqreOi1xoh0eSIvoCaBRjc1B9+I31g9Z2aJ5jkOsYScBW8zDerO/fObnY/FiTl3caOEH2nMzpyZhezIlgqXr2OlOX617Up/nHnPUg0+LHl18YO50d3ghOy1ioeIq1ceTypsjpvYeJohfQEE5WtH+OEYkwAAAABJRU5ErkJggg==&&logoColor=white" alt="Dwarves Foundation" />
    </a>
    <a href="https://discord.gg/dfoundation">
        <img src="https://img.shields.io/badge/-join%20the%20community-%235865F2?style=for-the-badge&logo=discord&&logoColor=white" alt="Dwarves Network Discord" />
    </a>
</p>

## Latest from research team

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%research%'
  OR ['forward-engineering', 'research'] && tags
ORDER BY date DESC
LIMIT 5;
```

## Key articles for researchers

### Overview

- [Tech transfer framework](transfer.md): Moving research insights from labs to consulting deliverables effectively.
- [Composing forward engineering newsletter](compose.md): Creating monthly tech research and trends summaries.
- [Building a research-first community](../culture/building-a-research-first-community.md): Cultivating innovation and knowledge sharing culture.

### Research methods

- [Good research starts with a good question](/topics/ux/good-research-starts-with-a-good-question): Foundation for conducting meaningful research.
- [Research repositories should generate new knowledge](/topics/ux/research-repositories-should-generate-new-knowledge): Best practices for knowledge management.
- [Landscape of UX research methods](/topics/ux/landscape-of-ux-research-methods): Comprehensive overview of research methodologies.
- [Qualitative research excels at explanation](/topics/ux/Mixed Methods/qualitative-research-excels-at-explanation): Understanding when to use qualitative approaches.

### Tech domains

- [AI & machine learning](/topics/ai): Artificial intelligence research and applications.
- [Blockchain & DeFi](/topics/blockchain): Distributed systems and decentralized finance.
- [Engineering & architecture](/topics/engineering): Software construction and system design.
- [Frontend & mobile](/topics/frontend): User interface and mobile development.
- [Security & ZKP](/topics/security): Cybersecurity and zero-knowledge proofs.

### Design & UX

- [Domain insight research framework](/topics/design/domain-insight-research-framework): Structured approach to understanding problem domains.
- [Personas start with qualitative research](/topics/design/personas-start-with-qualitative-research): Creating user personas through research.
- [UX research methods](/topics/ux): User experience research techniques and tools.

### Knowledge sharing

- [Forward engineering newsletter](/updates/forward): Monthly tech insights and trends publication.
- [Tech radar](/radar): Technology assessment framework (adopt, trial, assess, hold).
- [Build logs](/updates/build-log): Documenting experiments and learnings.

### Others

- [RFC process](rfc): Request for comments and technical proposals.
- [Research notes](notes): Quick insights and discoveries.
- [Innovation & startups](/topics/innovation): Market trends and business opportunities.

---

> Next: [Tech transfer framework](transfer.md)
