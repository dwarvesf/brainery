---
author: 
created_time: 2021-07-20
tags: nocode
created: 2021-01-23
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cfde819a-ee91-4637-a326-deb9c07df9b9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=c13c8735fbd5badf50739bf09a74c141197a55ead80d00c292eabd61bab767d1&X-Amz-SignedHeaders=host&x-id=GetObject)

No-code platform has becoming a thing recently. With convenient and user-friendly workflow, no-code platform is a must to pick up for design and operation process, to shorten the development time and remove the misunderstanding between them with developers.

# What is Webflow

In short, Webflow is a web design tool, CMS, and hosting platform. Each aspect of the platform is represented by a particular product/feature set:

### The Designer

A visual web design tool firmly grounded in web standards and best practices, the Designer translates design decisions into clean, production-ready code. Webflow was built to enable designers to develop websites familiarly — i.e., visually and effortlessly.

If you’re mostly a prototyper, you can use the Designer alone. This function either helps sharing the prototype with devs to reproduce or exporting the code.

But to fully utilizing Webflow, you’ll want to combine the Designer with the CMS and the Hosting features.

### The CMS

As the Designer, the CMS is a code-free web development tool. It has both in-Designer elements (where the site designer works) and on-site elements (where the client and/or content managers work).

For now, know that in the Designer, the CMS lets you structure content types you’ll publish over and over again — like blog posts, product pages, etc. — by combining modular “fields.” Once you’ve created your content types, which we call Collections, you can use the Designer to determine how Collection items look on the site.

### Hosting

The final piece of the Webflow puzzle is the Hosting platform. Backed by Amazon Web Services (AWS) and Fastly, it’s blazing fast, super-reliable, and you’ll need it to enjoy some of the best features, including:

* The CMS
* The Editor
* Form management
* Responsive images (using a device to automatically resizing images)
* Free SSL/HTTPS (for site security, which is a must for Google’s visitor permission)

Okay, now that we have the lay of the land, let’s talk about diving in.

# Setup before designing

Let’s check the below image:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7d475095-1c28-442a-bd34-239ee7ac2bcc/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=9fb58233a3dc06b68a760c105c54b5a2e22e1ebe7e2560d0435c5b1b2084449e&X-Amz-SignedHeaders=host&x-id=GetObject)


Firstly, we’re recommended to fill in the default font, font size, and project name. The hosting, domain setup, embedded incode, SEO, Google analytic, and more benefits can be adjusted within the plans:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/19df67e7-6419-425b-bfce-c796e880298c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=70a0e496c6aab18d87d68f5055fc3e6dede09f6a78e57be9348ada89fc99a500&X-Amz-SignedHeaders=host&x-id=GetObject)

# Getting Started

## Toolbar

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/77c67233-09b9-42b0-98e4-5ec79ee75b00/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=c542dfb0cb5280218ff1980094bec27389b5e733b31c45f0c5f63e79b5caaded&X-Amz-SignedHeaders=host&x-id=GetObject)

Let’s start with the first image. From left to right:

1. **Selector:** It is a component (which can create a component for all elements). "Container - grid" is a component which I named it. Considering about create a component in case you reuse that element regularly.
1. **Spacing:** Includes Padding and Margin. Padding is the space in the block; the margin is the outer space. Each container, text block, link block... can be adjusted for margin and padding depending on the purpose of use.
1. **Layout:** There are 5 types of Layout. Depending on usage needs, each layout helps us build our website differently.
1. **Typography:** We can input fonts from our laptop or directly from google font. You should check it out yourself; it’s easier than you think.
1. **Background, Borders, and Effects:** like in Figma or sketch, we can edit the background image, radius, have fun with shadows.

## Navigator

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b61f070d-9b92-4890-bc0a-8e6910012443/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=d8b7c126557671c363d6f89689604fffec502752ca297312b8cb77780e805bbf&X-Amz-SignedHeaders=host&x-id=GetObject)

This point can be a red flag. In this case, we’re encouraged to create and name container components for regular-use ones.

***Tips:*** Name a component right after you create one. The component arrangement is the foundation of your website, especially responsive. It is the same as in Figma or sketch, a carefully arranged component is easier to edit, modify, and check back when needed

# Design a Website

A website is divided into 3 parts: Header, Body, and Footer.

## Header

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8515678b-4f9b-4210-8fdd-eea8d9544393/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=a550df0d846371610a609a31a9249292f68a620693f48b73aa9bdfd2aed10d33&X-Amz-SignedHeaders=host&x-id=GetObject)

To add a Header, click “Cmd+K” and search for the keyword “NavBar” or look at the left corner.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/18581989-d9b3-499a-9b1b-9b264921fe99/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=eca9596d5cc96c2118aa455f83554806c56303bd63102d3204e57ba7cfaeca8b&X-Amz-SignedHeaders=host&x-id=GetObject)


NavBar is created with Brand, Nav Menu and Menu Button, located in one container.

1. Brand: can be replaced with your company’s logo
1. Nav menu: can be replaced with text. I use a burger menu in this case.
1. Menu Button: I use a burger menu, but normally this could be a CTA.

