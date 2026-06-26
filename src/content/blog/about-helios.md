---
title: About, Helios!
date: 2026-06-26
pinned: true
description: A (not so) brief summary of my computer(s)!
tags:
  - meta
---
Do you remember when you first made the jump from a shitty office laptop to a *real*
desktop computer? It probably wasnt high dollar, or built from scratch, but I'm sure
we can all relate to the "wowie wow" moment of booting up CS:GO and **not** getting
15fps. Being able to play Kerbal Space Program with **more** than four mods? Or
even downloading a modern game you got for Christmas and it just...working.
After years of shit performance, or being stuck on a console, you finally got
a system that could run the games you wanted?

For me it was Christmas 2016.

## Lets start at the... well... start

For the longest time i was exclusively a console kid. I had a WII, a '360, a
Gameboy-Advanced with like 15 games, and i played the shit out of those consoles.
When i wasn't playing Plants vs Zombies on my Xbox, i was playing WII Sports tennis
with the family.

It wasnt like i had zero computer experience.  
My childhood home had an old dell
desk pc with the CRT display, running windows XP, so playing with windows was
always something i had some experience with. My mom eventually got a laptop with
<span
  class="tooltip"
  context="god i could write a whole blog about vista">
  vista
</span> that i would use to play random games i was into at the time.
All that changed when me, and my two immediate cousins were given laptops for
Christmas. I was handed a computer, and told 'this is yours'. It was running
<span
  class="tooltip"
  context="god i miss this era...">
  windows 7
</span>
and was exactly what youd imagine a shitty office PC from the 2010s was like.  
I didnt care.  
It was mine.

## What does this have to do with "Helios"?

I'm getting there! Patience!

After a few years of using laptops, (and breaking at least one laptop beyond repair)
i got tired of the shitty performance, and limited options at my disposal. It just
so happened that my oldest cousin Leica was getting into computers at about the
same time, and had just gotten one put together. I dont remember what she had in
the box, i just knew i wanted one too. I asked around, got a part list, she sent
that part list to our grandparents, and come Chirstmas 2016 i had a computer!

It wasnt anything to ride home about. It had an FX8320, and a GTX660 with
<span
  class="tooltip"
  context="dont ask, i dont know either">
    **32gb**
</span>
of DDR3. I'm well aware in retrospect that the computer i was using for a while
was both over and under-spec'ed at the same time. In the moment? "This thing can
hit 4.6GHz!" was all i cared about. I eventually upgraded to an EVGA 980 Classified
while still keeping the motherboard cpu memory combo.

It wasnt until the christmas of 2018 that the computer that i would eventually
name 'Helios', began to take shape. That Christmas brought me many things, from
an Intel i7 6700k and complementary motherboard, to a Corsair Carbide 400c and
a brand new <span
  class="tooltip"
  context="Rev.A's were known for their exploding VRAM">
    Revision A
</span> RTX 2080 Founders Edition. From here, any new upgrades were minor, like
a new hard drive, or maybe even some nvme drives (which i later learned were SATA).
I was also hyperfixated on making my system look as nice as possible, both
on a hardware and software level.

## Lets get on with it?

This is my blog, thank you very much! but i suppose im talking to myself... wait-

Coincedentally I met one of my dearest friends, Zoey, during this time. We were
just playing a game of cs:go, and next thing i knew i was trying to get her to
Overwatch with me! It's kinda crazy how things go sometimes... Anyway!  
Where was i? liking computers... being hyperfixated... zoey... AH!  
I was getting absolutely fed up with windows 8, and was looking for a way out that
wasnt downgrading to an EOL win7. Zoey was on arch linux at the time, and did a
very good job at convincing me to try linux! so i did! and boy did i fucking hate it.

### A small rant about why i hated linux

When i first jumped to linux, i was promised prosperity, freedom from microsoft,
and the virtue of "Open Source Software" whatever the fuck that meant. In actuality
i was hit with "This driver doesnt exist", "You need X windows program", or, my
absolute favourite "Dualboot windows". I didnt get it! it felt like insanity! I
seen the appeal for those who didnt rely on windows programs, or played literally
any video game ever, but for someone like me who just wanted their pc to work?
nah, linux wasnt it. It just felt so clunky doing a

```sh
sudo pacman -Syu # i dont even know if this is right its been so long
```

every time i wanted something to update. Downloading programs wasnt a
'go to site' > 'download .exe/.msi/.zip' > 'run/extract'. Instead i had to;

> - Go to the AUR
> - Go to the real stable repo, or use something like pacman's repo
> - Check github for repos that i can build from source

just for one package that i may never need to worry about again.  

And all 3 of those methods follow different installation paths, and arent the
most... noob friendly at times.

### Okay, this stuff is pretty baseline, whats the real issue?

