---
title: "Best practices in iOS development, part 1: getting started"
description: "How to start an iOS project: design guidelines, Xcode, project setup, dependency management, project structure and the minimum iOS version."
date: null
redirect:
  - /Fzxk4w
authors:
  - tieubao
series: ios-best-practices
series_part: 1
series_total: 4
---

_Snapshot from 2015. Some tools and numbers have changed._

Avoid reinventing the wheel by following these guidelines.

> Note: this page predates SwiftUI, Swift concurrency (`async`/`await`) and Swift Package Manager as a mainstream dependency tool, and parts of it assume Objective-C and the tooling of that time. JetBrains has also discontinued AppCode. Treat the library and tooling sections as historical context and check current Apple documentation before adopting a recommendation.

## Why?

Getting on board with iOS can be intimidating. Neither Swift nor Objective-C are widely used elsewhere, the platform has its own names for almost everything, and it's a bumpy road for your code to actually make it onto a physical device. This living document is here to help you, whether you're taking your first steps in Cocoaland or you're curious about doing things "the right way". Everything below is just suggestions, so if you have a good reason to do something differently, by all means go for it!

**This series has 4 parts.** Each one reads on its own.

1. Getting started (this page)
2. [Libraries, architecture, stores and assets](ios-best-practices-libraries-architecture-assets.md)
3. [Coding style, security, diagnostics and analytics](ios-best-practices-style-security-diagnostics.md)
4. [Building, deployment and in-app purchases](ios-best-practices-build-deploy-iap.md)

## Summary

