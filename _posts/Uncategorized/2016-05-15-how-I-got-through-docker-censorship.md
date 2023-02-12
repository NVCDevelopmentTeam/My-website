---
title: How I got through Docker's censorship
layout: post
---

As an Iranian, I am quite used to censorship. In fact, I browse the Internet while constantly switching IPs: I switch to a Canadian IP while paying for services, I switch to a US IP while buying books, and I switch to a UK IP when I am browsing the Internet. This gets me through most of the censorship and blocks. Amazon doesn't want me to be able to read Kindle books. PayPal doesn't want me to pay and get paid. But I need these services to improve.

One thing most people don't know is that Iranians are blocked from both sides. We are blocked by the Iranian government from using Facebook, and we're blocked by PayPal from using their website. We're blocked by the Iranian government from going to Twitter, but we're also blocked by Google. This means that while the Iranian government doesn't want to allow us to go to social networks, a lot of websites based in the US won't allow us to use their services, either.

Docker is one of these companies. You shouldn't really hate them because they are doing what they have to do. However, as a web programmer, I need to know these things. I'm trying to get a job outside of Iran and relocate, and knowing stuff like Docker seems to be a huge deal right now.

A few days ago I got a call from a lady that is studying her Masters degree in computer science. The ratio of women to men programmers is even lower in Iran than other places, so it was very refreshing for me to see a woman trying out a fairly not-so-popular tool in Iran. She, like me, had trouble getting through the Docker censorship. She was quite resourceful and ended up succeeding on her own, but I thought I'd post how I do it nonetheless.

## The Problem

When you try to pull an image from Docker Hub (which is the free repository for Docker images), you will get an 403 response from their server which basically says that since Docker is a company based in the US, they have blocked traffic coming from Syria, Cuba, North Korea and Iran. Unfortunately, I have come to be born in one of those countries. Uh oh.

## The Solution

The solution is basically to change your IP. I have a friend who lives in London, and he has been kind enough to allow me to use one of his virtual private servers on [Linode](http://welcome.linode.com).

In this tutorial, I'm going to assume that you have such a friend, or access to such a machine. If not, [contact me](/contact/) and I'll see what I can do for you.

## Step 1: Create a Socks5 Proxy

Assuming that you do have access to a machine outside of the blocked region, you first need to use `ssh` to create a dynamic port that can be used as a Socks5 proxy.

If you're on Windows or Mac OS X, you should install [Docker Toolbox](https://www.docker.com/products/docker-toolbox). Installing this on Windows, would also install `ssh`, which is what you will be able to use to SSH into that machine. If you're on Linux, however, merely having Docker installed is enough.

To establish the secure tunnel that you'll use to connect to Docker, type the following command:

```
ssh -N -C -D 8888 <username>@<host>
```

All you need to replace in the command above is the `<username>` and `<host>`.

After you press enter, you will be presented with a prompt asking you for your password. Once you type in your password, you are connected. You will not see any more output in your SSH window, however. In this case, silence is golden: seeing nothing means everything is in order and you're ready to move to the next step.

## Step 2: Redirecting Docker's Traffic Through the Tunnel

The Docker daemon does not support SOcks5 proxies. So what you need to do here is different based on the operating system you use.

### Windows and Mac

Running the Docker Toolbox starts a virtual machine using `docker-machine` and VirtualBox. You need to send the connection of the `vboxheadless` process, which is in charge of running your virtual machine, through this tunnel. There are different ways to do this, but I personally use [Proxifier](https://www.proxifier.com/).

You can simply set Proxifier to redirect your whole traffic to the proxy at `localhost:8888`. You can do that by going to Proxifier, and then clicking on Profile -> Proxy Servers -> Add, and then entering `localhost` as the host and `8888` as the port while leaving the authentication checkbox unchecked.

If you don't want to redirect your whole traffic through Proxifier, go to Profile -> Proxification Rules and set the action of the `default` rule to `direct`. This means that by default, Proxifier will not redirect traffic through the proxy. Now, you can click on `Add` and browse to the `vboxheadless` process on your computer, and set the `action` to `Proxy SOCKS5 localhost`.

### Linux

I can't give you working steps on Linux, but I have done a few searches on the Internet and I present my findings here for what it's worth. On Linux, once you've successfully established the tunnel, you can use [DeleGate](http://www.delegate.org/delegate/) which converts that Socks5 proxy to an http proxy. Once you've set up DeleGate, you can run the following command to start an http proxy on port 8080 that forwards traffic through the tunnel you established on port 8888:

```
delegated -P8080 SERVER=http SOCKS=localhost:8888
```

This method requires the extra step of setting the http option of Docker to the proxy you just configured. For information on how to do that, check out [Control and configure Docker with systemd](https://docs.docker.com/engine/admin/systemd/).

You can also try out [redsocks](http://darkk.net.ru/redsocks/). I don't have any experience with that either, but it seems to be a solid option, at least by reading the manual. The benefit to this option is that like the Windows and Mac options, it doesn't require you to make any changes to how the Docker daemon is started.

## Tah-Dah!

Now you should hopefully be able to run `docker run hello-world`.

## Conclusion

I don't have all the knowledge required in getting this workflow to work. This works on my Windows machine, but i haven't tested it on other operating systems. If you have any problems, or know of simpler ways to get through being blocked, please leave a comment. I'll keep this post updated in the future.

Let's make this post a go-to place for people who want to use Docker but can't, because they live in a place that politicians don't like!
