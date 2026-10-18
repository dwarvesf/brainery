---
title: "Best practices in Android development, part 1: build setup and libraries"
description: "Android SDK, Gradle configuration, project structure, IDE choice and the libraries worth using, from the Dwarves fork of the Futurice guide."
date: null
redirect:
  - /7IUNoA
authors:
  - tieubao
series: android-best-practices
series_part: 1
series_total: 3
---

Avoid reinventing the wheel by following these guidelines.

> Note (October 2026): this guide is a fork of a 2017-era guide and predates current Android practice. The principles hold (build from Gradle files, no secrets in git, keep layouts flat, test release builds early). Several specifics have moved on:
>
> - Kotlin is Google's preferred language, and Jetpack Compose is the recommended UI toolkit for new screens. The Java-only, XML-layout advice below still applies to existing View-based code.
> - R8 replaced ProGuard as the default shrinker in Android Gradle Plugin 3.4. R8 reads the same `proguard-rules.pro` files, so the keep-rule advice still works.
> - For new storage code, Room (SQLite) and DataStore (key-value) are the usual choices over raw ContentProviders and SharedPreferences.
> - Retrolambda is not needed, and Robolectric now has first-class support in AndroidX Test, so "avoid Robolectric" is no longer a blanket rule. AssertJ-Android is no longer maintained.
> - Coroutines and Flow have taken over much of what RxJava was used for.
> - Check the current Android documentation before choosing library versions or a `minSdkVersion`.

**This series has 3 parts.** Each one reads on its own.

1. Build setup and libraries (this page)
2. [App structure and resources](android-best-practices-app-structure-resources.md)
3. [Testing, ProGuard, storage and tooling](android-best-practices-testing-storage-tooling.md)

## Summary

