import formSubmitPostJson  from "./formSubmitPostJson.js";
import getElement  from "./getElement.js";

class Timtable {
    constructor() {
        this.lessons = [];
    }
    saveTimetable(target) {
        const teacherId = target.parentNode.dataset.idTeacher;
        let section = target.parentNode,
            input = section.querySelectorAll('input'),
            inputArray = Array.from(input),
            noEmptyInput = inputArray.filter(item => item.value !== ''),
            timeInput = noEmptyInput.filter(item => item.parentNode.className === 'time' ),
            groupInput = noEmptyInput.filter(item => item.parentNode.className === 'group'),
            subject = section.querySelector('p').innerText;

        timeInput.forEach(time => {
        	groupInput.forEach(group => {
               
                if (time.parentNode.parentNode === group.parentNode.parentNode) {
                    const lesson = {};
                
        			let row = group.parentNode.parentNode;
                    let table = row.parentNode.parentNode;
                    
        			lesson.numberLesson = row.className;
        			lesson.day = table.id;
        			lesson.group = group.value;
                    lesson.time = time.value;
                    lesson.teacher = teacherId;
                    lesson.subject = subject;

        			this.lessons.push(lesson)
        		}
        	})
        })
        let teacherName = section.querySelector('h1').innerText;
        if (this.lessons.length !== 0) {
            console.log('no');
            formSubmitPostJson('/lessons', JSON.stringify(this.lessons), response => {
                if (response ==='ok') {
                    target.disabled = true;
                    this.modalWindow(`Расписание преподавателя\n ${teacherName}\n сохранено`)
                } else {
                    this.modalWindow(response);
                }
            });
        } else {
            console.log('yes');
            this.modalWindow(`Вы не заполнили расписание преподавателя\n ${teacherName}`)
        }
    }

    modalWindow(text) {
        getElement('modal-window').setAttribute('text', text);
        getElement('modal-window').setAttribute('open', 'true');
    }
}
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
        const newTimetable =new Timtable;
        newTimetable.saveTimetable(event.target);
    })
})