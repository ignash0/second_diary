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
app.use(express.cookieParser()); 
app.use(bodyParser.json());

app.use(session({
  cookieName: 'mySession',
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK'
}));

app.post('/login', function (req,res) {
  
  fs.readFile(__dirname + '/bd/user.json', function (err, date) {
    if (err) {
      return console.log(err)
    } else {
      var foundUser,
      users;
  
      users = JSON.parse(date);
      for (var i =0; i < users.length; i++){
        var user = users[i];
        console.log(req.body);
        if (user.userEmail === req.body.userEmail && user.userPassword === req.body.userPassword) {
          foundUser = user;
          break
        }
      }
      if (foundUser !== undefined) {
        res.cookie('dataUser', {email: foundUser.userEmail,
          name: foundUser.userName,
          surname: foundUser.userSurname,
          statue: foundUser.statue,
        });
        res.send('yes');
    
      } else {
        console.log('login failed');
        res.send('no')
      }
    }
  });

});

app.get('/logout', function (req,res){
  res.cookie('dataUser', '', { expires: -1 })
});

app.post('/', function (req, res) {
  console.log('body:', req.body);

  var dateReq = req.body;
  dateReq.statue = 'curator';
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






app.listen(8001, function () {
  console.log('Exampl app listening on port 8001!');
});;