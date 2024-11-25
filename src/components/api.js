const SETTINGS = Object.freeze({
  apiEndpoint: "https://nomoreparties.co/v1/cohort-mag-4",
  headers: {
    authorization: "93b51c7e-48d3-4680-b4c8-2cb6a39bd109",
    "Content-Type": "application/json",
  },
});


const processResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Ошибка: ${response.status}`);
};


const fetchAllCards = async () => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/cards`, {
    headers: SETTINGS.headers,
    method: "GET",
  });
  return processResponse(response);
};


const addCard = async ({ name, link }) => {
  try {
    const response = await fetch(`${SETTINGS.apiEndpoint}/cards`, {
      method: "POST",
      headers: SETTINGS.headers,
      body: JSON.stringify({ name, link }),
    });
    return processResponse(response);
  } catch (error) {
    console.error(`Ошибка при добавлении новой карточки: ${error.message}`);
  }
};


const deleteCard = async (cardId) => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/cards/${cardId}`, {
    headers: SETTINGS.headers,
    method: "DELETE",
  });
  return processResponse(response);
};


const likeCard = async (cardId) => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/cards/likes/${cardId}`, {
    headers: SETTINGS.headers,
    method: "PUT",
  });
  return processResponse(response);
};


const unlikeCard = async (cardId) => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/cards/likes/${cardId}`, {
    headers: SETTINGS.headers,
    method: "DELETE",
  });
  return processResponse(response);
};


const fetchUserProfile = async () => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/users/me`, {
    headers: SETTINGS.headers,
  });
  return processResponse(response);
};


const editUserProfile = async ({ name, description }) => {
  const response = await fetch(`${SETTINGS.apiEndpoint}/users/me`, {
    headers: SETTINGS.headers,
    method: "PATCH",
    body: JSON.stringify({
      name,
      about: description,
    }),
  });
  return processResponse(response);
};


const changeUserAvatar = async (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== "string") {
    throw new Error("Ошибка: Неверный URL аватара");
  }

  try {
    const response = await fetch(`${SETTINGS.apiEndpoint}/users/me/avatar`, {
      method: "PATCH",
      headers: SETTINGS.headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    return processResponse(response);
  } catch (error) {
    console.error(`Ошибка при обновлении аватара: ${error.message}`);
  }
};


export {
  fetchAllCards,
  addCard,
  deleteCard,
  likeCard,
  unlikeCard,
  fetchUserProfile,
  editUserProfile,
  changeUserAvatar,
};

