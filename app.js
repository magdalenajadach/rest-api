var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('raspberry.db');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


var check;
db.run("CREATE TABLE if not exists users_main (username TEXT, email TEXT, password TEXT)");

app.get('/api/v1/users/', function(req, res) {
  console.log('landed in users\n')
  db.all("SELECT * FROM users_main", function(err, users) {
      res.json({users});
  });
})

app.get('/api/v1/users/:userName', function(req, res) {
  console.log("SELECT * from users_main where userName = '" + req.params.userName + "'")
  db.all("SELECT * from users_main where userName = '" + req.params.userName + "'", function(err, users){
    res.json({users})
  });
  res.send('Single user selected\n')
})

app.post('/api/v1/users/', function(req, res) {
  var stmt = db.prepare("INSERT into users_main VALUES (?, ?, ?)", req.body.username, req.body.email, req.body.password);
  stmt.run();
  stmt.finalize();
  res.send('User added\n')
})

app.delete('/api/v1/users/', function(req, res) {
  console.log(req.body);
  var stmt = db.prepare("DELETE from users_main where username = ?", req.body.username);
  stmt.run();
  stmt.finalize();
  res.send('landed in users delete\n')
})

app.listen(8000, function() { 
  console.log('Listening on port 8000\n')
})

