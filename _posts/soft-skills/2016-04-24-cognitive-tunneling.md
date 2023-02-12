---
layout: post
title: "Cognitive Tunneling: What It Is and How I Plan to Prevent It"
date: 2016-04-24
category: soft-skills
---

You might have never heard about cognitive tunneling. However, chances are, you have sometimes been a victim of it without knowing it.

To explain the phenomenon, let me tell you the story that inspireed this post first and let you see it and its results in action.

A friend of mine used to work at a start-up where they were working on a website to sell cars online. In Iran, a website like that would be able to bring in huge amounts of money, simply because there are no competitors. If they would manage to get it right, they would be able to live happily ever after, and my friend would have the ultimate choice: retire early and live off his equity, or continue coding, enjoy what he did, and use his equity to do whatever he wanted. Maybe he'd start a gig on the side. Maybe he'd take a trip to the Canary Islands every month. He didn't know, but the power was utterly staggering.

He and a non-technical friend had co-founded this start-up together. He wasn't a fond of doing non-technical work since, like most of us, he wasn't really good at soft skills. However, he wanted to be part of the business side of things too because he wanted to learn. The fact that people could start a business and help lots of people was, and still is, very interesting to him. He wanted to know how it worked.

That was why, on a sunny day here in Tehran, he found himself speaking to an investor. The guy wasn't really into websites, but my friend had spoken to the other co-founder and had everything ready: he had statistics from the Iranian market and had forecasted a growth in buying and selling cars. With a website like theirs, if they could target the [Over 60 percent of Iranians who are under 30 years old](http://iranprimer.usip.org/resource/youth), their growth would skyrocket. "Now," my friend told the investor, "if you have the mind to grasp this opportunity, we'd love to work with you. If not, I'm sure I will find younger investors that would be more informed about how the new generation will make money in Iran."

My friend had learned this technique in a book. He figured that if he'd make a threatening remark that would make the investor feel like he was missing out on the investment move of his life, he would agree to his proposal.

And it worked.

The days after that were a blur for my friend. He worked day after day, spurred on by the vision of a life of the power of choice, and emboldened by the investor's trust in their abilities. They defined an [MVP](https://www.appdevelopmentcost.com/app-mvp). They turned those into stories. They told all of their friends and family that they have a big thing coming in the next two months. My friend swears that he tried to write the cleanest code he knew to write, and he managed to do it while keeping the investor happy -- we all know how difficult that is to accomplish.

The day of the release my friend and the other co-founder didn't sleep. They were excited, energetic, and wondered what the public's reaction could be to this new product. In a few hours, they would manually send messages to different social media websites, and their future would start.

