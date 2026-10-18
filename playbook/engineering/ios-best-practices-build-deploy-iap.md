---
title: "Best practices in iOS development, part 4: building, deployment and in-app purchases"
description: "Build configurations, targets and schemes, code signing and provisioning, uploading to App Store Connect, and in-app purchases."
date: null
authors:
  - tieubao
slug: ios-best-practices-build-deploy-iap
announce: false
series: ios-best-practices
series_part: 4
series_total: 4
---

This part covers getting an iOS app from source to the App Store: build configurations, targets and schemes, code signing and provisioning, uploading a build, and in-app purchases. Provisioning is the longest section. It is a snapshot from 2015, so check Apple's current documentation for exact screens. Part 1 explains what else has moved on.

> Part 4 of 4 in the iOS best practices series. Previous: [Best practices in iOS development, part 3: coding style, security, diagnostics and analytics](ios-best-practices-style-security-diagnostics.md)

## Building

This section contains an overview of this topic , please refer here for more comprehensive information:

- [iOS Developer Library: Xcode Concepts][apple-xcode-concepts]
- [Samantha Marshall: Managing Xcode][pewpew-managing-xcode]


### Build configurations

Even simple apps can be built in different ways. The most basic separation that Xcode gives you is that between _debug_ and _release_ builds. For the latter, there is a lot more optimization going on at compile time, at the expense of debugging possibilities. Apple suggests that you use the _debug_ build configuration for development, and create your App store packages using the _release_ build configuration. This is codified in the default scheme (the dropdown next to the Play and Stop buttons in Xcode), which commands that _debug_ be used for Run and _release_ for Archive.

However, this is a bit too simple for real-world applications. You might have different environments for testing, staging and other activities related to your service. Each might have its own base URL, log level, bundle identifier (so you can install them side-by-side), provisioning profile and so on. Therefore a simple debug/release distinction won't cut it. You can add more build configurations on the "Info" tab of your project settings in Xcode.

#### `xcconfig` files for build settings

Typically build settings are specified in the Xcode GUI, but you can also use _configuration settings files_ (“`.xcconfig` files”) for them. The benefits of using these are:

- You can add comments to explain things.
- You can `#include` other build settings files, which helps you avoid repeating yourself:
  - If you have some settings that apply to all build configurations, add a `Common.xcconfig` and `#include` it in all the other files.
  - If you e.g. want to have a “Debug” build configuration that enables compiler optimizations, you can just `#include "MyApp_Debug.xcconfig"` and override one of the settings.
- Conflict resolution and merging becomes easier.

Find more information about this topic in [these presentation slides][xcconfig-slides].


### Targets

A target resides conceptually below the project level, i.e. a project can have several targets that may override its project settings. Roughly, each target corresponds to "an app" within the context of your codebase. For instance, you could have country-specific apps (built from the same codebase) for different countries' App Stores. Each of these will need development/staging/release builds, so it's better to handle those through build configurations, not targets. It's not uncommon at all for an app to only have a single target.

### Schemes

Schemes tell Xcode what should happen when you hit the Run, Test, Profile, Analyze or Archive action. Basically, they map each of these actions to a target and a build configuration. You can also pass launch arguments, such as the language the app should run in (handy for testing your localizations!) or set some diagnostic flags for debugging.

A suggested naming convention for schemes is `MyApp (<Language>) [Environment]`:

    MyApp (English) [Development]
    MyApp (German) [Development]
    MyApp [Testing]
    MyApp [Staging]
    MyApp [App store]

For most environments the language is not needed, as the app will probably be installed through other means than Xcode, e.g. TestFlight, and the launch argument thus be ignored anyway. In that case, the device language should be set manually to test localization.

## Deployment

Deploying software on iOS devices isn't exactly straightforward. That being said, here are some central concepts that, once understood, will help you tremendously with it.

### Signing

Whenever you want to run software on an actual device (as opposed to the simulator), you will need to sign your build with a **certificate** issued by Apple. Each certificate is linked to a private/public keypair, the private half of which resides in your Mac's Keychain. There are two types of certificates:

- **Development certificate:** Every developer on a team has their own, and it is generated upon request. Xcode might do this for you, but it's better not to press the magic "Fix issue" button and understand what is actually going on. This certificate is needed to deploy development builds to devices.
- **Distribution certificate:** There can be several, but it's best to keep it to one per organization, and share its associated key through some internal channel. This certificate is needed to ship to the App store, or your organization's internal "enterprise app store".

