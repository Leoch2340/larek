/* 
Класс Basket
Класс для отображения и управления компонентом корзины покупок. 
Обеспечивает отображение товаров, управление их выбором и общей стоимостью.
*/ 

// Импортируем базовый компонент
import { Component } from "./base/Component";

// Импортируем вспомогательные функции
import { createElement, ensureElement } from "./../utils/utils";

// Импортируем интерфейс представления корзины
import { IBasketView } from "../types";

// Импортируем класс EventEmitter для управления событиями
import { EventEmitter } from "./base/events";

// Определяем класс корзины, наследуемый от Component
export class Basket extends Component<IBasketView> {
    // Элемент списка товаров в корзине
    protected _list: HTMLElement;

    // Элемент для отображения общей суммы
    protected _total: HTMLElement;

    // Кнопка оформления заказа
    protected _button: HTMLButtonElement;

    // Конструктор класса, принимает контейнер и объект событий
    constructor(container: HTMLElement, protected events: EventEmitter) {
        // Вызываем конструктор родительского класса
        super(container);

        // Находим элемент списка товаров внутри контейнера
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);

        // Находим элемент для отображения суммы
        this._total = this.container.querySelector('.basket__price');

        // Находим кнопку оформления заказа
        this._button = this.container.querySelector('.basket__button');

        // Добавляем обработчик клика на кнопку оформления заказа
        if (this._button) {
            this._button.addEventListener('click', () => {
                // При клике вызываем событие открытия заказа
                events.emit('order:open');
            });
        }

        // Инициализируем список товаров пустым массивом
        this.items = [];

        // Отключаем кнопку оформления заказа по умолчанию
        this._button.disabled = true;
    }

    // Метод для включения/отключения кнопки
    toggleButton(isDisabled: boolean) {
        this._button.disabled = isDisabled;
    }

    // Сеттер для списка товаров в корзине
    set items(items: HTMLElement[]) {
        // Если в корзине есть товары
        if (items.length) {
            // Заменяем содержимое списка на переданные элементы
            this._list.replaceChildren(...items);
        } else {
            // Если товаров нет, отображаем сообщение "Корзина пуста"
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    // Сеттер для отображения общей суммы товаров в корзине
    set total(total: number) {
        // Устанавливаем текстовое содержимое элемента с суммой
        this.setText(this._total, `${total.toString()} синапсов`);
    }
}
