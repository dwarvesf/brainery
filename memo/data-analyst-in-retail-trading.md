---
author: 
created_time: 2022-09-08
tags: engineering, practice, radar
created: 2022-08-29
---

*I am Bach Phuong and I work at Dwarves Foundation as a Data Analyst, helping partner companies realize insights and understand their business better.*

## What does a Data Analyst do?

A Data Analyst is a gatekeeper for an organization’s data. They are tasked to explore, transform, aggregate data to create business insights from that data to then create reports to stakeholders. Thanks to these reports, companies can make more informed business decisions.

## What tools do I use?

I use tools ranging from ETL Tools, Query layer Tools, and BI Tools. For ETL Tools, I have experience in using Oracle Data Integrator (ODI) and Apache Airflow in the past. Using these tools do not require programming skills, but does require you to understand the system behind it.

After data is transferred to a data warehouse, I use query layer tools such as Dremio to explore data. Dremio is an SQL engine that also allows us to compose virtual datasets from many sources.

For BI tools, I am familiar with Power BI, Tableau and Google Data Studio for making reports. All tools have their advantages and disadvantages. For instance, Power BI is good for portability, Tableau is often easy to use, and Google Data Studio has features specific to their ecosystem to help generate diagrams or consolidate data sources on Google Cloud.

## Data Science Hierarchy of Needs

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a20bad02-a9c0-4a64-858a-6dfd099cbaba/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=883d9982a6bb619b2ce807edeb640c19b74bfc63d7d34486795848dbbdddad3c&X-Amz-SignedHeaders=host&x-id=GetObject)

This diagram show what all the general departments in data do. Firstly, **Data Infrastructure Engineers** will set up infrastructures for data systems such as setup for databases, Kafka, etc. Secondly, **Data Engineers** will then create data pipelines, ETL process and convert raw data to modeled data for transfer to data warehouses. Then **Data Analysts** prepare data from those sources. This involves cleaning, transforming, and analyzing data to curate and compose metrics, infographics, and insights for reports. After that, other tasks regarding machine learning, AI, and deep learning are handled by **Data Scientists**.

## Case Study: Data Analyst in Retail Trading

A good Data Analyst should understand how a company does business and an understanding of everything surrounding it. In order to get insight for a report, you will need to know how your company makes money. One case study I would like to cover is of a retail trading company, specifically of one that sell perishables such as beverages and snacks to small vendors. Our suppliers in this case will be companies that provide these beverages and snacks, such as Habeco, Coca-Cola, Tide, etc.

### System Overview

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d975786b-9e1e-4c5f-bbc9-9f16e3887926/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=c8852813e727973df1ce91a1e23efaf17000a24f59c99a5f1aba5a228f5de84d&X-Amz-SignedHeaders=host&x-id=GetObject)

Understanding the overall system can help Data Analysts get a feel for where data resides across databases and how they relate with each other. Each system is designed differently fitted for its business use case, but there are typically 2 main types: the core system and services/microservices.

Examples of core system solutions are Hybris, POS systems, SAP, TMS, etc. For services/microservices, these can be system for sales management, warehouse management, promotion services, etc.

## Data Process

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ee2f50fc-7a4b-4494-ac95-b751268fe72b/Data_Process.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=52b1da08a6a104e0a3aef9e76d0a89efdb21741ec07dd8d312b9c149ae66da08&X-Amz-SignedHeaders=host&x-id=GetObject)

The data process to creating the report as a data analyst is dependent on 12 steps, where responsibilities are shared between the Data Engineer, Analytics Engineer, and Data Analyst.

**Steps 1–3: Data Engineer**

1. Raw data : Acquired raw data from an object store or database
1. ETL to Staging : Step to transform data near 1:1 from the object store or database to the staging environment in the data warehouse
1. Incremental: The incremental step is where data is stored for a limited time period, in our case 7 days. It has the same metadata as the staging environment, but with lower capacity. The purpose of this is to increase the speed in which we load data into the model

**Steps 4–6: Analytics Engineer**

1. Data Model: Models raw data into schemas in the data warehouse. We have 2 types of data models: Snowflake schema, and Star schema. (I had previous experience in modelling Star schemas in data warehouses.)
1. Data Warehouse: A data repository consolidated from multiple sources.
1. Data Mart : Transformed or mirrored data from data warehouses aimed for holding single subject or line of business data. The purpose of this is to allow users to access data and gain insights faster.

**Steps 7–12: Data Analyst**

1. Query Layer: Interface to get and use data from Data Marts
1. BI Tool: Tool to compose dashboards from data sources
1. Clean and transform data: A necessary step to make sure data is consistent across the mode
1. Visualization: Reformat and repurpose clean data for better understanding
1. Insight: Human step to acquire insight from dashboards and visual infographics
1. Report: Final step to generate a general report of findings

