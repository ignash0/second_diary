import getElement  from "./getElement.js";
import formSubmitPostJson from "./formSubmitPostJson.js";
import getCookieFromJSON from "./getCookieFromJSON.js";

class Journal {
    constructor() {
        this.allMarks;
        this.allMissed;
        this.allHomework;
        this.tableMark = getElement('table#journalProgress tbody#list-day-mark');
        this.elem;
        this.cell;
        this.formImput = getElement('#formMarkHomework');
        this.missedDate;
        this.markDate;
        this.homeworkDate;
        this.change = false;
        this.ok = getElement('#save');
        this.cancel = getElement('#cancel');
        this.mark = getElement('[name="mark"]');
        this.comment = getElement('[name="comment"]');
        
    }
    openFormInput() {
        this.formImput.classList.add('open');
    }
    closeFormInput() {
        this.formImput.classList.remove('open');
    }
    coordModal(event, modal) {
        let ofsetX = event.pageX - event.target.getBoundingClientRect().left - pageXOffset,
        ofsetY = event.pageY - event.target.getBoundingClientRect().top - pageYOffset;
        modal.style.left = event.pageX - ofsetX + event.target.offsetWidth/2 + 'px';
        modal.style.top = event.pageY - ofsetY + event.target.offsetHeight/2 + 'px';

    }
    selectCell() {
        this.tableMark.addEventListener('click', (event) => {
            this.elem = event.target;
            this.cell = event.target;

            this.coordModal(event, this.formImput);
            
            // let ofsetX = event.pageX - this.elem.getBoundingClientRect().left - pageXOffset,
            //     ofsetY = event.pageY - this.elem.getBoundingClientRect().top - pageYOffset;
            // this.formImput.style.left = event.pageX - ofsetX + this.elem.offsetWidth/2 + 'px';
            // this.formImput.style.top = event.pageY - ofsetY + this.elem.offsetHeight/2 + 'px';
            
            this.missedDate = this.cell.dataset.missedDate;
            this.markDate =  this.cell.dataset.markDate;
            this.homeworkDate =  this.cell.dataset.homeworkDate;
            let idStudent = this.cell.parentNode.dataset.idStudent,
                foundStudent = Array.from(document.querySelectorAll('#listStudents td')).filter(item => item.dataset.idStudent === idStudent);
            let nameStudent;
        
            if (foundStudent.lenngth !== 0) {
                nameStudent = foundStudent[0].innerText;
            }
            if (this.cell.classList.length > 1 || this.cell.innerText !== '') {
                this.cell.classList.forEach(item => {
                    if (item === 'change') {
                        this.change = true;
                        this.openFormInput();
                        getElement('#formMarkHomework > p').innerText = `Удалить выбранные изменения?`;
                    } 
                })
            } else {
                if (this.cell.classList.length === 0) {
                    this.openFormInput();
                    if(this.missedDate) {
                        getElement('#formMarkHomework > p').innerText = `Отметить занятие ${this.missedDate} как пропущенное для ученика\n ${nameStudent}?`;
                    }
                    if (this.markDate) {
                        getElement('#formMarkHomework > p').innerText = `Проставте отметку учащемуся\n${nameStudent}\nза ${this.markDate}`;
                        getElement('.saveMark').style.display = 'block';
                    }
                    if (this.homeworkDate) {
                        let homeworkText = document.createElement('textarea');
                        homeworkText.setAttribute('name','homework')
                        getElement('#formMarkHomework > p').innerText = `Домашнее задание на ${this.homeworkDate}`
                        this.formImput.insertBefore(homeworkText, getElement('div.saveMark'))
                    }
                }
            }
        })
    }
    makeChange() {
        this.ok.addEventListener('click', () => {
            if (this.change) {
                this.cell.classList = [];
                this.cell.removeAttribute('data-comment');
                this.cell.innerText = '';
                this.change = false;
            } else {
                if (this.missedDate) {
                    this.elem.classList.add('missed', 'change');
                };
                if (this.markDate) {
                    if (this.mark.value !== '') {
                        this.elem.innerText = this.mark.value;
                        this.elem.classList.add('change');
                    }
                    if (this.comment.value !== '') {
                        this.elem.setAttribute('data-comment', this.comment.value)
                    }
                    this.mark.value = '';
                    this.comment.value = '';
                    getElement('.saveMark').style.display = 'none';
                }
                if (this.homeworkDate) {
                    let homework = getElement('[name="homework"]');
                    if (homework.value!== '') {
                        this.elem.setAttribute('data-comment', homework.value)
                        this.elem.classList.add('homeWorkOk', 'change')
                    }
                    this.formImput.removeChild(homework)
                }
            }
            this.closeFormInput();
        });

        this.cancel.addEventListener('click', () => {
           this.closeFormInput();
            getElement('.saveMark').style.display = 'none';
            if(this.homeworkDate){
                this.formImput.removeChild(getElement('[name="homework"]'))
            }
        })
    }
    searchChange() {
        const allCell = Array.from(this.tableMark.querySelectorAll('td'));
        this.allMarks = allCell.filter(item => item.innerText !== '' && item.classList.contains('change'));
        this.allMissed = allCell.filter(item => item.classList.contains('missed') && item.classList.contains('change'));
        this.allHomework = allCell.filter(item => item.classList.contains('homeWorkOk') && item.classList.contains('change'));

        let tableMark = {};
        if (this.allMarks.length !== 0) {
            tableMark.marks = [];
            this.allMarks.forEach(item => {
                let  result = {
                    'value': item.innerText,
                    'comment': item.dataset.comment,
                    'teacher': getElement('[data-techer-id]').dataset.techerId,
                    'student':item.parentNode.dataset.idStudent,
                    'date': item.dataset.markDate, 
                    'journalId': getElement('[data-journal-id]').dataset.journalId
                }
                tableMark.marks.push(result);
            });
        }
        if(this.allMissed.length !== 0) {
            tableMark.missed = [];
            this.allMissed.forEach(item => {
                let  result = {
                    'teacher': getElement('[data-techer-id]').dataset.techerId,
                    'student':item.parentNode.dataset.idStudent,
                    'date': item.dataset.missedDate,
                    'journalId': getElement('[data-journal-id]').dataset.journalId

                }
                tableMark.missed.push(result);
            })
        }
        if (this.allHomework.length !== 0) {
            tableMark.homework = [];
            this.allHomework.forEach(item => {
                let  result = {
                    'value': item.dataset.comment,
                    'teacher': getElement('[data-techer-id]').dataset.techerId,
                    'student':item.parentNode.dataset.idStudent,
                    'date': item.dataset.homeworkDate,
                    'journalId': getElement('[data-journal-id]').dataset.journalId,
                    'group':getElement('[data-group]').dataset.group

                }
                tableMark.homework.push(result);
            })
        }
        return tableMark;
    }
    saveChange(){
        if (Object.keys(this.searchChange()).length !== 0) {
            formSubmitPostJson('/addMarksHomeworkMissed', JSON.stringify(this.searchChange()), response => {
                this.removeClassChange(this.allMarks);
                this.removeClassChange(this.allMissed);
                this.removeClassChange(this.allHomework);
                this.modalWindow(response)
            })  
        } else {
            this.modalWindow('Вы не внесли никаких изменений')
        }
    }
    middleMark() {
        const student = document.querySelectorAll('#list-day-mark tr'),
            middleCells = document.querySelectorAll('.middleMark tbody td');
        
        middleCells.forEach(cell => {
            for (let i = 0; i < student.length; i++){
                if (student[i].dataset.idStudent === cell.dataset.idStudent) {
                    let marks = student[i].querySelectorAll('td[data-mark-date]');
                    let sumMark = 0,
                        num = 0;
                    marks.forEach(mark => {
                        if (mark.innerText !== ''){
                            sumMark = sumMark + Number(mark.innerText);
                            num = num +1;
                        }
                    })
                    if (sumMark){
                        cell.innerText = sumMark/num;
                    }
                    break;
                }
            }
        })  
    }
    titleComment() {
        let coordModal = getElement('#comment');
        this.tableMark.addEventListener('mouseover', (event) => {
            this.coordModal(event, coordModal);
            if (event.target.dataset.comment) {
                coordModal.style.display = 'block';
                getElement('#comment p').innerText = event.target.dataset.comment;
            } else {
                coordModal.style.display = 'none';
            }
        })
        

    }
    removeClassChange(array) {
        array.forEach(item => {
            item.classList.remove('change');
        })
    }
    modalWindow(text) {
        getElement('modal-window').setAttribute('text', text);
        getElement('modal-window').setAttribute('open', 'true');
    }

}
const newMark = new Journal;
newMark.middleMark();
const teacher = getElement('p[data-techer-id]').dataset.techerId;
if (getCookieFromJSON('status') === 'teacher') {
    
    newMark.selectCell();
    newMark.makeChange();
    getElement('#saveChange').addEventListener('click', () => {
        newMark.saveChange();
    
    })
} else{
    newMark.titleComment()
}
getElement('div.overflowProgress').addEventListener('wheel', (event) =>{
    event.currentTarget.scrollLeft += event.deltaY; 
    event.preventDefault();
})




