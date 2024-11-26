import { unlikeCard, likeCard } from '../components/api.js';

const toggleLike = (likeButton, likeCounter, likes) => {
  likeButton.classList.toggle('card__like-button_is-active');
  likeCounter.textContent = likes.length || '0';
  if (likes.length) {
    likeCounter.classList.add('card__like-counter_is-active');
  } else {
    likeCounter.classList.remove('card__like-counter_is-active');
  }
};

const handleCardLike = async ({ cardElement, cardId }) => {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  likeButton.disabled = true;

  try {
    // Вызываем API для установки или удаления лайка
    const { likes } = likeButton.classList.contains('card__like-button_is-active')
      ? await unlikeCard(cardId)
      : await likeCard(cardId);

    toggleLike(likeButton, likeCounter, likes);
  } catch (error) {
    console.error('Ошибка при переключении лайка:', error);
  } finally {
    likeButton.disabled = false;
  }
};


const renderCard = ({
  currentUserId,
  template,
  data,
  onDelete,
  onLike,
  onImageClick,
}) => {
  const cardElement = template.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  cardImage.addEventListener('click', () =>
    onImageClick({
      cardName: data.name,
      cardLink: data.link,
    })
  );
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardElement.querySelector('.card__title').textContent = data.name;

  const likeCounter = cardElement.querySelector('.card__like-counter');

  likeCounter.textContent = data.likes.length || '0';
  if (data.likes.length) {
    likeCounter.classList.add('card__like-counter_is-active');
  }

  const deleteButton = cardElement.querySelector('.card__delete-button');

  if (data.owner['_id'] === currentUserId) {
    deleteButton.classList.add('card__delete-button_is-active');
    deleteButton.addEventListener('click', () => {
      onDelete({
        cardId: data['_id'],
        cardElement: cardElement,
        buttonElement: deleteButton,
      });
    });
  }

  const likeButton = cardElement.querySelector('.card__like-button');

  if (data.likes.find((like) => like['_id'] === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    handleCardLike({ cardElement, cardId: data['_id'] });
  });

  return cardElement;
};

const removeCard = (buttonElement) => {
  const cardElement = buttonElement.closest('.card');
  if (cardElement) {
    cardElement.remove();
  }
};

export { removeCard };

const deleteCard = (cardElement) => {
  cardElement.remove();
};

export { renderCard, toggleLike, handleCardLike, deleteCard };