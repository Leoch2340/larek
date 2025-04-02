/* 
Класс Product

Класс предназначен для создания и упрвления данными продукта. Обеспечивает представление 
информации о продукте, которое может быть использовано для отображения или для обработки 
в бизнес-логике. Наследуется от Model<IProduct>.

constructor() наследуется от Model
*/ 

/* 
Класс AppData
Класс предстваляющий состояние приложения, включая данные каталога, предпросмотра, 
корзины, заказа и ошибок формы. Наследуется от Model<IAppState>.
*/ 

// Импортируем базовую модель
import { Model } from "./base/Model";

// Импортируем интерфейсы, описывающие данные
import { IProduct, IOrder, IDeliveryForm, IAppState, FormErrors, IContactForm } from "../types";

// Определяем тип события при изменении каталога
export type CatalogChangeEvent = {
  catalog: Product[]; // Каталог продуктов
};

// Класс Product представляет товар в каталоге и наследуется от Model
export class Product extends Model<IProduct> {
    // Идентификатор товара
    id: string;

    // Название товара
    title: string;

    // Цена товара, может быть null
    price: number | null;

    // Описание товара
    description: string;

    // Категория товара
    category: string;

    // Ссылка на изображение товара
    image: string;
}

// Класс AppState отвечает за состояние приложения
export class AppState extends Model<IAppState> {
  // Каталог товаров
  catalog: Product[];

  // Корзина товаров
  basket: Product[] = [];

  // Заказ пользователя
  order: IOrder = {
    payment: 'online', // Способ оплаты по умолчанию
    address: '',
    email: '',
    phone: '',
    total: 0, // Общая сумма заказа
    items: [] // Список товаров в заказе
  };

  // Идентификатор товара для предпросмотра
  preview: string | null;

  // Ошибки валидации форм
  formErrors: FormErrors = {};

  // Очистка корзины
  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  // Очистка заказа
  clearOrder() {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  // Установка каталога товаров
  setCatalog(items: IProduct[]) {
    // Преобразуем массив товаров в массив объектов Product
    this.catalog = items.map(item => new Product(item, this.events));

    // Генерируем событие изменения каталога
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // Установка предпросмотра товара
  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  // Добавление товара в корзину
  addToBasket(item: Product) {
    if (this.basket.indexOf(item) < 0) {
      this.basket.push(item);
      this.updateBasket();
    }
  }

  // Удаление товара из корзины
  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it !== item);
    this.updateBasket();
  }

  // Обновление состояния корзины и генерация событий
  updateBasket() {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  // Установка поля доставки
  setDeliveryField(field: keyof IDeliveryForm, value: string) {
    this.order[field] = value;

    // Если форма валидна, отправляем событие
    if (this.validateDelivery()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  // Установка контактного поля заказа
  setContactField(field: keyof IContactForm, value: string) {
    this.order[field] = value;

    // Если форма валидна, отправляем событие
    if (this.validateContact()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  // Валидация формы доставки
  validateDelivery() {
    // Создаем объект ошибок
    const errors: typeof this.formErrors = {};

    // Проверяем наличие адреса
    if (!this.order.address) {
      errors.address = "Необходимо указать адрес";
    }

    // Обновляем ошибки
    this.formErrors = errors;

    // Генерируем событие изменения ошибок формы
    this.events.emit('formErrors:change', this.formErrors);

    // Возвращаем true, если ошибок нет
    return Object.keys(errors).length === 0;
  }

  // Валидация контактных данных
  validateContact() {
    // Создаем объект ошибок
    const errors: typeof this.formErrors = {};

    // Проверяем наличие email
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }

    // Проверяем наличие телефона
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    // Обновляем ошибки
    this.formErrors = errors;

    // Генерируем событие изменения ошибок формы
    this.events.emit('formErrors:change', this.formErrors);

    // Возвращаем true, если ошибок нет
    return Object.keys(errors).length === 0;
  }
}
