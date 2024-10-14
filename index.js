const burgerMenu = document.querySelector('.burger-btn');
const blockNav = document.querySelector('.header-block__nav');
const blockNavItems = document.querySelector('.header-block__nav-items');
const blockBurger = document.querySelector('.header-block__burger');
const headerWrapOverlay = document.querySelector('.header-wrap');

const carouselWrap = document.querySelector('.our-friends-block__carousel-cards');
const carousel = document.querySelector('.carousel');

const btnArrowLeft = document.querySelectorAll('.arrow-left');
const btnArrowRight = document.querySelectorAll('.arrow-right');

const popupContainer = document.querySelector('.popup-container');
// Назначаю обработчики для всех стрелок
btnArrowRight.forEach(btn => btn.addEventListener('click', handleRightArrowClick));
btnArrowLeft.forEach(btn => btn.addEventListener('click', handleLeftArrowClick));

let dataArray = [];
let lastWidth = 0;

//получаю кол-во карточек на странице
function calculateCardsOnPage() {
  const containerWidth = document.querySelector('.our-friends-block__carousel-cards').offsetWidth;
  if (containerWidth === 990) return 3
  else if (containerWidth === 580) return 2
  return 1
}

//отрисовываю карточки при загрузке страницы
function displayCard(dataArray, cardsOnPage = '') {
  cardsOnPage = cardsOnPage === '' ? calculateCardsOnPage() : cardsOnPage;

  //создаю первый контейнер для карточек
  let blockCards = document.createElement('div');
  blockCards.classList.add('block-card');

  let countCardsInBlock = 0;
  let countBlocks = 0;

  for(let i = 0; i < dataArray.length; i++) {
    let card = dataArray[i];

    const imageLink = card.img;
    const name = card.name;
    const type = card.type;
    
    const cardPet = document.createElement('div');
    const imagePet = document.createElement('img');
    const namePet = document.createElement('span');
    const buttonLernMore = document.createElement('button');

    cardPet.classList.add('pet-card');
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
    
    blockCards.appendChild(cardPet);
    countCardsInBlock += 1;

    
    //если блок blockCards заполнен тремя карточками - добавляю его в общий блок carousel и создаю новый blockCards
    if (countCardsInBlock === cardsOnPage) {
      carousel.appendChild(blockCards);
      countBlocks += 1;

      blockCards = document.createElement('div');
      blockCards.classList.add('block-card');
      //обновляю счетчик для подсчета 3-х карточек
      countCardsInBlock = 0;
    }

    if (countBlocks === 3) {
      break
    }
  }

  //назначаю классы для каждого из трех блоков
  let prevBlockCards = carousel.children[0];
  prevBlockCards.classList.add('prev-block-cards');

  let currentBlockCards = carousel.children[1]
  currentBlockCards.classList.add('current-block-cards');

  let nextBlockCards = carousel.children[2]
  nextBlockCards.classList.add('next-block-cards');

  getPopup()
}

//сортирую массив рандомно
const dataSort = (data) => {
  return data.sort(() => Math.random() - 0.5);
}


