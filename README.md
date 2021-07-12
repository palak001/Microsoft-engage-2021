# Microsoft-engage-mentorship-program-2021
This project is a part of my participation in Microsoft Engage Mentorship Program 2021. I've implemented Microsoft Teams Clone application. 
You can check out the project using [Website Link](https://palak001-microsoft-engage-2021.netlify.app/).

## Features provided
* Allows two participants to have a video call
* Allows two participants to chat with each other(before, during and after 
* Allows participants to keep discussion related to different topics seperate by creating meetings

## Tech Stack used
* React, redux, typescript for frontend
* Node js, simple peer, socket.io, redis for server side 
* Firebase for authentication and user data storage

## Point to note 
* The application allows only one session per user, so if you try to open multiple sessions for same user, the application will close all your sessions(except the very first one) with an active session error message. 

## FAQs
### I am trying to call the other person, but he/she isn't receiving any notification
In this case try refreshing your application and ask your friend to do the same for sometime. When you try again, you should be good to go. If the issue still persists, then consider raising a github issue for this problem.

### Application shows "You already have an active session" error
Why seeing this message?
* You might be trying to access the Application in multiple tabs in the same browser. Please make sure there's only one instance of application opened per browser.
* You might be trying to access the Application in multiple browsers/devices using same google account. Please make sure to use two different accounts to access the application. As per the intended functionality each user is restricted to only one active session at a time.
* If you want to access the application using multiple google accounts then please make sure to either use two different browsers or different devices to run the application.

Seems like a mistake?
* Try refreshing the application some times.

### Why am I not allowed to open multiple sessions of same user?
This is an intended feature. The reason for restricting users to single session is to properly handle video call feature in the application. Every session is assigned a socketID. This socketID is necessary for letting two participants have a video call. Multiple active session implies, multiple socketIDs is associated with that particular user. One way of handling multiple active session is by having some way of keeping a record of active socketID and a way of finding out which socketID is the participant using for establishing peer to peer connection(helps in videocalling). The other way(which I have used) is to restrict the participant with only one active sessions at a moment. Hence my application just allows one active session per user at any point in time.

### I can't see/hear the other person video/audio
This could occur for couple of reasons-
* Your friend hasn't switched on their camera
* Your friend's system might not have proper hardware devices support for streaming video/audio or they might have denied the permission to access their camera/microphone.


## What to do if the application doesn't seem to work?
There can be many reasons as to why you might be facing such an issue. But generally refreshing the application or trying the application from different devices do the trick. 

### Suggestions
More suggestions and improvements are welcomed.

## Some additional Links
[Project's desgin document](https://drive.google.com/file/d/1IR-qX6sdtYAYsD-lwCIn_yiRKwc1Jk3g/view?usp=sharing)\
[Project's timeline](https://docs.google.com/document/d/1UD0M6VAbLMRsoqhzxQocGrSoSdE3kd5aO_xPRrwa6eE/edit?usp=sharing)




