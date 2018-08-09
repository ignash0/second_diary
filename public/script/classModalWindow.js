'use strict';

class ModalWindow {
    constructor (name){
        this.name = name;
        

    }
    setModalWindow() {
        this.modalWindow = document.querySelector(`.${this.name}`);

        return this.modalWindow;
      }
    //   set modalWindow(name) {
    //     this.name = name;
    //   }
    
    open() {modalWindow
        const buttonEnter = document.getElementById('enter');

        buttonEnter.addEventListener('click', () => {
            modalWindowEnter.classList.add('openModalWindow');
        });
    };

    close() {
        const cancelButton = document.querySelector("#cancel");


    }
}