### Provisioning

Besides certificates, there are also **provisioning profiles**, which are basically the missing link between devices and certificates. Again, there are two types to distinguish between development and distribution purposes:

- **Development provisioning profile:** It contains a list of all devices that are authorized to install and run the software. It is also linked to one or more development certificates, one for each developer that is allowed to use the profile. The profile can be tied to a specific app or use a wildcard App ID (\*). The latter is discouraged, because Xcode is notoriously bad at picking the correct files for signing unless guided in the right direction. Also, certain capabilities like Push Notifications or App Groups require an explicit App ID.

- **Distribution provisioning profile:** There are three different ways of distribution, each for a different use case. Each distribution profile is linked to a distribution certificate, and will be invalid when the certificate expires.
  - **Ad-Hoc:** Just like development profiles, it contains a whitelist of devices the app can be installed to. This type of profile can be used for beta testing on 100 devices per year. For a smoother experience, you can use Apple's [TestFlight][testflight] service, which today allows up to 100 internal testers and up to 10,000 external testers. Supertop offers a good [summary of its advantages and issues][testflight-discussion].
  - **App store:** This profile has no list of allowed devices, as anyone can install it through Apple's official distribution channel. This profile is required for all App store releases.
  - **Enterprise:** Just like App store, there is no device whitelist, and the app can be installed by anyone with access to the enterprise's internal "app store", which can be just a website with links. This profile is available only on Enterprise accounts.


To sync all certificates and profiles to your machine, go to Accounts in Xcode's Preferences, add your Apple ID if needed, and double-click your team name. There is a refresh button at the bottom, but sometimes you just need to restart Xcode to make everything show up.

#### Debugging provisioning

Sometimes you need to debug a provisioning issue. For instance, Xcode may refuse to install the build to an attached device, because the latter is not on the (development or ad-hoc) profile's device list. In those cases, you can use Craig Hockenberry's excellent [Provisioning][provisioning] plugin by browsing to `~/Library/MobileDevice/Provisioning Profiles`, selecting a `.mobileprovision` file and hitting Space to launch Finder's Quick Look feature. It will show you a wealth of information such as devices, entitlements, certificates, and the App ID.

When dealing with an existing app archive (`.ipa`), you can inspect its provisioning profile in a similar fashion: Simply rename the `*.ipa` to `*.zip`, unpack it and find the `.app` package within. From its Finder context menu, choose "Show Package Contents" to see a file called `embedded.mobileprovision` that you can examine with the above method.


### Uploading

[App store Connect][appstore-connect] is Apple's portal for managing your apps on the App store. To upload a build, Xcode requires an Apple ID that is part of the developer account used for signing. Nowadays Apple has allowed for single Apple IDs to be part of multiple App store Connect accounts (i.e. client organizations) in both Apple's developer portal as well as App store Connect.

After uploading the build, be patient as it can take up to an hour for it to show up under the Builds section of your app version. When it appears, you can link it to the app version and submit your app for review.


## In-app purchases (IAP)

When validating in-app purchase receipts, remember to perform the following checks:

- **Authenticity:** That the receipt comes from Apple
- **Integrity:** That the receipt has not been tampered with
- **App match:** That the app bundle ID in the receipt matches your app’s bundle identifier
- **Product match:** That the product ID in the receipt matches your expected product identifier
- **Freshness:** That you haven’t seen the same receipt ID before.

Whenever possible, design your IAP system to store the content for sale server-side, and provide it to the client only in exchange for a valid receipt that passes all of the above checks. This kind of a design thwarts common piracy mechanisms, and , since the validation is performed on the server , allows you to use Apple’s HTTP receipt validation service instead of interpreting the receipt `PKCS #7` / `ASN.1` format yourself.

### Acknowledgements

Thanks to [Futurice](https://github.com/futurice/ios-good-practices). We hard forked and made a revised version based on their guideline.

[apple-xcode-concepts]: https://developer.apple.com/library/ios/featuredarticles/XcodeConcepts/
[pewpew-managing-xcode]: http://pewpewthespells.com/blog/managing_xcode.html
[xcconfig-slides]: https://speakerdeck.com/hasseg/xcode-configuration-files
[testflight]: https://developer.apple.com/testflight/
[testflight-discussion]: http://blog.supertop.co/post/108759935377/app-developer-friends-try-testflight
[provisioning]: https://github.com/chockenberry/Provisioning
[appstore-connect]: https://appstoreconnect.apple.com
