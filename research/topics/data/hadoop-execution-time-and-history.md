---
draft: false
title: "Apache Hadoop and big data, part 2: execution time on one machine and the history of Hadoop"
description: "How long a single machine takes to read and process 1 TB, which shows why distributed processing is needed, followed by how Hadoop grew out of the Nutch web crawler."
date: 2022-06-12
github_id: dudaka
authors:
  - dudaka
slug: hadoop-execution-time-and-history
announce: false
series: hadoop-and-big-data
series_part: 2
series_total: 2
type: research
topic: data
---

Part 1 posed a problem: find the maximum closing price of every stock symbol in a 1 TB data set. This part works out how long one machine takes to read and process that data, which shows why a cluster is needed, and then covers how Hadoop grew out of the Nutch web crawler.

> Part 2 of 2 in the Hadoop and big data series. Previous: [Apache Hadoop and big data, part 1: what big data is, why Hadoop, and the problem](apache-hadoop-and-big-data.md)

## Execution time

For the program to work on the data set, first, the data set needs to be copied from the storage to the working memory or Ram. How long does it take to copy a one-terabyte data set from storage? Let's take our traditional hard disk drive, which is the one that is connected to a laptop or workstation, etc. HDDs (Hard Disk Drive) have magnetic platters in which the data is stored. When you request to read data, the head in the hard disk first position itself on the platter and starts transferring the data from the platter to the head. The speed at which the data is transferred from the platter to the head is called the data access rate. Average data access rates in HDDs are usually about 122 MBs. So, to read 1 TB from an HDD, you need 2 hours and 22 minutes. That is for an HDD that is connected to your workstation.

When you transfer a file from a NAS server or from your SAN server, you should know the transfer rate of the hard disk drives in the NAS servers. For now, we will assume it is the same as the regular HDD, which is 122 MBs, and hence it would take 2 hours and 22 minutes. Next, what about the computation time? Since you have not executed the program yet at least once, you cannot say for sure. Additionally, your data comes from a storage server that is attached to the network, and you have to consider the network bandwidth also. With all that in mind, you give him an ETA of about three hours, but it could be easily over three hours since you're not sure about the computation time.

```sh
Data Access Rate + Program Computation Time (~60 min) + Network Bandwidth, etc. = (>3 hours)
```

Unsurprisingly, your business user is so shocked to hear three hours for an ETA he has the next question: can we get it sooner than three hours? Maybe in 30 minutes. You know there is no way you can execute the results in 30 minutes. Of course, the business cannot wait for three hours, especially in finance, for time is money.

How can we calculate the result in less than 30 minutes? The majority of the time you spend calculating the result set will be attributed to two tasks:

- Transferring the data from storage or hard disk drive is about two and a half hours and
- The computation time is the time to perform the actual calculation by your program (~ 60 minutes), it could be more, or it could be less.

What if we replace HDDs with SSDs (Solid State Drives)? SSDs are a very powerful alternative for HDD. SSD does not have magnetic platters, heads, or any moving components. And, it's based on flash memory, so it's extremely fast. By doing that, we can significantly reduce the time it would take to read the data from the storage. But here's the problem SSD comes with a price usually five to six times the price of your regular HDD. Although the price continues to go down, given the data volume that we are talking about with respect to Big Data, it is not a viable option. Therefore, for now, we are stuck with HDDs.

Let's consider how we can reduce the computation time. Hypothetically, the program will take 60 minutes to complete and is also already optimized for execution. We can divide the 1TB data set into 100 equal size chunks/blocks and have 100 computers/nodes to the computation parallelly. Theoretically, we cut the data access by the factor of 100 as well as the computation time. Hence, the data access time is reduced to less than 2 minutes (= 142 mins / 100), and the computation time is in less than 1 minute (= 60 mins / 100).

![](assets/apache-hadoop-and-big-data_1tb-of-big-data.webp)

Furthermore, if you have more than one chunk of your data set stored in the same hard drive, you cannot get a true parallel read because there is only one head in your hard disk which does the actual read. For the sake of argument, assuming that we get a true parallel read, which means we have 100 nodes trying to read data at the same time. Assuming the data can be read parallelly, we will now have (100 x 122) MBs of data flowing through the network. Imagine what would happen when each one of your family members at home starts to stream their favorite TV show or movie at the same time using a single internet connection at your home? It would result in a very poor streaming experience with a lot of buffering such that no one in the family can enjoy their show. What we have essentially done is choked up your network; the download speed is requested by each one of the devices combinedly exceeded the download speed offered by the internet connection resulting in poor service. This is what will happen when 100 nodes try to transfer the data over the network at the same time.

![](assets/apache-hadoop-and-big-data_100-nodes-of-big-data.webp)

To solve this, we can bring the data closer to the computation, i.e., store the data locally on each node's hard disk. Thus, you would store Block 1 of data in Node 1, block 2 of data in node 2, etc., as shown in the above image. Now we can achieve a true parallel read on all 100 nodes, and also, we have eliminated the network bandwidth issue. That's a significant improvement or design.

How can we protect our data from hard disk failure or data loss, data corruption, etc. ? For example, you have a photo of your loved ones, and you treasure that picture. In your mind, there is no way you can lose the picture; how would you protect it? You would keep copies of your picture in different places, maybe one on your personal laptop, one copy in Picasa, one copy on your external hard drive, etc. If your laptop crashes, you can still get that picture from Picasa or your external hard drive. From the idea, we copy each block of data to two more nodes. In other words, we can replicate the block in two more nodes. In total, we have three copies of each block.

![](assets/apache-hadoop-and-big-data_block-of-data-notes.webp)

