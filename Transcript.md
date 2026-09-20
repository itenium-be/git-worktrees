Transcript
==========

Git worktrees -- One Repo, N Coding Agents
------------------------------------------

Slide 2:
- I'm Wouter: developer, architect, coach
- Here today to talk about git worktrees
- Or that was the initial intention because I was under the impression a lightning talk is 10 minutes
- Turns out here at FrontMania, it's 20 minutes
- So I could have used that to do a deep-dive on worktrees
- But I thought, anyone can look up syntax
- So I decided to additionally cover merge queues instead
-
- (click) And yes, this is indeed yet another AI talk


Slide 3:
- This talk is part of my Claude transformation series
- More specifically, this is a part of the "Dark Factory" session
- If some of this stuff seems a bit out there, there are some hefty prerequisites
- (click) Namely the second part assumes you have all the guardrails and backpressure in place
- (read & explain box)
- But not to fret, worktrees are super handy even without all that
- (click) So we're going to talk about the middle part
- (click) and not really about the dark factory itself


Slide 4:
- So before all this AI craze, I was living, happily, in my terminal
- (click) back when create-react-app was the rage
- (click) and I have a nodemon running for my backend
- (click) and then a terminal for running git commands and all


Slide 5:
- And life was, you know, life was good


Slide 6:
- And then Claude entered the scene, and the workflow started changing
- (click) create-react-app went out of the window and was replace with bun and vite
- (click) I was still running commands in the terminal
- (click) But basically I was mostly talking to Claude


Slide 7:
- And life was still good


Slide 8:
- And then as time moved on, Claude took center stage
- We still had bun, nodemon, etc
- (click) But these terminals had been relegated to a background tab
- (click) Because now I was just talking to multiple Claudes


Slide 9:
- And it was at this point that I ran against some problems
- (click) Multiple Claudes were writing to the same files, sometimes overwriting eachother
- (click) Claude started doing all the git commands as well and sometimes it was doing
- a checkout or a stash and killing the work of another Claude
- Or doing a commit, taking unrelated work with it
- Typically they noticed this and then offered to fix it but typically I just ended up
- with a git history that was not as clean as it used to be.
- Or I was just spending more tokens as Claude did the same changes again
- (click) Another issue that crept up was that I wanted to verify one Claudes work
- but ran against compilation errors and hot reloads as other Claudes were still working
- (click) And finally when a Claude was done with its work and was running the test suite
- it turned up red for tests and files it didn't even touch...


Slide 10:
- (click) So what was the solution, you guessed it... git worktrees
- Which is basically just a branch that is checked out in a separate directory
- It does come with challenges of its own... because isn't that always the case
- It doesn't include gitignored files, so if you need an .env file, you can use .worktreeinclude for that
- (click) Worktrees share the same .git folder, making it vastly superior over separate git clones
- And you already have it, this feature was introduced 11 years ago
- (click) Different folders so you run multiple stable dev servers with just the expected changes
- (click) And this also solves the red tests from other Claudes, but just like you have multiple
- dev servers, you also want multiple databases with test containers so you don't have Claudes
- clobbering up eachothers test data.


Slide 11:
- And life was good again!


Slide 12:
- And then things started to get out of hand
- (click) with ever more Claudes
- (click) turns out you can hook up multiple monitors to a computer
- (click) and so I bought new screens for ever more Claudes
- Because you know, these tokens aren't gonna burn themselves!


Slide 13:
- And while this was going great, I noticed that a new bottleneck had surfaced
- So a feature was ready on a worktree and the agent wants to merge it to main
- (click) But main had moved beneath it, so it had to rebase, run the build and the tests again
- (click) to just find out that main had merged beneath it again
- (click) ... and again
- (click))Until it just gave up
- (click) And I ended up playing arbitrator telling sessions when they could finally merge their work
-
- That was obviously unacceptable. What I needed was a merge queue.
- Once an agent was ready, it added its work to the merge queue so it could move on to do something else
- This is not a new concept, as you can imagine, even before AI this was already an issue for huge teams
- working on monorepos. Bors already solved this problem in 2013.
- If you have a paying Github subscription you get that out of the box.
- So what does this look like...?


Slide 14:
- So on the left we have a bunch of work that agents finished on git worktrees
- I decided to go for a dedicated lander agent so that even if there are non-trivial merge conflicts, the lander
- will figure it out and continue merging.
- The lander agent takes the oldest branch off the merge queue, and does the building and testing and
- then merges it on the main branch.
- And then it keeps doing that until there is nothing left to merge.


Slide 15:
- So I'm not there yet but the next step is potentially that the merge queue itself becomes the bottleneck
- We can use a fix-forward approach that is used in triple-A game studios:
- Because running the build takes so long, we just merge everything that builds
- And then stabilize the main branch later.
-
- (click) And what about code reviews...
- Well, do you honestly care how CSS looks like? Or how a specific function, component or class is implemented?
- I know I don't.
- I think that at this point it does remain important to look at security & architecture because if mistakes are
- made there, that could become pretty expensive or embarrassing.


Slide 16:
- And, that was it!
