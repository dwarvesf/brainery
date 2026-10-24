---
title: "Best practices in iOS development, part 3: coding style, security, diagnostics and analytics"
description: "Naming and code structure, secure storage and networking, compiler warnings, the static analyzer, debugging, profiling, analytics and crash logs."
date: null
authors: []
credit: Futurice
credit_url: "https://github.com/futurice/ios-good-practices"
slug: ios-best-practices-style-security-diagnostics
announce: false
series: ios-best-practices
series_part: 3
series_total: 4
type: playbook
topic: product-engineering
---

This part covers how to keep an iOS codebase readable, safe and observable: naming and structure, security basics for data, networking and logging, the diagnostic tools Xcode ships, and analytics with crash logs. It is a snapshot from 2015. Some tools named here have changed, and part 1 explains how.

> Part 3 of 4 in the iOS best practices series. Previous: [Best practices in iOS development, part 2: libraries, architecture, stores and assets](ios-best-practices-libraries-architecture-assets.md) | Next: [Best practices in iOS development, part 4: building, deployment and in-app purchases](ios-best-practices-build-deploy-iap.md)

## Coding style

### Naming

Apple pays great attention to keeping naming consistent. Adhering to their [coding guidelines for Objective-C][cocoa-coding-guidelines] and [API design guidelines for Swift][swift-api-design-guidelines] makes it much easier for new people to join the project.

Here are some basic takeaways you can start using right away:

A method beginning with a _verb_ indicates that it performs some side effects, but won't return anything:
`- (void)loadView;`
`- (void)startAnimating;`

Any method starting with a _noun_, however, returns that object and should do so without side effects:
`- (UINavigationItem *)navigationItem;`
`+ (UILabel *)labelWithText:(NSString *)text;`

It pays off to keep these two as separated as possible, i.e. not perform side effects when you transform data, and vice versa. That will keep your side effects contained to smaller sections of the code, which makes it more understandable and facilitates debugging.

### Structure

`MARK:` comments (Swift) and [pragma marks][nshipster-pragma-marks] (Objective-C) are a great way to group your methods, especially in view controllers. Here is a Swift example for a common structure that works with almost any view controller:

```swift

import SomeExternalFramework

class FooViewController : UIViewController, FoobarDelegate {

    let foo: Foo

    private let fooStringConstant = "FooConstant"
    private let floatConstant = 1234.5

    // MARK: Lifecycle

    // Custom initializers go here

    // MARK: View Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        // ...
    }

    // MARK: Layout

    private func makeViewConstraints() {
        // ...
    }

    // MARK: User Interaction

    func foobarButtonTapped() {
        // ...
    }

    // MARK: FoobarDelegate

    func foobar(foobar: Foobar, didSomethingWithFoo foo: Foo) {
        // ...
    }

    // MARK: Additional Helpers

    private func displayNameForFoo(foo: Foo) {
        // ...
    }

}
```

The most important point is to keep these consistent across your project's classes.

### External style guides

