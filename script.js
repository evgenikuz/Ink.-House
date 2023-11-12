let button = document.querySelector('.burger');

let mobile = document.querySelector('.mobile-menu');

let item = document.querySelectorAll('.item');

button.addEventListener('click', function() {
    mobile.classList.remove('d-none');
})

item.forEach(el => {
    el.addEventListener('click', function() {
        mobile.classList.add('d-none');
    })
})