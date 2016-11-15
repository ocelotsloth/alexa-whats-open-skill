# alexa-whatsopen-skill
 As a student at George Mason University, I am lucky enough to be a part of a student organization that creates useful tools such as whatsopen.gmu.edu, an open source website that tracks the very simple question of "What's Open."
Alexa provides an opportunity to extend the background API of this application to other platforms, allowing for very simple question-response interaction with the site through Alexa. The skill itself is fairly simple in principle:

## Process
The skill itself is quite simple:

- Wait for a user to request information on a particular location on campus, and start the skill.
- Pull down the up-to-date schedules from the whatsopen API, and parse the JSON, looking for the requested location.
- Once found, the skill does some simple checks to see which day it needs to pull, and tells you the current status of the location you requested.

For example:

>User: Alexa, is Southside open?

>Alexa: Southside will open in 42 minutes.

>User: Alexa, when does Ike's close?

>Alexa: Ike's is currently open and will close in 8 hours. 

Alexa provides the simple answer of if the location is currently open as well as additional context regarding when it will open or close (depending on if it is open or closed at that moment). The skill utilizes the fantastic moment.js library to convert time differences to english words for Alexa to read off to the user.

## Challenges

I have to say, I was surprised at how difficult it is to work with the AWS console. It took me quite a while to pin down an npm package that works properly, and in full disclosure, I still haven't figured out how to enable Internet access from Lambda Functions. I really don't want to pay for a Digital Ocean Box to host this on though, so I've opted for caching the whatsopen.gmu.edu api call in the skill itself. Ideally, it would actually reach out to the server but updating the cached call every few weeks should work fine, as the schedules don't change very much at all.
That said, if anybody wants to help me set up Internet for my Lambda Function, I'd really appreciate it :).
