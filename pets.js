const burgerMenu = document.querySelector('.burger-btn');
const blockNav = document.querySelector('.header-block__nav');
const blockNavItems = document.querySelector('.header-block__nav-items');
const blockBurger = document.querySelector('.header-block__burger');

const petCards = document.querySelector('.our-friends-block__pets-cards');
const popupContainer = document.querySelector('.popup-container');

const numberPage = document.querySelector('.pagination-page');
const arrowPaginationRight = document.querySelector('.arrow-pagination-right');
const arrowPaginationDoubleRight = document.querySelector('.arrow-pagination-double-right');
const arrowPaginationLeft = document.querySelector('.arrow-pagination-left');
const arrowPaginationDoubleLeft = document.querySelector('.arrow-pagination-double-left');


let dataArray = [];
const dataArrayPagination = [];
let indexPagination = 0;
let numberPagination = 1;

//отрисовываю карточки при загрузке страницы
function displayCard(dataArrayPet) { 
  for(let i = 0; i < dataArrayPet.length; i++) {
    let card = dataArrayPet[i];

    const imageLink = card.img;
    const name = card.name;
    const type = card.type;
    
    const cardPet = document.createElement('div');
    const imagePet = document.createElement('img');
    const namePet = document.createElement('span');
    const buttonLernMore = document.createElement('button');

    cardPet.classList.add('pet-card', 'pets-block');
    imagePet.classList.add('pet-image');
    namePet.classList.add('pet-name', 'title-font');
    buttonLernMore.classList.add('btn-link', 'btn-secondary', 'title-font');

    imagePet.setAttribute('src', imageLink);
    imagePet.setAttribute('alt', `${name}-${type.toLowerCase()}-image`);

    namePet.textContent = name;
    buttonLernMore.textContent = 'Learn more';

    cardPet.appendChild(imagePet);
    cardPet.appendChild(namePet);
    cardPet.appendChild(buttonLernMore);
    
    petCards.appendChild(cardPet);
    getPopup()
  }
}

//получаю страницу пагинации
const getNumberPaginationPage = () => numberPage.textContent = numberPagination;

//сортирую массив рандомно
const dataSort = (data) => {
  return data.sort(() => Math.random() - 0.5);
}

document.addEventListener('DOMContentLoaded', function() {
  fetch ('./data_json/data.json')
    .then(response => response.json())
    .then(data => {
      dataArray = data;
      for(let i = 0; i < 6; i++) {
        const clonedData = [...dataArray];
        dataArrayPagination.push(dataSort(clonedData))
      }
      displayCard(dataArrayPagination[indexPagination]);

      getNumberPaginationPage();
    })
    .catch(error => console.error('Error fetching data:', error));


    /*Работа бургер-меню*/
    burgerMenu.addEventListener('click', () => {
      blockBurger.classList.toggle('active-burger-img');
      blockNav.classList.toggle('active-burger');
      blockNav.classList.add('color-menu-pets');
      document.body.classList.toggle('no-scroll');

      if (document.body.id === 'blackout-body-pets') {
        document.body.removeAttribute('id');
      } else document.body.id = 'blackout-body-pets';

    })

    //Закрытие бургер-меню при клике вне его области или на любою ссылку
    document.addEventListener('click', function(event) {
      const isChildOfBlockNavItems = Array.from(blockNavItems.children).some(child => child.contains(event.target));

      if ((!blockNav.contains(event.target) 
        && !burgerMenu.contains(event.target)) 
        || isChildOfBlockNavItems) {
        blockBurger.classList.remove('active-burger-img');
        blockNav.classList.remove('active-burger');
        document.body.classList.remove('no-scroll');

        document.body.removeAttribute('id');
      }
    });
})


//РАБОТА СТРЕЛОК ПАГИНАЦИИ
arrowPaginationRight.addEventListener('click' , () => {
  petCards.innerHTML = '';

  indexPagination += 1;
  numberPagination += 1;
  
  arrowPaginationLeft.classList.remove('event', 'non-active');
  arrowPaginationDoubleLeft.classList.remove('event', 'non-active');

  displayCard(dataArrayPagination[indexPagination]);
  getNumberPaginationPage();

  if (numberPagination === dataArrayPagination.length) {
    arrowPaginationRight.classList.add('event', 'non-active');
    arrowPaginationDoubleRight.classList.add('event', 'non-active');
  }
})

arrowPaginationDoubleRight.addEventListener('click' , () => {
  petCards.innerHTML = '';
  indexPagination = dataArrayPagination.length - 1;
  numberPagination = dataArrayPagination.length;
  
  arrowPaginationRight.classList.add('event', 'non-active');
  arrowPaginationDoubleRight.classList.add('event', 'non-active');

  arrowPaginationLeft.classList.remove('event', 'non-active');
  arrowPaginationDoubleLeft.classList.remove('event', 'non-active');

  displayCard(dataArrayPagination[indexPagination]);
  getNumberPaginationPage();
})

