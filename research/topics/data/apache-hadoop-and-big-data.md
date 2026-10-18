---
draft: false
title: "Apache Hadoop and big data, part 1: what big data is, why Hadoop, and the problem"
description: "The three Vs of big data, its use cases and challenges, why traditional solutions fall short, how Hadoop answers them, and a 1 TB stock-price problem to test the answer."
date: 2022-06-12
github_id: dudaka
redirect:
  - /yNqyVA
authors:
  - dudaka
series: hadoop-and-big-data
series_part: 1
series_total: 2
---

Big data is data that outgrows one machine in volume, velocity or variety. This part defines those three Vs, lists use cases and challenges, explains why traditional solutions fall short, and introduces Hadoop. It ends by posing a concrete problem: the maximum closing price of every stock symbol in a 1 TB data set.

**This series has 2 parts.** Each one reads on its own.

1. What big data is, why Hadoop, and the problem (this page)
2. [Execution time on one machine and the history of Hadoop](hadoop-execution-time-and-history.md)

## What is Big Data?

### 3 V's: volume, velocity and variety

#### Volume

"Big" is a relative term. We put Shaq next to almost everyone, but especially gymnast Simone Biles, and he looks enormous. But if he stands with Yao Ming ... suddenly he doesn't look so big.

![](assets/apache-hadoop-and-big-data_big-data-illustration.webp)

The same applies to data. What is considered "Big"? 10GB? 100GB? Or 100TB? There is no straight number that defines big data. There are two reasons why there is no straightforward answer to this question:

- What is considered as big today, in term of data size/volume, need to be considered as big a year from now. This is a moving target.
- It's all relative, as shown in Shaq's photos. What we consider to be big may not be the case for companies like Google and Facebook.

Hence, For these two reasons, it's very hard to put a number to define Big Data volume.

Let's say we are defining big data problems in terms of pure Volume alone. In our opinion, 100GB is not big data since we have a hard disk greater than 100GB. How about 1TB? It is still not because a well-defined traditional database can handle 1TB or even more without any issue. Then, 100TB? Some would claim that 100TB is a big data problem, and others might disagree. It is relative! So, 1000TB? Now, this is on a scale of Petabytes, and it is definitely Big Data.

#### Velocity

We have to understand that the volume of data is not the only factor in classifying our data be big data or not. Let's say we work at a start-up, and we recently launched a very successful email service where users can log in to send and receive emails. Our email service is so good and even better than Gmail. In three months, we have 100 thousand active users signed up to use our service.

Hypothetically, we are currently using a traditional database to store messages and their attachments, and also our current size of the database is 1TB. So, do we have a big data problem? The straightforward answer is NO because 1TB is not that big to classify as a big data problem. Another question: in this growth rate, will we have a big data problem in the near future? To answer this, we need to consider three factors.

The first one is volume. In 3 months, our start-up has 100 thousand active users, and our volume is 1TB. If we have a positive growth at the same rate, we will have 400 thousand active users at the end of the year, and our volume will be 4TB. What if we doubled or tripled our user base every three months, so the bottom line is that we should not just look at the volume when we think of Big Data. We should look at the rate at which our data grows. In other words, we should watch the velocity or speed of our data growth.

Velocity is the next important factor to consider; it tells us how fast our data is growing. If your data volume stays at 1TB for a year, all we need is a good database. If your growth rate is 1TB/week, then you have to think about a scalable Big Data solution. Most of the time, Volume and Velocity are all you need to decide whether you have a Big Data problem or not.

#### Variety

This is the next factor we need to consider; it adds one more dimension. Our data and traditional database are highly structured, which are rows and columns. Back to our hypothetical start-up email service, it receives data in various formats: texts for the actual messages, images, and videos as attachments. When we have data coming to our system in different forms and have to process or analyze the data in different formats, traditional database systems are sure to fit. When combined with high volume and velocity, you for sure have a big data problem.

Therefore, whenever we are asked whether it is a big data problem or not, please take the 3 V's: Volume, Velocity, and Variety into consideration. This happens to Big Data consultants all the time; they will be called in by clients about data storage that has performance issues and hope that a Big Data solution like Hadoop is going to solve their problem. Most of the time, their answer will fail in the volume and velocity tests, the volume will be in the higher gigabytes or lower gigabytes, and their growth rate has been relatively low for the past six months and in the foreseeable future. Hence, the volume does not qualify as big data, and their data growth rate will be very low. It fails the velocity test as well. What the client needs is to optimize the existing process and not a sophisticated Big Data solution.

### Usecases

When we say Big Data, we are potentially talking about hundreds to thousands of Terabytes. Let's consider the following domains' use cases:

#### Science

Large Hadron Collider at SUN produces about 1TB of data every second, mostly sensor data from their equipment. Their volume is so big, that they don't even retain or store all the data they produce.

NASA gathers about 1.73 GB of data every hour about geolocation data from satellites, etc.

#### Goverment

NSA (National Security Agency) is known for its controversial data collection programs. An NSA data center in Utah can house 1 Yottabyte (1 trillion terabytes) of data in terms of Volume.

In March 2012, Obama's administration announced about 200 million dollars in Big Data initiatives. We can understand the significance behind Big Data and its analysis even though we cannot technically classify the next one under a government. And Obama's 2nd term election campaign used Big Data analytics which gave them a Competitive Edge to actually win the election.

#### Private

With the advent of social media like Facebook, Twitter, LinkedIn, etc., there is no scarcity of data: eBay is known to have a 40 Petabyte cluster and Facebook a 30 Petabyte cluster. These numbers are old now since the stats are a little old big data.

