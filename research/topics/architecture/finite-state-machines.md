---
title: "Finite state machines: automata, transducers, Mealy and Moore machines"
description: How finite-state automata, finite-state transducers, Mealy machines and Moore machines relate, with the formal definitions, the differences between them and TypeScript and ReScript examples.
slug: finite-state-machines-automata-transducers
kind: essay
date: 2022-06-28
authors:
  - monotykamary
tags:
  - architecture
  - state-machine
  - automata
redirect:
  - /research/topics/architecture/finite-state-automata
  - /i0OgDQ
  - /research/topics/architecture/finite-state-transducer
  - /mKfGnw
  - /research/topics/architecture/mealy-machine
  - /iyzVHA
  - /research/topics/architecture/moore-machine
  - /TNr8jCE
type: research
topic: architecture
---

A state machine is a model with a fixed set of states and rules for moving between them. Four related models cover most of what a programmer meets: the finite-state automaton, the finite-state transducer, the Mealy machine and the Moore machine. The last three extend the first. This note walks them in that order, with the formal definition and a code example for each, then compares them.

## Finite-state automata

A finite-state automaton (FSM, FSA, plural automata) is better known as a state machine. It is a mathematical model with one constraint: the abstract machine can be in exactly one of a finite number of states at any point in time. A state is typically a string or an equivalent enumeration.

### Mathematical model

