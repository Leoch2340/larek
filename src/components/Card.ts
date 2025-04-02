/* 
Класс Card

Класс предназначенный для отображения и управления карточками товара(в каталоге, на 
превью и в корзине), а так-же обработку событий пользователя. Реализует интерфейс IProduct. 
Наследуется от Component<ICard>
*/ 

// Импортируем базовый компонент
import { Component } from "./base/Component";

// Импортируем интерфейсы для карточки и действий
import { ICard, IActions } from "../types";

// Импортируем вспомогательную функцию для поиска элементов
import { ensureElement } from "../utils/utils";

// Импортируем объект с классами категорий
import { categoryClasses } from "../utils/constants";

// Определяем класс карточки товара, наследуемый от Component
export class Card extends Component<ICard> {
  // Заголовок карточки
  protected _title: HTMLElement;

  // Цена товара
  protected _price: HTMLElement;

  // Изображение товара
  protected _image?: HTMLImageElement;

  // Описание товара
  protected _description?: HTMLElement;

  // Кнопка добавления в корзину
  protected _button?: HTMLButtonElement;

  // Категория товара
  protected _category?: HTMLElement;

  // Индекс товара (например, в корзине)
  protected _index?: HTMLElement;

  // Текст на кнопке
  protected _buttonTitle: string;

  // Конструктор принимает контейнер карточки и объект действий (обработчиков событий)
  constructor(container: HTMLElement, actions?: IActions) {
    // Вызываем конструктор родительского класса
    super(container);

    // Находим заголовок карточки
    this._title = ensureElement<HTMLElement>('.card__title', container);

    // Находим цену товара
    this._price = ensureElement<HTMLElement>('.card__price', container);

    // Находим изображение товара
    this._image = container.querySelector('.card__image');

    // Находим кнопку добавления в корзину
    this._button = container.querySelector('.card__button');

    // Находим описание товара
    this._description = container.querySelector('.card__text');

    // Находим элемент категории товара
    this._category = container.querySelector('.card__category');

    // Находим индекс товара (например, его позицию в корзине)
    this._index = container.querySelector('.basket__item-index');

    // Если передан обработчик клика
    if (actions?.onClick) {
      // Если есть кнопка, вешаем обработчик на неё
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        // Иначе вешаем обработчик клика на всю карточку
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  // Метод для отключения кнопки, если у товара нет цены
  disablePriceButton(value: number | null) {
    if (!value) {
      if (this._button) {
        this._button.disabled = true;
      }
    }
  }

  // Сеттер и геттер для ID товара
  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  // Сеттер и геттер для заголовка товара
  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  // Сеттер и геттер для цены товара
  set price(value: number | null) {
    this.setText(this._price, value ? `${value.toString()} синапсов` : '');
    this.disablePriceButton(value);
  }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  // Сеттер и геттер для категории товара
  set category(value: string) {
    this.setText(this._category, value);
    this._category.classList.add(categoryClasses[value]); // Добавляем класс в зависимости от категории
  }

  get category(): string {
    return this._category.textContent || '';
  }

  // Сеттер и геттер для индекса товара
  set index(value: string) {
    this._index.textContent = value;
  }

  get index(): string {
    return this._index.textContent || '';
  }

  // Сеттер для изображения товара
  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  // Сеттер для описания товара
  set description(value: string) {
    this.setText(this._description, value);
  }

  // Сеттер для текста на кнопке
  set buttonTitle(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }
}
