---
draft: false
title: "Test doubles in Go, part 2: spies, mocks, fakes and best practices"
description: "Spies, mocks and fakes in Go with code examples, plus best practices for choosing and using test doubles."
date: 2023-08-08
blog: "https://dwarvesf.hashnode.dev/understanding-test-doubles-an-in-depth-look"
github_id: datphamcode295
authors:
  - datphamcode295
slug: go-test-doubles-spies-mocks-fakes
announce: false
series: go-test-doubles
series_part: 2
series_total: 2
---

Part 1 defined test doubles and covered dummies and stubs. This part covers the other three kinds, spies, mocks and fakes, each with a definition, guidance on when to use it and a Go example. It ends with best practices for picking the right double.

> Part 2 of 2 in the Go test doubles series. Previous: [Test doubles in Go, part 1: dummies and stubs](test-doubles.md)

## Spies

### What are Spies?

Spies are Test Doubles that serve as proxies for dependencies, allowing us to observe and verify how they are used during testing. Unlike Dummies and Stubs, which focus on parameter requirements or predetermined responses, Spies provide a means to capture information about method invocations, such as the number of calls, arguments passed, or even the order in which methods are called. By using Spies, we gain insights into the interactions between our code under test and its collaborators.

### When to use Spies?

Spies are particularly useful when we want to verify that certain methods or dependencies are invoked correctly or a specific sequence of interactions occurs. They help us ensure that our code under test interacts with its dependencies as expected, leading to more reliable and accurate tests. Spies also allow us to capture and analyze relevant data about method calls, enabling us to perform assertions based on those observations.

### Example usage of spies

To illustrate the usage of Spies, let's consider a simplified example where we have a **`PaymentGateway`** interface responsible for processing payment transactions, and a **`PaymentProcessor`** struct that uses this gateway to initiate payments.

```go
type PaymentGateway interface {
    ProcessPayment(amount float64, currency string) error
}

type PaymentProcessor struct {
    paymentGateway PaymentGateway
}

func (pp *PaymentProcessor) MakePayment(amount float64, currency string) error {
    return pp.paymentGateway.ProcessPayment(amount, currency)
}
```

In our test scenario, we want to ensure that the **`MakePayment`** method correctly calls the **`ProcessPayment`** method on the **`PaymentGateway`**. We can use a Spy implementation of the **`PaymentGateway`** to capture and verify this interaction:

```go
import (
    "testing"
)

type SpyPaymentGateway struct {
    processPaymentCalled bool
    lastAmount           float64
    lastCurrency         string
}

func (spy *SpyPaymentGateway) ProcessPayment(amount float64, currency string) error {
    spy.processPaymentCalled = true
    spy.lastAmount = amount
    spy.lastCurrency = currency
    return nil
}

func TestPaymentProcessor_MakePayment(t *testing.T) {
    spyGateway := &SpyPaymentGateway{}
    paymentProcessor := &PaymentProcessor{paymentGateway: spyGateway}

    amount := 100.0
    currency := "USD"
    err := paymentProcessor.MakePayment(amount, currency)

    if !spyGateway.processPaymentCalled {
        t.Error("ProcessPayment not called")
    }

    if spyGateway.lastAmount != amount {
        t.Errorf("ProcessPayment called with amount %f, expected %f", spyGateway.lastAmount, amount)
    }

    if spyGateway.lastCurrency != currency {
        t.Errorf("ProcessPayment called with currency %s, expected %s", spyGateway.lastCurrency, currency)
    }

    if err != nil {
        t.Errorf("MakePayment returned error: %v", err)
    }
}
```

In the above example, we create a Spy implementation of the **`PaymentGateway`** interface called **`SpyPaymentGateway`**. The Spy records information about the method calls made to it, including the fact that **`ProcessPayment`** was called, as well as the amount and currency passed to it. In our test, we verify that the **`MakePayment`** method correctly interacts with the **`PaymentGateway`** by examining the captured information.

Spies are powerful Test Doubles that allow us to observe and verify interactions between the code under test and its dependencies. They provide insights into method calls, including the number of invocations, arguments passed, and the order in which methods are called. By using Spies, we can ensure that our code interacts correctly with its collaborators and perform assertions based on the captured information.

## Mocks

### What are Mocks?

Mocks are Test Doubles that simulate the behavior of real dependencies, providing us with the ability to define expectations and verify interactions. Unlike Stubs and Spies, which focus on predetermined responses or capturing method calls, Mocks allow us to specify the expected sequence of method calls, parameters, and return values. They enable us to create controlled test scenarios by defining how the dependencies should behave during the test.

### When to use Mocks?