## Types of Data Analysts

There are mainly 3 types of Data Analysts with regard to retail trading: Operation Data Analyst, Finance Data Analyst, and Marketing Data Analyst.

### Operation Data Analyst

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6b201671-bc54-4ad0-8257-9bae10cb55c9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=ea0b2017f3d39ba604d11e6faf129cce4ea6bf27c0bf8947f554b63af1f434c1&X-Amz-SignedHeaders=host&x-id=GetObject)

Operation Data Analyst are responsible for tracking for daily sales of the company and its general operations. For instance, they need to be able to explain for volatility of company sales, give sale insights as to which product brings the highest Gross Merchandise Value (GMV), which vendor has the highest growth rate, etc.

They also help track for risk and fraud. This includes, but is not limited to, tracking for fraud in marketing campaigns, anomalies in sales, vendor collusion, employee theft, etc. In addition, they also track for product and warehouse related concerns. This includes tracking for product performance, inventory in warehouse, warehouse operating expenses, etc.

### Finance Data Analyst

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e25d7265-75c6-4466-bc5d-14d971cdaa16/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=8b0da4e1f97cbdf213baa940846c7a44e0d23e087ad37af5e7e35d8241c9126f&X-Amz-SignedHeaders=host&x-id=GetObject)

Finance Data Analysts have two main concerns: margin control and transport management system (TMS):


**Margin Model**

This model is used to track the margin of each product or transaction. We need to control this margin carefully as it directly affects the profit/loss of the company:

$ \text{Margin} = \text{Revenue} - \text{Cost} $

→ Revenues can consist of Sales, back margin from supplier, and other revenue;
→ Costs can consist of TMS costs, warehouse costs, promotion costs, and cost of goods sold (COGS)

Transportation cost is based on route distance, cargo volume, distribution rate of the distributor, bonus, or payoff for distributor with the data aggregated from the TMS system and manual input. Warehouse cost is based on amount of space, rental rate, operational cost, etc. Promotion costs refer to marketing campaign costs.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a8e6aa0a-b4ca-46a2-b98e-6edf4090ddc8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=0fe68b58ed54ecfc251b570d5efa4fcfcd9f80b040d4903a531c33156f8bba9c&X-Amz-SignedHeaders=host&x-id=GetObject)


**Transport Management System**

You need to optimize the rate of distributor gains against your company gains. If your company pays a low rate for the distributor, they may not distribute your product to your customer or settle with low quality service level agreement (SLA). By contrast, if you pay your distributor too high, your margins will be lower as a consequence.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c8d743b2-d5d1-4bfc-a2f3-b7acb8d21366/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=61f421e16a3d52da5b73b8f9ee95687446abd67630a3cca4dd33d2650b3e072d&X-Amz-SignedHeaders=host&x-id=GetObject)


### Marketing Data Analyst

Marketing Data Analysts are concerned with tracking consumer related data, that includes tracking customers through funnel processes and customer segmentation:


**Customer Funnel**

Tracking processes to acquire customer and customer conversion rate. In the example chart below, we can see the process of how a company acquires a customer. With this funnel and data, we can know which stage has the lowest conversion rate and improve upon it.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a3ee4ad1-34a4-4b09-99a2-4ae2a16d2817/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=a05c88c43c8a361f4c24558099012edd1f5b6c75815053acf98ff7aabeafe176&X-Amz-SignedHeaders=host&x-id=GetObject)


**Customer Segmentation**

Taken from the Pareto principle, we see that 20% of big customers will bring 80% of benefits to the company. We segment and compartmentalize customer behavior to find who are our most important customers for the company.

For the improved customer and good customer group, we have different strategies to improve their standings, such as deploying marketing campaigns or investment in sales. For the rest, we see that 50% of all customers generally fill the low quality group. This group often trials the product and see few repeat purchases, so spending resources and money on improving their standing may prove wasteful.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/beedd1a1-5559-4ed6-a915-e2062f27a045/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202211Z&X-Amz-Expires=3600&X-Amz-Signature=bdf5367fcc880a6ab38287eb380a82f4cfc66646a19700a8aa68f1d309294534&X-Amz-SignedHeaders=host&x-id=GetObject)

## Conclusion

Hopefully, you were able to understand Data Analysts a little better, through the lens of retail trading. Data Analysts are one of the few jobs where they focus on gathering requirements and are dependent on those who collect and aggregate data. There are many types of Data Analysts, and they serve their role best in helping business gain better insight into how they operate and understand critical areas of concerns better.
