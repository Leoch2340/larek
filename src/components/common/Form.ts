/* Валидация*/

// Импорт базового класса Component из файла "../base/Component"
import { Component } from "../base/Component";

// Импорт интерфейса событий IEvents из "../../types"
import { IEvents } from "../../types";

// Импорт утилиты ensureElement для безопасного получения DOM-элементов
import { ensureElement } from "../../utils/utils";

// Импорт интерфейса состояния формы IFormState
import { IFormState } from "../../types";

// Объявление класса Form с generic-параметром T, наследующегося от Component<IFormState>
export class Form<T> extends Component<IFormState> {
    // Защищенное поле для хранения кнопки отправки формы
    protected _submit: HTMLButtonElement;

    // Защищенное поле для элемента отображения ошибок
    protected _errors: HTMLElement;

    // Опциональное поле для input email (может быть undefined)
    protected _emailInput?: HTMLInputElement;

    // Опциональное поле для input телефона (может быть undefined)
    protected _phoneInput?: HTMLInputElement;

    // Флаг валидности формы, по умолчанию false
    protected _isFormValid: boolean = false;

    // Конструктор класса, принимающий контейнер формы и объект событий
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        // Вызов конструктора родительского класса
        super(container);

        // Инициализация кнопки отправки формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

        // Инициализация элемента для отображения ошибок
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        
        // Поиск поля email в форме
        this._emailInput = this.container.querySelector('input[name="email"]');

        // Поиск поля телефона в форме
        this._phoneInput = this.container.querySelector('input[name="phone"]');

        // Добавление обработчика события input (ввод данных)
        this.container.addEventListener('input', (e: Event) => {
            // Приведение цели события к HTMLInputElement
            const target = e.target as HTMLInputElement;

            // Получение имени поля как ключа generic-типа T
            const field = target.name as keyof T;

            // Получение значения поля
            const value = target.value;
            
            // Вызов обработчика изменения поля
            this.onInputChange(field, value);

            // Валидация формы при изменении
            this.validateForm();
        });

        // Добавление обработчика события submit (отправка формы)
        this.container.addEventListener('submit', (e: Event) => {
            // Отмена стандартного поведения формы
            e.preventDefault();
            
            // Принудительная валидация перед отправкой
            this.validateForm(true);
            
            // Если форма валидна - эмитим событие submit
            if (this._isFormValid) {
                this.events.emit(`${this.container.name}:submit`);
            }
        });
    }

    // Метод валидации email
    protected validateEmail(email: string): boolean {
        // Регулярное выражение для проверки email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Проверка соответствия строки регулярному выражению
        return re.test(email);
    }

    // Метод валидации телефона
    protected validatePhone(phone: string): boolean {
        // Удаление всех нецифровых символов
        const cleaned = phone.replace(/\D/g, '');

        // Проверка что осталось минимум 10 цифр
        return cleaned.length >= 10;
    }

    // Основной метод валидации формы
    protected validateForm(forceValidation: boolean = false): void {
        // Флаг общей валидности
        let isValid = true;

        // Сообщение об ошибке
        let errorMessage = '';

        // Флаг валидности email
        let emailValid = true;

        // Флаг валидности телефона
        let phoneValid = true;

        // Валидация email, если поле существует
        if (this._emailInput) {
            // Получение и очистка значения email
            const email = this._emailInput.value.trim();
            
            // Проверка на пустое значение
            if (!email) {
                // Если включена принудительная валидация
                if (forceValidation) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите email';
                    // Добавление класса ошибки
                    this._emailInput.classList.add('form__input_error');
                }
                emailValid = false;
            } else if (!this.validateEmail(email)) {
                // Если email не прошел валидацию
                isValid = false;
                errorMessage = 'Пожалуйста, введите корректный email';
                this._emailInput.classList.add('form__input_error');
                emailValid = false;
            } else {
                // Успешная валидация - удаление класса ошибки
                this._emailInput.classList.remove('form__input_error');
                emailValid = true;
            }
        }

        // Валидация телефона, если поле существует
        if (this._phoneInput) {
            // Получение и очистка значения телефона
            const phone = this._phoneInput.value.trim();
            
            // Проверка на пустое значение
            if (!phone) {
                if (forceValidation) {
                    isValid = false;
                    // Формирование составного сообщения об ошибке
                    errorMessage = errorMessage 
                        ? `${errorMessage} и номер телефона` 
                        : 'Пожалуйста, введите номер телефона';
                    this._phoneInput.classList.add('form__input_error');
                }
                phoneValid = false;
            } else if (!this.validatePhone(phone)) {
                // Если телефон не прошел валидацию
                isValid = false;
                errorMessage = errorMessage 
                    ? `${errorMessage}` 
                    : 'Пожалуйста, введите корректный номер телефона';
                this._phoneInput.classList.add('form__input_error');
                phoneValid = false;
            } else {
                // Успешная валидация - удаление класса ошибки
                this._phoneInput.classList.remove('form__input_error');
                phoneValid = true;
            }
        }

        // Обновление состояния валидности формы
        this._isFormValid = isValid && emailValid && phoneValid;

        // Установка свойства valid
        this.valid = this._isFormValid;

        // Установка сообщения об ошибке
        this.errors = errorMessage;
    }

    // Метод обработки изменения поля формы
    protected onInputChange(field: keyof T, value: string) {
        // Генерация события изменения поля
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Сеттер для свойства valid
    set valid(value: boolean) {
        // Установка состояния disabled кнопки отправки
        this._submit.disabled = !value;
    }

    // Сеттер для сообщений об ошибках
    set errors(value: string) {
        // Установка текста ошибки в элемент
        this.setText(this._errors, value);
    }

    // Метод рендеринга формы
    render(state: Partial<T> & IFormState) {
        // Деструктуризация состояния формы
        const { valid, errors, ...inputs } = state;

        // Вызов родительского метода render
        super.render({ valid, errors });

        // Копирование свойств из inputs в текущий объект
        Object.assign(this, inputs);
        
        // Валидация формы при рендере
        this.validateForm();
        
        // Возврат контейнера формы
        return this.container;
    }
}