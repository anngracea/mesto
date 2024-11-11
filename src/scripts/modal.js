export {openModal, closeModal, handlePopupClose};



function openModal(popup) {
    popup.classList.add('popup_is-opened');

    document.addEventListener('keydown', closeByEscape);
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');

    document.removeEventListener('keydown', closeByEscape);
}

function closeByEscape(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');

        event.preventDefault();
        closeModal(openedPopup);
    }
}

function handlePopupClose (event, popup) {
    if (event.target.classList.contains('popup_is-opened')
        || event.target.classList.contains('popup__close')) {
        closeModal(popup);
    }
}




