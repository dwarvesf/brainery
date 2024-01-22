---
tags: 
  - r&d
title: Locale Web Mobile
product: null
date: 2023-03-27
description: null
authors: 
  - hieuvd
  - antran
  - bien
  - binhle
  - taipham
menu: earn
toc: null
notice: null
due_date: null
status: Done
PICs: 
  - hieuvd
  - antran
  - bien
  - binhle
  - taipham
completion_date: null
bounty: 100
show_frontmatter: false
type: r&d
---
## **Problem definition**

1. What is your problem, why is it important to you, how does it work? ( very detail of problem)
    - As a product owner I want to expand my app to multiple users across the globes so that I can have more revenue returned
        - App need to work with 1 country
        - App work on multiple countries
2. Real use-case of your problem
- The app need to support **multiple languages**. Adding translation should be easy:
    - English
    - Espanol
    - French
    - Vietnamese
    - Chinese
    - Japanese
    - …
- It’s not just the frontend need to be translated but also data.
- Supports LTR and RTL text
- The app needs to support multiple currencies
    - Multiple currency symbols
    - Multiple currency format
    - Dynamic conversion rate
- Multiple timezones, multiple timezone formats, DST support
3. Explain the financial cost of your problem?
4. How would you like to handle this problem, for example
    1. Cost (optional): we need ready to implement the solution in 1 week and 1 developer can complete the setup in 2 or 3 days.
    2. Time (optional): within 2 weeks
    3. Maximum and minimum results that you can accept  (optional):
5. Assess the complexity of the problem
    1. We have two options:
        - Self implementation
        - 3party services
    2. Need admin portal to manage language translation
    3. Need high-speed change locale and dynamic change by setting when user comeback
6. Describe the output

    Need a solution for an easy move a single-language app to a multiple-language app


Problem statement:

Software/Solution input: Website, mobile app, language translation dictionary

Software/Solution output: Website, mobile app support multiple language, multiple currency, dynamic conversion rate

**II. Technical requirement:**

- Frontend
    - support reactjs, nextjs, react native
- Backend
    - Support language to generate notification, email, report …
    - Support error message
- Database & Infrastructure
- Operation
    - Easy to change translation of a language
    - Easy to add new language
- Integration & API
    - Api support locale by path or query param
- Security & Compliance
    - ensure secure locale service

Solution:

@An Tran

@Hieu Vu

**Pending Actions:**

- BE currency (Hieu)
- Integrate API (An)
- Front-end document (An)
- RTL react native (Tai Pham)

# Solutions

## Backend

### Database Design to support multiple languages [[link](https://earn.d.foundation/733cd5bcb2d64c18b93054762df91bc7?pvs=21)]

## Front-end

### **Libraries [[link](https://earn.d.foundation/a5f3a93b7c5e4d948c0ebb152fafe6a9?pvs=21)]**

### Locale detection [[link](https://earn.d.foundation/a5f3a93b7c5e4d948c0ebb152fafe6a9?pvs=21)]

### **Internationalized Routing [[link](https://earn.d.foundation/a5f3a93b7c5e4d948c0ebb152fafe6a9?pvs=21)]**

### Supports LTR and RTL text [[link](https://earn.d.foundation/a5f3a93b7c5e4d948c0ebb152fafe6a9?pvs=21)]

### Built-in formats [[link](https://earn.d.foundation/246bf4415b434f9db1c6fe81917bb8c7?pvs=21)]

### Support multiple currencies (TBD)

### Continuous localization (TBD)