***Tips:***  Check out [“How to made a Navbar on Webflow”](https://www.youtube.com/watch?v=vj-B5MBAjIc&t=495s&ab_channel=DesignPilot) on Youtube for more information. It might hard sometimes for beginners.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/df03fa12-b6ec-473a-b8e8-93804643e53a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=39a8eaaa7f0b7ebc4116995a36db6e3d417edc4bf46df8aca975c157ead61358&X-Amz-SignedHeaders=host&x-id=GetObject)

## Body

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/49598a21-0781-4b70-9d5f-6a831f43dc1a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=7f0c44d5e02dc59b4ab09111bfdd476c1d827ce49f479da2410adc60c66b2926&X-Amz-SignedHeaders=host&x-id=GetObject)

Example: Before doing design on Webflow, let’s define how these elements are grouped. The body should be divided into 4 areas.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d82808f7-340b-43d8-9a20-6ab2fc2f404c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=99e230c0134b86c3a94273104a697216a76ab438127cb02c32d90b20ce616a0e&X-Amz-SignedHeaders=host&x-id=GetObject)

1. Grid and Layout

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/65ba3e03-5a8d-4391-937d-3e69f1e3dc03/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=82d6c53e1762994c9998476480923b33f07fc12345493cf26deb2a81df76b8a8&X-Amz-SignedHeaders=host&x-id=GetObject)



1. Default Grid with padding/margins

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a413a987-fd3f-4078-9dd3-901a09e30f73/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=48565e2cf35069adf1aa927ac9d0d28e8b5b271f5b65dc428921dd7f7583b604&X-Amz-SignedHeaders=host&x-id=GetObject)


***Tips***

* Divide your design’s layout, group them by div block
* Create a component for regular-use
* Create a large area (main container) to support div blocks in the website
* Responsiveness

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0fb65135-e1b2-46d6-852e-3de5feac1298/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=70c08ad018d0745a0320fba73b70bcf5ac591caace4cc175c0dbffb8127393e1&X-Amz-SignedHeaders=host&x-id=GetObject)

## Footer

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/66f07773-27e6-4e28-b210-a7d98a848e7c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=e0ce526f13e454325b82a9da28b393d40aa4b8f43e833ceaa545b3fe6f7a8fd2&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/509e0238-b8ef-4f55-adc4-8c6b13257220/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=5c82537d0144129ac35c9ae431fe686bfebf0bc6df84b24eaebc8d1e38155900&X-Amz-SignedHeaders=host&x-id=GetObject)

In this case, the grid layout is used to create an equal space for Div Block from 2 to 5, when Div Block No.1 needs a larger space. A Vertical direction can be used to help adjust this.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5ea56030-a1be-4435-b3d6-0d57fa14bde7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=883d66563fa6841ef2be82009cad9f540abc3b57e111e0931e9dcbbfeba086d4&X-Amz-SignedHeaders=host&x-id=GetObject)

This section is divided into 2 parts:

1. Social link and one div block with height: 1px (*for line text*)
1. Email and phone number

***Tips***

* For clickable content, choose “Link Block” instead of “Text Block”.
* Layouts are critical to better create responsiveness.

# Responsive

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a4f58bdc-2b6a-4116-837b-0272f5238151/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=d69e39bdb1dc6d8e971ee62d24ef0b334c0316bcc9f50a693b8a230a95de8d47&X-Amz-SignedHeaders=host&x-id=GetObject)

It always starts with a Base breakpoint screen. When you do the responsive for a bigger screen or mobile, it’s much effortless.

***Tips***

* Images can be unexpectedly resized based on screen sizes. To prevent this, put images into a div block. The automatically responsiveness of div block can help maintain the images size.
* Layout, padding and margin can be adjusted based on screen sizes. In case the components position are changed, the whole process will be reset.
* The color, text style, font size, font-weight can be modified.

# Animation

You can play with default animation or create your own one. For more Page animation, this [youtube link](https://www.youtube.com/watch?v=69RRSEHWfCQ&ab_channel=Webflow) might help.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/fe18cf01-b52c-4283-ae47-9713ceeffce1/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=31b13c0914cdc070d88dcb4a62c62badbb15c8ef4a7dd84c10da4015eee98dd2&X-Amz-SignedHeaders=host&x-id=GetObject)

Check out my **[full case study](https://kiwipay.webflow.io/)**. I added some effects at the burger menu and CTA:


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/51c358be-ecf2-45e3-add6-54783291c2b0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=ad038381e657e3bf9c08816ab409bca6dc242dfcf1c2c3d8b3828d0b7c0252bb&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6ba29ff-c407-4dff-849a-a579a8cf8aac/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202439Z&X-Amz-Expires=3600&X-Amz-Signature=3b03ffee6dba008946500fe8f1a1d5b88bc0d80e1da92f57cdfc46e1533d265a&X-Amz-SignedHeaders=host&x-id=GetObject)

# Wrapping Up

Within a month of designing with Webflow, I can learn and practice much more to produce a more high-end website. Besides, I found out that this tool's Preview is sometimes unstable, which annoyed me, but the output was outstanding.

Webflow is such a flexible tool, and now designers can work with design tools and a No-code platform for more fast and stunning achievement. I hope that these tips will spark some ideas and help you be a more efficient product designer.
