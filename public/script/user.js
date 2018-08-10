import getCookieFromJSON from "./getCookieFromJSON.js";
import getElement from "./getElement.js";

const user = getElement('#user'),
    fullName = getElement('#fullName'),
    userName = getCookieFromJSON('name'),
    userSurname = getCookieFromJSON('surname'),
    userFathername = getCookieFromJSON('fathername');


user.innerText = `${userName} ${userSurname}`;
fullName.innerText = `${userSurname} ${userName} ${userFathername}`;

const dataUser = getElement('#information').appendChild(document.createElement('ul'));

logOut.addEventListener('click', () => {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/user');

    xhr.send();
    xhr.onload = function () {
        alert(this.responseText)
    }
   
});



