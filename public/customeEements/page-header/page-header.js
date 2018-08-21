function getCookieFromJSON(nameCookie){

    const cookie = document.cookie,
        decodedCookie = decodeURIComponent(cookie);
    let first, 
        last,
        result = undefined, 
        resultJson,
        dataCookie;
    
        for (var i= 0; i< decodedCookie.length;i++) {
            
            if (decodedCookie.charAt(i) === '{') {
                first = i
            };
            if (decodedCookie.charAt(i) === '}'){
                last = i
        };
        };
        if (first &&  last) {
            resultJson = decodedCookie.substring(first, last + 1);
            dataCookie = JSON.parse(resultJson);
            result = dataCookie[nameCookie];
        }
    return result
    
};
    
let template = document.currentScript.ownerDocument.querySelector('#page-header');

const firstLi =document.querySelector("[slot='first-li']"),
    lastLi = document.querySelector("[slot='last-li']"),
    aInLi = document.createElement('a');

if (getCookieFromJSON('id')) {
    const userName = getCookieFromJSON('name'),
        userSurname = getCookieFromJSON('surname'),
        id = getCookieFromJSON('id');
    aInLi.setAttribute('href', `/user/${id}`);
    aInLi.innerText = `${userName} ${userSurname}`;
    firstLi.appendChild(aInLi);
    lastLi.id = 'logOut';
    lastLi.innerText = 'Выход';
} else {
    firstLi.id = 'enter';
    firstLi.innerText = 'ВХОД';
    aInLi.setAttribute('href','/registration');
    aInLi.innerText = 'Регистрация';
    lastLi.appendChild(aInLi);
};

const logOut = document.getElementById('logOut');
if (logOut) {

    logOut.addEventListener('click', () => {
        var xhr = new XMLHttpRequest();
    
        xhr.open('GET', '/logout');
    
        xhr.send();
        xhr.onload = function () {
            document.location.href = '/';
        }
    
       
    });
};

if (document.location.pathname === "/registration") {
    document.getElementById('enter').addEventListener('click', () => {
        document.location.href = '/';
    })
};

class PageHeader extends HTMLElement {
   
    constructor() {
      super();
      let shadow = this.attachShadow({mode: 'open'});
      shadow.appendChild(template.content.cloneNode(true));
    }
};

customElements.define('page-header', PageHeader);