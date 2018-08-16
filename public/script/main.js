import formSubmitPostJson from "./formSubmitPostJson.js";
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
if (modalWindowEnter.buttonEnter) {
    modalWindowEnter.buttonEnter.addEventListener('click', () => {
        modalWindowEnter.openWindow();
    });
}

modalWindowEnter.cancelButton.addEventListener('click', () => {
    modalWindowEnter.closeWindow();
});

const authorizationForm = new FormSubmit('authorization'),
    buttonChekin = document.getElementById('checkin');
buttonChekin.addEventListener('click', () => {
    const data =  authorizationForm.valueFormJson();
    console.log('data='+ data);
    formSubmitPostJson('/login',data, Hello);
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
