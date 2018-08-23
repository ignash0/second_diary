import FormSubmit  from "./FormSubmit.js";
import formSubmitPostJson  from "../formSubmitPostJson.js";
import getElement  from "../getElement.js";

export default class GroupTeacher extends FormSubmit{
    constructor(nameForm){
        super(nameForm);
        this.subjectsTeachets= [];
        this.students =[];
        this.indexChangingUser;
    }
    addGroup() {
        if (this.ValuesInputs['nameGroup'] !== "") {
            getElement('#result  caption').innerText = `Группа №${this.ValuesInputs['nameGroup']}`;
            getElement('[name="nameGroup"]').setAttribute('disabled', 'true');

        } else {
            this.modalWindow('Не указано название группы')
        }
    }
    addUser() {
        if (!this.testForm) {
            this.modalWindow('Не все поля заполнены или заполнены не верно')
        } else {
            this.ValuesInputs;
            
            if (this.indexChangingUser !== undefined) {
                this.students.splice(this.indexChangingUser,1,this.ValuesInputs);
                this.indexChangingUser = undefined;
            } else {
                this.students.push(this.ValuesInputs);
            }
            const data = document.querySelectorAll('table>tr');
            if (data) {
                data.forEach(item => {
                    item.parentNode.removeChild(item);
                })
            }
            this.createTableRow();
            this.arrayInput.forEach(item => {
                item.name !== 'nameGroup' ? item.value = '' : item.value = this.ValuesInputs['nameGroup'];
            })
        }
    }
    addSubjectTeacher() {
        let subjectInput = getElement('[list="subject"]').value;
        let teacherInput = getElement('[list="teacher"]').value;
        let newSbbjectTeacher = {};
        let id = getElement('[list="teacher"]').name;
        newSbbjectTeacher.subjectName = subjectInput;
        newSbbjectTeacher.teacherId = id;
        
        this.subjectsTeachets.push(newSbbjectTeacher);

        let elemP = document.createElement('p');
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        span1.innerText = subjectInput;
        span2.innerText = teacherInput;
        let elemA = document.createElement('a');
        elemA.setAttribute('href', `/user/${id}`);
        elemA.setAttribute('target', '_blank');
        elemA.appendChild(span2);
        elemP.appendChild(span1);
        elemP.appendChild(elemA);
        
        getElement('#result > div').appendChild(elemP);
        getElement('[list="subject"]').value = '';
        getElement('[list="teacher"]').value = '';

    }
    getSubject() {
        let response;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/subject');
        
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
        xhr.addEventListener('load', () => {
            response = xhr.responseText;
            let subjectTeachers = JSON.parse(response);

            let subject = subjectTeachers.map(elem => elem['subjectName']);
            this.createOptionDatalist(subject, 'datalist#subject');

            let inputSubject = getElement('[list="subject"]');
            let inputTeacher = getElement('[list="teacher"]');

            inputSubject.addEventListener('change', event => {
                let datalistTeacherOPtions = document.querySelectorAll('datalist#teacher > option');
                datalistTeacherOPtions.forEach(item => item.parentNode.removeChild(item));
                
                this.getTeacher(subjectTeachers, event.target.value);
            })
            inputTeacher.addEventListener('change', event => {
                let teachers = [];
                subjectTeachers.forEach(item => {
                    item['teachers'].forEach(elem => {
                        teachers.push(elem)
                    })
                });
                let selectTeacher = teachers.filter(elem => elem.name === event.target.value);
                event.target.name = selectTeacher[0].id;
            })
        })
    }
    getTeacher(subjectTeachers, value) {

        let selectSubject = subjectTeachers.filter(elem => elem['subjectName'] === value);
        console.log()
        if (selectSubject.length >= 1) {
            let teachers = selectSubject[0].teachers.map(item => item.name);
            this.createOptionDatalist(teachers, 'datalist#teacher');
        }
    }
    createOptionDatalist(array, selectorDatalist) {
        array.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            getElement(selectorDatalist).appendChild(option);
        })
    }

    createTableRow() {
        this.students.forEach(item => {
            const   row = document.createElement('tr'),
                button = document.createElement('button'),
                table = getElement('table');

            let idCell =document.createElement('th');
            idCell.innerText = String(this.id());
            row.appendChild(idCell);
            for (let key in item) {
                let   cell = document.createElement('th');
                
                let text;
                text = item[key];
                if (key === 'nameGroup') {
                    continue;
                }
                cell.innerText = text;
                row.appendChild(cell);
            }
            button.id = item['userEmail'];
            button.innerText = 'изменить';
            row.appendChild(document.createElement('th').appendChild(button));
            table.appendChild(row);    
        });
    }

    changUser(button) {
        console.log(this.students);
        const changingUser = this.students.filter(elem => elem['userEmail'] === button.id);
        console.log(this.students);
        for(let key in changingUser[0]) {
            this.arrayInput.forEach(item => {
                item.name === key ? item.value = changingUser[0][key]:undefined
            })
        };
        button.parentNode.classList.add('change');
        this.indexChangingUser = this.students.indexOf(changingUser[0]);
    }

    creatGroupTeacher(url) {
        this.students.forEach(item => item['subject'] =  this.subjectsTeachets);
       
        formSubmitPostJson(url,JSON.stringify(this.students), (respons) => {
            this.modalWindow(respons);
            this.arrayInput.forEach(item => {
                item.value = '';
            })
            let tr = document.querySelectorAll('table > tr');
            tr.forEach(item => {
                item.parentNode.removeChild(item)
            });

            let resultP = document.querySelectorAll('#result > div > p');
            resultP.forEach(item => {
                item.parentNode.removeChild(item)
            });
        })
    }

    get ValuesInputs() {
        const valuesInputs = {};
        this.arrayInput.forEach((item) => {valuesInputs[item.name] = item.value})
        return valuesInputs
    }
    id(){
        const lastChildTable = getElement('table').lastChild;
        let result;
          if (lastChildTable.nodeName === 'TR') {
            result = Number(lastChildTable.firstElementChild.textContent) + 1 
          } else {
              result = 1;
          }
        return result
    }
    modalWindow(text) {
        getElement('modal-window').setAttribute('text', text);
        getElement('modal-window').setAttribute('open', 'true');
    }

}