Mocks are particularly useful when we want to thoroughly test the interactions between our code under test and its dependencies. By using Mocks, we can precisely define expectations about the method calls, their parameters, and return values. This level of control allows us to test complex logic, edge cases, and ensure that our code correctly handles various scenarios. Mocks also aid in isolating the unit under test, as we can replace its dependencies with Mocks, preventing unwanted side effects during testing.

### Example usage of mocks

To illustrate the usage of Mocks, let's consider a simplified example where we have a **`EmailSender`** interface responsible for sending email notifications, and a **`UserManager`** struct that uses this sender to notify users.

```go
type EmailSender interface {
    SendEmail(address, subject, body string) error
}

type UserManager struct {
    emailSender EmailSender
}

func (um *UserManager) SendWelcomeEmail(email string) error {
    subject := "Welcome to our platform!"
    body := "Thank you for joining. We're excited to have you on board."
    return um.emailSender.SendEmail(email, subject, body)
}
```

In our test scenario, we want to ensure that the **`SendWelcomeEmail`** method correctly calls the **`SendEmail`** method on the **`EmailSender`** interface. We can use a Mock implementation of the **`EmailSender`** to define expectations and verify the interactions:

```go
import (
    "testing"

    "github.com/stretchr/testify/mock"
)

type MockEmailSender struct {
    mock.Mock
}

func (mock *MockEmailSender) SendEmail(address, subject, body string) error {
    args := mock.Called(address, subject, body)
    return args.Error(0)
}

func TestUserManager_SendWelcomeEmail(t *testing.T) {
    mockSender := &MockEmailSender{}
    userManager := &UserManager{emailSender: mockSender}

    email := "test@example.com"
    expectedSubject := "Welcome to our platform!"
    expectedBody := "Thank you for joining. We're excited to have you on board."

    mockSender.On("SendEmail", email, expectedSubject, expectedBody).Return(nil)

    err := userManager.SendWelcomeEmail(email)

    if err != nil {
        t.Errorf("SendWelcomeEmail returned error: %v", err)
    }

    mockSender.AssertExpectations(t)
}
```

In the above example, we create a Mock implementation of the **`EmailSender`** interface called **`MockEmailSender`**. Using the **`github.com/stretchr/testify/mock`** package, we define expectations on the **`SendEmail`** method with specific parameters. We then use the **`AssertExpectations`** method to ensure that all the expectations were met during the test.

## Fakes

### What are Fakes?

Fakes are Test Doubles that provide simplified, alternative implementations of dependencies. They are often used when the real implementation of a dependency is complex, resource-intensive, or not suitable for testing purposes. Fakes aim to simplify the behavior of the dependency, providing a lightweight and controllable substitute. Unlike Stubs and Mocks, which focus on specific method calls and interactions, Fakes provide a full implementation of the dependency, albeit with simpler functionality.

### When to use Fakes?

Fakes are particularly useful when the real implementation of a dependency is impractical or undesirable to use during testing. This can be due to reasons such as network dependencies, external services, or complex business logic. By using Fakes, we can simulate the behavior of the dependency in a controlled manner, making our tests more predictable, isolated, and efficient. Fakes are also helpful when we need to test scenarios that are challenging to reproduce consistently with the real implementation.

### Example usage of fakes

To illustrate the usage of Fakes, let's consider a simplified example where we have a **`FileStore`** interface responsible for storing and retrieving files, and a **`FileManager`** struct that uses this store to perform file-related operations.

```go
type FileStore interface {
    StoreFile(filename string, data []byte) error
    RetrieveFile(filename string) ([]byte, error)
}

type FileManager struct {
    fileStore FileStore
}

func (fm *FileManager) SaveFile(filename string, data []byte) error {
    return fm.fileStore.StoreFile(filename, data)
}

func (fm *FileManager) ReadFile(filename string) ([]byte, error) {
    return fm.fileStore.RetrieveFile(filename)
}
```

In our test scenario, we want to ensure that the **`FileManager`** correctly interacts with the **`FileStore`** when saving and reading files. We can use a Fake implementation of the **`FileStore`** to provide simplified behavior for testing:

