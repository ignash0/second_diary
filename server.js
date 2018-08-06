var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require("client-sessions");

fs.readFile(__dirname +'/bd/user.json', function (err, data) {
if (err) {
return console.error(err);
}
date1 = JSON.parse(data);
console.log('Asynchronous read:' + date1);
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'mySession',
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK'
}));

app.post('/login', function (req,res) {
  var foundUser;

  fs.readFile(__dirname + '/bd/user.json', function (err, date) {
    var users = JSON.parse(date);
    for (var i =0; i < users.length; i++){
      var user = user[i];
      if (user.userEmail === req.body.userEmail && user.userPassword === req.body.userPassword) {
        foundUser = user;
        break
      }
    }
  });
  if (foundUser !== undefined) {
      req.session.username = `${foundUser.userName} ${foundUser.userSurname}`;
      consol.log('Login', req.session.username)
  } else {
    console.log('login failed');
    res.send('login error')
  }

})


app.post('/', function (req, res) {
  console.log('body:', req.body);

  var dateReq = req.body;
  dateReq.statue = 'admin';
  fs.readFile(__dirname + '/bd/user.json', function (err, date) {
    if (err) {
      return console.log(err)
    } else {
      var usersJson = JSON.parse(date);
      var equal = true;

      usersJson.forEach(elem => {
        if (elem.userEmail === dateReq.userEmail) {
          equal = false;
        }
      });

      if (!equal) {
        res.send('no');
      } else {

        usersJson.push(dateReq);
        var usersNew = JSON.stringify(usersJson);
        fs.writeFile(__dirname + '/bd/user.json', usersNew, 'utf8', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        res.send('yes');

      }
    }
  });
});






app.listen(8000, function () {
  console.log('Exampl app listening on port 8000!');
});;