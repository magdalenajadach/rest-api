var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('raspberry.db');
var check;
db.serialize(function() {

  db.run("CREATE TABLE if not exists user_main (username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)");
  var stmt = db.prepare("INSERT INTO user_main VALUES (?, ?, ?)");
  for (var i = 0; i < 5; i++) {
      stmt.run("User " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, username FROM user_main", function(err, row) {
      console.log(row.id + ": " + row.username);
  });

});

db.close();