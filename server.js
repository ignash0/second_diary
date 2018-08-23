const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
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
  fs.readFile(__dirname + '/bd/user.json', (err, data) => {
    if (err) {
      return console.log(err)
    } else {
      let foundUser,
        users;
  
      users = JSON.parse(data);
      for (let i =0; i < users.length; i++){
        const user = users[i];
        console.log(req.params);
        if (user.id === req.params.id ) {
          foundUser = user;
          break
        }
      }

      const info =[];
      for (let key in foundUser) {
          switch (key) {
              case 'userDateBirth':
                  info.push(`Дата рождениея: ${foundUser[key]}`);
                  break;

              case 'userEmail':
                  info.push(`E-mail: ${foundUser[key]}`);
                  break;

              case 'userPlaceWork':
                  info.push(`Место работы: ${foundUser[key]}`);
                  break;
              
              case 'userPosition':
                  info.push(`Должность: ${foundUser[key]})`);
                  break;

              case 'statue':
                  info.push(`Статус: ${foundUser[key]}`);
                  break;

              case 'subject':
                  info.push(`Преподаваемый предмет: ${foundUser[key]}`);
                  break;

              case 'nameGroup':
                  info.push(`Группа: ${foundUser[key]}`);
                  break;

          }
      }
      res.render('user', {name:`${foundUser.userSurname} ${foundUser.userName} ${foundUser.userFatherName}`, info: info})
    }
  })
})
 app.get('/add-group', (req, res) => {
  res.sendFile(__dirname + '/public/add-groupe.html')
 })

 app.get('/add-teacher', (req, res) => {
  res.sendFile(__dirname + '/public/add-teacher.html')
 })

 app.get('/subject', (req, res) => {
   fs.readFile(__dirname + '/bd/subject.json', (err, data) => {
    if (err) {
      return console.log(err)
    } else {
      const subjectDate = JSON.parse(data);

      fs.readFile(__dirname + '/bd/user.json', (err, data) => {
        if (err) {
          return console.log(err)
        } else {
          const usersData = JSON.parse(data);
          let foundUsers = [];

          subjectDate.forEach(subject => {
            let subjectTeachers = {};
            subjectTeachers['subjectName'] = subject['subjectName'];
            subjectTeachers['teachers'] = [];
            subject['teachers'].forEach(teacherId => {
              for ( let j = 0; j < usersData.length; j++) {
                const user = usersData[j];
                if (teacherId === user.id) {
                  let teacherName = `${user.userSurname} ${user.userName.charAt(0)}.${user.userFatherName.charAt(0)}.`
                  let teacher = {
                    id: user.id,
                    name: teacherName
                  };
                  subjectTeachers['teachers'].push(teacher); 
                  
                  break;
                }
              }
            })
            foundUsers.push(subjectTeachers);
          })
          let foundTeacher = JSON.stringify(foundUsers);
          res.send(foundTeacher);
        }
       })
    }
   })
 })


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
  
  const students = req.body,
    nameNewGroup = students[0]['nameGroup'],
    subjectGroup = students[0]['subject'],
    curator = req.cookies.dataUser.id;

    fs.readFile(__dirname + '/bd/user.json', (err,data) => {
      const usersData = JSON.parse(data);

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
            newGroup.subject = subjectGroup;
            newGroup.students = [];
            
            students.forEach(item => {
              const idUser = Math.random().toString(36).substr(2, 9),
                password = Math.random().toString(36).substr(2, 6);
              item['curator'] = curator;
              item.status = 'student';
              item.id = idUser;
              item.userPassword = password;
              newGroup.students.push(idUser);
              
              usersData.push(item);
              console.log(newGroup);
            });

            const newUser = JSON.stringify(usersData);
            fs.writeFile(__dirname + '/bd/user.json', newUser, 'utf8', (err) => {
              if (err) throw err;
              console.log('The file has been saved!1');
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
});

app.post('/teacher', (req, res) => {
  
  const teachers = req.body;

  fs.readFile(__dirname + '/bd/user.json', (err, data) => {
    if (err) {
      return console.log(err)
    } else {
      let usersData = JSON.parse(data);
      

      fs.readFile(__dirname + '/bd/subject.json', (err, data) => {
        if (err) {
          return console.log(err)
        } else {
          const subjectDate = JSON.parse(data);
          

          teachers.forEach(newTeacher => {
            let equalSubject = false;
            let equalUser = true;

            for (let i = 0; i < usersData.length; i++) {

              let user = usersData[i];
              if (user.userEmail === newTeacher.userEmail && user.subject === newTeacher.subject) {
                equalUser = false;
                break;
              }
            };
          
            if (!equalUser) {
              res.send(`Преподаватель предмета ${newTeacher.subject} с e-mail: ${newTeacher.userEmail}  уже зарегистрирован`);
            } else {
              const newSubject = {};
                newSubject['teachers'] = [];

              const idTeacher = Math.random().toString(36).substr(2, 9),
                passwordTeacher = Math.random().toString(36).substr(2, 6);
                newTeacher.id =idTeacher; 
                newTeacher.userPassword = passwordTeacher;
                newTeacher.status = 'teacher';
            
              for (let i = 0; i < subjectDate.length; i++) {
                if (subjectDate[i]['subjectName'] === newTeacher['subject']) {
                  subjectDate[i]['teachers'].push(newTeacher.id);
                  equalSubject = true;
                }
              };

              if (!equalSubject) {
                newSubject['subjectName'] = newTeacher['subject'];
                newSubject['teachers'].push(newTeacher.id);
                subjectDate.push(newSubject);
              };
              usersData.push(newTeacher);
            }
          })

          let newData = JSON.stringify(subjectDate);
          fs.writeFile(__dirname + '/bd/subject.json', newData, 'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });

        let newUser = JSON.stringify(usersData);
        fs.writeFile(__dirname + '/bd/user.json', newUser, 'utf8', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
          res.send('Новый преподаватель добавлен')
        });
        }
      })      
    }
  })
})

app.get('/logout', function(req, res){
  res.cookie('dataUser', '', {expires: new Date(0)});
  
  res.redirect('/');
});

app.listen(port);
// app.listen(port, ip);
console.log('Server running on ', ip, port);
