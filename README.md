# Microsoft-engage-mentorship-program-2021
This project is a part of my participation in Microsoft Engage Mentorship Program 2021. I've implemented Microsoft Teams Clone application. 
You can check out the project using [Website Link](https://palak001-microsoft-engage-2021.netlify.app/).

## Features provided
* Allows two participants to have a video call
* Allows two participants to chat with each other. 
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

### I can't see/hear the other person video/audio
This could occur for couple of reasons-
* Your friend hasn't switched on their camera
* Your friend's system might not have proper hardware devices support for streaming video/audio or they might have denied the permission to access their camera/microphone.


## What to do if the application doesn't seem to work?
There can be many reasons as to why you are facing such an issue. But before concluding that this application doesn't work at all, Please consider trying it one last time. Generally refreshing the application or trying the application from different devices do the trick. 

### Suggestions
More suggestions and improvements are welcomed.




