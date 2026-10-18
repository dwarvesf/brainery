---
draft: false
title: "MapReduce components, part 2: the shuffle phase and combiner"
description: "How the shuffle phase moves map output to reducers and how a combiner cuts the data it moves."
date: 2022-10-24
github_id: dudaka
authors:
  - dudaka
slug: mapreduce-shuffle-and-combiner
announce: false
series: mapreduce-components
series_part: 2
series_total: 2
---

Part 1 followed a job through input split, map and reduce. This part covers what happens between map and reduce: the shuffle phase, which moves map output to the right reducers, and the combiner, which shrinks that output before it travels.

> Part 2 of 2 in the MapReduce components series. Previous: [MapReduce components, part 1: input split, map and reduce](mapreduce-components.md)

## Shuffle phase

![](assets/mapreduce-components_multiple-reducers.webp)

In the above picture, we have multiple reducers. Let's consider how the output of the individual mappers got grouped by symbols and reached the reducer. The magic happens in the shuffle phase.

Shuffle phase is also a key component in mapreduce. The process, in which the map output is transferred to the reducers, is known as a shuffle. Let's take a look at the shuffle phase in detail.

Assuming that in our mapreduce job, we decided to use three reducers. For example, we have have data for Apple in the stock data set and we have 10 input splits to process which means we will need 10 mappers.

We can have records for Apple in more than one input split. Let's say the records for Apple is spread out in all the 10 input splits, this means each mapper will produce key value pairs for Apple in its output.

When we have more than one reducer, we don't want the key value pairs for Apple to be spread out between the three reducers that will be bad for our use case because we won't be able to calculate the consolidate max closing price for Apple.
Therefore, we want all the key value pairs for Apple to go to one reducer.
In other words we want each key or symbol in our case to be assigned to a reducer and stick with it.

In the map phase, each key is assigned to a partition. So if we have three reducers, we will have three partitions and each key is assigned to a partition by a class called partitioner.

If the partitioner decides that any key value pair with Apple as key should go to partition 1 then all key value pairs with Apple as key will go to partition 1 and each partition will be assigned to a reducer: Partition 1 will be assigned to Reducer 1, Partition 2 will be assigned to Reducer 2, etc. It is key to understand that this partitioning happens across all the mappers in the map phase.

Hadoop framework will guarantee that input to the reducers is sorted by key and so once the keys are assigned to the right partition the key value pairs in the partition are sorted by key.

Once the keys are sorted, we are now ready to copy each partition to the appropriate reducers. This is known as the copy phase, we have to understand that data for partition 1, for instance, can come from many mappers because in our example the records for Apple can be spread across multiple input splits. Therefore, in the reduced phase, the partitions have to be merged together maintaining the sort ordering by key even though the intense sorting happened at the map phase.

In some documentation, we will see the merge action referred to as sort on the reduce side. Once the reducers have received all the partitions from all the mappers and the partitions are merged, the reducer will perform the actual reduce operation.
That's the shuffle phase.

Let's summarize the shuffle phase. Each mapper will process all the records in its assigned input split and will output a key value pair for each record. If we look at the output, we have symbol for key and closing price as value. For example, in the above picture, we can see here `ABC` is a symbol and `60` is the closing price for `ABC`.
Similarly for symbol `STT`, we have closing price as `82`.

Same for other mappers as well, we may also note that symbols in mapper 1 can also be found in mapper 2. Look at the symbol `STT` for instance, we have `STT` in mapper 1 and we can also see `STT` in mapper 2. Then in the shuffle phase within each mapper the key value pairs will be assigned to a partition.

Within each partition the key value pairs will be sorted by key. As shown as in the above picture, the output key value pairs are nicely sorted by key in each mapper. Then, the key value pairs from each mapper will be copied over to the reduced phase to the appropriate reducers.

At each reducer the key value pairs coming from different mappers will be merged maintaining the sort order.

There are two things to note in the picture:

- the symbols are unique to each reducer meaning even though records from symbol were widespread across multiple mappers they were sent to one reducer. Take a look at symbol `ABC` for instance, `ABC` was found in mapper 1 and `ABC` was also found in mapper 2 but key value pairs for symbol `ABC` is sent to only one reducer, in this case, reducer 1.
  Similarly you can find key value pairs for symbol `STT` in mapper 1 and also in mapper 2 but the key value pairs for `STT` is sent to only one reducer, in this case, reducer 2.
- Once the key value pairs are copied and merged, the job for reducer is very simple. Reducer 1 will run three times, one for each symbol and reducer 2 will run two times, one for each symbol

Each run will print the symbol and its maximum closing price. That's the end to end process in mapreduce.

## Combiner

![](assets/mapreduce-components_combiner.webp)

We could also have an optional combiner at the map phase.
Combiners can be used to reduce the amount of data that is sent to the reduce phase. In our example, there is no reason to send all the closing prices for each symbol from each mapper. As shown in the above picture, in mapper 1, we have three records for symbol `ABC`: one record with closing price `60`, one record with closing price `50` and one record with closing price `111`.

Since we are calculating the maximum closing price, we don't have to send the key value pairs with closing price `50` and `60` because they are less than the closing price `111`. Thus, all we need to do here is we need to send the key value pair with closing price `111` for symbol `ABC` from mapper 1 to the reducer.

Intuitively, combiner is like a mini reducer that runs at the map phase. Combiners can be very helpful to reduce the load on the reduce side. Since we're reducing the amount of data that are being sent to the reducers, thereby increasing performance. Combiners are optional.

## Summary

- the internals of map shuffle and reduced phases.
- the benefit of using a combiner.
