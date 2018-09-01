import getElement  from "./getElement.js";
(function (){

    const display = document.querySelectorAll('div.container section:not(:last-child)');
    display.forEach(item => item.style.display = 'none')

})()
const slideLeft = getElement(' #left'),
    slideRight = getElement('#right'),
    section = document.querySelectorAll('section');
let index = section.length -1; // Индекс текущего слайда.

if (index === section.length -1) {
    slideRight.style.display = 'none';
}
slideRight.addEventListener('click', () => {
    slideLeft.style.display = 'block';
    section[index].style.display = 'none'; 
    section[++index].style.display = 'block'; 
    if (index === section.length - 1) { 
        slideRight.style.display = 'none';
    } else {
        slideRight.style.display = 'block';
    }
});
slideLeft.addEventListener('click', () => {

    slideRight.style.display = 'block';
    section[index].style.display = 'none';
    section[--index].style.display = 'block';
    if (index === 0) {
        slideLeft.style.display = 'none';
    }
});
