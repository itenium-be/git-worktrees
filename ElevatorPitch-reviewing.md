# I've Stopped Reviewing the Code

## Abstract

Code review assumes a human can read the output faster than it is produced. That assumption is gone, and rubber-stamped diffs carry the authority of a review without the substance. So I stopped reading generated code. I review three things that are expensive to reverse, security, API surface and architecture, and let everything else be caught mechanically or not at all. This talk shows what has to be true for that to be defensible: failing-test gates, type checks and linters wired as hooks, an adversarial reviewer agent on every diff, a single process allowed to merge, and guardrails with unit tests of their own. Plus the defects that escaped anyway, and where the line sits today.

## Elevator pitch

I don't read the code my agents write. I review security, API surface and architecture; everything else is caught by gates or not at all. What makes that defensible, and what still got through.

## Outline

- Rubber-stamped review is worse than no review
- What I still review: security, API surface, architecture
- Backpressure the model cannot talk past: tests that must fail first, types and lint as hooks
- Adversarial reviewer agent; exactly one process may merge; pre-push guard
- A guardrail that only warns is documentation; guardrails need their own tests
- The escapes: defects that got through
- Fix-forward as a test strategy and its precondition: blast radius
