import FormSubmit  from "./FormSubmit.js";
import formSubmitPostJson  from "../formSubmitPostJson.js";
import getElement  from "../getElement.js";

export default class GroupTeacher extends FormSubmit{
    constructor(nameForm){
        super(nameForm);

        this.students =[];
        this.indexChangingUser;
    }
    addGroup() {
        if (this.ValuesInputs['nameGroup'] !== "") {
            getElement('caption').innerText = `#${this.ValuesInputs['nameGroup']}`;
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
    addSubject() {
        let response;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/subject');
        
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
        xhr.addEventListener('load', () => {
            response = xhr.responseText;
            callback(response);
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
        formSubmitPostJson(url,JSON.stringify(this.students), (respons) => {
            this.modalWindow(respons);
            this.arrayInput.forEach(item => {
                item.value = '';
            })
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