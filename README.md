# Lehigh LearnX -- Collecting Data Over The Web

Welcome to the "Collecting Data Over The Web" lesson.  This lesson was
originally designed as a
[LearnX](https://creativeinquiry.lehigh.edu/mountaintop-programs/learnx-makex-sprintx)
activity at Lehigh University.

The purpose of this lesson is to show you how to create a website for
**securely** gathering data and files from people all over the world.  This
lesson doesn't assume that you know very much about programming, but it does
assume that you are willing to take risks and try new things.

## Why a Website

You may be thinking "why not an app?"  There are a few reasons:

- You need a lot more software on your computer to make an app
- You can't make an iOS app unless you own a Mac
- Many people don't want to install yet another app on their phone
- You could use [Apache Cordova](https://cordova.apache.org/) to turn the
  website you make in this LearnX into an app, without writing any more code, so
  it seems more valuable to learn how to make the website than to focus on
  making an app.

## Technologies We Will Use

Since we are making a website, at a minimum we will need to use standard web
technologies: HTML, CSS, and JavaScript (well, technically we are using
[TypeScript](https://www.typescriptlang.org/)).  In addition, we will be using
the following third-party libraries and services:

- [Firebase](https://firebase.google.com/) &mdash; Firebase is a Google product
  that provides data and file storage, as well as website hosting.
- [Vue.js](https://vuejs.org/) &mdash; Vue.js is a web framework that makes it
  easy to create single-page web apps.  If that doesn't make sense, just think
  "do more with less code".
- [W3.css](https://www.w3schools.com/w3css/) &mdash; W3.css is a mobile-friendly
  stylesheet for making websites that look good.

These technologies are all free and easy to learn.  They are also lightweight,
so that our final website won't take a long time to load.  But don't be fooled!
They are powerful enough to create really huge products.

## Software You Will Need

You will need to have [node.js](https://nodejs.org/) installed on your computer
in order to use this tutorial.  You will also need to install
[git](https://git-scm.com/), since we will use it to download the starter code
that we will use.

Most professional programmers use an Integrated Development Environment (IDE) to
edit their code.  For this LearnX, an IDE isn't necessary; you could edit the
files in whatever text editor you have.  If you want a more enjoyable
experience, though, you should install an IDE.  A popular and free IDE that
works well for this project is [Visual Studio
Code](https://code.visualstudio.com/).

## The Big Picture

A good way to think about software is as a collection of loosely coupled
components.  One of those components is called the user interface, or UI.  It is
responsible for showing data to the user, and getting commands from the user.
Another important component is the "back end".  It is responsible for storing
data, and preventing unauthorized access to that data.

You may be thinking "why do we need two (or more) parts?"  To answer that
question, I encourage you to think about what would happen if the data you put
into your favorite social network was stored on the device you used to enter
that data.  If you entered something from your phone, would all of your contacts
only see it when your phone was on?  What if you got a new phone?  What if you
had to connect from your laptop, because your phone was out of battery?  There's
a value that comes from the data being stored somewhere that is always
accessible and always secure (i.e., the "cloud").

Secure back ends are hard to write.  They are a natural target for hackers, so
their security needs to be rock-solid.  And they should be written in a way that
can *scale*, so that when your website or app becomes popular, and millions of
people start using it, you don't have to re-write it to handle that level of
use.  

Firebase is a secure and scalable back end.  It makes it much easier to create a
website or app.  However, we lose flexibility.  When we write our own back end,
we can make it however we want.  When we use Firebase, we have to do things
according to Firebase's rules.  Especially when it comes to security, that can
be a bit tricky, as you will see.  However, the benefits outweigh the costs,
especially if you are either (a) in a hurry, or (b) not an experienced
programmer.

Hopefully you agree that using the technologies I have chosen for this tutorial
will make it possible to create an interactive, secure, scalable website in very
little time.  But you might also be thinking "yeah, but when will I ever need a
website that can do *that*".  You won't.  But this website will do enough that
you will have a starting point for whatever it is that you want to do.  You may
need to take some things out.  You may need to copy and paste to have multiple
versions of other things.  Maybe you will want to change the amount and
structure of the data that is stored.  Perhaps you will want to change how the
data is displayed.  That's how programmers operate: they start by getting
components to exchange data in the right ways.  Then they swap out one component
for another, or modify a component, until the collection of components works
together to do exactly what was needed.  Important points are that (i) the whole
program always *works*, even if it doesn't do the right thing, and (ii) every
change helps move the program closer to a state in which it does the right
thing.

Once you have finished this LearnX, I encourage you to do two things:

- Think about your favorite app or website.  Can you express its main behaviors
  in the context of the website we made?
- Think about an app that you would like to have.  Can you think about how to
  start making changes to the website we made, in order to start making it look
  more and more like the app you want?

## Getting Started

The first thing you will need to do is get a copy of the code.  The best way to
do this is from a terminal, by navigating to the folder where you want to work,
and then typing `git clone
https://github.com/mfs409/learnx-interactive-website-vue-firebase.git`.  This
will download a folder called `learnx-interactive-website-vue-firebase`, with
the following folder layout:

- / &mdash; Configuration files go here
- /src &mdash; Source code for the website goes here
- /src/components/ &mdash; Source code for the components of the website go here

Inside of `/src`, you will see the following files:

- appstate.ts &mdash; The main code for the website
- main.ts &mdash; Code for starting up the website
- router.ts &mdash; Code for managing navigation among components

Inside of `/src/components`, you will see the following files:

- App.vue &mdash; The main shell of the program
- CreatePrivate.vue &mdash; A component for creating private posts
- CreatePublic.vue &mdash; A component for creating public posts
- Error.vue &mdash; A component for showing error messages
- Feedback.vue &mdash; A component for managing feedback to the website owner
- Info.vue &mdash; A component for showing informational messages
- LogIn.vue &mdash; A component for logging in
- Menu.vue &mdash; A menu component
- ReadAllPrivate.vue &mdash; A component for showing all of a user's private
  posts
- ReadAllPublic.vue &mdash; A component for showing all the public posts
- ReadOnePrivate.vue &mdash; A component for showing a single private post
- ReadOnePublic.vue &mdash; A component for showing a single public post

In the root folder (`/`), you will see the following files:

- .gitignore &mdash; A configuration file for git
- env.d.ts &mdash A configuration file for vue
- firebase.json &mdash; Configuration for Firebase
- firestore.indexes.json &mdash; Configuration for the Firebase database
- firestore.rules &mdash; Security rules for the Firebase database
- index.html &mdash; The main web page for our website
- package-lock.json &mdash; Configuration for the libraries used by our website
- package.json &mdash; Configuration for the libraries used by our website
- README.md &mdash; This file
- storage.rules &mdash; Security rules for the Firebase file storage
- tsconfig.json &mdash; Configuration rules for the TypeScript compiler
- vite.config.json &mdash; Configuration for building and running our web app

For the most part, you can ignore everything in the root folder.

## Setting Up Firebase

Before we can use the code, we will need to create a Firebase project.  Go to
the [firebase console](https://console.firebase.google.com/) and click on "Add
project".  You will need to answer four questions:

- Project name: mine is `learnx-interactive-website-vue-firebase`.  You'll need
  something else.
- Default Google Analytics: yes
- Terms: yes
- Click "Create Project"

Once the project is created, we need to set up the Firebase features that we
will use:

- Authentication: Click on "Develop" on the left side of the screen.  Choose
  Authentication.  Pick "Set up Sign-In Method".  Click on "Google".  Click the
  "Enable" slider.  Select your email as the "Project support email".  Click
  "Save".
- Database: Click "Database" on the left side of the screen, and click "Create
  Database".  Pick "Start in test mode".  Click "Enable".  Note: you should use
  "Cloud Firestore", not "Realtime Database"
- Storage: Click "Storage" on the left side of the screen, and then click "Get
  Started".  Then click "Got it".
- Hosting: Click "Hosting" on the left, then click "Get Started", then
  "Continue", then "Finish".

Lastly, we need to get our Firebase configuration information.  On the left,
there should be a gear to the right of "Project Overview".  Click it and choose
"Project settings".  In the "General" tab, there will be a section that says
"Your apps".  Click "Add Firebase to your web app".  You will see a pop-up that
contains some code.  Copy from `{` through `};`.  Then in your `src/` folder,
create a file called `fbconfig.ts`.  Type `export const config =` and then paste
the code that you copied from the web.

## Starting the Code

Normally, when you download web code from GitHub, you install it by going into
the folder where the code is and typing `npm install`.  Let's do that here. Open
a terminal, navigate to the folder where this file is (typically by typing
something like `cd learnx-interactive-website-vue-firebase`), and then type `npm
install`.  All of the libraries needed by our program will get installed into a
folder called `node_modules`.

Actually, not quite.  There is still one library that we need.  Edit your
`package.json` file and find this line:

```json
"npm-run-all": "^4.1.5",
```

Put this line right after it:

```json
"firebase-tools": "^11.20.0",
```

Then go back to your terminal and type `npm install` again.  This will download
**a lot** more code, and it will also probably tell you about some security
warnings.  "firebase-tools" will only run on your computer, so these security
issues can probably be ignored.  But since they are real security warnings, I
didn't want them baked into the default code for this LearnX.

Now type `npm run dev`.  You should see something like this:

```bash
 VITE v4.0.4  ready in 341 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

At this point, open your web browser and visit
[http://localhost:5173](http://localhost:5173).  You will see a message saying
that you need to log in.  You can click "Log In", and then authenticate using
your Google account.  The whole website is up and running on your computer.
Every time you edit the code, the site will auto-refresh with the latest
changes.

## Features of the Code

As mentioned earlier, the point of our code is **not** to be a perfect,
ready-to-run website for your specific need.  It is supposed to show you how to
do many of the sorts of things you might want to do.  There are four important
features:

- Users can post data (a subject, a message, and an image file) that can be seen
  by all other users, but only edited or deleted by the user who created the
  posting.
- Users can post private data (a subject, a message, and an image file) that can
  only be seen, edited, and deleted by the user who created the posting.
- A feedback mechanism, so that users can post messages that can only be seen by
  the site administrator.
- A site administrator mechanism, so that users who are also administrators are
  able to edit and delete **all public and private** messages.  Note that due to
  a limitation of how Firebase lets us manage security, administrators cannot
  view private images through the website.

There are three different *types* of files that let us do this.  `.vue` files
describe a visual component that is part of the website.  They have some HTML to
describe the shape of the component, and some code that describes how the
component behaves.  `.ts` files contain code that is important to the whole
website, not just to a single component.  They also contain code for interacting
with Firebase to log users in and out, save and retrieve data, and save and
retrieve files.  Finally, `.rules` files establish the permissions that Firebase
uses to protect data and files.

## Deploying to the Web

Right now, your website can only be seen from your own computer, using a
"localhost" address.  It would be nice, of course, to let other people use your
site.  We can do this through Firebase hosting.  From a terminal, navigate to
your `learnx-interactive-website-vue-firebase` folder, and log into Firebase by
typing `npx firebase login`.  This will open up a web browser so that you can
authenticate with Google.  Once you have authenticated, you should see a message
in the terminal such as `+  Success! logged in as abc123@gmail.com`. You can
type `npx firebase projects:list` to see all of your Firebase projects, and `npx
firebase use your-project-name` to select a specific project.  When you are done
working on your project, you can type `npx firebase logout` to log out.

When you are logged in and your project is selected, you could type `npx
firebase deploy` to launch your code on the web.  However, first we have to
produce a version of the code that is appropriate for the web. To do that,  type
`npm run build`.  When the command completes, you will have a folder called
`dist`, with a ready-to-deploy version of the web app.  Then type `npx firebase
deploy`.  see a message like `+ Deploy complete!`, followed by a "Hosting URL",
which is the world-readable link to your website.  In addition to putting your
code online, the command will also set permissions, so that your data is secure.

## Learning by Example: Creating a Public Posting

Rather than abstractly describe how all of the files of our website interact,
let's walk through a very specific scenario.  Start by logging out of your
website (if you are logged in).  You should see the red "Log In" screen.  Here's
why:

1. When the page was loaded, `index.html` was displayed as a web page.
2. `index.html` says to include the file `bundle.js`
3. `bundle.js` is a single file that contains all of our .vue and .ts files
4. `bundle.js` starts with the code in `main.ts`, which says to create a router
   object from `router.ts` and a state object from `appstate.ts`, and then to
   find the HTML DIV tag with an id of `app`, and to put our `App.vue` into it.
5. The `App.vue` file will put a `Menu.vue`, `Error.vue`, and `Info.vue` into
   the web page.  It will also put a "router-view" into the page, as a
   placeholder for other components that the router decides should go into the
   page.
6. The appstate object will load the configuration from `fbconfig.ts`, connect
   to firebase, and then check if the user is logged in.  It does this via its
   `initialCheckLogin` function, which will decide that the user is not logged
   in, and thus it will tell the router to switch to the LogIn route.
7. The router will put the `LogIn.vue` component into the page.
8. The `LogIn.vue` will just display some HTML, and won't do anything else until
   the user clicks "Log In".

That's a lot of interaction between components.  But the good news is, that's
how every Firebase/Vue app will work, so you don't ever need to change any of
it!

Next, let's look at what happens when you click "Log In":

- The `login` code in `LogIn.vue` will run.  It will call the `logIn` code in
  `appstate.ts`.
- The `logIn` code in `appstate.ts` will redirect the browser to Google.
- When Google redirects back to our webpage, *the whole process from up above
  will happen again*.  In fact, every time we refresh the page, that whole
  process will happen again.  But there is an important difference.  In Step #6,
  `initialCheckLogin` will see that the user is now logged in, and so it will
  save the user's name and other information.  Then it will check if the address
  bar is currently the page for logging in.  If so, it will tell the router to
  go to the page for showing all public messages.
- The router will remove `LogIn.vue` from the "router-view", and it will put
  `ReadAllPublic.vue` into the "router-view".
- The `Menu.vue` will notice that there is a logged in user, so it will un-hide
  itself.
- `ReadAllPublic.vue` will ask `appstate.ts` to call `readallPublicDoc`.  That
  will cause Firebase to get all of the data in the `public` folder of Cloud
  Firestore for our project, and return it.  When `readallPublicDoc` receives
  the data, it will automatically (courtesy of how we are using Vue.js) populate
  its list (the UL tag) with one row per object returned from Firebase.

Of course, right now there isn't any data, so the page is a bit bland.  Let's
add data by clicking on the "Create Public" button.  When we click the button:

- The `Menu.vue` component calls its `createPublic` function, which causes the
  router to load the `CreatePublic.vue` component into `App.vue`'s
  "router-view".
- Since `Menu.vue` doesn't need to do any initialization, that's all that
  happens.  There's no data fetching like in `ReadAllPublic.vue`.

So far, so good.  Notice that `CreatePublic.vue` has a `reactive` method, which
creates a few variables that are used by Vue.js to keep track of the input boxes
within the component.  If all we cared about was a subject and message, then
`CreatePublic.vue` would be pretty simple.  But we also have file uploads, and
they are tricky.  Let's see what happens when a user clicks the "Create It"
button:

- `createMessage` gets called.  It checks that the subject and message aren't
  blank, and the file box has a file.
- `createMessage` needs a unique name for the file.  To do this, it calls
  `appstate.ts`'s `getFileId` code, which *inserts* a new, empty sub document into
  the `files` document of Cloud Firestore.  The document name will be
  `/files/userId/ids/XXX`, where `userId` is the Id of the logged-in user, and
  `XXX` is guaranteed by Firebase to be unique.  
- `createMessage` calls `upload`, and passes that `XXX` value.
- `upload` uses `appstate.ts`'s `uploadPublicImage` function to send the file to
  Firebase Storage, and asks that it be saved as `/images/XXX`.
- `upload` is actually a bit fancy: it watches as the file is uploaded, and
  prints the upload progress in the component.
- Once the file upload is complete, `upload` calls `postMessage`.
- `postMessage` creates a new document as `/public/ZZZ`, where `ZZZ` is a unique
  value.  The document consists of the userId of the person who created it, the
  time it was created, the subject and message from the component's fields, and
  the unique name of the file (the `XXX` value from above).

If you return to the "Pubic" listing (i.e., the `ReadAllPublic.vue` component),
you will see your message.  If you click it, you will be taken to the
`ReadOnePublic.vue` component.  It will let you edit the subject and message of
your own public posts, and view everyone else's.  It will also let you delete
your own public posts.  At this point, you should be able to figure out the flow
among `ReadAllPublic.vue`, `router.ts`, `ReadOnePublic.vue`, and `appstate.ts`,
so that you can explain how viewing and editing an individual post works.
(Note: there's one tricky part: the Id of the post (`ZZZ above`) is part of the
route, and is passed to `ReadOnePublic.vue` as `useRoute().params.id`.)

Before moving on, note that it is a bad idea to rely on your UI (i.e., the code
in your components) to enforce security.  If we want data to be protected from
unauthorized reading, writing, and updating, we must do it inside of Firebase,
because otherwise a malicious user could circumvent our app, access Firebase
directly, and make a mess.  Our `firestore.rules` file is responsible for saying
how to protect the data in Cloud Firestore, and `storage.rules` says how to
protect the data in Firebase Storage.  Before going further into details about
security, let's make things just a tad more complete.

## More Features of the Firebase Console

We already saw that the [Firebase Console](https://console.firebase.google.com/)
lets you set up a new Firebase project.  It also lets you see (and edit) all the
data created by your website, all the files stored to Firebase by your project,
and all the users who have ever logged into your project.

To begin, explore the Database and Storage options on the left side of the
console.  You should be able to find the data that you created, and the file you
uploaded.

Next, go to Authentication.  You should see your account.  We're going to give
your account administrative permissions within the website.  The first step is
to copy your "User UID".

Once you have your UID, go back to the Database tab, and create a collection
called `admin`.  Then create a document in `admin` whose name is the UID you
copied.  The document should be empty.

At this point, you should either (a) share your public URL with a friend, or (b)
use another gmail account of yours to access your website.  When you do, notice
that you can create messages with that new account, edit your messages, and
delete your messages, but you can't edit or delete the messages you made with
your first account.  However, if your second user creates a message, your first
user, who is admin, **can** edit and delete that message.  You could even create
other roles, besides admin, and make it possible to manage them *inside your
website*.  But we're not going to go that far :)

## Private Messages

Sometimes it is useful to let users put private information into the website,
knowing that only they can see it (well, and the administrator).  Our "Private"
section of the website is for this purpose.  This could be useful if, for
example, you wanted to collect complex confidential information from people:
they might need to save it, edit it, save it again, and so on, but without ever
letting others see it.  (Remember: if you are collecting information for
research, you probably need IRB approval.)

To do this, we will use a slightly longer scheme for saving private messages.
Each message will be saved to the `private` collection as
`private/userId/docs/XXX`, where XXX is a unique identifier for the document.
Otherwise, the representation in Cloud Firestore will be the same as for public
messages.  As for uploaded files, they will be saved as `private/userId/ZZZ`,
where `ZZZ` is a unique name for the file.

You should be able to figure out how `ReadOnePrivate.vue`,`ReadAllPrivate.vue`,
`CreatePrivate.vue`, `Menu.vue`, `appstate.ts`, and `router.ts` work together to
support private messages.  When you do, you'll notice that the code is almost
identical for public and private messages.  I copied and pasted :(.

In general, it's bad to copy and paste code within the same project... it means
you're duplicating effort, instead of making your code more general.  I did it
in this case because I wanted the code to be easy to understand.  But in real
code, you shouldn't copy and paste.  The first reason is that, when you find
bugs, you will have to remember all the copies of the bug.  That's hard.  The
second is that it becomes very easy to have hard-to-find bugs related to subtle
differences in the constant strings (things between quotation marks) used by the
code.  For example, when copying and pasting, I almost missed the fact that I
used "/public" to save a file that should have gone to "/private".

One of the best ways to avoid these errors with constants is to turn them into
variables.  For example, in `appstate.ts`, you will see that all of the document
names are in `docs`, and all the storage folder names are in `folders`.  This
makes it much easier to avoid bugs.

One last thing to notice: if your "second" user creates a private message, and
the first user, who is an administrator, copies the address bar for that
message, the first user can read, update, and delete the private message.  But
the first user cannot see the private message's associate image.  That's a
limitation of Firebase.  And now it's time to explore Firebase security rules.

## Security Rules

Firebase secures data at the time it is requested.  That is, when your website
interacts with Firebase to get data from Cloud Firestore, or files from or
Firebase Storage, Firebase will look at *who* is doing the request, *what* the
requester wants, and *why*.  So, for example, it can say "user 1 cannot access
object B at all" or "user 2 can access object C, but not to delete it".

When using Firebase, we need to think about how to structure our data so that it
is as easy as possible to enforce security.  There's a tradeoff between making
it easy to use data, and making it easy to secure data.  Let's look at three
examples of how we secure data in Cloud Firestore:

### Cloud Firestore Security via Fields

Let's start with the `public` collection.  This is a collection where we want
the following permissions:

1. Any logged-in user can read all of the documents
2. Any logged-in user can create a document
3. Only the creator of a document can delete or update a document

We also want to be able to read all of the documents without doing too much
work.  To make reading easy, we would like a flat structure, where `public` has
all of the documents in it, rather than in sub-documents.  That is, each
document should be saved as `public/XXX`, where `XXX` is a unique document Id.

To achieve the first and second requirements, we could use the following rule:

```[lang=javascript]
match /public/{document=**} {
  allow read, create: if request.auth.uid != null;
}
```

With that rule, a user must be logged in, but once the user is logged in,
reading and creating is allowed.  Note that any permission that isn't specified
isn't possible, so nobody can edit or delete documents yet.

To finish up, we could also grant update and delete permissions to the current
user *only if* the current user's userId is the same as the `creator` field
inside of the document being updated:

```[lang=javascript]
allow update, delete: if resource.data.creator == request.auth.uid;
```

### Cloud Firestore Security via UserId in Path

Next, let's look at the private collection.  Here, the rules are different.  We
want more security, and less ease-of-use.  Specifically, we never want to let
one person see *everyone's* private data at once; instead, we want to only allow
a person to see their own data.

The first thing we will do is structure the data differently.  In the `private`
collection, each user will have their own document, whose name matches their
userId.  All of the user's private documents will go *inside* that document.
With such a structure, we can protect everything for the user by matching part
of a file name.  Note that "write" is a shorthand for "create, update, delete":

```[lang=javascript]
match /private/{userId}/{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```

### Cloud Firestore Security via Extra Queries

In addition to the above rules, we also would like to allow administrators to
read and write everything in the public collection.  But how do we know that the
user is an administrator?  Recall that we decided to make a separate collection
called `admin`, and to represent each administrator with an empty document in
that collection, whose name was identical to the administrator's userId.  Now we
can see why.  Given that structure, we can give an administrator access to a
resource like this:

```[lang=javascript]
allow read, write: if exists(/databases/$(database)/documents/admin/$(request.auth.uid));
```

That rule says "look into the `admin` table and see if the current user's Id is
a document in it.  If so, grant read and write permission.

The above rule is *slower*, because it requires a second lookup in the Cloud
Firestore, so we should use rules of that style as infrequently as possible.
Fortunately, this rule shouldn't run often: the other rules will usually grant
access when appropriate, and our website doesn't let users attempt the sorts of
accesses that would require falling back to this rule.  It's only when either
(a) an administrator is using the website, or (b) someone is trying to do
something malicious, that we will fall back to this more expensive protection.

### Firebase Storage Security

It would be wonderful if all of the above rules translated directly to Firebase
Storage.  Unfortunately, they don't: Firebase Storage does not allow security
based on file contents, or based on extra queries.  We can only get security via
the "userId in path" technique.  If you look at `storage.rules`, you will see
examples.  In particular, you will see that any logged in user can read any
public file, but even administrators cannot see private files via the website.

Note that we could have a slightly less secure system via "security through
obscurity", in which the private files were only private because their names are
unguessable.  If we had that, the administrator could see the files through the
web interface.  Depending on how your app trades administrator convenience
versus user data security, either choice could be fine.

## Remaining Features

There are two remaining features of our website that merit discussion.  The
first is "pop-up" messages.  In `App.vue`, we included two components,
`Info.vue` and `Error.vue`.  Both are hidden by default.  Whenever we want to
show an informational message or error message, we can un-hide one of these, and
set its message field.  As an example, consider the "Info" button on the menu.
When it is clicked:

- `info` in `Menu.vue` is called.  It calls `infoShow` in `appstate.ts`, to set
  the contents of the message.
- `infoShow` also sets `info.show` to `true`.
- `Info.vue` notices that `info.show` changed, so it un-hides itself.

When the "&times;" button on `Info.vue` is pressed:

- `infoClear` in `appstate.ts` is called.  It sets `info.show` to `false`.
- `Info.vue` notices that `info.show` changed, so it hides itself.

The second feature is a "Feedback" mechanism.  This is designed so that an
administrator who clicks "Feedback" sees all of the feedback, but a user who
clicks it gets a form for entering a new feedback message.  I wanted to be lazy
and have one component to do both of these things.  To get it to work, the
`Feedback.vue` component takes a parameter that indicates whether the mode is
"view" or "create".  When an administrator clicks the `Menu.vue` Feedback
button, the mode will be "view".  Otherwise, the mode is "create".

## Conclusion and Next Steps (Plus more Security Advice)

At this point, we've done a whirlwind tour of all of the code.  As you read
individual files, you will see lots of comments to help you understand what is
happening, and why.  You should use the code as a starting point for learning
more about Vue.js and Firebase.  You can also make modifications to the code, to
transform it from a demonstration into a website that serves a specific purpose.

There are two important things to keep in mind as you move forward:

- When you are done developing, and ready to make your website "live", there is
  one additional security step you should take.  In the Firebase web console,
  select "Authentication", pick "Settings", and delete "localhost" from
  "Authorized domains".  This will make it harder for a user to hack your data.

- If you are going to store your code online (e.g., in Github), make sure that
  you do not check in any private/secret data.  For example, you should not put
  your `fbconfig.ts` file online.  There is a file called `.gitignore`, which
  should help to prevent certain files from going online.  Make sure you use it
  correctly!

Good luck, and have fun developing interactive websites.  If you find any errors
in this tutorial, or if you have suggestions for extending it (for example, by
adding instructions for using Apache Cordova to turn the website into an app),
please contact me at mfs409@lehigh.edu.
