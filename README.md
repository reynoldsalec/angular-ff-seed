# Angular 1.x Future Friendly Seed

This repository is a potential starting point for an Angular 1.x project that attempts to use Angular 2.x concepts
to provide a future-friendly starting point for an Angular project while 2.x is still under development.

The starting point for the code was borrowed from Rangle.io's course material. As time goes on it may diverge more
as Kalamuna's coding standards and Angular evolve. However, for now, a good introduction to the theories behind this
codebase can be found in the [course training material](https://github.com/rangle/ngcourse-next), and of course the best
introduction is taking the [Rangle.io course](http://rangle.io/javascript-training.html)!


## The Handouts

See the [handout](https://github.com/rangle/ngcourse/tree/master/handout) for
the handout. You can either view it in your browser or build it into a PDF
using the instructions in the README file in the handout directory.

## The Code

The repository also contains the codebase that we'll work on in throughout the
course. The project has a server and the client component. This repository
contains only the *client* code. The server code is available at
https://github.com/rangle/ngcourse-api/. You do **not** need the server code to
run the front end, however. Instead, you can access the API server deployed to
http://ngcourse.herokuapp.com/ and will develop the client-side code on your
own machine.

The students should start by checking out the "base" branch for their session, which has all the necessary configurations but no actual client side code. The "master" branch contains the final state of the project.

You will then need to build the front end using:

```bash
  npm install
```

The above installs npm modules and typings for the course

Once you've done that, you can access the front-end of the project, by running a simple gulp task `npm start` within the root directory of the project.

```bash
  npm start
```

Then point your browser to http://localhost:8080/

Any other static web server should do as well. 

The output of the bundle will go into *app/__build*, which can be served by any static web server.

If you see a login screen, you are all set. You can login as "alice" with
password "x", at which point you should see a list of tasks.