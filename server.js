const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');


app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.post('/registration', function (req, res) {
  console.log('body:', req.body);

  const dateReq = req.body,
    idUser = Math.random().toString(36).substr(2, 9);
  dateReq.statue = 'curator';
  dateReq.id = idUser;

  fs.readFile(__dirname + '/bd/user.json', function (err, data) {
    if (err) {
      return console.log(err)
    } else {
      const usersData = JSON.parse(data);
      let equal = true;

      usersData.forEach(elem => {
        if (elem.userEmail === dateReq.userEmail) {
          equal = false;
        }
      });

      if (!equal) {
        res.send('no');
      } else {

        usersData.push(dateReq);
        var usersNew = JSON.stringify(usersData);
        fs.writeFile(__dirname + '/bd/user.json', usersNew, 'utf8', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        res.send('yes');

      }
    }
  });
});

app.post('/login', function (req,res) {
  
  fs.readFile(__dirname + '/bd/user.json', function (err, date) {
    if (err) {
      return console.log(err)
    } else {
      let foundUser,
        users;
  
      users = JSON.parse(date);
      for (let i =0; i < users.length; i++){
        const user = users[i];
        console.log(req.body);
        if (user.userEmail === req.body.userEmail && user.userPassword === req.body.userPassword) {
          foundUser = user;
          break
        }
      }
      if (foundUser !== undefined) {
        res.cookie('dataUser', {
          id: foundUser.id,
          name: foundUser.userName,
          surname: foundUser.userSurname,
          fathername:foundUser.userFatherName,
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

app.post('/user', (req, res) => {
  fs.readFile(__dirname + '/bd/user.json', function (err, date) {
    if (err) {
      return console.log(err)
    } else {
      let foundUser,
        users;
  
      users = JSON.parse(date);
      for (let i =0; i < users.length; i++){
        const user = users[i];
        console.log(req.body);
        if (user.id === req.body.id ) {
          foundUser = user;
          break
        }
      }
      if (foundUser !== undefined) {
        
        res.send(JSON.stringify(foundUser));
    
      } else {
        console.log('login failed');
        res.send('no')
      }
    }
  });
});

app.post('/group', (req, res) => {
  console.log(req.body);
  console.log(req.cookies);
  
  const teachers = req.body,
    nameNewGroup = teachers[0]['nameGroup'],
    curator = req.cookies.dataUser.id;

    fs.readFile(__dirname + '/bd/group.json', (err, data) => {
      if (err) {
        return console.log(err)
      } else {
        const groups = JSON.parse(data);
        let equal = true;

        groups.forEach( elem => {
          if (elem.nameGroup === nameNewGroup) {
            equal = false
          }
        });

        if (!equal) {
          res.send('Такая группа уже зарегистрированна.')
        } else {
            const newGroup = {};
            newGroup.nameGroup = nameNewGroup;
            newGroup.teachers = [];

            teachers.forEach(item => {
              const idUser = Math.random().toString(36).substr(2, 9),
                password = Math.random().toString(36).substr(2, 6);
              item['curator'] = curator;
              item.status = 'student';
              item.id = idUser;
              item.userPassword = password;
              newGroup.teachers.push(idUser);

              fs.readFile(__dirname + '/bd/user.json', (err,data) => {
                const usersData = JSON.parse(data);
                usersData.push(item)
                const newUser = JSON.stringify(usersData);
                fs.writeFile(__dirname + '/bd/user.json', newUser, 'utf8', (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
                });

              })
            });
            
            groups.push(newGroup);
            fs.writeFile(__dirname + '/bd/group.json',JSON.stringify(groups), 'utf8', (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
          })
          res.send(`Группа ${nameNewGroup} добавлена.`)         
        }
      }
  });
});

app.post('/teacher', (req, res) => {
  
  const teachers = req.body;
  teachers.forEach(teacher => {
    fs.readFile(__dirname + '/bd/user.json', (err, data) => {
      if (err) {
        return console.log(err)
      } else {
        let usersData = JSON.parse(data);
        let equalUser = true;

      usersData.forEach(elem => {
        
        if (elem.userEmail === teacher.userEmail && elem.subject === teacher.subject) {
          equalUser = false;
        }
      });

      if (!equalUser) {
        res.send(`Преподаватель предмета ${teacher.subject} с e-mail: ${teacher.userEmail}  уже зарегистрирован`);
      } else {

        const idTeacher = Math.random().toString(36).substr(2, 9),
          passwordTeacher = Math.random().toString(36).substr(2, 6);
          teacher.id =idTeacher; 
          teacher.userPassword = passwordTeacher;
          teacher.status = 'teacher';
  
        fs.readFile(__dirname + '/bd/subject.json', (err, data) => {
          if (err) {
            return console.log(err)
          } else {
            const newSubject = {};
            newSubject['teachers'] = [];
          
            const subjectDate = JSON.parse(data);
            let equalSubject = false;
          
            subjectDate.forEach(subject => {
              if (subject['subjectName'] === teacher['subject']) {
                subject['teachers'].push(teacher.id);
                equalSubject = true;
              }
            });
          
            if (!equalSubject) {
              newSubject['subjectName'] = teacher['subject'];
              newSubject['teachers'].push(teacher.id);
              subjectDate.push(newSubject);
            };
            let newData = JSON.stringify(subjectDate)
            fs.writeFile(__dirname + '/bd/subject.json', newData, 'utf8', (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
            });
          }
        });
        usersData.push(teacher);

        let newUser = JSON.stringify(usersData);
        fs.writeFile(__dirname + '/bd/user.json', newUser, 'utf8', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
          res.send('Новый преподаватель добавлен')
        });
      }
    }
  })      
})
})



app.get('/logout', function(req, res){
  res.cookie('dataUser', '', {expires: new Date(0)});
  
  res.redirect('/');
});
// app.get('/logout', function(req, res){
//   res.cookie(dataUser, "", { expires: new Date(0), path: '/' });
// });
app.listen(port);
console.log('Server running on ', ip, port);
