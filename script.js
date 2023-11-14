let button = document.querySelector('.header-mobile__burger-btn');

let mobile = document.querySelector('.menu-mobile');

let item = document.querySelectorAll('.menu-mobile__item');

button.addEventListener('click', function() {
    mobile.classList.remove('d-none');
})

item.forEach(el => {
    el.addEventListener('click', function() {
        mobile.classList.add('d-none');
    })
})