---
draft: false
title: "Hadoop distributed file system, part 1: why HDFS and how blocks work"
description: "Why Hadoop needs its own file system, how HDFS compares with local file systems, and how block storage and replication work."
date: 2022-06-15
github_id: dudaka
redirect:
  - /unxtGQ
authors:
  - dudaka
series: hdfs-explained
series_part: 1
series_total: 2
type: research
topic: data
---

HDFS is the storage layer of Hadoop. This part explains why Hadoop needs a file system of its own, how it differs from the file systems on a single machine, and how block storage and replication give it scale and fault tolerance.

**This series has 2 parts.** Each one reads on its own.

1. Why HDFS and how blocks work (this page)
2. [Working with HDFS, reads and writes](hdfs-commands-read-write.md)

## HDFS - why another FileSystem?

HDFS (Hadoop Distributed File system) takes care of all the storage related complexities in Hadoop. Why is there a need for another file system like HDFS?

### File system

![](assets/hadoop-distributed-file-system-hdfs_file-system-hdfs.png)

File system is an integral part of every operating system, it basically governs the storage in your hard disk. For example, you give a person a book and you give another person pile of unordered papers from the same book, then ask each of them to go to chapter 34. Who do you think will get to chapter 34 faster? The one with the book because he can simply go to the index, look for chapter 34 look up the page number and go to the page. Whereas the one with the pile of papers has to go through the pile of papers and if he is lucky he might find chapter 34. Just like a well-organized book, a file system helps to navigate the data that is stored in your storage. Without the file system, the information stored in your hard disk will be one large body of data, but no way to tell where one piece of information stops and the next begins.

There are some of the major functions of a file system. File system controls how the data is stored and retrieved. Basically, when you read and write files to your hard disk your request goes through a file system. Next, file system has the metadata about your files and folders. Metadata information like file name, size, owner, created/modified time, etc. File system also takes care of permissions and security. File system manages your storage space, so when you ask to write a file to hard disk file system helps figure out where in the hard disk it should write the file. And it should write the file as efficiently as possible.

### Different file systems

The most legendary file system from Microsoft is FAT32. Maximum file size that a Fat32 file system can support is 4GB. If we have a file which is 5GB in size, we're out of luck with FAT32 and it has a 32GB volume limit or a logical drive limit. Thefore, our drive can be of size 32GB and not more with FAT32. The size limits can be more or less based on the file system configuration. So, if we use windows 95 or 98, we probably use FAT32.

Next generation file system from Windows after FAT32 is NTFS (New Technology File system) and it supports 16 Exabyte file and volume limit of 16 Exabyte, that is a very huge number, which is 1024 Petabytes. Therefore, NTFS can clearly support huge volume of data. Starting Windows Server 2012, Windows introduced ReFS (Resilient File system).

How about file systems from MAC? HFS (Hierarchical File system) is a legacy file system from Mac Apple that started using HFS+ from MAC OS 8.1 and above. For example, if we used iPod, we would have used HFS+. HFS+ can also handle a huge volume of data up to 8 Exabytes in size.

Now, that is about Linux, ext is the most popular file system in Linux. ext3 is the third generation file system in use since 2001, then came ext4. ext4 can support individual file sizes up to 16 Terabytes and volumes up to 1 Exabyte. Next, XFS is created by Silicon Graphics and it can support up to 8 exabytes in file and volume limit. We look up your file system in Linux with command `df -T`.

Clearly, we have file systems where we can store big data sets. Then, what is the need for HDFS? From section Understanding Big Data Problem of [Apache Hadoop and Big Data article](apache-hadoop-and-big-data.md), we know that to support truly parallel computation, we had to divide the data set into blocks and store them in different nodes And to recover from data loss, we also replicated each block in more than one node.

![](assets/hadoop-distributed-file-system-hdfs_hadoop-distributed-file-system.png)

Assume that we have a 10 node cluster and we have ext4 as the file system on each node like the above image. We will refer ext4 on each node as the local file system. The first task of our proposed file system is when we upload a file to this proposed file system, we need the file system to divide the data set into fixed size, i.e. blocks. Although every file system has a concept of blocks, the concept of blocks and HDFS is very different when compared to the blocks and traditional file systems. We will see the differences in other article :)).

Next, our file system should have a distributed view of the files or blocks in the cluster which is not possible with our local file system which is ext4. As shown in the above image, our local ext4 file system on Node 1 has no idea what is on Node 2. Similarly, Node 2 has no idea of what is in Node 1. Since the ext4 file systems in both Node 1 and Node 2 are local to each node, there is no way they can have a global or distributed view of the entire 10 node cluster. That is why we say the ext4 on individual nodes as local file systems. Next important thing is replication which adds a lot of complexity. Since ext4 in Node 1 has no idea about storage in any other node, it does not have the ability to replicate blocks in Node 1 to the other nodes. Therefore, we are exposed to data loss.

Now, assume we have a file system on top of ext4 but only this time it spreads across all the nodes. We call that file system, Hadoop Distributed File system Then, when you upload a file to HDFS it will automatically be split into 128MB-fixed size blocks. In the older versions of Hadoop, the file was divided into 64MB-fixed size blocks. HDFS takes care of placing the blocks in different nodes and also take care of replicating each block into more than one node. By default, hdfs replicates a block to three nodes. If we copy a 700 MB dataset into HDFS, HDFS will divide the data set into 128MB blocks. Thus, we will have 5 equal sized 128MB block and one 60MB block.

Since hdfs has a distributed view of the cluster, it can easily decide which nodes should hold these 6 blocks and also pick the nodes to hold the replicated blocks HDFS will continue to creep track of all the blocks and their node assignments all the time. So when a user asked about the 700 MB data set, it knows how to construct the file from the blocks.

