# [Rehearsely](https://final-project-chiyanz.vercel.app/)

## A calendar sharing web app that allows users to merge their schedules and find the best time to meet for dance rehearsals

Ever been in a friend group and struggled to find a time where everyone was free? Now imagine that but with a dance team that has 10+ members! 

Rehearsely is a web application that allows users to create their calendar, and then share their calendar with others. Users can create events, send invites, receive invites, and to respond to an invitation with their schedule. Lets say your director wants to add an additional rehearsal that is outside of usual rehearsal hours, they can then create an event, select a time frame to suggest for a potential rehearsal, and then invite the company members to respond by sending their schedules. After the schedules have been received, the app will highlight overlapping free-time and the director can then use that information to make a decision based on what times will work the best for company members. 


## Annotations / References Used

1. [Using MongoDb Atlas with the MERN stack](https://www.mongodb.com/languages/mern-stack-tutorial)
2. [Creating and using MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/?_ga=2.266737101.25320543.1667771046-304344951.1666660795)
3. [Pass data between react and MongoDB Atlas](https://www.youtube.com/watch?v=nUbNn0voiBI&ab_channel=MarinaKim)
4. [Deploy and hosting with Heroku](https://youtu.be/Z_D4w6HmT8k) 
5. [Using React context](https://www.youtube.com/watch?v=5LrDIWkK_Bc&t=104s&ab_channel=WebDevSimplified)
6. [Passport.js authentication](https://youtu.be/IUw_TgRhTBE)
7. [Using tailwind css pop-up modals](https://youtu.be/nwJK-jo91vA)

## Usage 

### Login/Register:
go to /login or /register to start testing (login using username: test, password: test for testing account). Once registered navigate to /login to log in
Logout using top-right corner logout button and you should be redirected to home screen
Once logged in:

### Event creation:
go to /invitations and you should be able to create events. 
Title: required title of your event
Description: optional description of what your event is about
Dates: select any amount of dates where this event will take place. To add a new one just click on the prompt again.
Attendees: input username of attendees seperated by commas and an optional number of spaces 

Once you have an event created, and/or are invited to one (**you can add yourself as an attendee!**), continue below to interact with your events/invitations

### Event interactions: 
/schedules: displays events you've created and events you're invited to (aka "attending"). Click on the event title to edit details, such as add/remove dates and attendees or delete the event altogether. On the right side are invitations that you can similarly open by clicking on the title and checking each date you're able to attend. 

/home: displays your upcoming rehearsals in chronological order (dates in your invitations that you responded yes to).
 


