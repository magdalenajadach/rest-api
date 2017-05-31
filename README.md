# Rest-api
## Technical exercise to design and build a REST API

This repository contains a technical demo for a given task of:

**Technology requirements**
- Node (can make use of of a web framework such Express)
- Flat file database SQLite

**User model with following attributes**
- username
- email
- password

**API which implements**
- creation
- reading
- deletion

**Hashing schema**
- passwords should be stored securely using a hashing schema

**Secretkey**
- secretkey should be provided for deletion of a user

This repository contains the complete solution that was build keeping the simplicity requirement as main priority. It does not aim to be-all-end-all solution for this problem.

# Requirements
To deploy and test this solution one needs a machine with the following software installed (instructions for Mac users):
- Docker for Mac 17.3
- Mac must be a 2010 or newer model, with Intel’s hardware support for memory management unit (MMU) virtualization
- OS X El Capitan 10.11
- At least 4GB of RAM
- VirtualBox prior to version 4.3.30 must NOT be installed (it is incompatible with Docker for Mac). If you have a newer version of VirtualBox installed, it’s fine
- Curl

# Usage
**Clone the repository into proper location**
```git clone https://github.com/magdalenajadach/rest-api.git```
**Launch the the Docker**
```cd ~/rest-api```
```docker build -t api . ```
```docker run -p 8000:8000 api```

**Commands to perform different operations**
- List all users 
```curl "localhost:8000/api/v1/users"```

- List single user 
```curl "localhost:8000/api/v1/users/{username}"```

- Add new user
```curl -H "Content-Type: application/json" -X POST -d '{"username":"berry","email": "berry@pi.co.uk", "password":"strong-password"}' http://localhost:8000/api/v1/users```

- Delete user
```curl -H "Content-Type: application/json"  -X DELETE  http://localhost:8000/api/v1/users/{username} --user "root:iloveberries"```

**Basic Docker commands to play with containers**
- List all containers
```docker ps```
- Stop the container
```docker stop [container id]
- Remove container
```docker rm```
- Docker help
```docker --help```

# Epilogue

# Additional resources
[NodeJs](https://nodejs.org/en/docs/)
[NPM](https://www.npmjs.com)
[ExpressJS](https://expressjs.com)
[SQLite](https://sqlite.org/docs.html)
[Curl](https://curl.haxx.se/docs/install.html)
[Curl commandline](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58)
[Docker docs](https://docs.docker.com/engine/reference/builder/#label)
[Docker commandline](https://docs.docker.com/engine/reference/commandline/cli/)