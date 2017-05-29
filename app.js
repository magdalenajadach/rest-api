var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('raspberry.db');

var express = require('express');
var app = express();

var bcrypt = require('bcrypt');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var apiUser = 'root';
var apiKey = 'iloveberries';

var check;

//db.serialize(function() {
  db.run("CREATE TABLE if not exists users (username TEXT, email TEXT, password TEXT)");
//})

app.get('/api/v1/users/', function(req, res) {
  console.log('landed in users\n')
  db.all("SELECT username FROM users", function(err, users) {
    return res.status(200).json({users});
  });
})

app.get('/api/v1/users/:userName', function(req, res) {
  console.log("SELECT username from users where userName = '" + req.params.userName + "'")
  db.all("SELECT * from users where userName = '" + req.params.userName + "'", function(err, users){
    return res.status(200).json({users})
  });
})

app.post('/api/v1/users/', function(req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10);
  var stmt = db.prepare("INSERT into users VALUES (?, ?, ?)", req.body.username, req.body.email, hash);
  stmt.run();
  stmt.finalize();
  return res.status(200).send('Success - user added');
})

app.delete('/api/v1/users/:userName', function(req, res) {
  console.log(req.body);
  if (!req.headers.authorization) {
    return res.json({ error: 'No credentials sent!' });
  }

  var encoded = req.headers.authorization.split(' ')[1];
  var decoded = new Buffer(encoded, 'base64').toString('utf8');

  if (decoded.split(':')[0] != apiUser || decoded.split(':')[1] != apiKey) {
    return res.json({ error: 'Wrong credentials' });
  }

  var stmt = db.prepare("DELETE from users where username = '" + req.params.userName + "'")
  stmt.run();
  stmt.finalize();
  return res.status(200).send('landed in users delete\n')
})

app.listen(8000, function() { 
  console.log('Listening on port 8000\n')
})


