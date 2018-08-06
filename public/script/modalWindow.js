
window.onload = function () {

    const buttonEnter = document.getElementById('enter'),
        modalWindowEnter = document.querySelector('.modalWindowEnter'),
        cancelButton = document.querySelector("[name='cancel']");

    buttonEnter.addEventListener('click', () => {
        modalWindowEnter.classList.add('openModalWindow');
    });

    cancelButton.addEventListener('click', () => {
        modalWindowEnter.classList.remove('openModalWindow');
       
    });

    const chekin = document.getElementById('chekin');
chekin.addEventListener('click', () => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login');
    const userData = {
        userEmail: f,
        userPassword: d
    };
    xhr.setRequestHeader('Content -Type', 'application/json');
    xhr.sent(JSON.stringify(userData));
    xhr.onload = function(){
        alert(this.responseText)
    }
})
}