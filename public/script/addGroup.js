import getElement  from "./getElement.js";
import GroupTeacher  from "./class/GroupTeacher.js";

const group = new GroupTeacher('student');

group.testInput();

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

const creatGroup = getElement('#createGroupe');
creatGroup.addEventListener('click', () => {
    group.creatGroupTeacher('/group')
});