As shown in the above image, Node 1 has Block 1, 7, and 10. Node 2 has Blocked 7, 11, and 42. Node 3 has blocks 1, 7, and 10. If block one is unavailable in Node 2 due to a hard disk failure or corruption in the block, it can be easily fetched From node 3. This means that Node 1, 2, and 3 must have access to one another, and they should be connected to a network. But there are some challenges in implementing it; how does Node 1 know that Node 3 has Block 1? And who decides Block 7, for instance, should be stored in Node 1, 2, and 3. First of all, who will break the 1TB into 100 blocks?

That's just the storage part; computation brings other challenges. Node 1 can only compute the maximum close price from just Block 1. Similarly, Node 2 can only compute the maximum close price from Block 2. This brings up a problem because, for example, data for stock GE (a stock symbol) can be in Block 1 and can also be in Block 2 and could also be on block 82, for instance, right. Then, you have to consolidate the result from all the nodes together to compute the final result; who is going to coordinate all that? The solution we are proposing is distributed computing, and as we are seeing, there are several complexities involved in implementing the solution both at the storage layer and also at the computation layer.

![](assets/apache-hadoop-and-big-data_hadoop-infrastructure.webp)

The answer to all these open questions and complexities is Hadoop. Hadoop offers a framework for distributed computing. Hadoop has two core components, HDFS and MapReduce. HDFS stands for Hadoop Distributed File System, and it takes care of all your storage-related complexities like splitting your data set into blocks, replicating each block to more than one node, and also keep track of which block is stored on which node, etc. MapReduce is a programming model, and Hadoop implements MapReduce, and it takes care of all the computational complexities. Therefore, Hadoop framework takes care of bringing all the intermediate results from every single node to offer a consolidated output.

What is Hadoop? Hadoop is a framework for distributed processing of large data sets across clusters of commodity computers The last two words in the definition are what makes Hadoop even more special, commodity computers, which means all the hundred nodes that we have in the cluster do not have to have any specialized hardware, i.e., their enterprise-grade server nodes with the processor, hard disk and RAM in each of them. There's nothing more special about that. But don't confuse commodity computers with cheap hardware. Commodity computers mean inexpensive hardware and not cheap hardware.

Now, you know what Hadoop is and how it can offer an efficient solution to your maximum close price problem against the 1TB data set. So, you can go back to the business and propose Hadoop to solve the problem and to achieve the execution time that your users are expecting. But if you propose a 100 node cluster to your business, expect to get some crazy looks; that's the beauty :)).

You don't need to have a 100 node cluster; we have seen successful Hadoop production environments from small 10 node cluster all the way to 100 to 1000 node cluster. You can simply even start with a 10 node cluster, and if you want to reduce the execution time even further, all you have to do is add more nodes to your cluster. That's simple. In other words, Hadoop will scale horizontally.

## History of Hadoop

![](assets/apache-hadoop-and-big-data_history-of-hadoop.webp)

In 2002, an excellent and smart programmer named Doug Cutting was working on an open-source project named Nutch. The purpose of the nudge is to crawl the internet, collect web pages then rank and index them so that we can run searches against the indexed web pages. That is exactly what Google's search engine does. Google's proprietary crawlers and algorithms crawl through the internet, collect web page ranks and index them and run searches against them. Nutch is a very similar project to that idea, but it's open-source.

Soon, Doug Cutting realized that he was hitting scalability issues both in terms of storage and in terms of computation because he was collecting and trying to analyze a massive amount of data. While he was trying to solve the scalability issues, in 2003, Google published a paper about their proprietary homegrown file system named Google File System (GFS) and how it can be used to store massive amounts of data and offer redundancy and scalability at the same time. And in 2004, Doug created an open-source version of GFS and called it Nutch Distributed File System (NDFS). In 2004, Google published a paper on a programming model named MapReduce that addressed how Google achieved computational efficiency with Big Data. That is what Doug was looking for in terms of computation. And in 2005, Doug managed to run Nutch on top of NDFS and open-source implementation of MapReduce.

In Feb 2006, a sub-project named Hadoop was founded. Hadoop is the name of Doug's kids - A yellow stuffed elephant doll. He chose to use the name because it was easy to spell and meaningless. Around 2006, Yahoo started funding the efforts by Doug Cutting and building Hadoop and hired Doug. On Feb 19, 2008, Yahoo announced that they have the world's largest Hadoop production cluster. And in Jan 2008, Hadoop was made a top-level Apache project. In April 2008, Hadoop broke the world record and soldered a terabyte of data in 209 seconds. Later that year, in November, Google broke that same record and sorted a terabyte of data in just 68 seconds. Since its inception to date, Hadoop and its community have grown leaps and bounds and were soon embraced by several companies as a solution to analyzing Big Data.

Hadoop was truly given the ability to analyze volumes and volumes of data and helped unlock key valuable insights that would go unfound if it wasn't for this awesome technology. More importantly, Hadoop brought massive parallel distributed computing to the mainstream since it is open-source and can be implemented using commodity computers. And since it's open-source and can be implemented using commodity computers, Hadoop sets the bar very low in terms of cost of entry which enables even smaller companies to work with and analyze big data.

## References

- https://hadoop.apache.org/
- https://en.wikipedia.org/wiki/Apache_Hadoop
- [Hadoop: the definitive guide: storage and analysis at internet scale](https://www.amazon.com/Hadoop-Definitive-Storage-Analysis-Internet/dp/1491901632/ref=sr_1_2?crid=2LTQHKE9WNBNC&keywords=Hadoop&qid=1657604708&sprefix=hadoop%2Caps%2C127&sr=8-2)