```go
import (
    "testing"
)

type FakeFileStore struct {
    storedFiles map[string][]byte
}

func (fake *FakeFileStore) StoreFile(filename string, data []byte) error {
    fake.storedFiles[filename] = data
    return nil
}

func (fake *FakeFileStore) RetrieveFile(filename string) ([]byte, error) {
    data, exists := fake.storedFiles[filename]
    if !exists {
        return nil, fmt.Errorf("File not found: %s", filename)
    }
    return data, nil
}

func TestFileManager_SaveFile_ReadFile(t *testing.T) {
    fakeStore := &FakeFileStore{storedFiles: make(map[string][]byte)}
    fileManager := &FileManager{fileStore: fakeStore}

    // Save file
    filename := "test.txt"
    data := []byte("Hello, World!")
    err := fileManager.SaveFile(filename, data)
    if err != nil {
        t.Errorf("SaveFile returned error: %v", err)
    }

    // Read file
    retrievedData, err := fileManager.ReadFile(filename)
    if err != nil {
        t.Errorf("ReadFile returned error: %v", err)
    }
    if !bytes.Equal(retrievedData, data) {
        t.Errorf("Retrieved data does not match expected data")
    }
}
```

In the above example, we create a Fake implementation of the **`FileStore`** interface called **`FakeFileStore`**. The Fake implementation simplifies the behavior by storing files in memory using a map. During the test, we can save a file using the **`SaveFile`** method and retrieve it using the **`ReadFile`** method. We can then assert that the retrieved data matches the expected data.

## Best practices

| Test Double | Purpose                               | Behavior                               | Interaction Verification               | Internal Behavior Recording            | Use Case in Real Projects                                | Verification                                          |
| ----------- | ------------------------------------- | -------------------------------------- | -------------------------------------- | -------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Dummy       | Placeholder object                    | Does nothing                           | No                                     | No                                     | When a parameter is required but not used in the test    | Not applicable                                        |
| Stub        | Provide predetermined responses       | Returns fixed values                   | No                                     | No                                     | Simulating simple behaviors or reducing dependencies     | Not applicable                                        |
| Mock        | Set expectations on interactions      | Returns predetermined values           | Yes                                    | No                                     | Testing how an object interacts with its dependencies    | Checks if expected interactions occurred              |
| Fake        | Alternative simplified implementation | Replicates some real behavior          | No                                     | No                                     | Replacing resource-heavy dependencies for faster testing | May not require explicit verification                 |
| Spy         | Record interactions and parameters    | Returns actual data but records calls  | Yes                                    | No                                     | Observing and recording internal interactions            | May be used to assert expected behavior               |
| Double      | General term for any test substitute  | Varies depending on the type of double | Varies depending on the type of double | Varies depending on the type of double | Varied based on the specific type of double used         | Verification depends on the specific test double used |

### Key characteristics

#### Dummy

- Provides a valid object to fulfill method signature requirements
- Does not affect the test outcome as it's not involved in the test logic
- Often used in situations where an argument is necessary but has no impact on the test behavior

#### Stub

- Returns fixed values or exceptions for method calls
- Used when you want to isolate the code from complex external dependencies
- Suitable for emulating read-only operations or methods with predictable behaviors

#### Mock

- Sets expectations on method calls and parameters
- Verifies whether specific methods were invoked and how many times
- Can throw exceptions based on predefined conditions
- Helps in testing interaction patterns and ensuring proper collaboration between objects

#### Fake

- Provides an alternative implementation of a dependency with simplified functionality
- Can be used to replace a slow or resource-intensive component with a lighter, faster version
- Often used for databases, file systems, or external services where setting up the real component is impractical or time-consuming

#### Spy

- Acts as a wrapper around the real object to monitor method calls and their parameters - Records the interactions and usage patterns during the test
- Useful when you want to test both the result and how the result was achieved
- Provides insights into how the object under test is used in the application

#### Double

- A general term for any object that substitutes a real dependency in testing
- Can refer to dummy, stub, mock, fake, or spy
- Enables test isolation and focuses on specific components or behaviors

## Conclusion

In conclusion, the article delves into the concept of Test Doubles and their significance in separating code from dependencies and enabling precise control over behavior during testing. The five types of Test Doubles - Dummies, Stubs, Spies, Mocks, and Fakes - each serve distinct purposes and cater to specific use cases. For instance, Dummies fulfill parameter requirements, Stubs provide predetermined responses, Spies capture method call information, Mocks imitate real dependencies, and Fakes offer simplified alternative implementations. Employing Test Doubles empowers developers to craft more dependable and accurate tests, resulting in faster feedback loops and heightened code quality.

## References

- [https://jesusvalerareales.com/testing-with-test-doubles/](https://jesusvalerareales.com/testing-with-test-doubles/)
- [https://ieftimov.com/posts/testing-in-go-test-doubles-by-example/](https://ieftimov.com/posts/testing-in-go-test-doubles-by-example/)
- [https://abseil.io/resources/swe-book/html/ch13.html#basic_concepts](https://abseil.io/resources/swe-book/html/ch13.html#basic_concepts)
