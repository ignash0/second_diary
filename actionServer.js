'user strict'

class Server {
  constructor() {
    this.fs = require('fs');
  }
  userPage(req, res) {
    this.readFileUserGroup((users, groupDate) => {
      this.readFile('/bd/journals.json', journals => {
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
                for (let i = 0; i < groupDate.length; i++) {
                  if (groupDate[i].nameGroup === foundUser.nameGroup) {
                    group.link = `/group/${groupDate[i].idGroup}`;
                    break;
                  }
                }
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
            case 'userPassword':
                if (foundUser.curator === req.cookies.dataUser.id ) {
                  info.push(`Пароль для входа: ${foundUser[key]}`);
                }
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
   
              stickers.push(stickerTeacher);
              stickers.push(stickerGroup);
              if (foundUser.id === req.cookies.dataUser.id) {
                stickers.push(this.stickerTimetable());
              }
  
              break;
  
          case 'student':
          const journalName = [];
              journals.forEach(item => {
                if (foundUser.nameGroup === item.nameGroup) {
                  let result = {
                    'name': item.subject,
                    'link': `/journal/${item.id}`
                  }
                  journalName.push(result)
                }
              })
              const stickerJournal = {};
              stickerJournal.caption = 'Журналы:';
              stickerJournal.name = journalName;
              stickers.push(stickerJournal);

              const stickerDiary = {};
              stickerDiary.name = [{
                'name': `Дневник`,
                'link': `/diary/${foundUser.id}`
              }];
              stickerDiary.caption = 'Дневник';
              stickers.push(stickerDiary);
            break;     
  
          case 'teacher':
              stickers.push(this.stickerTimetable());
              this.stickerJournals(foundUser.id);
              stickers.push(this.stickerJournal);
              break;  
        }
        res.render('user', {main: 'user', name:`${foundUser.userSurname} ${foundUser.userName}  ${foundUser.userFatherName}`, info: info, stickers:stickers})
      })
    })
  };
  stickerTimetable() {
    const stickerTimetable = {};
    stickerTimetable.name = [{
      'name': `Расписание преподавателей`,
      'link': `/timetable`
    }];
    stickerTimetable.caption = 'Расписание';
    return stickerTimetable
  }
  stickerJournals(foundUserData) {
    this.readFile('/bd/journals.json', journals => {
      const journalName = [];
      journals.forEach(item => {
        if (foundUserData === item.teacherId) {
          let result = {
            'name': item.subject,
            'link': `/journal/${item.id}`
          }
          journalName.push(result)
        }
      })
      const stickerJournal = {};
      stickerJournal.caption = 'Журналы:';
      stickerJournal.name = journalName;
      this.stickerJournal = stickerJournal;
    })
    return this.stickerJournal
  }
  groupPage(req, res) {
    this.readFileUserGroup((users, groupDate) => {
      this.readFile('/bd/journals.json', journals => {
        let foundGroup;
    
        for (let i =0; i < groupDate.length; i++) {
          if (groupDate[i].idGroup === req.params.id ) {
            foundGroup = groupDate[i];
            break;
          }
        };
        const stickers = [],
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
  
        const stickerJournals = {};
        let journalsGroup = journals.filter(item => item.nameGroup === foundGroup.nameGroup ),
          journalsSubject = journalsGroup.map(journal => {
            let result = {};
            result.name = journal.subject ;
            result.link = `/journal/${journal.id}`;
            return result;
          });
        stickerJournals.name = journalsSubject;
        stickerJournals.caption = 'Журналы:';
        stickers.push(stickerJournals);

        // if (req.cookies.dataUser.status === 'curator') {
        //   const stickerListPassword = {};
        //   stickerListPassword.name = [{
        //     'name': `Список паролей учащихся`,
        //     'link': `/listPassword/${foundGroup.id}`
        //   }];
        //   stickerListPassword.caption = 'Пароли';
        //   stickers.push(stickerListPassword);
        // }

        res.render('user', {main: 'user', name:`Группа №${foundGroup.nameGroup}`, info: info,    stickers:stickers})
      })
    })  
  }
  journalPage(req, res) {
    this.readFile('/bd/journals.json', journals => {
      this.readFileUserGroup((users, groupDate) => {
        this.readFile('/bd/lessons.json', lessons => {
          this.readFile('/bd/mark.json', marks => {
            this.readFile('/bd/missed.json', missed => {
              this.readFile('/bd/homework.json', homeworks => {
                let foundJournal;
                for (let i = 0; i < journals.length; i++) {
                  if (journals[i].id === req.params.id) {
                    foundJournal = journals[i];
                    break;
                  }
                };
                let  teacherName;
                for (let i = 0; i < users.length; i++) {
                  if (users[i].id === foundJournal.teacherId) {
                    teacherName = `${users[i].userSurname} ${users[i].userName}  ${users[i].userFatherName}`;
                    break;
                  }
                };
                const journalData ={
                    'groupName': foundJournal.nameGroup,
                    'subjectName': foundJournal.subject,
                    'teacherName': teacherName,
                    'teacherId': foundJournal.teacherId,
                    'journalId':foundJournal.id
                  };
        
                let journalGroup = groupDate.filter(item => item.nameGroup === foundJournal.nameGroup);
                let groupStudentsId = journalGroup[0].students.map(item => item);
                let listStudents = groupStudentsId.map(item => {
                  let result = {};
                  for (let i = 0; i < users.length; i++) {
                    if(users[i].id === item){
                      result.name = `${users[i].userSurname} ${users[i].userName}  ${users[i].userFatherName}`;
                      result.id = users[i].id;
                      break;
                    }
                  }
                  return result;
                })
                let dateStart = new Date(journalGroup[0].learningFrom),
                  dateEnd = new Date (journalGroup[0].learningTo),
                  daysLessons =[];
                
                lessons.forEach(item => {
                  if(item.group === foundJournal.nameGroup && 
                    item.teacher === foundJournal.teacherId) {
                      daysLessons.push(item.day)
                    }
                  })
                  
                const journalDate = [];
                while (Date.parse(dateStart) !== Date.parse(dateEnd)) {
                  
                  let startDay = dateStart.toLocaleString('en-US', {weekday: 'long'});
                  startDay = startDay.replace(startDay[0], startDay[0].toLowerCase());
                  
                  daysLessons.forEach(day => {
                    if(startDay === day){
                      dateStart.getMonth()
                      let dayRu = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                      let month = ['Января','Феварля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ]
                      let result = {
                        'day':dayRu[dateStart.getDay()],
                        'month': month[dateStart.getMonth()],   
                        'date': dateStart.getDate(),
                        'year': dateStart.getFullYear()
                        }
                        journalDate.push(result)
                    }
                  })
                  dateStart.setDate(dateStart.getDate() + 1);
                }
                let button = false;
                if( req.cookies.dataUser.status === 'teacher') {
                  button = true;
                }
                marks = marks.filter(item => item.journalId === foundJournal.id);
                missed = missed.filter(item => item.journalId === foundJournal.id);
                homeworks = homeworks.filter(item => item.journalId === foundJournal.id);
                res.render('user', {main: 'journal', journalData: journalData, 
                listStudents: listStudents, button: button, journalDate: journalDate, marks: marks, missed: missed, homeworks: homeworks})
              })
            })
          })
        })
      })
    })
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
              let teachersId = group[0].subject.map(item => item.teacherId);
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
  diary(req, res) {
    this.readFile('/bd/user.json',users => {
      this.readFile('/bd/mark.json', marks => {
        this.readFile('/bd/homework.json', homeworks => {
          this.readFile('/bd/lessons.json', lessons => {
            this.readFile('/bd/journals.json', journal => {
              
              let foundStudent;
              for (let i =0; i < users.length; i++){
                if (users[i].id === req.params.id ) {
                  foundStudent = users[i];
                  break
                }
              };
              let name = `${foundStudent.userSurname} ${foundStudent.userName} ${foundStudent.userFatherName}`;
              
              marks = marks.filter(mark => mark.student === foundStudent.id);
              lessons = lessons.filter(lesson => lesson.group === foundStudent.nameGroup);

              
              let learningWeeks = this.getlearningWeek(foundStudent.learningFrom, foundStudent.learningTo);
              learningWeeks.map(week => {
                const lessonWeek = {};
                let startWeek = new Date(week.startParse),
                  endWeek = new Date(week.endParse),
                  dayWeek = ["Sunday", "monday","tuesday","wednesday","thursday","friday","saturday"];
                  let month = ['Января','Феварля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ];

                while (Date.parse(startWeek) <= Date.parse(endWeek)) {
                  let day = dayWeek[startWeek.getDay()];
                  let dayNum = `${startWeek.getDate()}-${month[startWeek.getMonth()]}-${startWeek.getFullYear()}`

                  let homeworkDay = homeworks.filter(homework => homework.date === dayNum);
                  let marksDay = marks.filter(mark => mark.date === dayNum);
                  let lessonsDay = lessons.filter(lesson => lesson.day === day);
                  
                  lessonWeek[day] = [];
                  if (lessonsDay.length !== 0){
                    lessonsDay.forEach(lessonday => {
                      let resLesson ={};
                      resLesson.subject = lessonday.subject;
                      resLesson.numberLesson = lessonday.numberLesson;
                      resLesson.day = day;

                      if (homeworkDay.length !== 0) {
                        homeworkDay.forEach(homework => {
                          if(homework.teacher === lessonday.teacher) {
                            resLesson.homework = homework.value;
                          } else {
                            resLesson.homework = '';
                          }
                        })
                      } else {
                        resLesson.homework = '';
                      }

                      if (marksDay.length !== 0) {
                        marksDay.forEach(mark => {
                          if (mark.teacher === lessonday.teacher) {
                            resLesson.mark = mark.mark;
                            resLesson.commentMark = mark.comment;
                          }
                        })
                      } else {
                        resLesson.mark = '';
                      }
                      lessonWeek[day].push(resLesson)
                    })
                  }
                  startWeek.setDate(startWeek.getDate() + 1);
                }
                return week.lessonWeek = lessonWeek;
              })
              res.render('user', {main: 'diary',name: name, learningWeeks:learningWeeks})
            })
          })
        })
      })
    })
  }
  getlearningWeek(learningFrom, learningTo) {
    let dateStart = new Date(learningFrom),
    dateEnd = new Date (learningTo),
    learningWeek = [],
      num = 1;
    
    let month = ['Января','Феварля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ];
    if (dateStart.getDay() === 0){
      let week = {};
      week.number = 1;
      dateStart.setDate(dateStart.getDate() + 1);
      week.start = `${dateStart.getDate()}-${month[dateStart.getMonth()]}-${dateStart.getFullYear()}`;
      week.startParse = Date.parse(dateStart);
      dateStart.setDate(dateStart.getDate() + 5);
      week.end = `${dateStart.getDate()}-${month[dateStart.getMonth()]}-${dateStart.getFullYear()}`;
      week.endParse = Date.parse(dateStart);
      learningWeek.push(week);
    }
    if (dateStart.getDay() > 1) {
      let week = {};
      week.number = 1;
      dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 1);
      week.start = `${dateStart.getDate()}-${month[dateStart.getMonth()]}-${dateStart.getFullYear()}`;
      week.startParse = Date.parse(dateStart);
      dateStart.setDate(dateStart.getDate() + 5);
      week.end = `${dateStart.getDate()}-${month[dateStart.getMonth()]}-${dateStart.getFullYear()}`;
      week.endParse = Date.parse(dateStart);
      learningWeek.push(week);
    }
    while (Date.parse(dateStart) <= Date.now() && Date.now() <= Date.parse(dateEnd)) {
      let week = {};
      if (dateStart.getDay() === 1) {
        if (learningWeek.length === 1){
          num ++;
        }
        week.number = num;
        num++;
        week.start = `${dateStart.getDate()}-${month[dateStart.getMonth()]}-${dateStart.getFullYear()}`;
        week.startParse = Date.parse(dateStart);
        let dateSutaday = dateStart;
        dateSutaday.setDate(dateSutaday.getDate() + 5)
        week.end = `${dateSutaday.getDate()}-${month[dateSutaday.getMonth()]}-${dateSutaday.getFullYear()}`;
        week.endParse = Date.parse(dateSutaday);

        learningWeek.push(week);
      }
      dateStart.setDate(dateStart.getDate() + 1);
    }
    return learningWeek;
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
        const newGroup = {},
          idGroup = Math.random().toString(36).substr(2, 9);
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
        this.writeNewFile('/bd/group.json', JSON.stringify(groupDate));
        
        this.readFile('/bd/journals.json', journals => {
          subjectGroup.forEach(item => {
            const idJournal = Math.random().toString(36).substr(2, 9);
            let newJournal = {};
            newJournal.subject = item.subjectName;
            newJournal.teacherId = item.teacherId;
            newJournal.nameGroup = nameNewGroup;
            newJournal.id = idJournal;
            journals.push(newJournal);
          })
          this.writeNewFile('/bd/journals.json', JSON.stringify(journals))
        })

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
        res.send(`Занятие №${equalLesson.numberLesson[equalLesson.numberLesson.length-1]} в группе ${equalLesson.group}
                  в ${dayRu} занято преподавателем ${occupiedTeacher}`);
      } else {
        dataReq.forEach(item => lessons.push(item));
        this.writeNewFile('/bd/lessons.json', JSON.stringify(lessons));
        res.send('ok');
      }
    })
  }
  addMarksHomeworkMissed(req, res) {
    this.readFile('/bd/mark.json', marks => {
      this.readFile('/bd/missed.json', missed => {
        this.readFile('/bd/homework.json', homeworks => {
          const dataReq = req.body;
          if (dataReq.marks) {
            dataReq.marks.forEach(item => {
              marks.push(item)
              this.writeNewFile('/bd/mark.json', JSON.stringify(marks));
            });
          }
          if( dataReq.missed){
            dataReq.missed.forEach(item => {
              missed.push(item)
              this.writeNewFile('/bd/missed.json', JSON.stringify(missed));
            });
          }
          if (dataReq.homework) {
            dataReq.homework.forEach(item => {
              homeworks.push(item)
              this.writeNewFile('/bd/homework.json', JSON.stringify(homeworks));
            });
          }
          res.send('Изменения в журнал сохранены')
        })
      })
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
  readFile(url, action) {
    this.fs.readFile(__dirname + url, (err, data) => {
      if (err) {
        return console.log(err)
      } else {
        const dataFile = JSON.parse(data);
        action(dataFile)
      }
    });
  }
}

module.exports = new Server;