They did. They sent messages everywhere. They followed people on Instagram. They sent messages on [WhatsApp](https://www.whatsapp.com/) and [Telegram](https://telegram.org/). Then they sat back, and waited.

A few minutes later, there was a massive spike in visitors. People from different provinces were connecting---from their mobile phones, tablets and PCs---to see what this website was about. And they appeared to be loving it! Wait, were they?

After a few minutes, the traffic decreased, hung at 50 current visitors for a few minutes, then dropped to 0. At the same time, the bounce rate was going higher and higher, and as it increased, they could feel the ground drop out from under their feet.

Their first mistake was that they panicked and didn't consider the problem from every angle. They frantically searched the web, looked at their Google Analytics data, and tried to find the reason for why people hadn't loved their product. They looked for patterns in visitors to see if they had done anything that had caused a bug, or if they had been pushed away by the web application's look and feel. However, no matter how hard they tried, the data yielded no definite, useful information.

A few minutes later, the investor called, asking for the results. As you can probably imagine, he wasn't happy about what he heard, and demanded a meeting.

So the day of the launch, which was supposed to be a day of celebration, turned into a draining brainstorm session in which they looked for the golden feature they could implement to make people come back to their site. And in the mean while, they decided to take down the site so that they wouldn't be disgraced by providing a poor service and lose their customers for ever. That was their second mistake.

The next day, my friend was recharged by the ideas proposed in the meeting of the day before. He pushed down his fear of failure and pressed on, determined to see this venture to success. After two months, the golden feature was implemented. 

Again the day of the big launch came. Again they waited, and again, after a spike, visitors dropped to zero. So instead of trying to find the underlying reason, they held on to the first thing that was in front of them -- the application. That was the day that application was doomed to fail. The next month, they were drained, tired and disheartened. The month after that, their group was disbanded.

What was the reason, though? Why was there an initial spike, but then nothing. Why had they failed? Why had the bounce rate been so high?

That was the question that haunted my friend since that day. He spoke to a lot of visitors and his friends and relatives who had visited the site. Bit by bit, he coaxed the information out from raw data, just like a data scientist taking his first baby steps. And slowly, something totally unexpected started to emerge.

He finally found why there was an initial spike: people had visited their website only to see what it was about. They liked what they saw, but since the messages were sent out at the middle of the day when people were working, they had decided to leave and come back later in the day, or the week. When they had come back, the website failed to load because they had taken it down.

You got it right. There was nothing wrong with the application. It could have been a big success, if only my friend, the other co-founder, and the investor would not have been so fixated on finding what was wrong with their application, and had instead tried to get the whole picture.

In other words, it was cognitive tunneling that killed their product.

## The Official Definition of Cognitive Tunneling

Cognitive tunneling is the mental state in which your brain hangs on to the thing that is closest to you or in front of you, and does not see the rest of the environment, or other, relevant data. Aas  Charles Duhigg says in his book called [Smarter Faster Better: The Secrets of Being Productive in Life and Business](http://www.amazon.com/Smarter-Faster-Better-Productive-Business-ebook/dp/B00Z3FRYB0):

> Cognitive tunneling can cause people to become overly focused on whatever is directly in front of their eyes or become preoccupied with immediate tasks. It’s what keeps someone glued to their smartphone as the kids wail or pedestrians swerve around them on the sidewalk. It’s what causes drivers to slam on their brakes when they see a red light ahead.

At an age where you could be eaten by a lion at any moment, cognitive tunneling would be probably very useful; you wouldn't need to process the shape of flowers and trees as you run past them, trying  to save your life. But at this age where we are under constant pressure at our home and workplace, it seems like cognitive tunneling is impairing us, rather than helping us perform better.

We programmers are susceptible to this phenomenon, perhaps more than people in other industries. Just as cognitive tunneling caused [the tragic plane crash in Taipei](http://nautil.us/issue/23/dominoes/fear-in-the-cockpit), a mistake on our part can kill a product just as surely as a mistake among business owners. Here is how you might have seen cognitive tunneling manifest itself in a development team:

* APIs or classes are built, without creating a contract about using it in other parts of the system (i.e. a class in an application, a web service in a service-oriented architecture, and so on).
* Code is written without taking the needs of the client into account. Client could mean the manager, the customer, or the UI team, or the native phone app that's going to send requests to your application.
* Decisions are made only to solve the current situation, without getting a wider view of the circumstances. An obvious example for this is creating lots of virtual machines when the business doesn't have the means of storing snapshots or back-ups.

Cognitive tunneling shows itself the most when quick reactions are required. What do you do when your biggest customer comes running to your manager, complaining that the latest code pushed to your repository has broken something that used to work? Do you pause to take a deep breath, consider the implications of your code, and run the tests before hitting save and pushing your code upstream, or do you rapidly type some code, do some preliminary manual tests and cross your fingers while you `git push`?

We have all felt that momentary jolt when we realize that we haven't taken all the angles of a problem into account before proposing (and simetimes implementing) a solution. That, my friends, is you realizing that you have been hit by cognitive tunneling.

I have learned about this phenomenon only recently. I used to think that it was only me, and that I'm stupid to be making such newbie mistakes. So when I found out the scientific name, it gave me the motivation to think up the ways to solve this. I am going to propose my methods, but I'd love to read your feedback in the comments, because alone we can do so little; together we can do so much.

## Reliable To-do List

A lot of you might have heard of, or have read David Allen's [Getting Things Done: The Art of Stress-Free Productivity](http://www.amazon.com/Getting-Things-Done-Stress-Free-Productivity/dp/0142000280). In this book, Allen proposes that since our brain is awful at remembering to-do lists and reminding us at the right place and the right time, we must create a so-called externalized brain to store all the stuff we need to do.

For us developers, this doesn't always work. Most of the time, the path in front of us is unclear. We might begin writing a class, only to find that we need to update our compiler or interpreter, which would lead to a complete reinstall of the OS, and so on. Or, less drastically, we may start using a third-party library, and without knowing it intimately, we can't really create a detailed to-do list.

But, still, a general to-do list can work wonders, simply because writing code requires a different mindset than finding out and planning what needs to be written, and each has its own context that needs to be first loaded in your brain. So, having a simple task list (which could be as simple as `@TODO` comments in your code) can remove the need to switch back and forth between contexts.

For example, the [Pomodoro technique](http://pomodorotechnique.com/) proposes that you write down tasks as they occur to you while coding, and don't interrupt your workflow. When your pomodoro completes, you will have a list of tasks to pick from. So, even if you don't spend a pomodoro in the beginning of the day planning your activities, you can note down distractions and take care of them later.

## Pair Programming

This is personally my favorite method! As an extroverted person, pair programming is awesome for me. For one thing, the person not sitting at the keyboard has a high-level view of the code and what needs to be done; he is in the planning mindset. At the same time, the other developer sitting at the keyboard is in the programming mindset, and is dealing with the code one line at a time. When the question is, "what algorithm can we use here?" or "should we implement it now or just go with another implementation to get this shipped faster?", the person in the planning mindset is there to give you your answer.

## Shortening the Feedback Loop

I think that shortening the feedback loop as agile methodologies recommend has an extra benefit that you don't see mentioned much.

Let's face it: we like to write code, use the latest stuff in our field, and keep learning. However, somewhere along the line, we are so taken with the steps in front of us that we don't see the bigger picture. We might start implementing a feature to send emails asynchronously, simply because we want to use this new message queue server that has just caught our fancy. We may want to rewrite our current application from scratch to use a different language, a different framework, or a different architecture.

But, are these the right moves, or are we suffering from [developer bias](http://mikeschinkel.com/blog/developerbias/)?

The problem with bias is that you don't notice it's there. The only way to find out it exists is to check with someone else. No matter if it's a team mate, your CEO, or a friend, shipping features in smaller increments forces you to talk about what still needs to be done, and whether it must be done now.

## Conclusion

This was my two cents on how we can help the world more. Do you have a different opinion? Do you agree or disagree? Do you have another method you use to get your mental equilibrium back and prevent cognitive tunneling? Leave a comment!