The [Wikipedia page on finite-state machines](https://en.wikipedia.org/wiki/Finite-state_machine) defines a deterministic finite-state machine by five variables, a quintuple: $(\Sigma, S, s_0, \delta, F)$.

- $\Sigma$ is the _input alphabet_ (a finite non-empty set of symbols). In our terms, these are the events.
- $S$ is a finite non-empty set of states.
- $s_0$ is the _initial state_, an element of $S$.
- $\delta$ is the state-transition function: $\delta: S \times \Sigma \rightarrow S$.
- $F$ is the set of _final states_, a (possibly empty) subset of $S$.

Given an initial state $s_0$, the transition to the next state is:

$$
\delta: s_0 \times \Sigma \rightarrow S
$$

To reach a final state from a known set of states, the transition looks like this:

$$
\delta: S \times \Sigma \rightarrow F
$$

### Simplified meaning

For practical work, one idea is enough. A `transition` function takes a `state` and an `event` and returns a **new** `state`. The type of the state and the subset it belongs to is up to the developer.

```typescript
type State = string
type Event = string

const transition = (state: State, event: Event): State => ...
```

### Coming from algebraic data types

If you know algebraic data types (ADTs), a state machine is a set of nested ADTs that encode states and events as data types. The example below nests pairs of sum (union) types, in ReScript:

```typescript
type elapsed = float;

type taskStatus =
  | NotStarted
  | Running
  | Paused
  | Done;

type input =
  | Start
  | Pause
  | Resume
  | Finish;

let transition = (state, input) =>
  switch (state, input) {
  | (NotStarted, Start) => Running
  | (Running, Pause) => Paused
  | (Running, Finish) => Done
  | (Paused, Resume) => Running
  | (Paused, Finish) => Done
  | (Running, Tick) => Running
  | _ => state
  };
```

### States in the domain

In Domain Driven Design (DDD) and in Event Storming, states do not seem to have a place in the domain. The likely reason is the separation of concerns between the behavior of commands and what gets updated in the aggregate. DDD does classify entities, such as customer statuses, and those classes carry business meaning. DDD says nothing about technical concerns: where state persists, where a transition should happen, or which effects should follow. For background, see [the overview of domain driven design](overview-of-domain-driven-design.md).

## Finite-state transducers

A finite-state transducer is a finite-state automaton that has both inputs and outputs. In [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) terms, these are two separate tapes:

- **input tape**: a set of strings or related data.
- **output tape**: a set of relations generated from the input tape.

A plain automaton has only the input tape.

### Mathematical model

The [UC Davis outline on transducers](https://www.cs.ucdavis.edu/~rogaway/classes/120/spring13/eric-transducers) uses variables that match the automaton above. By that classification, a deterministic finite-state transducer has seven main variables, a septuple: ($\Sigma$, $S$, $\Gamma$, $\delta$, $\omega$, $s_0$, $F$).

- $\Sigma$ is the _input alphabet_ (a finite non-empty set of symbols), our events.
- $S$ is a finite non-empty set of states.
- $\Gamma$ is the _output alphabet_.
- $\delta$ is the state-transition function: $\delta: S \times \Sigma \rightarrow S$.
- $\omega$ is the output-transition function: $\omega: S \times \Sigma \rightarrow \Gamma$.
- $s_0$ is the _initial state_, an element of $S$.
- $F$ is the set of _final states_, a subset of $S$.
- $\delta \subseteq S \times (\Sigma \cup \{\epsilon\}) \times (\Gamma \cup \{\epsilon\}) \times S$ (where $\epsilon$ is the [empty string](https://en.wikipedia.org/wiki/Empty_string)) is the _transition relation_.

From an initial state $s_0$, a transition to the next state with an output symbol is:

$$
\delta: s_0 \times \Sigma \rightarrow S
$$

$$
\omega: s_0 \times \Sigma \rightarrow \Gamma
$$

$$
\delta \subseteq s_0 \times (\Sigma \cup \{\epsilon\}) \times (\Gamma \cup \{\epsilon\}) \times S
$$

Reaching a final state from a known set of states looks almost the same:

$$
\delta: S \times \Sigma \rightarrow F
$$

$$
\omega: S \times \Sigma \rightarrow \Gamma
$$

$$
\delta \subseteq S \times (\Sigma \cup \{\epsilon\}) \times (\Gamma \cup \{\epsilon\}) \times F
$$

Transducers that have a final state recognize languages. That is why they are used in natural language processing.

### Simplified meaning

There are several ways to write a transducer, and it is not always a beefed-up state machine. To oversimplify, model it close to a regular state machine:

```typescript
type State = string
type Input = string
type Output = {...} //

const transition = (state: State, input: Input): Output => ...
```

When the output is a product type of the output itself and the next state of the transition, the machine is a Mealy machine (next section).

### Examples

Reducers are single state machines, but the canonical reducers in [Redux](https://redux.js.org/) and [React](https://reactjs.org/docs/hooks-reference.html#usereducer) are close to transducers, because they return state or objects as the notion of an output. See [reducers](reducers.md) for the single-state-machine view.

```typescript
// https://reactjs.org/docs/hooks-reference.html#usereducer
// our outputs here is the { count: number } object
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  )
}
```

Take the task example from the automaton section and wrap state, inputs and outputs together (ReScript):

```typescript
// elapsed represents our arbitrary output
type elapsed = float;

// elapsed here is used in a constructor as an arbitrary output
type taskStatus =
  | NotStarted
  | Running(elapsed)
  | Paused(elapsed)
  | Done(elapsed);

// elapsed here is used in a constructor as an arbitrary input
type input =
  | Start
  | Pause
  | Resume
  | Finish
  | Tick(elapsed);

let transition = (state, input) =>
  switch (state, input) {
  | (NotStarted, Start) => Running(0.0)
  | (Running(elapsed), Pause) => Paused(elapsed)
  | (Running(elapsed), Finish) => Done(elapsed)
  | (Paused(elapsed), Resume) => Running(elapsed)
  | (Paused(elapsed), Finish) => Done(elapsed)
  | (Running(elapsed), Tick(tick)) => Running(elapsed +. tick)
  | _ => state
  };
```

## Mealy machines

A Mealy machine is a finite-state automaton whose output depends on the current state and the current input. It is the closest definition to a deterministic finite-state transducer.

![](assets/mealy-machine_mealy_machine.webp)

### Mathematical model

A deterministic Mealy machine has six main variables, a sextuple: ($\Sigma$, $S$, $\Gamma$, $\delta$, $\omega$, $s_0$). They are the same as the transducer's variables without the final states $F$. $\omega$ is $S \times \Sigma \rightarrow \Gamma$, and the transition relation $\delta \subseteq S \times (\Sigma \cup \{\epsilon\}) \times (\Gamma \cup \{\epsilon\}) \times S$ applies as before.

Some formulations combine the transition and output functions into one:

$$
\delta: S \times \Sigma \rightarrow S \times \Gamma
$$

From an initial state $s_0$:

$$
\delta: s_0 \times \Sigma \rightarrow S
$$

$$
\omega: s_0 \times \Sigma \rightarrow \Gamma
$$

### Example

The transducer example fits here, because the transition and the output coalesce into one function. This traffic light carries its expiry time (in seconds) as the output:

```typescript
// expiry represents our arbitrary output (in seconds)
type expiry = float;

// expiry here is used in a constructor as an arbitrary output
type trafficLightStatus =
  | Red(expiry)
  | Amber(expiry)
  | Green(expiry)
  | FlashingRed(expiry)

// elapsed here is used in a constructor as an arbitrary input
type input =
  | ExpireTime
  | Error
  | Restart

let transition = (state, input) =>
  switch (state, input) {
  | (Red(expiry), ExpireTime) => Green(60.0)
  | (Red(expiry), Error) => FlashingRed(30.0)
  | (Green(expiry), ExpireTime) => Amber(60.0)
  | (Green(expiry), Error) => FlashingRed(30.0)
  | (Amber(expiry), ExpireTime) => Red(60.0)
  | (Amber(expiry), Error) => FlashingRed(30.0)
  | (FlashingRed(expiry), Restart) => Red(60.0)
  | _ => state
  };
```

## Moore machines

A Moore machine is a finite-state automaton whose output depends only on its current state. It is a restricted type of finite-state transducer.

![](assets/moore-machine_moore_machine.webp)

### Mathematical model

A deterministic Moore machine has the same six variables as a Mealy machine, with one change: the output function takes only the state, $\omega: S \rightarrow \Gamma$.

- $\Sigma$ is the _input alphabet_, our events.
- $S$ is a finite non-empty set of states.
- $\Gamma$ is the _output alphabet_.
- $\delta$ is the state-transition function: $\delta: S \times \Sigma \rightarrow S$.
- $\omega$ is the output-transition function: $\omega: S \rightarrow \Gamma$.
- $s_0$ is the _initial state_, an element of $S$.
- $\delta \subseteq S \times (\Sigma \cup \{\epsilon\}) \times (\Gamma \cup \{\epsilon\}) \times S$ is the _transition relation_.

From an initial state $s_0$:

$$
\delta: s_0 \times \Sigma \rightarrow S
$$

$$
\omega: s_0 \rightarrow \Gamma
$$

### Example

Unlike a Mealy machine, a Moore machine cannot merge the transition and output functions into one. The output function is **synchronous** to the state change. The same traffic light looks like this (ReScript):

```typescript
type trafficLightStatus =
  | Red
  | Amber
  | Green
  | FlashingRed

type input =
  | ExpireTime
  | Error
  | Restart

type outputFn = (state) =>
  switch (state) {
  |  Red => (Red, 60.0)
  |  Green => (Green, 60.0)
  |  Amber => (Amber, 60.0)
  |  FlashingRed => (FlashingRed, 30.0)
  }

let transitionFn = (state, input) =>
  switch (state, input) {
  | (Red, ExpireTime) => Green(60.0)
  | (Red, Error) => FlashingRed(30.0)
  | (Green, ExpireTime) => Amber(60.0)
  | (Green, Error) => FlashingRed(30.0)
  | (Amber, ExpireTime) => Red(60.0)
  | (Amber, Error) => FlashingRed(30.0)
  | (FlashingRed, Restart) => Red(60.0)
  | _ => state
  };

let output = outputFn(transitionFn(Red, ExpireTime)) // (Green, 60.0)
```

## How they differ

| Model                   | Output                                          | Final states                      |
| ----------------------- | ----------------------------------------------- | --------------------------------- |
| Finite-state automaton  | None                                            | Yes                               |
| Finite-state transducer | Depends on state and input                      | Yes, when it recognizes languages |
| Mealy machine           | Depends on state and input                      | No                                |
| Moore machine           | Depends on state only, changing in step with it | No                                |

**Against formal transducers.** Mealy and Moore machines are generators and do not recognize languages. For that reason they have no concept of a final state. The transducers that do have final states recognize languages, which is what natural language processing needs.

**Between Mealy and Moore.** Both are generator-type state machines and both can parse a [regular language](https://en.wikipedia.org/wiki/Regular_language). A Mealy output depends on **both the state and the input**. A Moore output changes **synchronously with the state**. The two are equivalent:

> Every Moore machine can be converted to a Mealy machine and every Mealy machine can be converted to a Moore machine.

## Where it breaks down

Beyond very simple examples, state machines grow numerous states, many with identical transitions. That growth is the state explosion problem, and statecharts address it with parallel states, hierarchical states and guards. The note [State explosion](state-explosion.md) covers it.

## References

- [Turing machine](https://en.wikipedia.org/wiki/Turing_machine)
- [Finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine)
- [Finite-state transducer](https://en.wikipedia.org/wiki/Finite-state_transducer)
- [Mealy machine](https://en.wikipedia.org/wiki/Mealy_machine)
- [UC Davis outline on transducers](https://www.cs.ucdavis.edu/~rogaway/classes/120/spring13/eric-transducers)
- [t-pl.io: DDD, aggregates, processes, state machines and transducers](https://t-pl.io/ddd-aggregates-processes-state-machines-and-transducers)
- [React useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [dl.acm.org/doi/10.5555/972695.972698](https://dl.acm.org/doi/10.5555/972695.972698)
- [web.stanford.edu: fst-in-nlp](https://web.stanford.edu/~laurik/publications/ciaa-2000/fst-in-nlp/fst-in-nlp.html)
- [wickstrom.tech: finite-state machines, part 1](https://wickstrom.tech/finite-state-machines/2017/11/10/finite-state-machines-part-1-modeling-with-haskell.html)
- [dev.to: modelling domain with state machines in ReasonML](https://dev.to/margaretkrutikova/modelling-domain-with-state-machines-in-reasonml-n29)
- [blog.honosoft.com: partial state machine](https://blog.honosoft.com/2019/10/31/partial-state-machine/)
- [Unstop.com: difference between Mealy and Moore machine](https://unstop.com/blog/difference-between-mealy-and-moore-machine)