- [Use gradle and its default project structure](#build-system)
- [Put passwords and sensitive data in gradle.properties](#gradle-configuration)
- [Use the jackson library to parse JSON data](#libraries)
- [Don't write your own HTTP client, use okhttp libraries](#networklibs)
- [Avoid guava and use only a few libraries due to the _65k method limit_](#methodlimitation)
- [Sail carefully when choosing between activities and fragments](android-best-practices-app-structure-resources.md#activities-and-fragments)
- [Layout XMLs are code, organize them well](android-best-practices-app-structure-resources.md#resources)
- [Use styles to avoid duplicate attributes in layout XMLs](android-best-practices-app-structure-resources.md#styles)
- [Use multiple style files to avoid a single huge one](android-best-practices-app-structure-resources.md#splitstyles)
- [Keep your colors.xml short and DRY, just define the palette](android-best-practices-app-structure-resources.md#colorsxml)
- [Also keep dimens.xml DRY, define generic constants](android-best-practices-app-structure-resources.md#dimensxml)
- [Do not make a deep hierarchy of viewgroups](android-best-practices-app-structure-resources.md#deephierarchy)
- [Avoid client-side processing for webviews, and beware of leaks](android-best-practices-app-structure-resources.md#webviews)
- [Use JUnit for unit tests, espresso for connected (UI) tests, and assertj-android for easier assertions in your android tests](android-best-practices-testing-storage-tooling.md#test-frameworks)
- [Always use proguard or dexguard](android-best-practices-testing-storage-tooling.md#proguard-configuration)
- [Use sharedpreferences for simple persistence, otherwise contentproviders](android-best-practices-testing-storage-tooling.md#data-storage)
- [Use stetho to debug your application](android-best-practices-testing-storage-tooling.md#use-stetho)
- [Use leak canary to find memory leaks](android-best-practices-testing-storage-tooling.md#use-leakcanary)
- [Use continuous integration](android-best-practices-testing-storage-tooling.md#use-continuous-integration)

### Android SDK

Place your [Android SDK](https://developer.android.com/sdk/installing/index.html?pkg=tools) somewhere in your home directory or some other application-independent location. Some distributions of IDEs include the SDK when installed, and may place it under the same directory as the IDE. This can be bad when you need to upgrade (or reinstall) the IDE, as you may lose your SDK installation, forcing a long and tedious redownload.

Also avoid putting the SDK in a system-level directory that might need root permissions, to avoid permissions issues.

### Build system

Your default option should be [Gradle](https://gradle.org) using the [Android Gradle plugin](https://developer.android.com/studio/build/index.html).

It is important that your application's build process is defined by your Gradle files, rather than being reliant on IDE specific configurations. This allows for consistent builds between tools and better support for continuous integration systems.

### Project structure

Although Gradle offers a large degree of flexibility in your project structure, unless you have a compelling reason to do otherwise, you should accept its [default structure](https://developer.android.com/studio/build/index.html#sourcesets) as this simplify your build scripts.

### Gradle configuration

**General structure.** Follow [Google's guide on Gradle for Android](https://developer.android.com/studio/build/index.html).

**minSdkVersion: 21** We recommend to have a look at the [Android version usage chart](https://developer.android.com/about/dashboards/index.html#Platform) before defining the minimum API required. Remember that the statistics given are global statistics and may differ when targeting a specific regional/demographic market. It is worth mentioning that some material design features are only available on Android 5.0 (API level 21) and above. And also, from API 21, the multidex support library is not needed anymore.

**Small tasks.** Instead of (shell, Python, Perl, etc) scripts, you can make tasks in Gradle. Just follow [Gradle's documentation](http://www.gradle.org/docs/current/userguide/userguide_single.html#N10CBF) for more details. Google also provides some helpful [Gradle recipes](https://developer.android.com/studio/build/gradle-tips.html), specific to Android.

**Passwords.** In your app's `build.gradle` you will need to define the `signingConfigs` for the release build. Here is what you should avoid:

_Don't do this_. This would appear in the version control system.

```groovy
signingConfigs {
    release {
        // DON'T DO THIS!!
        storeFile file("myapp.keystore")
        storePassword "password123"
        keyAlias "thekey"
        keyPassword "password789"
    }
}
```

Instead, make a `gradle.properties` file which should _not_ be added to the version control system:

```
KEYSTORE_PASSWORD=password123
KEY_PASSWORD=password789
```

That file is automatically imported by Gradle, so you can use it in `build.gradle` as such:

```groovy
signingConfigs {
    release {
        try {
            storeFile file("myapp.keystore")
            storePassword KEYSTORE_PASSWORD
            keyAlias "thekey"
            keyPassword KEY_PASSWORD
        }
        catch (ex) {
            throw new InvalidUserDataException("You should define KEYSTORE_PASSWORD and KEY_PASSWORD in gradle.properties.")
        }
    }
}
```

**Prefer Maven dependency resolution to importing jar files.** If you explicitly include jar files in your project, they will be a specific frozen version, such as `2.1.1`. Downloading jars and handling updates is cumbersome and is a problem that Maven already solves properly. Where possible, you should attempt to use Maven to resolve your dependencies, for example:

```groovy
dependencies {
    implementation 'com.squareup.okhttp:okhttp3:3.8.0'
}
```

**Avoid Maven dynamic dependency resolution**
Avoid the use of dynamic dependency versions, such as `2.1.+` as this may result in different and unstable builds or subtle, untracked differences in behavior between builds. The use of static versions such as `2.1.1` helps create a more stable, predictable and repeatable development environment.

**Use different package name for non-release builds**
Use `applicationIdSuffix` for _debug_ [build type](http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Build-Types) to be able to install both _debug_ and _release_ apk on the same device (do this also for custom build types, if you need any). This will be especially valuable after your app has been published.

```groovy
android {
    buildTypes {
        debug {
            applicationIdSuffix '.debug'
            versionNameSuffix '-DEBUG'
        }

        release {
            // ...
        }
    }
}
```

Use different icons to distinguish the builds installed on a device, for example with different colors or an overlaid "debug" label. Gradle makes this very easy: with default project structure, simply put _debug_ icon in `app/src/debug/res` and _release_ icon in `app/src/release/res`. You could also [change app name](http://stackoverflow.com/questions/24785270/how-to-change-app-name-per-gradle-build-type) per build type, as well as `versionName` (as in the above example).

**Share debug app keystore file**
Sharing the debug APK keystore file via the app repository saves time when testing on shared devices and avoids the uninstalling/reinstalling of the app. It also simplifies the processing of working with some Android SDKs, such as Facebook, which require the registration of a single key store hash. Unlike the release key file, the debug key file can safely be added to your repository.

**Share code style formatting defintions**
Sharing the code style and formatting definitions via the app repository helps ensure a visually consistent code base and makes code comprehension and reviews easier.

### Android Studio as your main IDE

The recommended IDE for Android development is [Android Studio](https://developer.android.com/sdk/installing/studio.html) because it is developed and constantly updated by Google, has good support for Gradle, contains a range of useful monitoring and analysis tools and is fully tailored for Android development.

Avoid adding Android Studio's specific configuration files, such as `.iml` files to the version control system as these often contain configurations specific of your local machine, which won't work for your colleagues.

### Libraries

**[Jackson](http://wiki.fasterxml.com/JacksonHome)** is a Java library for JSON serialization and deserialization, it has a wide-scoped and versatile API, supporting various ways of processing JSON: streaming, in-memory tree model, and traditional JSON-POJO data binding.

[Gson](https://code.google.com/p/google-gson/) is another popular choice and being a smaller library than Jackson, you might prefer it to avoid 65k methods limitation. Also, if you are using

[Moshi](https://github.com/square/moshi), another of [Square's](https://github.com/square) open source libraries, builds upon learnings from the development of Gson and also integrates well with Kotlin.

<a name="networklibs"></a>
**Networking, caching, and images.** There are a couple of battle-proven solutions for performing requests to backend servers, which you should use rather than implementing your own client. We recommend basing your stack around [OkHttp](http://square.github.io/okhttp/) for efficient HTTP requests and using [Retrofit](http://square.github.io/retrofit/) to provide a typesafe layer. If you choose Retrofit, consider [Picasso](http://square.github.io/picasso/) for loading and caching images.

Retrofit, Picasso and OkHttp are created by the same company, so they complement each other nicely and compatability issues are uncommon.

[Glide](https://github.com/bumptech/glide) is another option for loading and caching images. It has support for animated GIFs, circular images and claims of better performance than Picasso, but also a bigger method count.

**RxJava** is a library for Reactive Programming, in other words, handling asynchronous events. It is a powerful paradigm, but it also has a steep learning curve. We recommend taking some caution before using this library to architect the entire application. For a reference app, our open source app [Freesound Android](https://github.com/futurice/freesound-android) makes extensive use of RxJava 2.

If you have no previous experience with Rx, start by applying it only for responses from app's backend APIs. Alternatively, start by applying it for simple UI event handling, like click events or typing events on a search field. If you are confident in your Rx skills and want to apply it to the whole architecture, then write documentation on all the tricky parts. Keep in mind that another programmer unfamiliar to RxJava might have a very hard time maintaining the project. Do your best to help them understand your code and also Rx.

Use [RxAndroid](https://github.com/ReactiveX/RxAndroid) for Android threading support and [RxBinding](https://github.com/JakeWharton/RxBinding) to easily create Observables from existing Android components.

**[Retrolambda](https://github.com/evant/gradle-retrolambda)** is a Java library for using Lambda expression syntax in Android and other pre-JDK8 platforms. It helps keep your code tight and readable especially if you use a functional style, such as in RxJava.

Android Studio offers code assist support for Java 8 lambdas. If you are new to lambdas, just use the following to get started:

- Any interface with just one method is "lambda friendly" and can be folded into the more tight syntax
- If in doubt about parameters and such, write a normal anonymous inner class and then let Android Studio fold it into a lambda for you.

Note that from Android Studio 3.0, [Retrolambda is no longer required](https://developer.android.com/studio/preview/features/java8-support.html).

<a name="methodlimitation"></a>
**Beware of the dex method limitation, and avoid using many libraries.** Android apps, when packaged as a dex file, have a hard limitation of 65536 referenced methods [[1]](https://medium.com/@rotxed/dex-skys-the-limit-no-65k-methods-is-28e6cb40cf71) [[2]](http://blog.persistent.info/2014/05/per-package-method-counts-for-androids.html) [[3]](http://jakewharton.com/play-services-is-a-monolith/). You will see a fatal error on compilation if you pass the limit. For that reason, use a minimal amount of libraries, and use the [dex-method-counts](https://github.com/mihaip/dex-method-counts) tool to determine which set of libraries can be used in order to stay under the limit. Especially avoid using the Guava library, since it contains over 13k methods.
