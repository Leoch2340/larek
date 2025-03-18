// Импортируем базовый класс Component
import {Component} from "./base/Component";

// Импортируем интерфейс событий
import { IEvents } from "../types";

// Импортируем утилиту для поиска элементов
import {ensureElement} from "../utils/utils";

// Импортируем интерфейс страницы
import { IPage } from "../types";

// Определяем класс Page, наследующийся от Component с типом IPage
export class Page extends Component<IPage> {
  // Поля для хранения ссылок на элементы страницы
  protected _counter: HTMLElement; // Счетчик товаров в корзине
  protected _catalog: HTMLElement; // Галерея товаров
  protected _wrapper: HTMLElement; // Основная обертка страницы
  protected _basket: HTMLElement; // Кнопка корзины

  // Конструктор принимает контейнер страницы и объект событий
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // Вызываем конструктор родительского класса

    // Находим элементы страницы и сохраняем ссылки на них
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    // Добавляем обработчик клика на кнопку корзины
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open'); // Генерируем событие "basket:open"
    });
  }

  // Сеттер для обновления счетчика товаров в корзине
  set counter(value: number) {
    this.setText(this._counter, String(value)); // Устанавливаем текст счетчика
  }

  // Сеттер для обновления списка товаров в каталоге
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items); // Заменяем содержимое каталога новыми элементами
  }

  // Сеттер для блокировки/разблокировки страницы
  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked'); // Добавляем класс блокировки
    } else {
        this._wrapper.classList.remove('page__wrapper_locked'); // Удаляем класс блокировки
    }
  }
}
