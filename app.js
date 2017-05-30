var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('raspberry.db');

var util = require('util');
var express = require('express');
var app = express();

var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(expressValidator());

var apiUser = 'root';
var apiKey = 'iloveberries';

var check;

db.run("CREATE TABLE if not exists users (username TEXT, email TEXT, password TEXT)");

app.get('/api/v1/users/', function(req, res) {
  db.all("SELECT * FROM users", function(err, users) {
    return res.status(200).json({ users });
  });
})

app.get('/api/v1/users/:userName', function(req, res) {
  db.all("SELECT * from users where userName = '" + req.params.userName + "'", function(err, users){
    return res.status(200).json({ users })
  });
})

app.post('/api/v1/users/', function(req, res) {
  req.checkBody({
   'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Enter a valid email address'
      },
      errorMessage: 'Email field is mandatory'
    },
    'password': {
      notEmpty: true,
      isLength: {
        options: [{ min: 6 }],
        errorMessage: 'Password must be at least 6 characters long'
      },
      errorMessage: 'Password field is mandatory'
    },
    'username': { //
      notEmpty: true,
      isLength: {
        options: [{ min: 5}],
        errorMessage: 'Username must be at least 5 characters long' 
      },
      errorMessage: 'Username field is mandatory'
    }
  });

  if(req.validationErrors()) {
    return res.status(400).send('There have been validation errors: ' + util.inspect(req.validationErrors()));
  } else {
      var hash = bcrypt.hashSync(req.body.password, 10);
    var stmt = db.prepare("INSERT into users VALUES (?, ?, ?)", req.body.username, req.body.email, hash);
    stmt.run();
    stmt.finalize();
    return res.status(200).send({ status: 'success', message: 'User added successfully' });
  }
})

app.delete('/api/v1/users/:userName', function(req, res) {
  if (!req.headers.authorization) {
    return res.json({ status: 'error', message: 'You are not authorized to perform the requested operation' }); 
  }

  var encoded = req.headers.authorization.split(' ')[1];
  var decoded = new Buffer(encoded, 'base64').toString('utf8');

  if (decoded.split(':')[0] != apiUser || decoded.split(':')[1] != apiKey) {
    return res.json({ status: 'error', message: 'The username or password you have entered is invalid' });
  }

  var stmt = db.prepare("DELETE from users where username = '" + req.params.userName + "'")
  stmt.run();
  stmt.finalize();
  return res.status(200).send({ status: 'success', message: 'User added successfully' })
})

app.listen(8000, function() { 
  console.log('Listening on port 8000\n')
})


