# Rest-api
**Technical exercise to design and build a simple REST API**

This repository contains a technical demo for a given task of:

**Technology requirements**
- Build simple JSON REST API
- Use Ruby, NodeJS or PHP (frameworks allowed)
- Use some persisten database (SQLite allowed)
- Work on user model with username, email and password attributes
- Provide endpoints for reading, creating and deleting users
- Require some form ot authentication for user deletion
- Provide some form of password hasing/security
- Provide some form of documentation (either in code comments, or a README)

This repository contains the complete solution that was build keeping the simplicity requirement as main priority. It does not aim to be-all-end-all solution for this problem.

# Requirements
To deploy and test this application one needs a system with the following software installed:
- Docker
- Curl

The aplication itself requires following software installed (or dockerized):
- NodeJS
	- Express library for NodeJS
	- Express-validator library for NodeJS
	- Body-parser library for NodeJS
	- Bcrypt library for NodeJS
- SQLite 3

# Deployment
Clone the repository into proper location:

```sh
$ git clone https://github.com/magdalenajadach/rest-api.git
```

Build the Docker image with the application code and required software installed: 

```sh
$ cd ~/rest-api
$ docker build -t api .
```

Run the application in Docker container with localhost port 8000 forwarded to container port 8000. Your output when running should look similar to:

```sh
$ docker run -p 8000:8000 api
Listening on port 8000
```

That's it! The application should now be running and you should be able to access it via http://localhost:8000/api/v1/users url.

# Usage and testing

You can use the API just as you would use any other API, that is by writing some code talking to it, using web browser or by using commandline CURL tool. Examples below are for the CURL.

### List all users

```sh
$ curl "localhost:8000/api/v1/users"
```

### List single particular user ('strawberry' is a username in our case)

```sh
$ curl "localhost:8000/api/v1/users/strawberry"
```

### Add new user

```sh
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"strawberry","email": "strawberry@pi.co.uk", "password":"a-very-strong-password"}' http://localhost:8000/api/v1/users
```

### Delete user
```sh
$ curl -H "Content-Type: application/json" -X DELETE  http://localhost:8000/api/v1/users/strawberry --user "root:iloveberries"
```

### Test validations
The API is using few simple validations of user provided data, so feel free and try to use it with some crazy/broken requests that should not be accepted (missing username, email, too short passwords and so on) :)

```sh
$ curl -H "Content-Type: application/json"  -X DELETE  http://localhost:8000/api/v1/users/strawberry
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"strawberry", "password":"a-very-strong-password"}' http://localhost:8000/api/v1/users
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"strawberry","email": "strawberry@pi.co.uk", "password":"weak"}' http://localhost:8000/api/v1/users
```

# Epilogue

This is a very simple demo - it is neither complete nor polished or secure as it could be. We could (and we should!) enforce SSL connectivity for additional security, we could somehow hide/encrypt the API secret key and user, we could add more user input validation, we could add automatic unit and functional testing, but it was my first ever attempt to write an REST API from scratch, using technologies I havent used before (NodeJS, Express and so on) so I've had a lot to research to and learn to, which was fun but took some time. Enjoy and have fun breaking it :)

# Additional resources
- [NodeJs](https://nodejs.org/en/docs/)
- [NPM](https://www.npmjs.com)
- [ExpressJS](https://expressjs.com)
- [SQLite](https://sqlite.org/docs.html)
- [Curl](https://curl.haxx.se/docs/install.html)
- [Curl commandline](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58)
- [Docker docs](https://docs.docker.com/engine/reference/builder/#label)
- [Docker commandline](https://docs.docker.com/engine/reference/commandline/cli/)