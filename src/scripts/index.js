import '../index.css';
import {
    createCard,
    deleteCard,
    likeCard
} from './card';
import {
    openModal,
    closeModal,
    handlePopupClose
} from './modal';
import {
    enableValidation,
    clearValidation
} from "./validation";
import {
    getResponseData,
    getCardsApi,
    getUserInfoApi,
    patchProfileInfoApi,
    postNewCardApi,
    patchAvatarApi,
    logError,
} from "./api";

const popups = document.querySelectorAll('.popup');
const editPopup = document.querySelector('.popup_type_edit');
const editSubmitButton = editPopup.querySelector('.popup__button');
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardSubmitButton = newCardPopup.querySelector('.popup__button');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarSubmitButton = avatarPopup.querySelector('.popup__button');
const imagePopup = document.querySelector('.popup_type_image');

const image = document.querySelector('.popup__image');
const caption = document.querySelector('.popup__caption');

const placesList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const editForm = document.forms['edit-profile'];
const nameInput = editForm.elements.name;
const descriptionInput = editForm.elements.description;

const newCardForm = document.forms['new-place'];
const placeInput = newCardForm.elements['place-name'];
const imageInput = newCardForm.elements.link;

const avatarEditForm = document.forms['edit-avatar'];
const avatarInput = avatarEditForm.elements.avatar;

const formConfiguration = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

const userName = document.querySelector('.profile__title');
const userDescription = document.querySelector('.profile__description');
const userAvatar = document.querySelector('.profile__image');
const editIcon = document.querySelector('.profile__edit-img');

let userId = '';

function openImagePopup(cardInfo) {
    image.src = cardInfo.link;
    image.alt = cardInfo.name;
    caption.textContent = cardInfo.name;

    openModal(imagePopup);
}

function handleEditFormSubmit(event) {
    event.preventDefault();

    editSubmitButton.textContent = 'Сохранение...';

    patchProfileInfoApi(nameInput, descriptionInput)
        .then(res => {
            profileName.textContent = nameInput.value;
            profileDescription.textContent = descriptionInput.value;
            closeModal(editPopup);
        })
        .catch(err => logError(err))
        .finally(() => editSubmitButton.textContent = 'Сохранить');
}

function handleNewCardFormSubmit(event) {
    event.preventDefault();
    const newCard = createCard(
        {
            name: placeInput.value,
            link: imageInput.value,
            likes: [],
            owner: {
                _id: userId,
            }
        },
        deleteCard,
        likeCard,
        openImagePopup,
        userId
    );

    newCardSubmitButton.textContent = 'Сохранение...';

    postNewCardApi(placeInput, imageInput)
        .then(res => {
            closeModal(newCardPopup)
        })
        .catch(err => logError(err))
        .finally(() => {
            newCardSubmitButton.textContent = 'Создать';
            window.location.reload();
        });
}

function handleAvatarEditFormSubmit(event) {
    event.preventDefault();

    avatarSubmitButton.textContent = 'Сохранение...';

    patchAvatarApi(avatarInput)
        .then(res => {
            profileImage.style.backgroundImage = 'url(' + avatarInput.value + ')';
            closeModal(avatarPopup);
        })
        .catch(err => logError(err))
        .finally(() => avatarSubmitButton.textContent = 'Сохранить');
}

Promise.all([getUserInfoApi(), getCardsApi()])
    .then(([userInfo, cards]) => {

        userName.textContent = userInfo.name;
        userDescription.textContent = userInfo.about;
        userAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
        userId = userInfo['_id'];

        cards
            .map(cardInfo => createCard(
                cardInfo,
                deleteCard,
                likeCard,
                openImagePopup,
                userId
            ))
            .forEach(card => placesList.append(card));
    })
    .catch(err => logError(err));

enableValidation(formConfiguration);

popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
    popup.addEventListener('mousedown', (evt) => {
        handlePopupClose(evt, popup)
    })
})

editButton.addEventListener('click', function () {
    editSubmitButton.textContent = 'Сохранить';

    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;

    clearValidation(editForm, formConfiguration);
    openModal(editPopup);
});
editForm.addEventListener('submit', handleEditFormSubmit);

addButton.addEventListener('click', function () {
    newCardSubmitButton.textContent = 'Создать';
    newCardForm.reset();
    clearValidation(newCardForm, formConfiguration);
    openModal(newCardPopup);
});
newCardForm.addEventListener('submit', handleNewCardFormSubmit);

userAvatar.addEventListener('mouseover', function () {
    editIcon.classList.add('profile__edit-img_visible');
});
userAvatar.addEventListener('mouseout', function () {
    editIcon.classList.remove('profile__edit-img_visible');
});
userAvatar.addEventListener('click', function () {
    avatarSubmitButton.textContent = 'Сохранить';
    avatarEditForm.reset();
    clearValidation(avatarEditForm, formConfiguration);
    openModal(avatarPopup);
});
avatarEditForm.addEventListener('submit', handleAvatarEditFormSubmit);