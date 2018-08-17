import getElement from "./getElement.js";
import GroupTeacher  from "./class/GroupTeacher.js";

const teacher = new GroupTeacher('teacher');

teacher.testInput();

const addTeacher = getElement('#addTeacher');
addTeacher.addEventListener('click', () => {
    teacher.addUser()
});

const table = getElement('table');
table.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON') {
        teacher.changUser(event.target)
    }
});

const createTeacher = getElement('#createTeacher');
createTeacher.addEventListener('click', () => {
    teacher.creatGroupTeacher('/teacher')
})