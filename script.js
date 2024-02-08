// получить данные из БД
import {data as art} from './data.js'
let button = document.querySelector('.header-mobile__burger-btn');
let mobile = document.querySelector('.menu-mobile');
let item = document.querySelectorAll('.menu-mobile__item');
let countryButtons = document.querySelectorAll('.filter__country');
const container = document.querySelector('.reproduction__cards-container')


button.addEventListener('click', function() {
    mobile.classList.remove('d-none');
})

item.forEach(el => {
    el.addEventListener('click', function() {
        mobile.classList.add('d-none');
    })
})
// запуск функции
renderCard(art)
// передать данные из БД в карточку
function renderCard(data) {
    data.forEach(el => {
        createCard(el)
    })
}

// создаем карточку
function createCard(obj) {
    // создаем контейнер для карточек
    // создает карточку
    const card = document.createElement('article') 
    // присвоили класс
    card.className = "reproduction_picture picture";

    //создаем картинку
    const img = document.createElement('img')
    img.className = "picture__img";
    img.setAttribute("src", obj.image) // image - ключ где картинка

    // создаем текстовый блок
    const card_text = document.createElement('div')
    card_text.className = "picture__text";

    card_text.innerHTML = `
    <p class="picture__artist">${obj.artist}</p>
    <h3 class="picture__name">${obj.title}</h3>
    <p class="picture__materials">${obj.material}</p>
    <p class="picture__price">${obj.price} руб</p>`

    // Создаем кнопку
    const button = document.createElement('button')
    // Даем ей класс
    button.className = "picture__btn btn btn_green";
    // Пишем текст на кнопке
    button.textContent = 'В корзину'
    // добавляем атрибут
    button.setAttribute("area-label", 'Добавить в корзину')

    // создаем карточку
    container.append(card)
    // создаем элементы
    card.append(img, card_text, button)

}

for(let el of countryButtons){
    el.addEventListener('click', function(){
        let btnCountryId = el.getAttribute('id').toLowerCase()
        let filteredArt = art.filter(el => el.country.toLowerCase() === btnCountryId)
        container.innerHTML = ''
        createCard(filteredArt)
    })
}