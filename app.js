// Sample NodeJS/Express API application by Magdalena Jadach

// Set up variables
let util = require('util');

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('raspberry.db');

let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(expressValidator());

let bcrypt = require('bcrypt');
let apiUser = 'root';
let apiKey = 'iloveberries';

let check;

// Functions
function getCounts(username, callback) {
  db.all('SELECT * FROM users WHERE username = ?', username, (err, users) => { 
    if(err){
      callback(err)
    }
    callback(null, users.length)
  })
}

// Create the DB structures
db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, email TEXT, password TEXT)");


// List all users endpoint
app.get('/api/v1/users/', function(req, res) {
  db.all("SELECT * FROM users", function(err, users) {
    return res.status(200).json({ status: 'success', users });
  });
})


// List particular user endpoint
app.get('/api/v1/users/:username', function(req, res) {
  db.all("SELECT * from users WHERE username = ? LIMIT 1", req.params.username, function(err, users){
    return res.status(200).json({ status: 'success', users })
  });
})


// Create user endpoint
app.post('/api/v1/users/', function(req, res) {
  // Check if all required fields are provided in POST request
  req.checkBody({
   'email': {
      isEmail: {},
      errorMessage: 'Email must be a valid email'
    },
    'password': {
      isLength: {
        options: [{ min: 10 }],
      },
      errorMessage: 'Password must be at least 10 characters long'
    },
    'username': {
      isLength: {
        options: [{ min: 3}],
      },
      errorMessage: 'Username must be at least 3 characters long'
    }
  });

  // Check validation results
  if(req.validationErrors()) {
    return res.status(400).send({ 'status': 'error', 'message': 'Request validation errors: ' + util.inspect(req.validationErrors())});
  }

  // Check if provided username exists in the database and stop it it does
  getCounts(req.body.username, function(err, count) {
    if(count > 0){
      return res.status(200).send({ status: 'error', message: 'User already exists' });
    }
    // If there are no errors, proceed adding user and generate password hash
    let hash = bcrypt.hashSync(req.body.password, 10);
    let stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)", req.body.username, req.body.email, hash);
    stmt.run();
    stmt.finalize();
    return res.status(200).send({ status: 'success', message: 'User added successfully' });
  })
})


// Delete user endpoint
app.delete('/api/v1/users/:username', function(req, res) {
  // Check if authorization header is present in DELETE request
  if (!req.headers.authorization) {
    return res.json({ status: 'error', message: 'Authorization credentials required' }); 
  }
  // If the header is present, extract the username and api key from it
  let encoded = req.headers.authorization.split(' ')[1];
  let decoded = new Buffer(encoded, 'base64').toString('utf8');
  // Compare the user and password to our apiUser and apiKey
  if (decoded.split(':')[0] != apiUser || decoded.split(':')[1] != apiKey) {
    return res.json({ status: 'error', message: 'The username or password is invalid' });
  }
  // If authorization is successfull, proceed deleting the user
  let stmt = db.prepare("DELETE FROM users WHERE username = ?", req.params.username)
  stmt.run();
  stmt.finalize();
  return res.status(200).send({ status: 'success', message: 'User removed successfully' })
})


// Launch application service
app.listen(8000, function() { 
  console.log('Listening on port 8000\n')
})
