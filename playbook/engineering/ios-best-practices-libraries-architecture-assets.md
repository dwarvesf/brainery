---
title: "Best practices in iOS development, part 2: libraries, architecture, stores and assets"
description: "Which libraries earn a place in an iOS app, how to structure models, views and controllers, where to keep data, and how to handle images."
date: null
authors: []
credit: Futurice
credit_url: "https://github.com/futurice/ios-good-practices"
slug: ios-best-practices-libraries-architecture-assets
announce: false
series: ios-best-practices
series_part: 2
series_total: 4
---

This part covers the shape of the app itself: the few libraries worth adding, an architecture split into models, views and controllers, the stores that hold app data, and how to handle bitmap and vector images. It is a snapshot from 2015, written before SwiftUI and Swift concurrency. Part 1 explains what has changed since.

> Part 2 of 4 in the iOS best practices series. Previous: [Best practices in iOS development, part 1: getting started](ios.md) | Next: [Best practices in iOS development, part 3: coding style, security, diagnostics and analytics](ios-best-practices-style-security-diagnostics.md)

## Common libraries

Generally speaking, make it a conscious decision to add an external dependency to your project. Sure, this one neat library solves your problem now, but maybe later gets stuck in maintenance limbo, with the next OS version that breaks everything being just around the corner. Another scenario is that a feature only achievable with external libraries suddenly becomes part of the official APIs. In a well-designed codebase, switching out the implementation is a small effort that pays off quickly. Always consider solving the problem using Apple's extensive (and mostly excellent) frameworks first!

Therefore this section has been deliberately kept rather short. The libraries featured here tend to reduce boilerplate code (e.g. Auto Layout) or solve complex problems that require extensive testing, such as date calculations. As you become more proficient with iOS, be sure to dive into the source here and there, and acquaint yourself with their underlying Apple frameworks. You'll find that those alone can do a lot of the heavy lifting.

### AFNetworking/Alamofire

The majority of iOS developers use one of these network libraries. While `NSURLSession` is surprisingly powerful by itself, [AFNetworking][afnetworking-github] and [Alamofire][alamofire-github] remain unbeaten when it comes to actually managing queues of requests, which is pretty much a requirement of any modern app. We recommend AFNetworking for Objective-C projects and Alamofire for Swift projects. While the two frameworks have subtle differences, they share the same ideology and are published by the same foundation.

### DateTools

