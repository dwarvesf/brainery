---
title: Market report February 2024
short_title: February 2024
description: "This month has been a continuation of AI and an upwards trend on FinOps and CyberSecurity. On top of those domains, there has been smaller, but very notable trends on the growth of Software as a Service (SaaS) or MicroSaaS' have rebound and created significant growth for serverless services, as a means to avoid startup and initial running costs. Likewise, AI has been changing how we work and how we design systems to enrich workflows and create more naturally interactive apps."
date: 2024-03-01
authors:
  - monotykamary
  - zlatanpham
tags:
  - ai
  - llm
  - cybersecurity
  - labs
  - market-report
  - serverless
redirect:
  - /gOkEiw
---

## Trends on our radar

This month has been a continuation of AI and an upwards trend on FinOps and CyberSecurity. On top of those domains, there has been smaller, but very notable trends on the growth of Software as a Service (SaaS) or MicroSaaS' have rebound and created significant growth for serverless services, as a means to avoid startup and initial running costs. Likewise, AI has been changing how we work and how we design systems to enrich workflows and create more naturally interactive apps.

## Serverless computing: redefining efficiency and scalability

### AWS's low latency runtime (LLRT)

Amazon Web Services (AWS) introduced the Low Latency Runtime ([LLRT](https://github.com/awslabs/llrt)), a game-changer for serverless applications, promising over 10x faster startup times and up to 2x lower operational costs compared to conventional JavaScript runtimes on AWS Lambda. Engineered in Rust and utilizing the QuickJS JavaScript engine, LLRT is specifically optimized for the unique demands of serverless environments, eschewing a JIT compiler to reduce complexity and resource usage. This strategic optimization not only streamlines the runtime architecture but also significantly enhances performance, setting a new standard for serverless computing efficiency.

### The FLAME pattern: simplifying scalability

[The FLAME pattern](https://fly.io/blog/rethinking-serverless-with-flame) represents a novel approach to serverless computing, enabling effortless scaling by encapsulating any existing application code within a function. This innovation promises to simplify serverless application development and deployment, offering a more versatile and accessible computing model.

## AI and machine learning: the dawn of intuitive programming

### Nvidia's vision: beyond coding to system engineering

Jensen Huang, Nvidia's CEO, challenges the traditional coding education paradigm, advocating for a shift towards system engineering. In an era dominated by AI advancements, Huang's perspective underscores the importance of designing systems over writing code, suggesting that AI technologies like GPT models could democratize programming through natural language prompts.

### OpenAI's Sora: a new frontier in video generation

OpenAI introduces [Sora](https://openai.com/sora), a text-to-video model capable of producing up to one-minute videos from textual prompts. Leveraging a diffusion model and transformer architecture, Sora epitomizes the fusion of GPT and DALL·E methodologies, offering unparalleled visual content creation capabilities. This innovation not only enhances creative possibilities but also signifies a major leap in AI-generated visual media.

### MobileLLM and TestGen-LLM: Meta's forward-thinking AI applications

[Meta's MobileLLM](https://arxiv.org/pdf/2402.14905.pdf) and [TestGen-LLM](https://www.linkedin.com/pulse/testgen-llm-ai-writes-testing-cases-meta-adam-faik-mzuae) illustrate the company's commitment to optimizing AI for specific uses. MobileLLM's compact yet powerful model showcases the feasibility of advanced AI capabilities on mobile devices, while TestGen-LLM's application in automated testing for Meta's platforms highlights AI's role in enhancing software quality and development efficiency.

### The era of 1-bit LLMs: a leap towards efficiency

A groundbreaking method has been proposed, utilizing [1.58 bits per parameter](https://arxiv.org/abs/2402.17764) in large language models (LLMs), a significant reduction from the traditional 16 or more bits. This innovative approach, which assigns parameters values of {-1, 0, 1}, matches the performance of models up to 3B parameters, heralding a new era of efficiency in AI. While no code or models have been released yet, this advancement could dramatically reduce the computational cost and energy consumption of running LLMs, making powerful AI tools more accessible and sustainable.

## FinOps: approach to economic pressure

The FinOps domain is experiencing a strategic shift towards waste reduction and the management of commitment-based discounts in response to global economic pressures. This change emphasizes the importance of optimizing cloud expenditures, forecasting cloud spend, and assessing the impact of AI/ML costs. Additionally, an increase in collaboration between FinOps and sustainability teams is anticipated, highlighting a comprehensive approach to financial and environmental stewardship in cloud computing.

## Cybersecurity: a call for memory safety

The White House Office of the National Cyber Director's report on cybersecurity underscores the critical [need for memory-safe programming languages](https://www.whitehouse.gov/oncd/briefing-room/2024/02/26/press-release-technical-report). By advocating for the adoption of languages like C#, Go, Java, Python, Rust, and Swift, the report highlights the importance of mitigating vulnerabilities inherent in non-memory-safe languages like C and C++.

## References

- [Whitehouse press release technical report](https://www.whitehouse.gov/oncd/briefing-room/2024/02/26/press-release-technical-report)
- [Key priorities shift in 2024](https://www.finops.org/insights/key-priorities-shift-in-2024/)
- [MobileLLM: optimizing sub-billion parameter language models for on-device use cases](https://arxiv.org/abs/2402.14905?utm_source=tldrai)
- [The era of 1-bit LLMs: all large language models are in 1.58 bits](https://arxiv.org/abs/2402.17764?utm_source=tldrai)
- [Automated unit test improvement using large language models at Meta](https://arxiv.org/abs/2402.09171)
- [Testgen LLM AI writes testing case Meta](https://www.linkedin.com/pulse/testgen-llm-ai-writes-testing-cases-meta-adam-faik-mzuae/)
- [Rethinking serverless with flame](https://fly.io/blog/rethinking-serverless-with-flame/)
- [AWSLabs](https://github.com/awslabs/llrt)
- [Nvidia CEO: don't learn to code](https://fusionmarketer.com/industry-news/dont-learn-to-code-nvidia-ceo-jensen-huang/)
- [Sora](https://openai.com/sora)
