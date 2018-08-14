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

    class PageHeader extends HTMLElement {
        
        constructor() {
          super();

          
          let firstLi = document.querySelector('#page-header menu ul li:first-child'),
          lastLi = document.querySelector('#page-header menu ul li:last-child'),
          aInLi = document.createElement('a');
          
          if (getCookieFromJSON('email')) {
              const userName = getCookieFromJSON('name'),
                userSurname = getCookieFromJSON('surname');
                
                
                aInLi.setAttribute('href','./user.html');
                aInli.innerText = `${userName} ${userSurname}`;
                firstLi.appendChild(aInLi);
                
                lastLi.id = 'logOut';
                lastLi.innerText = 'Выход';
                
            } else {
                firstLi.id = 'enter';
                firstLi.innerText = 'ВХОД';
                
                aInLi.setAttribute('href','./registration.html');
                aInLi.innerText = 'Регистрация';
                lastLi.appendChild(aInLi);
                
            };
            
            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(template.content.cloneNode(true));

        }
    };
    
    customElements.define('page-header', PageHeader);