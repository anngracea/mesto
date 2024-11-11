export {
    createCard,
    deleteCard,
    likeCard
}
import {
    getResponseData,
    putLikeOnCardApi,
    deleteLikeFromCardApi,
    deleteCardFromServerApi,
    logError
} from "./api";

const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardInfo, deleteFunc, likeFunc, openImageFunc, ownerId) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const deleteButton = card.querySelector('.card__delete-button');
    const likeButton = card.querySelector('.card__like-button');
    const likesNumber = card.querySelector('.card__likes-number');

    cardImage.src = cardInfo.link;
    cardImage.alt = cardInfo.name;
    cardTitle.textContent = cardInfo.name;
    likesNumber.textContent = cardInfo.likes.length;

    if (cardInfo.owner['_id'] === ownerId) {
        deleteButton.classList.add('card__delete-button_active');
        deleteButton.addEventListener('click', function () {
            deleteFunc(deleteButton, cardInfo);
        });
    }

    cardInfo.likes.forEach(userInfo => {
        if (userInfo['_id'] === ownerId) {
            likeButton.classList.add('card__like-button_is-active');
        }
    })

    likeButton.addEventListener('click', function (evt) {
        likeFunc(evt, cardInfo, likesNumber);
    });

    cardImage.addEventListener('click', function () {
        openImageFunc(cardInfo);
    });

    return card;
}

function deleteCard(button, cardInfo) {
    const placesItem = button.closest('.places__item');

    deleteCardFromServerApi(cardInfo['_id'])
        .then(res => placesItem.remove())
        .catch(err => logError(err));
}

function likeCard(event, cardInfo, likesNumber) {
    if (event.target.classList.contains('card__like-button_is-active')) {
        deleteLikeFromCardApi(cardInfo['_id'])
            .then(res => {
                event.target.classList.toggle('card__like-button_is-active');
                likesNumber.textContent--;
            })
            .catch(err => logError(err));
    } else {
        putLikeOnCardApi(cardInfo['_id'])
            .then(res => {
                event.target.classList.toggle('card__like-button_is-active');
                likesNumber.textContent++;
            })
            .catch(err => logError(err));
    }
}

