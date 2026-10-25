---
draft: false
title: "Test doubles in Go, part 1: dummies and stubs"
description: "What test doubles are, when and why to use them in Go, and how dummies and stubs work with code examples."
date: 2023-08-08
blog: "https://dwarvesf.hashnode.dev/understanding-test-doubles-an-in-depth-look"
github_id: datphamcode295
icy: 15
redirect:
  - /PKmGtg
authors:
  - datphamcode295
series: go-test-doubles
series_part: 1
series_total: 2
type: research
topic: languages
secondary_topics:
  - production-readiness
---

In the world of software development, testing plays a vital role in ensuring the reliability and stability of our applications. When writing tests, we often come across situations where certain dependencies need to be simulated or replaced to isolate the behavior of the code under test. This is where Test Doubles come into play.

Test Doubles, also known as Test Fakes or Test Stubs, are powerful techniques used to create substitutes for collaborating objects in our tests. These substitutes allow us to control the behavior of these dependencies, facilitating focused and reliable testing. In the context of Go programming, Test Doubles provide a way to enhance the effectiveness of our unit tests and improve the overall quality of our software.

**This series has 2 parts.** Each one reads on its own.

1. Dummies and stubs (this page)
2. [Spies, mocks, fakes and best practices](go-test-doubles-spies-mocks-fakes.md)

### The five types of Test Doubles are:

![](assets/test-doubles_2.webp)

- **Dummy**: It is used as a placeholder when an argument needs to be filled in.
- **Stub**: It provides fake data to the SUT (System Under Test).
- **Spy**: It records information about how the class is being used.
- **Mock**: It defines an expectation of how it will be used. It will cause failure if the expectation isn’t met.
- **Fake**: It is an actual implementation of the contract but is unsuitable for production.

### When do we need Test Doubles?

There are several scenarios in which Test Doubles become invaluable. One common use case arises when an application relies on external services, databases, or APIs. Accessing these services during unit testing can introduce dependencies on their availability, performance, or even the data they contain. By employing Test Doubles, we can avoid such dependencies and ensure that our tests remain isolated and predictable.

Another situation where Test Doubles are beneficial is when certain code paths are challenging to reach or when we want to simulate specific conditions that are hard to reproduce in real-world scenarios. For instance, simulating network failures, time-sensitive operations, or exceptional error conditions can be challenging without Test Doubles. They enable us to create controlled environments that simulate these scenarios, allowing us to thoroughly test our code's resilience and edge case handling.

### Why use Test Doubles?

The primary motivation behind using Test Doubles is to decouple the code under test from its dependencies, allowing us to test components in isolation. By replacing real objects with Test Doubles, we gain fine-grained control over their behavior, ensuring that our tests focus solely on the unit being tested. This isolation helps identify bugs and regressions more effectively and simplifies the debugging process, as the source of errors can be localized to the specific unit.

Moreover, Test Doubles enable developers to write tests that are more deterministic and repeatable. Instead of relying on the availability and consistency of external services, we can define the exact behavior of the Test Doubles, making our tests more reliable and less prone to false positives or negatives. This predictability leads to faster feedback loops, allowing developers to catch and fix issues early in the development cycle.

In this article series, we will explore different types of Test Doubles in Go: Dummies, Stubs, Spies, Mocks, and Fakes. Each type has its unique characteristics and use cases, empowering us to address a wide range of testing scenarios effectively. By the end of this series, you will have a solid understanding of how to leverage Test Doubles in your Go codebase and take your testing efforts to the next level.

## Dummies

### What are Dummies?

Dummies are the most straightforward form of Test Doubles. They are essentially empty or minimal implementations of objects that are required as method arguments or collaborators but do not contribute to the behavior of the unit under test. Dummies are used solely to satisfy the compiler or fulfill parameter expectations, allowing the test code to execute successfully.

### When to use Dummies?

Dummies are typically employed when a unit under test requires certain objects or parameters but does not actually use them during its execution. Instead of creating complex or fully functional objects, we can use Dummies to fulfill these requirements and ensure the code compiles and runs without raising any errors or exceptions.

### Example usage of dummies

Imagine you have a **`Logger`** interface responsible for logging messages, and you want to test a **`Calculator`** struct that performs some calculations and logs the results. In this case, you can use a Dummy implementation of the **`Logger`** interface to satisfy the dependency without any actual logging:

