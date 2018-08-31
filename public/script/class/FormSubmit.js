import formSubmitPostJson  from "../formSubmitPostJson.js";
import getElement  from "../getElement.js";

export default class FormSubmit {
    constructor (name) {
        this.form = getElement(`[name=${name}]`);
        this.formElements = this.form.elements;
        this.valueTest = {
            testValueName: /^[а-яА-ЯёЁa-zA-Z0-9]+$/,
            testValueDateBirth: /\d{1,2}.\d{1,2}.\d{4}/,
            testValueEmail: /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/,
            testValuePassword: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/,
        };
        this.resultsTests = {};
    }
    get arrayInput() {
        return Array.from(this.formElements).filter(elem => (elem.tagName !== 'BUTTON' && elem.id !== 'registrationButton'));
    }

    testInput() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
        });
        this.form.addEventListener('keydown', event => {
            let index;
            if (event.keyCode === 13) {
                for (let i = 0; i < this.arrayInput.length; i++) {
                    if (event.target === this.arrayInput[i]) {
                        index = i;
                        break;
                    }
                };
                if (index === this.arrayInput.length-1) {
                    index = 0;
                };
                this.arrayInput[index+1].focus();
            }
        });
        
        this.form.addEventListener('focus', (event) => {
            this.removeErrorElemment(event.target.name);       
        }, true);
        this.form.addEventListener('change', (event) => {
            const   input = event.target;
            let value = event.target.value,
                testName;
            switch (input.name) {
                case 'userSurname':
                    event.target.value = this.upperCase(value);  
                    testName = this.valueTest.testValueName;
                    this.resultTest(input, testName, value);
                    break;

                case 'userName':
                    event.target.value = this.upperCase(value);
                    testName = this.valueTest.testValueName;
                    this.resultTest(input, testName, value);   
                    break;

                case 'userFatherName':
                    event.target.value = this.upperCase(value);
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
    upperCase(value) {
        return value.replace(value[0], value[0].toUpperCase())
    }
    get testForm() {
        const valuesElementsForm = [],
            valueResultsTests = [];
        let allInputFilled,
            allValueResultTrue;
         
        for (let i = 0; i < this.arrayInput.length; i++) {
            let value = this.arrayInput[i].value;
            valuesElementsForm.push(value);
        };

        for (let key in  this.resultsTests) {
            valueResultsTests.push(this.resultsTests[key])
        };
        
        allInputFilled = valuesElementsForm.every(item => item !== '');
        allValueResultTrue = valueResultsTests.every(item => item === true);

        return allInputFilled && allValueResultTrue ? true : false
    }

    createErrorElemment(elemEvent) {
        const errorTextConteiner = document.createElement('span');

        errorTextConteiner.innerText = 'Введенные данные не соответствуют условию';
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

        for (let i = 0; i < this.arrayInput.length ; i++) {
            let input = this.arrayInput[i];
        
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

    submitJson(url, responsCallback) {
        if (this.testForm) {
            const valueForm = this.valueFormJson();
            formSubmitPostJson(url,valueForm, responsCallback);
            
        } else {
                alert('Не все поля заполнены')
        }
    }
}