As a general rule, [don't write your date calculations yourself][timezones-youtube]. Luckily, in [DateTools][datetools-github] you get an MIT-licensed, thoroughly tested library that covers pretty much all your calendar needs.

### Auto layout libraries

If you prefer to write your views in code, chances are you've heard of either Apple's awkward syntaxes – the regular `NSLayoutConstraint` factory or the so-called [Visual Format Language][visual-format-language]. The former is extremely verbose and the latter based on strings, which effectively prevents compile-time checking. Fortunately, they've addressed the issue in iOS 9, allowing [a more concise specification of constraints][nslayoutanchor].

If you're stuck with an earlier iOS version, [Masonry/SnapKit][snapkit-github] remedies the problem by introducing its own [DSL][dsl-wikipedia] to make, update and replace constraints. [PureLayout][purelayout-github] solves the same problem using Cocoa API style. For Swift, there is also [Cartography][cartography-github], which builds on the language's powerful operator overloading features. For the more conservative, [FLKAutoLayout][flkautolayout-github] offers a clean, but rather non-magical wrapper around the native APIs.

## Architecture

- [Model-View-Controller-Store (MVCS)][mvcs]

  - This is the default Apple architecture (MVC), extended by a Store layer that vends Model instances and handles the networking, caching etc.
  - Every Store exposes to the view controllers either `signals` or `void` methods with custom completion blocks.

- [Model-View-ViewModel (MVVM)][mvvm]
  - Motivated by "massive view controllers": MVVM considers `UIViewController` subclasses part of the View and keeps them slim by maintaining all state in the ViewModel.
  - To learn more about it, check out Bob Spryn's [fantastic introduction][sprynthesis-mvvm].
- [View-Interactor-Presenter-Entity-Routing (VIPER)][viper]
  - Rather exotic architecture that might be worth looking into in larger projects, where even MVVM feels too cluttered and testability is a major concern.

### “Event” Patterns

These are the idiomatic ways for components to notify others about things:

- **Delegation:** _(one-to-one)_ Apple uses this a lot (some would say, too much). Use when you want to communicate stuff back e.g. from a modal view.
- **Callback blocks:** _(one-to-one)_ Allow for a more loose coupling, while keeping related code sections close to each other. Also scales better than delegation when there are many senders.
- **Notification center:** _(one-to-many)_ Possibly the most common way for objects to emit “events” to multiple observers. Very loose coupling , notifications can even be observed globally without reference to the dispatching object.
- **Key-Value observing (KVO):** _(one-to-many)_ Does not require the observed object to explicitly “emit events” as long as it is _Key-Value Coding (KVC)_ compliant for the observed keys (properties). Usually not recommended due to its implicit nature and the cumbersome standard library API.
- **Signals:** _(one-to-many)_ The centerpiece of [ReactiveCocoa][reactivecocoa-github], they allow chaining and combining to your heart's content, thereby offering a way out of "callback hell".

### Models

Keep your models immutable, and use them to translate the remote API's semantics and types to your app. For Objective-C projects, Github's [Mantle](https://github.com/Mantle/Mantle) is a good choice. In Swift, you can use structs instead of classes to ensure immutability, and use Swift's [Codable][codableLink] to do the JSON-to-model mapping. There are also few third party libraries available. [SwiftyJSON][swiftyjson] and [Argo][argo] are the popular among them.

### Views

With today's wealth of screen sizes in the Apple ecosystem and the advent of split-screen multitasking on iPad, the boundaries between devices and form factors become increasingly blurred. Much like today's websites are expected to adapt to different browser window sizes, your app should handle changes in available screen real estate in a graceful way. This can happen e.g. if the user rotates the device or swipes in a secondary iPad app next to your own.

Instead of manipulating view frames directly, you should use [size classes][size-classes] and Auto Layout to declare constraints on your views. The system will then calculate the appropriate frames based on these rules, and re-evaluate them when the environment changes.

Apple's [recommended approach][wwdc-autolayout-mysteries] for setting up your layout constraints is to create and activate them once during initialization. If you need to change your constraints dynamically, hold references to them and then deactivate/activate them as required. The main use case for `UIView`'s `updateConstraints` (or its `UIViewController` counterpart, `updateViewConstraints`) is when you want the system to perform batch updates for better performance. However, this comes at the cost of having to call `setNeedsUpdateConstraints` elsewhere in your code, increasing its complexity.

If you override `updateConstraints` in a custom view, you should explicitly state that your view requires a constraint-based layout:

Swift:

```swift
override class var requiresConstraintBasedLayout: Bool {
    return true
}
```

Objective-C:

```objective-c
+ (BOOL)requiresConstraintBasedLayout {
    return YES
}
```

Otherwise, you may encounter strange bugs when the system doesn't call `updateConstraints()` as you would expect it to. [This blog post][edward-huynh-requiresconstraintbasedlayout] by Edward Huynh offers a more detailed explanation.

### Controllers

Use dependency injection, i.e. pass any required objects in as parameters, instead of keeping all state around in singletons. The latter is okay only if the state _really_ is global.

Swift:

```swift
let fooViewController = FooViewController(withViewModel: fooViewModel)
```

Objective-C:

```objective-c
FooViewController *fooViewController = [[FooViewController alloc] initWithViewModel:fooViewModel];
```

Try to avoid bloating your view controllers with logic that can safely reside in other places. Soroush Khanlou has a [good writeup][khanlou-destroy-massive-vc] of how to achieve this, and architectures like [MVVM](#architecture) treat view controllers as views, thereby greatly reducing their complexity.

## Stores

At the "ground level" of a mobile app is usually some kind of model storage, that keeps its data in places such as on disk, in a local database, or on a remote server. This layer is also useful to abstract away any activities related to the vending of model objects, such as caching.

Whether it means kicking off a backend request or deserializing a large file from disk, fetching data is often asynchronous in nature. Your store's API should reflect this by offering some kind of deferral mechanism, as synchronously returning the data would cause the rest of your app to stall.

If you're using [ReactiveCocoa][reactivecocoa-github], `SignalProducer` is a natural choice for the return type. For instance, fetching gigs for a given artist would yield the following signature:

Swift + ReactiveSwift:

```swift
func fetchGigs(for artist: Artist) -> SignalProducer<[Gig], Error> {
    // ...
}
```

ObjectiveC + ReactiveObjC:

```objective-c
- (RACSignal<NSArray<Gig *> *> *)fetchGigsForArtist:(Artist *)artist {
    // ...
}
```

Here, the returned `SignalProducer` is merely a "recipe" for getting a list of gigs. Only when started by the subscriber, e.g. a view model, will it perform the actual work of fetching the gigs. Unsubscribing before the data has arrived would then cancel the network request.

If you don't want to use signals, futures or similar mechanisms to represent your future data, you can also use a regular callback block. Keep in mind that chaining or nesting such blocks, e.g. in the case where one network request depends on the outcome of another, can quickly become very unwieldy – a condition generally known as "callback hell".

## Assets

[Asset catalogs][asset-catalogs] are the best way to manage all your project's visual assets. They can hold both universal and device-specific (iPhone 4-inch, iPhone Retina, iPad, etc.) assets and will automatically serve the correct ones for a given name. Teaching your designer(s) how to add and commit things there (Xcode has its own built-in Git client) can save a lot of time that would otherwise be spent copying stuff from emails or other channels to the codebase. It also allows them to instantly try out their changes and iterate if needed.

### Using bitmap images

Asset catalogs expose only the names of image sets, abstracting away the actual file names within the set. This nicely prevents asset name conflicts, as files such as `button_large@2x.png` are now namespaced inside their image sets. Appending the modifiers `-568h`, `@2x`, `~iphone` and `~ipad` are not required per se, but having them in the file name when dragging the file to an image set will automatically place them in the right "slot", thereby preventing assignment mistakes that can be hard to hunt down.

### Using vector images

You can include the original [vector graphics (PDFs)][vector-assets] produced by designers into the asset catalogs, and have Xcode automatically generate the bitmaps from that. This reduces the complexity of your project (the number of files to manage.)

### Image optimisation

Xcode automatically tries to optimise resources living in asset catalogs (yet another reason to use them). Developers can choose from lossless and lossy compression algorithms. App icons are an exception: Apps with large or unoptimised app icons are known to be rejected by Apple. For app icons and more advanced optimisation of PNG files we recommend using [pngcrush][pngcrush-website] or [ImageOptim][imageoptim-website], its GUI counterpart.

[afnetworking-github]: https://github.com/AFNetworking/AFNetworking
[alamofire-github]: https://github.com/Alamofire/Alamofire
[timezones-youtube]: https://www.youtube.com/watch?v=-5wpm-gesOY
[datetools-github]: https://github.com/MatthewYork/DateTools
[visual-format-language]: https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html
[nslayoutanchor]: https://developer.apple.com/library/prerelease/ios/documentation/AppKit/Reference/NSLayoutAnchor_ClassReference/index.html
[snapkit-github]: https://github.com/SnapKit/
[purelayout-github]: https://github.com/PureLayout/PureLayout
[dsl-wikipedia]: https://en.wikipedia.org/wiki/Domain-specific_language
[cartography-github]: https://github.com/robb/Cartography
[flkautolayout-github]: https://github.com/floriankugler/FLKAutoLayout
[mvcs]: http://programmers.stackexchange.com/questions/184396/mvcs-model-view-controller-store
[mvvm]: https://www.objc.io/issues/13-architecture/mvvm/
[sprynthesis-mvvm]: http://www.sprynthesis.com/2014/12/06/reactivecocoa-mvvm-introduction/
[viper]: https://www.objc.io/issues/13-architecture/viper/
[swiftyjson]: https://github.com/SwiftyJSON/SwiftyJSON
[argo]: https://github.com/thoughtbot/Argo
[codableLink]: https://developer.apple.com/documentation/foundation/archives_and_serialization/encoding_and_decoding_custom_types
[wwdc-autolayout-mysteries]: https://developer.apple.com/videos/wwdc/2015/?id=219
[edward-huynh-requiresconstraintbasedlayout]: http://www.edwardhuynh.com/blog/2013/11/24/the-mystery-of-the-requiresconstraintbasedlayout/
[khanlou-destroy-massive-vc]: http://khanlou.com/2014/09/8-patterns-to-help-you-destroy-massive-view-controller/
[asset-catalogs]: http://help.apple.com/xcode/mac/8.0/#/dev10510b1f7
[vector-assets]: http://martiancraft.com/blog/2014/09/vector-images-xcode6/
[pngcrush-website]: http://pmt.sourceforge.net/pngcrush/
[imageoptim-website]: https://imageoptim.com/mac
