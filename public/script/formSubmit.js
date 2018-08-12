import formSubmitPostJson  from "./formSubmitPostJson.js";
import getElement  from "./getElement.js";

export default class FormSubmit {
    constructor (name) {
        this.form = getElement(`[name=${name}]`);
        this.formElements = this.form.elements;
        this.valueTest = {
            testValueName: /[a-zA-Z0-9А-Яа-я-]+/,
            testValueDateBirth: /\d{1,2}.\d{1,2}.\d{4}/,
            testValueEmail: /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/,
            testValuePassword: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/,
        };
        this.resultsTests = {};
    }

    test() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
        });
        this.form.addEventListener('keydown', event => {
            let index;
            if (event.keyCode === 13) {
                for (let i = 0; i < this.formElements.length; i++) {
                    if (event.target === this.formElements[i]) {
                        index = i;
                        break;
                    }
                };
                if (index === this.formElements.length-1) {
                    index = 0;
                };
                this.formElements[index+1].focus();
            }
        });
        
        this.form.addEventListener('focus', (event) => {
            this.removeErrorElemment(event.target.name);       
        }, true);
        this.form.addEventListener('change', (event) => {
            const   input = event.target,
                value = event.target.value;
            let testName;
            switch (input.name) {
                case 'userSurname':
                    testName = this.valueTest.testValueName;
                    this.resultTest(input, testName, value);   
                    break;

                case 'userName':
                    testName = this.valueTest.testValueName;
                    this.resultTest(input, testName, value);   
                    break;

                case 'userFatherName':
                    testName = this.valueTest.testValueName;
                    this.resultTest(input, testName, value);   
                    break;

                case 'userDateBirth':
                    testName = this.valueTest.testValueDateBirth;
                   this.resultTest(input, testName, value);   
                    break;

                case 'userEmail':
                    testName = this.valueTest.testValueEmail;
                    this.resultTest(input, testName, value);   
                    break;

                case 'userPassword':
                    testName = this.valueTest.testValuePassword;
                    this.resultTest(input, testName, value);   
                    break;
            }
        })
    }

    createErrorElemment(elemEvent) {
        const errorTextConteiner = document.createElement('span');

        errorTextConteiner.innerText = 'Введенные данные не соответствуют условию';
        errorTextConteiner.style.color = 'red';
        errorTextConteiner.id = `error${elemEvent.name}`;
        this.form.insertBefore(errorTextConteiner, elemEvent.parentNode.nextElementSibling)
    }

    removeErrorElemment(nameErrorElement) {
        if (getElement(`#error${nameErrorElement}`)) {
            this.form.removeChild(getElement(`#error${nameErrorElement}`))
        }
    }

    resultTest(elem, testName, value) {
        this.resultsTests[elem.name] = testName.test(value);

        if (!this.resultsTests[elem.name]) {
            this.createErrorElemment(elem)
        } else {
            this.removeErrorElemment(elem.name);
        }
    }

    valueFormJson() {
        const result = {};
        let resultJson;

        for (let i = 0; i < this.formElements.length ; i++) {
            let input = this.formElements[i];
        
                if ((input.type === 'radio' && !input.checked) || input.value ==='') {
                    continue
                }
                let key = input.name,
                    value = input.value;
                result[key] = value;
            };
            console.log('result=' + result)
            resultJson = JSON.stringify(result);
        
            return  resultJson;
        

    }

    submitJson(responsCallback) {
        const valuesElementsForm = [],
            valueResultsTests = [];
        let allInputFilled,
            allValueResultTrue;
         
        for (let i = 0; i < this.formElements.length; i++) {
            const value = this.formElements[i].value;
            valuesElementsForm.push(value);
        };

        for (let key in  this.resultsTests) {
            valueResultsTests.push(this.resultsTests[key])
        };
        
        allInputFilled = valuesElementsForm.every(item => item !== '');
        allValueResultTrue = valueResultsTests.every(item => item === true);
        if (allInputFilled && allValueResultTrue) {
            const valueForm = this.valueFormJson();
            formSubmitPostJson('/registration',valueForm, responsCallback);
    
        } else {
                alert('Не все поля заполнены')
        }
    }
}