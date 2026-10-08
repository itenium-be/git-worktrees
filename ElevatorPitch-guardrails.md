Guardrails & Backpressure: Before You Let Go of the Wheel
=========================================================

## Abstract

Part 1 of the Dark Factory series, and the boring part: probably where you'll spend more time
than on the factory itself. Add every deterministic guardrail in existence — formatters, linters,
type checks, automated tests — and turn the knobs to 11. Then the actually tricky part:
backpressure that keeps the agent getting work done without going off the rails, and hardening
the guardrails themselves, because the agent will try to get around them.

## Target Audience

Developers handing more and more of their code to a coding agent who want to stop reviewing every
line. This is the first stage: what you must already
have in place before a dark factory is feasible.

## Key Takeaways

- A prompt, a `CLAUDE.md` rule or a styleguide is a suggestion. Backpressure means the agent cannot proceed
- LSP diagnostics put lint errors in context only when broken
- Decide where you run what: Claude hook, `git commit`, `git push`, CI
- Everything is an error: strict `tsc`, banned APIs, architecture tests, coverage, mutation testing
- Compounding engineering: every correction becomes a check, so you stop repeating it in prompts

## Session Format

15 minutes
