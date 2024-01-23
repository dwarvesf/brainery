---
tags: 
  - design
title: Design System
date: 2018-03-23
description: null
authors: null
menu: memo
toc: null
notice: null
type: null
hide_frontmatter: false
author: null
created_time: 2018-02-20
created: 2018-03-23
---

Now having a Design System in place unites product teams around a common visual language, accelerates your design process ten-fold and gives you a strong foundation to build any project. Learn how you can create a design system and help your team improve product quality when increase the speed of your workflow.

## INTRODUCE

Today there are many the companies products compete with each other, the company should have one of the conditions:

* Make good and famous products
* Design fast and quality
* Have experience consultant and solve problems for customers

So apart from those two conditions, design systems enable a team to increase products faster by making design reusable makes scale possible. A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.

When you first start working with a new system you may find yourself slightly hindered, because it is a different way of approaching a project, and something a little different than you’ve maybe become accustomed to.

But honestly, if you devote one's time to create this Design System, you'll find yourself working on auto-pilot. You can drive all projects and it will seem like your child. 

## DESIGN

Starting a design system can feel daunting. There are so many things to consider: the design style, how to design for modularity and scalability, how it will be used by other teams, how to sell the idea to the decision makers in the company. Where is a designer to start?

### **1. Who should be involved**

Before beginning work on your design system, take a moment to think about the team you’ll need to bring it to life. Who needs to be involved? Spoiler alert! You’re going to need more than just designers.

Here’s a quick list of the disciplines that can be represented in your team to create an effective design system:

* **Designers** to define the visual elements of the system
* **Front-end developers** to create modular, efficient code
* **Content strategists** who can help the team nail the voice and tone of the system
* **Researchers** who can help you understand customer needs
* **Performance experts** who can ensure your system loads quickly on all devices
* **Product managers** to ensure the system is aligned with customer needs
* **Leaders** (VPs and directors) to champion and align the vision throughout the company, including up to executive leadership

### **2. Choosing the right team model**

* **The solitary model:** an “overlord” rules the design system.

![[cfe9acf6fd2d1adde475eac22289689b_MD5.webp]]


The team model that brings people together is as important as the team creating the design system. In “Team Models for Scaling a Design System,” design systems veteran Nathan Curtis outlines 3 popular team models used by many companies.

* **The centralized team model:** a single team maintains the design system as their full-time job.

![[29a2cbbe18c551fb6c02d550c7eba526_MD5.webp]]

* **The federated model:** team members from across the company come together to work on the system.

![[777f120275d29fe97d756a8d98d5be91_MD5.webp]]

* Other model

A hybrid design system team model that we used at Salesforce—a central team and members of other teams come together to manage and govern the system.

![[b187e07f45c64d9eabd7e524b39a31ed_MD5.webp]]


### **3. Interviewing customers**

