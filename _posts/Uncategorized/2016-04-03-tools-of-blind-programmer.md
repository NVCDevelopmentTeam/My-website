---
layout: post
title: The Tools of a Blind Programmer
---

When I posted the [Autobiography of a Blind Programmer]({% post_url /Uncategorized/2016-03-27-autobiography-blind-programmer %}), I received a lot of requests asking about the way I use the computer, how I write code, and how I understand abstract concepts.

Last week, I originally started out writing this post. However, I found my writing getting sidetracked all the time. I would point out things from my past that were not about the tools at all. I gave my personal preference, and then went on to explain how this preference was formed. So, why am I telling you this?

This is to encourage you to take a look at the link I gave in the very first line of the post, namely the [Autobiography of a Blind Programmer]({% post_url /Uncategorized/2016-03-27-autobiography-blind-programmer %}). If you still don't feel like going through that, please keep it in mind. You can refer to it if you feel like you want to know more of my background.

With all that said, let's cut the c**p and get to explaining what the title of this post actually says.

## Every Day Tools

### Screen Readers

Blind and visually impaired computer users use what is called a screen reader to—make a guess!—read the screen to them. These have very powerful features,. For example, I can control the mouse with it, view the elements on the screen hierarchically (such as being able to go inside a menu bar, or to move on the items within a toolbar, etc). However, one of the more impressive features of any screen reader is usually in how it handles web content. The more rudimentary functionality is to be able to move between different types of elements such as lists, headings, buttons, text fields, and so on. The more advanced level is granularity, such as being able to jump to a level one heading (that is, an `h1` element) and so on. Finally, being able to handle [WAI-ARIA](https://www.w3.org/TR/wai-aria/) is one of the features that has become important recently, as more and more websites adopt its usage (examples include [Google Docs](https://www.google.com/docs/about/), [Twitter](https://twitter.com/), [Facebook](https://www.facebook.com) and so on).

Screen readers, just like other programs, have different features based on which one you are using. For example, I use [NVDA](http://www.nvaccess.org/) because it's really high-quality, it's written by blind people, and I don't have to keep looking for pirated copies because it's free. However, there are other screen readers. [Jaws (AKA Job Access With Speech)](http://www.freedomscientific.com/Products/Blindness/JAWS) is a popular one whose usage is dropping after many years. There's also [Window-Eyes](http://www.gwmicro.com/window-eyes/), which has been rising in usage. If you would like to see a survey of trends (browser, screen reader, and browser/screen reader combination), check out [Screen Reader User Survey #6 Results by WebAIM](http://webaim.org/projects/screenreadersurvey6/). It's a very useful resource for knowing the statistical trends within a minority of users.

These are all for Windows, though. On Mac and iOS, there is a built-in screen reader called [VoiceOver](http://www.apple.com/accessibility/osx/voiceover/). On Linux, there's a screen reader that comes with the Gnome desktop called [Orca](https://help.gnome.org/users/orca/stable/). For people that don't have a desktop environment there is [the Speakup project](http://www.linux-speakup.org/). For Android users, Google has provided [Google Talkback](https://play.google.com/store/apps/details?id=com.google.android.marvin.talkback&hl=en_GB).

For the sake of completeness, people who use Chrome usually use an extension called [ChromeVox](http://www.chromevox.com/), which is meant to be a cross-platform, screen reader-independent way of interacting with Chrome, and is meant to be the screen reader of Chrome OS.

I personally use Windows and Android, so my screen readers are NVDA and Google Talkback.

### Programming Languages

I love learning programming languages, so there is not one that I use for everything. However, when it comes to programming languages that I have worked with exclusively, here they are:

* PHP (I use this at my job)
* Go (I use this at my job, but not as much as PHP)
* Elixir (I play around with this one at home)
* Scala (I've always wanted to play around with this one too, but the sheer number of language features is scary and I always put it aside)

Of course, there are other languages that I've played with. However, these four are the most dominant.

### IDEs

First of all, let's define what I want out of an IDE.

A good IDE must offer autocompletion, the ability to jump to the declaration of a function/class/variable and viewing a function's documentation (this could be a DocBlock, or documentation for built-in functions). Of course, refactoring is very important: extracting local variables and methods, moving functions around, renaming them, and so on.

Nice-to-haves that I don't much care for are stuff like getting project dependencies (using the package manager of a language like `composer`, `go get`, `npm` and so on) from the IDE itself, because I can just run them from a command line. Of course, building and running binaries right from an IDE _can_ be useful, but since for me the alternative is to simply just alt+tab to get to my terminal, press up arrow to get the last command, and then press enter to run it again, it's okay if an IDE doesn't offer such a feature.

Most of the time, I use [Eclipse](https://eclipse.org/) and Eclipse-based IDEs. Being in Iran, I have to get pirated copies of paid ones (such as [Zend Studio](http://www.zend.com/en/products/studio)). However, Eclipse's accessibility features beat the ones provided by other **non command-line IDEs** (yes, we'll get to why I'm not using the command line).

I have provided an in-depth look at accessibility in PHP tools in my article on SitePoint called [The State of Accessibility in PHP Tools](http://www.sitepoint.com/the-state-of-accessibility-in-php-tools/). However, to give you a quick summary:

* PHPStorm used to suck, but times are changing. The IntelliJ platform, until very recently, was very inaccessible. Of course, Android Studio is changing that, and now the Android Studio itself has become _almost_ comparable to Eclipse-based IDEs. I created [an issue about this](https://youtrack.jetbrains.com/issue/IDEA-111425), and due to the upvotes I received, they moved it higher on their to-do list (thank you, IntelliJ developers!) and started working on things. Let's hope that 2016 will be the year of change.
* SublimeText _does_ suck. Their developers don't respond to accessibility requests, and it's just off the radar.
* NetBeans has started working with the guys behind the [Quorum Programming Language](https://quorumlanguage.com/). I haven't used it recently, but I hear things are much better with [Sodbeans](https://www.quorumlanguage.com/documents/releaseIDE.php), the Quorum IDE.
* Notepad++ just works. Of course, the autocompletion and such don't work with screen readers, but it's a very lightweight Notepad with support for Unix-style line endings, so I'm happy using it for a quicky.

### Operating Systems

I use Windows both at home and at work. I have an old laptop that I have installed Linux on, to play around with Emacs and [Emacspeak](https://en.wikipedia.org/wiki/Emacspeak), and see if I can tame its nearly infinite number of shortcuts. However, due to the fact that browsing in Linux isn't as good as browsing on Windows accessibility-wise, I have decided to stick with Windows for now.

Currently, we don't have enough blind computer users to warrant better accessibility in many applications. Now, imagine only 1% of the blind using the Linux operating system. What happens is that the screen readers aren't as advanced, the desktop environments (such as KDE) are nowhere as accessible as their counterparts on other operating systems, and the rate of change is really, really low. Of course, it _is_ usable. It's just that the user experience is not, in lack of a better word, as clean as the experience you get on the Mac OS X or Windows.

Initially, you might be imagining Linux to be more accessible to the blind than Windows, and your way of thinking is, fundamentally, true. Why would you think that Linux is more accessible? The reason is that when we think of Linux, we usually get this image of characters scrolling rapidly through a screen. "If it's all text," most people think, "then it is an awesome OS for the blind to be working with!" And that's right. To a point.

The problem rears up its ugly head when you get to the Internet. You need a browser capable of running Javascript to surf the Internet these days, and this means you can't use a command line. Then you start having to deal with browser, and browser access, and things like [Adobe Flash Player](https://get.adobe.com/flashplayer/) which is inaccessible on Linux and has no accessible alternative on that platform. Just like the post on PHP called [PHP: a fractal of bad design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/) said, there are a lot of small problems. Everything _kind of_ works, but it doesn't fit together as nicely as a different solution.

> **Note**: I'm not picking on PHP here. I'm just citing this post because of its famous example about the toolbox that many developers know.

Of course, we all know that Linux is an integral part of any web developer's toolkit. I have solved that problem by creating my development environments with [Vagrant](https://www.vagrantup.com/), which gives me the benefit of using Windows to write the code, and the command line on Linux to actually build and run the application. I'm not using [Docker](https://www.docker.com/) because they have blocked Iranians from downloading images.

With those explanations, you might be asking yourself why I'm not using the Mac. After all, it aims to provide a nice and easy to use graphical user interface, while keeping the power of a terminal at your fingertips. This, too, is very true. However, my problem with the Mac OS X is something much simpler, as VoiceOver is a pretty good screen reader. My problem with OS X is the fact that it is closed. On Linux and Windows, you can install any screen reader, with any [speech synthesizer](https://en.wikipedia.org/wiki/Speech_synthesis) you want. However, on OS X, it's only their screen reader, their synthesizer, and nothing else. That means I can't use [eSpeak](http://espeak.sourceforge.net/), which is an open-source text-to-speech software that I and two of my friends contributed to, in order to add Persian language support. So, with this text-to-speech not available on that platform, I don't have access to communicating with a lot of people in my own native language.

## Productivity Tools

A lot of people use different applications to visualize things. You have Kanban boards, mindmapping tools, personal finance management apps, and many more. In programming itself there are a lot of charts, graphs, and other types of illustration. How do I deal with these? Do I even use them?

Most of the time, no.

When I was in university, my professors would use [UML charts](https://en.wikipedia.org/wiki/Unified_Modeling_Language) to communicate database concepts. They used visual ways of representing and calculating data, such as [linear algebra](https://en.wikipedia.org/wiki/Linear_algebra). This usually meant that I would have to try very hard to understand the concepts in that course. This constant pressure, coupled with unwilling professors that would rather get their job done and get home, made me realize that it is not worth it to go through an education system that I had to fight with all the time. That was when I quit.

These kinds of problems are not limited to the university, either. I have enrolled in a course called [Machine Learning Foundations: A Case Study Approach](https://www.coursera.org/learn/ml-foundations). There are parts of the course that rely on similar techniques, such as linear regression. Of course, my inability to comprehend these concepts inspired the popular question, [Can simple linear regression be done without using plots and linear algebra?](http://stats.stackexchange.com/questions/204930/can-simple-linear-regression-be-done-without-using-plots-and-linear-algebra). It's not that I need to touch things to be able to visualize them. It's just that I don't understand why these concepts, which initially have nothing to do with lines and plots, are solved in that fashion. I can understand that it is because visualizing data allows you to see how your data points are scattered, but to have a solution which solves a statistical problem using lines with slopes and intercepts? Ugh.

I'm actually working on a post to try and explain the concept of linear regression without the use of plots, and until it is ready, I can't practically explain what I mean. However, most concepts like this that seem to be done in more complex ways than required usually confuse me. Couple that with the fact that lines and graphs and such aren't intuitive to me, and you'll get the gist of it.

When you extend this into the world of web applications, then a lot of similar features lose their meaning, too. For example, I can't use [Google Analytics](https://analytics.google.com/) effectively because there is no way of easily viewing the raw data in the interface, without a whole lot of hovering your mouse on things. That is why I have started working on a Javascript application to fetch data from my Google Analytics and display that in a simple table, so that I can compare data, and then mix and match as required.

All that negativity aside, here is what works for me.

I use Trello to create lists of things I need to do. The interface isn't easy to work with, as it doesn't have WAI-ARIA standards. Even though it can be used with the keyboard, it doesn't report a lot of things. For example, when you navigate in the list of cards with `j` and `k`, navigation does work. However, it doesn't let my screen reader know which card has gained focus now. This means that even though I can use the keyboard to navigate to different cards, I can't, because I don't know which task I'm on. [Google Mail](https://mail.google.com) has a better implementation of this, where `j` and `k` do move you to different emails, but also move the focus to the new choice. What this means is that my screen reader will announce the new focus, in effect letting me know that I'm on a particular email that I need.

For my social networking, I use [TWBlue](http://twblue.es/) to use Twitter, and the Facebook website. I do go on [Quora](https://www.quora.com) to answer questions, but it's not a part of my daily routine.

My creativity process is pretty different, and unfortunately, I don't have access to people who are good enough with things like [Neuro-linguistic programming](https://inlpcenter.org/what-is-neuro-linguistic-programming-nlp/) to find this out on my own. The problem is that the kind of stimulation that a [mind map](https://en.wikipedia.org/wiki/Mind_map) provides for someone who does see, is not provided to me when I just write things down.

I'm not as okay with the productivity tools I have chosen as I am with my programming tools. I have to play around more to either find, or try and create the perfect solution for myself.

## Conclusion

There are a few things I love about being blind. One of them is the need to carve out your own path most of the time. You can't just do things how everyone else does them, because they won't work. You will have to understand things down to the very basic level, or keep experimenting to find out your comfort zone. For example, when someone gives "ten reasons to be a freelancer", a lot of people can just look at that list, compare it with their dream or the imaginary vision of the future they want to live in, and then decide on whether freelancing is for them. However, for me, I constantly have to think of whether blindness will prove to be an asset, or a weakness, if I chose that path. To continue with my previous example, when I see that list of ten reasons, I always wonder, "will I need to create a user interface on my own?" The answer is, at this point in time, a resounding "yes". That is why I'm not a freelancer.

But this is the very first level. Successful people take this situation and start playing around with it, shaping it, and moulding it until they are happy with it. It's like how programmers refactor their code until it has reached the shape they have always envisioned. It's like how stonemasons chip away at a piece of marble until the shape in their mind would take form in reality.

That's who I want to be. That's how I wish to be.

**P.S.: I'm looking for someone who could help me move over to a WordPress website. If you are a theme developer and would like to design my new theme, please reach out to me through the social media links in the header and footer, or the contact form!**
