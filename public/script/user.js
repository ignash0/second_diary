import getCookieFromJSON from "./getCookieFromJSON.js";
import getElement from "./getElement.js";

const user = document.getElementById('#user'),
    fullName = getElement('#fullName'),
    userName = getCookieFromJSON('name'),
    userSurname = getCookieFromJSON('surname'),
    userFathername = getCookieFromJSON('fathername');

fullName.innerText = `${userSurname} ${userName} ${userFathername}`;

window.addEventListener('load', () => {
    const user = new User;
    user.userData;
});

class User {
    constructor() {
    }
    
    get userData() {
        this.requestServer()
    }

    requestServer() {
        const id = {};
        id['id'] = getCookieFromJSON('id');
        let response;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/user');
        
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(id));
        xhr.addEventListener('load', () => {
            response = xhr.responseText;
            this.userInformation(response)
            
        })
    }

    userInformation(response){
        const data = JSON.parse(response);
            
        const information = getElement('#information').appendChild(document.createElement('ul'));

        for (let key in data) {
            const list = document.createElement('li');
            switch (key) {
                case 'userDateBirth':
                    list.innerText = `Дата рождениея: ${data[key]}`;
                    information.appendChild(list);     
                    break;

                case 'userEmail':
                    list.innerText = `E-mail: ${data[key]}`;
                    information.appendChild(list);     
                    break;

                case 'userPlaceWork':
                    list.innerText = `Место работы: ${data[key]}`;
                    information.appendChild(list);     
                    break;
                
                case 'userPosition':
                    list.innerText = `Должность: ${data[key]}`;
                    information.appendChild(list);     
                    break;

                case 'statue':
                    list.innerText = `Статус: ${data[key]}`;
                    information.appendChild(list);     
                    break;
            }
        }
    }
};







