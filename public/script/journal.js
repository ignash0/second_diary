import getElement  from "./getElement.js";

// class Journal {
//     constructor() {
//         this.formImput = getElement('#formMarkHomework');
//         this.elem;
//         this.missedDate;
//         this.markDate;
//         this.homeworkDate;
//         this.homework;
//     }
//     verticalScrollListDay() {
//         getElement('div.overflowProgress').addEventListener('wheel', (event) =>{
//             event.currentTarget.scrollLeft += event.deltaY; 
//             event.preventDefault();
//         })
//     }
//     formOutput() {
//         const tableMark = getElement('table#journalProgress tbody#list-day-mark');
//         tableMark.addEventListener('click', (event) => {
//             this.elem = document.elementFromPoint(event.clientX, event.clientY);
            
//             let ofsetX = event.pageX - this.elem.getBoundingClientRect().left - pageXOffset,
//             ofsetY = event.pageY - this.elem.getBoundingClientRect().top - pageYOffset;
//             this.formImput.style.left = event.pageX - ofsetX + this.elem.offsetWidth/2 + 'px';
//             this.formImput.style.top = event.pageY - ofsetY + this.elem.offsetHeight/2 + 'px';
            
//             this.formImput.classList.add('open');
            
//             this.missedDate = event.target.dataset.missedDate;
//             this.markDate =  event.target.dataset.markDate;
//             this.homeworkDate =  event.target.dataset.homeworkDate;
//             let idStudent = event.target.parentNode.dataset.idStudent,
//                 foundStudent = Array.from(document.querySelectorAll('#listStudents td')).filter(item => item.dataset.idStudent === idStudent);
//             let nameStudent;
//             if (foundStudent.lenngth !== 0) {
//                 nameStudent = foundStudent[0].innerText;
//             }
//             if(this.missedDate) {
//                 getElement('#formMarkHomework > p').innerText = `Отметить занятие ${this.missedDate} как пропущенное для ученика\n ${nameStudent}?`;
//             }
//             if (this.markDate) {
//                 getElement('#formMarkHomework > p').innerText = `Проставте отметку учащемуся\n${nameStudent}\nза ${this.markDate}`;
//                 getElement('.saveMark').style.display = 'block';
//             }
//             if (this.homeworkDate) {
//                 let homework = document.createElement('textarea');
//                 homework.setAttribute('name','homework')
//                 getElement('#formMarkHomework > p').innerText = `Домашнее задание на ${this.homeworkDate}`
//                 this.formImput.insertBefore(homework, getElement('div.saveMark'))
//             }
//         })
//     }
//     addMark() {
//         let mark = getElement('[name="mark"]'),
//             comment = getElement('[name="comment"]');
//         if (mark.value !== '') {
//             this.elem.innerText = mark.value;
//             this.elem.classList.add('change');
//         }
//         if (comment.value !== '') {
//             this.elem.setAttribute('data-comment', gcomment.value)
//         }
//         mark.value = '';
//         comment.value = '';
//         getElement('.saveMark').style.display = 'none';
//     }
//     addMissed() {
//         this.elem.classList.add('missed', 'change');
//     }
//     addHomeWork() {
//         this.homework = getElement('[name="homework"]');
//         if (this.homework.value!== '') {
//             this.elem.setAttribute('data-comment', homework.value)
//             this.elem.classList.add('homeWorkOk', 'change')
//         }
//         this.formImput.removeChild(this.homework)
//     }
//     buttonOk() {
//         if (this.missedDate) {
//            this.addMissed;
//         };
//         if (this.markDate) {
//             this.addMark;
//         }
//         if (this.homeworkDate) {
//             this.addHomeWork;
//         }
//         this.formImput.classList.remove('open');
//     }
//     buttonCancel(){
//         this.formImput.classList.remove('open');
//         getElement('.saveMark').style.display = 'none';
//         if(this.homeworkDate){
//             this.formImput.removeChild(this.homework)
//         }
//     }
// }
// const newJournal = new Journal;
// newJournal.formOutput();

// let ok = getElement('#save'),
// cancel = getElement('#cancel');
// ok.addEventListener('click', () => {
//     newJournal.buttonOk;
// });
// cancel.addEventListener('click', () => {
//     newJournal.buttonCancel;
// })



getElement('div.overflowProgress').addEventListener('wheel', (event) =>{
    event.currentTarget.scrollLeft += event.deltaY; 
    event.preventDefault();
})

const tableMark = getElement('table#journalProgress tbody#list-day-mark');
let elem,
    missedDate,
    markDate,
    homeworkDate,
    formImput = getElement('#formMarkHomework');

tableMark.addEventListener('click', (event) => {
	elem = document.elementFromPoint(event.clientX, event.clientY);
    
    formImput.classList.add('open');
    let ofsetX = event.pageX - elem.getBoundingClientRect().left - pageXOffset,
        ofsetY = event.pageY - elem.getBoundingClientRect().top - pageYOffset;
    formImput.style.left = event.pageX - ofsetX + elem.offsetWidth/2 + 'px';
    formImput.style.top = event.pageY - ofsetY + elem.offsetHeight/2 + 'px';
    
    missedDate = event.target.dataset.missedDate;
    markDate =  event.target.dataset.markDate;
    homeworkDate =  event.target.dataset.homeworkDate;
    let idStudent = event.target.parentNode.dataset.idStudent,
        foundStudent = Array.from(document.querySelectorAll('#listStudents td')).filter(item => item.dataset.idStudent === idStudent);
    let nameStudent;
    if (foundStudent.lenngth !== 0) {
        nameStudent = foundStudent[0].innerText;
    }
    if(missedDate) {
        getElement('#formMarkHomework > p').innerText = `Отметить занятие ${missedDate} как пропущенное для ученика\n ${nameStudent}?`;
    }
    if (markDate) {
        getElement('#formMarkHomework > p').innerText = `Проставте отметку учащемуся\n${nameStudent}\nза ${markDate}`;
        getElement('.saveMark').style.display = 'block';
    }
    if (homeworkDate) {
        let homework = document.createElement('textarea');
        homework.setAttribute('name','homework')
        getElement('#formMarkHomework > p').innerText = `Домашнее задание на ${homeworkDate}`
        formImput.insertBefore(homework, getElement('div.saveMark'))
    }
})
let ok = getElement('#save'),
cancel = getElement('#cancel'),
mark = getElement('[name="mark"]'),
comment = getElement('[name="comment"]');

ok.addEventListener('click', () => {
    if (missedDate) {
        elem.classList.add('missed', 'change');
    };
    if (markDate) {
        if (mark.value !== '') {
            elem.innerText = mark.value;
            elem.classList.add('change');
        }
        if (comment.value !== '') {
            elem.setAttribute('data-comment', gcomment.value)
        }
        mark.value = '';
        comment.value = '';
        getElement('.saveMark').style.display = 'none';
    }
    if (homeworkDate) {
        let homework = getElement('[name="homework"]');
        if (homework.value!== '') {
            elem.setAttribute('data-comment', homework.value)
            elem.classList.add('homeWorkOk', 'change')
        }
        formImput.removeChild(homework)
    }
    formImput.classList.remove('open');
});
cancel.addEventListener('click', () => {
    formImput.classList.remove('open');
    getElement('.saveMark').style.display = 'none';
    if(homeworkDate){
        formImput.removeChild(getElement('[name="homework"]'))
    }
})