Call this bias, call this whatever you wanted, but to me, the fact that the only
thing stopping me from deleting 4 years worth of data during a reformat due to a
typo was a `please enter sudo password:` was the nail in the coffin that made me
instantly bounce back to windows, and completely uninstall Manjaro. I seen what
Linux had to offer, and i absolutely hated it. Cool, it gives me unlimited power
over my system -- "some things shouldn't be up to the user" i thought. "Why would i
want to spend the time to MAKE windows, when i have windows right here".  
How naive of me.

### Lets skip to more present-day

I forget exactly what year, but i finally upgraded to a R7 5800X with 32gb ddr4, finally
giving us the HARDWRE that makes up Helios. Now i can move onto the software side of things.

I had always been interersted in making my computer do what i want, but i never liked the
linux-style 'do it yourself' mindset. I wasnt a programmer, i was a gamer. I played overwatch,
smoked weed, rode my Longboard, and just wanted shit to work. Well, after a <span
  class="tooltip"
  context="*sigh* covid...">
    long
</span> couple years i was in a shitty run down motel, with 8mbps up/down from wifi
i was stealing from the business across the street.
>pro tip: dont set ur **private** wifi password to your **public** business phone number!  

My system was <span
  class="tooltip"
  context="thank GOD">
    ineligible
</span> for Windows11 due to the lack of TPM, but that didnt stop microsoft from
shoveling dogshit windows updates at me that ate almost all of my network bandwidth.  
I wish i had screenshots, but all the "phoning home" windows does was consuming on average
30-40% of my network at any given time, leaving me less than 5mbps of usable internet!
A good ole

```powershell
ping 1.1.1.1 -t
```

would yield times ranging from 30ms to 3000ms. This was some of the worst internet experiences
in my life. I know the internet used to run on less, but the web was DESIGNED around kbps
or even bps worth of bandwidth. Now we have web pages that are asking to load GIGS of data into
memory over the course of the session! This was unacceptable. Im already sick of microsoft
snooping on my stuff, now theyre eating away 50% of my internet?  

### You mentioned zoey earlier, is she still relevant?

Yes! I'm glad you asked disembodied voice in my head!

Zoey helped me through a lot of stuff in life, and ive always looked up to her in many ways. In the past,
those ways werent so healthy and drove a wedge between her and i, and even<span
  class="tooltip"
  context="My wonderful girlfriend">
    ryn
</span> and i because of
how highly i treated her -- I was incapable of being mean to her, and she was incapable of being wrong
in my eyes. She started a discord bot named `Artemis`, which was her first ever CS project. That one
project opened the doors to so many opportunities. She was constantly opening the same doors for me,
but id never walk through them. Id always go 'yeah that seems cool', then not touch it for a week and
forget everything i just learned about javascript. This is how it went for us. Id be vaguely interested
in something, she would pour upwards of hours of her life into making sure i was understanding it,
just for me to forget *almost all of it* in just a few days.

To get back on track, i needed computer help, and i wanted off windows. "Whos someone you
know who uses linux... Zoey!" and off i went. Her and i went back and forth with driver names,
model numbers, hardware specs, all because of some dumb ass network drivers. <span
  class="tooltip"
  context="She* i sat back and waited for answers">
    We
</span> spent hours looking for distros with the driver, or
packages with the driver. no luck. at least no luck in a way that was usable.
We could totally have gotten it working on say barebones arch, the problem was getting
networking in the installer so i could actually install the OS. Cant download a package
if you dont have internet... Eventually she caves, and says "Fuck it, i use NixOS, and NixOS is
actually really good at this. Let me just make you an ISO with the driver on it.".

She never expected me to stay on NixOS. She 100% expected me to find a different
solution to the problem on my own, but instead i slowly fell in love with all the different
`nixisms`, like the declarative nature and modularity of configs.  
Was switching to nix hard? Duh! Especially cus i had no real functional programming
experience! I found the idea of a single file that defines my entire system too cool
to not learn!

### So now youre a nixxer?

You probably shouldnt say it like that, but yeah!

After many many years of windows treating me like dirt, LOTS of zoey's time
wasted on what couldve been google searches, and me growing past my 'terminal scary'
bias, i finally have come to appreciate what linux has to offer and have done a LOT of that
'do it yourself' stuff i was complaining about in an earlier section.  
I'm sure ill talk more about some of those things in future posts, so stay tuned!

But, to wrap this up cleanly with a nice neat little bow -

Helios:  
CPU - R7 5800x  
GPU - RTX 2080FE Rev.A  
MEM - 32GB 3666MHz G-Skill  
OS  - NixOS (unstable nixpkgs)  
WM  - Niri

> If youre reading this Zoey, thank you for everything, and im sorry.  
> I wouldnt be who i am without you.