Like any product in a design process, it’s important to do your research. Who will be using your design system and how will they use it? Answer this question is the customer. [You should difference between the Customer and the User](https://www.uxpin.com/studio/blog/customer-experience-vs-user-experience-why-the-difference-matters/). The customer will use your design system. So your design system will get used much more often if you create it to fit into the workflow of other teams. By interviewing customers, you can pinpoint problems ahead of time, define principles that will help others use the system properly, and focus your energies on the most important things.

This process can include:

* **Interviews** of key (potential) contributors, influencers and leaders to assess perspective, attitudes, culture, and existing practices.
* **Survey**ing a broader organization of stakeholders attitudes and posture towards a system, priorities/needs, aspirations, and threats.
* **Requirements** gathering via task analysis, tech planning, and convention setting (using tools like [Brad Frost](https://twitter.com/brad_frost)’s [Front End Questionnaire](https://github.com/bradfrost/frontend-guidelines-questionnaire)).
* **Product tours** to immerse in as-is products and in-flight designs to which the system will apply, taking screenshots and notes.
* **System(s) reviews** assessing as-is design assets, code libraries, standards documentation depth and quality, and governance models.

### **4. Creating a visual inventory**

With insights in hand from customer interviews, it’s time to take an inventory. There are 2 types of interface inventories to be created:

* An inventory of the visual attributes (such as spacing, color, and typography), which will help create a codified visual language
* An inventory of each UI element (such as buttons, cards, and modals), which will help create a UI library of components

Creating the visual identity isn’t something that will be created overnight. It takes time. Sometimes it’s as clear as day as to what is needed, other times it takes time for the building blocks to fall into place. Once in place, it’s important that the fundamentals are captured and documented at a high level. The likes of use of color, typography and style of iconography is key to creating consistency across a platform.

As we start to take inventory, it’s good practice to take a look at the CSS used to create all of those elements you just captured in your visual inventory. Use a tool like **[CSS Stats](http://cssstats.com/)** to see how many rules, selectors, declarations, and properties you have in your style sheets. More relevant, it will show you how many unique colors, font sizes, and font families you have. It also shows a bar chart for the number of spacing and sizing values. This is a great way to see where you can merge or remove values.


![[a9cdca95e3ffef0e55cd90fdec84527a_MD5.webp]]


**Do a UI inventory audit**

Before you start anything, its best to identify how inconsistent the current build is. This works in two ways. It helps identify the reason as to why you’re doing it, to identify how inconsistent everything is but it should help you get the backing of the business as to why exactly you’re creating the design system; to create consistency across the platform.

* **Colors**: What is the color palette used on the platform? Explain how, where and why we use certain colors.
* **Typography:** What typeface is used on the platform? Summarizes rules around weighting, sizing, vertical alignment etc?
* **Iconography:** What is the generic style for icons? It will explain the rational as to why we have specific styles for different icon families.
* **Grid/Layouts:** What grid system is used across the platform? Explain the use of the grid and the high level idealism of our layouts.
* **Interactions:** What do people expect to see when they interact with our site? Give an overview of our standard interactions.
* **Animations:** How do we approach animations? Explain the reason for animations on the platform and our constraints around using them.
* **Design Resources**: A central point for assets to be easily downloaded for external partners. Color swatches, logo’s, icon sets etc.

An example of a UI Audit: Brad Frost has put together a great article around how you go about doing a UI audit.

![[3e3694f6596e6a67a2a10b4bb6ea8eed_MD5.webp]]

Link source: [http://bradfrost.com/blog/post/interface-inventory/](http://bradfrost.com/blog/post/interface-inventory/)


### **5. Creating a visual design language**

If we break apart each component of a design system we find that these fundamental elements make up its visual design language:

* Colors
* Typography (size, leading, typefaces, and so on)
* Spacing (margins, paddings, positioning coordinates, border spacing)
* Images (icons, illustrations)

Depending on your needs, you may also include the following to further standardize the user experience:

* Visual form (depth, elevation, shadows, rounded corners, texture)
* Motion
* Sound

### **6. Design token**

Before we dive into visual design standards, you should discuss design tokens. Design tokens are the “subatomic” foundation of a design system implementation. At its simplest, they’re name and value pairs stored as data to abstract the design properties you want to manage. With the values for all design tokens stored in a single place, it’s easier to achieve consistency while reducing the burden of managing your design system.

Example of design token: [https://www.lightningdesignsystem.com/design-tokens/](https://www.lightningdesignsystem.com/design-tokens/)


![[0018d0d34bb133667d90e34ce27c5fd0_MD5.webp]]

[https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)

The workflow of design tokens would look like: 


![[d4b5482e66a2d78fe46a315c5d2a4646_MD5.webp]]


1) The designer would update the color in the design tool.

2) The design tool updates design tokens files according to targeted platform.

3) Developers only have to retrieve or “pull” updated files and use it in their project.

Currently, the only way to create a design tokens is by using [Theo](https://github.com/salesforce-ux/theo), it made by Salesforce. What Theo does is simple: it takes as input a tech agnostic file format like JSON or YAML and outputs tech specific files for each platforms.


### **7. UI Library (Pattern Library)**

After you complete the inventory, you can merge and remove what you don’t need (either in a spreadsheet or even directly in a code refactor if you want more immediate change). Also, document what the component is and when to use it. This will become your UI library (or pattern library, or component library, depending on what your organization chooses to call it.).

![[b0d28b9d30e9d838276303ad69f6e89a_MD5.webp]]

Most design system documentation includes the component’s name, description, example, and code. Others may show meta data, release histories, examples, and more. What matters most is that you show what’s necessary for your team to get your work done.

Process: [https://medium.com/@jgunnison/pattern-library-workflow-ba9cc486159e](https://medium.com/@jgunnison/pattern-library-workflow-ba9cc486159e)

### 8. Style Guide

[https://medium.muz.li/how-to-create-a-style-guide-from-scratch-tips-and-tricks-e00f25b423bf](https://medium.muz.li/how-to-create-a-style-guide-from-scratch-tips-and-tricks-e00f25b423bf)

---


After you understand this process of the design system, this guide will help you create a UI library in Sketch  

Let’s take a step-by-step below here how you can create your design system.

## I. Color System

1. **Create a Color Palette**

Binary Design color palette learns from elementary color percepts of human vision — the psychological primaries (blue, red, green, yellow), with addition of contrasting neutral colors (slate, gray, sand).

![[design-system-20240123165151313.webp]]

Refer to color palette scheme: https://color.adobe.com/create/color-wheel/ or http://khroma.co/train/

The whole point of creating a design system in the first place is to have a refined library of elements and styles that keep things much tighter when working on any project. A point of reference that keeps you away from the dark side of working with 12 different colors and a multitude of slightly different font sizes from one screen to the next. I’ve been guilty of it in the past.

![[design-system-20240123165210792.webp]]

![[design-system-20240123165227467.webp]]

**2. Create Rectangle Fill/Primary, Border/Primary and Color Overlays**

![[design-system-20240123165247399.webp]]

![[design-system-20240123165300459.webp]]

This would then allow me in the future to quickly select both shapes (with Fill and Border styles applied) and make the relevant Style changes at once.

![[design-system-20240123165317191.webp]]

Create a simple Colour Overlay at 60% Opacity which could be then applied to any images in a project, and this was as simple as taking the Hex Value from my Base Colours

## **II. Typography**

When you’re working with typography on the web, the two major things you want to pay attention to are the font sizes and line heights. Although there’s so much else that goes along with those two things, these are your two key components to creating a better vertical rhythm on your page design. If your font sizes don’t fit together well - by having massive heading sizes and ridiculously tiny body paragraph text sizes, for example - then this is going to make the content that much harder to read or scan through quickly. Similarly, if your content has a line height that makes text awkward to read - either through being spaced too closely together or being too far apart - that will turn your users off, when you want to be engaging with them.

![[design-system-20240123165353228.webp]]

![[design-system-20240123165408053.webp]]

You can use tools for Building Vertical Rhythm: [http://typecast.com](http://typecast.com/)

![[design-system-20240123165424745.webp]]

Applying this scale to some basic typographic CSS, we might get:

`h1` `{ **font-size**: 36px` `}`

`h2` `{ **font-size**: 24px` `}`

`h3` `{ **font-size**: 18px` `}`

`h4` `{ **font-size**: 14px` `}`

`p { **font-size**: 11px` `}`

`small` `{ **font-size**: 9px` `}`

Establishing a modular scale is the best way to determine typographic sizes, with the **Body text size set at 18pt**, and using a **Ratio of 1.2**.

As well as the headings and body styles, You can add styles for Lead, Small, Caption and Tiny. Sticking to the default Character Spacing for all of the aforementioned aside from Caption.

![[design-system-20240123165456321.webp]]

Creating both a Regular and Bold weight for each of the styles (Uber, Hero, H1, H2, Body etc…)and making sure for both font families that you can also create a Text Style for Left, Center and Right.

![[design-system-20240123165520464.webp]]

Setting color versions all Text Styled and at the ready. Using the Hex Color Values like this image attachment with the following colors applied:

- *Grey*
- *Light Grey*
- *White*
- *Primary*
- *Red (Error)*
- *Green (Success)*

![[design-system-20240123165543468.webp]]

![[design-system-20240123165607071.webp]]

## **III. Various**

**1. Shadows**

In the various section of the Design System you should focus on Box Shadows for elements firstly. The ability to quickly create a shape in Sketch and assign it a shadow of varying strengths within a matter of seconds massively cut down on the time it usually took to create shadows in the Sketch Inspector.

![[design-system-20240123165624555.webp]]

**2. Gradients**

Admittedly with the Gradients you can see this was a trend mission of sorts. Let’s not got into the whole Gradient debate. They still have their uses and can be used to great effect when used in moderation.

![[design-system-20240123165733635.webp]]

**3. Dtone Image**

![[design-system-20240123165748041.webp]]

**4. 8pt grid** 

In this comparison you can see an 8pt grid system vertically aligning the elements of a form versus a popular design system that utilizes arbitrary numbers to space and size elements. With an 8pt Grid System in place you were able to size and space elements on the page in increments of 8 (8, 16, 24, 32 and so on).

![[design-system-20240123165803828.webp]]

Bootstrap is an opinionated library of components that allows designers/developers to focus on the content and user experience. It has raised the quality of countless websites across the web. But not having a consistent unit of measurement can lead to layout inconsistencies between pages, particularly on projects with two or more designers.

When building own brand aesthetic at Pivotal we often need to create unique components and layouts. While recently working to unite our UI system we came across the fact that the branding in the top corner of all of our products is slightly different. Built by separate teams around the world, the overall concept is the same but the execution is slightly different.

![[design-system-20240123165835355.webp]]

![[design-system-20240123165849514.webp]]

If you want to know reason why 8pt, you can refer to link: https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632

**8-Point Grid: Borders and Layouts** - read more: https://builttoadapt.io/8-point-grid-borders-and-layouts-e91eb97f5091

## **IV. Color Symbols**

![[design-system-20240123165920582.webp]]

Firstly, you create a Symbols page yourself and then draw out a Rectangle (100x100) and apply the Fill/Primary Shared Style, then rename that layer to Base.

ou create a new Symbol and name it Color/Primary.

After, it is simply a matter of duplicating that new Symbol, selecting the Base layer, choosing the other Fill Shared Styles, and then renaming the Symbol in the Layer List.

## **V. Text Symbols**

First before we do, let’s create some Text Symbols. As it stands this is something that you have to do manually until Sketch creates an amazing update that lets us bypass this rather mundane process.

Choosing specific Text Styles and using this colors:

- *Black*
- *Green*
- *Grey*
- *Light Grey*
- *Primary*
- *Red*
- *White*

![[design-system-20240123165957709.webp]]

Then opting for 3 sizes for each of your Text Symbols: Large, Medium and Small. And then break these down even further into Symbols for Left, Right and Centre align text.

Following a Symbol naming convention of -

- *Text/Button/Large/Center/Black*
- *Text/Button/Medium/Center/Black*
- *Text/Button/Small/Center/Black*

![[design-system-20240123170016980.webp]]

And then pinning the Text Layer to the left and right edges of the Symbol so it would align correctly when use inside of a Button Symbol.

![[design-system-20240123170034095.webp]]

Making the same as the Input Symbols:

![[design-system-20240123170054197.webp]]

## **VI. Icon Symbols**

![[design-system-20240123170245086.webp]]

You simply create a Rectangle (24x24, which adheres to the 8pt Grid System), which will act as a bounding box for your Icons to aid with alignment and visual consistency going forward.
![[design-system-20240123170232768.webp]]

You place Color/Primary Symbol over the top of this, and resize it to the same (24x24)…
![[design-system-20240123170307802.webp]]

You then go ahead and drag in the relevant Icon, and resize and align it accordingly. It is bring in inside of a folder so you take the Shape Layers out of this folder and the delete the folder.

You then remove the icons Fill from the Inspector Panel, and turn it into a Mask (right-clicking on the icon and selecting Mask).

![[design-system-20240123170424187.webp]]

Then you select all the elements (Color Symbol, Icon Shape, and Bounding Box Shape), and convert to a Symbol…

![[design-system-20240123170437467.webp]]

You delete the original until you are left with the fresh Symbol, and then finally select the Bounding Box Layer and using the Resizing Constraints, pin it to all sides.

![[design-system-20240123170456254.webp]]

Using the same process as above you go ahead and create all the other Icon Symbols.

## **VII. Button States**

![[design-system-20240123170513102.webp]]
For the Button States you draw out a Rectangle (R) around 190x50px (this is just dimensions I suggest, feel free to choose your own).

And then give it a Fill Color you want.

![[design-system-20240123170600930.webp]]

You then create a new Shared Style and labelle it Button State/Disabled.

![[design-system-20240123170619047.webp]]

You rename the Layer to Base, and then convert it to a Symbol with the label State/Button/Disabled.

![[design-system-20240123170650658.webp]]

You then repeat a similar process for the Hover and Normal Button States (creating a new shape, a new Shared Style, and then a new Symbol), but choose a White Fill Color for the Hover and Normal States, with the Hover State at White with 25% Opacity and the Normal with White at 0% Opacity.

![[design-system-20240123170711322.webp]]

![[design-system-20240123170725182.webp]]

And now we have the Button States in place, and which you can now call upon, when building out your Button Components.

***Quick Tip:*** When creating Symbol Overrides. Make sure that if you want a certain set of Symbols to appear in an Override (ie; Disabled, Hover, Normal) that they are exactly the same dimensions. One pixel out and they just won’t appear in the Override dropdown. Not cool. So show those pixels some love!

## **VII**I. Button Shape (**Fill)

![[design-system-20240123170744880.webp]]

For the first of the Button Shape (Fill) Symbols I draw out a Rectangle (R) 120x40px and then rename the Layer to Base.

You then drop in both the Color Symbol and the State Symbols you have created previously.

You choose the Primary color, and Normal State Symbols (Color/Primary and State/Button/Normal).

Resize both of the elements to the same as the Base Layer, and then align them over the top.

Finally, you create a Mask on the Base Layer, shorten the Layer Names (ie; Color & State), and then, with all the Layers select, convert to a Symbol with the label Shape/Fill/Radius — 0px.

![[design-system-20240123170807694.webp]]

You then follow the same procedure for a Button Shape (Fill) with a 4px Radius and a 100px Radius, adjusting the shape layer accordingly.

![[design-system-20240123170826787.webp]]
You now have a Symbol form which I can simply Override both its State, and Color from the Inspector.

![[design-system-20240123170923463.webp]]

## IX. Button Shape (**Border)

![[design-system-20240123170941870.webp]]

Firstly you create a Rectangle (R), the same dimensions as the Button Shape (Fill) Symbols; 120x40px.

Then you duplicate this layer (CMD + D) and align them atop one another.

With the top layer select, you reduce its size down to 118x38px and then move it 1px down, and 1px to the left, until you have something like the following…

![[design-system-20240123170958825.webp]]

You then select both shape layers and use Subtract, and then rename the Combined Shape layer to Base.

You then insert the Color/Primary, and State/Button/Normal Symbols resize them accordingly, place them over the top of the shape layers, and then create a Mask from the Base Layer.

Finally you select all Layers and Symbols and convert to a new Symbol with the label Shape/Border/Radius — 0px.

![[design-system-20240123171020143.webp]]

You then follow the same procedure for a Button Shape (Border) with a 4px Radius and a 100px Radius, adjusting the shape layer accordingly.

## X. Input States

![[design-system-20240123171039459.webp]]

This tutorial will help you create some buttons easily. You shouldn't make it too complicated when working on the colors for Inputs. Stick to certain colors (Primary, Default, Error, Success) when building Input States, whereas with buttons allow yourself a little more freedom in the color department.

Starting with the Default Input States, you create a Rectangle (R) 180x50px and apply the Border/Light Grey Shared Style you have created previously.

![[design-system-20240123171147929.webp]]
You then convert this to a Symbol with the label State/Input/Default/Radius — 0px.

![[design-system-20240123171209479.webp]]

Then following similar steps, you create Symbols with the same Shared Style, but with a 4px and 100px Radius.

Then, calling upon the other Border Shared Styles you have created previously (ie; Primary, Grey, Error, Success), created Input Symbols for the following states…

- *State/Input/Active/Radius (0, 4px, and 100px)*
- *State/Input/Disabled/Radius (0, 4px, and 100px) you use a Grey Fill Color here with an Opacity of 40%, and then created a Mask with the Border Layer*
- *State/Input/Error/Radius (0, 4px, and 100px)*
- *State/Input/Success/Radius (0, 4px, and 100px)*

![[design-system-20240123171228447.webp]]

![[design-system-20240123171249103.webp]]

## XI. Building out your Components

In the previous articles showed you how to build the foundations of what will become your Design System in Sketch, including the creation of base elements such as Color and Typography and then onto the base Symbols such Icons and Text which can then be implemented into countless other Symbols as you move forward.

![[design-system-20240123171313322.webp]]

For the Button Components you opt for 3 sizes (Small, Medium and Large) to give myself some adaptability when creating artwork for various screen sizes.

You also should follow the 8pt Grid System into play here once more, to keep an element of uniformity throughout.

Starting with the Large Buttons, you choose to create 4 Component variants -

- *Default (No Icon)*
- *Icon (No Text)*
- *Left Icon (With Text)*
- *Right Icon (With Text)*

And next to the Large/Default Button Component, you firstly drop in the Shape/Fill/Radius — 4px that you have created previously. Now you can choose the Symbol with 0px or 100px Radius to be your default that’s entirely up to you.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cb249bba-f968-471a-97d2-e34df2d1ace7/Untitled

You then rename the Layer simply to Button, and note that with just this Layer in place that you also have the Symbol Overrides (Button State & Color) at your disposal moving forward. Very handy indeed!

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/701f4052-abf3-4283-84da-fa5e4ef45b9d/Untitled

From the Text Symbols you have created previously you drop in the Text/Button/Large/Center/White Symbol, and simply rename the Layer to Text.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f6a21c58-b2ef-4d9a-ac96-5e8834fb9cd6/Untitled

Now, wanting to adhere to the 8pt Grid System, and using a little bit of calculation you adjust the width and height of the button Layer so the text Layer that you just add aligned 8pt from the top and bottom of the button, and 32pt from the left and right edges.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2b2e2cc1-d699-4e76-b727-269c7cab0390/Untitled

With the Button Layer resized accordingly, and the Text Layer aligned correctly, you select both layers and convert to a Symbol naming it as such — Button/Large/Default.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5a8c354-1794-48a7-8aea-ef5a77fe4316/Untitled

Now working with the freshly created Button Symbol, you select the Text Symbol inside of it…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c7a5c938-a3e8-4b7d-9e7e-cd6061e91c55/Untitled

…and from the Resizing Constraints in the Inspector Panel, Pin it to the Left and Right edges, and fix the Height. Now whenever you resize this Button Symbol, you only know that the text inside of it is going to align perfectly.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/109083b3-f555-4165-b567-dcaa29c15863/Untitled

Now, inserting this Symbol into a project you have a multitude of options (Overrides), enabling me to tweak away at this Component with minimal effort. Huzzah with sprinkles on!!

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7d95e108-89e0-4859-aaf4-6d36f7ac8f6e/Untitled

Onto the Icon Button. Again, You simply insert the *Shape/Fill/Radius — 4px*Symbol you should create previously, rename it, and then adjust it to more of a square shape.

Then from your Symbols, drop in one of the Icons you should create previously, rename the Layer (Icon), change its Color Override to White…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/37b0a40d-d1c4-450c-9269-5f4b7da870de/Untitled

…and then, using the Scale tool, increase its size to 32 x 32px

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/29d49739-1739-458e-9522-5490df67b987/Untitled

You then adjust the dimensions of the shape layer, so the Icon Symbol align 8pt from all edges.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/31b39b0a-d9c9-497f-b8c0-e38badb0d03b/Untitled

With the Button Layer and Text Layer align correctly, you select both layers and convert to a Symbol naming it as such — *Button/Large/Icon*.

Now working with the newly create Button Symbol, I selected the Icon Symbol inside of it, and using Resizing Constraints fixed the Width and Height. This just avoids distortion of the icon when the Symbol is resized inside of your projects.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/13b81840-683e-41d7-a848-9c8b94326332/Untitled

Moving onto the Button/Large/Left Icon Symbol, following similar steps to the previous buttons you’d created, you insert a Shape/Fill/Radius — 4px Symbol and then adjust its dimensions slightly (180px x 47px if you want to know the exact dimensions)…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3484ae0b-fde3-42f1-af3b-c3da98736351/Untitled

You then insert an Icon Symbol, rename it, scale it to 32 x 32px and change the color Override to White.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b5829a96-f2fc-413b-9189-0f61cf649dee/Untitled

And from the Text Symbols you’d create previously, you drop in the Text/Button/Large/Left/White Symbol, and rename the Layer to Text.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/52997da1-0609-4d01-989a-67be979399ec/Untitled

And once more, adhering to the 8pt Grid System, you align the Icon Symbol, so it is 8pt from the top, bottom and left edge.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c21992e8-709a-46f7-86b5-bc6909d6d414/Untitled

Now, with all 3 Layers select (Text, Icon and Button), you convert to a Symbol and name it *Button/Large/Left Icon*.

Working from the newly create Button Symbol, you first select the Icon and pin it to the left edge, and then fix its Width and Height.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/70d22a93-8b63-4505-b07c-80c8fc1b398a/Untitled

Then with the Text Symbol select, I pin it to the left and right edges, and fix the Height.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c438bc6-a046-4280-86bc-bc6d9b960dc6/Untitled

Finally, for the *Button/Large/Right Icon* Symbol, you follow a similar process to the previous buttons.

- *Inserting a Shape Fill Symbol and adjusting its dimensions*
- *Inserting an Icon Symbol, scaling it up and overriding its Color*
- *Inserting a Text Symbol (again using the Left aligned variant)*

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e157d03b-2a53-442d-9b2c-a4075459e854/Untitled

And for the Icon Symbol, so it is 8pt from the right, top and bottom edge of the Button.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/653bc7f8-f1bd-4dd9-aaa3-143b9a782e9f/Untitled

Then you select all 3 Layers (Text, Icon & Button), and once more convert to a Symbol *Button/Large/Right Icon*.

And finally, with the Resizing Constraints, pin the Text Layer to the left and right edges, and fix its Height.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/75e0c7ef-013e-492d-b813-b999c62e1fe6/Untitled

And for the Icon, pin it to the right edge, and fix its Width & Height.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8334b4eb-3129-47f4-8b5c-41ad02de84f6/Untitled

After getting the Large Button Symbols into play, you then go down through the Medium and Small variants following a very similar process, but this time inserting, for example, the Text/Button/Medium/Center/White Symbol, and scaling the Icon Symbol accordingly, but still adhering to the 8pt Grid System throughout.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e0f623bb-56c3-498c-97a0-8227053307ee/Untitled

 

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/618bce77-6bd3-4edd-9de1-1e3928908218/Untitled

Until you have 12 rather fine Components now at my disposal.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/628b6164-8cbf-42ed-a3f6-60454a4cb8f1/Untitled

You then create Components such as Form elements, Menus & Drop downs, Navigation, Pagination and more. Key elements for any project you’re working on, but it in a form that is now easily customizable and allow me to stay on point when working through a project.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/25a9310d-73db-4ff0-96f1-f26bd4b5e541/Untitled

## XII. Form Field (with Label & Message)

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b64e40b0-e574-41d9-acf0-46d3f8b3a7f9/Untitled

Which you label in its final Symbol state as Input/Right Icon + Label + Message (rolls off the tongue you admit, but easier to find in the Symbol drop down later on, believe me).

And here you can see it in its untouched Symbol state, before the many Overrides available to it have been tweaked…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dedef91e-12ec-4a60-832b-f28f115f183e/Untitled

With the final Component made up of 3 separate Symbols…

- *Label*
- *Input*
- *Message*

## XII. Input Symbol

The Input Symbol is comprised of 4 separate Symbols…

- *Cursor*
- *Text*
- *Icon*
- *State*

So firstly, you drop in one of the State Symbols that you created before

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4a5f282d-e72f-43e1-bc7e-9ae469850c80/Untitled

Rename the Layer simply to State, and resize it to 160x40.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b60c353b-c215-4422-a1e1-41465cf2c0cf/Untitled

You then insert a Cursor Symbol you also created previously (this is simply a Shape Layer at 1x24 built off of a Fill Color Symbol. Nothing too over zealous.), rename it simply to Cursor, and position it 8 pts from the Left, Top & Bottom of the State Symbol.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bc842940-2c27-44fc-8ca7-ac53d9f622f1/Untitled

For the Placeholder text you insert one of my existing Text Symbols, and opt for the Light Grey color.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0e9e6957-1430-49b0-91eb-77665a6bdcf6/Untitled

Rename the Layer, and then position it accordingly.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bba1c422-3b5a-4a42-a32c-67c2002a5e83/Untitled

Then you increase the Width of its Bounding Box so it is 40pts from the right edge of the State Symbol, this will also make it 8pts from the left edge of the Icon Symbol that you add next. 

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/445f7e2c-36ef-4174-8462-f0e8a5fbc66c/Untitled

And finally you insert one of your Icon Symbols, rename it, and then position it 8pts from the Top, Bottom & Right edge of the State Symbol.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/442970a2-dd10-4f17-96eb-1bcbe4404190/Untitled

Then to finish things up, you select all Layers, convert to a Symbol, and name it Input/Right Icon.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b300f8db-953e-47d3-883b-f2e3dd7c34d7/Untitled

With your freshly made Symbol in place you then simply add some Resizing Constraints to finish things up.

For the Cursor, you pin it to the Left Edge, and fix the Width & Height…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a54996fc-cc45-4163-a3f3-9bf785097889/Untitled

For the Text, you pin it to the Left Edge, and fix the Height…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d42026f8-047e-4634-92a7-28d8001afee9/Untitled

And for the Icon, you pin it to the Right Edge, and fix the Width & Height…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7f45a0ee-923b-4114-a4e6-b78ecd17a12b/Untitled

## XIV. Message Symbol

The Message Symbol is comprise of an Icon, and Text Symbol.

Firstly you insert an Icon Symbol that you created previously, rename it, and then Scale it down to 16x16.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1cbb5076-7711-4d03-b3c0-6fe5dd75d1cf/Untitled

Then you add one of the Text Symbols, opting for a smaller text size here due to context it is to appear in.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9dff086f-f16a-476a-bc17-fe1212381565/Untitled

I then rename the Text Symbol, select both Layers and convert to a Symbol, naming it Input/Message.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/54720af6-2aea-4c2d-97aa-1c5f92bf7c50/Untitled

With my new Symbol at the ready, it is again, like you show you before, a case of adjusting the Art board size to snap to the Height of the Icon Symbol (16pt)…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/80261d41-723a-43aa-b621-4bdafdbe3567/Untitled

Adjusting the wording (via Overrides) of the Text Symbol, and adjusting the Art board Width accordingly…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d0bc6c0-c425-449d-82a2-b8330d6ea0f3/Untitled

…then to finish things up, it is a simple case of adding in some Resizing Constraints.

For the Icon, you pin it to the Top & Left Edges, and fix the Width & Height…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c1fa2dea-b1de-4fdd-aa14-d41d5ff329a3/Untitled

And for the Text, you pin it to the Top, Left & Right Edges…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6e2c4089-7b67-41a8-b04e-052248be955f/Untitled

So with the 3 Symbols at the ready…

- *Label*
- *Input*
- *Message*

So firstly for the Label, you insert a Text Symbol, again opting for a smaller text size, and rename the Layer to Label.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/de58fb85-3137-47f9-8534-162be6a93730/Untitled

You then insert the Input Symbol, rename it simply to Input, and place this below the Label.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fc042ec3-41f7-4945-a6a8-71d0acef551b/Untitled

Then finally, insert the Message Symbol, rename to *Message*, and place this below the Input.

You don't worry about alignment, and spacing just yet. That can all be dealt with once the 3 Symbols are packaged up into a fresh, new Symbol.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/adc4185d-d28e-4f4d-998b-4246eb7f6f92/Untitled

All you did do was make sure the Layers were organize in a logical way…

- *Label*
- *Input*
- *Message*

Which in turn, places the Overrides in a more manageable order for you later on.

you then select all 3 Symbols, and create a new Symbol.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b9dcf20-7146-43b9-98be-542465418c60/Untitled

With the final Symbol construct (from the 3 Nest Symbols), it is just a case of, like before, doing a little Artboard resizing, adjusting resizing constraints, and other minor tweaks.

Firstly, you resize the Artboard so it snaps to the Left and Right edges of the Input…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a2cb3ec0-0ec8-4cd2-98ba-c3ed0653b352/Untitled

then with the Input Symbol still select, and using the Resizing Constraints, pin it to All Edges.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5d7c6996-3a52-42e3-8dc1-c7ed961c6e73/Untitled

For the Message Symbol, and like the Label before, increase its Width to the full width of the Artboard, and then snap it to the bottom edge.

You then adjust the text Override to read *Message*, and then pin it to the Bottom, Left & Right Edges, and Fix the Height using the Constraints.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ebacb65-4329-4b6c-b366-07a45b6a834e/Untitled

The final thing to do is then simply align the elements vertically to one another using **8pts** between each element, and re-adjusting the Artboard size if require.

With this Component finally construct you now have an abundance of Overrides within easy reach…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/892eb907-c3cd-47ba-9e2d-e64c269d5d1e/Untitled

And this enables you to customize with the greatest of ease when working your way through a project.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a2c28cd1-d236-44d7-8777-c9d7b1cb8a99/Untitled

## XV. Checkbox

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dfcb8f55-3a13-4191-8ea2-36eb3f41c6f7/Untitled

For the Checkboxes it is simply a case of bringing together 2 existing elements from inside of my System; *Icon, and Text Symbols*, creating the necessary Overrides, and then applying the required Resizing Constraints.

The 5 different States you're aiming for in Component form were the usual suspects…

- *Normal*
- *Hover*
- *Indeterminate*
- *Checked*
- *Disabled*

Firstly you reference the Icon/Checkbox Symbols that you created before…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5da6f5c9-70d3-4090-b37e-f84f89bf5736/Untitled

And from those you insert the Checkbox/Normal State.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/31a45bfe-ae82-4f7b-a82c-e6c1e668b2f5/Untitled

You then reference the Text Symbols you also created previously…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bd90bbec-f38c-4534-9db4-19c9eb822d7b/Untitled

And drop in one of those

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1646a723-ac20-4e19-bd49-53c6911a5857/Untitled

You then rename the Layers to something a little more manageable (Icon, and Text), select both, and convert to a new Symbol (Input/Checkbox + Label).

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/36018e4c-964f-4683-a434-0700f140312e/Untitled

Once you have this new Symbol up & ready, it's then a case of doing a lil’ bit of tweaking to get the sizing and spacing just right.

You adjust the Artboard so it snaps to the height of the Icon Symbol (**24pt**)

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/055a8492-daeb-491c-b834-93be8280c1a3/Untitled

Then using the Overrides on the Text Symbol, rename that to ‘Label’ and (once more calling upon the almighty power of Grayskull, you mean 8pt Grid System) position it 8pts to the right of the Icon, and then tweak the Artboard width so the right edge snap to the right edge of the Text Symbol…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12b15ab4-daed-4962-a67f-110a4bcac62e/Untitled

Finally, to keep everything in happy resize mode moving forward, you pin the Icon to the Top and Left Edge, and fix the Width & Height.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be8d418c-4adf-4c22-9f35-f1bf1babea84/Untitled

And for the Text Symbol, pin it to the Top, Left, and Right edges.

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb0a8edd-ced1-4347-ac1e-447793d490a1/Untitled

You now have a Checkbox Component that you can easily (with a number of Overrides at my disposal), adjust the States, edit the Text, resize with ease, and more…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95aa6ae7-d32b-4571-ab84-1d222f7cad9d/Untitled

You then follow a very similar process for both the Radio Button, and Toggle Switch Components…

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/54b43e94-0471-44b7-9b79-25789cd27d1b/Untitled

Choosing 4 States for the Radio Buttons…

- *Normal*
- *Hover*
- *Checked*
- *Disabled*

…and for the Toggle Switch…

- *Off*
- *On*
- *Disabled*

https://s3-us-west-2.amazonaws.com/secure.notion-static.com/894db79c-548d-475d-9010-7e9434267aad/Untitled

[**Flat Icon Set**](https://www.notion.so/Flat-Icon-Set-2b28ad7050bf4e7286b694d3ca8aac4c?pvs=21)