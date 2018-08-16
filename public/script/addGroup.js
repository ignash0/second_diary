import FormSubmit  from "./formSubmit.js";
import formSubmitPostJson  from "./formSubmitPostJson.js";
import getElement  from "./getElement.js";
class Group extends FormSubmit{
    constructor(nameForm){
        super(nameForm);
        this.students =[];
        this.indexChangingUser;
    }
    addGroup() {
        console.log(this.ValuesInputs['nameGroup'])
        if (this.ValuesInputs['nameGroup'] !== "") {
            getElement('caption').innerText = `#${this.ValuesInputs['nameGroup']}`;
            getElement('[name="nameGroup"]').setAttribute('disabled', 'true');

        } else {
            alert('Не указано название группы')
        }
    }
    addUser() {
        if (!this.testForm) {
            alert('Не все поля заполнены или заполнены не верно')
        } else {
            const data =document.querySelectorAll('table>tr'),
                table = getElement('table');
            if (data) {
                data.forEach(item => {
                    item.parentNode.removeChild(item);
                })
            }
            this.ValuesInputs;
            
            if (this.ValuesInputs['nameGroup'] === "") {
                alert('Не указано название группы')
            } else {
                console.log(this.students);
                if (this.indexChangingUser !== undefined) {
                    this.students.splice(this.indexChangingUser,1,this.ValuesInputs);
                    this.indexChangingUser = undefined;
                } else {
                    this.students.push(this.ValuesInputs);
                }
                this.createTableRow();
                this.arrayInput.forEach(item => {
                    item.name !== 'nameGroup' ? item.value = '' : item.value = this.ValuesInputs['nameGroup'];
                })
            }
        }
    }
    createTableRow() {
        this.students.forEach(item => {
            const   row = document.createElement('tr'),
                button = document.createElement('button');
            for (let key in item) {
                const   cell = document.createElement('th');
                
                let text;
                text = item[key];
                if (key === 'nameGroup') {
                    text = String(this.id());
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

}
const group = new Group('student');

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

    formSubmitPostJson('/group',JSON.stringify(group.students), responsServer)
    function responsServer(respons) {
        alert(respons);
    }
})

