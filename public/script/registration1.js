import formSubmitPostJson  from "./formSubmitPostJson.js";
import formValueJson  from "./formValueJson.js";
import getElement  from "./getElement.js";

const formTest = getElement(`[name=${'registration'}]`),
    formElements = formTest.elements,
    valuesTest = {
        testValueName: /[a-zA-Z0-9А-Яа-я-]+/,
        testValueDateBirth: /\d{1,2}.\d{1,2}.\d{4}/,
        testValueEmail: /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/,
        testValuePassword: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/,
    },
    valueResultsTests = [];

for (let i = 0; i <formElements.length; i++) {
    const formElement = formElements[i];
    formElement.addEventListener('focus', event => {
        const nextElement = event.target.parentNode
        .nextElementSibling;
        if (nextElement) {
            nextElement.innerText = '';
        }
    });
    formElement.addEventListener('change', event => {
        const value = event.target.value,
            nextElement = event.target.parentNode
            .nextElementSibling,
            name = formElement.name ;
        let testName;
        switch (name) {
            case 'userSurname':
                testName = valuesTest.testValueName;
                resultTest(i,testName,nextElement, value);   
                break;
            case 'userName':
                testName = valuesTest.testValueName;
                resultTest(i,testName,nextElement, value);   
                break;
            case 'userFatherName':
                testName = valuesTest.testValueName;
            
                resultTest(i,testName,nextElement, value);   
                break;
            case 'userDateBirth':
                testName = valuesTest.testValueDateBirth;
            
                resultTest(i,testName,nextElement, value);   
                break;
            case 'userEmail':
                testName = valuesTest.testValueEmail;
            
                resultTest(i,testName,nextElement, value);   
                break;
            case 'userPassword':
                testName = valuesTest.testValuePassword;
            
                resultTest(i,testName,nextElement, value);   
                break;
        }
    })
};
formTest.addEventListener('submit', event => {
    event.preventDefault();
});

const registrationButton = document.getElementById('registrationButton');


registrationButton.addEventListener('click', () => {

    const allValuesElementsForm = [];
    let trueAllValueResultsTests,
        filledAllValuesElementsForm;
    
    for (let i = 0; i < formElements.length; i++) {
        const value = formElements[i].value;
        allValuesElementsForm.push(value);
        
    }
    filledAllValuesElementsForm = allValuesElementsForm.every(item => item !== '');
    trueAllValueResultsTests = valueResultsTests.every(item => item ===true);
    if (filledAllValuesElementsForm && trueAllValueResultsTests) {
        
        const valueForm = formValueJson('registration');
        
        formSubmitPostJson('/registration',valueForm, responseModalWindow);

       
    } else {
        if (!filledAllValuesElementsForm) {
            alert('Не все поля заполнены')
        }
    }
});

    
function resultTest(index,testName,elemForErroText, value) {
    valueResultsTests[index]= testName.test(value);

    
    if (!valueResultsTests[index]) {
        elemForErroText.innerText = 'Введенные данные не соответствуют условию';
        elemForErroText.style.color = 'red';
    }
};


function responseModalWindow(response){

    const h1Res = document.querySelector('#response'),
        modalWindowReg = document.querySelector('.modalWindowRegistration'),
        buttonOnModalReg = document.getElementById('okRegistr'),
        buttonOnModalRegA = document.getElementById('aRegistr');

    modalWindowReg.classList.add('openModalWindow');
    let text;
    if (response === 'yes') {
        text = ' Вы успешно зарегистрированны! Для дальнейшей работы войдите на сайт под своим именем.';
        buttonOnModalRegA.setAttribute('href', './index.html')
    } else {
        text = 'Введенный e-mail уже использутся другим пользователем. Пройдите регистрацию еще раз.';
        buttonOnModalReg.addEventListener('click', () => {
            modalWindowReg.classList.remove('openModalWindow');
        })
    }
    
    h1Res.innerText = text;
    console.log(response);
}