- GitHub: [Swift](https://github.com/github/swift-style-guide) and [Objective-C](https://github.com/github/objective-c-style-guide)

- Ray Wenderlich: [Swift](https://github.com/raywenderlich/swift-style-guide) and [Objective-C](https://github.com/raywenderlich/objective-c-style-guide)
- Google: [Objective-C](https://google.github.io/styleguide/objcguide.html)
- The New York Times: [Objective-C](https://github.com/NYTimes/objective-c-style-guide)
- Sam Soffes: [Objective-C](https://gist.github.com/soffes/812796)
- Luke Redpath: [Objective-C](http://lukeredpath.co.uk/blog/2011/06/28/my-objective-c-style-guide/)

## Security

Even in an age where we trust our portable devices with the most private data, app security remains an often-overlooked subject. Try to find a good trade-off given the nature of your data; following just a few simple rules can go a long way here. A good resource to get started is Apple's own [iOS Security Guide][apple-security-guide].

### Data storage

If your app needs to store sensitive data, such as a username and password, an authentication token or some personal user details, you need to keep these in a location where they cannot be accessed from outside the app. Never use `NSUserDefaults`, other plist files on disk or Core Data for this, as they are not encrypted! In most such cases, the iOS Keychain is your friend. If you're uncomfortable working with the C APIs directly, you can use a wrapper library such as [SSKeychain][sskeychain] or [UICKeyChainStore][uickeychainstore].

When storing files and passwords, be sure to set the correct protection level, and choose it conservatively. If you need access while the device is locked (e.g. for background tasks), use the "accessible after first unlock" variety. In other cases, you should probably require that the device is unlocked to access the data. Only keep sensitive data around while you need it.

### Networking

Keep any HTTP traffic to remote servers encrypted with TLS at all times. To avoid man-in-the-middle attacks that intercept your encrypted traffic, you can set up [certificate pinning][certificate-pinning]. Popular networking libraries such as [AFNetworking][afnetworking-github] and [Alamofire][alamofire-github] support this out of the box.

### Logging

Take extra care to set up proper log levels before releasing your app. Production builds should never log passwords, API tokens and the like, as this can easily cause them to leak to the public. On the other hand, logging the basic control flow can help you pinpoint issues that your users are experiencing.

### User interface

When using `UITextField`s for password entry, remember to set their `secureTextEntry` property to `true` to avoid showing the password in cleartext. You should also disable auto-correction for the password field, and clear the field whenever appropriate, such as when your app enters the background.

When this happens, it's also good practice to clear the Pasteboard to avoid passwords and other sensitive data from leaking. As iOS may take screenshots of your app for display in the app switcher, make sure to clear any sensitive data from the UI _before_ returning from `applicationDidEnterBackground`.

## Diagnostics

### Compiler warnings

Enable as many compiler warnings as possible and treat those warnings as errors -- [it will be worth it in the long run][warnings-slides].

For Objective-C code, add these values to the _“Other Warning Flags”_ build setting:

- `-Wall` _(enables lots of additional warnings)_
- `-Wextra` _(enables more additional warnings)_

and then enable the _“Treat warnings as errors”_ build setting.

To treat warnings as errors for Swift code, add `-warnings-as-errors` to the _"Other Swift Flags"_ build setting.

### Clang static analyzer

The Clang compiler (which Xcode uses) has a _static analyzer_ that performs control and data flow analysis on your code and checks for lots of errors that the compiler cannot.

You can manually run the analyzer from the _Product → Analyze_ menu item in Xcode.

The analyzer can work in either “shallow” or “deep” mode. The latter is much slower but may find more issues due to cross-function control and data flow analysis.

Recommendations:

- Enable _all_ of the checks in the analyzer (by enabling all of the options in the “Static Analyzer” build setting sections).
- Enable the _“Analyze during ‘Build’”_ build setting for your release build configuration to have the analyzer run automatically during release builds. (Seriously, do this , you’re not going to remember to run it manually.)
- Set the _“Mode of Analysis for ‘Analyze’”_ build setting to _Shallow (faster)_.
- Set the _“Mode of Analysis for ‘Build’”_ build setting to _Deep_.

### Debugging

When your app crashes, Xcode does not break into the debugger by default. To achieve this, add an exception breakpoint (click the "+" at the bottom of Xcode's Breakpoint Navigator) to halt execution whenever an exception is raised. In many cases, you will then see the line of code responsible for the exception. This catches any exception, even handled ones. If Xcode keeps breaking on benign exceptions in third party libraries e.g., you might be able to mitigate this by choosing _Edit Breakpoint_ and setting the _Exception_ drop-down to _Objective-C_.

For view debugging, [Reveal][reveal] and [Spark Inspector][spark-inspector] are two powerful visual inspectors that can save you hours of time, especially if you're using Auto Layout and want to locate views that are collapsed or off-screen. Xcode also has integrated [view debugger][xcode-view-debugging] which is good enough and free to use.

### Profiling

Xcode comes with a profiling suite called Instruments. It contains a myriad of tools for profiling memory usage, CPU, network communications, graphics and much more. It's a complex beast, but one of its more straight-forward use cases is tracking down memory leaks with the Allocations instrument. Simply choose _Product_ > _Profile_ in Xcode, select the Allocations instrument, hit the Record button and filter the Allocation Summary on some useful string, like the prefix of your own app's class names. The count in the Persistent column then tells you how many instances of each object you have. Any class for which the instance count increases indiscriminately indicates a memory leak.

Pay extra attention to how and where you create expensive classes. `NSDateFormatter`, for instance, is very expensive to create and doing so in rapid succession, e.g. inside a `tableView:cellForRowAtIndexPath:` method, can really slow down your app. Instead, keep a static instance of it around for each date format that you need.

## Analytics

Including some analytics framework in your app is strongly recommended, as it allows you to gain insights on how people actually use it. Does feature X add value? Is button Y too hard to find? To answer these, you can send events, timings and other measurable information to a service that aggregates and visualizes them – for instance, [Google Tag Manager][google-tag-manager]. The latter is more versatile than Google Analytics in that it inserts a data layer between app and Analytics, so that the data logic can be modified through a web service without having to update the app.

A good practice is to create a slim helper class, e.g. `AnalyticsHelper`, that handles the translation from app-internal models and data formats (`FooModel`, `NSTimeInterval`, …) to the mostly string-based data layer:

```swift

func pushAddItemEvent(with item: Item, editMode: EditMode) {
    let editModeString = name(for: editMode)

    pushToDataLayer([
        "event": "addItem",
        "itemIdentifier": item.identifier,
        "editMode": editModeString
    ])
}

```

This has the additional advantage of allowing you to swap out the entire Analytics framework behind the scenes if needed, without the rest of the app noticing.

### Crash logs

First you should make your app send crash logs onto a server somewhere so that you can access them. You can implement this manually (using [PLCrashReporter][plcrashreporter] and your own backend) but it’s recommended that you use an existing service instead , for example one of the following:

- [Fabric](https://get.fabric.io)
- HockeyApp (retired by Microsoft on 11/17/2019, see the [lifecycle page](https://learn.microsoft.com/en-us/lifecycle/products/hockeyapp))
- [Crittercism](https://www.crittercism.com)
- Splunk MINTexpress
- [Instabug](https://instabug.com/)

Once you have this set up, ensure that you _save the Xcode archive (`.xcarchive`)_ of every build you release. The archive contains the built app binary and the debug symbols (`dSYM`) which you will need to symbolicate crash reports from that particular version of your app.

[afnetworking-github]: https://github.com/AFNetworking/AFNetworking
[alamofire-github]: https://github.com/Alamofire/Alamofire
[cocoa-coding-guidelines]: https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/CodingGuidelines/CodingGuidelines.html
[swift-api-design-guidelines]: https://swift.org/documentation/api-design-guidelines/
[nshipster-pragma-marks]: http://nshipster.com/pragma/
[apple-security-guide]: https://www.apple.com/business/docs/iOS_Security_Guide.pdf
[sskeychain]: https://github.com/soffes/sskeychain
[uickeychainstore]: https://github.com/kishikawakatsumi/UICKeyChainStore
[certificate-pinning]: https://possiblemobile.com/2013/03/ssl-pinning-for-increased-app-security/
[warnings-slides]: https://speakerdeck.com/hasseg/the-compiler-is-your-friend
[reveal]: http://revealapp.com/
[spark-inspector]: http://sparkinspector.com
[xcode-view-debugging]: https://developer.apple.com/library/prerelease/content/documentation/DeveloperTools/Conceptual/debugging_with_xcode/chapters/special_debugging_workflows.html
[google-tag-manager]: https://www.google.com/analytics/tag-manager/
[plcrashreporter]: https://www.plcrashreporter.org
