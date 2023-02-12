---
layout: post
title: Using Go To Communicate More Effectively
date: 2017-02-24 12:32:18
categories: Go
---

*Note: I gave a talk about this topic in the [Go 1.8 Release Party in Amsterdam][]. You can [listen][] to the recording of the presentation (courtesy of my wife), [get][] the slides, or just keep reading this article.*

As you might already know, I'm completely blind, and I do back-end programming for a living.

And, I've seen some pretty bad code in my life.

Probably, so have you.

We all know that the majority of our time is spent reading other people's code. As much as we like to churn out our own code, most of us have learned that reality is not as forgiving as our dreams.

But without us pushing to read other people's code, open-source would not be so successful. Everyone would still be sitting alone in their own little corner, churning out their own copy of a library that ten thousand other people would have already done. Granted, stuff like that still happens, but it's not as bad as it could be.

But why is it? Why do we hate reading other people's code?

It can't be the act of reading itself; lots of us read a lot of books. We also subscribe to a lot of courses and a lot of conferences. Just looking within yourself or search the Internet; you'll realize most developers love to learn.

So, if you hate "reading code", and you really like "reading", what do you hate?

That's true. Code. More specifically, other people's code.

Here is the game I did with the audience. I recommend you [listen][] to it -- their reaction is interesting. However, I will include it here if you don't feel like listening to a long MP3 file.

> Technically, I could ask a friend to search for a generic image on Google and put it here [on the slide] for me, but I wanna do is to bring you into my world [in which you cannot see anything]

> What I want you to do is to close your eyes. i can't test to see if everyone has closed their eyes, so please do so.

> So, close your eyes, and look back in the past, to that moment where your CPO, CTO, CEO, PO, PM--whatever these guys are called--asked you to maintain this horrible, horrible code.

> Did you remember it? That moment where you were staring at your screen and thinking, "what the hell is this code doing?"

> And then, imagine if I could tell you: "hey, this person who wrote this code? I know where he lives."

> And then, since I'm an Iranian and the whole world thinks we're terrorists, I have access to all these weapons. i can give you knives, grenade launchers, flame throwers and all that stuff, so you can do whatever you want to this guy.

> So, imagine what you'd do to this guy.

> Turn that into an image.

> Insert that in this slide.

## Whose fault is it, really?

It's very easy to do a `git blame`, hunt down someone, point to them and say, "you are responsible for my misery!" But in reality, it doesn't work like that most of the time.

When choosing our tools, when hiring people, and when writing code every day, we don't care about code readability and maintainability.

When did you start learning a new programming language just because it helps you write more readable code?

When did you, or your company, hire someone because of their ability to write readable code?

When did you start focusing on making every single line you write be as readable as you possibly can?

Just like the countless number of people who want to go to the gym, have a healthier diet, or improve their relationship, writing more readable code is something we've always wanted to do, but we've never gotten around to it.

And, of course, there are always valid reasons, just as there are valid reasons for not exercising, meditating, eating healthier, and pretty much everything else.

What are those reasons? Usually, as with everything else, time ranks first, followed by the indifference of management, followed by the fact that the code is already too ugly to clean up.

In other words, the circumstances are not perfect.

This leads us to procrastination through perfectionism. Tell me if any of these dialogs are familiar to you:

* I'll leave this function with fifty lines in here, and I know this function is not doing onlny one thing -- it's doing three. But it's okay -- i don't have time to fix it now. maybe later.
* When I re-read this code that I wrote myself, it doesn't make sense to me. Well, maybe I'll come back and clean it up one day. I'll even leave a comment here saying `TODO: clean this up!`
* Oh, this is the old way of doing things. We're not doing it this way anymore. But when I run it, it still works. Meh. I'll just leave it here.
* I really need to get own to fixing this horrible code right now! I'm sick and tired of this mess! So I'll copy this here, and move that there... wait, these pieces of code are so mixed up together i can't refactor it anymore!

The scariest one, and the one that I hear too many times for comfort, is the last item, and it's scary because we all know it: once you say that, you are doomed. It's all downhill from here.

So, who is responsible?

Us. All of us. Every single one of us.

## Where should we get to?

I believe that the time has come for us programmers to evolve into the next stage of programming.

Imagine if programming languages would not be just for communicating with computers.

Imagine if we could use programming languages to also communicate with other programmers.

Imagine a world in which reading someone else's code doesn't feel like a chore.

The style is the same, as if you've done it. If you are looking for something, it's easy for you to find where it is. The blocks of code are small enough to easily understand without pushing your brain into overdrive.

Of course, the original author of this code doesn't think exactly the same way you do, but the language and the tools you have would still help you figure out what's happening in a fraction of the time it would take now.

Wouldn't it be a perfect world?

## How can we get there?

First of all, awareness. We need to be aware of readability. While writing every single line of code, we should think about this question: is it readable? Can it be easily understood?

If we are aware of each line as we type it out, technical debt won't pile up, and hence, it won't take much time to fix it.

The second thing is to use tools that help us communicate more effectively, and that is where I think Go could help.

## What does Go have to do with communication?

Go has some interesting properties that I think make it very appealing for this stage of programmer evolution. I think it's a tool that not only makes it easy to talk to computers, but also to talk to other humans. Why?

- Go discourages one-liners. That means less stuff to process per line, which means more granularity, which means it takes less time to understand.
- Go encourages explicit error handling. That means you don't have to guess about what will happen if an error occurs in a legacy codebase.
- Go provides information that you can use to create tools that monitor your codebase. That means you can write your own tools to keep the code quality at an acceptable level.

All of these serve to make the code more readable. Of course, it's not perfect, but it's a good first step.

## What other tools can we use?

Go has some really neat tools that can help with maintainability and keeping the code readable:

- [Go doc][] provides an easy way to document your code. This means other programmers don't need to get into the guts of your code and understand every single detail before they can use it.
- [Gometalinter][] helps you watch the code quality. This means you don't always have to write your own tools. In most cases, you can just configure this tool and let it do its thing. Consider it a CMS of linters.
- [Gorename][] and [eg][] allow you to improve code readability by making it easier to swap out old, smelly code. Hopefully, using these two tools will help you have less of those "we don't do things this way any more." moments.

## Conclusion

It is awesome to use the latest and greatest tools. It is wonderful to build the world's next biggest thing. It's fulfilling to solve new challenges every day.

But no words will describe the feeling of connection with another human. No challenge, product or technology can bring us the same feeling.

It's pure. It's euphoric. And for some of us, it's new and unexplored.

Remember that guy we found together in the beginning of this article, and killed over and over in all sorts of painful ways?

What if you could go to that guy and instead say, "Dude, you write the best code ever."

It would certainly lower murder rates, right?

So I ask you today: tomorrow, when you place your fingertips on your keyboard, do your best to reach out to your fellow humans through the code you write.

----------

As I mentioned in the beginning of this article, you can [listen][] to the audio recording of the presentation, or [get][] the PDF version.

[Go 1.8 Release Party in Amsterdam]: https://www.meetup.com/golang-amsterdam/events/236723017/
[listen]: https://www.dropbox.com/s/mwef84msz9iclza/Communicating%20with%20Golang.MP3?dl=1
[get]: https://www.dropbox.com/s/tj5v1qymkhcp068/Communicating%20with%20Golang.pdf?dl=1
[Go doc]: https://godoc.org/golang.org/x/tools/cmd/godoc
[Gometalinter]: https://github.com/alecthomas/gometalinter
[Gorename]: https://godoc.org/golang.org/x/tools/cmd/gorename
[eg]: https://godoc.org/golang.org/x/tools/cmd/eg
