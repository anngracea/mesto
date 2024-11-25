import './index.css';

import {
  closePopup,
  openPopup,
  handlePopupClick,
} from '../components/popup.js';

import { renderCard } from '../components/card.js';

import {
  addCard as APIAddCard,
  deleteCard as APIDeleteCard,
  likeCard as APILikeCard,
  unlikeCard as APIUnLikeCard,
  fetchAllCards as APIFetchCards,
  fetchUserProfile as APIFetchProfile,
  changeUserAvatar as APIChangeAvatar,
  editUserProfile as APIEditProfile,
} from '../components/api.js';

import { resetFormValidation, initializeValidation } from '../components/validation.js';

const validationSettings = Object.freeze({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  errorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
});


const querySelector = (selector) => document.querySelector(selector);

const popupImageView = querySelector('.popup_type_image');
const popupImageCaption = popupImageView.querySelector('.popup__caption');
const popupImageElement = popupImageView.querySelector('.popup__image');

const cardListContainer = querySelector('.places__list');
const cardTemplateElement = querySelector('#card-template').content;
const cardCreationForm = document.forms['new-place'];
const cardCreationSubmitButton = querySelector('.popup__button');
const cardTitleInput = cardCreationForm.elements['place-name'];
const cardImageInput = cardCreationForm.elements.link;

const popupNewCard = querySelector('.popup_type_new-card');
const openNewCardPopupButton = querySelector('.profile__add-button');

const avatarEditForm = document.forms['edit-avatar'];
const avatarUrlInput = avatarEditForm.elements.avatar;
const avatarEditSubmitButton = querySelector('.popup__button');
const popupEditAvatar = querySelector('.popup_type_edit-avatar');

const userAvatar = querySelector('.profile__image');
const userName = querySelector('.profile__title');
const userBio = querySelector('.profile__description');
const profileEditForm = document.forms['edit-profile'];
const profileEditSubmitButton = querySelector('.popup__button');
const userNameInput = profileEditForm.elements.name;
const userBioInput = profileEditForm.elements.description;

const popupEditProfile = querySelector('.popup_type_edit');
const openProfileEditPopupButton = querySelector('.profile__edit-button');
const popupDeleteConfirm = querySelector('.popup_type_confirm');
const confirmDeleteButton = popupDeleteConfirm.querySelector('.popup__button_confirm');


const updateProfileData = ({ name, description, avatar }) => {
  userName.textContent = name;
  userBio.textContent = description;
  userAvatar.style.backgroundImage = `url(${avatar})`;
};


const toggleLoadingState = (buttonElement, isLoading, defaultText = 'Сохранить') => {
  buttonElement.textContent = isLoading ? 'Сохранение...' : defaultText;
};


const handleCardLike = async ({ cardId, buttonElement, counterElement }) => {
  buttonElement.disabled = true;

  try {
    const { likes } = buttonElement.classList.contains('card__like-button_is-active')
      ? await APIUnLikeCard(cardId)
      : await APILikeCard(cardId);

    buttonElement.classList.toggle('card__like-button_is-active');
    counterElement.classList.toggle('card__like-counter_is-active', likes.length > 0);
    counterElement.textContent = likes.length || '';
  } catch (error) {
    console.error(error);
  } finally {
    buttonElement.disabled = false;
  }
};


const handleDeleteCard = async ({ cardId, buttonElement }) => {
  openPopup(popupDeleteConfirm);

  confirmDeleteButton.onclick = async () => {
    buttonElement.disabled = true;

    try {
      await APIDeleteCard(cardId);
      buttonElement.closest('.card').remove();
      closePopup(popupDeleteConfirm);
    } catch (error) {
      console.error(error);
      buttonElement.disabled = false;
    }
  };
};


const handleCardFormSubmit = async (event) => {
  event.preventDefault();

  toggleLoadingState(cardCreationSubmitButton, true);

  try {
    const cardData = await APIAddCard({
      name: cardTitleInput.value,
      link: cardImageInput.value,
    });

    cardListContainer.prepend(
      renderCard({
        currentUserId: cardData.owner['_id'],
        template: cardTemplateElement,
        data: cardData,
        onDelete: handleDeleteCard,
        onLike: handleCardLike,
        onImageClick: handleCardImageClick,
      })
    );

    cardCreationForm.reset();
    closePopup(popupNewCard);
  } catch (error) {
    console.error(error);
  } finally {
    toggleLoadingState(cardCreationSubmitButton, false);
  }
};


const handleProfileEditSubmit = async (event) => {
  event.preventDefault();

  toggleLoadingState(profileEditSubmitButton, true);

  try {
    const { name, about, avatar } = await APIEditProfile({
      name: userNameInput.value,
      description: userBioInput.value,
    });

    updateProfileData({ name, description: about, avatar });
    closePopup(popupEditProfile);
  } catch (error) {
    console.error(error);
  } finally {
    toggleLoadingState(profileEditSubmitButton, false);
  }
};


const handleAvatarEditSubmit = async (event) => {
  event.preventDefault();

  toggleLoadingState(avatarEditSubmitButton, true);

  try {
    const { name, about, avatar } = await APIChangeAvatar(avatarUrlInput.value);
    updateProfileData({ name, description: about, avatar });
    closePopup(popupEditAvatar);
  } catch (error) {
    console.error(error);
  } finally {
    toggleLoadingState(avatarEditSubmitButton, false);
  }
};


const handleProfileEditButtonClick = () => {
  userNameInput.value = userName.textContent;
  userBioInput.value = userBio.textContent;

  resetFormValidation(profileEditForm, validationSettings);
  openPopup(popupEditProfile);
};


const handleNewCardButtonClick = () => {
  cardCreationForm.reset();
  resetFormValidation(cardCreationForm, validationSettings);
  openPopup(popupNewCard);
};


const handleCardImageClick = ({ cardName, cardLink }) => {
  popupImageElement.src = cardLink;
  popupImageElement.alt = cardName;
  popupImageCaption.textContent = cardName;

  openPopup(popupImageView);
};


const handleAvatarClick = () => {
  avatarEditForm.reset();
  resetFormValidation(avatarEditForm, validationSettings);
  openPopup(popupEditAvatar);
};


cardCreationForm.addEventListener('submit', handleCardFormSubmit);
profileEditForm.addEventListener('submit', handleProfileEditSubmit);
avatarEditForm.addEventListener('submit', handleAvatarEditSubmit);

popupImageView.addEventListener('click', handlePopupClick);
popupEditAvatar.addEventListener('click', handlePopupClick);
userAvatar.addEventListener('click', handleAvatarClick);

popupNewCard.addEventListener('click', handlePopupClick);
openNewCardPopupButton.addEventListener('click', handleNewCardButtonClick);

popupEditProfile.addEventListener('click', handlePopupClick);
openProfileEditPopupButton.addEventListener('click', handleProfileEditButtonClick);

popupDeleteConfirm.addEventListener('click', handlePopupClick);

initializeValidation(validationSettings);

(async () => {
  try {
    const [{ name, about, avatar, ['_id']: currentUserId }, cardsData] = await Promise.all([
      APIFetchProfile(),
      APIFetchCards(),
    ]);

    updateProfileData({ name, description: about, avatar });

    cardsData.forEach((cardData) => {
      cardListContainer.append(
        renderCard({
          currentUserId,
          template: cardTemplateElement,
          data: cardData,
          onDelete: handleDeleteCard,
          onLike: handleCardLike,
          onImageClick: handleCardImageClick,
        })
      );
    });
  } catch (error) {
    console.error(error);
  }
})();

