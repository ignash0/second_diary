const buttonEnter = document.getElementById('enter'),
    modalWindowEnter = document.querySelector('.modalWindowEnter'),
    cancelButton = document.querySelector("#cancel");

buttonEnter.addEventListener('click', () => {
    modalWindowEnter.classList.add('openModalWindow');
});

cancelButton.addEventListener('click', () => {
    modalWindowEnter.classList.remove('openModalWindow');

});


const  buttonChekin = document.getElementById('checkin');



buttonChekin.addEventListener('click', () => {
    const data =  formValueJson('authorization');
    console.log('data='+ data);
    formSubmitPostJson('/login',data, Hello);
});

const   enterPegistration = document.getElementById('enterPegistrationButton'),
    userLogout = document.getElementById('userLogout'),
    greeting = document.getElementById('greeting');

if (getCoockieJSON('email')) {
    const userName = getCoockieJSON('name'),
    userSurname = getCoockieJSON('surname');
    

    enterPegistration.style.display = 'none';
    userLogout.style.display = 'flex';
    greeting.innerText = `${userName} ${userSurname}`;

} else {

    enterPegistration.style.display = 'flex';
    userLogout.style.display = 'none';

}

const logOut = document.getElementById('logOut');

logOut.addEventListener('click', () => {
    document.cookie = 'dataUser' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
})




function Hello(response) {
    const buttonCancel = document.getElementById('cancel'),
        messegButtons = document.querySelector('.modalWindowMessige .button'),
        formCheckin = document.getElementById('formCheckin'),
        modalWindowMessige =document.querySelector('.modalWindowMessige'),
        messegRespons = document.createElement('h1');

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

function formValueJson(formName) {
    const formValid = document.querySelector(`[name=${formName}]`),
        formElements = formValid.elements,
        result = {};
    let resultJson;
    
    formValid.addEventListener('submit', event => {
        event.preventDefault();
    });
    
    for (let i = 0; i < formElements.length ; i++) {
    let input = formElements[i];

        if ((input.type === 'radio' && !input.checked) || input.value ==='') {
            continue
        }
        const key = input.name,
            value = input.value;
        result[key] = value;
    };
    console.log('result=' + result)
    resultJson = JSON.stringify(result);

    return  resultJson;
};

function formSubmitPostJson(url,data, callback){
    let response;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
    xhr.onload = function(){
        response = this.responseText;
        callback(response);
    };
};

    
function getCoockieJSON(nameCookie){

    const cookie = document.cookie,
        decodedCookie = decodeURIComponent(cookie);
    let first, 
        last,
        result, 
        resultJson;
    
    if (decodedCookie.length > 1) {

        for (var i= 0; i< decodedCookie.length;i++) {
            
            if (decodedCookie.charAt(i) === '{') {
                first = i
            };
            if (decodedCookie.charAt(i) === '}'){
                last = i
            };
        };
        
    
    resultJson = decodedCookie.substring(first, last + 1);
    result = JSON.parse(resultJson);
    
    return result[nameCookie];

    }

};
    

