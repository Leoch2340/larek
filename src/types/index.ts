// Типы для реализации базового класса событий

// Имя события может быть строкой или регулярным выражением
export type EventName = string | RegExp;

// Функция-обработчик события
export type Subscriber = Function;

// Структура данных события, содержащая имя события и данные
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

// Интерфейс для работы с событиями
export interface IEvents {
  // Подписка на событие
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  
  // Генерация события с передачей данных
  emit<T extends object>(event: string, data?: T): void;
  
  // Триггер для генерации события в заданном контексте
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Тип данных для ответа сервера, содержащего список элементов
export type ApiListResponse<Type> = {
  total: number,  // Общее количество элементов
  items: Type[]   // Массив данных определённого типа
};

// Доступные методы HTTP-запросов для изменения данных на сервере
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс для состояния формы, включая её валидность и список ошибок
export interface IFormState {
    valid: boolean;  // Флаг валидности формы
    errors: string[]; // Список ошибок
}

// Интерфейс данных, передаваемых в модальное окно
export interface IModalData {
    content: HTMLElement; // HTML-элемент, который будет содержимым модального окна
}

// Интерфейс API для работы с продуктами в интернет-магазине
export interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получение списка товаров
  getProductItem: (id: string) => Promise<IProduct>; // Получение одного товара по ID
  orderProducts: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа
}

// Интерфейс данных товара
export interface IProduct {
  id: string; // Уникальный идентификатор товара
  title: string; // Название товара
  price: number | null; // Цена товара (null, если не указана)
  description: string; // Описание товара
  category: string; // Категория товара
  image: string; // URL изображения товара
}

// Интерфейс состояния приложения
export interface IAppState {
  catalog: IProduct[]; // Каталог товаров
  basket: IProduct[]; // Товары в корзине
  preview: string | null; // ID товара в предпросмотре
  delivery: IDeliveryForm | null; // Данные доставки
  contact: IContactForm | null; // Контактные данные
  order: IOrder | null; // Данные заказа
}

// Интерфейс данных формы доставки
export interface IDeliveryForm {
  payment: string; // Способ оплаты
  address: string; // Адрес доставки
}

// Интерфейс контактных данных покупателя
export interface IContactForm {
  email: string; // Email пользователя
  phone: string; // Телефон пользователя
}

// Интерфейс данных заказа (расширяет формы доставки и контактов)
export interface IOrder extends IDeliveryForm, IContactForm {
  total: number; // Итоговая сумма заказа
  items: string[]; // Список ID товаров в заказе
}

// Интерфейс ответа сервера на заказ
export interface IOrderResult {
  id: string; // Уникальный ID заказа
  total: number; // Итоговая сумма заказа
}

// Тип данных ошибок формы, где ключ — поле формы, а значение — текст ошибки
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс данных для карточки товара
export interface ICard extends IProduct {
  index?: string; // Опциональный индекс карточки
  buttonTitle?: string; // Текст кнопки
}

// Интерфейс для отображения корзины
export interface IBasketView {
  items: HTMLElement[]; // Массив элементов товаров
  total: number; // Итоговая сумма корзины
}

// Интерфейс данных главной страницы
export interface IPage {
  counter: number; // Количество товаров в каталоге
  catalog: HTMLElement[]; // Массив HTML-элементов каталога
}

// Интерфейс данных для отображения успешного заказа
export interface ISuccess {
  total: number; // Итоговая сумма заказа
}

// Интерфейс действий, передаваемых в конструктор компонентов
export interface IActions {
  onClick: (event: MouseEvent) => void; // Обработчик клика
}

// Интерфейс действий для успешного заказа
export interface ISuccessActions {
  onClick: () => void; // Обработчик клика
}