Data is not only produced and analyzed in social media companies but also retail space. It is most common in several major retail websites to capture click-stream data. For example, you shop at amazon.com. Amazon is not only capturing data when you click checkout but also every click on their website, which is tracked to bring a personalized shopping experience. When Amazon shows you recommendations, Big Data analytics is at work behind the scenes.

### Big data challenges

Big Data comes with big problems:

- Since data sets are huge, we need to find a way to store them as efficiently as possible. It is not just about efficiency in terms of \***\*storage\*\*** space but also efficiency in storing the data set that is suitable for \***\*computation\*\***. The main purpose of storing data is to analyze them, right? How much time does it take to analyze and provide a solution to a problem using our big data? What's good in storing the data when you cannot analyze or process the data in a reasonable time? With big data set, computation with reasonable execution times is a challenge

- Another problem when we deal with big data set is \***\*data loss\*\*** due to corruption and data or due to hardware failure. You need to have a proper recovery strategy in place.

- Finally, the \***\*cost\*\*** and the most important challenge you're going to need a lot of storage space and a lot of computational power. Therefore, the solution that you plan to use should be cost-effective.

### Traditional solutions

#### RDBMS

Traditional RDBMS will have scalability issues when moving up in data volume in terms of Terabytes. We will be forced to demoralize and pre-aggregate the data for faster query execution time. As the data get bigger, we will be forced to make changes to the process in terms of changing the indexes, optimizing the queries, etc. Assuming that your database is running with enough hardware resources, when you see a performance issue, you still have to make changes to the query itself or the way in which your data is accessed. There is no working around it. You cannot add more hardware resources or more computer nodes and distribute the problem to bring the computation time down. In other words, the database is not horizontally scalable, i.e., you cannot add more resources or more computation nodes and hope the execution time or the performance will improve.

Databases are designed to process structured data. When our data does not have a proper structure, the database will struggle. Furthermore, a database is not a good choice when you have a variety of data which is data in several formats like texts, images, videos, etc.

A good enterprise-grade database solution can be quite expensive for a relatively low volume of data when you add hardware costs and platinum-grade storage costs. It's going to be quite expensive.

#### Grid computing - a distributed computation solution

Grid computing is essentially many nodes operating on data parallelly and then doing faster computation. However, there are two challenges:

- Grid or high-performance computing is good for computing-intensive tasks with a relatively low volume of data but does not perform well when the data volume is huge.
- Grid computing requires a good experience with lower-level programming to implement and then it is not suitable for the mainstream.

### Hadoop - a good solution

A good solution should, of course, handle a huge volume of data. It should provide efficient storage, which is the ability to store data efficiently. Data loss is unavoidable, so the proposed solution should implement a good recovery strategy. And the solution should be horizontally scalable as your data grows. Most importantly, it should be cost-effective. Finally, to minimize the learning curve, it should be easy for programmers, data analysts, and non-programmers to work with the framework or the system. This is exactly what Hadoop offers.

#### Is Hadoop a replacement for RDBMS?

NO!

| Hadoop                                                                                                          | RDBMS                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hadoop has the volume in terms of petabytes                                                                     | RDBMS works exceptionally well with volume in low terabytes                                                                                                                                                |
| Hadoop can work with Dynamic Schema and supports files in many different formats                                | The schema is very strict and not so flexible and cannot handle multiple formats                                                                                                                           |
| Hadoop solution can scale horizontally                                                                          | RDBMS's solution can scale vertically, meaning we can add more resources to the existing solution and to make any improvements to the process itself like tuning the queries and adding more indexes, etc. |
| Hadoop offers a cost-effective solution                                                                         | It gets expensive very quickly when we increase the volume of data                                                                                                                                         |
| Hadoop is a batch processing system, so we cannot expect a millisecond response time like an interactive system | RDBMS is an interactive and batch system                                                                                                                                                                   |
| We can write the file or data once and then operate or analyze data multiple times                              | we can read and write multiple times                                                                                                                                                                       |

The gaps between Hadoop and RDBMS are closing in. Hadoop offers a cost-effective solution to big data problems, but Hadoop is not the only solution that is available in the market now. NoSQL databases like HBase and Cassandra bring a great deal of value in analyzing a huge volume of data, and it is a great alternative for RDBMS. Now, when we mention a huge volume of data, we are talking about millions of columns and billions of rows.

## Understanding big data problem

### Sample big data problem

Imagine you work at one of the major exchanges like the New York Stock Exchange or NASDAQ. One morning someone from your Risk Department stops by your desk and asks you to calculate the maximum closing price of every stock symbol that is ever traded in the exchange since inception. Also, assume the size of the data set you are given is 1 TB, so your data set would look like the below image:

![](assets/apache-hadoop-and-big-data_sample-big-data-problem.webp)

Each line in this data set is information about a stock for a given date. Immediately the business user who gave this problem asks you for an ETA on when he can expect the results. There is a lot to think about here, so you ask him to give you some time, and you start to work. What would be your next steps? You have two things to figure out: storage and computation.

Let's consider the storage first. Your workstation has only 20 GB of free space, but the size of the data set is 1 TB. Thus, you go to your storage team and ask them to copy the data set to a NAS (Network Attached Storage) server or even a SAN (Storage Area Network) server. Once the data set is copied, you ask them to give you the location of the data set. Because a NASA or san is connected to your network, any computer with access to the network can access the data provided if their permission to see the data. Thus, the data is stored, and you have access to the data.

Now, the next problem is computation. You're a Java programmer, so you wrote an optimized Java program to parse the data set and perform the computation. And you're now ready to execute the program against the data set. Unfortunately, you realize it's already noon, the business user who gave you this request stopped by for an ETA. Then, you start to think what is the ETA for this whole operation to complete, and you come up with the result set.
