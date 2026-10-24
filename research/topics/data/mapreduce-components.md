---
draft: false
title: "MapReduce components, part 1: input split, map and reduce"
description: "The MapReduce problem statement, then how input splits, the map phase and the reduce phase work."
date: 2022-10-24
github_id: dudaka
redirect:
  - /jOA1wMc
authors:
  - dudaka
series: mapreduce-components
series_part: 1
series_total: 2
type: research
topic: data
---

## Introduction

[[MapReduce]] consists of four components:

- Map phase
- Reduce phase
- Shuffle phase
- Combiner

**This series has 2 parts.** Each one reads on its own.

1. Input split, map and reduce (this page)
2. [The shuffle phase and combiner](mapreduce-shuffle-and-combiner.md)

## Problem statement

![](assets/mapreduce-components_stock-problem.webp)

Here's a problem we'd like to solve. We have a data set with information about several fictitious stock symbol. In each line in the data set, we have information about a stock symbol for a day: opening price, closing price, high, low, volume, etc.

Let's pick the first line in the above picture, it is going to be our record. The first is the exchange name, `ABCSE`, ABC stock exchange. The next is the symbol - `B7J`, the date - `2008-10-28`, the opening price - `6.48`, closing price - `6.72`, high - `6.74`, low - `6.22` for the day and the volume - `44300`. This data set is about 400 MB, not too big but good enough for our experimentation and learning.

Now, it is about the problem we would like to solve with this data set. For every stock symbol in the data set, we would like to find out its maximum closing price across several days.

![](assets/mapreduce-components_stock-algorithm.webp)

The above diagram shows the algorithm. We'll read a line, get the symbol on closing price from the line, then we need to check if the closing price is greater than the closing price we have for that symbol.

If not, go to the next line. Otherwise, the closing price is greater than the closing price that you already have for that symbol, save the closing price as the maximum closing price for that symbol and move on to the next record in the data set.

If the end of the file is reached, print the results.

The problem with this approach is that there is no parallelization. Thus, if we have a huge data set, we will have extremely long computation time which is not ideal.

### Input split

![](assets/mapreduce-components_distributed.webp)

Let's consider how we have worked out the same problem in the mapreduce world. From the article `What MapReduce is`, we got introduced to the faces of MapReduce, so we'll take this problem and go over each phase and see the technical details involved in the map phase, reduce phase and shuffle phase.

First, it is about the map phase, the central idea behind MapReduce is distributed processing. So, first thing is to divide the data set into chunks and you have separate process working on each chunk of data. The chunks are called input splits and the process working on the chunks are called mappers, as show as in the above picture. Each mapper would process a record at a time and each mapper would execute the same set of code on every single record.
The output of the mapper would be a key-value pair.

![](assets/mapreduce-components_input-splits-vs-blocks.webp)

Is it true that input split is same as the block? Input split is not same as the block.
A block is a hard division of data at the block size. If the block size in your cluster is 128 MB. Each block for the data set will be 128 MB except for the last block which could be less than the block size if the file size is not entirely divisible by the block size. Since a block is a hard cut at the block size, a block can end even before a record ends.
In the above diagram, we have four records in our data set and each record is 100 MB and the block size of our cluster is 128 MB. So the first record will perfectly fit in the block since the record size is 100 mb it's built within the block size which is 128 MB. However, the second record cannot fit in the block, so the record number 2 will start in block 1 and will end in block 2.

If we assign a mapper to block 1, in this case, the mapper cannot process record 2 because block 1 does not have the complete record 2. This is exactly the problem input split solves. In this case, input split 1 will have both record 1 and record 2.
Input split 2, however, does not start with record 2.

Since record 2 is already included in the input split 1. so input split 2 will have only record 3. Record three is divided between block 2 and block 3. Input split is not physical chunks of data, it is a Java class behind the scenes with pointers to start and end location within blocks.

Therefore, when a mapper tries to read the data, it clearly knows where to start and where to end. The start location of an input split can start in a block and can end in another block.

So that is why we have a concept of input split. Input split respects logical record boundary. During mapreduce execution hadoop scans through the blocks and create input splits which respects record boundaries.

### Map phase

![](assets/mapreduce-components_map-phase.webp)

With the understanding about input splits, we can take a look about the mapper in detail. A mapper in hadoop can be written in many different programming languages, it can be written in C++, python Scala and Java. In our case we'll look at Java, a mapper is a Java program in our case which is invoked by the Hadoop framework once per every record in the input split.

So if you have 100 records in a input split, the mapper processing the split will be executed 100 times.

**\*Question**: how many mappers will Hadoop create to process a data set?
Answer: the number of mappers is entirely dependent on the number of input splits.\*

If there are 10 input splits, there will be 10 mappers.
If there are 100 input splits, there will be 100 mappers

So a mapper is invoked for every single record in the input split and then the output of the mapper should be a key value pair. In our sample stock data set, every line is a record for us and we need to parse the record to get the stock symbol and the closing price. The stock symbol and the closing price becomes the output from each execution of the mapper: the symbol is going to be the key and the closing price is going to be the value in your key value pair.

But how do we decide what should be the key and what should be the value in our key value pair?

### Reduce phase

![](assets/mapreduce-components_reduce-phase.webp)

The reduce phase that will give us an answer. The reducers work on the output of the mappers. The output of individual mappers are grouped by the key, in our case, the stock symbol and pass to the reducer. Reducer will receive a key and a list of values for that key for input. The keys will be grouped.

For example, our data set has stock information about 10 stock symbols and 100 records for each symbol so that is 1000 records in total, 10 stock symbols and 100 records for each stock symbols that is thousand records.

We will get 1000 key value pairs from all mappers combined because our mapper will be executed for each record When processing a record, we can decide not to output a key value pair for the record. For instance, the record could be bad, in that case, we won't output a record from the mapper.

But in an ideal scenario, we will have 1000 key value pairs because we have thousand records then the reducer will receive 10 records to process. One record for each symbol since we only have information about 10 stocks. Each record for the reducer will have a symbol for the key and a list of closing prices for value that is all we need to calculate the maximum closing price for each symbol.

The work of the reducer becomes simple, it reads the key and calculate the maximum closing price from the list of closing prices for that symbol and output the result.

**\*Question**: how do we decide what should be the key and what should be the value?\*

There is a simple trick: think about what needs to be reduced. In our example, we know if the reducer has the stock symbol and the list of closing prices for a given stock symbol, we can arrive at the maximum closing price and also we want the reducer to be called once per symbol that is why we made symbol as the key in mapper's output and closing price as the value.

We know the number of mappers equals to the number of input splits are not controlled by the users. Number of reducers can be set by the user, we can even have a map reduced job with no reducers.

Assuming that data set is divided into 100 splits which means 100 mappers. Now we have only one reducer to process all the output from 100 mappers. In some cases it might be okay but we might run into performance bottleneck at the reduced phase because we're trying to reduce output from 100 mappers in one reducer. So if we're dealing with large amount of data in the reduced phase it is advisable to have more than one reducer.
