export {enableValidation, clearValidation}

function showError(input, errorElement, config) {
    input.classList.add(config.inputErrorClass);

    errorElement.classList.add(config.errorClass);
    errorElement.textContent = input.validationMessage;
}

function hideError(input, errorElement, config) {
    input.classList.remove(config.inputErrorClass);

    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
}

function checkInputValidity (input, formElement, config) {
    const spanIdSelector = `#${input.name}-error`;
    const errorElement = formElement.querySelector(spanIdSelector);

    if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage);
    } else {
        input.setCustomValidity('');
    }

    if (input.validity.valid) {
        hideError(input, errorElement, config);
    } else {
        showError(input, errorElement, config);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some((input) => {
        return !input.validity.valid;
    });
}

function toggleButtonState(buttonElement, inputList) {
    buttonElement.disabled = hasInvalidInput(inputList);
}

function setEventListener(formElement, config) {
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));

    inputList.forEach((input) => {
        input.addEventListener('input', () => {
            checkInputValidity(input, formElement, config);
            toggleButtonState(buttonElement, inputList);
        })
    })
}

function enableValidation(config) {
    const forms = Array.from(document.querySelectorAll(config.formSelector));

    forms.forEach((formElement) => {
        setEventListener(formElement, config);
    })
}

function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((input) => {
        const spanIdSelector = `#${input.name}-error`;
        const errorElement = formElement.querySelector(spanIdSelector);

        hideError(input, errorElement, config);
        toggleButtonState(buttonElement, inputList);
    });
}