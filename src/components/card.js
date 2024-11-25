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

  if (data.likes.length) {
    likeCounter.classList.add('card__like-counter_is-active');
    likeCounter.textContent = data.likes.length;
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

  if (data.likes.find((cardElement) => cardElement['_id'] === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    onLike({
      cardId: data['_id'],
      buttonElement: likeButton,
      counterElement: likeCounter,
    });
  });

  return cardElement;
};

export { renderCard };
