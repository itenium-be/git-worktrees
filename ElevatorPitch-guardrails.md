Guardrails & Backpressure: Before You Let Go of the Wheel
=========================================================

## Abstract

You want to let the AI slop machine write code. And it's going to write code, lots of it. And you don't really want to review all of that.

Setting up the guardrails and backpressure is the time-consuming, boring part and it's ongoing: you have to guard the
guardrails, because the LLM will happily route around them. Handing that job to the LLM itself is not the way. You want
something deterministic; a "skill" won't cut it.

Is it safe though? Who knows! With the proper guardrails at least we'll feel better about it. And let's be honest: any project with over 12 months of development has always turned into a big ball of mud anyways. Now, maybe, just maybe, we might turn out to be in a better position than we were before. Or it might just all come crumbling down under its own weight. As I said, who knows!

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