```go
type Logger interface {
    Log(message string)
}

type Calculator struct {
    logger Logger
}

func (c *Calculator) Add(a, b int) int {
    sum := a + b
    c.logger.Log(fmt.Sprintf("Addition: %d + %d = %d", a, b, sum))
    return sum
}
```

In your test scenario, you can create a Dummy implementation of the **`Logger`** interface that doesn't perform any logging:

```go
type DummyLogger struct{}

func (d *DummyLogger) Log(message string) {
    // Do nothing
}
```

Now, when testing the **`Add`** method of the **`Calculator`**, you can use the **`DummyLogger`** as a substitute for the **`Logger`** dependency:

```go
import (
    "testing"
)

func TestCalculator_Add(t *testing.T) {
    dummyLogger := &DummyLogger{}
    calculator := &Calculator{logger: dummyLogger}

    result := calculator.Add(2, 3)
    expected := 5

    if result != expected {
        t.Errorf("Addition result incorrect. Got %d, expected %d", result, expected)
    }
}
```

In this example, the **`DummyLogger`** acts as a placeholder that satisfies the **`Logger`** dependency without performing any actual logging. It allows you to focus on testing the logic of the **`Calculator`** without worrying about the logging functionality.

Using a Dummy in this scenario helps to isolate the unit under test and simplifies the testing process by eliminating the need for a real **`Logger`** implementation.

## Stubs

### What are Stubs?

Stubs are Test Doubles that allow us to replace dependencies and control their behavior during testing. Unlike Dummies, which are empty or minimal implementations, Stubs provide predefined responses or behavior when specific methods are invoked. By using Stubs, we can simulate various conditions or scenarios, such as returning specific values, triggering exceptions, or even simulating delays.

### When to use Stubs?

Stubs are particularly useful in situations where our code under test relies on external services, databases, or APIs, which might not be available or desirable to use during testing. By replacing these dependencies with Stubs, we can simulate their behavior and responses, making our tests more isolated and predictable. Stubs also come in handy when we need to test error-handling or exceptional scenarios that are challenging to reproduce consistently in real-world conditions.

### Example usage of stubs

To illustrate the usage of Stubs, let's consider a simplified example where we have a **`WeatherService`** interface responsible for retrieving weather data, and a **`WeatherReporter`** struct that uses this service to report the current weather condition.

```go
type WeatherService interface {
    GetWeather(city string) (string, error)
}

type WeatherReporter struct {
    weatherService WeatherService
}

func (wr *WeatherReporter) ReportWeather(city string) string {
    weather, err := wr.weatherService.GetWeather(city)
    if err != nil {
        return "Failed to retrieve weather data."
    }
    return "Current weather: " + weather
}
```

In our test scenario, we want to ensure that the **`ReportWeather`** method correctly handles the case when the **`GetWeather`** method returns an error. We can use a Stub implementation of the **`WeatherService`** to simulate this scenario:

```go
import (
    "testing"
    "errors"
)

type StubWeatherService struct{}

func (sws *StubWeatherService) GetWeather(city string) (string, error) {
    return "", errors.New("API error: failed to retrieve weather data")
}

func TestWeatherReporter_ReportWeather_Error(t *testing.T) {
    stubService := &StubWeatherService{}
    weatherReporter := &WeatherReporter{weatherService: stubService}

    result := weatherReporter.ReportWeather("New York")

    expected := "Failed to retrieve weather data."
    if result != expected {
        t.Errorf("ReportWeather returned %q, expected %q", result, expected)
    }
}
```

In the above example, we create a Stub implementation of the **`WeatherService`** interface called **`StubWeatherService`**. The **`GetWeather`** method of the Stub implementation always returns an error. By using this Stub in our test, we simulate the scenario where the weather service fails to retrieve the weather data. We then verify that the **`ReportWeather`** method correctly handles this error condition.
Stubs are powerful Test Doubles that allow us to replace dependencies and control their behavior during testing. They provide predefined responses or behavior, enabling us to simulate specific scenarios and test various conditions more effectively. By utilizing Stubs, we can isolate our code under test and ensure that it behaves correctly in different scenarios, including error-handling and exceptional cases. In the next part of this series, we will explore another type of Test Double: Spies. Stay tuned to learn how Spies can enhance your Go testing experience.