arrowPaginationLeft.addEventListener('click' , () => {
  petCards.innerHTML = '';

  indexPagination -= 1;
  numberPagination -= 1;

  displayCard(dataArrayPagination[indexPagination]);
  getNumberPaginationPage();

  if (numberPagination === 1) {
    arrowPaginationLeft.classList.add('event', 'non-active');
    arrowPaginationDoubleLeft.classList.add('event', 'non-active');
    
    arrowPaginationRight.classList.remove('event', 'non-active');
    arrowPaginationDoubleRight.classList.remove('event', 'non-active');
  }
})

arrowPaginationDoubleLeft.addEventListener('click' , () => {
  petCards.innerHTML = '';

  indexPagination = 0;
  numberPagination = 1;
  
  arrowPaginationLeft.classList.add('event', 'non-active');
  arrowPaginationDoubleLeft.classList.add('event', 'non-active');

  arrowPaginationRight.classList.remove('event', 'non-active');
  arrowPaginationDoubleRight.classList.remove('event', 'non-active');

  displayCard(dataArrayPagination[indexPagination]);
  getNumberPaginationPage();
})



//РАБОТА POPUP
//отображение корректной карточки в popup
function displayCardPopup(cardPet) {
  popupContainer.innerHTML = '';

  const name = cardPet.name;
  const type = cardPet.type;

  const cardPetPopup = document.createElement('div');
  const imagePetPopup = document.createElement('img');
  const namePetPopup = document.createElement('span');
  const typePetPopup = document.createElement('div');
  const textPetPopup = document.createElement('p');

  const listPopup = document.createElement('ul');
  const agePetPopup = document.createElement('li');
  const vaccinaPetPopup = document.createElement('li');
  const diseasePetPopup = document.createElement('li');
  const parasitePetPopup = document.createElement('li');

  imagePetPopup.classList.add('popup-img');
  cardPetPopup.classList.add('popup-description');
  namePetPopup.classList.add('popup-name', 'title-font');
  typePetPopup.classList.add('popup-type', 'title-font');
  textPetPopup.classList.add('popup-text', 'title-font');
  agePetPopup.classList.add('popup-item', 'title-font');
  vaccinaPetPopup.classList.add('popup-item', 'title-font');
  diseasePetPopup.classList.add('popup-item', 'title-font');
  parasitePetPopup.classList.add('popup-item', 'title-font');

  imagePetPopup.setAttribute('src', cardPet.img);
  imagePetPopup.setAttribute('alt', `${name}-${type.toLowerCase()}-image`);

  namePetPopup.textContent = name;
  typePetPopup.textContent = `${type} - ${cardPet.breed}`;
  textPetPopup.textContent = cardPet.description;
  agePetPopup.innerHTML = `<span class="popup-key">Age:</span> ${cardPet.age}`;
  vaccinaPetPopup.innerHTML = `<span class="popup-key">Inoculations:</span> ${cardPet.inoculations.join(', ')}`;
  diseasePetPopup.innerHTML = `<span class="popup-key">Diseases:</span> ${cardPet.diseases.join(', ')}`;
  parasitePetPopup.innerHTML = `<span class="popup-key">Parasites:</span> ${cardPet.parasites.join(', ')}`;
  
  listPopup.appendChild(agePetPopup);
  listPopup.appendChild(vaccinaPetPopup);
  listPopup.appendChild(diseasePetPopup);
  listPopup.appendChild(parasitePetPopup);

  cardPetPopup.appendChild(namePetPopup);
  cardPetPopup.appendChild(typePetPopup);
  cardPetPopup.appendChild(textPetPopup);
  cardPetPopup.appendChild(listPopup);

  popupContainer.appendChild(imagePetPopup);
  popupContainer.appendChild(cardPetPopup);
}

//ищу нужную мне карточку животного в массиве
function findPetInDataArray(card) {
  const petName = card.querySelector('.pet-name').textContent

  for(let i = 0; i < dataArray.length; i++) {
    const petNameInArr = dataArray[i].name
    if (petName === petNameInArr) return dataArray[i]
  }
}

//popup
function getPopup() {
  const petCards = document.querySelectorAll('.pet-card');
  const btnClosePopup = document.querySelector('.btn-popup');
  const overlay = document.querySelector('.overlay');

  petCards.forEach((card) => {
    card.addEventListener('click', () => {
      //console.log('Клик на элемент>>>:', card);
      
      overlay.classList.remove('hidden');
      document.documentElement.classList.add('no-scroll');

      const cardPet = findPetInDataArray(card);
      displayCardPopup(cardPet)

      setTimeout(() => {
        document.addEventListener('click', closePopupOnOutsideClick);
      }, 0);
    })

    document.addEventListener('click', function(event) {
      if (btnClosePopup.contains(event.target)) {
        closePopup();
      }
    });
  
    //функция для закрытия popup
    function closePopup() {
      overlay.classList.add('hidden');
      document.documentElement.classList.remove('no-scroll');
  
      document.removeEventListener('click', closePopupOnOutsideClick);
    }
  
    //функция для закрытия popup при клике вне области попапа
    function closePopupOnOutsideClick(event) {
      if (!popupContainer.contains(event.target) && !btnClosePopup.contains(event.target)) {
        closePopup();
      }
    }
  })
}