document.addEventListener('DOMContentLoaded', function() {
  fetch ('./data_json/data.json')
    .then(response => response.json())
    .then(data => {
      dataArray = dataSort(data);
      
      const cardsOnPage = calculateCardsOnPage();
      lastWidth = document.querySelector('.our-friends-block__carousel-cards').offsetWidth;
      //console.log('ширина контейнера при загрузке страницы: ', lastWidth)

      if (cardsOnPage === 3) {
        dataArray.push(dataArray[0]);
        console.log(dataArray)
      }
      displayCard(dataArray)

    })
    .catch(error => console.error('Error fetching data:', error));
    
    /*Работа бургер-меню*/
    burgerMenu.addEventListener('click', () => {
      blockBurger.classList.toggle('active-burger-img');
      blockNav.classList.toggle('active-burger');
      blockNav.classList.add('color-menu-main');
      document.body.classList.toggle('no-scroll');

      if (document.body.id === 'blackout-body-main') {
        document.body.removeAttribute('id');
      } else document.body.id = 'blackout-body-main';
    })

    //Закрытие бургер-меню при клике вне его области или на любою ссылку для дальнейшего перехода
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


//РАБОТА СЛАЙДЕРА
//функция отображения блоков Prev и Next с новыми рендомными карточками
function displayNewBlockCards(newArrayBlockCards, blockСardsToChange) {
  
  blockСardsToChange.innerHTML = ''

  newArrayBlockCards.forEach(card => {
    const cardPet = document.createElement('div');
    const imagePet = document.createElement('img');
    const namePet = document.createElement('span');
    const buttonLearnMore = document.createElement('button');

    cardPet.classList.add('pet-card');
    imagePet.classList.add('pet-image');
    namePet.classList.add('pet-name', 'title-font');
    buttonLearnMore.classList.add('btn-link', 'btn-secondary', 'title-font');

    imagePet.setAttribute('src', card.img);
    imagePet.setAttribute('alt', `${card.name}-${card.type.toLowerCase()}-image`);

    namePet.textContent = card.name;
    buttonLearnMore.textContent = 'Learn more';

    cardPet.appendChild(imagePet);
    cardPet.appendChild(namePet);
    cardPet.appendChild(buttonLearnMore);

    blockСardsToChange.appendChild(cardPet);
  });
  getPopup()
}

//получаю массив рандомных чисел от 0 до 7 
const getRandomIndices = () => {
  const cardsOnPage = calculateCardsOnPage();
  const indices = new Set();

  while (indices.size < cardsOnPage) {
    indices.add(Math.floor(Math.random() * 8));
  }
  return Array.from(indices);
}

//проверяю массив текущих карточек с рандомным массивом чисел, который уже содержит значение имен питомцев
function checkDuplicateCards(currentPetNames, newPetsNames) {
  for(let i = 0; i < currentPetNames.length; i++) {
    for(let j = 0; j < newPetsNames.length; j++) {
      if (currentPetNames[i] === newPetsNames[j]) {
        return true // найден дубликат
      }
    }
  }
  return false  //дубликатов нет
}

//создаю новый массив с именами питомцев, отличный от текущих имен
function createArrayNoRepeatCards(currentPetNames) {
  let isDuplicate = true;
  let newPetsNames = [];

  while (isDuplicate) {
    newPetsNames = [];
    let randomIndices = getRandomIndices();
    for(let i = 0; i < randomIndices.length; i++) {
      const petName = dataArray[randomIndices[i]].name;

      if (!newPetsNames.includes(petName)) {
        newPetsNames.push(petName);
      }}
    isDuplicate = checkDuplicateCards(currentPetNames, newPetsNames);
  }
  return newPetsNames
}

//создаю новый массив объектов питомцев
function createNewBlockCards(blockСardsToChange) {
  const cardsOnPage = calculateCardsOnPage();
  const currentBlockCards = document.querySelector('.current-block-cards');
  const currentPetNames = Array.from(currentBlockCards.children).map((item) => {
    return item.querySelector('.pet-name').textContent
  })

  const newPetsNames = createArrayNoRepeatCards(currentPetNames)

  const newArrayBlockCards = [];

  let arrayLength = cardsOnPage === 3 ? dataArray.length - 1 : dataArray.length;

  for(let namePet of newPetsNames) {
    for(let i = 0; i < arrayLength; i++) {
      if (dataArray[i].name === namePet) {
        newArrayBlockCards.push(dataArray[i])
      }
    }
  }
  displayNewBlockCards(newArrayBlockCards, blockСardsToChange);
}


const removeListenerBtn = () => {
  btnArrowLeft.forEach(btn => btn.removeEventListener('click', handleLeftArrowClick));
  btnArrowRight.forEach(btn => btn.removeEventListener('click', handleRightArrowClick));
}

//задаю логику после окончания анимации
carousel.addEventListener('animationend', (animationEvent) => {
  //console.log(animationEvent)

  if (animationEvent.animationName === 'move-left') {
    // кнопка right
    carousel.classList.remove('transition-left');
    //сохраняю состояние "текущего блока" в "предыдущий блок"
    const prevBlockCards = document.querySelector('.prev-block-cards');
    const currentBlockCards = document.querySelector('.current-block-cards');
    prevBlockCards.innerHTML = currentBlockCards.innerHTML;
    //сохраняю состояние "следующего блока" в "текущий блок"
    const nextBlockCards = document.querySelector('.next-block-cards');
    currentBlockCards.innerHTML = nextBlockCards.innerHTML;
    //задаю новые карточки для "следующего блока"
    createNewBlockCards(nextBlockCards)

  } else {
    //кнопка left
    carousel.classList.remove('transition-right');
    //сохраняю состояние "предыдущего блока" в "текущий блок"
    const prevBlockCards = document.querySelector('.prev-block-cards');
    const currentBlockCards = document.querySelector('.current-block-cards');
    currentBlockCards.innerHTML = prevBlockCards.innerHTML
    //задаю новые карточки в "предыдущий блок"
    createNewBlockCards(prevBlockCards)
    //в "следующий блок" задаю новые карточки, что бы "следующий блок" всегда отличался от "текущего блока"
    const nextBlockCards = document.querySelector('.next-block-cards');
    createNewBlockCards(nextBlockCards)
  }
  
  btnArrowRight.forEach(btn => btn.addEventListener('click', handleRightArrowClick));
  btnArrowLeft.forEach(btn => btn.addEventListener('click', handleLeftArrowClick));
})

function handleLeftArrowClick() {
  removeListenerBtn()
  carousel.classList.add('transition-right');
}

function handleRightArrowClick() {
  removeListenerBtn()
  carousel.classList.add('transition-left');
}

//слушатель окна браузера, сравнение размеров контейнера carousel и изменение кол-ва карточек в нем при адаптивности
window.addEventListener('resize', () => {
  const containerWidth = document.querySelector('.our-friends-block__carousel-cards').offsetWidth;
  if (containerWidth !== lastWidth) {
    lastWidth = containerWidth;
    if (lastWidth === 990) {
      //console.log('ширина контейнера стала: ', lastWidth)
      dataArray = dataSort(dataArray.slice(0,8));
      dataArray.push(dataArray[0]);
      carousel.innerHTML = '';
      displayCard(dataArray);
      return
    }
    //console.log('ширина контейнера стала: ', lastWidth)
    dataArray = dataSort(dataArray.slice(0,8));
    carousel.innerHTML = '';
    displayCard(dataArray);
  }
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
  const currentblockCards = document.querySelector('.current-block-cards');
  const btnClosePopup = document.querySelector('.btn-popup');
  const overlay = document.querySelector('.overlay');

  Array.from(currentblockCards.children).forEach((card) => {
    card.addEventListener('click', () => {
      //console.log('Клик на элемент>>>:', card);

      overlay.classList.remove('hidden');
      document.documentElement.classList.add('no-scroll');

      const cardPet = findPetInDataArray(card);
      displayCardPopup(cardPet)

      //даю открыться попап и вешаю обработчик клика на функцию closePopupOnOutsideClick 
      setTimeout(() => {
        document.addEventListener('click', closePopupOnOutsideClick);
      }, 0);
    })
  });

  //закрытие popup при клике на крестик или вне области попапа
  document.addEventListener('click', function(event) {
    if (btnClosePopup.contains(event.target)) {
      closePopup();
    }
  });

  //функция для закрытия popup
  function closePopup() {
    overlay.classList.add('hidden');
    document.documentElement.classList.remove('no-scroll');

    //убираю обработчик кликов вне попапа после закрытия
    document.removeEventListener('click', closePopupOnOutsideClick);
  }

  //функция для закрытия popup при клике вне области попапа
  function closePopupOnOutsideClick(event) {
    if (!popupContainer.contains(event.target) && !btnClosePopup.contains(event.target)) {
      closePopup();
    }
  }
}