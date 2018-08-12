import formSubmitPostJson from "./formSubmitPostJson.js";
import getCookieFromJSON from "./getCookieFromJSON.js";
import FormSubmit  from "./formSubmit.js";
import getElement  from "./getElement.js";

class ModalWindow {
    constructor(nameSelector) {
        this.name = nameSelector;
        this.modalWindow = document.querySelector(this.name);
        this.buttonEnter = document.getElementById('enter');
        this. cancelButton = document.getElementById('cancel');
    }

    openWindow() {
        this.modalWindow.classList.add('openModalWindow');
    }

    closeWindow() {
        this.modalWindow.classList.remove('openModalWindow');
    }

};

const modalWindowEnter = new ModalWindow('.modalWindowEnter');

modalWindowEnter.buttonEnter.addEventListener('click', () => {
    modalWindowEnter.openWindow();
});

modalWindowEnter.cancelButton.addEventListener('click', () => {
    modalWindowEnter.closeWindow();
});;


const authorizationForm = new FormSubmit('authorization');
const  buttonChekin = document.getElementById('checkin');

buttonChekin.addEventListener('click', () => {
    const data =  authorizationForm.valueFormJson();
    console.log('data='+ data);
    formSubmitPostJson('/login',data, Hello);
});

const   enterRegistration = document.getElementById('enterRegistrationButton'),
    userLogout = document.getElementById('userLogout'),
    greeting = document.getElementById('greeting');

if (getCookieFromJSON('email')) {
    const userName = getCookieFromJSON('name'),
    userSurname = getCookieFromJSON('surname');
    

    enterRegistration.style.display = 'none';
    userLogout.style.display = 'flex';
    greeting.innerText = `${userName} ${userSurname}`;

} else {

    enterRegistration.style.display = 'flex';
    userLogout.style.display = 'none';

}

const logOut = document.getElementById('logOut');

logOut.addEventListener('click', () => {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/logout');

    xhr.send();
    xhr.onload = function () {
        alert(this.responseText)
    }
   
});


function Hello(response) {
    const buttonCancel = document.getElementById('cancel'),
        messegButtons = document.querySelector('.modalWindowMessige .button'),
        formCheckin = document.getElementById('formCheckin'),
        modalWindowMessige =document.querySelector('.modalWindowMessige'),
        messegRespons = document.createElement('h1');
    let text;

    formCheckin.setAttribute('hidden', 'false');
    modalWindowMessige.insertBefore(messegRespons, messegButtons)
    console.log('resp='+response);
    
    if (response === 'yes') {
        text = 'Вы успешно вошли в систему!';
        buttonCancel.setAttribute('hidden', 'false');
        buttonChekin.addEventListener('click', () => {
            document.location.href = '/user.html';
        })
    } else {
        text = 'Вы ввели не верные данные!';
        buttonChekin.setAttribute('hidden', 'false');
        buttonCancel.addEventListener('click', () => {
            document.location.href = '/index.html';
            
        })
    }
    messegRespons.innerText = text;
};


class Header {
    constructor(){

    }
    userYes(){

    }
    userNo() {
        const elemUl = document.createElement('ul');
        elemUl.id = 'userLogout';
        getElement('header menu').appendChild(elemUl);

        enter.id = 'enter';

        const enter = document.createElement('li'),
            registration = document.createElement('li');

        registration.appendChild(document.createElement('a').
                        getAttribute('href', './registration.html'))
        elemUl.appendChild(enter);
        elemUl.appendChild(registration);
    }

}