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
let basket = document.querySelectorAll('.basket');
let cartArray = [];
let modal = document.querySelector('.modal')
let closeBtn = document.querySelector('.modal__close')
let blur = document.querySelector('.main-container')
let cartPrice = 0;
let totalAmount = document.querySelector('.cart-footer__total-amount').querySelector('span')
let totalSum = document.querySelector('.cart-footer__total-sum').querySelector('span')

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
        if(localStorage.cart) {
            getFromLocalStorage(); // чтобы отображалось, что карточки добавлены
        }
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
    let amountInCart = document.querySelectorAll('.basket__amount')
    if(cartArray.length) {
        amountInCart.forEach(amount => {
            amount.classList.remove('hidden')
            amount.innerHTML = cartArray.length;
        })
        
    } else {
        amountInCart.forEach(amount => {
            amount.classList.add('hidden')
            amount.innerHTML = '';
            localStorage.clear()
        })
    }
}
basket.forEach(basket => {
    basket.addEventListener('click', function() {
        modal.classList.toggle('hidden');
        blur.classList.toggle('blur');
        cartPrice = 0;
        const modalMain = document.querySelector('.modal__main');
        if(cartArray.length) {
            cartArray.forEach(pic => {
                const cartItem = document.createElement('div');
                cartItem.className = "modal__cart-item cart-item"
                cartItem.innerHTML = `
                <img class="cart-item__img" src="${pic.image}">
                <p class="cart-item__artist">${pic.artist}</p>
                <h3 class="cart-item__name">${pic.title}</h3>
                <p class="cart-item__materials">${pic.material}</p>
                <p class="cart-item__price">${pic.price} руб</p>
                <button class="cart-item__delete-btn">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="close-btn">
                    <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M6.75 6.75C6.94891 6.55109 7.2187 6.43934 7.5 6.43934C7.7813 6.43934 8.05109 6.55109 8.25 6.75L23.25 21.75C23.4489 21.9489 23.5606 22.2187 23.5606 22.5C23.5606 22.7813 23.4489 23.0511 23.25 23.25C23.0511 23.4489 22.7813 23.5606 22.5 23.5606C22.2187 23.5606 21.9489 23.4489 21.75 23.25L6.75 8.25C6.55109 8.05109 6.43934 7.7813 6.43934 7.5C6.43934 7.21869 6.55109 6.94891 6.75 6.75Z" fill="#2C2D35"/>
                    <path id="Vector_2" fill-rule="evenodd" clip-rule="evenodd" d="M23.25 6.75C23.4489 6.94891 23.5607 7.2187 23.5607 7.5C23.5607 7.7813 23.4489 8.05109 23.25 8.25L8.25001 23.25C8.0511 23.4489 7.78132 23.5606 7.50001 23.5606C7.21871 23.5606 6.94893 23.4489 6.75002 23.25C6.55111 23.0511 6.43936 22.7813 6.43936 22.5C6.43936 22.2187 6.5511 21.9489 6.75002 21.75L21.75 6.75C21.9489 6.55109 22.2187 6.43934 22.5 6.43934C22.7813 6.43934 23.0511 6.55109 23.25 6.75Z" fill="#2C2D35"/>
                    </g>
                    </svg>
                </button>
                `
                cartPrice += pic.price;
                modalMain.append(cartItem);
            })
            totalAmount.textContent = cartArray.length;
            totalSum.textContent = cartPrice;
        } else {
            modalMain.innerHTML = 'Корзина пуста'
        }
    
    })
})

blur.addEventListener('click', function(e) {
    if (e.target.closest('.main-container').classList.contains('blur')) {
        modal.classList.toggle('hidden')
        blur.classList.toggle('blur')
        document.querySelector('.modal__main').innerHTML = '';
    }
})

closeBtn.addEventListener('click', function() {
    modal.classList.toggle('hidden')
    blur.classList.toggle('blur')
    document.querySelector('.modal__main').innerHTML = '';
})

modal.addEventListener('click', function(e) {
    if(e.target.closest('.cart-footer__checkout')) {
        console.log('Спасибо за покупку');
    } else if (e.target.closest('.cart-item__delete-btn')) {
        e.target.closest('.cart-item').remove();
        removeFromCartFromModal(e);
        totalAmount.textContent = cartArray.length;
        totalSum.textContent = cartPrice;
        updateCardsButtons();
        console.log(cartArray.length);
        if (!cartArray.length) {
            document.querySelector('.modal__main').innerHTML = 'Корзина пуста'
        }
    } else if(e.target.closest('.cart-footer__clear-cart')) {
        document.querySelector('.modal__main').innerHTML = 'Корзина пуста';
        cartArray = [];
        cartPrice = 0;
        totalAmount.textContent = 0;
        totalSum.textContent = 0;
        updateCardsButtons();
    }
})

function updateCardsButtons() {
    let cards = document.querySelectorAll('.reproduction__picture');
    for (let el of cards) {
        if(cartArray.length) {
            if(cartArray.find(name => name.title == el.querySelector('.picture__name').textContent)) {
                el.querySelector('.picture__btn').classList.add('added');
                el.querySelector('.picture__btn').innerText = 'Добавлено';
            } else {
                el.querySelector('.picture__btn').classList.remove('added');
                el.querySelector('.picture__btn').innerText = 'В корзину';
            }
        } else {
            el.querySelector('.picture__btn').classList.remove('added');
            el.querySelector('.picture__btn').innerText = 'В корзину';
        }
        
    }
    changeCartAmount();
}

function removeFromCartFromModal(event) {
    let nameOfAuthor = event.target.closest('.cart-item').querySelector('.cart-item__artist').textContent;
    let nameOfPicture = event.target.closest('.cart-item').querySelector('.cart-item__name').textContent;
    for (let obj of cartArray) {
        if(obj.artist === nameOfAuthor && obj.title === nameOfPicture) {
            cartPrice -= obj.price;
            cartArray.splice(cartArray.indexOf(obj), 1)
            localStorage.setItem('cart', JSON.stringify(cartArray))
        }
    }
    changeCartAmount()
}