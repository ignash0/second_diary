const express = require('express'),
  action = require('./actionServer'),
  app = express(),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

app.get('/registration', (req, res) => {
  res.sendFile(__dirname + '/public/registration.html')
});

app.get('/user/:id', (req, res) => {
  action.userPage(req, res);
});

 app.get('/add-group', (req, res) => {
  res.sendFile(__dirname + '/public/add-groupe.html')
 });

app.get('/group/:id', (req, res) => {
  action.groupPage(req, res);
});

app.get('/journal/:id', (req, res) => {
  action.journalPage(req, res);
});
app.get('/diary/:id', (req, res) => {
  action.diary(req, res);
});

app.get('/logout', function(req, res){
  res.cookie('dataUser', '', {expires: new Date(0)});
  res.redirect('/');
});
 app.get('/add-teacher', (req, res) => {
  res.sendFile(__dirname + '/public/add-teacher.html')
 })

 app.get('/add-subject', (req, res) => {
   action.addSubject(req, res);
 })

 app.get('/timetable', (req, res) => {
  action.timetablePage(req, res);
})
app.post('/lessons', (req, res) => {
  action.addLesson(req, res);
})
app.post('/registration', function (req, res) {
  action.registration(req, res);  
});

app.post('/login', function (req,res) {
  action.login(req, res);
});

app.post('/user', (req, res) => {
  action.resUser(req, res)
});

app.post('/group', (req, res) => {
  action.addGroup(req, res);
});

app.post('/teacher', (req, res) => {
  action.addTeacher(req, res)
})


app.listen(port);
// app.listen(port, ip);
console.log('Server running on ', ip, port)