- [Getting started](#getting-started)
- [Common libraries](ios-best-practices-libraries-architecture-assets.md#common-libraries)
- [Architecture](ios-best-practices-libraries-architecture-assets.md#architecture)
- [Stores](ios-best-practices-libraries-architecture-assets.md#stores)
- [Assets](ios-best-practices-libraries-architecture-assets.md#assets)
- [Coding style](ios-best-practices-style-security-diagnostics.md#coding-style)
- [Security](ios-best-practices-style-security-diagnostics.md#security)
- [Diagnostics](ios-best-practices-style-security-diagnostics.md#diagnostics)
- [Analytics](ios-best-practices-style-security-diagnostics.md#analytics)
- [Building](ios-best-practices-build-deploy-iap.md#building)
- [Deployment](ios-best-practices-build-deploy-iap.md#deployment)
- [In-app purchases (IAP)](ios-best-practices-build-deploy-iap.md#in-app-purchases-iap)

## Getting started

### Human interface guidelines

If you're coming from another platform, do take some time to familiarize yourself with Apple's [Human interface guidelines][ios-hig] for the platform. There is a strong emphasis on good design in the iOS world, and your app should be no exception. The guidelines also provide a handy overview of native UI elements, technologies such as 3D Touch or Wallet, and icon dimensions for designers.

### Xcode

[Xcode][xcode] is the IDE of choice for most iOS developers, and the only one officially supported by Apple. There are some alternatives, of which [AppCode][appcode] is arguably the most famous, but unless you're already a seasoned iOS person, go with Xcode. Despite its shortcomings, it's actually quite usable nowadays!

To install, simply download [Xcode on the Mac App store][xcode-app-store]. It comes with the newest SDK and simulators, and you can install more stuff under _Preferences > Downloads_.

### Project setup

A common question when beginning an iOS project is whether to write all views in code or use Interface Builder with Storyboards or XIB files. Both are known to occasionally result in working software. However, there are a few considerations:

#### Why code?

- Storyboards are more prone to version conflicts due to their complex XML structure. This makes merging much harder than with code.

- It's easier to structure and reuse views in code, thereby keeping your codebase [DRY][dry].
- All information is in one place. In Interface Builder you have to click through all the inspectors to find what you're looking for.
- Storyboards introduce coupling between your code and UI, which can lead to crashes e.g. when an outlet or action is not set up correctly. These issues are not detected by the compiler.

#### Why storyboards?

- For the less technically inclined, Storyboards can be a great way to contribute to the project directly, e.g. by tweaking colors or layout constraints. However, this requires a working project setup and some time to learn the basics.

- Iteration is often faster since you can preview certain changes without building the project.
- Custom fonts and UI elements are represented visually in Storyboards, giving you a much better idea of the final appearance while designing.
- For [size classes](http://futurice.com/blog/adaptive-views-in-ios-8), Interface Builder gives you a live layout preview for the devices of your choice, including iPad split-screen multitasking.

#### Why not both?

To get the best of both worlds, you can also take a hybrid approach: Start off by sketching the initial design with Storyboards, which are great for tinkering and quick changes. You can even invite designers to participate in this process. As the UI matures and reliability becomes more important, you then transition into a code-based setup that's easier to maintain and collaborate on.

### Ignores

A good first step when putting a project under version control is to have a decent `.gitignore` file. That way, unwanted files (user settings, temporary files, etc.) will never even make it into your repository. Luckily, GitHub has us covered for both [Swift][swift-gitignore] and [Objective-C][objc-gitignore].

### Dependency management

#### CocoaPods

If you're planning on including external dependencies (e.g. third-party libraries) in your project, [CocoaPods][cocoapods] offers easy and fast integration. Install it like so:

    sudo gem install cocoapods

To get started, move inside your iOS project folder and run

    pod init

This creates a Podfile, which will hold all your dependencies in one place. After adding your dependencies to the Podfile, you run

    pod install

to install the libraries and include them as part of a workspace which also holds your own project. For reasons stated [here][committing-pods-cocoapods] and [here][committing-pods], we recommend committing the installed dependencies to your own repo, instead of relying on having each developer run `pod install` after a fresh checkout.

Note that from now on, you'll need to open the `.xcworkspace` file instead of `.xcproject`, or your code will not compile. The command

    pod update

will update all pods to the newest versions permitted by the Podfile. You can use a wealth of [operators][cocoapods-pod-syntax] to specify your exact version requirements.

Update (2026): the CocoaPods team [plans to make trunk read-only][cocoapods-trunk-readonly]. Per their schedule, trunk stops accepting new Podspecs on December 2nd, 2026. Existing builds keep working, but pods from trunk will not get new versions after that.

#### Carthage

[Carthage][carthage] takes the ["simple, not easy"][simple-made-easy] approach by building your dependencies into binary frameworks, without magically integrating them with your project in any way. This also greatly reduces build times, because your dependencies have already been compiled by the time you start building.

There is no centralized repository of projects, which means any library that can be compiled into a framework supports Carthage out of the box.

To get started, follow the [instructions][carthage-instructions] in Carthage's documentation.

### Project structure

To keep all those hundreds of source files from ending up in the same directory, it's a good idea to set up some folder structure depending on your architecture. For instance, you can use the following:

    ├─ Models
    ├─ Views
    ├─ Controllers (or ViewModels, if your architecture is MVVM)
    ├─ Stores
    ├─ Helpers

First, create them as groups (little yellow "folders") within the group with your project's name in Xcode's Project Navigator. Then, for each of the groups, link them to an actual directory in your project path by opening their File Inspector on the right, hitting the little gray folder icon, and creating a new subfolder with the name of the group in your project directory.

#### Localization

Keep all user strings in localization files right from the beginning. This is good not only for translations, but also for finding user-facing text quickly. You can add a launch argument to your build scheme to launch the app in a certain language, e.g.

    -AppleLanguages (Finnish)

For more complex translations such as plural forms that depending on a number of items (e.g. "1 person" vs. "3 people"), you should use the [`.stringsdict` format][stringsdict-format] instead of a regular `localizable.strings` file. As soon as you've wrapped your head around the crazy syntax, you have a powerful tool that knows how to make plurals for "one", some", "few" and "many" items, as needed [e.g. in Russian or Arabic][language-plural-rules].

Find more information about localization in [these presentation slides][l10n-slides] from the February 2012 HelsinkiOS meetup. Most of the talk is still relevant.

#### Constants

Keep your constants' scope as small as possible. For instance, when you only need it inside a class, it should live in that class. Those constants that need to be truly app-wide should be kept in one place. In Swift, you can use enums defined in a `Constants.swift` file to group, store and access your app-wide constants in a clean way:

```swift

enum Config {
    static let baseURL = NSURL(string: "http://www.example.org/")!
    static let splineReticulatorName = "foobar"
}

enum Color {
    static let primaryColor = UIColor(red: 0.22, green: 0.58, blue: 0.29, alpha: 1.0)
    static let secondaryColor = UIColor.lightGray

    // A visual way to define colours within code files is to use #colorLiteral
    // This syntax will present you with colour picker component right on the code line
    static let tertiaryColor = #colorLiteral(red: 0.22, green: 0.58, blue: 0.29, alpha: 1.0)
}

```

When using Objective-C, keep app-wide constants in a `Constants.h` file that is included in the prefix header.

Instead of preprocessor macro definitions (via `#define`), use actual constants:

    static CGFloat const XYZBrandingFontSizeSmall = 12.0f;
    static NSString * const XYZAwesomenessDeliveredNotificationName = @"foo";

Actual constants are type-safe, have more explicit scope (they’re not available in all imported/included files until undefined), cannot be redefined or undefined in later parts of the code, and are available in the debugger.

### Minimum iOS version requirement

It’s useful to make an early decision on the minimum iOS version you want to support in your project: knowing which OS versions you need to develop and test against, and which system APIs you can rely on, helps you estimate your workload, and enables you to determine what’s possible and what’s not.

Use these resources to gather the data necessary for making this choice:

- Official “first-party” resources:
  - [Apple’s world-wide iOS version penetration statistics](https://developer.apple.com/support/app-store/): The primary public source for version penetration stats. Prefer more localized and domain-specific statistics, if available.
- Third-party resources:
  - [iOS Support Matrix](http://iossupportmatrix.com): Useful for determining which specific device models are ruled out by a given minimum OS version requirement.
  - [DavidSmith: iOS Version Stats](https://david-smith.org/iosversionstats/): Version penetration stats for David Smith’s Audiobooks apps.
  - [Mixpanel Trends: iOS versions](https://mixpanel.com/trends/#report/ios_frag): Version penetration stats from Mixpanel.

[ios-hig]: https://developer.apple.com/ios/human-interface-guidelines/
[xcode]: https://developer.apple.com/xcode/
[appcode]: https://www.jetbrains.com/objc/
[xcode-app-store]: https://itunes.apple.com/us/app/xcode/id497799835
[dry]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[swift-gitignore]: https://github.com/github/gitignore/blob/master/Swift.gitignore
[objc-gitignore]: https://github.com/github/gitignore/blob/master/Objective-C.gitignore
[cocoapods]: https://cocoapods.org/
[cocoapods-trunk-readonly]: https://blog.cocoapods.org/CocoaPods-Specs-Repo/
[cocoapods-pod-syntax]: http://guides.cocoapods.org/syntax/podfile.html#pod
[committing-pods]: https://www.dzombak.com/blog/2014/03/including-pods-in-source-control.html
[committing-pods-cocoapods]: https://guides.cocoapods.org/using/using-cocoapods.html#should-i-check-the-pods-directory-into-source-control
[carthage]: https://github.com/Carthage/Carthage
[simple-made-easy]: http://www.infoq.com/presentations/Simple-Made-Easy
[carthage-instructions]: https://github.com/Carthage/Carthage#installing-carthage
[stringsdict-format]: https://developer.apple.com/library/prerelease/ios/documentation/MacOSX/Conceptual/BPInternational/StringsdictFileFormat/StringsdictFileFormat.html
[language-plural-rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[l10n-slides]: https://speakerdeck.com/hasseg/localization-practicum
