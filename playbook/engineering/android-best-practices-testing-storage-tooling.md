---
title: "Best practices in Android development, part 3: testing, ProGuard, storage and tooling"
description: "Test frameworks, emulators, ProGuard configuration, data storage, and the debugging and CI tools that keep an Android app healthy."
date: null
authors: []
credit: Futurice
credit_url: "https://github.com/futurice/android-best-practices"
slug: android-best-practices-testing-storage-tooling
announce: false
series: android-best-practices
series_part: 3
series_total: 3
---

This part covers what happens around the code: test frameworks, emulators, shrinking and obfuscation with ProGuard, local data storage, and three tools worth wiring in early (Stetho, LeakCanary and continuous integration). The guide dates from 2017. R8 now replaces ProGuard as the default shrinker but reads the same rule files, and Room and DataStore are the usual storage choices today. Part 1 lists the other changes.

> Part 3 of 3 in the Android best practices series. Previous: [Best practices in Android development, part 2: app structure and resources](android-best-practices-app-structure-resources.md)

## Test frameworks

**Use [JUnit](https://developer.android.com/training/testing/unit-testing/local-unit-tests.html) for unit testing** Plain, Android dependency-free unit testing on the JVM is best done using [Junit](https://junit.org).

**Avoid [Robolectric](http://robolectric.org/)** Prior to the improved support for JUnit in the Android build system, Robolectric was promoted as a test framework seeking to provide tests "disconnected from device" for the sake of development speed. However, testing under Robolectric is inaccurate and incomplete as it works by providing mock implementations of the Android platform, which provides no guarantees of correctness. Instead, use a combination of JVM based unit tests and dedicated on-device integration tests.

**[Espresso](https://developer.android.com/training/testing/ui-testing/espresso-testing.html) makes writing UI tests easy.**

**[AssertJ-Android](http://square.github.io/assertj-android/) an AssertJ extension library making assertions easy in Android tests** Assert-J comes modules easier for you to test Android specific components, such as the Android Support, Google Play Services and Appcompat libraries.

A test assertion will look like:

```java
// Example assertion using AssertJ-Android
assertThat(layout).isVisible()
    .isVertical()
    .hasChildCount(5);
```

## Emulators

The performance of the Android SDK emulator, particularly the x86 variant, has improvement markedly in recent years and is now adequate for most day-to-day development scenarios. However, you should not discount the value of ensuring your application behaves correctly on real devices. Of course, testing on all possible devices is not practical, so rather focus your efforts on devices with a large market share and those most relevant to your app.

## Proguard configuration

[ProGuard](http://proguard.sourceforge.net/) is normally used on Android projects to shrink and obfuscate the packaged code.

Whether you are using ProGuard or not depends on your project configuration. Usually you would configure Gradle to use ProGuard when building a release APK.

```groovy
buildTypes {
    debug {
        minifyEnabled false
    }
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

In order to determine which code has to be preserved and which code can be discarded or obfuscated, you have to specify one or more entry points to your code. These entry points are typically classes with main methods, applets, midlets, activities, etc.
Android framework uses a default configuration which can be found from `SDK_HOME/tools/proguard/proguard-android.txt`. Using the above configuration, custom project-specific ProGuard rules, as defined in `my-project/app/proguard-rules.pro`, will be appended to the default configuration.

A common problem related to ProGuard is to see the application crashing on startup with `ClassNotFoundException` or `NoSuchFieldException` or similar, even though the build command (i.e. `assembleRelease`) succeeded without warnings.
This means one out of two things:

1. ProGuard has removed the class, enum, method, field or annotation, considering it's not required.
2. ProGuard has obfuscated (renamed) the class, enum or field name, but it's being used indirectly by its original name, i.e. through Java reflection.

Check `app/build/outputs/proguard/release/usage.txt` to see if the object in question has been removed.
Check `app/build/outputs/proguard/release/mapping.txt` to see if the object in question has been obfuscated.

In order to prevent ProGuard from _stripping away_ needed classes or class members, add a `keep` options to your ProGuard config:

```
-keep class com.dwarvesf.project.MyClass { *; }
```

To prevent ProGuard from _obfuscating_ classes or class members, add a `keepnames`:

```
-keepnames class com.dwarvesf.project.MyClass { *; }
```

Read more at [Proguard](https://www.guardsquare.com/en/proguard/manual/examples) for examples.

**Early in your project, make and test release build** to check whether ProGuard rules are correctly retaining your dependencies. Also whenever you include new libraries or update their dependencies, make a release build and test the APK on a device. Don't wait until your app is finally version "1.0" to make a release build, you might get several unpleasant surprises and a short time to fix them.

**Tip.** Save the `mapping.txt` file for every release that you publish to your users. By retaining a copy of the `mapping.txt` file for each release build, you ensure that you can debug a problem if a user encounters a bug and submits an obfuscated stack trace.

**DexGuard**. If you need hard-core tools for optimizing, and specially obfuscating release code, consider [DexGuard](http://www.saikoa.com/dexguard), a commercial software made by the same team that built ProGuard. It can also easily split Dex files to solve the 65k methods limitation.

## Data storage

### SharedPreferences

If you only need to persist simple values and your application runs in a single process SharedPreferences is probably enough for you. It is a good default option.

There are some situations where SharedPreferences are not suitable:

- _Performance_: Your data is complex or there is a lot of it
- _Multiple processes accessing the data_: You have widgets or remote services that run in their own processes and require synchronized data
- _Relational data_ Distinct parts of your data are relational and you want to enforce that those relationships are maintained.

You can also store more complex objects by serializing them to JSON to store them and deserializing them when retrieving. You should consider the tradeoffs when doing this as it may not be particularly performant, nor maintainable.

### ContentProviders

In case SharedPreferences are not enough, you should use the platform standard ContentProviders, which are fast and process safe.

The single problem with ContentProviders is the amount of boilerplate code that is needed to set them up, as well as low quality tutorials. It is possible, however, to generate the ContentProvider by using a library such as [Schematic](https://github.com/SimonVT/schematic), which significantly reduces the effort.

You still need to write some parsing code yourself to read the data objects from the Sqlite columns and vice versa. It is possible to serialize the data objects, for instance with Gson, and only persist the resulting string. In this way you lose in performance but on the other hand you do not need to declare a column for all the fields of the data class.

### Using an ORM

We generally do not recommend using an Object-Relation Mapping library unless you have unusually complex data and you have a dire need. They tend to be complex and require time to learn. If you decide to go with an ORM you should pay attention to whether or not it is _process safe_ if your application requires it, as many of the existing ORM solutions surprisingly are not.

## Use Stetho

[Stetho](http://facebook.github.io/stetho/) is a debug bridge for Android applications from Facebook that integrates with the Chrome desktop browser's Developer Tools. With Stetho you can easily inspect your application, most notably the network traffic. It also allows you to easily inspect and edit SQLite databases and the shared preferences in your app. You should, however, make sure that Stetho is only enabled in the debug build and not in the release build variant.

Another alternative is [Chuck](https://github.com/jgilfelt/chuck) which, although offering slightly more simplified functionality, is still useful for testers as the logs are displayed on the device, rather than in the more complicated connected Chrome browser setup that Stetho requires.

## Use LeakCanary

[LeakCanary](https://github.com/square/leakcanary) is a library that makes runtime detection and identification of memory leaks a more routine part of your application development process. See the library [wiki](https://github.com/square/leakcanary/wiki) for details on configuration and usage. Just remember to configure only the "no-op" dependency in your release build!

## Use continuous integration

Continuous integration systems let you automatically build and test your project every time you push updates to version control. Continuous integration also runs static code analysis tools, generates the APK files and distributes them.
[Lint](https://developer.android.com/studio/write/lint.html) and [Checkstyle](http://checkstyle.sourceforge.net/) are tools that ensure the code quality while [Findbugs](http://findbugs.sourceforge.net/) looks for bugs in the code.

There is a wide variety of continuous integration software which provide different features. Pricing plans might be for free if your project is open-sourced.
[Gitlab CI](https://about.gitlab.com/product/continuous-integration/) or [Jenkins](https://jenkins.io/) is a good option if you have a local server at your disposal, on the other hand [Travis CI](https://travis-ci.org/) is also a recommended choice if you plan to use a cloud-based continuous integration service.

## Acknowledgements

Thanks to [Futurice](https://github.com/futurice/android-best-practices). We hard forked and made a revised version based on their guideline.
