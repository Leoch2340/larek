// Базовый URL API сервера
export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;

// URL для загрузки медиа-контента через CDN
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

// Объект для хранения глобальных настроек (пока пустой)
export const settings = {};

// Сопоставление категорий товаров с CSS-классами карточек
export const categoryClasses: { [key: string]: string } = {
  "софт-скил": "card__category_soft",       // Категория "Софт-скил" (гибкие навыки)
  "хард-скил": "card__category_hard",       // Категория "Хард-скил" (технические навыки)
  "кнопка": "card__category_button",        // Категория "Кнопка" (возможно, UI-элементы)
  "дополнительное": "card__category_additional", // Категория "Дополнительное" (доп. материалы)
  "другое": "card__category_other"          // Категория "Другое" (не попавшее в другие категории)
};

// Способы оплаты и их соответствие API-значениям
export const PaymentMethods: { [key: string]: string } = {
  "card": "online", // Оплата картой (онлайн)
  "cash": "cash"    // Оплата наличными
};
