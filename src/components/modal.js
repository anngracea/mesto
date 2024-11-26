const handleDocumentKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'));
  }
};

const handleModalClick = (event) => {
  if (event.target.classList.contains('popup_is-opened')) {
    return closeModal(event.target);
  }

  if (event.target.closest('.popup__close')) {
    return closeModal(event.target.closest('.popup'));
  }
};

const openModal = (cardElement) => {
  cardElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleDocumentKeydown);
};

const closeModal = (cardElement) => {
  document.removeEventListener('keydown', handleDocumentKeydown);
  cardElement.classList.remove('popup_is-opened');
};

export { openModal, closeModal, handleModalClick };
