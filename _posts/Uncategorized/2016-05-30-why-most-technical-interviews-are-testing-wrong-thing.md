---
title: Why Most Technical Interviews Are Testing the Wrong Thing  
layout: post
---

I'm trying to relocate as a completely blind back-end programmer, and I've been interviewed by some European companies in the last two months. I've failed at almost all of them except two, and my reason for writing this post isn't to rant. It's just to share my point of view so that we can all discuss the pros and cons of the interview process, and how its automation is affecting us -- the employees, and the employers.

So, here is the problem.

A lot of the technical interviews I've had have been automated. Most of them have been using either [HackerRank][] or [Codility][], and I've failed at almost all of them. My problem isn't particularly with automating interviews, but the points I will raise below are hard to automate. So if someone can figure out a way to automate them, awesome! But the point I'm making below is that some technical interviews are missing some crucial points, points that will make or break a team or an organization depending on how they are handled.

Why have I failed at most of my  interviews so far? Mostly because of my own weakness -- I'm not good at questions based on solving an algorithmic problem, and this is something I should improve. However, there's something more dangerous that I've found in these interviews, namely that only a few of the important qualities for sustainable success as a programmer are tested.

Let me elaborate with an example.

In one of my interviews, I got a question about calculating the intersection of some polygons on a two-dimensional plot. Now, this will probably be too easy for you guys who are mathematically inclined, and kudos to you. But, seriously, does this company even need to use such a mechanism? No. Trust me. I have insider information.

So why do I need to implement all these concepts, when they already exist in the real world? Does this truly test me as a programmer?

I'm not sure about Europe, but in Iran, I have interviewed more than a hundred people. What I have found is that ruling people out due to a failure in these tests, or considering them as perspective employees just because they got past this test is  very wrong. In fact, the results are so similar that I'd say having a technical interview process in which people solve a purely algorithmic problem is pointless, because they don't showcase the more important qualities we need in today's fast-paced work environment.

But, what qualities am I talking about?

## Does this guy write maintainable code?

Does knowing how hash tables are implemented make someone write code that can be easily maintained? Does writing one-liners and clever tricks in their programming language of choice make them better able to produce value? Does knowing all algorithms and being able to recite them from memory like the bible prevent them from regressions?

Unfortunately, I have been asked very little about object-oriented design principles and why each one is important. I have not been asked about design patterns. I have not been asked to show the biggest project that I've worked on. I've not been given a case where I'm dealing with a huge code base and I must find solutions to make it maintainable with as little overhead as possible. I've not been asked to write a unit test, and show something like the Liskov Substitution Principle in practice.

## Does this guy write readable code?

Oh my God. I'm tired of people who breeze through algorithms and are so proud of it, but write their code in such a crappy spaghetti mix of statements that I just want to f**king shift-delete the whole thing to hell, or wherever it is horrible, useless lines of code go when they are deleted.

Why should I care that someone can implement a thread pool in their sleep, when I can't read it? When the next guy who wants to take over the code from them can't read it? When it's full of code that is commented out and is indented so deep I get stuck in it up to my neck, I don't want their code, I don't want their expertise. Please, just go away.

When I have to argue with someone for hours on refactoring this:

```
if (File_exists($file ) && SomeTest($contents = get_file_contents($file))) {
    doSomething($contents);
} else {
    defaultAction();
}
```

to this:

```
function getFileContents($file)
{
    if (!File_exists($file)) {
        return null;
    }
    
    $contents = file_get_contents($file);
    
    if (someTest($file)) {
        return null;
    }
    
    return $contents;
}

$contents = getFileContents($file);

if (!is_null($contents) {
    doSomething($contents);
} else {
    defaultAction();
}
```

(Example adapted from a question on [StackOverflow][]).

Or, when I have to ask someone politely a million times to stop doing something like this:

```
testSomething() && doSomething();
```

Instead of:

```
if (testSomething() === true) {
    doSomething();
}
```

I don't really want to work with this person. I don't care about his degree. I don't care about his ability to implement a hashing algorithm in one line. I want a code that the stupidest person on the team can at least understand one line at a time.

## Does this guy learn fast?

I had an interview in which the process went like this:

> Interviewer: What's the fastest way to traverse a graph like this?

> ```
> a: [d]
> b: [c, d]
> c: [d]
> d: [b]
> e: [f]
> f: [a]
> ```

> Me: I have no idea, honestly.

> Interviewer: Well, let's say that you wanted to go through all the elements of this graph. What would be your problem?

> Me: [after thinking for a while] I'd get into a circle because `D` points to `B` and so on.

> Interviewer: Great. So, how could you stop that?

> Me: [almost instantly] Keep a list of the nodes I've visited.

> Interviewer: Exactly.

And so it went. Every time i would say "I don't know", the interviewer would guide me toward the solution, to try and figure out how fast I'd catch up, and sometimes he'd even ask questions building on previous concepts he had just explained.

Could you know such a thing with a technical interview which only consisted of solving algorithmic problems?

## Conclusion

Technical interviews are a crucial step of the recruitment process. Without a proper technical interview, there's no way of knowing how much you would enjoy working with someone, how much you could rely on them, how much they care about delivering value, how much they understand the balance between delivering and code quality, how they respond to criticism, and much more. So, rather than focusing on how a person solves mock problems, they must be put in an environment that matches their real job as much as possible. Just as a pilot can't necessarily have great flights simply because he knows how to fly well in a simulator, a programmer is not a good or bad programmer simply because of his performance in a technical interview with mock questions such as "how many transformations are required to turn 'ababa' to 'aaaaa'?". We are humans, not machines. Unlike machines, our strengths and weaknesses are all gray, not black and white. If, after a failed interview, you can't tell me my strong points, then you have failed horribly to assess me as a human being.

Of course, I'm not saying that the only way to have a good technical interview is to spend 45-60 minutes with the 2500 applicants that submit their CV. However, the solution to the problem is not to use an automated system and let it act like a shield of protection between you and that vast hoard of developers, either. I personally have no suggestions about any concrete methods that are better, though.

What do you think about technical interviews? Have you had success using them for hiring people? Do you, as a programmer, believe that they represent your strengths and weaknesses closely? Do you have a solution for a way to have technical interviews that has a balance between not taking too much time, and helping recruiters learn as much about the applicant as possible? Let me know in the comments!

[HackerRank]: https://www.hackerrank.com/
[Codility]: https://codility.com/
[StackOverflow]: http://programmers.stackexchange.com/questions/122485/elegant-ways-to-handle-ifif-else-else
