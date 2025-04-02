/* 
Этот код определяет класс Modal. Класс для создания и управления модальными окнами. 
Позволяет открывать и закрывать модальное окно, а так же управлять его содержимым. 
Наследуется от Component<IModalData>.
*/

// Импортируем базовый класс компонента
import { Component } from "../base/Component";

// Импортируем утилиту для безопасного получения элементов DOM
import { ensureElement } from "../../utils/utils";

// Импортируем интерфейс для работы с событиями
import { IEvents } from "../../types";

// Импортируем интерфейс данных для модального окна
import { IModalData } from "../../types";

// Определяем класс Modal, который наследуется от Component
export class Modal extends Component<IModalData> {
    // Приватное поле для кнопки закрытия модального окна
    protected _closeButton: HTMLButtonElement;

    // Приватное поле для содержимого модального окна
    protected _content: HTMLElement;

    // Конструктор принимает контейнер модального окна и объект событий
    constructor(container: HTMLElement, protected events: IEvents) {
        // Вызываем конструктор родительского класса
        super(container);

        // Получаем кнопку закрытия модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        // Получаем контейнер для содержимого модального окна
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавляем обработчик клика по кнопке закрытия
        this._closeButton.addEventListener('click', this.close.bind(this));

        // Добавляем обработчик клика по самому модальному окну (чтобы закрывать при клике вне контента)
        this.container.addEventListener('mousedown', this.close.bind(this));

        // Останавливаем всплытие события клика внутри контента, чтобы не закрывать модальное окно при клике внутри него
        this._content.addEventListener('mousedown', (event) => event.stopPropagation());
    }

    // Сеттер для обновления содержимого модального окна
    set content(value: HTMLElement) {
        // Очищаем содержимое и вставляем новый элемент
        this._content.replaceChildren(value);
    }

    // Метод для открытия модального окна
    open() {
        // Добавляем класс, активирующий модальное окно
        this.container.classList.add('modal_active');

        // Вызываем событие открытия модального окна
        this.events.emit('modal:open');
    }

    // Метод для закрытия модального окна
    close() {
        // Убираем класс, деактивирующий модальное окно
        this.container.classList.remove('modal_active');

        // Очищаем содержимое модального окна
        this.content = null;

        // Вызываем событие закрытия модального окна
        this.events.emit('modal:close');
    }

    // Метод рендера модального окна
    render(data: IModalData): HTMLElement {
        // Вызываем родительский метод render
        super.render(data);

        // Открываем модальное окно после рендера
        this.open();

        // Возвращаем контейнер модального окна
        return this.container;
    }
}