HDFS, by no means, is a replacement for the local file system. Our operating systems still rely on the local file system. In fact, the operating system does not care about the presence of HDFS. One more interesting thing, HDFS should still go through ext4 to save the blocks in the storage. Hence, HDFS is placed on top of the local file system.

The true power of HDFS is that it is spread across all the nodes in the cluster and it has a distributed view of the cluster. And hence it knows how to construct the 700 MB data set in the example from the underlying blocks whereas the ext4 does not have a distributed view and only knows about the blocks in its storage that it is managing.

### Benefits of HDFS

- HDFS supports the concept of blocks: When you upload a file into HDFS, the file is divided into fixed size blocks to support distributed computation and that is the key for Hadoop. Also HDFS keeps track of all the blocks in the cluster
- Data failures or data corruption are inevitable in any big data environment, even in small environments. HDFS maintains data integrity and help recover from data loss by replicating the blocks in more than one node.
- HDFS supports scaling: if we like to expand our cluster by adding more nodes, it's very easy to do with HDFS.
- Cost effective: we don't need any specialized hardware to run or operate HDFS and this is very important because we are refering about potentially hundreds of nodes. HDFS was built ground up to work with commodity computers.

## Blocks

All files will be divided into blocks and will be replicated three times by default across the nodes in the cluster in HDFS. Let's do an experiment on Windows, we can create a very small text file, name it as `test.txt`, then add just some senctences into the text file and save the text file. Now, when we right-click and click the properties of the text file. A popup will appear as shown as the below photo.

![](assets/hadoop-distributed-file-system-hdfs_file-size-vs-block-size.png)

The size of the file is 1.34 KB but the size on the disk for this file is 4 KB. Why the file is taking 4 KB on the disk when the actual size of the file is only 4 bytes? Because 4 KB is the block size or cluster size of the operating system in our computer which is NTFS. So 4 KB are multiples of 4 KB is the minimum amount of space that the file system will assign to a file. If the file size is 2 KB it will still take up 4 KB on disk leaving the 2kb unused and this 2 KB cannot be reused for anything else, leaving them unused forever. If the file size is 8 KB it will take up 8 KB that is 2 4KB-blocks. And if the file size is 13 KB, it will take up 16 KB or 4 blocks leaving 3 KB unused again this 3 KB cannot be reused, leaving them unused forever. Therefore, 4 KB are multiples of 4 KB is the minimum amount of space the file system can assign at any given.

Now considering to HDFS, the configured block size of your hdfs in your Hadoop cluster is 256 MB. And we uploaded a file which is 1 MB in size. We may guess that HDFS allocates 256 MB to store a 1MB file leaving 255 MB unused. That is not correct. It would be a lot of space wasted.

As mentioned from the previous section, we know that HDFS is not a replacement to the local file system and all the blocks are physically stored in the local file system even though the file uploaded to HDFS is divided into blocks. These blocks are stored in the hard disk which is managed by the local file system, which means in the hard disk, the file will be stored as per the block size of the local file system. So if we have a cluster in which the local file system is ext4 for instance and with a block size of 4 KB to store a 1MB file which is 1024 KB, we would need 256 of 4KB blocks which is exactly 1 MB to store the file in ext4. If the file size is 1025 KB for instance, we would need 257 of 4 KB blocks leaving 3 KB in the last block unused. Even though HDFS has a block size, the space allocated for the file on the disk will still obey the rules of the local file system. For that reason, HDFS will not allocate 256 MB to store a 1MB file.

There are some questions. If the blocks are stored by underlying local file system. Why are HDFS block size so huge like 128 MB or 256 MB as compared to 4 KB of block size in the local file system? Why don't we keep it as 4 KB? When the block size is huge, the OS will attempt to store the file in contiguous blocks on the disk. If the blocks are in contiguous locations, both reads and writes will be faster because the blocks are laid out next to each other as the disk head doesn't have to seek and position itself over and over again for blocks as they are stored contiguously. This is a huge benefit as the read and writes will be very efficient. However, it is very important to note that OS will attempt to write big files in contiguous location but it does not guarantee that.

If storing big files are advantageous in terms of read and write efficiency, why do we have to split the files into blocks at all? Why don't we store the file as a whole? By dividing the files into blocks, we can store data set of any size and not limited to size of the volume of any individual hard disk. As mentioned in the previous section, each file system has its own volume limit. For example, NTFS file system has a volume limitation of 16 Exabytes. So if we have a data set which is 17 Exabytes in size. We cannot store that file on a hard disk as a whole. But by dividing the data set into blocks, we can store the blocks across many nodes in the cluster. Also dividing a data set to blocks and replicating the blocks offer redundancy and fault tolerance.

Asuming that we have a file which is well within the size of the hard disk and we decide to store the file as a whole instead of dividing them into blocks and decide to replicate the file as a whole three times. The below image illustrate that. Now we have one file replicated into three nodes: Node 1, Node 2 and Node 3. In an event where all three nodes crash, we would lose the file.

![assets/hadoop-distributed-file-system-hdfs_3-crashes.png](assets/hadoop-distributed-file-system-hdfs_3-crashes.png)

We can consider to another scenario where we divide the same file and into five blocks and store each block in a different node with the replication factor of 3. The blocks could be stored as much as up to 15 nodes across the cluster, as shown in the below image. Hence, to physically lose the file all 15 nodes would have to crash, which is less likely as compared to three nodes going down at once.

![](assets/hadoop-distributed-file-system-hdfs_15-crashes.png)
