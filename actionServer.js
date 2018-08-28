'user strict'

class Server {
  constructor() {
    this.fs = require('fs');
  }

  userPage(req, res) {
    this.readFileUserGroup(resUserPage);

    function resUserPage(users, groupDate) {
      let foundUser;

      for (let i =0; i < users.length; i++){
        if (users[i].id === req.params.id ) {
          foundUser = users[i];
          break
        }
      };

      const info =[];
      for (let key in foundUser) {
        switch (key) {
          case 'userDateBirth':
              info.push(`Дата рождениея: ${foundUser[key]}`);
              break;
          case 'userEmail':
              info.push(`E-mail: ${foundUser[key] }`);
              break;
          case 'userPlaceWork':
              info.push(`Место работы: ${foundUser[key]}`);
              break;
          case 'userPosition':
              info.push(`Должность: ${foundUser[key]})`);
              break;
          case 'status':
              info.push(`Статус: ${foundUser[key] }`);
              break;
           case 'subject':
              if (foundUser.status === 'teacher') {
                info.push(`Преподаваемый  предмет: ${foundUser[key]}`);
              }
              break;
          case 'nameGroup':
              let group = {};
              group.name = `Группа: ${foundUser[key]}`;
              group.link = `/group/${foundUser[key]}`;
              info.push(group);
              break;
          case 'curator':
              let curator = {};
              curator.link = `/user/${foundUser[key]}`;
              for (let i =0; i < users.length; i++){
                const user = users[i];
                if (user.id === foundUser[key] ) {
                  curator.name = `Куратор: ${user.userSurname} ${user.userName.charAt(0)}.${user.userFatherName.charAt(0)}.`;
                  break
                }
              };
              info.push(curator);
              break;
        }
      }
      const stickers = [];
      switch (foundUser.status) {
        case 'curator':
            const stickerGroup = {};
            let groupCurator,
            nameIdGroupCurator;

            groupCurator = groupDate.filter(item => item.curator === foundUser.id);
            nameIdGroupCurator = groupCurator.map(item => {
              let result ={};
              result.name = item.nameGroup;
              result.link = `/group/${item.idGroup}`;
              return result
            });
            stickerGroup.name = nameIdGroupCurator;
            stickerGroup.caption = 'Группы:';
            if (foundUser.id === req.cookies.dataUser.id) {
              stickerGroup.textLink = 'Добавить_группу:';
              stickerGroup.hrefLink = '/add-group';
            };
            const stickerTeacher = {};
            let teachers,
              teachersName;
            teachers = users.filter(item => item.status === 'teacher' && item.curator === foundUser.id);
            teachersName = teachers.map(teacher => {
              let result = {};
              result.name = `${teacher.userSurname} ${teacher.userName.charAt(0)}.${teacher.userFatherName.charAt(0)}.` ;
              result.link = `/user/${teacher.id}`;
              return result;
            });
            stickerTeacher.name = teachersName;
            stickerTeacher.caption = 'Преподаватели:';
            if (foundUser.id === req.cookies.dataUser.id) {
              stickerTeacher.textLink = 'Добавить_преподавателя:';
              stickerTeacher.hrefLink = '/add-teacher';
            };

            const stickerTimetable = {};
            let nameTimetable =  [{
                'name': `Расписание преподавателей`,
                'link': `/timetable`
              }];
            stickerTimetable.name = nameTimetable;
            stickerTimetable.caption = 'Расписание';

            stickers.push(stickerTeacher);
            stickers.push(stickerGroup);
            stickers.push(stickerTimetable);

            break;

        // case 'student':
        //     let child = users.filter(item =>     item.curator === foundUser.id && item.);

        //     break;     

      //   case 'teacher':
      //       let child = users.filter(item =>     item.curator === foundUser.id && item.);

      //       break;  
      // }

      }
      res.render('user', {main: 'user', name:`${foundUser.userSurname} ${foundUser.userName}  ${foundUser.userFatherName}`, info: info, stickers:stickers})
    }
  };
  groupPage(req, res) {
    this.readFileUserGroup(resGroupPage);
    function resGroupPage(users, groupDate) {
      let foundGroup;
  
      for (let i =0; i < groupDate.length; i++) {
        if (groupDate[i].idGroup === req.params.id ) {
          foundGroup = groupDate[i];
          break;
        }
      };
      let stickers = [],
        info = [];
      
      for (let i =0; i < users.length; i++){
        let user = users[i];
        if (user.id === foundGroup.curator ) {
          let curator = {};
          curator.name = `Куратор: ${user.userSurname} ${user.userName.charAt(0)}  ${user.userFatherName.charAt(0)}`;
          curator.link = `/user/${user.id}`;
          info.push(curator);
          break;
        }
      }

      let studentsGroup;
      studentsGroup = users.filter(item => item.nameGroup === foundGroup.nameGroup);
      studentsGroup.sort((a, b) => {
        if (a.userSurname > b.userSurname) {
          return 1;
        }
        if (a.userSurname < b.userSurname) {
          return -1;
        }
        return 0;
      })
      studentsGroup.forEach(item => {
        let student = {};
        student.name = `${item.userSurname} ${item.userName}  ${item.userFatherName}`;
        student.link =` /user/${item.id}`
        info.push(student);
      });
      res.render('user', {main: 'user', name:`Группа №${foundGroup.nameGroup}`, info: info,    stickers:stickers})
    }  
  }
  timetablePage(req, res) {
    this.readFileUserGroup((users, groupDate) => {
      this.fs.readFile(__dirname + '/bd/lessons.json', (err, dataLessons) => {
        if (err) {
          return console.log(err)
        } else {
          const lessons = JSON.parse(dataLessons);

          const teachersTimetable = [];
          let teachers;
          switch (req.cookies.dataUser.status) {
            case 'student':
              teachers = [];
              let group = groupDate.filter(item => item.nameGroup === req.cookies.dataUser.nameGroup);
              let teachersId = group.subject.map(item => item.teacherId);
              teachers = teachersId.map(item => users.filter(user => user.id === item)[0] )
              break;
            case 'teacher':
              teachers = users.filter(item => item.id === req.cookies.dataUser.id);
  
              break;
            case 'curator':
              teachers = users.filter(item => 
              item.curator === req.cookies.dataUser.id && item.status === 'teacher');
              break;
          }
          teachers.forEach(item => {
            let teacher = {};
            let groups = []; 
            let lessonTeacher = lessons.filter(elem => elem.teacher === item.id)
            groupDate.forEach(group => {
              for (let i = 0; i < group.subject.length; i++) {
                let subjectGroup = group.subject[i];
                if (subjectGroup.teacherId === item.id) {
                  groups.push(group.nameGroup)
                }
              }
            });
            req.cookies.dataUser.status === 'curator' ? teacher.disabled = 'false' : teacher.disabled = 'true'; 
            teacher.groups = groups;
            teacher.name = `${item.userSurname} ${item.userName} ${item.userFatherName}`;
            teacher.subject = item.subject;
            teacher.id = item.id;
            teacher.lesson = lessonTeacher;
            
            teachersTimetable.push(teacher);
          })
          res.render('user', {main: 'timetable',teachersTimetable: teachersTimetable})
        }
      });
    })
  }
  addSubject(req, res) {
    this.readFileSubjectUser(resSubjectTeachers);
    function resSubjectTeachers(users, subjectDate){
      const foundUsers = [];

      subjectDate.forEach(subject => {
        let subjectTeachers = {};
        subjectTeachers['subjectName'] = subject['subjectName'];
        subjectTeachers['teachers'] = [];
        subject['teachers'].forEach(teacherId => {
          for ( let i = 0; i < users.length; i++) {
            const user = users[i];
            if (teacherId === user.id && user.curator === req.cookies.dataUser.id) {
              let teachersName = `${user.userSurname} ${user.userName.charAt(0)}.${user.userFatherName.charAt(0)}.`
              let teacher = {
                id: user.id,
                name: teachersName
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
  }
  registration(req, res) {
    this.readFileUser(users => {
      const dateReq = req.body,
        idUser = Math.random().toString(36).substr(2, 9);
      let equal = true;

      dateReq.status = 'curator';
      dateReq.id = idUser;
      for (let i =0; i < users.length; i++){
        if (users[i].userEmail === dateReq.userEmail ) {
          equal = false;
          break
        }
      };
      if (!equal) {
        res.send('no');
      } else {
        users.push(dateReq);
        let usersNew = JSON.stringify(users);

        this.writeNewFile('/bd/user.json', usersNew)
        res.send('yes');
      }
    })
  }
  login(req, res) {
    this.readFileUser(users => {
      let foundUser;
  
      for (let i =0; i < users.length; i++){
        const user = users[i];
        if (user.userEmail === req.body.userEmail && user.userPassword === req.body.userPassword) {
          foundUser = user;
          break
        }
      }
      if (foundUser !== undefined) {
        let dataUser = {
          id: foundUser.id,
          name: foundUser.userName,
          surname: foundUser.userSurname,
          fathername:foundUser.userFatherName,
          status: foundUser.status,
        }
        if (foundUser.status === 'student') {
          dataUser.nameGroup = foundUser.nameGroup;
        }
        res.cookie('dataUser', dataUser);
        res.send('yes');
      } else {
        res.send('no')
      }
    })
  }
  resUser(req, res) {
    this.readFileUser(users => {
      let foundUser;
      for (let i =0; i < users.length; i++){
        let user = users[i];
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
    })
  }
  addGroup(req, res) {
    this.readFileUserGroup((users, groupDate) =>{
      const students = req.body,
        nameNewGroup = students[0]['nameGroup'],
        subjectGroup = students[0]['subject'],
        learningFrom = students[0]['learningFrom'],
        learningTo = students[0]['learningTo'],
        curator = req.cookies.dataUser.id;
      let equal = true;

      for (let i =0; i < groupDate.length; i++){
        if (groupDate[i].nameGroup === nameNewGroup) {
          equal = false
          break
        }
      };
      if (!equal) {
        res.send('Такая группа уже зарегистрированна.')
      } else {
        const newGroup = {};
        const idGroup = Math.random().toString(36).substr(2, 9);
        newGroup.nameGroup = nameNewGroup;
        newGroup.subject = subjectGroup;
        newGroup.curator = curator;
        newGroup.idGroup = idGroup;
        newGroup.learningFrom = learningFrom;
        newGroup.learningTo = learningTo;
        newGroup.students = [];
        
        students.forEach(item => {
          const idUser = Math.random().toString(36).substr(2, 9),
            password = Math.random().toString(36).substr(2, 6);
          item['curator'] = curator;
          item.status = 'student';
          item.id = idUser;
          item.userPassword = password;
          newGroup.students.push(idUser);
          
          users.push(item);
          console.log(newGroup);
        });
        this.writeNewFile('/bd/user.json', JSON.stringify(users));

        groupDate.push(newGroup);
        this.writeNewFile('/bd/group.json', JSON.stringify(groupDate))

        res.send(`Группа ${nameNewGroup} добавлена.`)         
      }
    })
  }
  addTeacher(req, res) {
    this.readFileSubjectUser((users, subjectDate) => {
      const teachers = req.body;
      teachers.forEach(newTeacher => {
        let equalSubject = false;
        let equalUser = true;

        for (let i = 0; i < users.length; i++) {
          let user = users[i];
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
            newTeacher.curator = req.cookies.dataUser.id;
        
          for (let i = 0; i < subjectDate.length; i++) {
            if (subjectDate[i]['subjectName'] === newTeacher.subject) {
              subjectDate[i]['teachers'].push(newTeacher.id);
              equalSubject = true;
            }
          };

          if (!equalSubject) {
            newSubject['subjectName'] = newTeacher.subject;
            newSubject['teachers'].push(newTeacher.id);
            subjectDate.push(newSubject);
          };
          users.push(newTeacher);
        }
      })
      this.writeNewFile('/bd/subject.json', JSON.stringify(subjectDate));
      this.writeNewFile('/bd/user.json', JSON.stringify(users));
      res.send('Новый преподаватель добавлен')
    })
  }
  addLesson(req, res) {
    this.readFileLessonsUser((users, lessons) => {
      const dataReq = req.body;
      let equal = false,
        equalLesson;
      lessons.forEach(lesson => {
        for (let j = 0; j < dataReq.length; j++){
          let newLesson = dataReq[j];
          if (lesson.day === newLesson.day 
              && lesson.numberLesson === newLesson.numberLesson
              && lesson.group === newLesson.group) {
            equal = true;
            equalLesson = lesson
            break
          }
        }
      })  
      if (equal) {
        let week = [
          {'en': "monday",'ru': 'Понедельник'},
          {'en':"tuesday", 'ru': 'Вторник'},
          {'en':"wednesday", 'ru': 'Среда'},
          {'en': "thursday",'ru': 'Четверг'},
          {'en':"friday", 'ru': 'Пятница'},
          {'en':"saturday", 'ru': 'Суббота'}
        ];
        let dayRu = week.filter(item => item.en === equalLesson.day)[0].ru;
        if(equalLesson.day === 'wednesday' || 
          equalLesson.day === 'friday' || 
          equalLesson.day === 'saturday') {

          dayRu.replace(dayRu[dayRu.length-1], 'у');

        }
        let occupiedTeacher;
        for (let k = 0; k < users.length; k++) {
          let user = users[k];
          if (user.id === equalLesson.teacher) {
            occupiedTeacher = `${user.userSurname} ${user.userName.charAt(0)}.${user.userFatherName.charAt(0)}`
            break
          }
        }
        res.send(`Занятие №${equalLesson.numberLesson.charAt(0)} в группе ${equalLesson.group}
                  в ${dayRu} занято преподавателем ${occupiedTeacher}`);
      } else {
        this.writeNewFile('/bd/lessons.json', JSON.stringify(dataReq));
        res.send('ok');
      }
    })
  }
  writeNewFile(url,data) {
    this.fs.writeFile(__dirname + url, data, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }
  readFileUserGroup(action) {
    this.fs.readFile(__dirname + '/bd/user.json', (err, dataUsers) => {
      if (err) {
        return console.log(err)
      } else {
        this.fs.readFile(__dirname + '/bd/group.json', (err, dataGroups) => {
          if (err) {
            return console.log(err)
          } else {
            const users = JSON.parse(dataUsers),
            groupDate = JSON.parse(dataGroups);
      
            action(users, groupDate)
          }
        });
      }
    })
  };
  readFileSubjectUser(action) {
    this.fs.readFile(__dirname + '/bd/subject.json', (err, dataSubject) => {
      if (err) {
        return console.log(err)
      } else {
        this.fs.readFile(__dirname + '/bd/user.json', (err, dataUsers) => {
          if (err) {
            return console.log(err)
          } else {
            const users = JSON.parse(dataUsers),
              subjectDate = JSON.parse(dataSubject);
            action(users, subjectDate)
          }
        });
      }
    })
  }
  readFileUser(action) {
    this.fs.readFile(__dirname + '/bd/user.json', (err, dataUsers) => {
      if (err) {
        return console.log(err)
      } else {
        const users = JSON.parse(dataUsers);
        action(users)
      }
    });
  }
  readFileLessonsUser(action) {
    this.fs.readFile(__dirname + '/bd/lessons.json', (err, dataLessons) => {
      if (err) {
        return console.log(err)
      } else {
        this.fs.readFile(__dirname + '/bd/user.json', (err, dataUsers) => {
          if (err) {
            return console.log(err)
          } else {
            const users = JSON.parse(dataUsers),
              lessons = JSON.parse(dataLessons);
            action(users, lessons)
          }
        });
      }
    })
  }


}

module.exports = new Server;