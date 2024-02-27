// получить данные из БД
import {data as art} from './data.js'
// чтобы сразу отфильтровано было по франции
let newData = art.filter(el => el.country.toLowerCase() === 'france')
let button = document.querySelector('.header-mobile__burger-btn');
let mobile = document.querySelector('.menu-mobile');
let item = document.querySelectorAll('.menu-mobile__item');
let countryButtons = document.querySelectorAll('.filter__country');
const container = document.querySelector('.reproduction__cards-container')
let localStorage = window.localStorage;
let basket = document.querySelector('.basket');
let cartArray = [];
let modal = document.querySelector('.modal')
let closeBtn = document.querySelector('.modal__close')

button.addEventListener('click', function() {
    mobile.classList.remove('d-none');
})

item.forEach(el => {
    el.addEventListener('click', function() {
        mobile.classList.add('d-none');
    })
})

// запуск функции сразу с францией
renderCard(newData)
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
    card.className = "reproduction__picture picture";

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

//логика фильтры
for(let el of countryButtons){
    el.addEventListener('click', function(){
        let btnCountryId = el.getAttribute('id').toLowerCase()
        let filteredArt = art.filter(el => el.country.toLowerCase() === btnCountryId)
        container.innerHTML = ''
        for(let btn of countryButtons) {
            btn.classList.remove('active')
        }
        el.classList.add('active')
        renderCard(filteredArt)
        getFromLocalStorage(); // чтобы отображалось, что карточки добавлены
    })
}

//логика корзины
container.addEventListener('click', function(e) {
    if(e.target.classList.contains('picture__btn')) {
        let toCartButton = e.target;
        toCartButton.classList.toggle('added');
        if (toCartButton.classList.contains('added')) {
            toCartButton.textContent = 'Добавлено';
            addToCart(e, art);
        } else {
            toCartButton.textContent = 'В корзину';
            removeFromCart(e, art)
        }
    }
})

function addToCart(event, art) {
    let nameOfAuthor = event.target.closest('.reproduction__picture').querySelector('.picture__artist').textContent;
    let nameOfPicture = event.target.closest('.reproduction__picture').querySelector('.picture__name').textContent;
    for (let obj of art) {
        if(obj.artist === nameOfAuthor && obj.title === nameOfPicture) {
            cartArray.push(obj)
            localStorage.setItem('cart', JSON.stringify(cartArray))
        }
    }
    changeCartAmount()
}

function removeFromCart(event) {
    let nameOfAuthor = event.target.closest('.reproduction__picture').querySelector('.picture__artist').textContent;
    let nameOfPicture = event.target.closest('.reproduction__picture').querySelector('.picture__name').textContent;
    for (let obj of cartArray) {
        if(obj.artist === nameOfAuthor && obj.title === nameOfPicture) {
            cartArray.splice(cartArray.indexOf(obj), 1)
            localStorage.setItem('cart', JSON.stringify(cartArray))
        }
    }
    changeCartAmount()
}

if(localStorage.cart) {
    getFromLocalStorage()
}

function getFromLocalStorage() {
    cartArray = JSON.parse(localStorage.getItem('cart'))

    let cards = document.querySelectorAll('.reproduction__picture');
    for (let el of cards) {
        if(cartArray.find(name => name.title == el.querySelector('.picture__name').textContent)) {
            el.querySelector('.picture__btn').classList.add('added');
            el.querySelector('.picture__btn').innerText = 'Добавлено';
        }
    }
    changeCartAmount();
}

function changeCartAmount() {
    let amountInCart = document.querySelector('.basket__amount')
    if(cartArray.length) {
        amountInCart.classList.remove('hidden')
        amountInCart.innerHTML = cartArray.length;
    } else {
        amountInCart.classList.add('hidden')
        amountInCart.innerHTML = '';
        localStorage.clear()
    }
}
basket.addEventListener('click', function() {
    modal.classList.toggle('hidden')
})

closeBtn.addEventListener('click', function() {
    modal.classList.toggle('hidden')
})