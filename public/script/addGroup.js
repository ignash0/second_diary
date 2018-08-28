import getElement  from "./getElement.js";
import GroupTeacher  from "./class/GroupTeacher.js";

const group = new GroupTeacher('student');

group.testInput();
group.getSubject();

const addNewGroup = getElement('#addNewGroup');

addNewGroup.addEventListener('click', () => {
    group.addGroup()
});

const addStudent = getElement('#addStudent');
addStudent.addEventListener('click', () => {
    group.addUser()
});

const table = getElement('table');
table.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON') {
        group.changUser(event.target)
    }
});

const addNewSubject = getElement('#addNewSubject');
addNewSubject.addEventListener('click', () => {
    group.addSubjectTeacher();
})

const creatGroup = getElement('#createGroupe');
creatGroup.addEventListener('click', () => {
    group.addInGroupSubjectsTeachets();
    group.creatGroupTeacher('/group')
});
