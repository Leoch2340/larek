/* 
Этот код определяет класс Form<T>. 
Класс для создания и управления формами. Он обеспечивает обработку событий ввода и 
отправки, так же управляет состоянием валидности и отображения формы. 
Наследуется от Component<IFormState>.

*/ 

// Импортируем базовый класс компонента
import { Component } from "../base/Component";

// Импортируем интерфейс для работы с событиями
import { IEvents } from "../../types";

// Импортируем утилиту для безопасного получения элементов DOM
import { ensureElement } from "../../utils/utils";

// Импортируем интерфейс состояния формы
import { IFormState } from "../../types";

// Определяем класс Form, который наследуется от Component
export class Form<T> extends Component<IFormState> {
    // Приватное поле для кнопки отправки формы
    protected _submit: HTMLButtonElement;

    // Приватное поле для блока с ошибками
    protected _errors: HTMLElement;

    // Конструктор принимает контейнер формы и объект событий
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        // Вызываем конструктор родительского класса
        super(container);

        // Получаем кнопку отправки формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

        // Получаем элемент для отображения ошибок
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Добавляем обработчик ввода в поля формы
        this.container.addEventListener('input', (e: Event) => {
            // Приводим цель события к HTMLInputElement
            const target = e.target as HTMLInputElement;

            // Получаем имя поля формы
            const field = target.name as keyof T;

            // Получаем значение поля
            const value = target.value;

            // Вызываем обработчик изменений
            this.onInputChange(field, value);
        });

        // Добавляем обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            // Отменяем стандартное поведение формы
            e.preventDefault();

            // Вызываем событие отправки формы
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Метод обработки изменений в полях формы
    protected onInputChange(field: keyof T, value: string) {
        // Вызываем событие изменения конкретного поля
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Сеттер для установки состояния валидности формы
    set valid(value: boolean) {
        // Делаем кнопку отправки неактивной, если форма невалидна
        this._submit.disabled = !value;
    }

    // Сеттер для отображения ошибок
    set errors(value: string) {
        // Устанавливаем текст ошибки в соответствующий элемент
        this.setText(this._errors, value);
    }

    // Метод рендера формы с обновлением состояния
    render(state: Partial<T> & IFormState) {
        // Деструктурируем состояние формы (валидность, ошибки и остальные поля)
        const { valid, errors, ...inputs } = state;

        // Вызываем родительский метод render
        super.render({ valid, errors });

        // Обновляем свойства формы
        Object.assign(this, inputs);

        // Возвращаем контейнер формы
        return this.container;
    }
}
