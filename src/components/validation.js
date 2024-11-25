const isInputInvalid = (inputs) => inputs.some(input => input.checkValidity() === false);


const displayInputError = ({ formElement, inputElement, inputErrorClass, errorClass, errorMessage }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;
  inputElement.classList.add(inputErrorClass);
};


const clearInputError = ({ formElement, inputElement, inputErrorClass, errorClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return; 

  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
  inputElement.classList.remove(inputErrorClass);
};

const validateInput = ({ formElement, inputElement, inputErrorClass, errorClass }) => {
  const { validity, dataset, validationMessage } = inputElement;
  if (validity.patternMismatch) {
    inputElement.setCustomValidity(dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!validity.valid) {
    displayInputError({
      formElement,
      inputElement,
      errorMessage: validationMessage,
      errorClass,
      inputErrorClass,
    });
  } else {
    clearInputError({
      formElement,
      inputElement,
      errorClass,
      inputErrorClass,
    });
  }
};


const updateButtonState = ({ inputList, submitButtonElement, inactiveButtonClass }) => {
  const isInvalid = inputList.some(input => !input.validity.valid);
  submitButtonElement.disabled = isInvalid;
  submitButtonElement.classList.toggle(inactiveButtonClass, isInvalid);
};


const attachInputListeners = ({
  formElement,
  inputSelector,
  inputErrorClass,
  submitButtonSelector,
  inactiveButtonClass,
  errorClass,
}) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  updateButtonState({ inputList, submitButtonElement, inactiveButtonClass });

  inputList.forEach(inputElement =>
    inputElement.addEventListener('input', () => {
      validateInput({ formElement, inputElement, inputErrorClass, errorClass });
      updateButtonState({ inputList, submitButtonElement, inactiveButtonClass });
    })
  );
};


const initializeValidation = ({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
}) => {
  const formList = document.querySelectorAll(formSelector);

  formList.forEach(formElement => {
    formElement.addEventListener('submit', event => event.preventDefault());

    attachInputListeners({
      formElement,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass,
    });
  });
};


const resetFormValidation = (
  formElement,
  {
    submitButtonSelector,
    inactiveButtonClass,
    inputSelector,
    inputErrorClass,
    errorClass,
  }
) => {
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  inputList.forEach((inputElement) => {
    clearInputError({
      formElement,
      inputElement,
      inputErrorClass,
      errorClass,
    });
  });

  updateButtonState({
    inputList,
    submitButtonElement,
    inactiveButtonClass,
  });
};

export { initializeValidation, resetFormValidation };
